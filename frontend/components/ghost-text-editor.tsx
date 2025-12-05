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
}

export const GhostTextEditor = forwardRef<GhostTextEditorHandle, GhostTextEditorProps>(({ initialContent = "", onContentChange }, ref) => {
  const [ghostText, setGhostText] = useState("")
  const [showGhost, setShowGhost] = useState(false)
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

  // Expose formatting function via ref
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
          const { MOCK_USER_TENSOR } = await import('@/lib/mockData')

          const response = await fetch('/api/generate-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tensor: MOCK_USER_TENSOR,
              currentText: editorRef.current.innerText
            })
          })

          const data = await response.json()
          if (data.suggestion) {
            setGhostText(data.suggestion)
            setShowGhost(true)
          }
        } catch (error) {
          // Silent fail
        }
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [showGhost]) // Removed content dependency to avoid loop, relies on timeout

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
    <div className="relative w-full h-full">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[calc(100vh-200px)] outline-none text-base leading-relaxed font-serif p-8 whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
        data-placeholder="Begin writing your story..."
        suppressContentEditableWarning
      />

      {showGhost && (
        <div className="absolute bottom-8 left-8 right-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
          <div className="bg-[var(--color-ghost-text)]/10 border border-[var(--color-ghost-text)]/30 rounded-lg p-4 backdrop-blur-sm pointer-events-auto inline-flex items-center gap-3 max-w-2xl">
            <Sparkles className="w-4 h-4 text-[var(--color-ghost-text)] flex-shrink-0" />
            <p className="text-sm text-[var(--color-ghost-text)] italic leading-relaxed line-clamp-2">{ghostText}</p>
            <div className="flex gap-2 flex-shrink-0 ml-auto">
              <Button size="sm" variant="ghost" onClick={handleAcceptGhost} className="h-7 px-2 hover:bg-[var(--color-ghost-text)]/20">
                <Check className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleRejectGhost} className="h-7 px-2 hover:bg-[var(--color-ghost-text)]/20">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
GhostTextEditor.displayName = "GhostTextEditor"
