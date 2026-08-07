import { NextResponse } from 'next/server'
import {
  getResend,
  subscriberEmailHtml,
  teamEmailHtml,
  type WaitlistPayload,
} from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const raw = (body ?? {}) as Record<string, unknown>
  const payload: WaitlistPayload = {
    name: clean(raw.name, 120),
    email: clean(raw.email, 200).toLowerCase(),
    phone: clean(raw.phone, 40) || undefined,
    state: clean(raw.state, 60) || undefined,
  }

  if (!payload.name) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }

  if (!payload.email || !EMAIL_PATTERN.test(payload.email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  const resend = getResend()
  const toEmail = process.env.NOTIFY_TO_EMAIL
  const fromEmail = process.env.NOTIFY_FROM_EMAIL

  if (!resend || !toEmail || !fromEmail) {
    console.error(
      '[notify] Missing email configuration — set RESEND_API_KEY, NOTIFY_TO_EMAIL and NOTIFY_FROM_EMAIL.'
    )
    return NextResponse.json(
      { error: 'Signups are temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    )
  }

  const from = `Alarmion <${fromEmail}>`

  try {
    const [team, subscriber] = await Promise.all([
      resend.emails.send({
        from,
        to: toEmail,
        reply_to: payload.email,
        subject: `New Alarmion waitlist signup — ${payload.name}`,
        html: teamEmailHtml(payload),
      }),
      resend.emails.send({
        from,
        to: payload.email,
        subject: "You're on the Alarmion waitlist — we'll let you know first.",
        html: subscriberEmailHtml(payload),
      }),
    ])

    // The subscriber confirmation is the one the user can see fail; the team
    // copy failing is an ops problem, not a reason to reject their signup.
    if (subscriber.error) {
      console.error('[notify] Subscriber email failed:', subscriber.error)
      return NextResponse.json(
        { error: 'We could not send your confirmation email. Please try again.' },
        { status: 502 }
      )
    }

    if (team.error) {
      console.error('[notify] Team notification failed:', team.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notify] Unexpected failure:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
