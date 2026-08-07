'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

/**
 * The Alarmion wordmark, in the two treatments the site needs.
 *
 *   dark  — navy text + red accents, for light backgrounds (scrolled navbar)
 *   light — white text + red accents, for dark backgrounds (top navbar, footer)
 *
 * Both variants are the real brand artwork. The white version is generated from
 * the navy source by scripts/make-logo-assets.js, which knocks the navy to white
 * and leaves the red triangle and rules alone — a CSS `brightness(0) invert(1)`
 * filter cannot do this, because it flattens the red to white along with
 * everything else.
 *
 * Both files are rendered stacked and crossfaded rather than swapped, so
 * toggling variant can never flash an undecoded image.
 */

const SOURCE_WIDTH = 1056
const SOURCE_HEIGHT = 190

/**
 * The mark never renders wider than ~180px, but the source is 1056px. Without
 * this hint next/image offers a 3840px candidate to 2x displays.
 */
const DISPLAY_SIZES = '180px'

export interface AlarmionLogoProps {
  variant: 'dark' | 'light'
  className?: string
  /** Set on the navbar instance — it is above the fold. */
  priority?: boolean
}

export function AlarmionLogo({
  variant,
  className,
  priority = false,
}: AlarmionLogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={clsx(
          'inline-flex items-center font-display text-2xl font-bold tracking-[0.06em]',
          'transition-colors duration-300 ease-[ease]',
          variant === 'light' ? 'text-white' : 'text-navy',
          className
        )}
      >
        ALARMION
      </span>
    )
  }

  const shared =
    'h-full w-auto object-contain transition-opacity duration-300 ease-[ease]'

  return (
    <span className={clsx('relative inline-block', className)}>
      {/* In-flow copy establishes the box; the other is layered over it. */}
      <Image
        src="/images/logo-wordmark.png"
        alt="Alarmion"
        width={SOURCE_WIDTH}
        height={SOURCE_HEIGHT}
        sizes={DISPLAY_SIZES}
        priority={priority}
        onError={() => setFailed(true)}
        className={clsx(shared, variant === 'dark' ? 'opacity-100' : 'opacity-0')}
      />
      <Image
        src="/images/logo-wordmark-white.png"
        alt=""
        aria-hidden="true"
        width={SOURCE_WIDTH}
        height={SOURCE_HEIGHT}
        sizes={DISPLAY_SIZES}
        priority={priority}
        onError={() => setFailed(true)}
        className={clsx(
          shared,
          'absolute inset-0',
          variant === 'light' ? 'opacity-100' : 'opacity-0'
        )}
      />
    </span>
  )
}

export default AlarmionLogo
