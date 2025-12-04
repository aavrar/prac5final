"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileText } from "lucide-react"
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
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleUpload = async () => {
        if (!title || !content) {
            toast.error("Please provide both a title and content")
            return
        }

        setUploading(true)

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
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Story uploaded and analyzed", {
                    description: `Themes detected: ${data.analysis?.themes?.join(", ")}`
                })
                setOpen(false)
                setTitle("")
                setContent("")
                // Ideally trigger a refresh of the archive view here
                window.location.reload() // Simple refresh for now
            } else {
                throw new Error(data.error || "Upload failed")
            }
        } catch (error) {
            toast.error("Failed to upload story")
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Story
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Upload Existing Story</DialogTitle>
                    <DialogDescription>
                        Paste your story below. The system will analyze it to update your creative tensor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter story title..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your story text here..."
                            className="h-[200px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {uploading ? "Analyzing..." : "Upload & Analyze"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
