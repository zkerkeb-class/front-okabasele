"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMIDIPerformance } from "@/components/midi/midi-performance-provider"
import { Button } from "@/components/ui/button"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TimelineNote {
  id: number
  note: string
  midiNote: number
  time: number
  duration: number
  status: "upcoming" | "current" | "correct" | "incorrect" | "missed"
}

export function NoteTimeline() {
  const { processedNotes, activeNotes } = useMIDIPerformance()
  const [notes, setNotes] = useState<TimelineNote[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playheadPosition, setPlayheadPosition] = useState(0) // percentage
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // 1 = normal, 0.5 = half speed, etc.
  const [showNoteNames, setShowNoteNames] = useState(true)
  const [studyMode, setStudyMode] = useState(false)
  const [loopSection, setLoopSection] = useState(false)
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(100)
  const timelineRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update timeline when processed notes change
  useEffect(() => {
    if (processedNotes.length > 0) {
      // Convert processed notes to timeline notes
      const timelineNotes = processedNotes.map((note, index) => {
        // Calculate relative time (0-100%)
        const firstNoteTime = processedNotes[0].time
        const lastNoteTime = processedNotes[processedNotes.length - 1].time
        const timeRange = lastNoteTime - firstNoteTime

        // Default to 1 beat duration
        const duration = 1

        return {
          id: index,
          note: note.noteName,
          midiNote: note.note,
          time: ((note.time - firstNoteTime) / timeRange) * 100, // as percentage
          duration: duration,
          status: "upcoming",
        }
      })

      setNotes(timelineNotes)
      setIsPlaying(true)

      // Reset playhead position
      setPlayheadPosition(0)
      setCurrentTime(0)

      // Set default loop section
      setLoopStart(0)
      setLoopEnd(100)
    }
  }, [processedNotes])

  // Update note statuses based on active notes
  useEffect(() => {
    if (notes.length > 0 && Object.keys(activeNotes).length > 0) {
      // Create a copy of the current notes to avoid direct state mutation
      const updatedNotes = notes.map((note) => {
        // Only update notes that need to change status
        if (activeNotes[note.midiNote] && note.status !== "current") {
          return { ...note, status: "current" }
        } else if (note.status === "current" && !activeNotes[note.midiNote]) {
          // Randomly determine if the note was played correctly
          const wasCorrect = Math.random() > 0.3
          return { ...note, status: wasCorrect ? "correct" : "incorrect" }
        }
        return note
      })

      // Only update state if there are actual changes
      if (JSON.stringify(updatedNotes) !== JSON.stringify(notes)) {
        setNotes(updatedNotes)
      }
    }
  }, [activeNotes]) // Only depend on activeNotes, not notes

  // Fix the playback simulation effect
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isPlaying && notes.length > 0) {
      // Calculate interval based on playback speed
      const baseInterval = 50 // ms
      const adjustedInterval = baseInterval / playbackSpeed

      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5 // Increment by 0.5% each time

          // Handle looping if enabled
          if (loopSection && next >= loopEnd) {
            return loopStart
          }

          // Stop at the end
          if (next >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setIsPlaying(false)
            return prev
          }

          return next
        })
      }, adjustedInterval)
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, notes.length, playbackSpeed, loopSection, loopStart, loopEnd])

  // Add a separate effect to update playhead position and note statuses
  useEffect(() => {
    // Update playhead position
    setPlayheadPosition(currentTime)

    // Update note statuses based on current time
    if (notes.length > 0) {
      const updatedNotes = notes.map((note) => {
        // If the note is coming up next
        if (note.time <= currentTime + 5 && note.time > currentTime && note.status === "upcoming") {
          return { ...note, status: "upcoming" }
        }

        // If we've passed this note and it wasn't played
        if (note.time < currentTime - 5 && note.status === "upcoming") {
          return { ...note, status: "missed" }
        }

        return note
      })

      // Only update if there are changes
      if (JSON.stringify(updatedNotes) !== JSON.stringify(notes)) {
        setNotes(updatedNotes)
      }
    }
  }, [currentTime, notes])

  // Toggle playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  // Reset playback
  const resetPlayback = () => {
    setCurrentTime(loopSection ? loopStart : 0)
    setIsPlaying(true)
  }

  // Toggle study mode
  const toggleStudyMode = () => {
    setStudyMode(!studyMode)

    // If enabling study mode, slow down playback
    if (!studyMode) {
      setPlaybackSpeed(0.5)
    } else {
      setPlaybackSpeed(1)
    }
  }

  // Set loop points
  const setLoopPoints = () => {
    // If we already have a loop section, clear it
    if (loopSection) {
      setLoopSection(false)
      setLoopStart(0)
      setLoopEnd(100)
    } else {
      // Set loop to current position ±15%
      const start = Math.max(0, currentTime - 15)
      const end = Math.min(100, currentTime + 15)
      setLoopStart(start)
      setLoopEnd(end)
      setLoopSection(true)

      // Reset to start of loop
      setCurrentTime(start)
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M9 21V9"></path>
              </svg>
              Note Timeline
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {isPlaying ? "Playing..." : "Paused"}
              </span>

              {studyMode && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                  Study Mode
                </span>
              )}

              {loopSection && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                  Loop Active
                </span>
              )}
            </div>
          </div>

          <div
            ref={timelineRef}
            className="relative h-24 border rounded-lg bg-gradient-to-r from-muted/5 to-muted/20 overflow-hidden shadow-inner"
            aria-label="Visual timeline of notes to play"
          >
            {/* Playhead - animated cursor */}
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
              style={{ left: `${playheadPosition}%` }}
              initial={{ left: "0%" }}
              animate={{ left: `${playheadPosition}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            >
              <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary shadow-md" />
              <div className="absolute -bottom-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary shadow-md" />
            </motion.div>

            {/* Loop section indicator */}
            {loopSection && (
              <div
                className="absolute top-0 bottom-0 bg-blue-100/30 border-l border-r border-blue-300"
                style={{
                  left: `${loopStart}%`,
                  width: `${loopEnd - loopStart}%`,
                }}
              />
            )}

            {/* Time markers */}
            <div className="absolute bottom-0 left-0 right-0 flex h-5 border-t">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 border-r text-xs text-center text-muted-foreground pt-0.5">
                  {i * 25}%
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="absolute top-0 left-0 right-0 h-[calc(100%-20px)] flex items-center">
              <AnimatePresence>
                {notes.map((note) => (
                  <TooltipProvider key={note.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={`absolute h-14 rounded-md flex items-center justify-center text-sm font-medium ${
                            note.status === "current"
                              ? "bg-primary/40 border-2 border-primary z-10 shadow-md"
                              : note.status === "correct"
                                ? "bg-green-100 border border-green-300"
                                : note.status === "incorrect"
                                  ? "bg-red-100 border border-red-300"
                                  : note.status === "missed"
                                    ? "bg-amber-100 border border-amber-300"
                                    : "bg-white border border-gray-200"
                          }`}
                          style={{
                            left: `${note.time}%`,
                            width: `${note.duration * 5}%`, // Scale duration for visibility
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: note.status === "current" ? 1.05 : 1,
                          }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            scale: 1.05,
                            zIndex: 30,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          {showNoteNames ? note.note : "•"}

                          {/* Pattern for colorblind mode */}
                          {note.status === "correct" && (
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <pattern
                                  id="diagonalHatch"
                                  width="10"
                                  height="10"
                                  patternTransform="rotate(45 0 0)"
                                  patternUnits="userSpaceOnUse"
                                >
                                  <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                              </svg>
                            </div>
                          )}

                          {note.status === "incorrect" && (
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="crossHatch" width="10" height="10" patternUnits="userSpaceOnUse">
                                  <path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" strokeWidth="1" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#crossHatch)" />
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-white border-none p-2">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{note.note}</div>
                          <div className="text-xs">MIDI: {note.midiNote}</div>
                          <div className="text-xs">
                            Status:{" "}
                            {note.status === "current"
                              ? "Play now"
                              : note.status === "correct"
                                ? "Correct"
                                : note.status === "incorrect"
                                  ? "Incorrect"
                                  : note.status === "missed"
                                    ? "Missed"
                                    : "Upcoming"}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={resetPlayback}
                aria-label="Restart playback"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant={isPlaying ? "outline" : "default"}
                size="icon"
                className="h-8 w-8"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause playback" : "Start playback"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={setLoopPoints}
                aria-label={loopSection ? "Remove loop" : "Set loop around current position"}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="show-notes" checked={showNoteNames} onCheckedChange={setShowNoteNames} />
                <Label htmlFor="show-notes" className="text-xs">
                  Show note names
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="study-mode" checked={studyMode} onCheckedChange={toggleStudyMode} />
                <Label htmlFor="study-mode" className="text-xs">
                  Study mode
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Start</span>
            <span>Performance Timeline</span>
            <span>End</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
