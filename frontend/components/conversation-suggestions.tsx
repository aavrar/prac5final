"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"

interface ConversationSuggestionsProps {
  onSelect: (suggestion: string) => void
}

const defaultSuggestions = [
  "I'm stuck on this scene...",
  "Help me develop this character",
  "What if I tried a different perspective?",
  "I'm not sure where to go next",
  "Can we explore this theme deeper?",
]

export function ConversationSuggestions({ onSelect }: ConversationSuggestionsProps) {
  const [suggestions, setSuggestions] = useState(defaultSuggestions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const response = await fetch('/api/generate-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(MOCK_USER_TENSOR)
        })

        const data = await response.json()
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('Error loading suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSuggestions()
  }, [])

  return (
    <div className="space-y-3 animate-in fade-in duration-700">
      <p className="text-sm text-muted-foreground text-center">
        {loading ? "Thinking about what you might need..." : "How can I help you today?"}
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-sm hover:bg-secondary"
            disabled={loading}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
