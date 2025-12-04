"use client"

import { useState } from "react"
import { ConstellationNode } from "@/components/constellation-node"
import { ConstellationConnection } from "@/components/constellation-connection"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Story {
  id: string
  title: string
  theme: string
  position: { x: number; y: number }
  size: "small" | "medium" | "large"
  excerpt: string
  wordCount: number
}

const stories: Story[] = [
  {
    id: "1",
    title: "Echoes in the Garden",
    theme: "Memory & Loss",
    position: { x: 50, y: 40 },
    size: "large",
    excerpt: "The morning dew clung to the rose petals like memories...",
    wordCount: 1847,
  },
  {
    id: "2",
    title: "Midnight Conversations",
    theme: "Connection",
    position: { x: 25, y: 30 },
    size: "medium",
    excerpt: "We spoke in whispers, as if the darkness itself was listening...",
    wordCount: 892,
  },
  {
    id: "3",
    title: "Letters to Tomorrow",
    theme: "Hope & Time",
    position: { x: 70, y: 25 },
    size: "medium",
    excerpt: "Dear future self, I hope you remember this feeling...",
    wordCount: 2341,
  },
  {
    id: "4",
    title: "The Weight of Silence",
    theme: "Grief",
    position: { x: 35, y: 60 },
    size: "small",
    excerpt: "Some things are too heavy for words...",
    wordCount: 456,
  },
  {
    id: "5",
    title: "Fragments of Light",
    theme: "Beauty",
    position: { x: 65, y: 65 },
    size: "small",
    excerpt: "She collected moments like pressed flowers...",
    wordCount: 734,
  },
  {
    id: "6",
    title: "The Space Between",
    theme: "Identity",
    position: { x: 50, y: 75 },
    size: "medium",
    excerpt: "Who are we in the quiet moments?...",
    wordCount: 1203,
  },
]

const connections = [
  { from: { x: 50, y: 40 }, to: { x: 25, y: 30 }, strength: "strong" as const },
  { from: { x: 50, y: 40 }, to: { x: 35, y: 60 }, strength: "strong" as const },
  { from: { x: 70, y: 25 }, to: { x: 50, y: 40 }, strength: "medium" as const },
  { from: { x: 35, y: 60 }, to: { x: 50, y: 75 }, strength: "medium" as const },
  { from: { x: 65, y: 65 }, to: { x: 50, y: 40 }, strength: "weak" as const },
  { from: { x: 25, y: 30 }, to: { x: 35, y: 60 }, strength: "weak" as const },
]

export function ConstellationView() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Background stars effect */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[var(--color-constellation)] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Connections */}
      {connections.map((connection, index) => (
        <ConstellationConnection key={index} {...connection} />
      ))}

      {/* Nodes */}
      {stories.map((story) => (
        <ConstellationNode
          key={story.id}
          {...story}
          isSelected={selectedStory?.id === story.id}
          onClick={() => setSelectedStory(story)}
        />
      ))}

      {/* Selected Story Detail */}
      {selectedStory && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card className="p-6 shadow-2xl border-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-lg mb-1">{selectedStory.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedStory.theme}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStory(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4">{selectedStory.excerpt}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedStory.wordCount.toLocaleString()} words</span>
              <Button asChild size="sm" className="gap-2">
                <Link href={`/editor?story=${selectedStory.id}`}>
                  Open story
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
