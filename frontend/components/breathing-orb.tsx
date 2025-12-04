"use client"

export function BreathingOrb() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-ambient)] to-[var(--color-constellation)] opacity-20 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] opacity-40 animate-pulse"
        style={{ animationDuration: "3s", animationDelay: "0.5s" }}
      />
      <div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--color-constellation)] to-[var(--color-ambient)] opacity-60 animate-pulse"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />
    </div>
  )
}
