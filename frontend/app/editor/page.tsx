"use client"

import { Navigation } from "@/components/navigation"
import { EditorToolbar } from "@/components/editor-toolbar"
import { GhostTextEditor } from "@/components/ghost-text-editor"
import { EditorSidebar } from "@/components/editor-sidebar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

const initialContent = `The morning dew clung to the rose petals like memories—fragile, temporary, beautiful in their impermanence. Sarah walked through the garden, her fingers trailing along the hedge that had grown wild over the summer.

She remembered when these paths had been pristine, when her mother had spent every weekend tending to each flower bed with careful precision. Now, three years after her passing, the garden had found its own rhythm, its own way of being.`

export default function EditorPage() {
  const [content, setContent] = useState(initialContent)
  const [showSidebar, setShowSidebar] = useState(true)

  const handleFormat = (type: 'bold' | 'italic' | 'quote' | 'list') => {
    if ((window as any).formatEditorText) {
      (window as any).formatEditorText(type)
    }
  }

  const handleSave = () => {
    localStorage.setItem('editor_content', content)
    alert('Story saved!')
  }

  return (
    <>
      <Navigation />
      <div className="h-screen flex flex-col md:pl-32 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                defaultValue="Echoes in the Garden"
                className="text-lg font-serif font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 w-full max-w-md"
              />
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="gap-2">
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
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className={showSidebar ? "flex-1 overflow-y-auto" : "w-full overflow-y-auto"}>
            <GhostTextEditor
              initialContent={content}
              onContentChange={setContent}
              onFormatRequest={handleFormat}
            />
          </div>

          {showSidebar && (
            <div className="w-80 hidden lg:block flex-shrink-0 overflow-y-auto">
              <EditorSidebar content={content} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
