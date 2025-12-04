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

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col md:pl-32">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
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
        <EditorToolbar />

        {/* Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          <div className={showSidebar ? "flex-1" : "w-full"}>
            <GhostTextEditor initialContent={content} onContentChange={setContent} />
          </div>

          {showSidebar && (
            <div className="w-80 hidden lg:block">
              <EditorSidebar content={content} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
