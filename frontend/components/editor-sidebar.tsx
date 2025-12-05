"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Lightbulb, BookOpen, MessageSquare, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"
import { toast } from "sonner"
import { MoodDial } from "@/components/mood-dial"

interface EditorSidebarProps {
  content?: string
}

export function EditorSidebar({ content = "" }: EditorSidebarProps) {
  const [relatedIdeas, setRelatedIdeas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiModalTitle, setAiModalTitle] = useState("")
  const [aiModalContent, setAiModalContent] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [moodValue, setMoodValue] = useState(50)
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string, actions?: string[] }[]>([
    { role: 'ai', content: "I'm reading along with you. I'm ready to help with plot, character, or tone whenever you need me." }
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessages = [...messages, { role: 'user', content: inputValue }]
    setMessages(newMessages as any)
    setInputValue("")
    setLoading(true)

    try {
      const response = await fetch('/api/chat-with-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "user_123_quantum",
          message: inputValue,
          currentText: content, // Pass the story content
          history: newMessages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: m.content }] }))
        })
      })
      const data = await response.json()
      setMessages([...newMessages, { role: 'ai', content: data.reply }] as any)
    } catch (error) {
      console.error("Failed to send message", error)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (action: string) => {
    setInputValue(action)
    // handleSendMessage() // Optional: auto-send
  }

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length
  const charCount = content.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  useEffect(() => {
    if (content.length > 100) {
      loadRelatedIdeas()
    }
  }, [])

  async function loadRelatedIdeas() {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(MOCK_USER_TENSOR)
      })

      const data = await response.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setRelatedIdeas(data.suggestions.slice(0, 2))
      }
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetSuggestions = async () => {
    if (content.length < 100) {
      setAiModalTitle('Not Enough Content')
      setAiModalContent('Write at least 100 characters to get suggestions!')
      setAiModalOpen(true)
      return
    }

    setAiLoading(true)
    setAiModalTitle('AI Suggestions')
    setAiModalContent('Generating suggestions...')
    setAiModalOpen(true)

    try {
      const response = await fetch('/api/analyze-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tensor: MOCK_USER_TENSOR,
          content,
          type: 'suggestions'
        })
      })

      const data = await response.json()
      if (data.suggestions) {
        const suggestionText = data.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n\n')
        setAiModalContent(suggestionText)
      }
    } catch (error) {
      setAiModalContent('Error generating suggestions. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAskFeedback = async () => {
    if (content.length < 100) {
      setAiModalTitle('Not Enough Content')
      setAiModalContent('Write at least 100 characters to get feedback!')
      setAiModalOpen(true)
      return
    }

    setAiLoading(true)
    setAiModalTitle('Writing Feedback')
    setAiModalContent('Analyzing your writing...')
    setAiModalOpen(true)

    try {
      const response = await fetch('/api/analyze-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tensor: MOCK_USER_TENSOR,
          content,
          type: 'feedback'
        })
      })

      const data = await response.json()
      if (data.result) {
        setAiModalContent(data.result)
      }
    } catch (error) {
      setAiModalContent('Error generating feedback. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleViewOutline = async () => {
    if (content.length < 100) {
      setAiModalTitle('Not Enough Content')
      setAiModalContent('Write at least 100 characters to view outline!')
      setAiModalOpen(true)
      return
    }

    setAiLoading(true)
    setAiModalTitle('Story Outline')
    setAiModalContent('Generating outline...')
    setAiModalOpen(true)

    try {
      const response = await fetch('/api/analyze-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tensor: MOCK_USER_TENSOR,
          content,
          type: 'outline'
        })
      })

      const data = await response.json()
      if (data.result) {
        setAiModalContent(data.result)
      }
    } catch (error) {
      setAiModalContent('Error generating outline. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <>
      <div className="border-l border-border bg-muted/20 p-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-[var(--accent)]/20' : 'bg-primary/20'}`}>
                  <span className="text-xs font-serif">{msg.role === 'ai' ? 'AI' : 'You'}</span>
                </div>
                <div className="bg-card p-3 rounded-lg rounded-tl-none border border-border text-sm leading-relaxed">
                  <p>{msg.content}</p>
                  {msg.actions && (
                    <div className="mt-3 flex gap-2">
                      {msg.actions.map((action, j) => (
                        <Button
                          key={j}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleActionClick(action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-serif">AI</span>
                </div>
                <div className="bg-card p-3 rounded-lg rounded-tl-none border border-border text-sm leading-relaxed">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-6 border-t border-border pt-6">
          <div>
            <h2 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-widest">Tone & Energy</h2>
            <MoodDial value={moodValue} onChange={setMoodValue} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Reply to partner..."
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <Button size="icon" variant="ghost" onClick={handleSendMessage} disabled={loading || !inputValue.trim()}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{aiModalTitle}</DialogTitle>
            <DialogDescription>
              {aiLoading ? 'Please wait while we analyze your writing...' : 'AI-powered analysis of your writing'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {aiLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {aiModalContent}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
