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
    const docxFile = formData.get("docx") as File | null
    const mp3File = formData.get("mp3") as File | null

    if (!docxFile && !mp3File) {
      return NextResponse.json({ error: "请至少上传一个文件" }, { status: 400 })
    }

    // 验证文件类型和大小
    if (docxFile) {
      if (!validateFileTypes(docxFile, ["docx", "doc"])) {
        return NextResponse.json({ error: "DOCX 文件格式不正确，请上传 .docx 或 .doc 文件" }, { status: 400 })
      }
      if (docxFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "DOCX 文件大小不能超过 10MB" }, { status: 400 })
      }
    }

    if (mp3File) {
      if (!validateFileTypes(mp3File, ["mp3", "wav", "m4a"])) {
        return NextResponse.json({ error: "音频文件格式不正确，请上传 .mp3、.wav 或 .m4a 文件" }, { status: 400 })
      }
      if (mp3File.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "音频文件大小不能超过 50MB" }, { status: 400 })
      }
    }

    console.log("开始处理文件:", {
      docx: docxFile ? `${docxFile.name} (${formatFileSize(docxFile.size)})` : null,
      mp3: mp3File ? `${mp3File.name} (${formatFileSize(mp3File.size)})` : null,
    })

    // 初始化 Coze 客户端，使用正确的参数
    const cozeClient = new CozeClient(config.coze.apiKey, config.coze.botId, config.coze.spaceId)

    let docxFileId: string | null = null
    let mp3FileId: string | null = null

    // 上传 DOCX 文件
    if (docxFile) {
      try {
        console.log(`开始上传 DOCX 文件: ${docxFile.name}`)
        docxFileId = await cozeClient.withRetry(() => cozeClient.uploadFile(docxFile))
        console.log(`DOCX 文件上传成功, File ID: ${docxFileId}`)
      } catch (error) {
        console.error("DOCX 文件上传失败:", error)
        return NextResponse.json(
          {
            error: `DOCX 文件上传失败: ${error instanceof Error ? error.message : "未知错误"}`,
            details: "请检查文件格式是否正确，或稍后重试",
          },
          { status: 500 },
        )
      }
    }

    // 上传 MP3 文件
    if (mp3File) {
      try {
        console.log(`开始上传 MP3 文件: ${mp3File.name}`)
        mp3FileId = await cozeClient.withRetry(() => cozeClient.uploadFile(mp3File))
        console.log(`MP3 文件上传成功, File ID: ${mp3FileId}`)
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
    }

    // 构建工作流参数 - 使用正确的Coze工作流变量名
    const workflowParameters: Record<string, any> = {}

    // 根据官方文档，文件类型参数需要以JSON字符串格式传递file_id
    if (mp3FileId) {
      workflowParameters[config.workflowParams.audioParam] = JSON.stringify({ file_id: mp3FileId }) // Audio类型 - 音频文件
    }

    if (docxFileId) {
      workflowParameters[config.workflowParams.docParam] = JSON.stringify({ file_id: docxFileId }) // Doc类型 - 文档文件
    }

    console.log("工作流参数:", {
      parameterCount: Object.keys(workflowParameters).length,
      parameters: workflowParameters,
      hasDocx: !!docxFileId,
      hasMp3: !!mp3FileId,
    })

    // 运行工作流生成报告
    let reportText: string
    try {
      console.log("开始运行 Coze 工作流...")
      console.log("使用的配置:", {
        botId: config.coze.botId,
        spaceId: config.coze.spaceId,
        workflowId: config.coze.workflowId,
      })

      reportText = await cozeClient.withRetry(() => cozeClient.runWorkflow(config.coze.workflowId, workflowParameters))

      console.log("工作流执行成功，报告长度:", reportText.length)

      if (!reportText || reportText.trim().length === 0) {
        throw new Error("工作流返回了空的报告内容")
      }
    } catch (error) {
      console.error("工作流执行失败:", error)
      return NextResponse.json(
        {
          error: `报告生成失败: ${error instanceof Error ? error.message : "未知错误"}`,
          details: {
            suggestion: "请检查 Coze 工作流配置是否正确，或联系技术支持",
            botId: config.coze.botId,
            spaceId: config.coze.spaceId,
            workflowId: config.coze.workflowId,
            parameters: Object.keys(workflowParameters),
          },
        },
        { status: 500 },
      )
    }

    // 生成文档下载URL
    const reportId = Date.now().toString()
    const docUrl = `/api/download-report?id=${reportId}&content=${encodeURIComponent(reportText)}`

    console.log("报告生成完成，ID:", reportId)

    return NextResponse.json({
      text: reportText,
      docUrl: docUrl,
      metadata: {
        reportId,
        generatedAt: new Date().toISOString(),
        filesProcessed: {
          docx: docxFile
            ? {
                name: docxFile.name,
                size: formatFileSize(docxFile.size),
                fileId: docxFileId,
              }
            : null,
          mp3: mp3File
            ? {
                name: mp3File.name,
                size: formatFileSize(mp3File.size),
                fileId: mp3FileId,
              }
            : null,
        },
        cozeInfo: {
          botId: config.coze.botId,
          spaceId: config.coze.spaceId,
          workflowId: config.coze.workflowId,
          parametersUsed: Object.keys(workflowParameters),
        },
      },
    })
  } catch (error) {
    console.error("生成报告时发生错误:", error)

    return NextResponse.json(
      {
        error: "生成报告时发生内部错误",
        details: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
        suggestion: "请稍后重试，如果问题持续存在，请联系技术支持",
      },
      { status: 500 },
    )
  }
}
