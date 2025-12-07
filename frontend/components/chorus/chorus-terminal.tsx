"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, PenTool, Triangle, Hexagon, Circle, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AgentType = 'Architect' | 'Poet' | 'Critic' | 'System';

interface Message {
    agent: AgentType;
    content: string;
    timestamp: number;
}

export function ChorusTerminal() {
    const [particle, setParticle] = useState("")
    const [isDebating, setIsDebating] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    const [status, setStatus] = useState<'idle' | 'debating' | 'structuring' | 'generating' | 'weaving' | 'complete'>('idle');
    const [finalStory, setFinalStory] = useState<string | null>(null); // Changed to string
    const [storyTitle, setStoryTitle] = useState("");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, status])

    const startDebate = async () => {
        if (!particle.trim()) return;

        setIsDebating(true);
        setStatus('debating');
        setMessages(prev => [...prev, { agent: 'System', content: `Injecting Particle: "${particle}"...`, timestamp: Date.now() }]);

        try {
            const response = await fetch('/api/chorus/debate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: "user_123_quantum",
                    particle: particle
                })
            });

            if (!response.body) return;
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const jsonRegex = /\{"agent":\s*"[^"]+",\s*"content":\s*"[^"]*"(?:,\s*"timestamp":\s*\d+)?\}/g;

                let match;
                while ((match = jsonRegex.exec(buffer)) !== null) {
                    try {
                        const msg = JSON.parse(match[0]);
                        setMessages(prev => {
                            if (prev.some(m => m.content === msg.content && m.agent === msg.agent)) return prev;
                            return [...prev, { ...msg, timestamp: Date.now() }];
                        });
                    } catch (e) {
                        console.error('Error parsing JSON match', e);
                    }
                }

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const params = line.trim();
                    if (!params) continue;
                    try {
                        const cleaned = params.replace(/^data:\s*/, '');
                        if (cleaned.startsWith('{')) {
                            const msg = JSON.parse(cleaned);
                            setMessages(prev => [...prev, { ...msg, timestamp: Date.now() }]);
                        }
                    } catch (e) { }
                }
            }

        } catch (error) {
            console.error("Debate Error", error);
            setMessages(prev => [...prev, { agent: 'System', content: "Connection lost.", timestamp: Date.now() }]);
        } finally {
            setIsDebating(false);
            setStatus('idle');
        }
    };

    const generateStory = async () => {
        setStatus('structuring');
        try {
            // 1. Structure
            const structRes = await fetch('/api/chorus/structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: "user_123_quantum", particle, history: messages })
            });
            const structure = await structRes.json();
            setStoryTitle(structure.title);
            setMessages(prev => [...prev, { agent: 'System', content: `Structure Locked: ${structure.title}. Generating...`, timestamp: Date.now() }]);

            // 2. Generate Threads
            setStatus('generating');
            const genRes = await fetch('/api/chorus/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: "user_123_quantum", beats: structure.beats, title: structure.title })
            });
            const genResult = await genRes.json();

            // 3. Weave
            setStatus('weaving');
            // Optimistic update message
            setMessages(prev => [...prev, { agent: 'System', content: "Threads generated. Weaving into final narrative...", timestamp: Date.now() }]);

            const weaveRes = await fetch('/api/chorus/weave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ threads: genResult.threads, title: structure.title })
            });
            const weaveResult = await weaveRes.json();

            setFinalStory(weaveResult.story);
            setStatus('complete');

        } catch (error) {
            console.error("Generation failed", error);
            setMessages(prev => [...prev, { agent: 'System', content: "Generation Error.", timestamp: Date.now() }]);
            setStatus('idle');
        }
    };

    const getAgentIcon = (agent: AgentType) => {
        switch (agent) {
            case 'Architect': return <Hexagon className="w-4 h-4" />;
            case 'Poet': return <Sparkles className="w-4 h-4" />;
            case 'Critic': return <Triangle className="w-4 h-4" />;
            default: return <Bot className="w-4 h-4" />;
        }
    }

    const getAgentStyles = (agent: AgentType) => {
        switch (agent) {
            case 'Architect': return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
            case 'Poet': return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
            case 'Critic': return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
            default: return "bg-muted text-muted-foreground";
        }
    }

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border shadow-sm bg-card/50 backdrop-blur-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 font-normal">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </Badge>
                        <span className="text-sm text-muted-foreground font-medium">Chorus Studio</span>
                    </div>
                    {messages.length > 2 && status === 'idle' && (
                        <Button size="sm" onClick={generateStory} className="gap-2">
                            <PenTool className="w-4 h-4" />
                            Manifest Story
                        </Button>
                    )}
                </div>

                {/* Chat Area */}
                <ScrollArea className="h-[500px] p-6">
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {messages.length === 0 && (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Awaiting Provocation</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                        Enter a constraint, theme, or "What if" scenario to wake the agents.
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex gap-4 group",
                                msg.agent === 'System' ? "justify-center" : ""
                            )}>
                                {msg.agent !== 'System' && (
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                                        getAgentStyles(msg.agent)
                                    )}>
                                        {getAgentIcon(msg.agent)}
                                    </div>
                                )}

                                <div className={cn(
                                    "space-y-1 max-w-[85%]",
                                    msg.agent === 'System' ? "text-center" : ""
                                )}>
                                    {msg.agent !== 'System' && (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            {msg.agent}
                                        </span>
                                    )}
                                    <div className={cn(
                                        "text-sm leading-relaxed",
                                        msg.agent === 'System'
                                            ? "text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border"
                                            : "p-3 rounded-lg border bg-background/50 shadow-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {status === 'generating' && (
                            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span>Weaving Quantum Threads...</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-1 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary animate-[progress_1s_ease-in-out_infinite]"
                                                style={{ animationDelay: `${i * 0.2}s` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {status === 'weaving' && (
                            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Sparkles className="w-4 h-4 animate-bounce text-purple-500" />
                                    <span>Stitching Narrative...</span>
                                </div>
                                <div className="h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '90%' }}></div>
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-muted/30">
                    <div className="flex gap-4 max-w-3xl mx-auto">
                        <Input
                            value={particle}
                            onChange={(e) => setParticle(e.target.value)}
                            placeholder="Enter a constraint (e.g. 'A story about a map to nowhere')..."
                            className="bg-background shadow-sm"
                            onKeyDown={(e) => e.key === 'Enter' && !isDebating && status === 'idle' && startDebate()}
                            disabled={isDebating || status !== 'idle'}
                        />
                        <Button
                            onClick={startDebate}
                            disabled={isDebating || !particle || status !== 'idle'}
                        >
                            {isDebating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Collide"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Result Area */}
            {status === 'complete' && finalStory && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Card className="p-8 md:p-12 space-y-8 bg-card border shadow-sm max-w-3xl mx-auto">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{storyTitle}</h2>
                            <div className="flex justify-center">
                                <Badge variant="secondary" className="font-normal font-sans">Final Weave</Badge>
                            </div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed">
                            <div className="whitespace-pre-wrap">{finalStory}</div>
                        </div>

                        <div className="flex justify-center pt-8 border-t">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/stories', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                user_id: "user_123_quantum",
                                                title: storyTitle,
                                                content: finalStory,
                                                premise: particle,
                                                type: 'draft'
                                            })
                                        });
                                        if (response.ok) {
                                            window.location.href = '/archive';
                                        }
                                    } catch (e) {
                                        console.error('Failed to save', e);
                                    }
                                }}
                            >
                                <Sparkles className="w-4 h-4" />
                                Save to Archive
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
