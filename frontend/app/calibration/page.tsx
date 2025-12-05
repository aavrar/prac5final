"use client"

import { useEffect, useState } from "react"
import { CalibrationChat } from "@/components/calibration/CalibrationChat"
import { UserTensor } from "@/lib/types"
import { Loader2, BookOpen, Heart, Activity, Brain } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"

export default function CalibrationPage() {
    const [tensor, setTensor] = useState<UserTensor | null>(null)
    const [loading, setLoading] = useState(true)
    const userId = "user_123_quantum" // Hardcoded for prototype

    const fetchTensor = async () => {
        try {
            const res = await fetch(`/api/tensor?user_id=${userId}`)
            const data = await res.json()
            if (data && !data.error) {
                setTensor(data)
            }
        } catch (error) {
            console.error("Failed to fetch tensor", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTensor()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <>
            <Navigation />
            <main className="min-h-screen p-6 md:p-12 md:pl-32">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif">Calibration Engine</h1>
                        <p className="text-muted-foreground text-lg">
                            This is the "Brain" of the system. Chat with the engine to refine its understanding of you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Visualization */}
                        <div className="space-y-8">
                            {tensor ? (
                                <div className="space-y-8">
                                    {/* Cultural Coordinates */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <BookOpen className="w-5 h-5" />
                                            <h3 className="font-medium uppercase tracking-widest text-sm">Cultural Coordinates</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {tensor.cultural_coordinates?.heritage?.map((h: any, i: number) => (
                                                <div key={i} className="bg-card border p-4 rounded-lg shadow-sm">
                                                    <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Heritage</span>
                                                    <span className="font-medium">{h.region || h.context}</span>
                                                </div>
                                            ))}
                                            <div className="bg-card border p-4 rounded-lg shadow-sm">
                                                <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Primary Language</span>
                                                <span className="font-medium">{tensor.cultural_coordinates?.linguistics?.primary || 'N/A'}</span>
                                            </div>
                                            <div className="bg-card border p-4 rounded-lg shadow-sm">
                                                <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Secondary Language</span>
                                                <span className="font-medium">{tensor.cultural_coordinates?.linguistics?.secondary || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Emotional Landscape */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Heart className="w-5 h-5" />
                                            <h3 className="font-medium uppercase tracking-widest text-sm">Emotional Landscape</h3>
                                        </div>
                                        <div className="bg-card border p-6 rounded-lg shadow-sm space-y-6">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Current Valence</span>
                                                    <span className="font-medium">{tensor.emotional_landscape?.current_state?.valence || 'Neutral'}</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: '50%' }} // Dynamic width could be mapped to valence
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-muted-foreground mb-3 uppercase tracking-wider">Active Conflicts</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {tensor.emotional_landscape?.active_conflicts?.map((c: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Intellectual Frameworks */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Brain className="w-5 h-5" />
                                            <h3 className="font-medium uppercase tracking-widest text-sm">Intellectual Frameworks</h3>
                                        </div>
                                        <div className="bg-card border p-6 rounded-lg shadow-sm">
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">Fandoms & Metaphors</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tensor.intellectual_frameworks?.fandoms?.map((f: any, i: number) => (
                                                            <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm border">
                                                                {f.domain}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    Failed to load tensor data.
                                </div>
                            )}
                        </div>

                        {/* Right Column: Chat */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <CalibrationChat userId={userId} onTensorUpdate={fetchTensor} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
