"use client"

import { useState } from "react"
import { UploadInterface } from "@/components/upload-interface"
import { ReportDisplay } from "@/components/report-display"

type ReportData = {
  text: string
  docUrl: string
}

export function ReportGenerator() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async (fileId: string, fileName: string) => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/run-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, fileName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "生成报告失败")
      }

      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Error generating report:", error)
      alert(`生成报告时出现错误: ${error instanceof Error ? error.message : "未知错误"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRestart = () => {
    setReportData(null)
  }

  if (reportData) {
    return <ReportDisplay reportData={reportData} onRestart={handleRestart} />
  }

  return <UploadInterface onGenerateReport={handleGenerateReport} isGenerating={isGenerating} />
}
