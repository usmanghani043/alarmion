'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'

const STEPS = [
  {
    number: '01',
    eyebrow: 'Step One',
    title: 'It Listens',
    body: "Plug the ALD into an outlet near your alarm. It listens for your siren 24 hours a day — whether you're at work, asleep, or across the country.",
  },
  {
    number: '02',
    eyebrow: 'Step Two',
    title: 'It Hears Your Siren',
    body: "When your alarm sounds, the ALD recognizes it. It listens for a few seconds to confirm it's a real alarm and not a door chime or the TV — then it sends the alert.",
  },
  {
    number: '03',
    eyebrow: 'Step Three',
    title: 'You Get the Alert — or We Call the Police',
    body: 'On Self-Monitoring ($9.99/mo), the alert goes straight to you by app, text, and email. On Professional Monitoring ($14.99/mo), our monitoring center gets it too — and we call the police for you.',
  },
]

export function HowItWorks() {
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
        '[data-reveal="step"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-reveal="timeline"]', start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '[data-reveal="line"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.out',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: '[data-reveal="timeline"]', start: 'top 85%' },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-navy py-16 md:py-section"
    >
      {/* Background wordmark texture */}
      <span
        aria-hidden="true"
        className="ghost-word absolute -left-4 top-8 text-[22vw] md:top-4 md:text-[13rem]"
      >
        HOW IT WORKS
      </span>

      <div className="relative mx-auto max-w-editorial px-6 md:px-10">
        <div data-reveal="header" className="reveal max-w-3xl">
          <span className="eyebrow">How It Works</span>
          <h2 className="font-display mt-4 whitespace-pre-line text-5xl text-white sm:text-6xl md:text-8xl">
            {'Three steps.\nConstant protection.'}
          </h2>
        </div>

        <div data-reveal="timeline" className="relative mt-16 md:mt-28">
          {/* Connecting rail — sits on the vertical centre of every node. */}
          <div
            aria-hidden="true"
            data-reveal="line"
            className="absolute left-0 right-0 top-[5px] hidden h-px bg-white/10 md:block"
          />

          <ol className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <li key={step.number} data-reveal="step" className="reveal relative">
                {/* Node row: identical height across steps so all three dots
                    share the rail regardless of the zigzag below. */}
                <span
                  aria-hidden="true"
                  className="relative z-10 hidden h-2.5 w-2.5 rounded-full bg-red ring-4 ring-navy md:block"
                />

                <div
                  className={clsx(
                    'relative',
                    // Zigzag: outer steps sit high, middle step drops.
                    index === 0 && 'md:mt-14',
                    index === 1 && 'md:mt-32',
                    index === 2 && 'md:mt-24'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="ghost-numeral absolute -top-14 left-0 text-[7rem] opacity-8 md:-top-20 md:text-[9rem]"
                  >
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    <span className="eyebrow-muted">{step.eyebrow}</span>
                    <h3 className="font-display mt-2 text-3xl leading-[1.05] text-white md:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-steel">
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
