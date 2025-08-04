import { type NextRequest, NextResponse } from "next/server"
import { CozeClient } from "@/lib/coze-client"
import { config, validateConfig } from "@/lib/config"
import { debugCozeConfig } from "@/lib/debug-utils"

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    validateConfig()
    debugCozeConfig()

    const { fileId, fileName } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: "请提供文件ID" }, { status: 400 })
    }

    console.log("开始运行工作流:", {
      fileId,
      fileName: fileName || "未知文件",
    })

    // 初始化 Coze 客户端
    const cozeClient = new CozeClient(config.coze.apiKey, config.coze.botId, config.coze.spaceId)

    // 构建工作流参数
    const workflowParameters = {
      [config.workflowParams.audioParam]: JSON.stringify({ file_id: fileId }) // Audio类型 - 音频文件
    }

    console.log("工作流参数:", {
      parameterCount: Object.keys(workflowParameters).length,
      parameters: workflowParameters,
      fileId,
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
        fileProcessed: {
          fileId,
          fileName: fileName || "未知文件",
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
    console.error("运行工作流时发生错误:", error)

    return NextResponse.json(
      {
        error: "运行工作流时发生内部错误",
        details: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
        suggestion: "请稍后重试，如果问题持续存在，请联系技术支持",
      },
      { status: 500 },
    )
  }
}