// 简单的日志记录工具
export class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === "development"

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  info(message: string, data?: any) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || "")
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || "")
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || "")
    }
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || "")
  }
}

export const logger = Logger.getInstance()
