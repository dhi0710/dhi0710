# Tip round-up on SoftPOS: release video

`qlub-softpos-tip-roundup-release.mp4`: 57 s, 1920×1080, 30 fps, with background music (AAC stereo, normalised to -16 LUFS).

| Time | Scene |
|---|---|
| 0:00 | Intro: qlub logo, "Tip round-up" |
| 0:05 | Concept: S$35.55 bill rounds up to S$40.00, tip +S$4.45 |
| 0:11 | Two styles: Chips, and Total Field (staff tap Enter amount, then type the total on the Custom Payable Amount tab) |
| 0:19 | Chips on SoftPOS: 1 Bill, 2 Round-up row on the tip screen, 3 Pick 40.00, 4 Paid with S$4.45 tip |
| 0:35 | Total Field on SoftPOS: 2 Charge total row, 3 Custom Payable Amount |
| 0:43 | Setup: Tip Round Up Options + Tip Round Up Bands, save and restart the app |
| 0:51 | Outro |

Staff operate SoftPOS in every step; the guest does not use the device.

## Music

`source/music.py` synthesises an original 120 BPM track (C–G–Am–F house groove) with numpy. Nothing is sampled or downloaded, so there is no third-party licence. It follows the scenes: quiet intro, beat in at 0:04, a one-bar breather before the setup scene, a final hit going into the outro, then a fade.

## Re-render

The video is an HTML page (`source/index.html`) with a `render(t)` function. `source/render.mjs` steps it frame by frame in Playwright/Chromium and pipes the frames to ffmpeg.

```
cd source
node render.mjs video silent.mp4                 # picture only
python3 music.py 56.6 music.wav                  # duration must match DUR in index.html
ffmpeg -i silent.mp4 -i music.wav -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -shortest \
  -movflags +faststart ../qlub-softpos-tip-roundup-release.mp4
node render.mjs stills 8.6 30.5                  # PNG stills at given seconds
```

Copy and timings are in `index.html` (`S` holds the scene times, `STEPS` the device steps and highlight boxes).
