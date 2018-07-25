const puppeteer = require('puppeteer');
const { user, xiaomi, Q1, Q2, Q3, Q4, Q5, fb, tw, wb } = require('./creds');

// 登录页
const LOGIN_URL = 'https://passport.futu5.com/?target=https%3A%2F%2Fseed.futunn.com%2F';

// #region login
// 用户名
const USERNAME_SELECTOR = '#loginFormWrapper > form > ul > li.ui-input-wrapper.ui-content-email > input';
// 密码
const PASSWORD_SELECTOR = '#loginFormWrapper > form > ul > li:nth-child(3) > input';
// 登录
const BUTTON_SELECTOR = '#loginFormWrapper > form > input.ui-submit.ui-form-submit';
// #endregion

// #region xiaomi
// 小米登录
const XIAOMI_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.xiaomi.iconfont';
// 小米用户名
const XIAOMI_USERNAME_SELECTOR = '#username';
// 小米密码
const XIAOMI_PASSWORD_SELECTOR = '#pwd';
// 小米登录
const XIAOMI_BUTTON_SELECTOR = '#login-button';
// #endregion

// #region Q
// qq登录
const Q_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.qq.iconfont';
// qq账号密码登录
const Q_USERNAME_BTN_SELECTOR = '#switcher_plogin';
// qq用户名
const Q_USERNAME_SELECTOR = '#u';
// qq密码
const Q_PASSWORD_SELECTOR = '#p';
// qq登录
const Q_BUTTON_SELECTOR = '#login_button';
// #endregion

// #region fb
// fb登录
const FB_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.fb.iconfont';
// fb用户名
const FB_USERNAME_SELECTOR = '#email';
// fb密码
const FB_PASSWORD_SELECTOR = '#pass';
// fb登录
const FB_BUTTON_SELECTOR = '#loginbutton';
// #endregion

// #region twittwe
// tw登录
const TW_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.tw.iconfont';
// tw用户名
const TW_USERNAME_SELECTOR = '#username_or_email';
// tw密码
const TW_PASSWORD_SELECTOR = '#password';
// tw登录
const TW_BUTTON_SELECTOR = '#allow';
// #endregion

// #region weibo
// wb登录
const WB_SELECTOR = 'body > div > div.m-form-wrapper.j-content-wrapper > div.u-oauth-login.j-oauth-login > div.open001 > div > a.sina.mr0.iconfont';
// wb用户名
const WB_USERNAME_SELECTOR = '#userId';
// wb密码
const WB_PASSWORD_SELECTOR = '#passwd';
// wb登录
const WB_BUTTON_SELECTOR = '#outer > div > div.WB_panel.oauth_main > form > div > div.oauth_login_box01.clearfix > div > p > a.WB_btn_login.formbtn_01';
// #endregion

// #region main
// 给自己浇水
const SELF_SELECTOR = '#waterCanvas';
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
// #endregion

const delay = (t) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

const printHtml = async (page, selector) => {
  const bodyHandle = await page.$(selector);
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log(html);
  await bodyHandle.dispose();
};

