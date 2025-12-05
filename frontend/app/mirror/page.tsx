"use client"

import { useState } from "react"
import { UnwrittenStoryGenerator } from "@/components/unwritten-story-generator"
import { StyleMimicPlayground } from "@/components/style-mimic-playground"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, PenTool } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function MirrorPage() {
    return (
        <>
            <Navigation />
            <div className="container mx-auto py-12 px-4 max-w-5xl md:pl-32">
                <div className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl font-serif font-bold tracking-tight">The Mirror</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Reflect on your creative identity. See the stories you haven't written yet, and watch your voice applied to new contexts.
                    </p>
                </div>

                <Tabs defaultValue="unwritten" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="unwritten" className="gap-2">
                                <Sparkles className="w-4 h-4" />
                                The Unwritten Story
                            </TabsTrigger>
                            <TabsTrigger value="mimic" className="gap-2">
                                <PenTool className="w-4 h-4" />
                                Write Like Me
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="unwritten" className="space-y-4">
                        <UnwrittenStoryGenerator />
                    </TabsContent>

                    <TabsContent value="mimic" className="space-y-4">
                        <StyleMimicPlayground />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
