"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ConstellationNodeProps {
  id: string
  title: string
  theme: string
  position: { x: number; y: number }
  size: "small" | "medium" | "large"
  isSelected?: boolean
  onClick?: () => void
}

export function ConstellationNode({ title, theme, position, size, isSelected, onClick }: ConstellationNodeProps) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-40 h-40",
  }

  return (
    <div
      className="absolute cursor-pointer animate-in fade-in zoom-in duration-700"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      <Card
        className={cn(
          "p-4 transition-all duration-300 hover:scale-110 hover:shadow-xl",
          sizeClasses[size],
          isSelected && "ring-2 ring-primary shadow-xl scale-110",
        )}
      >
        <div className="h-full flex flex-col justify-between">
          <div
            className={cn(
              "w-8 h-8 rounded-full bg-gradient-to-br mb-2",
              "from-[var(--color-constellation)] to-[var(--color-ambient)]",
            )}
          />
          <div>
            <h3 className="font-serif font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{theme}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
