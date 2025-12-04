"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Quote, Undo, Redo, Save, MoreHorizontal } from "lucide-react"

interface EditorToolbarProps {
  onFormat?: (type: 'bold' | 'italic' | 'quote' | 'list') => void
  onSave?: () => void
}

export function EditorToolbar({ onFormat, onSave }: EditorToolbarProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => alert('Undo functionality')}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => alert('Redo functionality')}>
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm" onClick={() => onFormat?.('bold')}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat?.('italic')}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat?.('quote')}>
            <Quote className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat?.('list')}>
            <List className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm" onClick={() => alert('More formatting options coming soon!')}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Auto-saved</span>
          <Button variant="ghost" size="sm" className="gap-2" onClick={onSave}>
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
