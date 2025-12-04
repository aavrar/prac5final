"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MOCK_USER_TENSOR } from "@/lib/mockData"
import { Globe, MessageCircle, Book, Pen, Heart, Clock, Edit } from "lucide-react"

export default function ProfilePage() {
  const tensor = MOCK_USER_TENSOR

  const handleEdit = () => {
    alert('Tensor editing functionality!\n\nIn a full implementation, you would be able to:\n- Update your cultural background\n- Modify languages and code-switching patterns\n- Edit emotional state and active conflicts\n- Adjust creative voice preferences\n- Update recent consumption and influences\n\nThis data is currently stored in localStorage and used by all AI generation.')
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
    </>
  )
}
