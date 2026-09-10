#!/usr/bin/env bash
set -euo pipefail
U="/root/.claude/uploads/954fe381-2965-5305-afcb-08b2f5d6ec11"
A="$U/82a44a3c-Screen_Recording_20260910_at_2.01.14PM.mov"   # Ch1 redeem
B="$U/425b18db-Screen_Recording_20260910_at_2.03.19PM.mov"   # Ch2 earn
C="$U/89b985ec-Screen_Recording_20260910_at_2.06.05PM.mov"   # Ch3 enrol
D="$U/083e662f-Screen_Recording_20260910_at_2.09.32PM.mov"   # Ch4 lookup
OUT="public/clips"
TERM_CROP="crop=370:864:8:32"
PHONE_CROP="crop=276:544:441:103"

cut () { # src start dur speed name
  local src=$1 ss=$2 dur=$3 spd=$4 name=$5
  ffmpeg -y -v error -ss "$ss" -t "$dur" -i "$src" \
    -vf "${TERM_CROP},setpts=PTS/${spd},fps=30" -an \
    -c:v libx264 -crf 16 -preset veryfast -pix_fmt yuv420p "$OUT/${name}_t.mp4"
  ffmpeg -y -v error -ss "$ss" -t "$dur" -i "$src" \
    -vf "${PHONE_CROP},setpts=PTS/${spd},fps=30" -an \
    -c:v libx264 -crf 16 -preset veryfast -pix_fmt yuv420p "$OUT/${name}_p.mp4"
  echo "  ✓ $name"
}

echo "Chapter 1 — Redeem"
cut "$A"   9.0  6.0 1.00 c1_bill
cut "$A"  15.5  4.0 1.00 c1_qr
cut "$A"  33.0  3.5 1.00 c1_g1
cut "$A"  42.0  3.5 1.00 c1_g2
cut "$A"  65.5  3.5 1.00 c1_g3
cut "$A"  70.5  3.5 1.00 c1_g4
cut "$A"  74.0  7.0 1.00 c1_verified
cut "$A"  82.0  7.0 1.75 c1_redeem
cut "$A"  98.0  8.0 1.00 c1_applied
cut "$A" 106.0  2.5 1.25 c1_tip
cut "$A" 108.5  8.5 1.00 c1_paid

echo "Chapter 2 — Earn"
cut "$B"   0.5  8.0 1.00 c2_earn

echo "Chapter 3 — Enrol"
cut "$C"   2.0  4.0 1.00 c3_bill
cut "$C"  18.0  4.0 1.00 c3_g1
cut "$C"  27.0  3.0 1.00 c3_g2
cut "$C"  35.0  3.0 1.00 c3_g3
cut "$C"  43.0  4.0 1.00 c3_g4
cut "$C"  49.0  3.5 1.00 c3_g5
cut "$C"  53.5  6.5 1.00 c3_verified
cut "$C"  60.0  4.0 1.00 c3_noredeem
cut "$C"  65.0  5.0 1.50 c3_tip
cut "$C"  71.0  6.0 1.00 c3_paid

echo "Chapter 4 — Lookup"
cut "$D"  48.0 10.0 2.00 c4_bill
cut "$D"  59.5  3.5 1.00 c4_qr
cut "$D"  63.0 17.0 3.00 c4_phone
cut "$D"  80.0  4.5 1.00 c4_found
cut "$D"  84.5  5.5 1.50 c4_verify
cut "$D"  90.0 14.0 3.00 c4_code
cut "$D" 104.0  6.0 1.00 c4_select
cut "$D" 118.0  8.0 1.00 c4_applied
cut "$D" 126.0  7.0 1.00 c4_paid
echo "done"
