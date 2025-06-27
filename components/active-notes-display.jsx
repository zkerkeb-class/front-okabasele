import { Badge } from "@/components/ui/badge"

export function ActiveNotesDisplay({ activeNotes, getNoteName }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Active Notes</h3>
      <div className="flex flex-wrap gap-1 mb-4 min-h-16 p-4 border rounded-md bg-muted/20">
        {Object.keys(activeNotes).length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No active notes. Play your MIDI device or click piano keys below...
          </p>
        ) : (
          Object.keys(activeNotes).map((noteNumber) => {
            const note = Number.parseInt(noteNumber)
            return (
              <Badge
                key={note}
                variant="secondary"
                className="text-sm px-3 py-1 bg-primary text-primary-foreground animate-pulse"
              >
                {getNoteName(note)}
              </Badge>
            )
          })
        )}
      </div>
    </div>
  )
}
