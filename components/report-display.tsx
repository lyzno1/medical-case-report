"use client"

import { Button } from "@/components/ui/button"
import { Download, RotateCcw, FileText, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { useState } from "react"

type ReportDisplayProps = {
  reportData: {
    text: string
    docUrl: string
  }
  onRestart: () => void
}

export function ReportDisplay({ reportData, onRestart }: ReportDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    window.open(reportData.docUrl, "_blank")
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportData.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* 成功标头 */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">报告生成成功！</h1>
          <p className="text-gray-600">你的病例报告已经成功生成，可以查看、复制或下载</p>
        </div>
      </div>

      {/* 报告内容区域 */}
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* 报告头部 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">病例报告</h2>
                <p className="text-sm text-gray-500">基于音频分析生成</p>
              </div>
            </div>
            <Button
              onClick={handleCopyToClipboard}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  复制全文
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 报告正文 */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div 
                className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans"
                style={{ 
                  fontSize: '15px',
                  lineHeight: '1.7',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              >
                {reportData.text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮组 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={handleDownload}
          size="lg"
          className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Download className="w-5 h-5 mr-2" />
          下载 Word 文档
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
        
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 font-semibold transition-all duration-200 hover:bg-gray-50"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          重新开始
        </Button>
      </div>

      {/* 底部提示 */}
      <div className="text-center space-y-2 text-sm text-gray-500">
        <p>报告已成功生成并可供下载，请及时保存您的报告</p>
        <p className="text-xs">提示：下载链接在一定时间后可能失效，请尽快下载</p>
      </div>
    </div>
  )
}
