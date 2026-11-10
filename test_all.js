const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function testAllPages() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const pages = [
    'facilities.html',
    'index.html',
    'about.html',
    'academics.html',
    'admissions.html',
    'faculty.html',
    'gallery.html',
    'notices.html',
    'contact.html'
  ];

  // Test standard laptop / desktop viewport 1366px and 1280px
  for (const w of [1366, 1280]) {
    console.log(`\n=================== VIEWPORT ${w}px ===================`);
    const context = await browser.newContext({ viewport: { width: w, height: 800 } });

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
        const brandName = document.querySelector('.brand-name');
        const tagline = document.querySelector('.brand-tagline');
        const brandLink = document.querySelector('.brand-link');

        // Check word distribution on lines
        function getLines(el) {
          if (!el) return [];
          const words = el.innerText.trim().split(/\s+/);
          const orig = el.innerHTML;
          el.innerHTML = words.map(w => `<span class="t">${w}</span>`).join(' ');
          const spans = Array.from(el.querySelectorAll('.t'));
          const lines = {};
          spans.forEach(s => {
            const top = s.offsetTop;
            if (!lines[top]) lines[top] = [];
            lines[top].push(s.innerText);
          });
          el.innerHTML = orig;
          return Object.values(lines).map(l => l.join(' '));
        }

        return {
          brandLines: getLines(brandName),
          taglineLines: getLines(tagline),
          brandLinkWidth: brandLink ? Math.round(brandLink.getBoundingClientRect().width) : 0,
          brandNameWidth: brandName ? Math.round(brandName.getBoundingClientRect().width) : 0,
          taglineWidth: tagline ? Math.round(tagline.getBoundingClientRect().width) : 0
        };
      });

      console.log(`${p.padEnd(16)} | Brand: [${data.brandLines.join(' | ')}] | Tagline: [${data.taglineLines.join(' | ')}] | LinkWidth: ${data.brandLinkWidth}px`);
      await page.close();
    }
    await context.close();
  }

  await browser.close();
}

testAllPages().catch(console.error);
