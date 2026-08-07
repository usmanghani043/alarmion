'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion: reduce`, including live changes to the OS
 * setting. Returns false during SSR and the first paint so markup matches.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export default useReducedMotion
