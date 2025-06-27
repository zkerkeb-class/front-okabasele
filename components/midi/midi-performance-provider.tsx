"use client"

import type React from "react"

import { useState, createContext, useContext, useCallback } from "react"
import { MIDIProcessor } from "@/components/midi/midi-processor"

interface ProcessedNote {
  note: number
  noteName: string
  velocity: number
  time: number
}

interface PerformanceAnalysis {
  accuracy: number
  timing: number
  dynamics: number
  overallScore: number
  feedback: string[]
}

interface MIDIPerformanceContextType {
  activeNotes: Record<number, boolean>
  processedNotes: ProcessedNote[]
  performanceAnalysis: PerformanceAnalysis | null
  sendMIDIPerformance: (performance: { note: number; velocity: number; time: number }[]) => void
}

const defaultAnalysis: PerformanceAnalysis = {
  accuracy: 0,
  timing: 0,
  dynamics: 0,
  overallScore: 0,
  feedback: [],
}

const MIDIPerformanceContext = createContext<MIDIPerformanceContextType>({
  activeNotes: {},
  processedNotes: [],
  performanceAnalysis: null,
  sendMIDIPerformance: () => {},
})

export const useMIDIPerformance = () => useContext(MIDIPerformanceContext)

export function MIDIPerformanceProvider({ children }: { children: React.ReactNode }) {
  const [activeNotes, setActiveNotes] = useState<Record<number, boolean>>({})
  const [processedNotes, setProcessedNotes] = useState<ProcessedNote[]>([])
  const [performanceAnalysis, setPerformanceAnalysis] = useState<PerformanceAnalysis | null>(null)

  // Memoize the callback functions to prevent them from changing on every render
  const handleNotesProcessed = useCallback((notes: ProcessedNote[]) => {
    setProcessedNotes(notes)
  }, [])

  const handleActiveNoteChange = useCallback((notes: Record<number, boolean>) => {
    setActiveNotes(notes)
  }, [])

  const handlePerformanceAnalyzed = useCallback((analysis: PerformanceAnalysis) => {
    setPerformanceAnalysis(analysis)
  }, [])

  const sendMIDIPerformance = useCallback((performance: { note: number; velocity: number; time: number }[]) => {
    const event = new CustomEvent("midi-performance", {
      detail: { performance },
    })
    window.dispatchEvent(event)
  }, [])

  return (
    <MIDIPerformanceContext.Provider
      value={{
        activeNotes,
        processedNotes,
        performanceAnalysis,
        sendMIDIPerformance,
      }}
    >
      <MIDIProcessor
        onNotesProcessed={handleNotesProcessed}
        onActiveNoteChange={handleActiveNoteChange}
        onPerformanceAnalyzed={handlePerformanceAnalyzed}
      />
      {children}
    </MIDIPerformanceContext.Provider>
  )
}
