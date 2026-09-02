'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const HIDDEN: Record<Direction, string> = {
  up: 'translate-y-12',
  down: '-translate-y-12',
  left: 'translate-x-16',
  right: '-translate-x-16',
  none: 'scale-[0.97]',
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Direction the element travels in from. */
  direction?: Direction
  /** Delay before the reveal animation starts, in ms. */
  delay?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
}

/**
 * Reveals its children with a directional slide + fade the first time it
 * scrolls into view, using an IntersectionObserver. Falls back to instantly
 * visible when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none',
        shown ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0' : cn('opacity-0 blur-[2px]', HIDDEN[direction]),
        className,
      )}
    >
      {children}
    </div>
  )
}
