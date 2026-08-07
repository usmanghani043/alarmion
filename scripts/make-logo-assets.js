/**
 * Derive every logo/icon variant the site needs from the two source brand PNGs.
 *
 *   node scripts/make-logo-assets.js
 *
 * Sources (checked in, never modified):
 *   public/images/logo-wordmark.png     navy wordmark lockup, transparent
 *   public/images/logo-transparent.png  shield + wordmark + tagline, transparent
 *
 * Generated:
 *   public/images/logo-wordmark-white.png   navy knocked to white, red kept
 *   public/images/logo-shield.png           shield cropped out of the lockup
 *   public/images/favicon-32.png            shield on white, 32x32
 *   public/images/apple-touch-icon.png      shield on white, 180x180
 *   public/favicon.ico                      shield on white, 16/32/48
 *
 * Re-run this after replacing either source file.
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const IMAGES = path.join(ROOT, 'public', 'images')

const WORDMARK = path.join(IMAGES, 'logo-wordmark.png')
const LOCKUP = path.join(IMAGES, 'logo-transparent.png')

/** Brand red is strongly red-dominant; navy and its anti-aliased halo are not. */
function isBrandRed(r, g, b) {
  return r > 90 && r > g * 1.6 && r > b * 1.6
}

/**
 * Knock the navy to white while leaving the red triangle and rules untouched.
 * Alpha is preserved per-pixel, so anti-aliased edges survive the swap.
 */
async function makeWhiteWordmark() {
  const { data, info } = await sharp(WORDMARK)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const out = Buffer.from(data)
  let whitened = 0
  let keptRed = 0

  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue
    if (isBrandRed(out[i], out[i + 1], out[i + 2])) {
      keptRed += 1
      continue
    }
    out[i] = 255
    out[i + 1] = 255
    out[i + 2] = 255
    whitened += 1
  }

  const dest = path.join(IMAGES, 'logo-wordmark-white.png')
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(dest)

  return { dest, whitened, keptRed }
}

/**
 * The lockup stacks shield over wordmark over tagline. Favicons need the shield
 * alone — the full lockup turns to mush below ~64px. Find the shield by row
 * occupancy (it is the first contiguous band of non-transparent rows) rather
 * than hardcoding a crop that would rot if the art is re-exported.
 */
async function cropShield() {
  const { data, info } = await sharp(LOCKUP)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info

  const rowHasInk = new Array(height).fill(false)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 30) {
        rowHasInk[y] = true
        break
      }
    }
  }

  let top = rowHasInk.indexOf(true)
  if (top === -1) throw new Error('logo-transparent.png appears to be blank')
  let bottom = top
  while (bottom + 1 < height && rowHasInk[bottom + 1]) bottom += 1

  let left = width
  let right = 0
  for (let y = top; y <= bottom; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 30) {
        if (x < left) left = x
        if (x > right) right = x
      }
    }
  }

  const w = right - left + 1
  const h = bottom - top + 1

  // Square it off with ~8% breathing room so the shield never touches the edge.
  const side = Math.round(Math.max(w, h) * 1.08)
  const dest = path.join(IMAGES, 'logo-shield.png')

  await sharp(LOCKUP)
    .extract({ left, top, width: w, height: h })
    .resize(side, side, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(dest)

  return { dest, box: { left, top, width: w, height: h }, side }
}

/** Shield on an opaque white rounded tile — favicons need a solid ground. */
async function iconTile(size) {
  const radius = Math.round(size * 0.12)
  const tile = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#FFFFFF"/>` +
      `</svg>`
  )

  const inner = Math.round(size * 0.78)
  const shield = await sharp(path.join(IMAGES, 'logo-shield.png'))
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp(tile)
    .composite([{ input: shield, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Real ICO container: 6-byte header, 16-byte directory entry each, PNG payloads. */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)

  let offset = 6 + 16 * entries.length
  const dir = entries.map(({ size, buffer }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buffer.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += buffer.length
    return e
  })

  return Buffer.concat([header, ...dir, ...entries.map((e) => e.buffer)])
}

async function main() {
  for (const src of [WORDMARK, LOCKUP]) {
    if (!fs.existsSync(src)) {
      console.error(`\n  Error: missing source ${path.relative(ROOT, src)}\n`)
      process.exit(1)
    }
  }

  const white = await makeWhiteWordmark()
  console.log(
    `  logo-wordmark-white.png   ${white.whitened} px -> white, ${white.keptRed} red px preserved`
  )

  const shield = await cropShield()
  console.log(
    `  logo-shield.png           cropped ${shield.box.width}x${shield.box.height} ` +
      `at (${shield.box.left},${shield.box.top}) -> ${shield.side}x${shield.side}`
  )

  await sharp(await iconTile(32)).toFile(path.join(IMAGES, 'favicon-32.png'))
  console.log('  favicon-32.png            32x32 shield on white')

  await sharp(await iconTile(180)).toFile(path.join(IMAGES, 'apple-touch-icon.png'))
  console.log('  apple-touch-icon.png      180x180 shield on white')

  const sizes = [16, 32, 48]
  const entries = []
  for (const size of sizes) {
    entries.push({ size, buffer: await iconTile(size) })
  }
  const icoPath = path.join(ROOT, 'public', 'favicon.ico')
  fs.writeFileSync(icoPath, buildIco(entries))
  console.log(`  favicon.ico               ${sizes.join('/')} shield on white`)

  console.log('\n  Done.\n')
}

main().catch((err) => {
  console.error(`\n  Error: ${err.message}\n`)
  process.exit(1)
})
