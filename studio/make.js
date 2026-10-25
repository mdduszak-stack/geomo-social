// Geomo studio renderer.
//   node studio/make.js P08 png        -> studio/out/P08/png/slide-NN.png + sheet.png (contact sheet)
//   node studio/make.js P08 mp4 [3,5]  -> studio/out/P08/mp4/slide-NN.mp4 (all slides, or only the listed ones)
//   node studio/make.js P08 all
// Needs: playwright (chromium) and ffmpeg. Set CHROME to use a specific browser binary.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const [code, what = 'png', only] = process.argv.slice(2);
if (!code) { console.log('usage: node studio/make.js CODE png|mp4|all [1,2]'); process.exit(1); }
const ENG = path.join(__dirname, 'engine'), OUT = path.join(__dirname, 'out', code), FPS = +process.env.FPS || 30;
const pick = only ? only.split(',').map(Number) : null;
(async () => {
  const opts = process.env.CHROME ? { executablePath: process.env.CHROME, headless: false, args: ['--headless=new'] } : {};
  const b = await chromium.launch(opts); const errs = [];
  const p = await b.newPage({ viewport: { width: 1300, height: 2100 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const load = async (hash) => { await p.goto('about:blank'); await p.goto('file://' + ENG + '/page.html#' + hash); await p.waitForFunction(() => window.__ready === true); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300); };
  await load(code); const n = await p.$$eval('.slot', e => e.length);
  if (what === 'png' || what === 'all') {
    const dir = path.join(OUT, 'png'); fs.mkdirSync(dir, { recursive: true });
    for (let i = 1; i <= n; i++) { if (pick && !pick.includes(i)) continue; const el = await p.$('#s' + i + ' > *');
      await el.screenshot({ path: `${dir}/slide-${String(i).padStart(2, '0')}.png` }); }
    try { execSync(`ffmpeg -loglevel error -y -pattern_type glob -i '${dir}/slide-*.png' -vf "scale=360:-1,tile=4x${Math.ceil(n / 4)}:padding=8:color=white" -frames:v 1 ${OUT}/sheet.png`); } catch (e) {}
    console.log(`png: ${n} slides -> ${dir}`);
  }
  if (what === 'mp4' || what === 'all') {
    const dir = path.join(OUT, 'mp4'); fs.mkdirSync(dir, { recursive: true });
    for (let i = 1; i <= n; i++) { if (pick && !pick.includes(i)) continue;
      await load(code + '/' + (i - 1));
      const dur = await p.evaluate(([c, k]) => window.GeomoMotion.setup(c, k), [code, i - 1]);
      const el = await p.$('#s1 > *'); const bb = await el.boundingBox();
      const fd = path.join(OUT, 'frames'); fs.rmSync(fd, { recursive: true, force: true }); fs.mkdirSync(fd, { recursive: true });
      const frames = Math.ceil(dur / 1000 * FPS);
      for (let f = 0; f <= frames; f++) { await p.evaluate(t => window.GeomoMotion.seek(t), f * 1000 / FPS);
        await p.screenshot({ path: `${fd}/${String(f).padStart(4, '0')}.png`, clip: { x: bb.x, y: bb.y, width: bb.width, height: bb.height } }); }
      const out = `${dir}/slide-${String(i).padStart(2, '0')}.mp4`;
      execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${fd}/%04d.png -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 64k -movflags +faststart ${out}`);
      fs.rmSync(fd, { recursive: true, force: true });
      console.log(`mp4: slide ${i} ${(dur / 1000).toFixed(1)} s -> ${out}`);
    }
  }
  console.log('errors', errs); await b.close();
})();
