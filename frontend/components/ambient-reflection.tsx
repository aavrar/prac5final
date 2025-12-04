"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

const reflections = [
    "Tonight you're carrying something heavy.",
    "Maybe it's the PhD applications.",
    "Maybe it's the six-month mark.",
    "Maybe it's just December in Indiana—",
    "that particular Midwest cold that makes",
    "you think about everywhere else you could be.",
    "It's okay to just be here."
]

export function AmbientReflection() {
    const [index, setIndex] = useState(0)
    const [showExit, setShowExit] = useState(false)

    useEffect(() => {
        if (index < reflections.length) {
            const timer = setTimeout(() => {
                setIndex(prev => prev + 1)
            }, 4000) // 4 seconds per line
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => {
                setShowExit(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [index])

    return (
        <div className="fixed inset-0 bg-[var(--background)] z-50 flex flex-col items-center justify-center p-8 cursor-none">
            <div className="max-w-2xl w-full text-center space-y-8">
                <AnimatePresence mode="wait">
                    {reflections.slice(0, index + 1).map((text, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className={`text-xl md:text-3xl font-serif text-[var(--foreground)] leading-relaxed ${i === reflections.length - 1 ? "opacity-100" : "opacity-60"
                                }`}
                        >
                            {text}
                        </motion.p>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showExit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-12 cursor-auto"
                    >
                        <p className="text-sm text-muted-foreground mb-4 font-sans tracking-widest uppercase text-center">
                            Want to sit with this, or work through it?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="ghost" asChild className="hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors">
                                <Link href="/">Sit with it (Stay)</Link>
                            </Button>
                            <Button variant="outline" asChild className="border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors">
                                <Link href="/editor">Work through it (Write)</Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-6 right-6 opacity-0 hover:opacity-100 transition-opacity duration-500 cursor-auto">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
