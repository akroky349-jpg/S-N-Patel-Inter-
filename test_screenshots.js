const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function testScreenshots() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const widths = [1250, 1200];
  for (const w of widths) {
    const context = await browser.newContext({ viewport: { width: w, height: 800 } });
    for (const p of ['facilities.html', 'index.html', 'about.html', 'academics.html']) {
      const page = await context.newPage();
      const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
      await page.goto(filePath, { waitUntil: 'load' });
      await page.evaluate(() => {
        const pre = document.querySelector('.preloader');
        if (pre) pre.remove();
      });
      await page.waitForTimeout(300);

      const brandLink = await page.$('.brand-link');
      if (brandLink) {
        await brandLink.screenshot({ path: `brand_${w}_${p.replace('.html', '')}.png` });
      }
      await page.close();
    }
    await context.close();
  }

  await browser.close();
}

testScreenshots().catch(console.error);
