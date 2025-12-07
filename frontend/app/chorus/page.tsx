"use client"

import { Navigation } from "@/components/navigation"
import { ChorusTerminal } from "@/components/chorus/chorus-terminal"

export default function ChorusPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen p-6 md:p-12 md:pl-32">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-serif font-bold tracking-tight">
                            Quantum Chorus
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Initiate multi-agent narrative synthesis. Three voices, one story.
                        </p>
                    </div>

                    <ChorusTerminal />
                </div>
            </main>
        </>
    )
}