const seed = async (type) => {
  let nums = 0;
  const width = 750;
  const height = 950;
  let args = [];
  args.push(`--window-size=${width},${height}`);
  const browser = await puppeteer.launch({headless: false, slowMo: 100, args});
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // 去除 页面内部自定义宽高 导致 滚动条出现
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.goto(LOGIN_URL, {waitUntil: 'load'});
  await page.setDefaultNavigationTimeout(60 * 1000);
  const navigationPromise = page.waitForNavigation();
  if (type === 'self') {
    await page.type(USERNAME_SELECTOR, user.name);
    await page.type(PASSWORD_SELECTOR, user.pwd);
    await page.click(BUTTON_SELECTOR);
    await navigationPromise;
  } else if (type === 'xiaomi') {
    await page.click(XIAOMI_SELECTOR);
    await navigationPromise;
    await page.type(XIAOMI_USERNAME_SELECTOR, xiaomi.name);
    await page.type(XIAOMI_PASSWORD_SELECTOR, xiaomi.pwd);
    await page.click(XIAOMI_BUTTON_SELECTOR);
    await delay(3000);
    await navigationPromise;
  } else if (['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].includes(type)) {
    await page.click(Q_SELECTOR);
    await navigationPromise;
    const loginFrame = page.mainFrame().childFrames()[0];
    await loginFrame.click(Q_USERNAME_BTN_SELECTOR);
    let name = '';
    let pwd = '';
    switch (type) {
      case 'Q1':
        name = Q1.name;
        pwd = Q1.pwd;
        break;
      case 'Q2':
        name = Q2.name;
        pwd = Q2.pwd;
        break;
      case 'Q3':
        name = Q3.name;
        pwd = Q3.pwd;
        break;
      case 'Q4':
        name = Q4.name;
        pwd = Q4.pwd;
        break;
      case 'Q5':
        name = Q5.name;
        pwd = Q5.pwd;
        break;
      default:
        console.warn('未找到Q用户名');
        return false;
    }
    await loginFrame.type(Q_USERNAME_SELECTOR, name);
    await loginFrame.type(Q_PASSWORD_SELECTOR, pwd);
    await loginFrame.click(Q_BUTTON_SELECTOR);
    await delay(3000);
    await delay(3000);
    await delay(3000);
    await navigationPromise;
  } else if (type === 'fb') {
    await page.click(FB_SELECTOR);
    await navigationPromise;
    await page.type(FB_USERNAME_SELECTOR, fb.name);
    await page.type(FB_PASSWORD_SELECTOR, fb.pwd);
    await page.click(FB_BUTTON_SELECTOR);
    await delay(3000);
    await delay(3000);
    await delay(3000);
    await navigationPromise;
  } else if (type === 'tw') {
    await page.click(TW_SELECTOR);
    await navigationPromise;
    await page.type(TW_USERNAME_SELECTOR, tw.name);
    await page.type(TW_PASSWORD_SELECTOR, tw.pwd);
    await page.click(TW_BUTTON_SELECTOR);
    await delay(3000);
    await delay(3000);
    await delay(3000);
    await navigationPromise;
  } else if (type === 'wb') {
    await page.click(WB_SELECTOR);
    await navigationPromise;
    await page.type(WB_USERNAME_SELECTOR, wb.name);
    await page.type(WB_PASSWORD_SELECTOR, wb.pwd);
    await page.click(WB_BUTTON_SELECTOR);
    await delay(3000);
    await delay(3000);
    await navigationPromise;
  }
  console.log(`${type}---浇水开始！`);
  await page.click(SELF_SELECTOR);
  await delay(1000);
  await page.click(HUDONG_SELECTOR);
  await navigationPromise;
  await page.click(CANSHIFEI_SELECTOR);
  await delay(1000);
  for (let i = 0; ; i++) {
    await delay(1000);
    await page.waitForSelector(FIRSTFRIENDSLIST_SELECTOR);
    // printHtml(page, FIRSTFRIENDSLIST_SELECTOR);
    const first = await page.$(FIRSTFRIENDS_SELECTOR);
    if (first) {
      console.log(`第${++nums}人---浇水`);
      await page.click(FIRSTFRIENDS_SELECTOR);
      await navigationPromise;
      await delay(3000);
      await page.waitForSelector(TEST);
      await page.click(TEST);
      console.log(`第${nums}人---浇完`);
      await delay(1000);
      await page.click(BACKFAMER_SELECTOR);
      await navigationPromise;
    } else {
      break
    }
  }
  console.log(`${type}---浇水结束！`);
  await browser.close();
}

(async () => {
  // 主号 走一波
  await seed('self');
  // 小米 走一波
  // await seed('xiaomi');
  // Q 走一波
  // await seed('Q1');
  // await seed('Q2');
  // await seed('Q3');
  // await seed('Q4');
  // await seed('Q5');
  // await seed('Q5');
  // 脸书 走一波
  // await seed('fb');
  // twitter 走一波
  // await seed('tw');
  // weibo 走一波
  // await seed('wb');
})()