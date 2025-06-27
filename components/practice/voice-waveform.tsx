"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface VoiceWaveformProps {
  analyser: AnalyserNode | null
}

export function VoiceWaveform({ analyser }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!ctx || !analyser) return

      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw waveform
      ctx.lineWidth = 2
      ctx.strokeStyle = "rgb(123, 97, 255)" // Primary color
      ctx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * (canvas.height / 2)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser])

  return (
    <motion.div
      className="bg-black/10 backdrop-blur-sm rounded-lg p-2 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <canvas ref={canvasRef} width={120} height={40} className="rounded" />
    </motion.div>
  )
}
