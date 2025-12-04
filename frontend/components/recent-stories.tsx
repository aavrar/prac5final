"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Story {
  id: string
  title: string
  excerpt: string
  lastEdited: string
  wordCount: number
}

const mockStories: Story[] = [
  {
    id: "1",
    title: "Echoes in the Garden",
    excerpt: "The morning dew clung to the rose petals like memories...",
    lastEdited: "2 hours ago",
    wordCount: 1847,
  },
  {
    id: "2",
    title: "Midnight Conversations",
    excerpt: "We spoke in whispers, as if the darkness itself was listening...",
    lastEdited: "Yesterday",
    wordCount: 892,
  },
  {
    id: "3",
    title: "Letters to Tomorrow",
    excerpt: "Dear future self, I hope you remember this feeling...",
    lastEdited: "3 days ago",
    wordCount: 2341,
  },
]

export function RecentStories() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-foreground/80">Recent stories</h2>

      <div className="grid gap-3">
        {mockStories.map((story) => (
          <Card key={story.id} className="p-4 hover:bg-secondary/30 transition-colors group cursor-pointer">
            <Link href={`/editor?story=${story.id}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{story.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.lastEdited}
                    </span>
                    <span>{story.wordCount.toLocaleString()} words</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <Button variant="ghost" asChild className="w-full">
        <Link href="/archive">View all stories</Link>
      </Button>
    </div>
  )
}
