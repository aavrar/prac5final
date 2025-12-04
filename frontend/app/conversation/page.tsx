"use client"

import { Navigation } from "@/components/navigation"
import { MessageBubble } from "@/components/message-bubble"
import { ConversationInput } from "@/components/conversation-input"
import { ConversationSuggestions } from "@/components/conversation-suggestions"
import { useState } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"
import { Premise } from "@/lib/types"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
  premise?: Premise
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "I'm here whenever you need to talk through your ideas. What's on your mind today?",
    sender: "ai",
    timestamp: "Just now",
  },
]

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: "Just now",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Generate premise based on user tensor
      const response = await fetch('/api/generate-premise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(MOCK_USER_TENSOR)
      })

      const premise: Premise = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I sense you're exploring themes around **${premise.title}**.\n\n*${premise.logline}*\n\n${premise.stylistic_note}`,
        sender: "ai",
        timestamp: "Just now",
        premise
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Could you try again?",
        sender: "ai",
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col md:pl-32">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-lg font-serif font-semibold">Conversation</h1>
            <p className="text-sm text-muted-foreground">A safe space to think out loud</p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-ambient)] to-[var(--color-constellation)] flex items-center justify-center flex-shrink-0">
                  <div className="flex gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div className="py-12">
                <ConversationSuggestions onSelect={handleSendMessage} />
              </div>
            )}
          </div>
        </main>

        {/* Input */}
        <ConversationInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </>
  )
}
