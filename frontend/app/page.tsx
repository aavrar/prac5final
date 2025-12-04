import { AmbientGreeting } from "@/components/ambient-greeting"
import { BreathingOrb } from "@/components/breathing-orb"
import { Navigation } from "@/components/navigation"
import { RecentStories } from "@/components/recent-stories"
import { WritingPrompts } from "@/components/writing-prompts"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mic } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-6 md:p-12 md:pl-32">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-16">
            <div className="flex-1 space-y-8">
              <AmbientGreeting />

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I&apos;m here when you need me. No pressure, no deadlines—just a space to explore your stories.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild size="lg" className="group">
                    <Link href="/conversation">
                      Start a conversation
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg">
                    <Link href="/editor">Open editor</Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                    <Link href="/listen">
                      <Mic className="w-4 h-4" />
                      Just listen
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <BreathingOrb />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentStories />
            </div>

            <div className="space-y-6">
              <WritingPrompts />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Quick actions</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="justify-start bg-transparent">
                    <Link href="/conversation">Ask me anything</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start bg-transparent">
                    <Link href="/archive">Explore connections</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
