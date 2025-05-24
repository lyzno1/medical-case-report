// API 工具函数
export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i === maxRetries) {
        throw lastError
      }

      // 指数退避
      const delay = baseDelay * Math.pow(2, i)
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms delay`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

export function isCozeApiError(error: any): boolean {
  return error?.response?.status >= 400 && error?.response?.status < 500
}

export function getErrorMessage(error: any): string {
  if (error?.response?.data?.msg) {
    return error.response.data.msg
  }

  if (error?.message) {
    return error.message
  }

  return "发生未知错误"
}
