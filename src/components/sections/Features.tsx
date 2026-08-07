'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'

interface Feature {
  title: string
  body: string
  icon: ReactNode
  wide?: boolean
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const FEATURES: Feature[] = [
  {
    title: 'Fully Licensed',
    body: 'Alarmion is a licensed alarm company, partnered with a UL-listed, nationally certified monitoring center.',
    wide: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3z" {...stroke} />
        <path d="M9 12l2 2 4-4" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'No Contracts. Ever.',
    body: 'Both plans are month-to-month. Cancel any time from the app — no cancellation fees, no early termination fees.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M7 4h7l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z" {...stroke} />
        <path d="M14 4v5h5" {...stroke} />
        <path d="M9 16l6-6" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'We Call the Police',
    body: "When your siren sounds, our monitoring center confirms it and calls the police if needed. Minutes matter — we don't waste any.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path
          d="M6.5 4h3l1.5 4-2 1.4a12 12 0 005.6 5.6L16 13l4 1.5v3a2 2 0 01-2.2 2A15.5 15.5 0 014.5 6.2 2 2 0 016.5 4z"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    title: 'AES-256 Encrypted',
    body: 'Bank-grade encryption on every signal from your ALD to our monitoring center. Your data never travels unprotected.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <rect x="4.5" y="10" width="15" height="10" rx="2" {...stroke} />
        <path d="M8 10V7.5a4 4 0 018 0V10" {...stroke} />
        <path d="M12 14v2.5" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Zero Technician Hassles',
    body: 'Unbox it, plug it into a wall outlet, connect to Wi-Fi in the app. No drilling. No appointment window.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M9 3v5M15 3v5" {...stroke} />
        <path d="M6 8h12v3a6 6 0 01-6 6 6 6 0 01-6-6V8z" {...stroke} />
        <path d="M12 17v4" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Works With Any Alarm',
    body: 'Old or new. Wired or wireless. Any brand. The ALD never touches your alarm — it just listens for the siren.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M12 9v6" {...stroke} />
        <path d="M8.5 6.5a7 7 0 000 11M15.5 6.5a7 7 0 010 11" {...stroke} />
        <path d="M5.5 4a11 11 0 000 16M18.5 4a11 11 0 010 16" {...stroke} />
      </svg>
    ),
  },
]

export function Features() {
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
        '[data-reveal="card"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-reveal="grid"]', start: 'top 85%' },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-deep py-16 md:py-section"
    >
      <span
        aria-hidden="true"
        className="ghost-numeral absolute -top-6 right-4 text-[10rem] md:-top-12 md:text-[18rem]"
      >
        02
      </span>

      <div className="relative mx-auto max-w-editorial px-6 md:px-10">
        <div
          data-reveal="header"
          className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="eyebrow">Why Alarmion</span>
            <h2 className="font-display mt-4 whitespace-pre-line text-5xl text-white sm:text-6xl md:text-8xl">
              {'Built for the\nalarm you own.'}
            </h2>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-steel md:pb-3">
            No rip-and-replace. No new panel. The ALD adds professional
            monitoring to hardware that is already on your wall.
          </p>
        </div>

        <div className="rule mt-12 md:mt-16" />

        <div
          data-reveal="grid"
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              data-reveal="card"
              className={clsx(
                'reveal group relative overflow-hidden rounded-2xl p-6 md:p-8',
                'glass transition-all duration-300 ease-out',
                'hover:-translate-y-0.5 hover:border-white/20',
                feature.wide && 'sm:col-span-2'
              )}
            >
              {/* Hover glow — only on the lead card. */}
              {feature.wide && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(120% 140% at 0% 0%, rgba(200,16,46,0.16) 0%, transparent 55%)',
                  }}
                />
              )}

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red/10 text-red">
                  {feature.icon}
                </div>

                <h3
                  className={clsx(
                    'font-display mt-6 text-white',
                    feature.wide ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.75rem]'
                  )}
                >
                  {feature.title}
                </h3>

                <p
                  className={clsx(
                    'mt-3 text-[15px] leading-relaxed text-steel',
                    feature.wide && 'max-w-xl'
                  )}
                >
                  {feature.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
