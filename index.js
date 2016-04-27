var request = require('superagent');
var cheerio = require('cheerio');

console.log('开始访问csdn');
var rootUrl = 'http://blog.csdn.net';
var stratUrl = 'http://blog.csdn.net/sirm2z/article/list/100';
var startViews = null;
var endViews = null;
var blogNum = 0;
var requestNum = 0;

function start(){
  request
    .get(stratUrl)
    .end(function(err,res){
      if(err){
        console.log('遇到问题了：'+err);
      }else{
        var $ = cheerio.load(res.text);
        var views = $('#blog_rank');
        console.log($('#blog_title h2 a').text());
        console.log('当前访问量：'+$('span',$("li",views)[0]).text());
        startViews = $('span',$("li",views)[0]).text();
        console.log('开始爬blog');
        $('#article_list .list_item').each(function(index,item){
          var url = rootUrl+$('a',$(item)).attr('href');
          blogNum++;
          spider(url);
        })
      }
    })
}

function spider(url){
  request
    .get(url)
    .end(function(err,res){
      if(err){
        console.log('遇到问题了：'+err);
      }else{
        var $ = cheerio.load(res.text);
        console.log('我已经来到-'+$('#article_details h1 a').text());
        requestNum++;
        sureRequest();
      }
    })
}

function sureRequest(){
  if(requestNum === blogNum){
    request
      .get(stratUrl)
      .end(function(err,res){
        if(err){
          console.log('遇到问题了：'+err);
        }else{
          var $ = cheerio.load(res.text);
          var views = $('#blog_rank');
          console.log($('#blog_title h2 a').text());
          console.log('当前访问量：'+$('span',$("li",views)[0]).text());
          endViews = $('span',$("li",views)[0]).text();
          console.log('本次访问量增加了：'+(parseInt(endViews)-parseInt(startViews)));
        }
      })
  }
}

start();