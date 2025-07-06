"use client"
import { Button } from "@/components/ui/button"
import { RepeatIcon as Record, Square, Play, Download } from "lucide-react"

export function MidiRecorder({ isRecording, startRecording, stopRecording, recordedData, playRecording, exportMidi }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">MIDI Recorder</h3>
        <div className="flex gap-2">
          {!isRecording ? (
            <Button variant="outline" size="sm" onClick={startRecording} className="flex items-center gap-1">
              <Record className="h-4 w-4 text-red-500" />
              Record
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={stopRecording} className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={playRecording}
            disabled={!recordedData.length}
            className="flex items-center gap-1"
          >
            <Play className="h-4 w-4" />
            Play
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportMidi}
            disabled={!recordedData.length}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-md p-4 bg-muted/10">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-sm">Recording in progress...</p>
          </div>
        ) : recordedData.length > 0 ? (
          <p className="text-sm">Recording complete. {recordedData.length} events captured.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recordings yet. Press Record to start capturing MIDI events.
          </p>
        )}
      </div>
    </div>
  )
}
