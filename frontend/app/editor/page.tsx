"use client"

import { Navigation } from "@/components/navigation"
import { EditorToolbar } from "@/components/editor-toolbar"
import { GhostTextEditor } from "@/components/ghost-text-editor"
import { EditorSidebar } from "@/components/editor-sidebar"
import { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PanelRightClose, PanelRightOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const initialContent = `The morning dew clung to the rose petals like memories—fragile, temporary, beautiful in their impermanence. Sarah walked through the garden, her fingers trailing along the hedge that had grown wild over the summer.

She remembered when these paths had been pristine, when her mother had spent every weekend tending to each flower bed with careful precision. Now, three years after her passing, the garden had found its own rhythm, its own way of being.`

function EditorContent() {
  const searchParams = useSearchParams()
  const urlStoryId = searchParams.get('story')

  const [content, setContent] = useState(initialContent)
  const [showSidebar, setShowSidebar] = useState(true)
  const [title, setTitle] = useState("Echoes in the Garden")
  const [storyId, setStoryId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load story if ID is in URL
  useEffect(() => {
    if (urlStoryId) {
      setLoading(true)
      fetch(`/api/stories?user_id=user_123_quantum`) // Ideally we'd have a get-by-id endpoint, but filtering client-side for prototype
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
    }
  }, [urlStoryId])

  const handleFormat = (type: 'bold' | 'italic' | 'quote' | 'list') => {
    if ((window as any).formatEditorText) {
      (window as any).formatEditorText(type)
    }
  }

  const saveToDatabase = async () => {
    if (saving) return

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
    localStorage.setItem('editor_content', content)
    localStorage.setItem('editor_title', title)
    saveToDatabase()
  }

  useEffect(() => {
    if (!urlStoryId) {
      const savedContent = localStorage.getItem('editor_content')
      const savedTitle = localStorage.getItem('editor_title')
      if (savedContent) setContent(savedContent)
      if (savedTitle) setTitle(savedTitle)
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

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <>
      <Navigation />
      <div className="h-screen flex flex-col md:pl-32 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex-shrink-0">
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
        <div className="flex-shrink-0">
          <EditorToolbar onFormat={handleFormat} onSave={handleSave} />
        </div>

        {/* Editor Layout */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          <div className={showSidebar ? "flex-1 overflow-y-auto" : "w-full overflow-y-auto"}>
            <GhostTextEditor
              initialContent={content}
              onContentChange={setContent}
              onFormatRequest={handleFormat}
            />
          </div>

          {showSidebar && (
            <div className="w-80 hidden lg:block border-l border-border bg-muted/20 h-full overflow-y-auto">
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
