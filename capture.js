const pw = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const path = require('path');

async function run() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const pages = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

  for (const pageName of pages) {
    const page = await context.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, pageName).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const brandNameInfo = await page.evaluate(() => {
      const el = document.querySelector('.brand-name');
      const tagline = document.querySelector('.brand-tagline');
      const brandLink = document.querySelector('.brand-link');
      const navMenu = document.querySelector('.nav-menu');
      const headerActions = document.querySelector('.header-actions');
      const container = document.querySelector('.navbar-container');

      return {
        brandNameText: el ? el.innerText : null,
        brandNameBox: el ? el.getBoundingClientRect() : null,
        taglineBox: tagline ? tagline.getBoundingClientRect() : null,
        brandLinkBox: brandLink ? brandLink.getBoundingClientRect() : null,
        navMenuBox: navMenu ? navMenu.getBoundingClientRect() : null,
        headerActionsBox: headerActions ? headerActions.getBoundingClientRect() : null,
        containerBox: container ? container.getBoundingClientRect() : null,
      };
    });

    console.log(`\n================ ${pageName} ================`);
    console.log('Brand Name Text:\n' + JSON.stringify(brandNameInfo.brandNameText));
    console.log('Brand Name Bounding Box:', brandNameInfo.brandNameBox);
    console.log('Brand Tagline Bounding Box:', brandNameInfo.taglineBox);
    console.log('Brand Link Bounding Box:', brandNameInfo.brandLinkBox);
    console.log('Nav Menu Bounding Box:', brandNameInfo.navMenuBox);

    // Take screenshot of header
    const header = await page.$('.site-header');
    if (header) {
      await header.screenshot({ path: `header_${pageName.replace('.html', '')}.png` });
    }

    await page.close();
  }

  await browser.close();
  console.log('\nDone capturing screenshots!');
}

run().catch(err => {
  console.error('Error in capture:', err);
});
