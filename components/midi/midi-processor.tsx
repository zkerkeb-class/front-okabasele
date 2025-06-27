"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

interface MIDINote {
  note: number
  velocity: number
  time: number
}

interface MIDIPerformance {
  performance: MIDINote[]
}

interface ProcessedNote {
  note: number
  noteName: string
  velocity: number
  time: number
}

interface MIDIProcessorProps {
  onNotesProcessed: (notes: ProcessedNote[]) => void
  onActiveNoteChange: (activeNotes: Record<number, boolean>) => void
  onPerformanceAnalyzed: (analysis: PerformanceAnalysis) => void
}

interface PerformanceAnalysis {
  accuracy: number
  timing: number
  dynamics: number
  overallScore: number
  feedback: string[]
}

export function MIDIProcessor({ onNotesProcessed, onActiveNoteChange, onPerformanceAnalyzed }: MIDIProcessorProps) {
  const [activeNotes, setActiveNotes] = useState<Record<number, boolean>>({})
  const [processedNotes, setProcessedNotes] = useState<ProcessedNote[]>([])
  const [lastPerformance, setLastPerformance] = useState<MIDINote[]>([])

  // Convert MIDI note number to note name
  const getNoteNameFromMIDI = (midiNote: number): string => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    const octave = Math.floor(midiNote / 12) - 1
    const noteName = noteNames[midiNote % 12]
    return `${noteName}${octave}`
  }

  // Process incoming MIDI performance data
  const processMIDIPerformance = (data: MIDIPerformance) => {
    if (!data.performance || !Array.isArray(data.performance)) {
      console.error("Invalid MIDI performance data:", data)
      return
    }

    setLastPerformance(data.performance)

    // Process each note in the performance
    const processed: ProcessedNote[] = data.performance.map((note) => ({
      note: note.note,
      noteName: getNoteNameFromMIDI(note.note),
      velocity: note.velocity,
      time: note.time,
    }))

    setProcessedNotes(processed)

    // Only call these callbacks once per performance to prevent update loops
    setTimeout(() => {
      onNotesProcessed(processed)

      // Analyze the performance
      const analysis = analyzePerformance(data.performance)
      onPerformanceAnalyzed(analysis)
    }, 0)

    // Simulate playing the notes with appropriate timing
    simulateNotePlayback(data.performance)

    toast.success(`Processed ${data.performance.length} MIDI notes`)
  }

  // Simulate playing back the notes with their original timing
  const simulateNotePlayback = (notes: MIDINote[]) => {
    // Reset active notes
    setActiveNotes({})
    onActiveNoteChange({})

    // Sort notes by time
    const sortedNotes = [...notes].sort((a, b) => a.time - b.time)

    // Calculate relative timings (time differences between notes)
    const startTime = sortedNotes[0]?.time || 0

    sortedNotes.forEach((note, index) => {
      // Schedule each note to be played at the appropriate time
      const delay = note.time - startTime

      setTimeout(() => {
        // Activate the note
        setActiveNotes((prev) => {
          const updated = { ...prev, [note.note]: true }
          onActiveNoteChange(updated)
          return updated
        })

        // Deactivate the note after a duration based on velocity (higher velocity = longer duration)
        const noteDuration = 300 + (note.velocity / 127) * 700 // Between 300ms and 1000ms

        setTimeout(() => {
          setActiveNotes((prev) => {
            const updated = { ...prev }
            delete updated[note.note]
            onActiveNoteChange(updated)
            return updated
          })
        }, noteDuration)
      }, delay)
    })
  }

  // Analyze the performance and generate feedback
  const analyzePerformance = (notes: MIDINote[]): PerformanceAnalysis => {
    // Calculate metrics based on the performance

    // 1. Timing consistency (lower variance is better)
    const timeDiffs = notes.slice(1).map((note, i) => note.time - notes[i].time)
    const avgTimeDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length
    const timingVariance = timeDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgTimeDiff, 2), 0) / timeDiffs.length
    const timingScore = Math.min(100, Math.max(0, 100 - timingVariance / 100))

    // 2. Velocity/dynamics consistency and expressiveness
    const velocities = notes.map((note) => note.velocity)
    const avgVelocity = velocities.reduce((sum, vel) => sum + vel, 0) / velocities.length
    const velocityVariance =
      velocities.reduce((sum, vel) => sum + Math.pow(vel - avgVelocity, 2), 0) / velocities.length

    // Some variance is good for expressiveness, but too much indicates inconsistency
    const dynamicsScore = Math.min(100, Math.max(0, 100 - Math.abs(velocityVariance - 200) / 2))

    // 3. Accuracy (placeholder - in a real app, would compare against expected notes)
    // For demo purposes, we'll assume 85% accuracy
    const accuracyScore = 85

    // Overall score (weighted average)
    const overallScore = Math.round(accuracyScore * 0.5 + timingScore * 0.3 + dynamicsScore * 0.2)

    // Generate feedback based on the analysis
    const feedback: string[] = []

    if (timingScore < 70) {
      feedback.push("Try to maintain a more consistent rhythm between notes.")
    } else if (timingScore > 90) {
      feedback.push("Excellent timing! Your rhythm is very consistent.")
    }

    if (dynamicsScore < 70) {
      feedback.push("Work on controlling your key pressure for more consistent dynamics.")
    } else if (dynamicsScore > 90) {
      feedback.push("Great dynamic control! Your expression is natural and musical.")
    }

    if (accuracyScore < 70) {
      feedback.push("Focus on playing the correct notes in the sequence.")
    } else if (accuracyScore > 90) {
      feedback.push("Excellent note accuracy! You're playing the right notes.")
    }

    // Add an overall assessment
    if (overallScore < 70) {
      feedback.push("Keep practicing this passage to improve your overall performance.")
    } else if (overallScore > 90) {
      feedback.push("Outstanding performance! You've mastered this passage.")
    } else {
      feedback.push("Good progress! Continue practicing to refine your performance.")
    }

    return {
      accuracy: accuracyScore,
      timing: Math.round(timingScore),
      dynamics: Math.round(dynamicsScore),
      overallScore,
      feedback,
    }
  }

  // Listen for custom events with MIDI performance data
  useEffect(() => {
    const handleMIDIPerformance = (event: CustomEvent) => {
      processMIDIPerformance(event.detail)
    }

    // Add event listener for custom MIDI performance events
    window.addEventListener("midi-performance" as any, handleMIDIPerformance as EventListener)

    return () => {
      window.removeEventListener("midi-performance" as any, handleMIDIPerformance as EventListener)
    }
  }, [])

  return null // This is a logic component with no UI
}
