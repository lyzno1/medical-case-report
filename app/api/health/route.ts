import { type NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV,
      services: {
        coze: {
          configured: !!(config.coze.apiKey && config.coze.botId && config.coze.workflowId),
          baseUrl: config.coze.baseUrl,
        },
      },
      uptime: process.uptime(),
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
