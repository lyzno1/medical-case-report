// 配置验证和设置
export function validateConfig() {
  const requiredEnvVars = ["COZE_API_KEY", "COZE_BOT_ID", "COZE_SPACE_ID", "COZE_WORKFLOW_ID"]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

export const config = {
  coze: {
    apiKey: process.env.COZE_API_KEY!,
    botId: process.env.COZE_BOT_ID!,
    spaceId: process.env.COZE_SPACE_ID!,
    workflowId: process.env.COZE_WORKFLOW_ID!,
    baseUrl: "https://api.coze.cn/open_api/v1",
    timeout: 60000, // 60秒超时
    maxRetries: 3,
  },
  // Coze 工作流变量配置
  workflowParams: {
    audioParam: "BLaudio", // Audio类型 - 音频文件变量名
  },
}
