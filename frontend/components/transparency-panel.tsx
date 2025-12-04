"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Eye, Activity, BookOpen, Heart } from "lucide-react"
import { MOCK_USER_TENSOR } from "@/lib/mockData"

export function TransparencyPanelContent() {
    return (
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="mb-6">
                <SheetTitle className="font-serif text-2xl">Trust Made Visible</SheetTitle>
                <SheetDescription>
                    This is what the system knows about you right now. You can delete or modify this data at any time.
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
                {/* Cultural Coordinates */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                        <BookOpen className="w-4 h-4" />
                        <h3 className="font-medium uppercase tracking-widest text-xs">Cultural Coordinates</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {MOCK_USER_TENSOR.cultural_coordinates.heritage.map((h: any, i: number) => (
                            <div key={i} className="bg-muted/30 p-3 rounded-md text-sm">
                                <span className="block text-xs text-muted-foreground mb-1">Heritage</span>
                                {h.region || h.context}
                            </div>
                        ))}
                        <div className="bg-muted/30 p-3 rounded-md text-sm">
                            <span className="block text-xs text-muted-foreground mb-1">Primary Language</span>
                            {MOCK_USER_TENSOR.cultural_coordinates.linguistics.primary}
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md text-sm">
                            <span className="block text-xs text-muted-foreground mb-1">Secondary Language</span>
                            {MOCK_USER_TENSOR.cultural_coordinates.linguistics.secondary}
                        </div>
                    </div>
                </section>

                {/* Emotional Landscape */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                        <Heart className="w-4 h-4" />
                        <h3 className="font-medium uppercase tracking-widest text-xs">Emotional Landscape</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-muted/30 p-4 rounded-md">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Current Valence</span>
                                <span>{MOCK_USER_TENSOR.emotional_landscape.current_state.valence}</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--accent)]"
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {MOCK_USER_TENSOR.emotional_landscape.active_conflicts.map((c: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-muted/30 rounded text-xs text-muted-foreground">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Real-time Context */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                        <Activity className="w-4 h-4" />
                        <h3 className="font-medium uppercase tracking-widest text-xs">Real-time Context</h3>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Time</span>
                            <span>2:00 AM (Creative Peak)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Heart Rate</span>
                            <span>72 BPM (Steady)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Motion</span>
                            <span>Stationary</span>
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-border flex flex-col gap-2">
                    <Button variant="outline" className="w-full">Export my data</Button>
                    <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                        Forget this session
                    </Button>
                </div>
            </div>
        </SheetContent>
    )
}
