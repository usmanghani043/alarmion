#!/bin/bash
# Usage: ./scripts/extract-frames.sh path/to/video.mp4
# Extracts 30fps WebP frames into public/frames/
#
# TOTAL_FRAMES is currently 900 (~30s of footage at 30fps). Every decoded
# 1280x720 frame costs ~3.7 MB in memory, so keep the total under ~900 —
# drop `fps` below 30 for longer footage rather than raising the frame count.

set -euo pipefail

VIDEO="${1:-}"
OUTPUT="$(dirname "$0")/../public/frames"

if [ -z "$VIDEO" ]; then
  echo "Usage: ./scripts/extract-frames.sh path/to/video.mp4" >&2
  exit 1
fi

if [ ! -f "$VIDEO" ]; then
  echo "Error: '$VIDEO' not found." >&2
  exit 1
fi

mkdir -p "$OUTPUT"

ffmpeg \
  -i "$VIDEO" \
  -vf "fps=30,scale=1280:720:flags=lanczos" \
  -c:v libwebp \
  -quality 82 \
  -compression_level 4 \
  -an \
  "$OUTPUT/f%04d.webp"

FRAMES=$(ls "$OUTPUT"/f*.webp | wc -l | tr -d ' ')
echo "Done! $FRAMES frames extracted."
echo "Update TOTAL_FRAMES in src/lib/constants.ts to: $FRAMES"
