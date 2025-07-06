"use client"

import { motion } from "framer-motion"

export function TheoryContent() {
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
    <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h3 className="text-lg font-medium text-primary">C Major Chord Progression</h3>
        <p className="mt-2 text-muted-foreground">
          The C major chord progression typically follows the pattern I-IV-V, which in the key of C would be C-F-G.
          These three chords form the foundation of countless songs and are essential for beginners to master.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <motion.div
          className="border rounded-md p-4 bg-muted/5 shadow-sm hover:shadow-md transition-shadow"
          variants={item}
        >
          <h4 className="font-medium mb-2 text-primary">Chord Structure</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                C
              </span>
              <span>C - E - G (Root, Major 3rd, Perfect 5th)</span>
            </li>
            <li className="flex items-center">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                F
              </span>
              <span>F - A - C (Root, Major 3rd, Perfect 5th)</span>
            </li>
            <li className="flex items-center">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                G
              </span>
              <span>G - B - D (Root, Major 3rd, Perfect 5th)</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="border rounded-md p-4 bg-muted/5 shadow-sm hover:shadow-md transition-shadow"
          variants={item}
        >
          <h4 className="font-medium mb-2 text-primary">Practice Tips</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Try playing each chord in sequence, holding each for 4 beats before transitioning to the next.</li>
            <li>Focus on clean transitions between chords, minimizing gaps or overlaps.</li>
            <li>Practice at a slow tempo first, gradually increasing as you become more comfortable.</li>
            <li>Pay attention to your hand position and finger placement to avoid strain.</li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="border rounded-md p-4 bg-primary/5 mt-4 shadow-sm" variants={item}>
        <h4 className="font-medium mb-2 text-primary">Common Songs Using C-F-G</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            Let It Be - The Beatles
          </motion.div>
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            Sweet Home Alabama - Lynyrd Skynyrd
          </motion.div>
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            Brown Eyed Girl - Van Morrison
          </motion.div>
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            I'm Yours - Jason Mraz
          </motion.div>
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            No Woman No Cry - Bob Marley
          </motion.div>
          <motion.div
            className="p-2 bg-white rounded border shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            Stand By Me - Ben E. King
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
