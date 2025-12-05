"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, Sparkles, FileText } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StoryUploader() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [showAnalysisDialog, setShowAnalysisDialog] = useState(false)

    const handleAnalyze = async () => {
        if (!title.trim() || !content.trim()) return

        setAnalyzing(true)
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            })

            const data = await response.json()

            if (data.success) {
                setAnalysisResult(data.analysis)
                setShowAnalysisDialog(true)
            } else {
                // If analysis fails, ask user if they want to proceed anyway
                if (confirm("Analysis failed. Upload without AI metadata?")) {
                    handleUpload({})
                }
            }
        } catch (error) {
            console.error("Analysis error:", error)
            toast.error("Failed to analyze story")
        } finally {
            setAnalyzing(false)
        }
    }

    const handleUpload = async (finalAnalysis: any) => {
        setLoading(true)
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 'user_123_quantum', // Hardcoded for prototype
                    title,
                    content,
                    analysis: finalAnalysis
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Upload failed")
            }

            toast.success("Story uploaded successfully!")
            setOpen(false)
            setShowAnalysisDialog(false)
            setTitle("")
            setContent("")
            // Ideally trigger a refresh of the archive view here
            window.location.reload() // Simple refresh for now
        } catch (error) {
            toast.error("Failed to upload story")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Story
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Upload a Story</DialogTitle>
                        <DialogDescription>
                            Add an existing story to your Quantum Archive.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="The name of your story"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your story content here..."
                                className="min-h-[200px] font-serif"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleAnalyze}
                            disabled={loading || analyzing || !title.trim() || !content.trim()}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Analyze & Upload
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Analysis Review Dialog */}
            <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Quantum Analysis</DialogTitle>
                        <DialogDescription>
                            Gemini has detected the following patterns in your story.
                        </DialogDescription>
                    </DialogHeader>

                    {analysisResult && (
                        <div className="space-y-4 py-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Emotional Valence</h4>
                                <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-md inline-block text-sm font-medium">
                                    {analysisResult.emotional_valence}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.themes?.map((theme: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-muted text-xs rounded-full">
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Motifs</h4>
                                <div className="text-sm text-foreground/80">
                                    {analysisResult.motifs?.join(", ")}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => handleUpload({})}
                            disabled={loading}
                        >
                            Upload without Analysis
                        </Button>
                        <Button
                            onClick={() => handleUpload(analysisResult)}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm & Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
