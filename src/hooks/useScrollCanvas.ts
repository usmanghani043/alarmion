'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { TOTAL_FRAMES } from '@/lib/constants'
import {
  disposeFrames,
  preloadAllFrames,
  probeFramesAvailable,
  progressToFrame,
  type FrameBitmap,
} from '@/lib/frameLoader'

interface UseScrollCanvasArgs {
  // React 19 types resolve `useRef<T>(null)` to `RefObject<T | null>`, so the
  // nullable form is what callers actually hold.
  scrollContainerRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  totalFrames?: number
}

interface UseScrollCanvasResult {
  loadProgress: number
  isReady: boolean
  /** True when no frames could be fetched — consumers should show a static backdrop. */
  hasFrames: boolean
  currentFrame: number
  scrollProgress: number
}

/**
 * The zero-lag engine: scroll → RAF → single drawImage of a pre-decoded frame.
 * No decoding, no layout reads, and no redraw when the frame index is unchanged.
 */
export function useScrollCanvas({
  scrollContainerRef,
  canvasRef,
  totalFrames = TOTAL_FRAMES,
}: UseScrollCanvasArgs): UseScrollCanvasResult {
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [hasFrames, setHasFrames] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const framesRef = useRef<FrameBitmap[]>([])
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(-1)

  /** Paints one frame, cover-fitted and DPR-corrected. */
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const bitmap = framesRef.current[index]
      if (!bitmap) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssWidth = canvas.clientWidth
      const cssHeight = canvas.clientHeight
      if (cssWidth === 0 || cssHeight === 0) return

      const targetWidth = Math.round(cssWidth * dpr)
      const targetHeight = Math.round(cssHeight * dpr)
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth
        canvas.height = targetHeight
      }

      // Cover fit: scale to the larger ratio, then centre the overflow.
      const scale = Math.max(
        targetWidth / bitmap.width,
        targetHeight / bitmap.height
      )
      const drawWidth = bitmap.width * scale
      const drawHeight = bitmap.height * scale
      const x = (targetWidth - drawWidth) / 2
      const y = (targetHeight - drawHeight) / 2

      ctx.clearRect(0, 0, targetWidth, targetHeight)
      ctx.drawImage(bitmap, x, y, drawWidth, drawHeight)
    },
    [canvasRef]
  )

  // ---- Preload -------------------------------------------------------------
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const available = await probeFramesAvailable()
      if (cancelled) return

      if (!available) {
        // Nothing extracted yet: skip 1800 doomed requests, run the page
        // with scroll-driven text over a static backdrop.
        framesRef.current = []
        setHasFrames(false)
        setLoadProgress(1)
        setIsReady(true)
        return
      }

      const frames = await preloadAllFrames(totalFrames, (progress) => {
        if (!cancelled) setLoadProgress(progress)
      })

      if (cancelled) {
        disposeFrames(frames)
        return
      }

      framesRef.current = frames
      setHasFrames(frames.some((frame) => frame !== null))
      setIsReady(true)
    }

    void load()

    return () => {
      cancelled = true
      disposeFrames(framesRef.current)
      framesRef.current = []
    }
  }, [totalFrames])

  // ---- Draw the first frame as soon as we're ready -------------------------
  useEffect(() => {
    if (!isReady || !hasFrames) return
    lastFrameRef.current = 0
    drawFrame(0)
  }, [isReady, hasFrames, drawFrame])

  // ---- Scroll + resize -----------------------------------------------------
  useEffect(() => {
    if (!isReady) return

    const update = () => {
      rafRef.current = null

      const container = scrollContainerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      const totalScrollHeight = container.scrollHeight - window.innerHeight
      const progress =
        totalScrollHeight > 0 ? Math.min(scrolled / totalScrollHeight, 1) : 0

      const frameIndex = progressToFrame(progress, totalFrames)

      setScrollProgress(progress)

      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex
        setCurrentFrame(frameIndex)
        drawFrame(frameIndex)
      }
    }

    const schedule = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    const onResize = () => {
      // Force a repaint at the current frame — canvas backing store changed.
      lastFrameRef.current = -1
      schedule()
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isReady, scrollContainerRef, drawFrame, totalFrames])

  return { loadProgress, isReady, hasFrames, currentFrame, scrollProgress }
}

export default useScrollCanvas
