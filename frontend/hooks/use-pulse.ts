"use client"

import { useState, useEffect, useCallback } from 'react'

export interface PulseMetrics {
    wpm: number;
    flowScore: number; // 0-100 (100 = seamless flow, 0 = high friction/editing)
    dominance: 'Analysis' | 'Intuition' | 'Critical';
}

export function usePulse() {
    const [metrics, setMetrics] = useState<PulseMetrics>({
        wpm: 0,
        flowScore: 50,
        dominance: 'Intuition'
    });

    // Volatile stats
    const [keystrokes, setKeystrokes] = useState<number[]>([]);
    const [backspaces, setBackspaces] = useState<number>(0);

    // Update Pulse every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            // Filter keystrokes from last 10 seconds
            const recent = keystrokes.filter(t => now - t < 10000);

            // Calculate WPM (Chars / 5) * (60 / 10s) = Chars * 1.2
            const wpm = Math.floor((recent.length / 5) * 6);

            // Calculate Flow Score
            // Backspaces are penalties. High speed offsets penalties.
            // Formula: Base 100 - (Backspaces * 5)
            // If WPM > 60, recover flow points.
            let flow = 100 - (backspaces * 5);
            if (wpm > 60) flow += 10;
            if (wpm > 90) flow += 10;
            flow = Math.max(0, Math.min(100, flow));

            // Determine Dominance
            let dom: PulseMetrics['dominance'] = 'Intuition';
            if (backspaces > recent.length * 0.2) dom = 'Critical'; // >20% deletions
            else if (wpm < 20) dom = 'Analysis'; // Slow typing
            else dom = 'Intuition'; // Fast, forward motion

            setMetrics({ wpm, flowScore: flow, dominance: dom });

            // Decay backspaces
            setBackspaces(prev => Math.max(0, prev - 1));

        }, 3000);

        return () => clearInterval(interval);
    }, [keystrokes, backspaces]);

    const recordKeystroke = useCallback((key: string) => {
        const now = Date.now();
        if (key === 'Backspace') {
            setBackspaces(prev => prev + 1);
        } else if (key.length === 1) { // Ignore modifiers
            setKeystrokes(prev => [...prev.slice(-100), now]); // Keep last 100
        }
    }, []);

    return { metrics, recordKeystroke };
}
