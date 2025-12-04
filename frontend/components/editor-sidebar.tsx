"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Lightbulb, BookOpen, MessageSquare, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"

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
    <div className="border-l border-border bg-muted/20 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Story details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Words</span>
              <span className="font-medium">{wordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Characters</span>
              <span className="font-medium">{charCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reading time</span>
              <span className="font-medium">{readingTime} min</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick actions</h2>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
              onClick={handleAskFeedback}
            >
              <MessageSquare className="w-4 h-4" />
              Ask for feedback
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
              onClick={handleGetSuggestions}
            >
              <Lightbulb className="w-4 h-4" />
              Get suggestions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
              onClick={handleViewOutline}
            >
              <BookOpen className="w-4 h-4" />
              View outline
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Related ideas</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
          ) : relatedIdeas.length > 0 ? (
            <div className="space-y-2">
              {relatedIdeas.map((idea, index) => (
                <Card key={index} className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {index === 0 ? 'From your themes' : 'Related concept'}
                  </p>
                  <p className="text-sm leading-relaxed">{idea}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start writing to discover related ideas...
              </p>
            </Card>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent"
          onClick={() => alert('More options coming soon!')}
        >
          <MoreVertical className="w-4 h-4" />
          More options
        </Button>
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
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {aiModalContent}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
