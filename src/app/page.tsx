'use client'

import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import NotifyModal from '@/components/ui/NotifyModal'
import FilmSection from '@/components/film/FilmSection'
import HowItWorks from '@/components/sections/HowItWorks'
import TrustBadges from '@/components/sections/TrustBadges'
import Features from '@/components/sections/Features'
import Pricing from '@/components/sections/Pricing'
import Coverage from '@/components/sections/Coverage'

export default function Home() {
  const [notifyOpen, setNotifyOpen] = useState(false)

  const openNotify = useCallback(() => setNotifyOpen(true), [])
  const closeNotify = useCallback(() => setNotifyOpen(false), [])

  // Web fonts change every heading's height; without a refresh the triggers
  // computed at mount fire at the wrong scroll positions.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    let cancelled = false
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh()
    }

    if (typeof document !== 'undefined' && 'fonts' in document) {
      void document.fonts.ready.then(refresh)
    } else {
      window.setTimeout(refresh, 400)
    }

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <a
        href="#how-it-works"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-red focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="top">
        <FilmSection onNotifyClick={openNotify} />
        <HowItWorks />
        <TrustBadges />
        <Features />
        <Pricing onNotifyClick={openNotify} />
        <Coverage onNotifyClick={openNotify} />
      </main>

      <Footer />

      <NotifyModal open={notifyOpen} onClose={closeNotify} />
    </>
  )
}
