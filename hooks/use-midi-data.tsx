"use client"

import { useState, useEffect, useCallback } from "react"
// No need to import WebMidi types; use the built-in DOM types

// Helper function to convert MIDI note number to note name
const getNoteName = (noteNumber: number): string => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const octave = Math.floor(noteNumber / 12) - 1
  const noteName = noteNames[noteNumber % 12]
  return `${noteName}${octave}`
}

// Interface for MIDI note data
interface MidiNote {
  note: number
  noteName: string
  velocity: number
  time: number
}

export function useMidiData(midiAccess: MIDIAccess | null) {
  const [midiData, setMidiData] = useState<MidiNote[]>([])
  const [activeNotes, setActiveNotes] = useState<Record<number, boolean>>({})

  const handleMidiMessage = useCallback((msg: MIDIMessageEvent) => {
    if (!msg.data) return;
    const [command, note, velocity] = msg.data;

    // Note On event (command 144-159) with velocity > 0
    if (command >= 144 && command <= 159 && velocity > 0) {
      const noteName = getNoteName(note)
      setMidiData((prev) => [
        { note, noteName, velocity, time: Date.now() },
        ...prev.slice(0, 99), // Keep only the last 100 notes
      ])
      setActiveNotes((prev) => ({ ...prev, [note]: true }))
    }
    // Note Off event (command 128-143) or Note On with velocity 0
    else if ((command >= 128 && command <= 143) || (command >= 144 && command <= 159 && velocity === 0)) {
      setActiveNotes((prev) => {
        const newState = { ...prev }
        delete newState[note]
        return newState
      })
    }
  }, [])

  const setupMidiListeners = useCallback(
    (access: MIDIAccess) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage
      })
    },
    [handleMidiMessage],
  )

  useEffect(() => {
    if (!midiAccess) return

    setupMidiListeners(midiAccess)

    // Re-setup listeners when MIDI devices change
    const handleStateChange = () => {
      setupMidiListeners(midiAccess)
    }

    midiAccess.addEventListener("statechange", handleStateChange)

    return () => {
      midiAccess.removeEventListener("statechange", handleStateChange)
    }
  }, [midiAccess, setupMidiListeners])

  const clearMidiData = useCallback(() => {
    setMidiData([])
  }, [])

  return {
    midiData,
    activeNotes,
    clearMidiData,
    getNoteName,
  }
}
