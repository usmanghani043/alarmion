'use client'

import clsx from 'clsx'
import { BEATS } from '@/lib/constants'

interface ChapterMarkerProps {
  currentFrame: number
}

export function ChapterMarker({ currentFrame }: ChapterMarkerProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {BEATS.map((beat) => {
        const span = Math.max(beat.frameEnd - beat.frameStart, 1)
        const isActive =
          currentFrame >= beat.frameStart && currentFrame <= beat.frameEnd
        const isPast = currentFrame > beat.frameEnd

        // How far the red fill has travelled down this chapter's tick.
        const fill = isPast
          ? 1
          : isActive
            ? Math.min(Math.max((currentFrame - beat.frameStart) / span, 0), 1)
            : 0

        return (
          <div key={beat.id} className="flex items-center justify-end gap-3">
            <span
              className={clsx(
                'text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ease-out',
                isActive
                  ? 'translate-x-0 text-white opacity-100'
                  : 'translate-x-1 text-white/25 opacity-70'
              )}
            >
              {beat.chapter} {beat.chapterLabel}
            </span>

            <span className="relative block h-8 w-0.5 overflow-hidden bg-white/15">
              <span
                className="absolute inset-x-0 top-0 block bg-red transition-[height] duration-150 ease-out"
                style={{ height: `${fill * 100}%` }}
              />
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default ChapterMarker
