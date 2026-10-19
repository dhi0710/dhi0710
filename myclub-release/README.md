# myclub release video

`myclub-release.mp4`: 1920×1080, 30 fps, 80 s, no audio. Built from the *loyalty_my_club* deck.

## Scenes
1. Intro: Introducing myclub
2. Hook: Loyalty isn't the product. Knowing your guest is.
3. Four pillars: identify, engage, reward, build the habit
4. Guest journey: scan, sign up, earn (phone UI)
5. Guest profile: history and insights
6. Coins: 1 : 1 · 20 = 1 · one balance everywhere
7. Tier ladder: Guest → Patron
8. Redemption: coin toggle takes the bill from AED 186.00 to AED 82.45
9. Dashboard: members, repeat rate, reviews, revenue
10. Win-back broadcast
11. Commercials: AED 0 to start, AED 1 per message, 2% earn, 3% redeem
12. Outro: Turn your guests into your club.

## Editing and re-rendering
`source/index.html` is the whole animation; open it in a browser with `?t=<seconds>` to preview a moment.
Scene lengths are the `data-dur` attributes; element entrances are `data-in` (seconds into the scene).

```bash
cd source
node render.js index.html ../myclub-release.mp4 30   # needs playwright + ffmpeg
```
