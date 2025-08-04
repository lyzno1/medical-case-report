import { type NextRequest, NextResponse } from "next/server"
import { CozeClient } from "@/lib/coze-client"
import { config, validateConfig } from "@/lib/config"
import { debugCozeConfig, validateFileTypes, formatFileSize } from "@/lib/debug-utils"

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    validateConfig()
    debugCozeConfig()

    const formData = await request.formData()
    const mp3File = formData.get("mp3") as File | null

    if (!mp3File) {
      return NextResponse.json({ error: "请上传音频文件" }, { status: 400 })
    }

    // 验证文件类型和大小
    if (!validateFileTypes(mp3File, ["mp3", "wav", "m4a"])) {
      return NextResponse.json({ error: "音频文件格式不正确，请上传 .mp3、.wav 或 .m4a 文件" }, { status: 400 })
    }
    if (mp3File.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "音频文件大小不能超过 50MB" }, { status: 400 })
    }

    console.log("开始处理文件:", {
      mp3: `${mp3File.name} (${formatFileSize(mp3File.size)})`,
    })

    // 初始化 Coze 客户端
    const cozeClient = new CozeClient(config.coze.apiKey, config.coze.botId, config.coze.spaceId)

    // 上传 MP3 文件
    try {
      console.log(`开始上传 MP3 文件: ${mp3File.name}`)
      const mp3FileId = await cozeClient.withRetry(() => cozeClient.uploadFile(mp3File))
      console.log(`MP3 文件上传成功, File ID: ${mp3FileId}`)

      return NextResponse.json({
        success: true,
        fileId: mp3FileId,
        fileName: mp3File.name,
        fileSize: formatFileSize(mp3File.size),
      })
    } catch (error) {
      console.error("MP3 文件上传失败:", error)
      return NextResponse.json(
        {
          error: `MP3 文件上传失败: ${error instanceof Error ? error.message : "未知错误"}`,
          details: "请检查文件格式是否正确，或稍后重试",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("上传文件时发生错误:", error)

    return NextResponse.json(
      {
        error: "上传文件时发生内部错误",
        details: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
        suggestion: "请稍后重试，如果问题持续存在，请联系技术支持",
      },
      { status: 500 },
    )
  }
}