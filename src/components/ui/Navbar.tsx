'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { COMPANY, NAV_LINKS } from '@/lib/constants'
import AlarmionLogo from './AlarmionLogo'
import Button from './Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on resize to desktop so state can't get stranded.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Opening the mobile sheet commits to the same solid treatment as scrolling —
  // the sheet needs an opaque backdrop to be readable either way.
  const solid = scrolled || menuOpen

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-[ease]',
        solid
          ? 'border-b border-[#E5E7EB] bg-white py-3'
          : 'border-b border-transparent py-5'
      )}
    >
      <div className="mx-auto flex max-w-editorial items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center" aria-label="Alarmion home">
          <AlarmionLogo
            variant={solid ? 'dark' : 'light'}
            priority
            className="h-7 w-auto md:h-8"
          />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm transition-colors duration-300 ease-[ease]',
                solid
                  ? 'text-navy hover:text-red'
                  : 'text-white/60 hover:text-white'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={COMPANY.phoneHref}
            className={clsx(
              'hidden text-sm tabular-nums transition-colors duration-300 ease-[ease] lg:block',
              solid ? 'text-navy hover:text-red' : 'text-white/70 hover:text-white'
            )}
          >
            {COMPANY.phone}
          </a>
          <Button href={COMPANY.shop} external size="sm" className="hidden sm:inline-flex">
            Pre-Order Now
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-300 ease-[ease] md:hidden',
              solid ? 'border-navy/20 text-navy' : 'border-white/15 text-white'
            )}
          >
            <span className="relative block h-3 w-4">
              <span
                className={clsx(
                  'absolute left-0 block h-px w-4 bg-current transition-transform duration-200',
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 top-1.5 block h-px w-4 bg-current transition-opacity duration-200',
                  menuOpen && 'opacity-0'
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 block h-px w-4 bg-current transition-transform duration-200',
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#E5E7EB] px-6 pb-6 pt-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 font-display text-2xl text-navy transition-colors hover:text-red"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <Button href={COMPANY.shop} external fullWidth>
              Pre-Order Now
            </Button>
            <a
              href={COMPANY.phoneHref}
              className="text-center text-sm text-navy/70 transition-colors hover:text-red"
            >
              Call {COMPANY.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
