"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMIDIPerformance } from "@/components/midi/midi-performance-provider"

export function PerformanceDemo() {
  const { sendMIDIPerformance } = useMIDIPerformance()
  const [isLoading, setIsLoading] = useState(false)

  const playScaleDemo = () => {
    setIsLoading(true)

    // C major scale: C4, D4, E4, F4, G4, A4, B4, C5
    const performance = [
      { note: 60, velocity: 95, time: 100 }, // C4
      { note: 62, velocity: 80, time: 600 }, // D4
      { note: 64, velocity: 85, time: 1100 }, // E4
      { note: 65, velocity: 70, time: 1600 }, // F4
      { note: 67, velocity: 65, time: 2100 }, // G4
    ]

    sendMIDIPerformance(performance)

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const playChordDemo = () => {
    setIsLoading(true)

    // C major chord (C4, E4, G4) played together
    const performance = [
      { note: 60, velocity: 90, time: 100 }, // C4
      { note: 64, velocity: 85, time: 100 }, // E4
      { note: 67, velocity: 80, time: 100 }, // G4
    ]

    sendMIDIPerformance(performance)

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const playArpeggioDemo = () => {
    setIsLoading(true)

    // C major arpeggio (C4, E4, G4, C5) played in sequence
    const performance = [
      { note: 60, velocity: 90, time: 100 }, // C4
      { note: 64, velocity: 85, time: 600 }, // E4
      { note: 67, velocity: 80, time: 1100 }, // G4
      { note: 72, velocity: 95, time: 1600 }, // C5
      { note: 67, velocity: 75, time: 2100 }, // G4
      { note: 64, velocity: 70, time: 2600 }, // E4
      { note: 60, velocity: 85, time: 3100 }, // C4
    ]

    sendMIDIPerformance(performance)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={playScaleDemo} disabled={isLoading} className="text-xs">
        Demo: C Major Scale
      </Button>
      <Button variant="outline" size="sm" onClick={playChordDemo} disabled={isLoading} className="text-xs">
        Demo: C Major Chord
      </Button>
      <Button variant="outline" size="sm" onClick={playArpeggioDemo} disabled={isLoading} className="text-xs">
        Demo: C Major Arpeggio
      </Button>
    </div>
  )
}
