"use client"

import { useState, useEffect, useCallback } from "react"

export function useMidiData(midiAccess, notationSystem) {
  const [midiData, setMidiData] = useState([])
  const [activeNotes, setActiveNotes] = useState({})

  // Helper function to convert MIDI note number to note name
  const getNoteName = useCallback(
    (noteNumber) => {
      const letterNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
      const solfegeNames = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"]

      const octave = Math.floor(noteNumber / 12) - 1
      const noteIndex = noteNumber % 12

      if (notationSystem === "solfege") {
        return `${solfegeNames[noteIndex]}${octave}`
      } else {
        return `${letterNames[noteIndex]}${octave}`
      }
    },
    [notationSystem],
  )

  const handleMidiMessage = useCallback(
    (msg) => {
      const [command, note, velocity] = msg.data

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
    },
    [getNoteName],
  )

  useEffect(() => {
    if (!midiAccess) return

    // Setup MIDI listeners
    const setupMidiListeners = () => {
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage
      })
    }

    setupMidiListeners()

    // Re-setup listeners when MIDI devices change
    const handleStateChange = () => {
      setupMidiListeners()
    }

    midiAccess.addEventListener("statechange", handleStateChange)

    return () => {
      midiAccess.removeEventListener("statechange", handleStateChange)
    }
  }, [midiAccess, handleMidiMessage])

  // Update note names when notation system changes
  useEffect(() => {
    setMidiData((prev) =>
      prev.map((entry) => ({
        ...entry,
        noteName: getNoteName(entry.note),
      })),
    )
  }, [notationSystem, getNoteName])

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
