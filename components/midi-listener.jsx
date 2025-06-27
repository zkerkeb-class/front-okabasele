"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Music } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "sonner"

import { ActiveNotesDisplay } from "@/components/active-notes-display"
import { PianoVisualization } from "@/components/piano-visualization"
import { MidiHistoryTable } from "@/components/midi-history-table"

// Add custom styles for the scrollbar
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    height: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

// Helper function to convert MIDI note number to note name
const getNoteName = (noteNumber, system) => {
  const letterNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const solfegeNames = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"]

  const octave = Math.floor(noteNumber / 12) - 1
  const noteIndex = noteNumber % 12

  if (system === "solfege") {
    return `${solfegeNames[noteIndex]}${octave}`
  } else {
    return `${letterNames[noteIndex]}${octave}`
  }
}

export default function MidiListener() {
  const [notationSystem, setNotationSystem] = useState("letter") // "letter" for C,D,E or "solfege" for Do,Re,Mi
  const [midiAccess, setMidiAccess] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("Initializing...")
  const [error, setError] = useState(null)
  const [isWebMidiSupported, setIsWebMidiSupported] = useState(false)
  const [midiData, setMidiData] = useState([])
  const [activeNotes, setActiveNotes] = useState({})

  // Use a ref to track the last processed note to prevent duplicates
  const lastNoteRef = useRef({ note: null, command: null, time: 0 })

  // Toggle between notation systems
  const toggleNotationSystem = useCallback(() => {
    setNotationSystem((prev) => (prev === "letter" ? "solfege" : "letter"))
  }, [])

  // Clear MIDI data
  const clearMidiData = useCallback(() => {
    setMidiData([])
  }, [])

  // Handle MIDI messages
  const handleMidiMessage = useCallback(
    (msg) => {
      const [command, note, velocity] = msg.data
      const currentTime = Date.now()

      // Prevent duplicate events by checking if the same note was just processed
      // Only process if it's a different note or if enough time has passed (50ms debounce)
      const isDuplicate =
        lastNoteRef.current.note === note &&
        lastNoteRef.current.command === command &&
        currentTime - lastNoteRef.current.time < 50

      if (isDuplicate) {
        return // Skip processing duplicate events
      }

      // Update the last processed note
      lastNoteRef.current = { note, command, time: currentTime }

      // Note On event (command 144-159) with velocity > 0
      if (command >= 144 && command <= 159 && velocity > 0) {
        const noteName = getNoteName(note, notationSystem)
        setMidiData((prev) => [
          { note, noteName, velocity, time: currentTime },
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
    [notationSystem],
  )

  // Setup MIDI listeners
  const setupMidiListeners = useCallback(
    (access) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage
      })
    },
    [handleMidiMessage],
  )

  // Handle MIDI device state changes
  const handleStateChange = useCallback(
    (event) => {
      const { port } = event
      if (port.type === "input") {
        if (port.state === "connected") {
          setConnectionStatus(`Connected to ${port.name || "MIDI device"}`)
          if (midiAccess) setupMidiListeners(midiAccess)
        } else {
          setConnectionStatus("MIDI device disconnected")
        }
      }
    },
    [midiAccess, setupMidiListeners],
  )

  // Initialize MIDI access
  useEffect(() => {
    // Check if Web MIDI API is supported
    if (!navigator.requestMIDIAccess) {
      setError("Web MIDI API is not supported in this browser.")
      setConnectionStatus("Not supported")
      setIsWebMidiSupported(false)
      return
    }

    setIsWebMidiSupported(true)

    navigator
      .requestMIDIAccess()
      .then((access) => {
        setMidiAccess(access)

        // Setup MIDI device connection listener
        access.addEventListener("statechange", handleStateChange)

        // Initial connection check
        const inputs = Array.from(access.inputs.values())
        if (inputs.length === 0) {
          setConnectionStatus("No MIDI devices found")
        } else {
          setConnectionStatus(`Connected to ${inputs.length} MIDI device(s)`)
          setupMidiListeners(access)
        }
      })
      .catch((err) => {
        console.error("MIDI Access Error:", err)
        setError(`Failed to access MIDI devices: ${err.message}`)
        setConnectionStatus("Connection failed")
      })

    return () => {
      if (midiAccess) {
        midiAccess.removeEventListener("statechange", handleStateChange)
      }
    }
  }, [handleStateChange, setupMidiListeners])

  // Update note names when notation system changes
  useEffect(() => {
    setMidiData((prev) =>
      prev.map((entry) => ({
        ...entry,
        noteName: getNoteName(entry.note, notationSystem),
      })),
    )
  }, [notationSystem])

  // Add click-to-play functionality for piano keys
  const playNote = useCallback(
    (note) => {
      // Simulate a note on event
      setActiveNotes((prev) => ({ ...prev, [note]: true }))

      // Add to MIDI data
      const noteName = getNoteName(note, notationSystem)
      setMidiData((prev) => [{ note, noteName, velocity: 64, time: Date.now() }, ...prev.slice(0, 99)])

      // Simulate a note off event after a short delay
      setTimeout(() => {
        setActiveNotes((prev) => {
          const newState = { ...prev }
          delete newState[note]
          return newState
        })
      }, 300)
    },
    [notationSystem],
  )

  // Determine if browser is mobile for responsive layout
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <style jsx global>
        {scrollbarStyles}
      </style>
      <Toaster position="top-right" />
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Music className="h-6 w-6" />
                MIDI Listener
              </CardTitle>
              <CardDescription>Connect a MIDI device to see and hear the notes you play</CardDescription>
            </div>
            <Badge
              variant={connectionStatus.includes("Connected") ? "default" : "destructive"}
              className="text-xs px-3 py-1"
            >
              {connectionStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              {!isWebMidiSupported && (
                <p className="mt-2 text-sm">
                  Please use a browser that supports Web MIDI API, such as Chrome, Edge, or Opera.
                </p>
              )}
            </Alert>
          )}

          <ActiveNotesDisplay activeNotes={activeNotes} getNoteName={(note) => getNoteName(note, notationSystem)} />

          <PianoVisualization
            activeNotes={activeNotes}
            getNoteName={(note) => getNoteName(note, notationSystem)}
            notationSystem={notationSystem}
            toggleNotationSystem={toggleNotationSystem}
            isWebMidiSupported={isWebMidiSupported}
            playNote={playNote}
          />

          <MidiHistoryTable midiData={midiData} clearMidiData={clearMidiData} />
        </CardContent>

        <CardFooter className="bg-muted/10 flex justify-between flex-wrap gap-2">
          <p className="text-xs text-muted-foreground">
            Note: Web MIDI API requires a secure context (HTTPS) in most browsers.
          </p>
          <p className="text-xs text-muted-foreground">
            {isMobile ? "For best experience, use a desktop browser." : "Click on piano keys to play notes."}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
