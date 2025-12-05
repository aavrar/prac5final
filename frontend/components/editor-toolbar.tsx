"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Quote, Undo, Redo, Save, MoreHorizontal, FileDown, FileText, Mic } from "lucide-react"

interface EditorToolbarProps {
  onFormat?: (type: 'bold' | 'italic' | 'quote' | 'list' | 'undo' | 'redo') => void
  onSave?: (action: 'save' | 'pdf' | 'txt') => void
  onCheckVoice?: () => void
}

export function EditorToolbar({ onFormat, onSave, onCheckVoice }: EditorToolbarProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onFormat?.('undo')}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat?.('redo')}>
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

          <Button variant="ghost" size="sm" onClick={() => onSave?.('pdf')} title="Export as PDF">
            <FileDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSave?.('txt')} title="Export as Text">
            <FileText className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm" onClick={onCheckVoice} title="Check Voice Consistency" className="text-primary hover:text-primary/80">
            <Mic className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">Voice Check</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Auto-saved</span>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => onSave?.('save')}>
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
