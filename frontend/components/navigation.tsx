"use client"

import { Home, MessageSquare, Edit, Sparkles, Eye, Brain } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { TransparencyPanelContent } from "@/components/transparency-panel"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/conversation", icon: MessageSquare, label: "Conversation" },
  { href: "/editor", icon: Edit, label: "Editor" },
  { href: "/archive", icon: Sparkles, label: "Archive" },
  { href: "/calibration", icon: Brain, label: "Calibration" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:left-8 md:top-8 md:bottom-auto md:right-auto z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "bg-card/80 backdrop-blur-lg border border-border shadow-lg transition-all duration-300",
          isHovered
            ? "rounded-t-xl md:rounded-xl"
            : "rounded-t-xl md:rounded-full md:w-4 md:h-4 md:bg-primary md:border-none md:shadow-glow",
        )}
      >
        <div
          className={cn(
            "flex md:flex-col gap-1 transition-all duration-300",
            isHovered ? "p-2" : "p-2 md:p-0 md:opacity-0",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "hover:bg-secondary/50",
                  isActive && "bg-primary text-primary-foreground",
                  !isHovered && "md:hidden",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}

          <Sheet>
            <SheetTrigger asChild>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-secondary/50 cursor-pointer",
                !isHovered && "md:hidden"
              )}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground p-0 h-auto w-auto hover:bg-transparent">
                  <Eye className="w-5 h-5" />
                </Button>
                <span className="hidden md:inline text-sm font-medium">Your Tensor</span>
              </div>
            </SheetTrigger>
            <TransparencyPanelContent />
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
