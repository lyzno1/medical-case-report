import { config } from "./config"

export function debugCozeConfig() {
  console.log("=== Coze 配置调试信息 ===")
  console.log("API Key:", config.coze.apiKey ? `${config.coze.apiKey.substring(0, 10)}...` : "未设置")
  console.log("Bot ID:", config.coze.botId)
  console.log("Space ID:", config.coze.spaceId)
  console.log("Workflow ID:", config.coze.workflowId)
  console.log("Base URL:", config.coze.baseUrl)
  console.log("工作流参数配置:", config.workflowParams)
  console.log("========================")
}

export function validateFileTypes(file: File, allowedTypes: string[]): boolean {
  const fileExtension = file.name.split(".").pop()?.toLowerCase()
  return allowedTypes.includes(fileExtension || "")
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function logCozeRequest(type: string, data: any) {
  console.log(`[Coze ${type}]`, {
    timestamp: new Date().toISOString(),
    ...data,
  })
}

export function logCozeResponse(type: string, response: any) {
  console.log(`[Coze ${type} Response]`, {
    timestamp: new Date().toISOString(),
    code: response.code,
    msg: response.msg,
    hasData: !!response.data,
  })
}
