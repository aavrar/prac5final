"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, Sparkles } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ConversationInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ConversationInput({ onSend, disabled }: ConversationInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-2">
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Sparkles className="w-3 h-3" />
            Suggest ideas
          </Button>
        </div>

        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts, ask for help, or just talk..."
            className="min-h-[52px] max-h-[200px] resize-none"
            disabled={disabled}
          />

          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="flex-shrink-0 bg-transparent">
              <Mic className="w-4 h-4" />
            </Button>

            <Button size="icon" onClick={handleSend} disabled={!message.trim() || disabled} className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">Everything you share here stays between us</p>
      </div>
    </div>
  )
}
