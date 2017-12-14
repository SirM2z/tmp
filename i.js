const Promise = require('es6-promise').Promise
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

function writeLog (content) {
  fs.appendFile('csdn_spider_log.txt', content, (err) => {
    if (err) throw err
  })
}

const rootUrl = 'http://blog.csdn.net'
const stratUrl = 'http://blog.csdn.net/sirm2z'
const listUrl = 'http://blog.csdn.net/sirm2z/svc/getarticles?pageindex=1&pagesize=100&categoryId=0'
let startViews = null
let endViews = null
let blogNum = 0
let successNum = 0
let errNum = 0

async function start() {
  let res = await axios.get(stratUrl)
  let $ = cheerio.load(res.data)
  startViews = $('.gradeAndbadge .num')[0].children[0].data
  console.log(`当前访问量：${startViews}`)
  console.log(`---------------------------------------`)
  let listRes = await axios.get(listUrl)
  let list$ = cheerio.load(listRes.data)
  const blogList = list$('.blog-unit')
  blogNum = blogList.length
  let promises = []
  blogList.each((i, item, arr) => {
    let url = rootUrl + list$(item).find('h3 a')[0].attribs.href
    promises[i] = axios.get(url).then(res => res.data).then(r => {
      let $ = cheerio.load(r)
      let title = $('h1.csdn_top').text().trim()
      console.log(`我已经来到-${title}`)
      successNum++
    }).catch((error) => {
      errNum++
      let now = new Date().toLocaleString()
      let content = `\n时间: ${now}`
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        content += `
        response error
        error.response.data: ${error.response.data}
        error.response.status: ${error.response.status}
        error.response.headers: ${error.response.headers}`
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        content += `
        request error
        error.request: ${error.request}`
      } else {
        // Something happened in setting up the request that triggered an Error
        content += `
        other error
        Error: ${error.message}`
      }
      content += `
      config
      error.config: ${error.config}`
      writeLog(content)
    })
  })
  Promise.all(promises).then((result) => {
    return axios.get(stratUrl)
  }).then(res => {
    let $ = cheerio.load(res.data)
    endViews = $('.gradeAndbadge .num')[0].children[0].data
    console.log(`---------------------------------------`)
    console.log(`成功访问量：${successNum}`)
    console.log(`失败访问量：${errNum}`)
    console.log(`当前访问量：${endViews}`)
    console.log(`本次访问量增加了：${parseInt(endViews.replace(',','')) - parseInt(startViews.replace(',',''))}`)
    console.log(`---------------------------------------`)
    console.log('end')
  }).catch((err) => {
    console.log(err)
  })
}

console.log('开始访问csdn')
start()