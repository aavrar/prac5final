"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { usePulse } from "@/hooks/use-pulse"
import { useAtmosphere } from "@/hooks/use-atmosphere"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Activity, Clock, Trash2, Ghost, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AntimatterPage() {
    const { metrics, recordKeystroke } = usePulse()
    const atmosphere = useAtmosphere()

    const [content, setContent] = useState("")
    const [lastContent, setLastContent] = useState("")
    // Store objects with real text and display (redacted) text
    const [antimatter, setAntimatter] = useState<{ display: string, real: string }[]>([])
    const [dare, setDare] = useState<{ insight: string, dare: string } | null>(null);
    const [isConfronting, setIsConfronting] = useState(false);

    const handleConfront = async () => {
        setIsConfronting(true);
        try {
            // Send the REAL text to the API
            const realText = antimatter.map(a => a.real);
            const res = await fetch('/api/antimatter/confront', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ antimatter: realText })
            });
            const data = await res.json();
            setDare(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsConfronting(false);
        }
    };

    // Antimatter Tracking Logic
    useEffect(() => {
        // Did we shrink?
        if (content.length < lastContent.length) {
            const diff = lastContent.length - content.length;
            // If significant deletion (> 5 chars)
            if (diff > 5) {
                // Find WHERE the deletion happened to capture the text
                // Simple heuristic: find the first index where they differ
                let i = 0;
                while (i < content.length && i < lastContent.length && content[i] === lastContent[i]) {
                    i++;
                }
                // The deleted chunk is from i to i + diff in lastContent
                const deletedText = lastContent.slice(i, i + diff);

                const vanished = "█".repeat(Math.min(diff, 50)); // Cap visual length
                setAntimatter(prev => [...prev, { display: vanished, real: deletedText }]);
            }
        }
        setLastContent(content);
    }, [content]);

    return (
        <>
            <Navigation />
            <main className="min-h-screen p-6 md:p-12 md:pl-32 bg-background text-foreground transition-colors duration-1000">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header with Biometrics */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
                                <Ghost className="w-8 h-8 text-primary" />
                                The Antimatter Engine
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Writing in Negative Space. We track what you destroy.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Card className="p-3 flex items-center gap-3 bg-card/50 backdrop-blur-sm">
                                <Activity className={cn("w-5 h-5", metrics.flowScore > 80 ? "text-green-500" : "text-amber-500")} />
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase font-medium">Pulse</div>
                                    <div className="font-mono font-bold">{metrics.wpm} WPM / {metrics.flowScore}% Flow</div>
                                </div>
                            </Card>
                            <Card className="p-3 flex items-center gap-3 bg-card/50 backdrop-blur-sm">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase font-medium">{atmosphere.timeOfDay}</div>
                                    <div className="font-mono font-bold text-primary">{atmosphere.suggestedMode} Mode</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* The Void Editor */}
                    <div className="grid md:grid-cols-3 gap-8 h-[600px]">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">Active Matter</span>
                                <Badge variant="outline" className={cn(
                                    "transition-colors",
                                    metrics.dominance === 'Intuition' ? "border-green-500 text-green-500" :
                                        metrics.dominance === 'Critical' ? "border-red-500 text-red-500" : "border-blue-500 text-blue-500"
                                )}>
                                    State: {metrics.dominance}
                                </Badge>
                            </div>
                            <Textarea
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    recordKeystroke(e.key);
                                }}
                                placeholder="Write something you are afraid to say..."
                                className="h-full bg-card/50 border-input text-lg font-serif leading-relaxed resize-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* The Shadow Realm */}
                        <div className="space-y-4 relative">
                            <div className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">Antimatter (Deleted)</span>
                            </div>

                            <div className="h-full rounded-lg border bg-muted/20 p-4 overflow-hidden relative flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
                                <div className="flex-1 space-y-2 opacity-50 font-mono text-xs text-destructive break-all select-none blur-[1px]">
                                    {antimatter.map((chunk, i) => (
                                        <div key={i} className="animate-in fade-in duration-1000">
                                            {chunk.display}
                                        </div>
                                    ))}
                                </div>

                                {antimatter.length > 0 && !dare && (
                                    <div className="mt-4 z-10 p-2">
                                        <Card className="bg-destructive/10 border-destructive/20 p-4 backdrop-blur-md cursor-pointer hover:bg-destructive/20 transition-colors group" onClick={handleConfront}>
                                            <div className="flex gap-3">
                                                <div className="pt-1">
                                                    {isConfronting ? (
                                                        <Activity className="w-5 h-5 text-destructive animate-spin" />
                                                    ) : (
                                                        <Moon className="w-5 h-5 text-destructive group-hover:scale-110 transition-transform" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold text-destructive">Confront Shadow</h4>
                                                    <p className="text-xs text-destructive/70">
                                                        The engine detects unspoken patterns. Click to invert.
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {dare && (
                                    <div className="mt-4 z-10 p-2 animate-in slide-in-from-bottom-2">
                                        <Card className="bg-primary/10 border-primary/20 p-4 backdrop-blur-md">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Ghost className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold uppercase text-primary">Shadow Insight</span>
                                                </div>
                                                <p className="text-sm text-foreground/80 italic">
                                                    "{dare.insight}"
                                                </p>
                                                <div className="pt-2 border-t border-primary/10">
                                                    <span className="text-xs font-bold text-primary block mb-1">DARE:</span>
                                                    <p className="text-sm font-bold text-foreground">
                                                        {dare.dare}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    )
}
