# qlub — Loyalty Earn & Redeem on SoftPOS (release demo)

A 2:54, 1920×1080 Remotion video walking through the four Loyalty Earn & Redeem
flows captured on 10 Sep 2026, cut from four screen recordings of a Sunmi V3
SoftPOS terminal alongside the guest's phone.

## Output

`npm run render` → `out/qlub-loyalty-softpos.mp4`

The render needs an old-headless-capable Chromium. In this container:

```bash
npx remotion render QlubLoyalty out/qlub-loyalty-softpos.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --crf=17 --concurrency=4
```

`npm run studio` opens the Remotion editor for live tweaking.

## Structure

| Chapter | Source recording | Story |
|---|---|---|
| 01 Redeem | `2.01.14PM` (118s) | Returning member scans, signs in, redeems 11.63 coins. S$200.24 → S$188.61 |
| 02 Earn | `2.03.19PM` (13s) | Coins land on the guest's card live: 0.00 → 18.86 |
| 03 Enrol | `2.06.05PM` (92s) | First-timer joins at the table, 0 balance, earns +9 |
| 04 Look up | `2.09.32PM` (153s) | Staff looks the guest up by phone, verifies with a code, redeems 9 coins. S$21.00 → S$12.00 |

## Editing the video

- **Copy, order and timing** live in `src/script.ts` — one `Beat` per shot, with
  `frames` (at 30fps), a `focus` mode and optional `callouts`. Change copy there;
  nothing else needs touching.
- **Clip selection** lives in `build-clips.sh` — start time, duration and speed
  per segment. Re-run it after changing any cut, then re-render.
- **Palette** is in `src/theme.ts`, sampled from the product UI itself
  (primary `#7000CC`, lilac `#EDD7FC`, success `#2ED47A`).

`focus` controls the shot:

| value | shows |
|---|---|
| `both` | terminal + phone, equal size |
| `terminal` | terminal large, phone dimmed and small |
| `phone` | phone large, terminal dimmed and small |
| `terminal-only` | terminal alone (used where the guest's camera was pointed at a desk) |

## Source clips

`build-clips.sh` crops two streams out of each recording — the source is a Mac
screen with the emulator window on the left and a Google Meet screen-share of
the guest's iPhone on the right:

- terminal: `crop=370:864:8:32`
- guest phone: `crop=276:544:441:103`

The recordings themselves are not in the repo; the script reads them from the
upload path and writes to `public/clips/` (gitignored via `out/`… see note below).

## Notes on the footage

- The loyalty program is named **"Sofpos EarnMore" / "SOFTPOS EARN&BURN"** in the
  first two recordings and **"Bateel Program"** in the last two — it was renamed
  between takes. The script's copy avoids naming it where the two conflict.
- Recordings are from `app-dev3.qlub.cloud`, so transaction IDs, the
  `DUMMY-READER-A` terminal ID and the `+971 55 148 26..` number are dev data.
  They are left visible per the brief. If this ever goes external, mask them in
  `build-clips.sh` with a `drawbox` filter over those regions.
- The enrolment screen offers "250 Bateel coins as a welcome" but the terminal
  showed a 0 balance afterwards, so the video does not claim the welcome bonus.
- No audio track — the source recordings are silent.
