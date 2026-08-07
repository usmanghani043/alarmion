'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { COVERED_STATES } from '@/lib/constants'
import Button from './Button'

interface NotifyModalProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const inputClass =
  'h-11 w-full rounded-lg border border-white/10 bg-navy-deep/60 px-3.5 text-[15px] text-white placeholder:text-steel/70 transition-colors focus:border-red focus:outline-none'

export function NotifyModal({ open, onClose }: NotifyModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string>('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', state: '' })

  const reset = useCallback(() => {
    setStatus('idle')
    setError('')
    setForm({ name: '', email: '', phone: '', state: '' })
  }, [])

  // Remember the trigger so focus lands back where the user left it.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      window.setTimeout(() => firstFieldRef.current?.focus(), 60)
    } else {
      restoreFocusRef.current?.focus?.()
      // Give the close transition a beat before wiping the success state.
      const timer = window.setTimeout(reset, 250)
      return () => window.clearTimeout(timer)
    }
  }, [open, reset])

  // Scroll lock while the dialog owns the screen.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // ESC to dismiss + Tab cycling confined to the panel.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null
      )
      if (nodes.length === 0) return

      const first = nodes[0] as HTMLElement
      const last = nodes[nodes.length - 1] as HTMLElement
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setError('')

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data: { success?: boolean; error?: string } = await res.json()

      if (!res.ok || !data.success) {
        setStatus('error')
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
      setError('Network error. Please check your connection and try again.')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-title"
    >
      <div
        className="absolute inset-0 bg-navy-deep/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="animate-beat-text-in relative w-full max-w-md rounded-2xl border border-white/10 bg-navy-light p-7 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-steel transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red/12">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-red" aria-hidden="true">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-beat-text-in"
                />
              </svg>
            </span>
            <h2 id="notify-title" className="font-display mt-5 text-3xl text-white">
              You&rsquo;re on the list.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-steel">
              Check your inbox — we just sent a confirmation. You&rsquo;ll hear
              from us the moment Alarmion goes live in your area.
            </p>
            <Button variant="ghost" fullWidth className="mt-7" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Early Access</span>
            <h2
              id="notify-title"
              className="font-display mt-3 text-3xl leading-[1.05] text-white md:text-4xl"
            >
              Notify me when it&rsquo;s available
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              We&rsquo;ll email you once — when monitoring goes live where you
              live.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3.5">
              <div>
                <label htmlFor="notify-name" className="eyebrow-muted">
                  Name
                </label>
                <input
                  id="notify-name"
                  ref={firstFieldRef}
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jordan Reyes"
                  className={clsx(inputClass, 'mt-2')}
                />
              </div>

              <div>
                <label htmlFor="notify-email" className="eyebrow-muted">
                  Email
                </label>
                <input
                  id="notify-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className={clsx(inputClass, 'mt-2')}
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="notify-phone" className="eyebrow-muted">
                    Phone <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id="notify-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="888-502-3445"
                    className={clsx(inputClass, 'mt-2')}
                  />
                </div>

                <div>
                  <label htmlFor="notify-state" className="eyebrow-muted">
                    State
                  </label>
                  <select
                    id="notify-state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className={clsx(inputClass, 'mt-2 appearance-none pr-8')}
                  >
                    <option value="">Select…</option>
                    {COVERED_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-red">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                className="mt-2"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Notify Me'}
              </Button>

              <p className="text-center text-xs text-steel/80">
                No spam. One email when we launch in your state.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default NotifyModal
