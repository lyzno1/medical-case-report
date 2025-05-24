"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, RotateCcw, FileText } from "lucide-react"

type ReportDisplayProps = {
  reportData: {
    text: string
    docUrl: string
  }
  onRestart: () => void
}

export function ReportDisplay({ reportData, onRestart }: ReportDisplayProps) {
  const handleDownload = () => {
    window.open(reportData.docUrl, "_blank")
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* 报告内容卡片 */}
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b pb-4 sm:pb-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl text-gray-800">生成的病例报告</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 border overflow-x-auto">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm lg:text-base text-gray-800 font-sans leading-relaxed overflow-x-auto">
                {reportData.text}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center">
        <Button
          onClick={handleDownload}
          size="lg"
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base active:scale-95 transition-transform"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          下载病例报告
        </Button>

        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          重新开始
        </Button>
      </div>

      {/* 提示信息 */}
      <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
        <p>报告已生成完成，您可以下载Word文档或重新开始生成新的报告</p>
      </div>
    </div>
  )
}
