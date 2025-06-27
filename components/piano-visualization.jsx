"use client"

import { useEffect, useRef, memo } from "react"
import { Button } from "@/components/ui/button"

// Create a memoized piano key component to reduce re-renders
const PianoKey = memo(({ note, noteName, isBlackKey, isActive, isC, onClick }) => {
  return (
    <div
      onClick={() => onClick(note)}
      className={`
        ${
          isBlackKey
            ? "bg-black text-white h-20 w-8 -mx-4 z-10 relative border border-gray-700"
            : "bg-white border border-gray-300 h-32 w-12"
        }
        ${isActive ? (isBlackKey ? "bg-primary border-primary" : "bg-primary/20") : ""}
        flex flex-col justify-end items-center pb-1 transition-colors cursor-pointer
        hover:opacity-80 active:opacity-70
      `}
    >
      {isActive && (
        <span
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold ${
            isBlackKey ? "text-white" : "text-primary"
          }`}
        >
          {noteName}
        </span>
      )}
      {!isBlackKey && isC && <span className="text-xs mt-auto mb-1">{noteName}</span>}
    </div>
  )
})

PianoKey.displayName = "PianoKey"

export function PianoVisualization({
  activeNotes,
  getNoteName,
  notationSystem,
  toggleNotationSystem,
  isWebMidiSupported,
  playNote,
}) {
  const scrollContainerRef = useRef(null)

  // Create an array of all possible piano keys for visualization
  const pianoKeys = Array.from({ length: 88 }, (_, i) => i + 21) // MIDI notes 21-108 (standard 88-key piano)

  useEffect(() => {
    // Scroll to middle C (around note 60) after component mounts
    if (isWebMidiSupported && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft =
            scrollContainerRef.current.scrollWidth / 2 - scrollContainerRef.current.clientWidth / 2
        }
      }, 500) // Small delay to ensure rendering is complete
    }
  }, [isWebMidiSupported])

  const scrollTo = (position) => {
    if (!scrollContainerRef.current) return

    switch (position) {
      case "start":
        scrollContainerRef.current.scrollLeft = 0
        break
      case "middle":
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth / 2 - scrollContainerRef.current.clientWidth / 2
        break
      case "end":
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
        break
      default:
        break
    }
  }

  const handleKeyClick = (note) => {
    playNote(note)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Piano Visualization</h3>
        <Button variant="outline" size="sm" onClick={toggleNotationSystem} className="text-xs">
          {notationSystem === "letter" ? "C, D, E, F..." : "Do, Re, Mi, Fa..."}
        </Button>
      </div>

      <div className="border rounded-md p-2 bg-muted/10">
        <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 mb-2 scrollbar-thin">
          <div className="flex h-32 min-w-max">
            {pianoKeys.map((note) => {
              const noteName = getNoteName(note)
              const isBlackKey = noteName.includes("#")
              const isActive = activeNotes[note]
              const isC = noteName.includes("C") || noteName.includes("Do")

              return (
                <PianoKey
                  key={note}
                  note={note}
                  noteName={noteName}
                  isBlackKey={isBlackKey}
                  isActive={isActive}
                  isC={isC}
                  onClick={handleKeyClick}
                />
              )
            })}
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Lower notes</span>
          <span>← Scroll to see all keys →</span>
          <span>Higher notes</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="sm" onClick={() => scrollTo("start")}>
          Lowest Notes
        </Button>
        <Button variant="outline" size="sm" onClick={() => scrollTo("middle")}>
          Middle
        </Button>
        <Button variant="outline" size="sm" onClick={() => scrollTo("end")}>
          Highest Notes
        </Button>
      </div>
    </div>
  )
}
