'use client'

import { useRef } from 'react'
import { TOTAL_FRAMES } from '@/lib/constants'
import useScrollCanvas from '@/hooks/useScrollCanvas'
import LoadingScreen from '@/components/ui/LoadingScreen'
import CanvasPlayer from './CanvasPlayer'
import BeatOverlay from './BeatOverlay'
import ChapterMarker from './ChapterMarker'
import ScrollCue from './ScrollCue'

interface FilmSectionProps {
  onNotifyClick: () => void
}

export function FilmSection({ onNotifyClick }: FilmSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { loadProgress, isReady, hasFrames, currentFrame } = useScrollCanvas({
    scrollContainerRef,
    canvasRef,
  })

  return (
    <>
      <LoadingScreen progress={loadProgress} isReady={isReady} />

      <section
        id="film"
        ref={scrollContainerRef}
        className="relative"
        style={{ height: '500vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-navy-deep">
          {/* Static backdrop: visible before the film decodes, and the
              permanent floor if /public/frames has not been generated yet. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_15%,#16305f_0%,#0d1b3e_45%,#080f22_100%)]"
          />

          {hasFrames && <CanvasPlayer ref={canvasRef} isReady={isReady} />}

          {/* Legibility gradients — bottom carries the headline block. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(8,15,34,0.5) 0%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to top, rgba(8,15,34,0.9) 0%, rgba(8,15,34,0.4) 40%, transparent 100%)',
            }}
          />

          <BeatOverlay currentFrame={currentFrame} onNotifyClick={onNotifyClick} />
          <ChapterMarker currentFrame={currentFrame} />
          <ScrollCue currentFrame={currentFrame} totalFrames={TOTAL_FRAMES} />
        </div>
      </section>
    </>
  )
}

export default FilmSection
