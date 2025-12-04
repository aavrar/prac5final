"use client"

interface ConstellationConnectionProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  strength: "weak" | "medium" | "strong"
}

export function ConstellationConnection({ from, to, strength }: ConstellationConnectionProps) {
  const opacity = {
    weak: 0.2,
    medium: 0.4,
    strong: 0.6,
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="var(--color-constellation)"
        strokeWidth="2"
        strokeOpacity={opacity[strength]}
        strokeDasharray="4 4"
        className="animate-pulse"
        style={{ animationDuration: "3s" }}
      />
    </svg>
  )
}
