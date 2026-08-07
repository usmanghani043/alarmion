'use client'

import { COMPANY, NAV_LINKS } from '@/lib/constants'
import AlarmionLogo from './AlarmionLogo'
import Button from './Button'

const LEGAL_LINKS = [
  { label: 'FAQs', href: COMPANY.faqs },
  { label: 'Licenses', href: COMPANY.licenses },
  { label: 'Terms of Service', href: COMPANY.terms },
  { label: 'Privacy Policy', href: COMPANY.privacy },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-deep">
      {/* Closing CTA band */}
      <div className="mx-auto max-w-editorial px-6 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.02] text-white sm:text-5xl md:text-7xl">
          A real person sees your alarm — 24/7.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-steel">
          No contract. No technician. Just trained operators watching for your
          siren, day and night.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={COMPANY.shop} external size="lg">
            Pre-Order the ALD — $49.99
          </Button>
          <Button href={COMPANY.phoneHref} variant="ghost" size="lg">
            Call {COMPANY.phone}
          </Button>
        </div>
      </div>

      <div className="rule mx-auto max-w-editorial" />

      {/* Identity + navigation */}
      <div className="mx-auto flex max-w-editorial flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between md:px-10">
        <div>
          <AlarmionLogo variant="light" className="h-7 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
            Professional monitoring for the alarm system you already own.
          </p>
          <a
            href={COMPANY.phoneHref}
            className="mt-4 inline-block text-sm tabular-nums text-mist transition-colors hover:text-white"
          >
            {COMPANY.phone}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-3 sm:gap-x-20">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-steel transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-steel transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rule mx-auto max-w-editorial" />

      <div className="mx-auto flex max-w-editorial flex-col gap-2 px-6 py-7 text-xs text-steel sm:flex-row sm:items-center sm:justify-between md:px-10">
        <span>© 2026 Alarmion. All rights reserved.</span>
        <span className="uppercase tracking-[0.16em]">{COMPANY.tagline}</span>
      </div>
    </footer>
  )
}

export default Footer
