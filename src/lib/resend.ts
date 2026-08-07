import { Resend } from 'resend'
import { BRAND, COMPANY } from './constants'

let client: Resend | null = null

/**
 * Lazily constructs the Resend client so a missing key surfaces as a handled
 * API error at request time instead of throwing during module evaluation
 * (which would take the whole route down at build/boot).
 */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!client) client = new Resend(apiKey)
  return client
}

export interface WaitlistPayload {
  name: string
  email: string
  phone?: string
  state?: string
}

const shell = (inner: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.navyDeep};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.navyDeep};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.navy};border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;font-family:Inter,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.red};font-weight:600;">
                  ${COMPANY.name}
                </div>
              </td>
            </tr>
            ${inner}
            <tr>
              <td style="padding:24px 32px 32px 32px;border-top:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;color:${BRAND.steel};line-height:1.6;">
                  ${COMPANY.name} · ${COMPANY.phone} · alarmion.com<br />
                  ${COMPANY.tagline}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.steel};width:38%;">
      ${label}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:#FFFFFF;">
      ${value}
    </td>
  </tr>`

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function teamEmailHtml(payload: WaitlistPayload): string {
  const name = escapeHtml(payload.name)
  const email = escapeHtml(payload.email)
  const phone = escapeHtml(payload.phone || '—')
  const state = escapeHtml(payload.state || '—')

  return shell(`
    <tr>
      <td style="padding:12px 32px 8px 32px;">
        <div style="font-family:'Barlow Condensed',Inter,Helvetica,Arial,sans-serif;font-size:34px;font-weight:700;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.1;">
          New waitlist signup
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Name', name)}
          ${row('Email', `<a href="mailto:${email}" style="color:${BRAND.mist};text-decoration:none;">${email}</a>`)}
          ${row('Phone', phone)}
          ${row('State', state)}
          ${row('Received', escapeHtml(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })) + ' ET')}
        </table>
      </td>
    </tr>`)
}

export function subscriberEmailHtml(payload: WaitlistPayload): string {
  const firstName = escapeHtml(payload.name.trim().split(/\s+/)[0] || 'there')

  return shell(`
    <tr>
      <td style="padding:12px 32px 0 32px;">
        <div style="font-family:'Barlow Condensed',Inter,Helvetica,Arial,sans-serif;font-size:38px;font-weight:700;color:#FFFFFF;letter-spacing:-0.01em;line-height:1.05;">
          You're on the list, ${firstName}.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 0 32px;">
        <p style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.mist};">
          The moment Alarmion goes live in your area, you'll be the first to know.
          We'll email you with your pre-order link, your ALD shipping window, and
          everything you need to get set up in about 60 seconds.
        </p>
        <p style="margin:16px 0 0 0;font-size:15px;line-height:1.7;color:${BRAND.mist};">
          No contract. No technician. Just trained operators watching for your
          siren, day and night.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 32px 32px;">
        <a href="${COMPANY.site}"
           style="display:inline-block;background:${BRAND.red};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;padding:14px 26px;border-radius:8px;">
          Visit Alarmion.com
        </a>
      </td>
    </tr>`)
}
