import { type NextRequest, NextResponse } from "next/server"
import { CozeClient } from "@/lib/coze-client"
import { config, validateConfig } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    validateConfig()
    
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "未提供音频文件" }, { status: 400 })
    }

    // 初始化 Coze 客户端
    const cozeClient = new CozeClient(config.coze.apiKey, config.coze.botId, config.coze.spaceId)

    try {
      // 上传音频文件到 Coze
      const fileId = await cozeClient.uploadFile(audioFile)
      console.log("Audio file uploaded, File ID:", fileId)

      // 简单返回文件信息，因为当前CozeClient不支持对话功能
      return NextResponse.json({
        text: `音频文件已上传: ${audioFile.name} (${(audioFile.size / 1024).toFixed(2)} KB)`,
        fileId: fileId,
      })
    } catch (error) {
      console.error("Coze file upload error:", error)
      // 如果 Coze 上传失败，返回基本信息
      return NextResponse.json({
        text: `音频文件: ${audioFile.name} (${(audioFile.size / 1024).toFixed(2)} KB)`,
        error: error instanceof Error ? error.message : "上传失败",
      })
    }
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return NextResponse.json(
      {
        error: "转录音频失败",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
