// usage: node render.js page.html out.mp4 [fps]   |  node render.js page.html --stills dir t1 t2 ...
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [page_, out, ...rest] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + require('path').resolve(page_));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (out === '--stills') {
    const dir = rest[0];
    for (const t of rest.slice(1)) {
      await page.evaluate(t => render(t), parseFloat(t));
      await page.screenshot({ path: `${dir}/still-${t}.jpg`, type: 'jpeg', quality: 85 });
    }
  } else {
    const fps = parseInt(rest[0] || '30');
    const total = await page.evaluate(() => TOTAL);
    const n = Math.round(total * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => render(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
