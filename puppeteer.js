const puppeteer = require('puppeteer');

const  clickA = async (p) => {
  const a = await p.$$('.article-item-box.csdn-tracking-statistics h4 a');
  for (const item of a) {
    await item.click();
  }
};

(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 250});
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://blog.csdn.net/sirm2z', {waitUntil: 'load'});
  await clickA(page);
  const navigationPromise1 = page.waitForNavigation();
  await page.click('.js-page-next.js-page-action.ui-pager');
  await navigationPromise1;
  await clickA(page);
  const navigationPromise2 = page.waitForNavigation();
  await page.click('.js-page-next.js-page-action.ui-pager');
  await navigationPromise2;
  await clickA(page);
  await browser.close();
})();