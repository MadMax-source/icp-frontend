'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  size: number
  hue: number
  twinkle: number
  twinkleSpeed: number
}

/**
 * A GPU-friendly canvas starfield that drifts toward the viewer for a subtle
 * 3D warp effect, with glowing, twinkling stars. Purely decorative — it sits
 * fixed behind all content and respects prefers-reduced-motion.
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let stars: Star[] = []
    let raf = 0
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    // Gold + cool-white palette to match the protocol accent.
    const HUES = [46, 44, 210, 0] // gold, warm gold, faint blue, white(0 sat)

    function makeStar(initial: boolean): Star {
      return {
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: initial ? Math.random() * width : width,
        size: Math.random() * 1.4 + 0.4,
        hue: HUES[(Math.random() * HUES.length) | 0],
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.008,
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(220, Math.floor((width * height) / 9000))
      stars = Array.from({ length: count }, () => makeStar(true))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // Ease the parallax offset toward the pointer position.
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05

      const cx = width / 2
      const cy = height / 2

      for (const s of stars) {
        if (!reduceMotion) {
          s.z -= 0.9
          s.twinkle += s.twinkleSpeed
          if (s.z <= 1) {
            Object.assign(s, makeStar(false))
          }
        }

        const k = 128 / s.z
        const px = s.x * k + cx + mouseX * (k * 0.6)
        const py = s.y * k + cy + mouseY * (k * 0.6)

        if (px < -50 || px > width + 50 || py < -50 || py > height + 50) continue

        // Depth: closer stars are larger and brighter.
        const depth = 1 - s.z / width
        const radius = s.size * (0.5 + depth * 2.4)
        const twinkleAlpha = reduceMotion ? 0.7 : 0.45 + Math.sin(s.twinkle) * 0.35
        const alpha = Math.max(0, Math.min(1, twinkleAlpha * (0.25 + depth)))

        const color =
          s.hue === 0
            ? `rgba(245, 244, 240, ${alpha})`
            : `oklch(0.85 0.13 ${s.hue} / ${alpha})`

        // Glow
        ctx.beginPath()
        ctx.shadowBlur = radius * 4
        ctx.shadowColor =
          s.hue === 0 ? `rgba(245, 244, 240, ${alpha})` : `oklch(0.82 0.14 ${s.hue} / ${alpha})`
        ctx.fillStyle = color
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(draw)
    }

    function onPointerMove(e: PointerEvent) {
      targetX = (e.clientX / width - 0.5) * 40
      targetY = (e.clientY / height - 0.5) * 40
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    if (!reduceMotion) window.addEventListener('pointermove', onPointerMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="size-full opacity-70" />
      {/* Soft gold aura anchored top-center */}
      <div className="animate-aura absolute left-1/2 top-[-10%] size-[60rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
      {/* Vignette so content stays legible over the stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--background)_100%)]" />
    </div>
  )
}
