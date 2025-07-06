"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Note {
  id: number
  pitch: string
  duration: number
  timing: number
  played: boolean
  correct: boolean | null
}

export function SongSection() {
  const [progress, setProgress] = useState(35)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(2)
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, pitch: "C4", duration: 1, timing: 0, played: true, correct: true },
    { id: 2, pitch: "E4", duration: 1, timing: 1, played: true, correct: true },
    { id: 3, pitch: "G4", duration: 1, timing: 2, played: false, correct: null },
    { id: 4, pitch: "C5", duration: 1, timing: 3, played: false, correct: null },
    { id: 5, pitch: "G4", duration: 1, timing: 4, played: false, correct: null },
    { id: 6, pitch: "E4", duration: 1, timing: 5, played: false, correct: null },
    { id: 7, pitch: "C4", duration: 2, timing: 6, played: false, correct: null },
  ])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-primary"
          >
            <path d="M12 5v14"></path>
            <path d="M18 13a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 12 0"></path>
          </svg>
          Section Progress
        </h3>
        <Badge variant="outline" className="text-xs">
          {progress}% Complete
        </Badge>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Progress value={progress} className="h-2" />
      </motion.div>

      <div className="border rounded-md p-4 bg-muted/5 shadow-sm">
        <div className="flex items-center justify-center space-x-1 overflow-x-auto py-4">
          <AnimatePresence>
            {notes.map((note, index) => (
              <TooltipProvider key={note.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`
                        flex flex-col items-center justify-center 
                        w-12 h-16 border rounded-md transition-all
                        ${index === currentNoteIndex ? "border-primary border-2 bg-primary/5 shadow-md" : "border-gray-200"}
                        ${note.played && note.correct ? "bg-green-50" : ""}
                        ${note.played && !note.correct ? "bg-red-50" : ""}
                      `}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: index === currentNoteIndex ? 1.05 : 1,
                        y: index === currentNoteIndex ? -5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 10,
                      }}
                    >
                      <span className={`text-sm font-medium ${index === currentNoteIndex ? "text-primary" : ""}`}>
                        {note.pitch}
                      </span>
                      <span className="text-xs text-muted-foreground">{note.duration === 1 ? "♩" : "𝅗𝅥"}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black/90 text-white border-none p-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{note.pitch}</div>
                      <div className="text-xs">
                        Duration: {note.duration} beat{note.duration > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs">
                        Status:{" "}
                        {index === currentNoteIndex
                          ? "Play now"
                          : note.played && note.correct
                            ? "Correct"
                            : note.played && !note.correct
                              ? "Incorrect"
                              : index < currentNoteIndex
                                ? "Missed"
                                : "Upcoming"}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-sm text-center text-muted-foreground">Play the highlighted note (G4) to continue</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div className="border rounded-md p-3 bg-white shadow-sm" whileHover={{ scale: 1.02 }}>
                <div className="font-medium mb-1 text-primary">Current Section Stats</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Accuracy:</div>
                  <div className="text-right font-medium">85%</div>
                  <div>Mistakes:</div>
                  <div className="text-right font-medium">2</div>
                  <div>Tempo:</div>
                  <div className="text-right font-medium">80 BPM</div>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/90 text-white border-none p-2">
              <div className="text-xs">
                These stats show your performance in the current section. Try to maintain high accuracy while gradually
                increasing tempo.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div className="border rounded-md p-3 bg-white shadow-sm" whileHover={{ scale: 1.02 }}>
                <div className="font-medium mb-1 text-primary">Next Up</div>
                <div className="text-xs text-muted-foreground">
                  After completing this C major arpeggio, you'll move on to the G major chord section.
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/90 text-white border-none p-2">
              <div className="text-xs">This shows what you'll practice next after completing the current section.</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
