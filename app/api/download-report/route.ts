import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const content = searchParams.get("content")
    const id = searchParams.get("id")

    if (!content) {
      return NextResponse.json({ error: "缺少报告内容" }, { status: 400 })
    }

    const decodedContent = decodeURIComponent(content)
    
    // 创建格式化的文档内容
    const docContent = `病例报告

${decodedContent}

生成时间: ${new Date().toLocaleString("zh-CN")}
生成ID: ${id || Date.now()}
`

    // 创建文本文件
    const textBlob = new Blob([docContent], {
      type: "text/plain; charset=utf-8",
    })

    // 设置响应头
    const headers = new Headers()
    headers.set("Content-Type", "text/plain; charset=utf-8")
    
    // 使用URL编码的文件名以支持中文字符
    const filename = `medical_report_${id || Date.now()}.txt`
    const encodedFilename = encodeURIComponent(`病例报告_${id || Date.now()}.txt`)
    headers.set("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`)
    headers.set("Content-Length", textBlob.size.toString())

    return new NextResponse(textBlob, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error downloading report:", error)
    return NextResponse.json({ error: "下载报告失败" }, { status: 500 })
  }
}
