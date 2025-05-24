// Coze API 错误处理
export class CozeApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "CozeApiError"
  }
}

export function handleCozeError(error: any): CozeApiError {
  if (error instanceof CozeApiError) {
    return error
  }

  if (error?.response) {
    // HTTP 错误
    const status = error.response.status
    const data = error.response.data

    if (status === 401) {
      return new CozeApiError("Coze API 认证失败，请检查 API Key", 401, data)
    } else if (status === 403) {
      return new CozeApiError("Coze API 权限不足，请检查 Bot ID 和权限", 403, data)
    } else if (status === 404) {
      return new CozeApiError("Coze API 资源未找到，请检查 Bot ID 和 Workflow ID", 404, data)
    } else if (status === 429) {
      return new CozeApiError("Coze API 请求频率限制，请稍后重试", 429, data)
    } else if (status >= 500) {
      return new CozeApiError("Coze API 服务器错误，请稍后重试", status, data)
    }

    return new CozeApiError(`Coze API 错误: ${status}`, status, data)
  }

  if (error?.message) {
    return new CozeApiError(error.message, undefined, error)
  }

  return new CozeApiError("未知的 Coze API 错误", undefined, error)
}
