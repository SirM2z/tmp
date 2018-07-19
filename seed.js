const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// 小米登录
const XIAOMI_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.xiaomi.iconfont';
// 小米用户名
const XIAOMI_USERNAME_SELECTOR = '#username';
// 小米密码
const XIAOMI_PASSWORD_SELECTOR = '#pwd';
// 小米登录
const XIAOMI_BUTTON_SELECTOR = '#login-button';
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
// 好友列表
const FIRSTFRIENDSLIST_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > ol';
// 第一个好友
const FIRSTFRIENDS_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > ol > li:nth-child(1) > a';
// 浇水
const JIAOSHUI_SELECTOR = 'body > div.fertMainArea > div:nth-child(4) > div > i';
const TEST = 'body > div.fertMainArea > div:nth-child(4)';
// 回农场
const BACKFAMER_SELECTOR = 'body > a.back-home';

const delay = (t) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

const printHtml = async (page) => {
  const bodyHandle = await page.$(TEST);
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log(html);
  await bodyHandle.dispose();
};

(async () => {
  const width = 750;
  const height = 950;
  let args = [];
  args.push(`--window-size=${width},${height}`);
  const browser = await puppeteer.launch({headless: false, slowMo: 100, args});
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.goto('https://passport.futu5.com/?target=https%3A%2F%2Fseed.futunn.com%2F', {waitUntil: 'load'});
  await page.setDefaultNavigationTimeout(60 * 1000);
  const navigationPromise = page.waitForNavigation();
  // await page.click(XIAOMI_SELECTOR);
  // await navigationPromise;
  await page.type(USERNAME_SELECTOR, CREDS.username);
  await page.type(PASSWORD_SELECTOR, CREDS.password);
  await page.click(BUTTON_SELECTOR);
  // await page.type(XIAOMI_USERNAME_SELECTOR, CREDS.xiaomiuser);
  // await page.type(XIAOMI_PASSWORD_SELECTOR, CREDS.xiaomipass);
  // await page.click(XIAOMI_BUTTON_SELECTOR);
  await navigationPromise;
  await page.click(HUDONG_SELECTOR);
  await navigationPromise;
  await page.click(CANSHIFEI_SELECTOR);
  await delay(1000);
  for (let i = 0; ; i++) {
    await page.waitForSelector(FIRSTFRIENDSLIST_SELECTOR);
    const first = await page.$(FIRSTFRIENDS_SELECTOR);
    if (first) {
      // await jiaoshui(page, navigationPromise);
      await page.click(FIRSTFRIENDS_SELECTOR);
      await navigationPromise;
      // printHtml(page, navigationPromise);
      await delay(1000);
      await page.waitForSelector(TEST);
      await page.click(TEST);
      await delay(1000);
      await page.click(BACKFAMER_SELECTOR);
      await navigationPromise;
    } else {
      break
    }
  }
  console.log('浇水结束');
})();