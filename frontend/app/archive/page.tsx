import { Navigation } from "@/components/navigation"
import { ConstellationView } from "@/components/constellation-view"
import { Button } from "@/components/ui/button"
import { Grid, Network } from "lucide-react"

export default function ArchivePage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen md:pl-32">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-serif font-semibold">Your Stories</h1>
              <p className="text-sm text-muted-foreground">Exploring the connections between your work</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Network className="w-4 h-4" />
                Constellation
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Grid className="w-4 h-4" />
                Grid
              </Button>
            </div>
          </div>
        </header>

        {/* Constellation View */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 text-center space-y-2">
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Each story is a star in your creative universe. The connections show how themes, emotions, and ideas
                flow between your pieces. Click any story to explore it.
              </p>
            </div>

            <div className="bg-card/30 rounded-xl border border-border overflow-hidden">
              <ConstellationView />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
