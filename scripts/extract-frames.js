/**
 * Extract a video into the numbered WebP frames the scroll film plays back.
 *
 *   node scripts/extract-frames.js path/to/video.mp4
 *
 * Writes public/frames/f0001.webp … fNNNN.webp at 30fps, 1280x720, matching the
 * naming in src/lib/frameLoader.ts (`f${index+1}` zero-padded to 4).
 *
 * No system FFmpeg required — @ffmpeg-installer/@ffprobe-installer ship the
 * binaries as npm deps and we point fluent-ffmpeg at them below.
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const FPS = 30
const WIDTH = 1280
const HEIGHT = 720
const WEBP_QUALITY = 82

// frameLoader.ts decodes every frame to an ImageBitmap up front; a 1280x720
// bitmap is ~3.7MB of host memory, so past ~900 frames the tab starts evicting
// or crashing. Warn rather than refuse — the ceiling is a judgement call.
const FRAME_BUDGET = 900

const OUT_DIR = path.join(__dirname, '..', 'public', 'frames')
const CONSTANTS_FILE = 'src/lib/constants.ts'

const frameName = (n) => `f${String(n).padStart(4, '0')}.webp`

function fail(message) {
  console.error(`\n  Error: ${message}\n`)
  process.exit(1)
}

function usage() {
  console.error(`
  Extract video frames to public/frames/

  Usage:  node scripts/extract-frames.js <video-file>
  Example: node scripts/extract-frames.js film.mp4
`)
  process.exit(1)
}

function formatDuration(seconds) {
  const total = Math.round(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}m ${String(s).padStart(2, '0')}s`
}

function probe(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, data) => {
      if (err) return reject(err)
      const stream = data.streams.find((s) => s.codec_type === 'video')
      if (!stream) return reject(new Error('no video stream found in that file'))
      resolve({
        duration: Number(data.format.duration) || 0,
        width: stream.width,
        height: stream.height,
        codec: stream.codec_name,
      })
    })
  })
}

/**
 * The installer's binary is built per-platform and not every build links
 * libwebp. Check once so we can fall back to sharp instead of dying mid-run.
 */
function hasLibwebp() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableEncoders((err, encoders) => {
      resolve(!err && Boolean(encoders && encoders.libwebp))
    })
  })
}

/** Remove frames from a previous run so a shorter video can't leave strays. */
function clearOutputDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const stale = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^f\d{4}\.webp$/.test(f))
  for (const f of stale) fs.unlinkSync(path.join(OUT_DIR, f))
  return stale.length
}

function drawProgress(done, total, label) {
  const ratio = total > 0 ? Math.min(done / total, 1) : 0
  const percent = Math.round(ratio * 100)
  const filled = Math.round(ratio * 30)
  const bar = '#'.repeat(filled) + '-'.repeat(30 - filled)
  const suffix = total > 0 ? `${done}/${total} frames` : `${done} frames`
  process.stdout.write(`\r  [${bar}] ${String(percent).padStart(3)}%  ${suffix}  ${label}   `)
}

/** One ffmpeg pass straight to WebP — no intermediate files. */
function extractDirect(file, expectedFrames, outPattern) {
  return new Promise((resolve, reject) => {
    ffmpeg(file)
      .outputOptions([
        `-vf`, `fps=${FPS},scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
        `-c:v`, `libwebp`,
        `-quality`, String(WEBP_QUALITY),
        `-compression_level`, '4',
        `-preset`, 'picture',
        `-an`,
      ])
      .on('progress', (p) => {
        if (p.frames) drawProgress(p.frames, expectedFrames, 'encoding')
      })
      .on('error', (err) => reject(new Error(err.message)))
      .on('end', resolve)
      .save(outPattern)
  })
}

/**
 * Fallback for builds without libwebp: ffmpeg writes PNGs to a temp dir, sharp
 * converts them to WebP. Slower and disk-hungry, but platform independent.
 */
async function extractViaSharp(file, expectedFrames) {
  const sharp = require('sharp')
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alarmion-frames-'))

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(file)
        .outputOptions([
          `-vf`, `fps=${FPS},scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
          `-an`,
        ])
        .on('progress', (p) => {
          if (p.frames) drawProgress(p.frames, expectedFrames, 'decoding')
        })
        .on('error', (err) => reject(new Error(err.message)))
        .on('end', resolve)
        .save(path.join(tmpDir, 'f%04d.png'))
    })

    const pngs = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.png')).sort()
    for (let i = 0; i < pngs.length; i += 1) {
      await sharp(path.join(tmpDir, pngs[i]))
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(OUT_DIR, frameName(i + 1)))
      drawProgress(i + 1, pngs.length, 'encoding')
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

async function main() {
  const input = process.argv[2]
  if (!input) usage()

  const videoPath = path.resolve(input)
  if (!fs.existsSync(videoPath)) fail(`no such file: ${videoPath}`)
  if (!fs.statSync(videoPath).isFile()) fail(`not a file: ${videoPath}`)

  let info
  try {
    info = await probe(videoPath)
  } catch (err) {
    fail(`could not read that video — ${err.message}`)
  }

  const expectedFrames = Math.max(Math.round(info.duration * FPS), 0)

  console.log(`
  Source   ${path.basename(videoPath)}
  Format   ${info.width}x${info.height} ${info.codec}, ${formatDuration(info.duration)}
  Output   ${WIDTH}x${HEIGHT} WebP @ ${FPS}fps  ->  public/frames/
  Expected ~${expectedFrames} frames
`)

  const removed = clearOutputDir()
  if (removed > 0) console.log(`  Cleared ${removed} frame(s) from a previous run.\n`)

  const direct = await hasLibwebp()
  if (!direct) {
    console.log('  ffmpeg build lacks libwebp — falling back to sharp (slower).\n')
  }

  const started = Date.now()
  try {
    if (direct) {
      await extractDirect(videoPath, expectedFrames, path.join(OUT_DIR, 'f%04d.webp'))
    } else {
      await extractViaSharp(videoPath, expectedFrames)
    }
  } catch (err) {
    process.stdout.write('\n')
    fail(err.message)
  }

  // Count what actually landed rather than trusting the estimate.
  const written = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^f\d{4}\.webp$/.test(f))
    .sort()

  if (written.length === 0) fail('ffmpeg finished but wrote no frames.')

  drawProgress(written.length, written.length, 'done')
  process.stdout.write('\n')

  const bytes = written.reduce(
    (sum, f) => sum + fs.statSync(path.join(OUT_DIR, f)).size,
    0
  )
  const elapsed = Math.round((Date.now() - started) / 1000)

  console.log(`
  Done in ${formatDuration(elapsed)}

  Total frames   ${written.length}
  First / last   ${written[0]} … ${written[written.length - 1]}
  Total size     ${(bytes / 1024 / 1024).toFixed(1)} MB
`)

  if (written.length > FRAME_BUDGET) {
    console.log(`  Warning: ${written.length} frames exceeds the ~${FRAME_BUDGET}-frame budget in
  frameLoader.ts. Every frame is decoded to an ImageBitmap up front
  (~3.7MB each), so this needs ~${(written.length * 3.7 / 1024).toFixed(1)} GB and may crash the tab.
  Consider a shorter cut or a lower fps.
`)
  }

  console.log(`  Next step — set the frame count in ${CONSTANTS_FILE}:

      export const TOTAL_FRAMES = ${written.length}

  BEATS in that file are keyed to frame numbers and must tile
  0 … TOTAL_FRAMES - 1, so re-scale them to match.
`)
}

main().catch((err) => fail(err.message))
