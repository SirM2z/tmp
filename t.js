const Promise = require('es6-promise').Promise
const axios = require('axios')

var p1 = axios({
  method: 'get',
  url: 'http://blog.csdn.net/sirm2z?viewmode=contents',
  responseType: 'text'
})

var p2 = axios({
  method: 'get',
  url: 'http://blog.csdn.net/sirm2z?viewmode=contents',
  responseType: 'text'
})

Promise.all([p1, p2]).then((results) => {
  console.log(results.length)
})