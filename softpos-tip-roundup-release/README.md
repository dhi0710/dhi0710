# Tip round-up on SoftPOS: release video

`qlub-softpos-tip-roundup-release.mp4`: 58 s, 1920×1080, 30 fps, no audio.

| Time | Scene |
|---|---|
| 0:00 | Intro: qlub logo, "Tip round-up" |
| 0:05 | Concept: S$35.55 bill rounds up to S$40.00, tip +S$4.45 |
| 0:11 | Two styles: Chips and Total Field |
| 0:16 | Chips walkthrough on device: bill, rate and tip, round-up row, 40.00 picked, success screen |
| 0:37 | Total Field walkthrough: Charge total row, Custom Payable Amount |
| 0:44 | Setup: Tip Round Up Options + Tip Round Up Bands, save and restart the app |
| 0:52 | Outro |

## Re-render

The video is an HTML page (`source/index.html`) with a `render(t)` function. `source/render.mjs` steps it frame by frame in Playwright/Chromium and pipes the frames to ffmpeg.

```
cd source
node render.mjs video ../qlub-softpos-tip-roundup-release.mp4   # full video
node render.mjs stills 8.6 30.5                                  # PNG stills at given seconds
```

Copy and timings are in `index.html` (`S` holds the scene times, `STEPS` the device steps and highlight boxes).
