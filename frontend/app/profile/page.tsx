"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getUserTensor } from "@/lib/mockData"
import { Globe, MessageCircle, Book, Pen, Heart, Clock, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import type { UserTensor } from "@/lib/types"

export default function ProfilePage() {
  const [tensor, setTensor] = useState<UserTensor>(getUserTensor())
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState(tensor)

  useEffect(() => {
    const loadedTensor = getUserTensor()
    setTensor(loadedTensor)
    setEditForm(loadedTensor)
  }, [])

  const handleEdit = () => {
    setEditForm(tensor)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    try {
      setTensor(editForm)
      localStorage.setItem('user_tensor', JSON.stringify(editForm))

      const response = await fetch('/api/tensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        console.log('Tensor saved to MongoDB successfully')
      } else {
        console.error('Failed to save tensor to MongoDB')
      }
    } catch (error) {
      console.error('Error saving tensor:', error)
    } finally {
      setIsEditOpen(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen md:pl-32">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 mb-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-serif font-semibold">Your Tensor</h1>
              <p className="text-sm text-muted-foreground">The dimensions that shape your stories</p>
            </div>
            <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cultural Coordinates */}
            <Card className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '0ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="w-4 h-4 text-[var(--color-ambient)]" />
                  Cultural Coordinates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Heritage</p>
                  {tensor.cultural_coordinates.heritage.map((h, i) => (
                    <p key={i} className="text-sm">
                      {'region' in h ? h.region : h.context}
                      {' '}
                      <span className="text-muted-foreground text-xs">
                        {'weight' in h ? `(${(h.weight * 100).toFixed(0)}%)` : `(Gen ${h.generation})`}
                      </span>
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Languages</p>
                  <p className="text-sm">
                    {tensor.cultural_coordinates.linguistics.primary}, {tensor.cultural_coordinates.linguistics.secondary}, {tensor.cultural_coordinates.linguistics.tertiary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Code-switching: {tensor.cultural_coordinates.linguistics.code_switching_patterns.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Faith</p>
                  <p className="text-sm">{tensor.cultural_coordinates.faith_framework.tradition}</p>
                  <p className="text-xs text-muted-foreground">
                    {tensor.cultural_coordinates.faith_framework.key_concepts.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Frameworks */}
            <Card className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Book className="w-4 h-4 text-[var(--color-constellation)]" />
                  Intellectual Frameworks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Disciplines</p>
                  {tensor.intellectual_frameworks.disciplines.map((d, i) => (
                    <p key={i} className="text-sm">{d}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Core Concepts</p>
                  {tensor.intellectual_frameworks.core_concepts.map((c, i) => (
                    <p key={i} className="text-sm">{c}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Influences</p>
                  {tensor.intellectual_frameworks.fandoms.map((f, i) => (
                    <p key={i} className="text-sm">{f.domain}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Creative Voice */}
            <Card className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pen className="w-4 h-4 text-[var(--color-ghost-text)]" />
                  Creative Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Syntax</p>
                  <p className="text-sm">{tensor.creative_voice.syntax_rhythm}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Diction</p>
                  <p className="text-sm">{tensor.creative_voice.diction}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Metaphor Density</p>
                  <p className="text-sm">{tensor.creative_voice.metaphor_density}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Recurring Motifs</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tensor.creative_voice.recurring_motifs.map((m, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted">{m}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Landscape */}
            <Card className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Emotional Landscape
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Current State</p>
                  <p className="text-sm">{tensor.emotional_landscape.current_state.dominant_emotion}</p>
                  <p className="text-xs text-muted-foreground">
                    {tensor.emotional_landscape.current_state.valence} • {tensor.emotional_landscape.current_state.arousal}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Processed Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {tensor.emotional_landscape.processed_themes.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Active Conflicts</p>
                  {tensor.emotional_landscape.active_conflicts.map((c, i) => (
                    <p key={i} className="text-sm">{c}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contextual Signals */}
            <Card className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Contextual Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Time</p>
                  <p className="text-sm">{tensor.contextual_signals.local_time}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Heart Rate</p>
                  <p className="text-sm">{tensor.contextual_signals.heart_rate} BPM</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Device</p>
                  <p className="text-sm">{tensor.contextual_signals.device}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Recent Consumption</p>
                  {tensor.contextual_signals.recent_consumption.map((r, i) => (
                    <p key={i} className="text-sm italic">{r}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Card */}
            <Card className="animate-in fade-in slide-in-from-bottom-4 md:col-span-2 lg:col-span-1" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="w-4 h-4 text-indigo-500" />
                  About Your Tensor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This tensor represents the complete you—cultural context, creative voice, emotional landscape, and intellectual frameworks.
                  Every story generated is shaped by these dimensions, ensuring deeply personalized narratives.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Your Tensor</DialogTitle>
            <DialogDescription>
              Update your profile to shape how AI generates personalized stories for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Cultural Coordinates */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Cultural Coordinates
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heritage-region">Heritage Region</Label>
                  <Input
                    id="heritage-region"
                    value={(editForm.cultural_coordinates.heritage[0] as any).region || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      cultural_coordinates: {
                        ...editForm.cultural_coordinates,
                        heritage: [
                          { ...(editForm.cultural_coordinates.heritage[0] as any), region: e.target.value },
                          editForm.cultural_coordinates.heritage[1]
                        ]
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="primary-language">Primary Language</Label>
                  <Input
                    id="primary-language"
                    value={editForm.cultural_coordinates.linguistics.primary}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      cultural_coordinates: {
                        ...editForm.cultural_coordinates,
                        linguistics: {
                          ...editForm.cultural_coordinates.linguistics,
                          primary: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="secondary-language">Secondary Language</Label>
                  <Input
                    id="secondary-language"
                    value={editForm.cultural_coordinates.linguistics.secondary}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      cultural_coordinates: {
                        ...editForm.cultural_coordinates,
                        linguistics: {
                          ...editForm.cultural_coordinates.linguistics,
                          secondary: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="tertiary-language">Tertiary Language</Label>
                  <Input
                    id="tertiary-language"
                    value={editForm.cultural_coordinates.linguistics.tertiary || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      cultural_coordinates: {
                        ...editForm.cultural_coordinates,
                        linguistics: {
                          ...editForm.cultural_coordinates.linguistics,
                          tertiary: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="faith-tradition">Faith Tradition</Label>
                  <Input
                    id="faith-tradition"
                    value={editForm.cultural_coordinates.faith_framework.tradition}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      cultural_coordinates: {
                        ...editForm.cultural_coordinates,
                        faith_framework: {
                          ...editForm.cultural_coordinates.faith_framework,
                          tradition: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Creative Voice */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Pen className="w-4 h-4" />
                Creative Voice
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="syntax">Syntax & Rhythm</Label>
                  <Input
                    id="syntax"
                    value={editForm.creative_voice.syntax_rhythm}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      creative_voice: {
                        ...editForm.creative_voice,
                        syntax_rhythm: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="diction">Diction</Label>
                  <Input
                    id="diction"
                    value={editForm.creative_voice.diction}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      creative_voice: {
                        ...editForm.creative_voice,
                        diction: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="metaphor-density">Metaphor Density</Label>
                  <Input
                    id="metaphor-density"
                    value={editForm.creative_voice.metaphor_density}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      creative_voice: {
                        ...editForm.creative_voice,
                        metaphor_density: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="motifs">Recurring Motifs (comma-separated)</Label>
                  <Input
                    id="motifs"
                    value={editForm.creative_voice.recurring_motifs.join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      creative_voice: {
                        ...editForm.creative_voice,
                        recurring_motifs: e.target.value.split(',').map(m => m.trim())
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Emotional Landscape */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Emotional Landscape
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dominant-emotion">Dominant Emotion</Label>
                  <Input
                    id="dominant-emotion"
                    value={editForm.emotional_landscape.current_state.dominant_emotion}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      emotional_landscape: {
                        ...editForm.emotional_landscape,
                        current_state: {
                          ...editForm.emotional_landscape.current_state,
                          dominant_emotion: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="valence">Valence</Label>
                  <Input
                    id="valence"
                    value={editForm.emotional_landscape.current_state.valence}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      emotional_landscape: {
                        ...editForm.emotional_landscape,
                        current_state: {
                          ...editForm.emotional_landscape.current_state,
                          valence: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="processed-themes">Processed Themes (comma-separated)</Label>
                  <Input
                    id="processed-themes"
                    value={editForm.emotional_landscape.processed_themes.join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      emotional_landscape: {
                        ...editForm.emotional_landscape,
                        processed_themes: e.target.value.split(',').map(t => t.trim())
                      }
                    })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="active-conflicts">Active Conflicts (comma-separated)</Label>
                  <Textarea
                    id="active-conflicts"
                    value={editForm.emotional_landscape.active_conflicts.join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      emotional_landscape: {
                        ...editForm.emotional_landscape,
                        active_conflicts: e.target.value.split(',').map(c => c.trim())
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Contextual Signals */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Consumption
              </h3>

              <div>
                <Label htmlFor="recent-consumption">Recent Media/Books (comma-separated)</Label>
                <Textarea
                  id="recent-consumption"
                  value={editForm.contextual_signals.recent_consumption.join(', ')}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    contextual_signals: {
                      ...editForm.contextual_signals,
                      recent_consumption: e.target.value.split(',').map(r => r.trim())
                    }
                  })}
                />
              </div>
            </div>

            {/* Intellectual Frameworks */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Book className="w-4 h-4" />
                Intellectual Frameworks
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="disciplines">Disciplines (comma-separated)</Label>
                  <Input
                    id="disciplines"
                    value={editForm.intellectual_frameworks.disciplines.join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      intellectual_frameworks: {
                        ...editForm.intellectual_frameworks,
                        disciplines: e.target.value.split(',').map(d => d.trim())
                      }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="core-concepts">Core Concepts (comma-separated)</Label>
                  <Input
                    id="core-concepts"
                    value={editForm.intellectual_frameworks.core_concepts.join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      intellectual_frameworks: {
                        ...editForm.intellectual_frameworks,
                        core_concepts: e.target.value.split(',').map(c => c.trim())
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
