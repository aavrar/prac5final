"use client"

import { useEffect, useState } from "react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"

interface AmbientGreetingProps {
  userName?: string
}

export function AmbientGreeting({ userName }: AmbientGreetingProps) {
  const [greeting, setGreeting] = useState("")
  const [contextualPrompt, setContextualPrompt] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()

    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    const activeConflict = MOCK_USER_TENSOR.emotional_landscape.active_conflicts[0]
    const processedTheme = MOCK_USER_TENSOR.emotional_landscape.processed_themes[0]

    setContextualPrompt(`You've been thinking about ${processedTheme.toLowerCase()}—the weight of ${activeConflict.toLowerCase()}.`)
  }, [])

  if (!mounted) return null

  const displayName = userName || "Aahad"

  return (
    <div className="animate-in fade-in duration-1000">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-balance mb-4 text-foreground/90">
        {greeting}, {displayName}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-2">
        {contextualPrompt}
      </p>
      <p className="text-base text-muted-foreground/70">
        What story wants to be told today?
      </p>
    </div>
  )
}
