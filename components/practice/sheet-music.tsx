"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMIDIPerformance } from "@/components/midi/midi-performance-provider"
import { Button } from "@/components/ui/button"
import { Play, ZoomIn, ZoomOut } from "lucide-react"

export function SheetMusic() {
  const { activeNotes } = useMIDIPerformance()
  const [currentMeasure, setCurrentMeasure] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showDemo, setShowDemo] = useState(false)

  // Update highlighted measure based on active notes
  useEffect(() => {
    if (Object.keys(activeNotes).length > 0) {
      // In a real app, this would map MIDI notes to measures
      // For demo purposes, we'll just cycle through measures
      setCurrentMeasure((prev) => (prev % 4) + 1)
    }
  }, [activeNotes])

  // Handle zoom controls
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6))
  }

  // Play demo animation
  const playDemo = () => {
    setShowDemo(true)

    // Cycle through measures to demonstrate
    let measure = 1
    const interval = setInterval(() => {
      setCurrentMeasure(measure)
      measure = (measure % 4) + 1

      if (measure === 1) {
        clearInterval(interval)
        setShowDemo(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  return (
    <motion.div
      className="min-h-[300px] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoomLevel <= 0.6}>
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoomLevel >= 2}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={playDemo} disabled={showDemo}>
          <Play className="h-4 w-4 mr-1" />
          Show Demo
        </Button>
      </div>

      <div
        className="w-full max-w-3xl transition-all duration-300 overflow-hidden"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
      >
        <svg
          viewBox="0 0 800 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-label="Sheet music for C Major arpeggio"
        >
          {/* Staff lines */}
          <g stroke="#ccc" strokeWidth="1">
            <line x1="40" y1="60" x2="760" y2="60" />
            <line x1="40" y1="80" x2="760" y2="80" />
            <line x1="40" y1="100" x2="760" y2="100" />
            <line x1="40" y1="120" x2="760" y2="120" />
            <line x1="40" y1="140" x2="760" y2="140" />
          </g>

          {/* Treble clef */}
          <path
            d="M70,140 C65,130 65,120 70,110 C75,100 85,95 85,85 C85,75 75,65 65,65 C55,65 45,75 45,90 C45,105 55,120 70,140 Z M70,65 L70,140"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />

          {/* Time signature */}
          <text x="100" y="100" fontSize="30" fill="#333">
            4
          </text>
          <text x="100" y="130" fontSize="30" fill="#333">
            4
          </text>

          {/* Bar lines */}
          <line x1="130" y1="60" x2="130" y2="140" stroke="#333" strokeWidth="1" />
          <line x1="330" y1="60" x2="330" y2="140" stroke="#333" strokeWidth="1" />
          <line x1="530" y1="60" x2="530" y2="140" stroke="#333" strokeWidth="1" />
          <line x1="730" y1="60" x2="730" y2="140" stroke="#333" strokeWidth="1" />
          <line x1="730" y1="60" x2="740" y2="140" stroke="#333" strokeWidth="1" />
          <line x1="740" y1="60" x2="740" y2="140" stroke="#333" strokeWidth="1" />

          {/* Notes - C major chord */}
          {/* C4 */}
          <ellipse cx="180" cy="140" rx="10" ry="7" fill="#333" />
          <line x1="190" y1="140" x2="190" y2="90" stroke="#333" strokeWidth="1" />

          {/* E4 */}
          <ellipse cx="230" cy="120" rx="10" ry="7" fill="#333" />
          <line x1="240" y1="120" x2="240" y2="90" stroke="#333" strokeWidth="1" />

          {/* G4 */}
          <ellipse cx="280" cy="100" rx="10" ry="7" fill="#333" />
          <line x1="290" y1="100" x2="290" y2="90" stroke="#333" strokeWidth="1" />

          {/* C5 */}
          <ellipse cx="380" cy="80" rx="10" ry="7" fill="#333" />
          <line x1="370" y1="80" x2="370" y2="90" stroke="#333" strokeWidth="1" />

          {/* G4 */}
          <ellipse cx="430" cy="100" rx="10" ry="7" fill="#333" />
          <line x1="440" y1="100" x2="440" y2="90" stroke="#333" strokeWidth="1" />

          {/* E4 */}
          <ellipse cx="480" cy="120" rx="10" ry="7" fill="#333" />
          <line x1="490" y1="120" x2="490" y2="90" stroke="#333" strokeWidth="1" />

          {/* C4 - half note */}
          <ellipse cx="580" cy="140" rx="10" ry="7" stroke="#333" strokeWidth="1" fill="white" />
          <line x1="590" y1="140" x2="590" y2="90" stroke="#333" strokeWidth="1" />

          {/* Current measure highlight */}
          <motion.rect
            x={currentMeasure === 1 ? "130" : currentMeasure === 2 ? "330" : currentMeasure === 3 ? "530" : "730"}
            y="60"
            width={currentMeasure === 4 ? "10" : "200"}
            height="80"
            fill="rgba(123, 97, 255, 0.2)"
            rx="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />

          {/* Measure numbers */}
          <text x="150" y="50" fontSize="12" fill="#666">
            1
          </text>
          <text x="350" y="50" fontSize="12" fill="#666">
            2
          </text>
          <text x="550" y="50" fontSize="12" fill="#666">
            3
          </text>
          <text x="750" y="50" fontSize="12" fill="#666">
            4
          </text>
        </svg>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">C Major Arpeggio - Measure {currentMeasure} highlighted</div>

      {/* Accessibility description for screen readers */}
      <div className="sr-only">
        Sheet music showing a C Major arpeggio. The notes are C4, E4, G4, C5, G4, E4, and C4. Currently highlighting
        measure {currentMeasure} of 4.
      </div>
    </motion.div>
  )
}
