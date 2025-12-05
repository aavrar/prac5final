"use client"

import { useState, useEffect } from "react"
import { ConstellationNode } from "@/components/constellation-node"
import { ConstellationConnection } from "@/components/constellation-connection"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ExternalLink, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"

interface Story {
  id: string
  title: string
  theme: string
  position: { x: number; y: number }
  size: "small" | "medium" | "large"
  excerpt: string
  wordCount: number
  analysis: {
    themes: string[]
    emotional_valence: string
    motifs: string[]
    cultural_markers: string[]
  }
}

interface Connection {
  from: { x: number; y: number }
  to: { x: number; y: number }
  strength: "strong" | "medium" | "weak"
}

export function ConstellationView() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories?user_id=user_123_quantum')
        if (response.ok) {
          const data = await response.json()

          // Map API data to visualization format
          const mappedStories: Story[] = data.stories.map((s: any, index: number) => {
            // Generate deterministic random position based on index
            const x = 20 + (index * 15) % 60 + (Math.random() * 10 - 5)
            const y = 20 + (index * 23) % 60 + (Math.random() * 10 - 5)

            return {
              id: s._id,
              title: s.title,
              theme: s.analysis?.themes?.[0] || "Uncategorized",
              position: { x, y },
              size: s.content.length > 2000 ? "large" : s.content.length > 1000 ? "medium" : "small",
              excerpt: s.content.substring(0, 100) + "...",
              wordCount: s.content.split(/\s+/).length,
              analysis: s.analysis || { themes: [], emotional_valence: "Unknown", motifs: [], cultural_markers: [] }
            }
          })

          setStories(mappedStories)

          // Generate connections based on shared themes or random for visual effect
          const newConnections: Connection[] = []
          mappedStories.forEach((s1, i) => {
            mappedStories.forEach((s2, j) => {
              if (i < j) {
                // Connect if they share a theme or just randomly for now to show the constellation
                if (s1.theme === s2.theme || Math.random() > 0.7) {
                  newConnections.push({
                    from: s1.position,
                    to: s2.position,
                    strength: s1.theme === s2.theme ? "strong" : "weak"
                  })
                }
              }
            })
          })
          setConnections(newConnections)
        }
      } catch (error) {
        console.error("Failed to fetch stories", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-[600px]"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

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

            {/* Analysis Details */}
            <div className="mb-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedStory.analysis.emotional_valence && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedStory.analysis.emotional_valence}
                  </span>
                )}
                {selectedStory.analysis.themes?.slice(0, 3).map((theme, i) => (
                  <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {theme}
                  </span>
                ))}
              </div>
              {selectedStory.analysis.motifs?.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Motifs:</span> {selectedStory.analysis.motifs.join(", ")}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedStory.wordCount.toLocaleString()} words</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this story?")) {
                      try {
                        const res = await fetch(`/api/stories?story_id=${selectedStory.id}`, { method: 'DELETE' })
                        if (res.ok) {
                          setStories(prev => prev.filter(s => s.id !== selectedStory.id))
                          setConnections(prev => prev.filter(c => {
                            // Re-calculate connections or just refresh, but simple filter for now
                            // Since connections store positions, it's hard to filter by ID without mapping back
                            // So we'll just close the modal and let the user refresh or we can re-fetch
                            return true
                          }))
                          setSelectedStory(null)
                          // Ideally re-fetch to clean up connections
                          window.location.reload()
                        }
                      } catch (err) {
                        console.error("Failed to delete", err)
                      }
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
                <Button asChild size="sm" className="gap-2">
                  <Link href={`/editor?story=${selectedStory.id}`}>
                    Open story
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
