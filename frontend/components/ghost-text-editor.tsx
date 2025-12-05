"use client"

import type React from "react"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Sparkles } from "lucide-react"

interface GhostTextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

export interface GhostTextEditorHandle {
  formatText: (type: 'bold' | 'italic' | 'quote' | 'list' | 'undo' | 'redo') => void
  checkVoice: () => void
}

interface GhostTextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
  userId?: string
}

export const GhostTextEditor = forwardRef<GhostTextEditorHandle, GhostTextEditorProps>(({ initialContent = "", onContentChange, userId = "user_123_quantum" }, ref) => {
  const [ghostText, setGhostText] = useState("")
  const [showGhost, setShowGhost] = useState(false)
  const [voiceFeedback, setVoiceFeedback] = useState<{ match_score: number, feedback: string, suggestion: string } | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const isTypingRef = useRef(false)

  // Initialize content
  useEffect(() => {
    if (editorRef.current && initialContent && !isTypingRef.current) {
      if (editorRef.current.innerText !== initialContent) {
        editorRef.current.innerText = initialContent
      }
    }
  }, [initialContent])

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    formatText: (type: 'bold' | 'italic' | 'quote' | 'list' | 'undo' | 'redo') => {
      if (!editorRef.current) return
      editorRef.current.focus()

      switch (type) {
        case 'bold':
          document.execCommand('bold', false)
          break
        case 'italic':
          document.execCommand('italic', false)
          break
        case 'quote':
          document.execCommand('formatBlock', false, 'blockquote')
          break
        case 'list':
          document.execCommand('insertUnorderedList', false)
          break
        case 'undo':
          document.execCommand('undo', false)
          break
        case 'redo':
          document.execCommand('redo', false)
          break
      }
      handleInput()
    },
    checkVoice: async () => {
      if (!editorRef.current) return
      const text = editorRef.current.innerText
      if (text.length < 50) return

      try {
        const response = await fetch('/api/analyze-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, text })
        })
        const data = await response.json()
        setVoiceFeedback(data)

        // Auto-dismiss after 10 seconds
        setTimeout(() => setVoiceFeedback(null), 10000)
      } catch (error) {
        console.error("Voice check failed", error)
      }
    }
  }))

  const handleInput = () => {
    if (editorRef.current) {
      isTypingRef.current = true
      const text = editorRef.current.innerText
      onContentChange?.(text)
      setShowGhost(false)
    }
  }

  // Generate ghost text suggestions when user pauses
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (editorRef.current && editorRef.current.innerText.length > 50 && !showGhost) {
        try {
          // Calculate ambient context (Time of Day)
          const hour = new Date().getHours()
          let timeOfDay = "Daytime"
          if (hour >= 5 && hour < 12) timeOfDay = "Morning"
          else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon"
          else if (hour >= 17 && hour < 22) timeOfDay = "Evening"
          else timeOfDay = "Late Night"

          const response = await fetch('/api/generate-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              currentText: editorRef.current.innerText,
              ambientContext: {
                timeOfDay,
                localTime: new Date().toLocaleTimeString()
              }
            })
          })

          const data = await response.json()
          if (data.suggestion) {
            console.log("Ghost Text received:", data.suggestion)
            setGhostText(data.suggestion)
            setShowGhost(true)
          }
        } catch (error) {
          // Silent fail
        }
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [showGhost, userId])

  const handleAcceptGhost = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText + " " + ghostText
      editorRef.current.innerText = text
      onContentChange?.(text)

      // Move cursor to end
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    setShowGhost(false)
    setGhostText("")
  }

  const handleRejectGhost = () => {
    setShowGhost(false)
    setGhostText("")
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full flex-1 outline-none text-base leading-relaxed font-serif p-8 whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground overflow-y-auto"
        data-placeholder="Begin writing your story..."
        suppressContentEditableWarning
      />

      {/* Dedicated Suggestion Area */}
      <div className="h-24 border-t border-border bg-muted/10 flex-shrink-0 p-4 flex items-center justify-center">
        {showGhost ? (
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-card border border-border rounded-lg p-3 shadow-sm flex items-center gap-4">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground italic leading-relaxed flex-1 font-serif">
                {ghostText}
              </p>
              <div className="flex gap-2 flex-shrink-0 border-l border-border pl-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAcceptGhost}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  title="Accept (Tab)"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRejectGhost}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  title="Reject (Esc)"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Pause typing to see AI suggestions...
          </p>
        )}
      </div>

      {/* Voice Check Feedback (unchanged) */}
      {voiceFeedback && (
        <div className="absolute top-4 right-4 w-64 animate-in fade-in slide-in-from-right-2 duration-300 z-50">
          <div className="bg-card border p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Voice Check</h4>
              <span className="text-xs font-mono">{voiceFeedback.match_score}% Match</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{voiceFeedback.feedback}</p>
            <div className="bg-muted/50 p-2 rounded text-xs italic">
              "{voiceFeedback.suggestion}"
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 h-6 text-xs"
              onClick={() => setVoiceFeedback(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
GhostTextEditor.displayName = "GhostTextEditor"
