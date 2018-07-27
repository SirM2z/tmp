const puppeteer = require('puppeteer');
const { user, xiaomi, Q, fb, tw, wb } = require('./creds');

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
// qqiframe
const Q_FRAME_SELECTOR = '#ptlogin_iframe';
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
// 收种子
const GET_SELECTOR = '#useCanvas';
// 使用种子
const USE_SELECTOR = 'body > div.floatBox01.seedDetailBox > div > div.btnBar01.ng-scope > a:nth-child(2)';
// 关闭种子使用 弹出框
const CLOSE_SELECTOR = 'body > div:nth-child(13) > div > div.btnBar01 > a';
// 给自己浇水
const SELF_SELECTOR = '#waterCanvas';
// 活动
const HUDONG_SELECTOR = 'body > div.seedWrap01 > div > div.commsendFootBtnBar > ul > li:nth-child(3) > a';
// 可施肥
const CANSHIFEI_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > div.friend-filter > div > span';
// 可施肥 为空
const EMPTY_SELECTOR = 'body > div.seedWrap01 > div > div.friends > div.friend-list-container > div.friend-empty';
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
};

const getHtml = async (page, selector) => {
  const bodyHandle = await page.$(selector);
  if (bodyHandle) {
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    // console.log(html);
    await bodyHandle.dispose();
    return html;
  } else {
    return '';
  }
};

