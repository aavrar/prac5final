"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Sparkles, User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "assistant"
    content: string
}

interface CalibrationChatProps {
    userId: string
    onTensorUpdate: () => void
}

export function CalibrationChat({ userId, onTensorUpdate }: CalibrationChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello. I am the Calibration Engine. To better understand your creative voice, I need to ask you a few questions. Shall we begin?" }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = input
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setInput("")
        setLoading(true)

        try {
            const response = await fetch('/api/tensor/calibrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    message: userMessage,
                    history: messages
                })
            })

            const data = await response.json()

            setMessages(prev => [...prev, { role: "assistant", content: data.reply }])

            if (data.tensorUpdated) {
                onTensorUpdate()
            }

        } catch (error) {
            console.error("Calibration error:", error)
            setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered an error processing your response." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">Calibration Interview</h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-3 max-w-[80%]",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-lg text-sm leading-relaxed",
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-muted p-3 rounded-lg text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/20 flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your answer..."
                    className="flex-1"
                    disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
