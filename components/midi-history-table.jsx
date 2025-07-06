"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function MidiHistoryTable({ midiData, clearMidiData }) {
  const [sortConfig, setSortConfig] = useState({ key: "time", direction: "desc" })

  const sortedData = [...midiData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "asc" ? " ↑" : " ↓"
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">MIDI History</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearMidiData}
          disabled={midiData.length === 0}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        {midiData.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4">No MIDI data recorded yet.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th
                    className="text-left p-2 text-sm font-medium cursor-pointer hover:bg-muted/80"
                    onClick={() => requestSort("noteName")}
                  >
                    Note{getSortIndicator("noteName")}
                  </th>
                  <th
                    className="text-left p-2 text-sm font-medium cursor-pointer hover:bg-muted/80"
                    onClick={() => requestSort("note")}
                  >
                    MIDI #{getSortIndicator("note")}
                  </th>
                  <th
                    className="text-left p-2 text-sm font-medium cursor-pointer hover:bg-muted/80"
                    onClick={() => requestSort("velocity")}
                  >
                    Velocity{getSortIndicator("velocity")}
                  </th>
                  <th
                    className="text-left p-2 text-sm font-medium cursor-pointer hover:bg-muted/80"
                    onClick={() => requestSort("time")}
                  >
                    Time{getSortIndicator("time")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, index) => {
                  const time = new Date(entry.time)
                  const timeString = time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })

                  return (
                    <tr key={index} className="border-t hover:bg-muted/10">
                      <td className="p-2 text-sm font-medium">{entry.noteName}</td>
                      <td className="p-2 text-sm">{entry.note}</td>
                      <td className="p-2 text-sm">{entry.velocity}</td>
                      <td className="p-2 text-sm text-muted-foreground">{timeString}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
