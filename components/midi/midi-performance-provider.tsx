"use client"

import type React from "react"

import { useState, createContext, useContext, useCallback } from "react"
import { analyzePerformance } from "@/lib/api/analyze"
import { createPerformance } from "@/lib/api/performance"
import { IPerformance, IReference } from '@/types'
import { MIDIProcessor } from "@/components/midi/midi-processor"

interface ProcessedNote {
  note: number
  noteName: string
  velocity: number
  time: number
}

// Backend performance analysis result
export type PerformanceAnalysis = {
  accuracy: number;
  timing: number;
  dynamics: number;
  overallScore?: number;
  feedback: string[];
  score?: number;
};

// Context type
type MIDIPerformanceContextType = {
  activeNotes: Record<number, boolean>;
  processedNotes: ProcessedNote[];
  performanceAnalysis: PerformanceAnalysis | null;
  sendMIDIPerformance: (performance: { note: number; velocity: number; time: number }[], reference?: IReference, section?: string, sessionId?: string, userId?: string) => void;
  isAnalyzing: boolean;
  error: string | null;
};


// const defaultAnalysis: PerformanceAnalysis = {
//   accuracy: 0,
//   timing: 0,
//   dynamics: 0,
//   overallScore: 0,
//   feedback: [],
// }

const MIDIPerformanceContext = createContext<MIDIPerformanceContextType>({
  activeNotes: {},
  processedNotes: [],
  performanceAnalysis: null,
  sendMIDIPerformance: () => {},
  isAnalyzing: false,
  error: null,
})

export const useMIDIPerformance = () => useContext(MIDIPerformanceContext)

export function MIDIPerformanceProvider({ children }: { children: React.ReactNode }) {
  const [activeNotes, setActiveNotes] = useState<Record<number, boolean>>({})
  const [processedNotes, setProcessedNotes] = useState<ProcessedNote[]>([])
  const [performanceAnalysis, setPerformanceAnalysis] = useState<PerformanceAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Send MIDI performance to backend for analysis
  const sendMIDIPerformance = useCallback(
    async (
      performance: { note: number; velocity: number; time: number }[],
      reference?: IReference,
      section?: string,
      sessionId?: string,
      userId?: string
    ) => {
      setIsAnalyzing(true)
      setError(null)
      try {
        // Compose IPerformance for backend
        const perf: IPerformance = {
          startedAt: new Date(),
          endedAt: new Date(),
          section: (section as any) || "intro",
          midiNotes: performance,
          user: userId || "",
          session: sessionId || "",
        }
        if (!reference) throw new Error("Reference data required for analysis.")
        // 1. Create the performance in the DB
        const created = await createPerformance(perf)
        // 2. Analyze the performance (send to IA service)
        const result = await analyzePerformance({ performance: created, reference })
        setPerformanceAnalysis({
          accuracy: result.score ?? 0,
          timing: 0,
          dynamics: 0,
          overallScore: result.score,
          feedback: result.feedback || [],
          score: result.score,
        })
      } catch (e: any) {
        setError(e?.message || "Failed to analyze performance.")
      } finally {
        setIsAnalyzing(false)
      }
    },
    []
  )

  return (
    <MIDIPerformanceContext.Provider
      value={{
        activeNotes,
        processedNotes,
        performanceAnalysis,
        sendMIDIPerformance,
        isAnalyzing,
        error,
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
