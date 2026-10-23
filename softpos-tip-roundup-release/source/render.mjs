import { chromium } from 'playwright';
import { spawn } from 'child_process';
const [mode, ...rest] = process.argv.slice(2);
const dir = new URL('./index.html', import.meta.url).href;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await pg.goto(dir); await pg.waitForLoadState('networkidle'); await pg.evaluate(() => document.fonts.ready);
if (mode === 'stills') {
  for (const t of rest) { await pg.evaluate(t => render(+t), t); await pg.screenshot({ path: `t${t}.png` }); }
} else {
  const fps = 30, dur = await pg.evaluate(() => DUR), N = Math.round(dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', rest[0]], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    await pg.evaluate(t => render(t), i / fps);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await b.close();
