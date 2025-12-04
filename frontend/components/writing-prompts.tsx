"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"

export function WritingPrompts() {
  const [currentPrompt, setCurrentPrompt] = useState("What story has been waiting to be told?")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPrompt() {
      try {
        const response = await fetch('/api/generate-prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(MOCK_USER_TENSOR)
        })

        const data = await response.json()
        if (data.prompt) {
          setCurrentPrompt(data.prompt)
        }
      } catch (error) {
        console.error('Error loading prompt:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompt()
  }, [])

  return (
    <Card className="p-6 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">A gentle prompt</p>
          {loading ? (
            <p className="text-base font-serif text-muted-foreground/60 leading-relaxed animate-pulse">Crafting something just for you...</p>
          ) : (
            <p className="text-base font-serif text-foreground leading-relaxed">{currentPrompt}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
