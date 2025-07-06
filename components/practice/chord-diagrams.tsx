"use client"

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const chords = [
  { name: "C", notes: ["C", "E", "G"], positions: [0, 1, 0, 2, 3, -1] },
  { name: "F", notes: ["F", "A", "C"], positions: [1, 3, 3, 2, 1, 1] },
  { name: "G", notes: ["G", "B", "D"], positions: [3, 2, 0, 0, 0, 3] },
  { name: "Am", notes: ["A", "C", "E"], positions: [0, 1, 2, 2, 0, -1] },
]

export function ChordDiagrams() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={container} initial="hidden" animate="show">
      {chords.map((chord) => (
        <TooltipProvider key={chord.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="flex flex-col items-center"
                variants={item}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="w-full aspect-square max-w-[120px] border rounded-md flex flex-col items-center justify-center p-2 bg-muted/10 relative shadow-sm hover:shadow-md transition-shadow">
                  {/* Chord diagram */}
                  <div className="w-full h-full relative">
                    {/* Strings */}
                    {[0, 1, 2, 3, 4, 5].map((string) => (
                      <div
                        key={`string-${string}`}
                        className="absolute top-0 bottom-0"
                        style={{
                          left: `${string * 20 + 10}%`,
                          width: "1px",
                          backgroundColor: "#ccc",
                        }}
                      />
                    ))}

                    {/* Frets */}
                    {[0, 1, 2, 3, 4].map((fret) => (
                      <div
                        key={`fret-${fret}`}
                        className="absolute left-0 right-0"
                        style={{
                          top: `${fret * 20 + 10}%`,
                          height: fret === 0 ? "2px" : "1px",
                          backgroundColor: fret === 0 ? "#888" : "#ccc",
                        }}
                      />
                    ))}

                    {/* Finger positions */}
                    {chord.positions.map((position, stringIndex) => {
                      if (position === -1) {
                        // X mark for string not played
                        return (
                          <div
                            key={`pos-${stringIndex}`}
                            className="absolute text-red-500 font-bold"
                            style={{
                              left: `${stringIndex * 20 + 10}%`,
                              top: "0%",
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            ×
                          </div>
                        )
                      } else if (position === 0) {
                        // Open string
                        return (
                          <div
                            key={`pos-${stringIndex}`}
                            className="absolute text-green-600 font-bold text-sm"
                            style={{
                              left: `${stringIndex * 20 + 10}%`,
                              top: "0%",
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            ○
                          </div>
                        )
                      } else {
                        // Finger position
                        return (
                          <motion.div
                            key={`pos-${stringIndex}`}
                            className="absolute bg-primary text-white rounded-full flex items-center justify-center text-xs"
                            style={{
                              left: `${stringIndex * 20 + 10}%`,
                              top: `${position * 20}%`,
                              width: "20px",
                              height: "20px",
                              transform: "translate(-50%, -50%)",
                            }}
                            whileHover={{ scale: 1.2 }}
                          >
                            {position}
                          </motion.div>
                        )
                      }
                    })}
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <div className="text-lg font-bold">{chord.name}</div>
                  <div className="text-xs text-muted-foreground">{chord.notes.join(" - ")}</div>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/90 text-white border-none p-2">
              <div className="flex flex-col gap-1">
                <div className="font-medium">{chord.name} Chord</div>
                <div className="text-xs">Notes: {chord.notes.join(", ")}</div>
                <div className="text-xs">Click to see details</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </motion.div>
  )
}
