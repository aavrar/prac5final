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
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-serif">AI</span>
              </div>
              <div className="bg-card p-3 rounded-lg rounded-tl-none border border-border text-sm leading-relaxed">
                <p>I'm reading along with you. The rhythm in this second paragraph feels a bit rushed compared to the opening.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-serif">AI</span>
              </div>
              <div className="bg-card p-3 rounded-lg rounded-tl-none border border-border text-sm leading-relaxed">
                <p>Want to explore that "garden found its own rhythm" idea more? It feels like a metaphor for her grief.</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-7">Expand metaphor</Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">Keep moving</Button>
                </div>
              </div>
            </div>
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
              placeholder="Reply to partner..."
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <Button size="icon" variant="ghost">
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
