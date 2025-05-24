"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Mic, Upload, Loader2, X } from "lucide-react"

type UploadInterfaceProps = {
  onGenerateReport: (docxFile: File | null, mp3File: File | null) => void
  isLoading: boolean
}

export function UploadInterface({ onGenerateReport, isLoading }: UploadInterfaceProps) {
  const [docxFile, setDocxFile] = useState<File | null>(null)
  const [mp3File, setMp3File] = useState<File | null>(null)
  const docxInputRef = useRef<HTMLInputElement>(null)
  const mp3InputRef = useRef<HTMLInputElement>(null)

  const handleDocxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setDocxFile(file)
  }

  const handleMp3Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setMp3File(file)
  }

  const handleGenerate = async () => {
    if (!docxFile && !mp3File) {
      alert("请至少上传一个文件")
      return
    }

    // 文件大小检查
    if (docxFile && docxFile.size > 10 * 1024 * 1024) {
      alert("DOCX 文件大小不能超过 10MB")
      return
    }

    if (mp3File && mp3File.size > 50 * 1024 * 1024) {
      alert("音频文件大小不能超过 50MB")
      return
    }

    try {
      await onGenerateReport(docxFile, mp3File)
    } catch (error) {
      console.error("生成报告失败:", error)
      alert("生成报告失败，请稍后重试")
    }
  }

  const removeDocxFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDocxFile(null)
    if (docxInputRef.current) docxInputRef.current.value = ""
  }

  const removeMp3File = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMp3File(null)
    if (mp3InputRef.current) mp3InputRef.current.value = ""
  }

  return (
    <div className="flex flex-col items-center space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* 上传卡片容器 */}
      <div className="w-full space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 max-w-4xl">
        {/* DOCX 上传卡片 */}
        <Card
          className="hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 sm:active:scale-98"
          onClick={() => docxInputRef.current?.click()}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <CardTitle className="text-base sm:text-lg">上传范例文档</CardTitle>
          </CardHeader>
          <CardContent className="text-center px-4 sm:px-6">
            <p className="text-sm sm:text-base text-gray-600 mb-4">上传DOCX格式的病例范例文档</p>
            {docxFile ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                <button
                  onClick={removeDocxFile}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
                <p className="text-green-700 font-medium text-sm">已选择文件:</p>
                <p className="text-xs sm:text-sm text-green-600 break-all pr-8">{docxFile.name}</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">点击选择DOCX文件</p>
              </div>
            )}
            <input ref={docxInputRef} type="file" accept=".docx,.doc" onChange={handleDocxUpload} className="hidden" />
          </CardContent>
        </Card>

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
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                <button
                  onClick={removeMp3File}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
                <p className="text-green-700 font-medium text-sm">已选择文件:</p>
                <p className="text-xs sm:text-sm text-green-600 break-all pr-8">{mp3File.name}</p>
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

      {/* 生成报告按钮 */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || (!docxFile && !mp3File)}
        size="lg"
        className="w-full max-w-md h-12 sm:h-14 text-base sm:text-lg font-semibold mx-4 active:scale-95 transition-transform"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
            正在生成报告...
          </>
        ) : (
          "生成报告"
        )}
      </Button>

      {/* 文件状态提示 */}
      <div className="text-center text-xs sm:text-sm text-gray-500 max-w-md px-4">
        <p className="mb-1">请上传至少一个文件来生成病例报告</p>
        <p>支持格式：DOCX文档、MP3/WAV/M4A音频</p>
      </div>
    </div>
  )
}
