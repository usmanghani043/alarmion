'use client'

import clsx from 'clsx'

interface ScrollCueProps {
  currentFrame: number
  totalFrames: number
}

export function ScrollCue({ currentFrame, totalFrames }: ScrollCueProps) {
  const visible = currentFrame < totalFrames * 0.02

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2',
        'flex flex-col items-center gap-2 transition-opacity duration-500 ease-out',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="text-[10px] uppercase tracking-[0.28em] text-white/50">
        Scroll
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="animate-scroll-bounce text-white/60"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default ScrollCue
