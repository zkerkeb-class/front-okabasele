"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, Play, Pause } from "lucide-react"
import { useMIDIPerformance } from "@/components/midi/midi-performance-provider"

export function SheetMusicDisplay() {
  const { activeNotes } = useMIDIPerformance()
  const [currentMeasure, setCurrentMeasure] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayMode, setDisplayMode] = useState<"sheet" | "timeline">("sheet")

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

  // Toggle play/pause demo
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)

    if (!isPlaying) {
      // Start cycling through measures
      let measure = 1
      const interval = setInterval(() => {
        setCurrentMeasure(measure)
        measure = (measure % 4) + 1

        if (!isPlaying) {
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3 flex-row justify-between items-center">
        <CardTitle className="text-base font-medium">Music Notation</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs
            value={displayMode}
            onValueChange={(value) => setDisplayMode(value as "sheet" | "timeline")}
            className="mr-2"
          >
            <TabsList className="h-8">
              <TabsTrigger value="sheet" className="text-xs px-3 py-1">
                Sheet Music
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs px-3 py-1">
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={zoomLevel <= 0.6}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={zoomLevel >= 2}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={togglePlayback}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div
          className="w-full transition-all duration-300 overflow-hidden"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
        >
          {displayMode === "sheet" ? (
            <svg
              viewBox="0 0 800 180"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              aria-label="Sheet music for C Major scale"
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

              {/* C Major Scale Notes */}
              {/* C4 */}
              <ellipse cx="180" cy="140" rx="10" ry="7" fill="#333" />
              <line x1="190" y1="140" x2="190" y2="90" stroke="#333" strokeWidth="1" />
              <text x="180" y="160" fontSize="10" fill="#666" textAnchor="middle">
                C
              </text>

              {/* D4 */}
              <ellipse cx="230" cy="130" rx="10" ry="7" fill="#333" />
              <line x1="240" y1="130" x2="240" y2="90" stroke="#333" strokeWidth="1" />
              <text x="230" y="160" fontSize="10" fill="#666" textAnchor="middle">
                D
              </text>

              {/* E4 */}
              <ellipse cx="280" cy="120" rx="10" ry="7" fill="#333" />
              <line x1="290" y1="120" x2="290" y2="90" stroke="#333" strokeWidth="1" />
              <text x="280" y="160" fontSize="10" fill="#666" textAnchor="middle">
                E
              </text>

              {/* F4 */}
              <ellipse cx="380" cy="110" rx="10" ry="7" fill="#333" />
              <line x1="370" y1="110" x2="370" y2="90" stroke="#333" strokeWidth="1" />
              <text x="380" y="160" fontSize="10" fill="#666" textAnchor="middle">
                F
              </text>

              {/* G4 */}
              <ellipse cx="430" cy="100" rx="10" ry="7" fill="#333" />
              <line x1="440" y1="100" x2="440" y2="90" stroke="#333" strokeWidth="1" />
              <text x="430" y="160" fontSize="10" fill="#666" textAnchor="middle">
                G
              </text>

              {/* A4 */}
              <ellipse cx="480" cy="90" rx="10" ry="7" fill="#333" />
              <line x1="490" y1="90" x2="490" y2="90" stroke="#333" strokeWidth="1" />
              <text x="480" y="160" fontSize="10" fill="#666" textAnchor="middle">
                A
              </text>

              {/* B4 */}
              <ellipse cx="580" cy="80" rx="10" ry="7" fill="#333" />
              <line x1="590" y1="80" x2="590" y2="90" stroke="#333" strokeWidth="1" />
              <text x="580" y="160" fontSize="10" fill="#666" textAnchor="middle">
                B
              </text>

              {/* C5 */}
              <ellipse cx="630" cy="70" rx="10" ry="7" fill="#333" />
              <line x1="640" y1="70" x2="640" y2="90" stroke="#333" strokeWidth="1" />
              <text x="630" y="160" fontSize="10" fill="#666" textAnchor="middle">
                C
              </text>

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

              {/* Finger numbers */}
              <circle cx="180" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="180" y="173" fontSize="10" fill="white" textAnchor="middle">
                1
              </text>

              <circle cx="230" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="230" y="173" fontSize="10" fill="white" textAnchor="middle">
                2
              </text>

              <circle cx="280" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="280" y="173" fontSize="10" fill="white" textAnchor="middle">
                3
              </text>

              <circle cx="380" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="380" y="173" fontSize="10" fill="white" textAnchor="middle">
                4
              </text>

              <circle cx="430" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="430" y="173" fontSize="10" fill="white" textAnchor="middle">
                5
              </text>

              <circle cx="480" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="480" y="173" fontSize="10" fill="white" textAnchor="middle">
                4
              </text>

              <circle cx="580" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="580" y="173" fontSize="10" fill="white" textAnchor="middle">
                3
              </text>

              <circle cx="630" cy="170" r="8" fill="#7b61ff" opacity="0.8" />
              <text x="630" y="173" fontSize="10" fill="white" textAnchor="middle">
                1
              </text>
            </svg>
          ) : (
            <div className="relative h-32 border rounded-lg bg-gradient-to-r from-muted/5 to-muted/20 overflow-hidden shadow-inner">
              {/* Timeline visualization */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 left-[30%]">
                <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary shadow-md" />
                <div className="absolute -bottom-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary shadow-md" />
              </div>

              {/* Notes on timeline */}
              <div className="absolute top-0 left-0 right-0 h-full flex items-center">
                {["C", "D", "E", "F", "G", "A", "B", "C"].map((note, index) => (
                  <div
                    key={note + index}
                    className={`absolute h-14 rounded-md flex items-center justify-center text-sm font-medium
                      ${
                        index === 2
                          ? "bg-primary/40 border-2 border-primary z-10 shadow-md"
                          : index < 2
                            ? "bg-green-100 border border-green-300"
                            : "bg-white border border-gray-200"
                      }`}
                    style={{
                      left: `${10 + index * 12}%`,
                      width: "8%",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {note}
                  </div>
                ))}
              </div>

              {/* Time markers */}
              <div className="absolute bottom-0 left-0 right-0 flex h-5 border-t">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r text-xs text-center text-muted-foreground pt-0.5">
                    {i * 25}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-center text-muted-foreground">
          {displayMode === "sheet"
            ? `C Major Scale - Measure ${currentMeasure} highlighted`
            : "Timeline view - Play notes from left to right"}
        </div>
      </CardContent>
    </Card>
  )
}
