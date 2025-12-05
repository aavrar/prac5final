"use client"

import { Navigation } from "@/components/navigation"
import { EditorToolbar } from "@/components/editor-toolbar"
import { GhostTextEditor, GhostTextEditorHandle } from "@/components/ghost-text-editor"
import { EditorSidebar } from "@/components/editor-sidebar"
import { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PanelRightClose, PanelRightOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const initialContent = ""

function EditorContent() {
  const searchParams = useSearchParams()
  const urlStoryId = searchParams.get('story')

  const [content, setContent] = useState(initialContent)
  const [showSidebar, setShowSidebar] = useState(true)
  const [title, setTitle] = useState("Untitled")
  const [storyId, setStoryId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<GhostTextEditorHandle>(null)

  // Load story if ID is in URL
  useEffect(() => {
    if (urlStoryId) {
      setLoading(true)
      fetch(`/api/stories?user_id=user_123_quantum`)
        .then(res => res.json())
        .then(data => {
          const story = data.stories.find((s: any) => s._id === urlStoryId)
          if (story) {
            setStoryId(story._id)
            setTitle(story.title)
            setContent(story.content)
            setLastSaved(new Date(story.updated_at))
          } else {
            toast.error("Story not found")
          }
        })
        .catch(err => {
          console.error(err)
          toast.error("Failed to load story")
        })
        .finally(() => setLoading(false))
    } else {
      // Reset to blank if no ID (new story)
      setContent("")
      setTitle("Untitled")
      setStoryId(null)
      setLastSaved(null)
    }
  }, [urlStoryId])

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (content.length > 50) {
        localStorage.setItem('editor_content', content)
        saveToDatabase()
      }
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [content, title])

  const handleFormat = (type: 'bold' | 'italic' | 'quote' | 'list' | 'undo' | 'redo') => {
    editorRef.current?.formatText(type)
  }

  const handleAction = (action: 'save' | 'pdf' | 'txt') => {
    if (action === 'save') {
      handleSave()
    } else if (action === 'pdf') {
      window.print()
    } else if (action === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const saveToDatabase = async () => {
    if (saving || !content) return // Don't save empty content automatically

    setSaving(true)
    try {
      const response = await fetch('/api/stories', {
        method: storyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_id: storyId,
          user_id: 'user_123_quantum',
          title,
          content,
          type: 'draft'
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.story_id && !storyId) {
          setStoryId(data.story_id.toString())
        }
        setLastSaved(new Date())
        toast.success('Story saved!')
      } else {
        throw new Error(data.error || 'Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save story')
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = () => {
    if (!content) {
      toast.error("Cannot save empty story")
      return
    }
    localStorage.setItem('editor_content', content)
    localStorage.setItem('editor_title', title)
    saveToDatabase()
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <>
      <Navigation />
      <div className="h-screen flex flex-col md:pl-32 overflow-hidden print:pl-0 print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex-shrink-0 print:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-serif font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 w-full max-w-md"
              />
              {lastSaved && (
                <span className="text-xs text-muted-foreground hidden sm:inline whitespace-nowrap">
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="gap-2 flex-shrink-0">
              {showSidebar ? (
                <>
                  <PanelRightClose className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide sidebar</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Show sidebar</span>
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex-shrink-0 print:hidden">
          <EditorToolbar
            onFormat={handleFormat}
            onSave={handleAction}
            onCheckVoice={() => editorRef.current?.checkVoice()}
          />
        </div>

        {/* Editor Layout */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative print:overflow-visible print:h-auto">
          <div className={showSidebar ? "flex-1 overflow-y-auto print:overflow-visible" : "w-full overflow-y-auto print:overflow-visible"}>
            <GhostTextEditor
              ref={editorRef}
              initialContent={content}
              onContentChange={setContent}
            />
          </div>

          {showSidebar && (
            <div className="w-96 hidden lg:block border-l border-border bg-muted/20 h-full overflow-y-auto">
              <EditorSidebar content={content} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
      <EditorContent />
    </Suspense>
  )
}
