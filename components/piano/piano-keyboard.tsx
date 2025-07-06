"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PianoKeyProps {
  note: string
  midiNote: number
  isBlack?: boolean
  isActive?: boolean
  onClick: () => void
  correctKey?: boolean
  incorrectKey?: boolean
  fingerNumber?: number
}

function PianoKey({
  note,
  midiNote,
  isBlack = false,
  isActive = false,
  onClick,
  correctKey = false,
  incorrectKey = false,
  fingerNumber,
}: PianoKeyProps) {
  // Sound effects for key presses
  const playSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Calculate frequency based on MIDI note number
      const frequency = 440 * Math.pow(2, (midiNote - 69) / 12)

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }, [midiNote])

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "relative cursor-pointer transition-all duration-150",
              isBlack ? "h-32 w-10 -mx-5 z-10 bg-gray-900 text-white" : "h-48 w-14 border border-gray-300 bg-white",
              isActive && (isBlack ? "bg-primary border-primary" : "bg-primary/20"),
              correctKey && (isBlack ? "bg-green-600 border-green-600" : "bg-green-200"),
              incorrectKey && (isBlack ? "bg-red-600 border-red-600" : "bg-red-200"),
              "flex items-end justify-center pb-2",
            )}
            style={{
              borderBottomLeftRadius: isBlack ? "6px" : "8px",
              borderBottomRightRadius: isBlack ? "6px" : "8px",
              boxShadow: isBlack
                ? "0 0 10px rgba(0,0,0,0.3)"
                : "0 5px 15px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
            }}
            onClick={() => {
              onClick()
              playSound()
            }}
            whileTap={{
              scale: 0.97,
              y: isBlack ? 3 : 5,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            whileHover={{
              y: isBlack ? -3 : -5,
              boxShadow: isBlack ? "0 -3px 10px rgba(0,0,0,0.2)" : "0 -5px 20px rgba(0,0,0,0.1)",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Finger number indicator */}
            {fingerNumber && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {fingerNumber}
              </div>
            )}

            {/* Key highlight effect */}
            <AnimatePresence>
              {(isActive || correctKey || incorrectKey) && (
                <motion.div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1/2 rounded-t-sm opacity-30",
                    isBlack ? "bg-white" : correctKey ? "bg-green-400" : incorrectKey ? "bg-red-400" : "bg-primary",
                  )}
                  initial={{ opacity: 0, height: "0%" }}
                  animate={{ opacity: 0.3, height: "50%" }}
                  exit={{ opacity: 0, height: "0%" }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>

            {/* Note name */}
            <span
              className={cn(
                "text-sm font-medium",
                isActive && "text-primary font-bold",
                correctKey && "text-green-700 font-bold",
                incorrectKey && "text-red-700 font-bold",
              )}
            >
              {note}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-black/90 text-white border-none text-xs p-3 shadow-lg">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-sm">{note}</div>
            <div className="text-xs">MIDI: {midiNote}</div>
            {fingerNumber && <div className="text-xs text-blue-300">Suggested finger: {fingerNumber}</div>}
            <div className="text-xs text-gray-400 mt-1">Click to play this note</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface PianoKeyboardProps {
  activeNotes?: Record<number, boolean>
  onNoteClick?: (midiNote: number) => void
}

export function PianoKeyboard({ activeNotes = {}, onNoteClick }: PianoKeyboardProps) {
  const [correctNotes, setCorrectNotes] = useState<number[]>([])
  const [incorrectNotes, setIncorrectNotes] = useState<number[]>([])
  const [fingerSuggestions, setFingerSuggestions] = useState<Record<number, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize finger suggestions for C major scale
  useEffect(() => {
    const cMajorFingers: Record<number, number> = {
      60: 1, // C4 - thumb
      62: 2, // D4 - index
      64: 3, // E4 - middle
      65: 4, // F4 - ring
      67: 5, // G4 - pinky
      69: 4, // A4 - ring
      71: 3, // B4 - middle
      72: 1, // C5 - thumb
    }
    setFingerSuggestions(cMajorFingers)
  }, [])

  // Handle key click
  const handleKeyClick = useCallback(
    (midiNote: number) => {
      onNoteClick?.(midiNote)

      // Simulate correct/incorrect feedback (in a real app, this would be based on the expected note)
      const isCorrect = Math.random() > 0.3 // 70% chance of being correct for demo

      if (isCorrect) {
        setCorrectNotes((prev) => [...prev, midiNote])
        setTimeout(() => {
          setCorrectNotes((prev) => prev.filter((n) => n !== midiNote))
        }, 800)
      } else {
        setIncorrectNotes((prev) => [...prev, midiNote])
        setTimeout(() => {
          setIncorrectNotes((prev) => prev.filter((n) => n !== midiNote))
        }, 800)
      }
    },
    [onNoteClick],
  )

  // Generate piano keys data
  const generatePianoKeys = () => {
    const keys = []
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    // Generate 2 octaves (24 keys) starting from C3 (MIDI note 48)
    for (let i = 0; i < 24; i++) {
      const midiNote = 48 + i
      const octave = Math.floor(midiNote / 12) - 1
      const noteName = noteNames[midiNote % 12]
      const isBlack = noteName.includes("#")

      keys.push({
        midiNote,
        note: `${noteName}${octave}`,
        isBlack,
      })
    }

    return keys
  }

  const pianoKeys = generatePianoKeys()
  const whiteKeys = pianoKeys.filter((key) => !key.isBlack)
  const blackKeys = pianoKeys.filter((key) => key.isBlack)

  // Handle horizontal scrolling for mobile
  useEffect(() => {
    if (containerRef.current) {
      // Center the keyboard on middle C (C4 = MIDI note 60)
      const middleCIndex = whiteKeys.findIndex((key) => key.midiNote === 60)
      if (middleCIndex !== -1) {
        const keyWidth = 14 // Width of a white key in pixels
        const scrollPosition = middleCIndex * keyWidth - containerRef.current.clientWidth / 2 + keyWidth * 2
        containerRef.current.scrollLeft = Math.max(0, scrollPosition)
      }
    }
  }, [])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        aria-label="Piano keyboard. Use mouse to click keys or connect a MIDI keyboard."
      >
        <div className="flex justify-center min-w-max">
          <motion.div
            className="relative flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* White keys */}
            <div className="flex">
              {whiteKeys.map((key) => (
                <PianoKey
                  key={`white-${key.midiNote}`}
                  note={key.note}
                  midiNote={key.midiNote}
                  isActive={activeNotes[key.midiNote]}
                  correctKey={correctNotes.includes(key.midiNote)}
                  incorrectKey={incorrectNotes.includes(key.midiNote)}
                  fingerNumber={fingerSuggestions[key.midiNote]}
                  onClick={() => handleKeyClick(key.midiNote)}
                />
              ))}
            </div>

            {/* Black keys */}
            <div className="absolute flex top-0 left-4.5">
              {blackKeys.map((key) => (
                <PianoKey
                  key={`black-${key.midiNote}`}
                  note={key.note}
                  midiNote={key.midiNote}
                  isBlack
                  isActive={activeNotes[key.midiNote]}
                  correctKey={correctNotes.includes(key.midiNote)}
                  incorrectKey={incorrectNotes.includes(key.midiNote)}
                  fingerNumber={fingerSuggestions[key.midiNote]}
                  onClick={() => handleKeyClick(key.midiNote)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Click on the keys to play or connect a MIDI keyboard
      </div>
    </div>
  )
}
