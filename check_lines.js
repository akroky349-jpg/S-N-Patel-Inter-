const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function checkLines() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html', 'admissions.html', 'faculty.html', 'gallery.html', 'notices.html', 'contact.html'];

  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 800 } });
    const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });

    const lines = await page.evaluate(() => {
      const el = document.querySelector('.brand-name');
      if (!el) return null;
      // Get text nodes and ranges
      const range = document.createRange();
      const words = el.innerText.trim().split(/\s+/);
      
      // Let's check each word's top position
      // We can wrap each word in a span temporarily
      const originalHTML = el.innerHTML;
      el.innerHTML = words.map(w => `<span class="temp-word">${w}</span>`).join(' ');
      const spans = Array.from(el.querySelectorAll('.temp-word'));
      const lineMap = {};
      spans.forEach(s => {
        const top = s.offsetTop;
        if (!lineMap[top]) lineMap[top] = [];
        lineMap[top].push(s.innerText);
      });
      el.innerHTML = originalHTML;

      const taglineEl = document.querySelector('.brand-tagline');
      const tagWords = taglineEl ? taglineEl.innerText.trim().split(/\s+/) : [];
      let taglineLines = {};
      if (taglineEl) {
        const origTag = taglineEl.innerHTML;
        taglineEl.innerHTML = tagWords.map(w => `<span class="temp-w">${w}</span>`).join(' ');
        const tSpans = Array.from(taglineEl.querySelectorAll('.temp-w'));
        tSpans.forEach(s => {
          const top = s.offsetTop;
          if (!taglineLines[top]) taglineLines[top] = [];
          taglineLines[top].push(s.innerText);
        });
        taglineEl.innerHTML = origTag;
      }

      return {
        brandLines: Object.values(lineMap),
        taglineLines: Object.values(taglineLines)
      };
    });

    console.log(`\n[${p}]`);
    console.log('Brand Lines:', lines.brandLines);
    console.log('Tagline Lines:', lines.taglineLines);

    await page.close();
  }

  await browser.close();
}

checkLines().catch(console.error);
