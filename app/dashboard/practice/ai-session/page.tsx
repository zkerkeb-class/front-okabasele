"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/UserContext"
import { createPracticeSession } from "@/lib/api/session"
import { createThreadForSession } from "@/lib/api/assistant"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PianoKeyboard } from "@/components/piano/piano-keyboard"
import { AITutor } from "@/components/practice/ai-tutor"
import { SheetMusicDisplay } from "@/components/practice/sheet-music-display"
import { PracticeControls } from "@/components/practice/practice-controls"
import { ProgressPanel } from "@/components/practice/progress-panel"
import { MIDIPerformanceProvider } from "@/components/midi/midi-performance-provider"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Play } from "lucide-react"
import { toast } from "sonner"
import { VoiceWaveform } from "@/components/practice/voice-waveform"

export default function AIPracticePage() {
  const [isListening, setIsListening] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLesson, setCurrentLesson] = useState({
    title: "C Major Scale",
    difficulty: "Beginner",
    description: "Learn to play the C Major scale with proper fingering",
  })
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const { user } = useUser();

  // Initialisation : création session + thread AI
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Créer une session de pratique
        const session = await createPracticeSession({ userId: user.id });
        setSessionId(session._id);
        console.log("Session created:", session._id);
        
        // Créer un thread AI pour cette session
        const thread = await createThreadForSession({ sessionId: session._id});
        setThreadId(thread.threadId);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Erreur création session/thread:", e);
      }
    })();
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user]);

  const toggleListening = async () => {
    if (isListening) {
      // Stop listening
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop())
        micStreamRef.current = null
      }
      setIsListening(false)
      toast.info("Voice recognition paused")
    } else {
      try {
        // Start listening
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        micStreamRef.current = stream

        if (audioContextRef.current && analyserRef.current) {
          const source = audioContextRef.current.createMediaStreamSource(stream)
          source.connect(analyserRef.current)
        }

        setIsListening(true)
        toast.success("Listening for voice commands", {
          description: "Try saying 'Show me how to play this' or 'What is a C major scale?'",
        })
      } catch (error) {
        console.error("Error accessing microphone:", error)
        toast.error("Could not access microphone", {
          description: "Please check your browser permissions and try again.",
        })
      }
    }
  }

  // Start practice session
  const startPractice = () => {
    setIsPlaying(true)
    toast.success("Practice session started", {
      description: "Play along with the highlighted notes on the keyboard.",
    })
  }

  return (
    <DashboardShell>
      <MIDIPerformanceProvider>
        <div className="flex flex-col gap-6 relative">
          {/* Lesson Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{currentLesson.title}</h1>
              <p className="text-muted-foreground">{currentLesson.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" className="gap-1" onClick={startPractice} disabled={isPlaying}>
                <Play className="h-4 w-4" />
                Start Practice
              </Button>
            </div>
          </div>

          {/* Voice Waveform - Only shown when listening */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                className="absolute top-24 right-4 z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <VoiceWaveform analyser={analyserRef.current} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Piano Keyboard */}
          <div className="bg-gradient-to-b from-background to-muted/5 rounded-xl border shadow-lg p-6">
            <PianoKeyboard />
          </div>

          {/* Sheet Music Display */}
          <SheetMusicDisplay />

          {/* Practice Controls */}
          <PracticeControls />

          {/* Stats Toggle Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? (
                <>
                  Hide Statistics <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show Statistics <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Progress Statistics Panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <ProgressPanel sessionId={sessionId} userId={user?.id} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Tutor with integrated chat */}
          <AITutor
            isListening={isListening}
            toggleListening={toggleListening}
            sessionId={sessionId}
            threadId={threadId}
            userId={user?.id}
          />
        </div>
      </MIDIPerformanceProvider>
    </DashboardShell>
  )
}
