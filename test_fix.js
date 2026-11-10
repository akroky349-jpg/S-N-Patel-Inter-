const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function testFix() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 800 } });
    const filePath = 'file:///' + path.resolve(__dirname, p).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });
    await page.evaluate(() => {
      const pre = document.querySelector('.preloader');
      if (pre) pre.remove();
    });

    // Apply the fix via CSS in page
    await page.addStyleTag({
      content: `
        .brand-link {
          flex-shrink: 0 !important;
        }
        .brand-tagline {
          white-space: nowrap !important;
        }
        .brand-name {
          max-width: 225px !important;
        }
      `
    });

    await page.waitForTimeout(200);

    const brandData = await page.evaluate(() => {
      const brandLink = document.querySelector('.brand-link');
      const brandName = document.querySelector('.brand-name');
      const tagline = document.querySelector('.brand-tagline');
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = Array.from(document.querySelectorAll('.nav-link')).map(l => ({
        text: l.innerText.trim(),
        width: l.getBoundingClientRect().width,
        height: l.getBoundingClientRect().height
      }));

      return {
        brandLinkWidth: brandLink.getBoundingClientRect().width,
        brandLinkHeight: brandLink.getBoundingClientRect().height,
        brandNameWidth: brandName.getBoundingClientRect().width,
        brandNameHeight: brandName.getBoundingClientRect().height,
        taglineWidth: tagline.getBoundingClientRect().width,
        taglineHeight: tagline.getBoundingClientRect().height,
        navLinks
      };
    });

    console.log(`\n================= ${p} =================`);
    console.log('Brand Link Size:', brandData.brandLinkWidth, 'x', brandData.brandLinkHeight);
    console.log('Brand Name Size:', brandData.brandNameWidth, 'x', brandData.brandNameHeight);
    console.log('Tagline Size:   ', brandData.taglineWidth, 'x', brandData.taglineHeight);
    
    // Screenshot
    const header = await page.$('.site-header');
    await header.screenshot({ path: `test_fixed_${p.replace('.html', '')}.png` });

    await page.close();
  }

  await browser.close();
  console.log('\nDone testing fix!');
}

testFix().catch(console.error);
