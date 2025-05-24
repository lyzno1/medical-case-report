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
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateReport = async (docxFile: File | null, mp3File: File | null) => {
    setIsLoading(true)

    try {
      // 处理文件上传和报告生成
      const formData = new FormData()
      if (docxFile) formData.append("docx", docxFile)
      if (mp3File) formData.append("mp3", mp3File)

      const response = await fetch("/api/generate-report", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("生成报告失败")

      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Error generating report:", error)
      alert("生成报告时出现错误，请稍后再试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    setReportData(null)
  }

  if (reportData) {
    return <ReportDisplay reportData={reportData} onRestart={handleRestart} />
  }

  return <UploadInterface onGenerateReport={handleGenerateReport} isLoading={isLoading} />
}
