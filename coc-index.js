var request = require('superagent');
var cheerio = require('cheerio');

var coc_config = {
    username:'',//用户名
    password:'',//密码
    loginUrl:'http://heycoc.com/',
    postUrl:'http://heycoc.com/cocplayer.php',
    getDataUrl:'http://heycoc.com/usercenter.php',
    cookie:'',
    list:[
        [
            '村庄数据--无用'
        ],
        [
            '推荐配置--无用'
        ],
        [
            '当前金币',
            '当前紫水',
            '当前黑水'
        ],
        [
            '日抢金币',
            '日抢紫水',
            '日抢黑水'
        ],
        [
            '共抢金币',
            '共抢紫水',
            '共抢黑水',
            '总挂机时长'
        ]
    ]
}

//登陆首页，获取cookie
function coc_start(){
    console.log('get-heycoc.com'+coc_config.loginUrl);
    request.get(coc_config.loginUrl)
        .set('Content-Type','application/x-www-form-urlencoded')
        .end(function(err,res){
            if(err){console.log(err);return;}
            coc_config.cookie= res.headers["set-cookie"].join(',')
                .match(/(PHPSESSID=.+?);/)[1];
            coc_login();
        })
}

//通过cookie模拟登陆
function coc_login(){
    console.log('post-heycoc.com'+coc_config.loginUrl);
    request.post(coc_config.loginUrl)
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Cookie',coc_config.cookie)
        .send({ username: coc_config.username })
        .send({ password: coc_config.password })
        .send({ loginsubmit: '登录' })
        .send({ fastlogincode: '' })
        .end(function(err,res){
            if(err){console.log(err);return}
            coc_changeNumber();
        })
}

//模拟切换序列号操作
function coc_changeNumber(){
    console.log('get-cocplayer.php'+coc_config.postUrl);
    request.post(coc_config.postUrl)
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Cookie',coc_config.cookie)
        .send({ cr_head_selectsn: '2RPGJ2G8' })
        .send({ changesn: '切换序列号' })
        .end(function(err,res){
            if(err){console.log(err);return}
            coc_getData();
        })
}

//获取用户中心页数据
function coc_getData(){
    console.log('get-usercenter.php'+coc_config.getDataUrl);
    request.get(coc_config.getDataUrl)
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Cookie',coc_config.cookie)
        .end(function(err,res){
            if(err){console.error(err);return;}
            var $=cheerio.load(res.text);
            $('#usercenter_lootsum fieldset').each(function(index,item){
                if(index===0){//村庄数据
                    console.log('\n');
                    console.log('---'+$(item).find('legend').text()+'----------------');
                    $(item).find('ul li').each(function(_index,_item){
                        console.log('     '+$(_item).text());
                    })
                }else{
                    console.log('\n');
                    console.log('---'+$(item).find('legend').text()+'----------------');
                    $(item).find('div>span.progressbar').each(function(_index,_item){
                        console.log('     '+coc_config.list[index][_index]+': '+$(_item).data('perc'));
                    })
                }
            })
        })
}

console.log(new Date().toLocaleString());
coc_start();