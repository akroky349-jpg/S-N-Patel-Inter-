const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function testWidths() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const widths = [1920, 1600, 1440, 1366, 1200, 1024];
  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

  for (const w of widths) {
    console.log(`\n=================== VIEWPORT WIDTH: ${w}px ===================`);
    const context = await browser.newContext({ viewport: { width: w, height: 800 } });
    
    for (const p of pages) {
      const page = await context.newPage();
      const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
      await page.goto(filePath, { waitUntil: 'load' });
      await page.waitForTimeout(300);

      const data = await page.evaluate(() => {
        const brandName = document.querySelector('.brand-name');
        const tagline = document.querySelector('.brand-tagline');
        const brandLink = document.querySelector('.brand-link');
        const logo = document.querySelector('.brand-logo-img');
        
        return {
          brandNameText: brandName ? brandName.innerText.replace(/\n/g, ' [BR] ') : null,
          brandNameWidth: brandName ? brandName.getBoundingClientRect().width : null,
          brandNameHeight: brandName ? brandName.getBoundingClientRect().height : null,
          taglineWidth: tagline ? tagline.getBoundingClientRect().width : null,
          taglineHeight: tagline ? tagline.getBoundingClientRect().height : null,
          logoWidth: logo ? logo.getBoundingClientRect().width : null,
        };
      });

      console.log(`${p.padEnd(16)} -> brandName: "${data.brandNameText}" (h: ${data.brandNameHeight}px, w: ${Math.round(data.brandNameWidth)}px) | tagline (h: ${data.taglineHeight}px) | logo: ${data.logoWidth}px`);
      await page.close();
    }
    await context.close();
  }

  await browser.close();
}

testWidths().catch(console.error);
