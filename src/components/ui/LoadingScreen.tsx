'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

interface LoadingScreenProps {
  progress: number
  isReady: boolean
}

const FADE_MS = 600

export function LoadingScreen({ progress, isReady }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(true)
  const [logoFailed, setLogoFailed] = useState(false)

  // Hold the node through the fade, then drop it so it can't trap focus.
  useEffect(() => {
    if (!isReady) return
    const timer = window.setTimeout(() => setMounted(false), FADE_MS)
    return () => window.clearTimeout(timer)
  }, [isReady])

  // Lock the page while the film decodes — scrolling past an empty canvas
  // would burn the opening beats.
  useEffect(() => {
    if (!mounted) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mounted])

  if (!mounted) return null

  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100)

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-deep',
        'transition-opacity duration-500 ease-out',
        isReady ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
      role="status"
      aria-live="polite"
      aria-label={`Loading experience, ${percent} percent`}
    >
      <div className="flex flex-col items-center gap-4">
        {!logoFailed && (
          <Image
            src="/images/logo-transparent.png"
            alt=""
            width={60}
            height={60}
            priority
            className="h-[60px] w-[60px] object-contain"
            onError={() => setLogoFailed(true)}
          />
        )}
        <span className="font-display text-[28px] font-bold leading-none tracking-[0.1em] text-white">
          ALARMION
        </span>
      </div>

      <div className="relative mt-10 h-px w-64 overflow-hidden bg-white/10">
        <div
          className="h-full bg-red transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
        {/* Shimmer rides the filled portion so the bar reads as active
            even while a slow batch is in flight. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-shimmer h-full w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
      </div>

      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-steel">
        Loading experience — {percent}%
      </p>
    </div>
  )
}

export default LoadingScreen
