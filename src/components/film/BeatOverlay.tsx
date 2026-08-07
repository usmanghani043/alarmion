'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { BEATS, COMPANY, TOTAL_FRAMES, type Beat } from '@/lib/constants'
import Button from '@/components/ui/Button'

interface BeatOverlayProps {
  currentFrame: number
  onNotifyClick: () => void
}

const OUT_MS = 220

function beatForFrame(frame: number): Beat {
  for (const beat of BEATS) {
    if (frame >= beat.frameStart && frame <= beat.frameEnd) return beat
  }
  // Past the last cut (or before the first) — clamp to the nearest end.
  const first = BEATS[0] as Beat
  const last = BEATS[BEATS.length - 1] as Beat
  return frame < first.frameStart ? first : last
}

export function BeatOverlay({ currentFrame, onNotifyClick }: BeatOverlayProps) {
  const target = beatForFrame(currentFrame)
  const [shown, setShown] = useState<Beat>(target)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const timerRef = useRef<number | null>(null)

  // Cross-fade: drop the outgoing copy, then mount the incoming one so the
  // beatTextIn keyframe replays from scratch.
  useEffect(() => {
    if (target.id === shown.id) return

    setPhase('out')
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setShown(target)
      setPhase('in')
    }, OUT_MS)

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [target, shown.id])

  const isRight = shown.textAlign === 'right'
  const progressPercent = Math.min((currentFrame / TOTAL_FRAMES) * 100, 100)

  return (
    <>
      {/* Beat 03 alert wash — the only full-bleed red on the page. */}
      <div
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute inset-0 z-10 transition-opacity duration-500',
          shown.alertBeat && phase === 'in' ? 'opacity-100' : 'opacity-0'
        )}
      >
        {shown.alertBeat && <div className="animate-red-pulse h-full w-full" />}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-end">
        <div
          key={shown.id}
          className={clsx(
            'w-full pb-20 md:pb-28',
            phase === 'in'
              ? 'animate-beat-text-in'
              : 'translate-y-2 opacity-0 transition-all duration-200 ease-out'
          )}
        >
          <div
            className={clsx(
              'flex flex-col',
              isRight
                ? 'items-start pl-8 pr-8 text-left md:items-end md:pr-20 md:text-right'
                : 'items-start pl-8 pr-8 text-left md:pl-20'
            )}
          >
            <span className="eyebrow film-text-shadow">{shown.eyebrow}</span>

            <h2
              className={clsx(
                'font-display film-text-shadow mt-3 text-white',
                'text-5xl sm:text-6xl md:text-8xl',
                'max-w-2xl whitespace-pre-line'
              )}
            >
              {shown.headline}
            </h2>

            <p
              className={clsx(
                'film-text-shadow mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-lg'
              )}
            >
              {shown.body}
            </p>

            <div
              className={clsx(
                'mt-6 flex flex-wrap gap-2',
                isRight && 'md:justify-end'
              )}
            >
              {shown.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>

            {shown.showCTA && (
              <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={COMPANY.shop} external size="lg">
                  Pre-Order the ALD — $49.99
                </Button>
                <Button variant="ghost" size="lg" onClick={onNotifyClick}>
                  Notify Me When Available
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Film progress rail */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10"
      >
        <div
          className="h-full bg-red"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  )
}

export default BeatOverlay
