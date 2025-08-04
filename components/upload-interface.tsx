"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Upload, Loader2, CheckCircle, AlertCircle, FileAudio } from "lucide-react"

type UploadInterfaceProps = {
  onGenerateReport: (fileId: string, fileName: string) => void
  isGenerating: boolean
}

export function UploadInterface({ onGenerateReport, isGenerating }: UploadInterfaceProps) {
  const [mp3File, setMp3File] = useState<File | null>(null)
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const mp3InputRef = useRef<HTMLInputElement>(null)

  const handleMp3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMp3File(file)
    setUploadError(null)
    setGenerateError(null)
    
    // Auto upload the file
    await handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    // 文件大小检查
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("音频文件大小不能超过 50MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("mp3", file)

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
      setUploadError(null)
    } catch (error) {
      console.error("文件上传失败:", error)
      setUploadError(error instanceof Error ? error.message : "未知错误")
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedFileId || !uploadedFileName) {
      setGenerateError("请先上传文件")
      return
    }

    setGenerateError(null)
    try {
      await onGenerateReport(uploadedFileId, uploadedFileName)
    } catch (error) {
      console.error("生成报告失败:", error)
      setGenerateError(error instanceof Error ? error.message : "未知错误")
    }
  }

  const resetFile = () => {
    setMp3File(null)
    setUploadedFileId(null)
    setUploadedFileName(null)
    setUploadError(null)
    setGenerateError(null)
    if (mp3InputRef.current) mp3InputRef.current.value = ""
  }

  return (
    <div className="flex flex-col items-center space-y-8 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* 主标题 */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">病例报告生成器</h1>
        <p className="text-gray-600">上传音频文件，自动生成专业病例报告</p>
      </div>

      {/* 文件上传区域 */}
      <div className="w-full space-y-4">
        {!mp3File ? (
          /* 上传区域 */
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
            onClick={() => mp3InputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">点击上传音频文件</p>
                <p className="text-sm text-gray-500 mt-1">支持 MP3、WAV、M4A 格式，最大 50MB</p>
              </div>
              <Button size="lg" className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                选择文件
              </Button>
            </div>
          </div>
        ) : (
          /* 文件状态显示 */
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                uploadedFileId ? 'bg-green-100' : isUploading ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : uploadedFileId ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <FileAudio className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{mp3File.name}</p>
                <p className="text-sm text-gray-500">
                  {(mp3File.size / (1024 * 1024)).toFixed(1)} MB
                </p>
                <div className="flex items-center mt-1">
                  {isUploading && (
                    <span className="text-sm text-blue-600">正在上传...</span>
                  )}
                  {uploadedFileId && (
                    <span className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      上传成功
                    </span>
                  )}
                  {uploadError && (
                    <span className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {uploadError}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFile}
                className="text-gray-400 hover:text-gray-600"
              >
                重新选择
              </Button>
            </div>
          </div>
        )}
        
        <input
          ref={mp3InputRef}
          type="file"
          accept=".mp3,.wav,.m4a"
          onChange={handleMp3Upload}
          className="hidden"
        />
      </div>

      {/* 生成按钮 */}
      {uploadedFileId && (
        <div className="w-full space-y-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                正在生成报告...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                开始生成报告
              </>
            )}
          </Button>
          
          {generateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{generateError}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部提示 */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>上传你的音频文件，系统将自动分析并生成专业的病例报告</p>
        <p className="text-xs">数据安全保障，仅用于报告生成，不会存储个人信息</p>
      </div>
    </div>
  )
}
