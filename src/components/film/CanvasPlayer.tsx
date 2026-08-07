'use client'

import { forwardRef } from 'react'
import clsx from 'clsx'

interface CanvasPlayerProps {
  isReady: boolean
}

/**
 * The film surface. Owns nothing but the <canvas> element — every pixel is
 * painted by useScrollCanvas so React never re-renders during scroll.
 */
export const CanvasPlayer = forwardRef<HTMLCanvasElement, CanvasPlayerProps>(
  function CanvasPlayer({ isReady }, ref) {
    return (
      <canvas
        ref={ref}
        aria-hidden="true"
        className={clsx(
          'film-canvas absolute inset-0 h-full w-full transition-opacity duration-700 ease-out',
          isReady ? 'opacity-100' : 'opacity-0'
        )}
      />
    )
  }
)

export default CanvasPlayer
