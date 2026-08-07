'use client'

import clsx from 'clsx'
import { COMPANY } from '@/lib/constants'
import Button from './Button'

export interface PricingCardProps {
  name: string
  price: string
  tagline: string
  features: string[]
  /** Renders the solid-red "Professional" treatment. */
  inverted?: boolean
  badge?: string
  onNotifyClick: () => void
}

function Check({ inverted }: { inverted: boolean }) {
  return (
    <span
      className={clsx(
        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
        inverted ? 'bg-white/20' : 'bg-red/12'
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke={inverted ? '#FFFFFF' : '#C8102E'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function PricingCard({
  name,
  price,
  tagline,
  features,
  inverted = false,
  badge,
  onNotifyClick,
}: PricingCardProps) {
  return (
    // h-full here is load-bearing: the inner card's h-full resolves against
    // this wrapper, so without it both cards collapse to content height.
    <div className="relative h-full">
      {badge && (
        <span className="absolute -top-3 left-8 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-deep shadow-lg">
          {badge}
        </span>
      )}

      <div
        className={clsx(
          'relative flex h-full flex-col overflow-hidden rounded-2xl p-7 md:p-9',
          'backdrop-blur-card transition-all duration-300 ease-out',
          inverted
            ? 'border border-red-dark/60 bg-red shadow-[0_30px_80px_-40px_rgba(200,16,46,0.9)]'
            : 'border border-white/8 bg-navy-light/80 hover:border-white/20'
        )}
      >
        <header>
          <h3
            className={clsx(
              'text-sm font-semibold uppercase tracking-[0.14em]',
              inverted ? 'text-white' : 'text-white'
            )}
          >
            {name}
          </h3>
          <p
            className={clsx(
              'mt-2 text-[15px]',
              inverted ? 'text-white/85' : 'text-steel'
            )}
          >
            {tagline}
          </p>
        </header>

        <div className="mt-7 flex items-end gap-2">
          <span className="font-display text-7xl leading-[0.85] text-white md:text-8xl">
            {price}
          </span>
          <span
            className={clsx(
              'pb-2 text-sm',
              inverted ? 'text-white/75' : 'text-steel'
            )}
          >
            /month
          </span>
        </div>

        <div
          className={clsx(
            'mt-7 h-px w-full',
            inverted ? 'bg-white/25' : 'bg-white/10'
          )}
        />

        <ul className="mt-7 flex flex-1 flex-col gap-4">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <Check inverted={inverted} />
              <span
                className={clsx(
                  'text-[15px] leading-relaxed',
                  inverted ? 'text-white/90' : 'text-mist/85'
                )}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-9">
          <Button
            href={COMPANY.shop}
            external
            size="lg"
            fullWidth
            variant={inverted ? 'onRed' : 'primary'}
          >
            Pre-Order Now
          </Button>
          <button
            type="button"
            onClick={onNotifyClick}
            className={clsx(
              'h-11 w-full rounded-lg border text-sm font-medium transition-all duration-200',
              inverted
                ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
                : 'border-white/15 text-white/80 hover:border-white/40 hover:text-white'
            )}
          >
            Notify Me When Available
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingCard
