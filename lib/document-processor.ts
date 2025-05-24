// 文档处理工具
export async function extractTextFromDocx(file: File): Promise<string> {
  // 这里可以使用 mammoth.js 或其他库来解析 DOCX 文件
  // 为了演示，我们返回文件信息
  return `文档文件: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
}

export async function transcribeAudio(file: File): Promise<string> {
  // 这里可以集成语音转文字服务
  // 为了演示，我们返回文件信息
  return `音频文件: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
}

export function generateDocumentBlob(content: string): Blob {
  // 创建简单的文档内容
  const docContent = `
病例报告

${content}

生成时间: ${new Date().toLocaleString("zh-CN")}
  `.trim()

  return new Blob([docContent], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
}
