/**
 * Frame loading for the scroll film.
 *
 * Frames live at /frames/f0001.webp … f{TOTAL_FRAMES}.webp and are decoded to
 * ImageBitmaps up front so the scroll handler never pays a decode cost — the
 * only per-frame work at scroll time is a single ctx.drawImage().
 *
 * MEMORY BUDGET — read before raising TOTAL_FRAMES:
 * a decoded 1280x720 bitmap costs ~3.7 MB of GPU/host memory (w * h * 4 bytes).
 * 1800 frames is therefore ~6.6 GB and will be evicted or crash the tab. In
 * practice, target 600–900 frames at 1280x720 (~2.2–3.3 GB peak, browsers
 * compress/evict some of it), or drop the extraction scale to 960x540 to halve
 * it. MAX_DECODE_WIDTH below downscales on small viewports where the extra
 * resolution is invisible anyway.
 */

/** A frame that failed to load stays `null` so array indices remain 1:1 with frame numbers. */
export type FrameBitmap = ImageBitmap | null

/** Frames are fetched in batches so the browser keeps a healthy request pipeline. */
const BATCH_SIZE = 50

/** Never decode wider than this — pointless memory on phones and tablets. */
const MAX_DECODE_WIDTH = 1600

export function frameUrl(index: number): string {
  return `/frames/f${String(index + 1).padStart(4, '0')}.webp`
}

export function progressToFrame(progress: number, totalFrames: number): number {
  return Math.min(Math.floor(progress * totalFrames), totalFrames - 1)
}

/**
 * Cheap existence check for the first frame. Lets the app skip 1800 doomed
 * requests (and an infinite loading screen) when frames have not been
 * extracted yet — the film then falls back to a static backdrop.
 */
export async function probeFramesAvailable(): Promise<boolean> {
  try {
    const res = await fetch(frameUrl(0), { method: 'HEAD', cache: 'force-cache' })
    return res.ok
  } catch {
    return false
  }
}

async function loadFrame(index: number, decodeWidth: number): Promise<FrameBitmap> {
  try {
    const res = await fetch(frameUrl(index), { cache: 'force-cache' })
    if (!res.ok) return null
    const blob = await res.blob()

    // resizeWidth keeps decoded bitmaps proportional to what we can actually
    // display; omitted entirely when the source is already small enough.
    return await createImageBitmap(blob, {
      resizeWidth: decodeWidth,
      resizeQuality: 'high',
    })
  } catch {
    return null
  }
}

/**
 * Decodes every frame into an ImageBitmap array, reporting 0 → 1 progress as
 * each batch settles. Failed frames resolve to `null` rather than rejecting,
 * so a few missing files degrade the film instead of breaking the page.
 */
export async function preloadAllFrames(
  totalFrames: number,
  onProgress: (progress: number) => void
): Promise<FrameBitmap[]> {
  const decodeWidth = Math.min(
    MAX_DECODE_WIDTH,
    Math.ceil(
      (typeof window === 'undefined' ? 1280 : window.innerWidth) *
        (typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2))
    )
  )

  const frames: FrameBitmap[] = new Array<FrameBitmap>(totalFrames).fill(null)
  let settled = 0

  for (let start = 0; start < totalFrames; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, totalFrames)
    const batch: Promise<void>[] = []

    for (let i = start; i < end; i++) {
      const index = i
      batch.push(
        loadFrame(index, decodeWidth).then((bitmap) => {
          frames[index] = bitmap
          settled += 1
        })
      )
    }

    await Promise.all(batch)
    onProgress(Math.min(settled / totalFrames, 1))
  }

  onProgress(1)
  return frames
}

/** Releases decoded bitmaps back to the browser on unmount. */
export function disposeFrames(frames: FrameBitmap[]): void {
  for (const frame of frames) {
    frame?.close()
  }
}