const seed = async (type) => {
  let nums = 0;
  const width = 750;
  const height = 950;
  let args = [];
  args.push(`--window-size=${width},${height}`);
  // const browser = await puppeteer.launch({headless: false, slowMo: 100, args});
  const browser = await puppeteer.launch({slowMo: 100});
  const page = await browser.newPage();
  // 去除 页面内部自定义宽高 导致 滚动条出现
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.goto(LOGIN_URL, {waitUntil: 'load'});
  await page.setDefaultNavigationTimeout(60 * 1000);
  // const navigationPromise = page.waitForNavigation();
  console.log(`开始判断当前角色-${type}`);
  if (type === 'self') {
    await page.evaluate((username, password, button, name, pwd) => {
      document.querySelector(username).value = name;
      document.querySelector(password).value = pwd;
      document.querySelector(button).click();
    }, USERNAME_SELECTOR, PASSWORD_SELECTOR, BUTTON_SELECTOR, user.name, user.pwd);
    await page.waitForNavigation();
  } else if (type === 'xiaomi') {
    await page.click(XIAOMI_SELECTOR);
    await page.waitForSelector(XIAOMI_USERNAME_SELECTOR, {visible: true});
    await page.evaluate((username, password, button, name, pwd) => {
      document.querySelector(username).value = name;
      document.querySelector(password).value = pwd;
      document.querySelector(button).click();
    }, XIAOMI_USERNAME_SELECTOR, XIAOMI_PASSWORD_SELECTOR, XIAOMI_BUTTON_SELECTOR, xiaomi.name, xiaomi.pwd);
    await page.waitForNavigation();
  } else if (['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].includes(type)) {
    await page.click(Q_SELECTOR);
    let name = Q[type].name;
    let pwd = Q[type].pwd;
    await page.waitForSelector(Q_FRAME_SELECTOR, {visible: true});
    const loginFrame = page.mainFrame().childFrames()[0];
    await loginFrame.waitForSelector(Q_USERNAME_BTN_SELECTOR, {visible: true});
    await loginFrame.evaluate((qqlogin, username, password, button, name, pwd) => {
      document.querySelector(qqlogin).click();
      document.querySelector(username).value = name;
      document.querySelector(password).value = pwd;
      document.querySelector(button).click();
    },Q_USERNAME_BTN_SELECTOR, Q_USERNAME_SELECTOR, Q_PASSWORD_SELECTOR, Q_BUTTON_SELECTOR, name, pwd);
    await loginFrame.click(Q_BUTTON_SELECTOR);
    await page.waitForNavigation();
  } else if (type === 'fb') {
    await page.click(FB_SELECTOR);
    await page.waitForSelector(FB_USERNAME_SELECTOR, {visible: true});
    await page.evaluate((username, password, button, name, pwd) => {
      document.querySelector(username).value = name;
      document.querySelector(password).value = pwd;
      document.querySelector(button).click();
    }, FB_USERNAME_SELECTOR, FB_PASSWORD_SELECTOR, FB_BUTTON_SELECTOR, fb.name, fb.pwd);
    await page.waitForNavigation();
  } else if (type === 'tw') {
    await page.click(TW_SELECTOR);
    await page.waitForSelector(TW_USERNAME_SELECTOR, {visible: true});
    await page.evaluate((username, password, button, name, pwd) => {
      document.querySelector(username).value = name;
      document.querySelector(password).value = pwd;
      document.querySelector(button).click();
    }, TW_USERNAME_SELECTOR, TW_PASSWORD_SELECTOR, TW_BUTTON_SELECTOR, tw.name, tw.pwd);
    await page.waitForNavigation();
  } else if (type === 'wb') {
    await page.click(WB_SELECTOR);
    await page.waitForSelector(WB_USERNAME_SELECTOR, {visible: true});

    // 微博 傻逼
    // await page.evaluate((username, password, name, pwd) => {
    //   document.querySelector(username).value = name;
    //   document.querySelector(password).value = pwd;
    // }, WB_USERNAME_SELECTOR, WB_PASSWORD_SELECTOR, wb.name, wb.pwd);

    // await page.focus(WB_USERNAME_SELECTOR);
    // await page.keyboard.press('Delete', {delay: 1000});
    await page.type(WB_USERNAME_SELECTOR, wb.name);
    await page.type(WB_PASSWORD_SELECTOR, wb.pwd);
    await page.click(WB_BUTTON_SELECTOR);
    await page.waitForNavigation();
  }
  console.log(`${type}---浇水开始！`);
  const judgeIsGet = await Promise.race([
    page.waitForSelector(GET_SELECTOR, {visible: true}).then(_ => 1),
    page.waitForSelector(SELF_SELECTOR, {visible: true}).then(_ => 2)
  ]);
  if (judgeIsGet === 1) {
    console.log(`使用种子`);
    await page.click(GET_SELECTOR);
    await page.waitForSelector(USE_SELECTOR, {visible: true});
    await page.click(USE_SELECTOR);
    await page.waitForSelector(CLOSE_SELECTOR, {visible: true});
    await page.click(CLOSE_SELECTOR);
  }
  console.log(`开始自我浇水`);
  await page.click(SELF_SELECTOR);
  console.log(`点击互动页`);
  await page.click(HUDONG_SELECTOR);
  console.log(`点击可浇水按钮`);
  await page.waitForSelector(CANSHIFEI_SELECTOR, {visible: true});
  await page.click(CANSHIFEI_SELECTOR);
  for (let i = 0; ; i++) {
    console.log(`------判断是否有人待浇水------`);
    const judgeIsEnd = await Promise.race([
      page.waitForSelector(EMPTY_SELECTOR, {visible: true}).then(_ => 1).catch(err => 1),
      page.waitForSelector(EMPTY_SELECTOR, {hidden: true}).then(_ => 2).catch(err => 1)
    ]);
    if (judgeIsEnd === 1) {
      console.log(`${type}---浇水结束！`);
      console.log(' ');
      console.log(' ');
      await browser.close();
      return;
    }
    console.log(`         第${++nums}人---浇水`);
    await page.click(FIRSTFRIENDS_SELECTOR);
    console.log('          来到浇水页');
    await page.waitForSelector(TEST, {visible: true});
    await page.click(TEST);
    console.log(`         第${nums}人---浇完`);
    await page.waitForSelector(BACKFAMER_SELECTOR, {visible: true});
    await page.click(BACKFAMER_SELECTOR);
  }
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
  // 脸书 走一波
  // await seed('fb');
  // twitter 走一波
  // await seed('tw');
  // weibo 走一波
  // await seed('wb');
})()