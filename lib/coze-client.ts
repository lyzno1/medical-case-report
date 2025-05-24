// Coze API 客户端配置 - 基于 coze.cn
export interface CozeFileUploadResponse {
  code: number
  msg: string
  data: {
    id: string
    file_name: string
    bytes: number
    created_at: number
  }
}

export interface CozeWorkflowResponse {
  code: number
  msg: string
  data:
    | string
    | {
        output: string
        [key: string]: any
      }
  debug_url?: string
  execute_id?: string
  token?: number
  cost?: string
}

export class CozeClient {
  private apiKey: string
  private botId: string
  private spaceId: string
  private baseUrl = "https://api.coze.cn/v1"

  constructor(apiKey: string, botId: string, spaceId?: string) {
    this.apiKey = apiKey
    this.botId = botId
    this.spaceId = spaceId || ""
  }

  /**
   * 上传文件到 Coze 平台
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)

    console.log(`开始上传文件: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)

    // 使用官方文档的正确端点
    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        // Content-Type 会由浏览器自动设置为 multipart/form-data
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("文件上传失败响应:", errorText)
      throw new Error(`文件上传失败: ${response.status} ${response.statusText}`)
    }

    const result: CozeFileUploadResponse = await response.json()
    console.log("文件上传响应:", result)

    if (result.code !== 0) {
      throw new Error(`文件上传失败: ${result.msg}`)
    }

    if (!result.data?.id) {
      throw new Error("文件上传成功但未获取到 file_id")
    }

    console.log(`文件上传成功: ${file.name}, File ID: ${result.data.id}`)
    return result.data.id
  }

  /**
   * 运行工作流
   * @param workflowId 工作流ID
   * @param parameters 工作流参数
   */
  async runWorkflow(workflowId: string, parameters: Record<string, any>): Promise<string> {
    const payload: any = {
      workflow_id: workflowId,
      parameters: parameters,
    }

    // 根据官方文档，只有在需要关联智能体时才添加 bot_id
    if (this.botId) {
      payload.bot_id = this.botId
    }

    console.log("调用 Coze 工作流:", {
      workflow_id: workflowId,
      bot_id: this.botId,
      parameters: parameters, // 显示完整参数以便调试
    })

    console.log("请求URL:", `${this.baseUrl}/workflow/run`)

    const response = await fetch(`${this.baseUrl}/workflow/run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("工作流执行失败响应:", errorText)
      throw new Error(`工作流执行失败: ${response.status} ${response.statusText}`)
    }

    const result: CozeWorkflowResponse = await response.json()
    console.log("=== 工作流执行响应 ===")
    console.log("完整响应:", JSON.stringify(result, null, 2))

    if (result.code !== 0) {
      console.error("工作流执行失败，错误码:", result.code)
      console.error("错误信息:", result.msg)
      if (result.debug_url) {
        console.log("调试URL:", result.debug_url)
      }
      throw new Error(`工作流执行失败: ${result.msg}`)
    }

    console.log("工作流执行成功！")
    if (result.debug_url) {
      console.log("调试URL:", result.debug_url)
    }

    // 处理返回的数据
    let outputData = result.data
    console.log("原始data字段:", outputData)
    console.log("data字段类型:", typeof outputData)

    if (typeof result.data === "string") {
      try {
        outputData = JSON.parse(result.data)
        console.log("解析后的工作流输出:", JSON.stringify(outputData, null, 2))
      } catch (e) {
        console.log("工作流返回的data字段不是JSON，直接使用字符串:")
        console.log("返回内容:", result.data)
        return result.data
      }
    }

    // 尝试从不同可能的字段中提取输出
    if (typeof outputData === "object" && outputData !== null) {
      console.log("尝试从对象中提取输出内容...")
      
      // 常见的输出字段名
      const possibleOutputFields = ["output", "result", "content", "text", "response", "answer"]

      for (const field of possibleOutputFields) {
        if (outputData[field]) {
          console.log(`✅ 从字段 '${field}' 中提取到输出内容:`)
          console.log("提取的内容:", outputData[field])
          return outputData[field]
        }
      }

      // 如果没有找到标准字段，返回整个对象的字符串表示
      console.log("❌ 未找到标准输出字段，返回完整数据:")
      const fullData = JSON.stringify(outputData, null, 2)
      console.log("完整数据:", fullData)
      return fullData
    }

    // 如果是字符串，直接返回
    const finalResult = typeof outputData === "string" ? outputData : JSON.stringify(outputData)
    console.log("最终返回结果:", finalResult)
    return finalResult
  }

  /**
   * 重试机制包装器
   */
  async withRetry<T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
    let lastError: Error

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.error(`操作失败 (尝试 ${i + 1}/${maxRetries + 1}):`, error)

        if (i === maxRetries) {
          throw lastError
        }

        // 指数退避
        const delay = baseDelay * Math.pow(2, i)
        console.log(`${delay}ms 后重试...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}
