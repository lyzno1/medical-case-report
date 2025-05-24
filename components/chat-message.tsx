import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ChatMessageProps = {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className={isUser ? "bg-primary" : "bg-muted"}>
        <AvatarFallback>{isUser ? "用户" : "AI"}</AvatarFallback>
        <AvatarImage src={isUser ? "/placeholder.svg?height=40&width=40" : "/placeholder.svg?height=40&width=40"} />
      </Avatar>
      <div
        className={`rounded-lg px-4 py-3 max-w-[80%] ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
