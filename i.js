const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

function writeLog (content) {
  fs.appendFile('csdn_spider_log.txt', content, (err) => {
    if (err) throw err
  })
}

const stratUrl = 'http://blog.csdn.net/sirm2z'
const listUrl2 = 'https://blog.csdn.net/sirm2z/article/list/2'
const listUrl3 = 'https://blog.csdn.net/sirm2z/article/list/3'
let startViews = null
let endViews = null
let blogNum = 0
let successNum = 0
let errNum = 0

async function start() {
  let res = await axios.get(stratUrl)
  let $ = cheerio.load(res.data)
  startViews = $('.grade-box dd')[1].attribs.title
  console.log(`当前访问量：${startViews}`)
  console.log(`---------------------------------------`)
  // let blogList = $('.article-item-box')
  let listRes2 = await axios.get(listUrl2)
  // let list2$ = cheerio.load(listRes2.data)
  // blogList = list2$('.article-item-box')
  let listRes3 = await axios.get(listUrl3)
  // let list3$ = cheerio.load(listRes3.data)
  let list$ = cheerio.load(res.data + listRes2.data + listRes3.data)
  let blogList = list$('.article-item-box')
  blogNum = blogList.length
  let promises = []
  blogList.each((i, item, arr) => {
    let url = list$(item).find('h4 a')[0].attribs.href
    promises[i] = axios.get(url).then(res => res.data).then(r => {
      let $ = cheerio.load(r)
      let title = $('h1.title-article').text().trim()
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
    endViews = $('.grade-box dd')[1].attribs.title
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