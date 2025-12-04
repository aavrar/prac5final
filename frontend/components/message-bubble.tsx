"use client"

import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  content: string
  sender: "user" | "ai"
  timestamp: string
}

export function MessageBubble({ content, sender, timestamp }: MessageBubbleProps) {
  const isUser = sender === "user"

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-[var(--color-ambient)] to-[var(--color-constellation)] text-white",
        )}
      >
        {isUser ? "You" : "AI"}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[80%] sm:max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm",
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
      </div>
    </div>
  )
}
