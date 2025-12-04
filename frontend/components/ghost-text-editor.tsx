"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, X, Sparkles } from "lucide-react"

interface GhostTextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
  onFormatRequest?: (type: 'bold' | 'italic' | 'quote' | 'list') => void
}

export function GhostTextEditor({ initialContent = "", onContentChange, onFormatRequest }: GhostTextEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [ghostText, setGhostText] = useState("")
  const [showGhost, setShowGhost] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Expose formatting function
  useEffect(() => {
    if (onFormatRequest) {
      const handleFormat = (type: 'bold' | 'italic' | 'quote' | 'list') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)
        const beforeText = content.substring(0, start)
        const afterText = content.substring(end)

        let newText = content
        let newCursorPos = end

        switch (type) {
          case 'bold':
            newText = beforeText + `**${selectedText || 'bold text'}**` + afterText
            newCursorPos = start + (selectedText ? selectedText.length + 4 : 11)
            break
          case 'italic':
            newText = beforeText + `*${selectedText || 'italic text'}*` + afterText
            newCursorPos = start + (selectedText ? selectedText.length + 2 : 13)
            break
          case 'quote':
            newText = beforeText + `> ${selectedText || 'quote'}` + afterText
            newCursorPos = start + (selectedText ? selectedText.length + 2 : 8)
            break
          case 'list':
            newText = beforeText + `- ${selectedText || 'list item'}` + afterText
            newCursorPos = start + (selectedText ? selectedText.length + 2 : 12)
            break
        }

        setContent(newText)
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
      }

      // Store the handler
      (window as any).formatEditorText = handleFormat
    }
  }, [content, onFormatRequest])

  useEffect(() => {
    onContentChange?.(content)
  }, [content, onContentChange])

  // Generate ghost text suggestions when user pauses
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (content.length > 50 && !showGhost) {
        try {
          const { MOCK_USER_TENSOR } = await import('@/lib/mockData')

          const response = await fetch('/api/generate-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tensor: MOCK_USER_TENSOR,
              currentText: content
            })
          })

          const data = await response.json()
          if (data.suggestion) {
            setGhostText(data.suggestion)
            setShowGhost(true)
          }
        } catch (error) {
          const fallbackSuggestions = [
            "The silence that followed was heavier than any words could be.",
            "In that moment, everything felt both familiar and impossibly distant.",
          ]
          setGhostText(fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)])
          setShowGhost(true)
        }
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [content, showGhost])

  const handleAcceptGhost = () => {
    setContent((prev) => prev + " " + ghostText)
    setShowGhost(false)
    setGhostText("")
  }

  const handleRejectGhost = () => {
    setShowGhost(false)
    setGhostText("")
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setShowGhost(false)
    setCursorPosition(e.target.selectionStart)
  }

  return (
    <div className="relative w-full">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleTextChange}
        placeholder="Begin writing your story..."
        className="w-full min-h-[calc(100vh-200px)] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed font-serif p-8"
      />

      {showGhost && (
        <div className="absolute bottom-8 left-8 right-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[var(--color-ghost-text)]/10 border border-[var(--color-ghost-text)]/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[var(--color-ghost-text)] mt-1 flex-shrink-0" />
              <p className="text-sm text-[var(--color-ghost-text)] italic flex-1 leading-relaxed">{ghostText}</p>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={handleAcceptGhost} className="h-7 px-2">
                  <Check className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleRejectGhost} className="h-7 px-2">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
