"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Sparkles, BookOpen } from "lucide-react"

export function UnwrittenStoryGenerator() {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [story, setStory] = useState<{ title: string; premise: string; opening: string } | null>(null)
    const router = useRouter()

    const generateStory = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/mirror/unwritten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: "user_123_quantum" })
            })
            const data = await response.json()
            setStory(data)
        } catch (error) {
            console.error("Failed to generate story", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveAndContinue = async () => {
        if (!story) return
        setSaving(true)
        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "user_123_quantum",
                    title: story.title,
                    content: story.opening,
                    premise: story.premise,
                    type: 'draft'
                })
            })
            const data = await response.json()
            if (data.success) {
                router.push(`/editor?story=${data.story_id}`)
            }
        } catch (error) {
            console.error("Failed to save story", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-serif font-semibold">Dream a New Dream</h2>
                <p className="text-muted-foreground">
                    Based on your recurring motifs, emotional landscape, and stylistic preferences,
                    the AI will hallucinate a story that feels distinctly <em>yours</em>.
                </p>
                <Button
                    size="lg"
                    onClick={generateStory}
                    disabled={loading}
                    className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? "Dreaming..." : "Generate Unwritten Story"}
                </Button>
            </div>

            {story && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-8 border-2 border-[var(--accent)]/20 shadow-xl bg-card/50 backdrop-blur-sm">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/10 mb-4">
                                    <BookOpen className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-foreground">{story.title}</h3>
                                <div className="w-24 h-1 bg-[var(--accent)]/30 mx-auto rounded-full" />
                            </div>

                            <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">The Premise</h4>
                                <p className="text-lg font-medium leading-relaxed">{story.premise}</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Opening Paragraph</h4>
                                <p className="text-lg font-serif leading-loose text-foreground/90 italic">
                                    "{story.opening}"
                                </p>
                            </div>

                            <div className="flex justify-center pt-4 border-t border-border/50">
                                <Button
                                    onClick={handleSaveAndContinue}
                                    disabled={saving}
                                    className="gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                    Save & Continue to Editor
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
