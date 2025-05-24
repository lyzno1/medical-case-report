import { type NextRequest, NextResponse } from "next/server"
import { CozeClient } from "@/lib/coze-client"
import { config, validateConfig } from "@/lib/config"
import { debugCozeConfig } from "@/lib/debug-utils"

export async function GET(request: NextRequest) {
  try {
    console.log("开始测试 Coze API 配置...")

    // 验证配置
    validateConfig()
    debugCozeConfig()

    const cozeClient = new CozeClient(config.coze.apiKey, config.coze.botId, config.coze.spaceId)

    console.log("配置验证成功，所有必需的环境变量都已设置")

    return NextResponse.json({
      status: "success",
      message: "Coze API 配置验证成功",
      config: {
        botId: config.coze.botId,
        spaceId: config.coze.spaceId,
        workflowId: config.coze.workflowId,
        baseUrl: config.coze.baseUrl,
        hasApiKey: !!config.coze.apiKey,
        apiKeyPrefix: config.coze.apiKey ? `${config.coze.apiKey.substring(0, 10)}...` : "未设置",
        workflowParams: config.workflowParams,
      },
      urls: {
        fileUpload: `${config.coze.baseUrl}/file/upload`,
        workflowRun: `${config.coze.baseUrl}/workflow/run`,
      },
      recommendations: [
        "确保您的 Coze 工作流已正确配置",
        "验证工作流参数名称与配置文件中的设置一致",
        "测试文件上传功能",
        "检查工作流的输入和输出格式",
        "确认 Space ID 权限设置正确",
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Coze API 测试失败:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Coze API 配置验证失败",
        error: error instanceof Error ? error.message : "未知错误",
        troubleshooting: [
          "检查环境变量 COZE_API_KEY 是否正确设置",
          "验证 Bot ID: 7507807163864219688 是否有效",
          "确认 Space ID: 7456006999663345718 权限",
          "检查 Workflow ID: 7507431636469776421 是否存在",
          "查看服务器日志获取详细错误信息",
        ],
        providedIds: {
          botId: "7507807163864219688",
          spaceId: "7456006999663345718",
          workflowId: "7507431636469776421",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
