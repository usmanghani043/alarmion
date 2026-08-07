'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'
import { COVERED_STATES, LAUNCH_STATE } from '@/lib/constants'
import Button from '@/components/ui/Button'

interface CoverageProps {
  onNotifyClick: () => void
}

export function Coverage({ onNotifyClick }: CoverageProps) {
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
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '[data-reveal="pill"]',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.012,
          scrollTrigger: { trigger: '[data-reveal="grid"]', start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '[data-reveal="waitlist"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-reveal="waitlist"]', start: 'top 90%' },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="coverage"
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-deep py-16 md:py-section"
    >
      <div className="relative mx-auto max-w-editorial px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto,1fr] lg:gap-20">
          {/* The stat carries the section — deliberately oversized. */}
          <div data-reveal="header" className="reveal">
            <span className="eyebrow">Coverage</span>
            <div className="mt-3 flex items-start gap-3">
              <span
                className="font-display leading-[0.8] text-red"
                style={{ fontSize: 'clamp(7rem, 16vw, 11.25rem)' }}
              >
                38
              </span>
            </div>
            <p className="font-display -mt-1 text-2xl uppercase tracking-[0.06em] text-white md:text-3xl">
              States Covered
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-steel">
              Professional monitoring is live or launching across 38 states.
              Florida is first out of the gate.
            </p>
          </div>

          <div data-reveal="header" className="reveal self-center">
            <blockquote className="border-l-[3px] border-red pl-6 md:pl-8">
              <p className="font-display text-3xl leading-[1.08] text-white sm:text-4xl md:text-5xl">
                20 million American homes have an alarm that nobody&rsquo;s
                listening to.
              </p>
            </blockquote>
          </div>
        </div>

        <div className="rule mt-14 md:mt-20" />

        <div
          data-reveal="grid"
          className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        >
          {COVERED_STATES.map((state) => {
            const isLaunch = state === LAUNCH_STATE
            return (
              <div
                key={state}
                data-reveal="pill"
                className={clsx(
                  'reveal flex items-center justify-center rounded-full border px-3 py-2 text-center text-xs transition-all duration-200',
                  isLaunch
                    ? 'border-red bg-red/12 font-semibold text-white'
                    : 'border-white/10 text-steel hover:border-white/45 hover:text-white'
                )}
              >
                {isLaunch ? (
                  <span className="flex flex-col leading-tight">
                    <span>{state}</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-red">
                      ★ Launch
                    </span>
                  </span>
                ) : (
                  state
                )}
              </div>
            )
          })}
        </div>

        <div
          data-reveal="waitlist"
          className="reveal glass mt-12 flex flex-col gap-6 rounded-2xl p-7 md:mt-16 md:flex-row md:items-center md:justify-between md:p-9"
        >
          <div className="max-w-xl">
            <span className="eyebrow-muted">Not listed yet?</span>
            <h3 className="font-display mt-3 text-3xl text-white md:text-4xl">
              Get on the waitlist for your state.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-steel">
              We expand state by state as licensing clears. Tell us where you
              are and we&rsquo;ll email you the day monitoring goes live near
              you.
            </p>
          </div>

          <Button size="lg" onClick={onNotifyClick} className="shrink-0">
            Join the Waitlist
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Coverage
