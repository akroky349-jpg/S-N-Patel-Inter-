const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function cropBrand() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 800 } });
    const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });
    // Remove preloader completely to be 100% sure
    await page.evaluate(() => {
      const p = document.querySelector('.preloader');
      if (p) p.remove();
    });
    await page.waitForTimeout(500);

    const brandLink = await page.$('.brand-link');
    if (brandLink) {
      await brandLink.screenshot({ path: `brand_${p.replace('.html', '')}.png` });
    }

    await page.close();
  }

  await browser.close();
}

cropBrand().catch(console.error);
