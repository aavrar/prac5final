"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowRight, Wand2, Loader2 } from "lucide-react"

export function StyleMimicPlayground() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRewrite = async () => {
        if (!input.trim()) return
        setLoading(true)
        try {
            const response = await fetch('/api/mirror/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: "user_123_quantum",
                    text: input
                })
            })
            const data = await response.json()
            setOutput(data.rewritten)
        } catch (error) {
            console.error("Failed to rewrite text", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-serif font-semibold">Style Mimicry</h2>
                <p className="text-muted-foreground">
                    Test the system's understanding of your voice. Paste any text (a news headline, a recipe, a boring email)
                    and watch it get rewritten as if <em>you</em> wrote it.
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                <Card className="p-4 h-80 flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Input Text</label>
                    <Textarea
                        placeholder="Paste boring text here..."
                        className="flex-1 resize-none border-none focus-visible:ring-0 p-0 text-base leading-relaxed"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </Card>

                <div className="flex justify-center">
                    <Button
                        size="icon"
                        className="rounded-full w-12 h-12"
                        onClick={handleRewrite}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    </Button>
                </div>

                <Card className="p-4 h-80 flex flex-col bg-muted/30">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Your Voice</label>
                    <div className="flex-1 overflow-y-auto text-base leading-relaxed font-serif italic text-foreground/90">
                        {output ? output : <span className="text-muted-foreground/50 not-italic">Rewritten text will appear here...</span>}
                    </div>
                </Card>
            </div>
        </div>
    )
}
