const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// 用户名
const USERNAME_SELECTOR = '#loginFormWrapper > form > ul > li.ui-input-wrapper.ui-content-email > input';
// 密码
const PASSWORD_SELECTOR = '#loginFormWrapper > form > ul > li:nth-child(3) > input';
// 登录
const BUTTON_SELECTOR = '#loginFormWrapper > form > input.ui-submit.ui-form-submit';

// 活动
const HUDONG_SELECTOR = 'body > div.seedWrap01 > div > div.commsendFootBtnBar > ul > li:nth-child(3) > a';
// 可施肥
const CANSHIFEI_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > div.friend-filter > div > span';
// 第一个好友
const FIRSTFRIENDS_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > ol > li:nth-child(1) > a';
// 浇水
const JIAOSHUI_SELECTOR = 'body > div.fertMainArea > div.opBtnBox > div.opBtn.ng-scope';
// 回农场
const BACKFAMER_SELECTOR = 'body > a.back-home';

function delay(t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

const jiaoshui = async (p, nvWait) => {

  await p.click(FIRSTFRIENDS_SELECTOR);

  await nvWait;

  await p.click(JIAOSHUI_SELECTOR);

  await delay(2000);

  await p.click(BACKFAMER_SELECTOR);

  await nvWait;
};

(async () => {
  const width = 375;
  const height = 667;
  let args = [];
  args.push(`--window-size=${width},${height}`);
  const browser = await puppeteer.launch({headless: false, args});
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.goto('https://passport.futu5.com/?target=https%3A%2F%2Fseed.futunn.com%2F', {waitUntil: 'load'});

  await page.type(USERNAME_SELECTOR, CREDS.username);
  await page.type(PASSWORD_SELECTOR, CREDS.password);

  await page.setDefaultNavigationTimeout(60 * 1000);

  const navigationPromise = page.waitForNavigation();

  await page.click(BUTTON_SELECTOR);

  await navigationPromise;

  await page.click(HUDONG_SELECTOR);

  await navigationPromise;

  await page.click(CANSHIFEI_SELECTOR);

  await delay(2000);

  await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await jiaoshui(page, navigationPromise);
  // await page.click(FIRSTFRIENDS_SELECTOR);

  // await navigationPromise;

  // await page.click(JIAOSHUI_SELECTOR);

  // await delay(2000);

  // await page.click(BACKFAMER_SELECTOR);

  // await navigationPromise;


  
  // await browser.close();
})();