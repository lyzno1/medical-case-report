"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Upload, Loader2, X } from "lucide-react"

type UploadInterfaceProps = {
  onGenerateReport: (fileId: string, fileName: string) => void
  isUploading: boolean
  isGenerating: boolean
}

export function UploadInterface({ onGenerateReport, isUploading, isGenerating }: UploadInterfaceProps) {
  const [mp3File, setMp3File] = useState<File | null>(null)
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const mp3InputRef = useRef<HTMLInputElement>(null)

  const handleMp3Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setMp3File(file)
  }

  const handleUpload = async () => {
    if (!mp3File) {
      alert("请上传音频文件")
      return
    }

    // 文件大小检查
    if (mp3File.size > 50 * 1024 * 1024) {
      alert("音频文件大小不能超过 50MB")
      return
    }

    try {
      const formData = new FormData()
      formData.append("mp3", mp3File)

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "文件上传失败")
      }

      const data = await response.json()
      setUploadedFileId(data.fileId)
      setUploadedFileName(data.fileName)
      alert("文件上传成功！")
    } catch (error) {
      console.error("文件上传失败:", error)
      alert(`文件上传失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedFileId || !uploadedFileName) {
      alert("请先上传文件")
      return
    }

    try {
      await onGenerateReport(uploadedFileId, uploadedFileName)
    } catch (error) {
      console.error("生成报告失败:", error)
      alert("生成报告失败，请稍后重试")
    }
  }

  const removeMp3File = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMp3File(null)
    setUploadedFileId(null)
    setUploadedFileName(null)
    if (mp3InputRef.current) mp3InputRef.current.value = ""
  }

  return (
    <div className="flex flex-col items-center space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* 上传卡片容器 */}
      <div className="w-full max-w-md">
        {/* MP3 上传卡片 */}
        <Card
          className="hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 sm:active:scale-98"
          onClick={() => mp3InputRef.current?.click()}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <CardTitle className="text-base sm:text-lg">上传录音文件</CardTitle>
          </CardHeader>
          <CardContent className="text-center px-4 sm:px-6">
            <p className="text-sm sm:text-base text-gray-600 mb-4">上传MP3格式的录音文件</p>
            {mp3File ? (
              <div className={`border rounded-lg p-3 relative ${
                uploadedFileId ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
              }`}>
                <button
                  onClick={removeMp3File}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
                <p className={`font-medium text-sm ${
                  uploadedFileId ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {uploadedFileId ? '已上传文件:' : '已选择文件:'}
                </p>
                <p className={`text-xs sm:text-sm break-all pr-8 ${
                  uploadedFileId ? 'text-blue-600' : 'text-green-600'
                }`}>{mp3File.name}</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">点击选择MP3文件</p>
              </div>
            )}
            <input
              ref={mp3InputRef}
              type="file"
              accept=".mp3,.wav,.m4a"
              onChange={handleMp3Upload}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* 按钮组 */}
      <div className="flex flex-col space-y-3 w-full max-w-md">
        {/* 上传文件按钮 */}
        <Button
          onClick={handleUpload}
          disabled={isUploading || !mp3File || !!uploadedFileId}
          size="lg"
          variant={uploadedFileId ? "secondary" : "default"}
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold active:scale-95 transition-transform"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              正在上传...
            </>
          ) : uploadedFileId ? (
            "文件已上传"
          ) : (
            "上传文件"
          )}
        </Button>

        {/* 生成报告按钮 */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedFileId}
          size="lg"
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold active:scale-95 transition-transform"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              正在生成报告...
            </>
          ) : (
            "开始生成报告"
          )}
        </Button>
      </div>

      {/* 文件状态提示 */}
      <div className="text-center text-xs sm:text-sm text-gray-500 max-w-md px-4">
        <p className="mb-1">首先上传音频文件，然后点击开始生成报告</p>
        <p>支持格式：MP3/WAV/M4A音频文件</p>
      </div>
    </div>
  )
}
