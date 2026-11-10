const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function findDifference() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

  // Test various screen sizes: laptop, desktop, etc.
  for (let w = 1050; w <= 1350; w += 25) {
    const context = await browser.newContext({ viewport: { width: w, height: 800 } });
    const results = {};

    for (const p of pages) {
      const page = await context.newPage();
      const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
      await page.goto(filePath, { waitUntil: 'load' });
      await page.evaluate(() => {
        const pre = document.querySelector('.preloader');
        if (pre) pre.remove();
      });
      await page.waitForTimeout(100);

      const data = await page.evaluate(() => {
        const el = document.querySelector('.brand-name');
        const tag = document.querySelector('.brand-tagline');
        const link = document.querySelector('.brand-link');

        // Check number of lines
        const words = el ? el.innerText.trim().split(/\s+/) : [];
        const original = el ? el.innerHTML : '';
        if (el) el.innerHTML = words.map(w => `<span class="tw">${w}</span>`).join(' ');
        const spans = el ? Array.from(el.querySelectorAll('.tw')) : [];
        const lineMap = {};
        spans.forEach(s => {
          const t = s.offsetTop;
          if (!lineMap[t]) lineMap[t] = [];
          lineMap[t].push(s.innerText);
        });
        if (el) el.innerHTML = original;

        return {
          brandLines: Object.values(lineMap).map(l => l.join(' ')),
          brandHeight: el ? el.getBoundingClientRect().height : null,
          taglineHeight: tag ? tag.getBoundingClientRect().height : null,
          linkHeight: link ? link.getBoundingClientRect().height : null
        };
      });

      results[p] = data;
      await page.close();
    }
    await context.close();

    const fac = results['facilities.html'];
    const idx = results['index.html'];
    const abt = results['about.html'];
    const aca = results['academics.html'];

    const facStr = fac.brandLines.join(' / ');
    const idxStr = idx.brandLines.join(' / ');
    const abtStr = abt.brandLines.join(' / ');
    const acaStr = aca.brandLines.join(' / ');

    const diff = (facStr !== idxStr) || (facStr !== abtStr) || (facStr !== acaStr);
    if (diff) {
      console.log(`\n>>> DIFFERENCE FOUND AT WIDTH ${w}px! <<<`);
      console.log('facilities.html:', facStr, `(height: ${fac.brandHeight})`);
      console.log('index.html:     ', idxStr, `(height: ${idx.brandHeight})`);
      console.log('about.html:     ', abtStr, `(height: ${abt.brandHeight})`);
      console.log('academics.html: ', acaStr, `(height: ${aca.brandHeight})`);
    } else {
      console.log(`Width ${w}px: all same (${facStr})`);
    }
  }

  await browser.close();
}

findDifference().catch(console.error);
