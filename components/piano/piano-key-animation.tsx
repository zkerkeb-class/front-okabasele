"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function PianoKeyAnimation() {
  const [activeKeys, setActiveKeys] = useState<number[]>([])

  useEffect(() => {
    // Simulate random key presses for animation
    const interval = setInterval(() => {
      const randomKey = Math.floor(Math.random() * 24) // 24 keys in our animation

      setActiveKeys((prev) => [...prev, randomKey])

      // Remove the key after a short delay
      setTimeout(() => {
        setActiveKeys((prev) => prev.filter((key) => key !== randomKey))
      }, 800)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden py-10">
      <div className="flex justify-center">
        <div className="relative h-40 w-full max-w-3xl">
          {/* White keys */}
          <div className="absolute bottom-0 flex h-40 w-full justify-center">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={`white-${i}`}
                className={cn(
                  "h-40 w-10 border border-gray-300 bg-white transition-colors duration-300",
                  activeKeys.includes(i) && "bg-primary/20",
                )}
                style={{
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
              />
            ))}
          </div>

          {/* Black keys */}
          <div className="absolute bottom-14 flex h-26 w-full justify-center">
            {Array.from({ length: 13 }).map((_, i) => {
              // Skip where there are no black keys in a piano
              if (i % 7 === 2 || i % 7 === 6) return null

              return (
                <div
                  key={`black-${i}`}
                  className={cn(
                    "h-26 w-6 -mx-3 z-10 bg-gray-900 transition-colors duration-300",
                    activeKeys.includes(i + 14) && "bg-primary",
                  )}
                  style={{
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
