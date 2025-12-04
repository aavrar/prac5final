"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface MoodDialProps {
    value: number
    onChange: (value: number) => void
    className?: string
}

export function MoodDial({ value, onChange, className }: MoodDialProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex justify-between text-xs font-sans tracking-widest uppercase text-muted-foreground">
                <span>Contemplative</span>
                <span>Urgent</span>
            </div>

            <Slider
                defaultValue={[50]}
                value={[value]}
                max={100}
                step={1}
                onValueChange={(vals) => onChange(vals[0])}
                className="cursor-grab active:cursor-grabbing"
            />

            <div className="flex justify-between text-xs font-sans tracking-widest uppercase text-muted-foreground">
                <span>Quiet</span>
                <span>Raw</span>
            </div>
        </div>
    )
}
