"use client"

import { useState, useEffect, useCallback } from "react"

export function useMidiConnection() {
  const [midiAccess, setMidiAccess] = useState<null | (typeof navigator extends { requestMIDIAccess: any } ? ReturnType<typeof navigator.requestMIDIAccess> extends Promise<infer T> ? T : never : never)>(null)
  const [connectionStatus, setConnectionStatus] = useState("Initializing...")
  const [error, setError] = useState<string | null>(null)
  const [isWebMidiSupported, setIsWebMidiSupported] = useState(false)

  const handleStateChange = useCallback(function (this: MIDIAccess, event: Event) {
    const midiEvent = event as MIDIConnectionEvent
    const { port } = midiEvent
    if (port && port.type === "input") {
      if (port.state === "connected") {
        setConnectionStatus(`Connected to ${port.name || "MIDI device"}`)
      } else {
        setConnectionStatus("MIDI device disconnected")
      }
    }
  }, [])

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
  }, [handleStateChange])

  return {
    midiAccess,
    connectionStatus,
    error,
    isWebMidiSupported,
  }
}
