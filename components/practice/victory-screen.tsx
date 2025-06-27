"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import confetti from "canvas-confetti"

interface VictoryScreenProps {
  score: number
  onClose: () => void
  isOpen: boolean
}

export function VictoryScreen({ score, onClose, isOpen }: VictoryScreenProps) {
  const [showBadge, setShowBadge] = useState(false)

  // Trigger confetti when the component mounts
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2) },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2) },
        })
      }, 250)

      // Show badge after a delay
      setTimeout(() => {
        setShowBadge(true)
      }, 1000)

      return () => {
        clearInterval(interval)
        setShowBadge(false)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <motion.h2
              className="text-2xl font-bold text-primary mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Congratulations!
            </motion.h2>

            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You've mastered this piece with an impressive score!
            </motion.p>

            <motion.div
              className="text-5xl font-bold text-primary mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {score}%
            </motion.div>

            <AnimatePresence>
              {showBadge && (
                <motion.div
                  className="mb-8"
                  initial={{ scale: 0, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.5 }}
                >
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-primary font-semibold uppercase tracking-wider">Achievement</div>
                        <div className="text-lg font-bold text-primary">Master</div>
                        <div className="text-xs text-muted-foreground">C Major Arpeggio</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onClose}>
                Practice Again
              </Button>
              <Button>Next Lesson</Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
