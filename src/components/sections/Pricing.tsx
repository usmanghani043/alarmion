'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COMPANY } from '@/lib/constants'
import Button from '@/components/ui/Button'
import PricingCard from '@/components/ui/PricingCard'

interface PricingProps {
  onNotifyClick: () => void
}

const SELF_FEATURES = [
  'Alerts by app, text, and email the moment your siren is confirmed',
  'You get the alert — you decide what to do',
  'Works with the alarm you already have',
  'No contract. Cancel any time.',
]

const PRO_FEATURES = [
  'A real person confirms the signal, 24/7 — not an app, not a chatbot',
  'We confirm the alarm and call the police for you — if needed',
  'Everything in Self-Monitoring, plus the phone call you don’t have to make',
  'No contract. No activation fee. Cancel any time.',
]

export function Pricing({ onNotifyClick }: PricingProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = sectionRef.current
    if (!root) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-reveal="header"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '[data-reveal="banner"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-reveal="banner"]', start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '[data-reveal="plan"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-reveal="plans"]', start: 'top 85%' },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative overflow-hidden bg-navy py-16 md:py-section"
    >
      <span
        aria-hidden="true"
        className="ghost-numeral absolute -top-8 left-4 text-[10rem] md:-top-16 md:text-[18rem]"
      >
        04
      </span>

      <div className="relative mx-auto max-w-editorial px-6 md:px-10">
        <div
          data-reveal="header"
          className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="eyebrow">Pricing</span>
            <h2 className="font-display mt-4 whitespace-pre-line text-5xl text-white sm:text-6xl md:text-8xl">
              {'Two plans. No contract.\nCancel any time.'}
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-steel md:pb-3">
            The difference is simple: on one plan YOU call the police. On the
            other, WE do.
          </p>
        </div>

        {/* Hardware banner */}
        <div
          data-reveal="banner"
          className="reveal glass mt-14 flex flex-col gap-6 rounded-2xl p-6 md:mt-16 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <span className="eyebrow-muted">ALD Hardware — Pre-Sale Offer</span>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <span className="font-display text-5xl leading-none text-white md:text-6xl">
                $49.99
              </span>
              <span className="pb-1.5 text-lg text-steel line-through decoration-steel/60">
                $69.99
              </span>
              <span className="mb-2 rounded-full bg-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Save $20
              </span>
            </div>
            <p className="mt-3 text-sm text-steel">
              Guaranteed early shipment · 30-Day Money-Back Guarantee
            </p>
          </div>

          <Button href={COMPANY.shop} external size="lg" className="shrink-0">
            Reserve Your ALD Unit →
          </Button>
        </div>

        <div
          data-reveal="plans"
          className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2"
        >
          <div data-reveal="plan" className="reveal h-full">
            <PricingCard
              name="Self-Monitoring"
              price="$9.99"
              tagline="You get the alert. You call the police."
              features={SELF_FEATURES}
              onNotifyClick={onNotifyClick}
            />
          </div>

          <div data-reveal="plan" className="reveal h-full">
            <PricingCard
              name="Professional Monitoring"
              price="$14.99"
              tagline="We get the alert. We call the police."
              features={PRO_FEATURES}
              badge="Most Popular"
              inverted
              onNotifyClick={onNotifyClick}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-steel">
          Monitoring plans require the ALD device. Prices shown in USD, billed
          monthly.
        </p>
      </div>
    </section>
  )
}

export default Pricing
