'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BADGES = [
  { label: 'UL Listed', sub: 'Monitoring Center' },
  { label: 'Licensed & Insured', sub: 'State Alarm Co.' },
  { label: '24/7 Response', sub: '365 Days a Year' },
  { label: 'AES-256 Encrypted', sub: 'Bank-Grade Data' },
]

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-red" aria-hidden="true">
      <path
        d="M12 2.5l7.5 3.2v5.6c0 4.6-3.1 8.7-7.5 9.9-4.4-1.2-7.5-5.3-7.5-9.9V5.7L12 2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 12.1l2.2 2.2 4.2-4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = sectionRef.current
    if (!root) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-reveal="badge-header"]',
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
        '[data-reveal="badge"]',
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
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-navy-light py-14 md:py-20">
      {/* Precision hairline that opens the band. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-px w-[60px] -translate-x-1/2 bg-red"
      />

      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <p
          data-reveal="badge-header"
          className="eyebrow reveal text-center"
        >
          Licensed Security. Certified Monitoring.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          {BADGES.map((badge, index) => (
            <div
              key={badge.label}
              data-reveal="badge"
              className={
                'reveal flex flex-col items-center px-2 text-center ' +
                (index > 0 ? 'md:border-l md:border-white/10' : '')
              }
            >
              <ShieldIcon />
              <p className="mt-4 text-sm font-semibold tracking-[0.02em] text-white">
                {badge.label}
              </p>
              <p className="mt-1 text-xs text-steel">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
