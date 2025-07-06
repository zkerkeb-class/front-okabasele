"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { SkipBack, SkipForward, Volume2, ClockIcon as Metronome, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function PracticeControls() {
  const [volume, setVolume] = useState(75)
  const [loopActive, setLoopActive] = useState(false)
  const [metronomeActive, setMetronomeActive] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)

  // Sections in the current piece
  const sections = ["Introduction", "First Scale", "Second Scale", "Conclusion"]

  // Navigate to next section
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      toast.info(`Moving to ${sections[currentSection + 1]}`)
    }
  }

  // Navigate to previous section
  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      toast.info(`Moving to ${sections[currentSection - 1]}`)
    }
  }

  // Toggle loop mode
  const toggleLoop = () => {
    setLoopActive(!loopActive)
    toast.info(loopActive ? "Loop mode disabled" : "Loop mode enabled")
  }

  // Toggle metronome
  const toggleMetronome = () => {
    setMetronomeActive(!metronomeActive)
    toast.info(metronomeActive ? "Metronome off" : "Metronome on")
  }

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
        <CardTitle className="text-base font-medium">Practice Controls</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{sections[currentSection]}</span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Main controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSection}
                disabled={currentSection === 0}
                className="h-9 w-9"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                className="h-9 w-9"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant={loopActive ? "default" : "outline"} size="sm" onClick={toggleLoop} className="h-8 gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs">Loop</span>
              </Button>

              <Button
                variant={metronomeActive ? "default" : "outline"}
                size="sm"
                onClick={toggleMetronome}
                className="h-8 gap-1"
              >
                <Metronome className="h-3.5 w-3.5" />
                <span className="text-xs">Metronome</span>
              </Button>
            </div>
          </div>

          {/* Volume control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="volume" className="text-sm flex items-center gap-1">
                <Volume2 className="h-3.5 w-3.5" /> Volume
              </Label>
              <span className="text-sm font-medium">{volume}%</span>
            </div>
            <Slider
              id="volume"
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
