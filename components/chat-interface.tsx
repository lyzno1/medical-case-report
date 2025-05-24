"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Send, FileUp, Download, Loader2 } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { generateReport } from "@/lib/api"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好，我是病例报告生成助手。请输入病例信息或上传语音，我将帮您生成病例报告。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!input.trim() && !isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setReportUrl(null)

    try {
      const response = await generateReport(userMessage)
      setMessages((prev) => [...prev, { role: "assistant", content: response.text }])
      setReportUrl(response.docUrl)
    } catch (error) {
      console.error("Error generating report:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，生成报告时出现错误，请稍后再试。",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setReportUrl(null)

    // Display file name as user message
    setMessages((prev) => [...prev, { role: "user", content: `上传语音文件: ${file.name}` }])

    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("语音转写失败")

      const data = await response.json()

      // Now send the transcribed text to generate report
      const reportResponse = await generateReport(data.text)

      setMessages((prev) => [...prev, { role: "assistant", content: reportResponse.text }])
      setReportUrl(reportResponse.docUrl)
    } catch (error) {
      console.error("Error processing audio:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，处理语音文件时出现错误，请稍后再试。",
        },
      ])
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col h-[80vh] w-full">
      <Card className="flex-1 overflow-hidden mb-4">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">正在处理...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {reportUrl && (
        <div className="mb-4 flex justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(reportUrl, "_blank")}
          >
            <Download className="h-4 w-4" />
            下载病例报告
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
        <Button variant="outline" size="icon" onClick={triggerFileUpload} disabled={isLoading} title="上传语音文件">
          <FileUp className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={triggerFileUpload} disabled={isLoading} title="录制语音">
          <Mic className="h-4 w-4" />
        </Button>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入病例信息..."
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
