
let linebot = require('linebot'),
    express = require('express');


var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
var imgPTT=require("./img.js");
const config = require('./package.json'),
    util = require('util');
let bot = linebot({
    channelSecret: '',
    channelAccessToken: ''
});
//設定有權限的使用者ID
let agreeID = ["Uf4bd6364fa8f00a5d8b779d8173b5ab7",];

const linebotParser = bot.parser(),
    app = express();
app.post('/line', linebotParser);
// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
     setTimeout(function(){
        var userId = "Uf4bd6364fa8f00a5d8b779d8173b5ab7";
        var sendMsg = '開啟';
        bot.push(userId,sendMsg);
        console.log('send: '+sendMsg);
    },5000);
});


bot.on('message', function(event) {
  if (event.message.type = 'text') {
    // 把收到訊息的 event 印出來
    console.log(event.source.userId + ' :' + event.message.text);
    //replayMsg(event);
    analysisMsg(event);
  }
});

function analysisMsg(event) {
    //解析訊息
    //圖片出處 https://meteor.today/a/mHfzMQ
    var txt = event.message.text;
    var msg = '?';
    var imgs = ['https://imgur.com/GfozkL2.jpg',
        'https://cdn2.ettoday.net/images/2457/d2457713.jpg',
        'https://luna.komica.org/12/src/1516616711084.jpg',
        'https://luna.komica.org/12/thumb/1516646875952s.jpg',
        'https://i.imgur.com/CmN8KXq.jpg',
        'https://i.imgur.com/wF8gsYg.png',
        'https://i.imgur.com/JSzsAQP.jpg',
        'https://i.imgur.com/pFFZpC1.jpg',
        ];
    switch(txt) {
    case '?':
        imgs = ['https://i.imgur.com/CmN8KXq.jpg'];
        return replayImg(event,imgs);
    case '1':
        return replayImg(event,imgs);
    case '2':
        msg =  "安安，怎麼了??"
        return replayMsg(event,msg);
    case '你好':
        msg =  "安安"
        return replayMsg(event,msg);
    case 'id':
        msg =  event.source.userId
        return replayMsg(event,msg);
    case 'jp':
        exchange(event,'JPY');
        break;
    case 't':
        return template(event);
    case '肥宅':
        imgs = ['https://i.imgur.com/FqDgzOi.jpg'];
        return replayImg(event,imgs);
    case '大塊':
        imgs = ['https://i.imgur.com/Cx9agyu.jpg'];
        return replayImg(event,imgs);
    case '波波':
        imgs = ['https://i.imgur.com/ymgGXkA.png'];
        return replayImg(event,imgs);
    case '旺旺仙貝':
       imgs = ['https://i.imgur.com/vS5oVPS.jpg',
        'https://i.imgur.com/BnK2vi0.jpg',
        'https://i.imgur.com/VAb7tgu.jpg',
        ];
        return replayImg(event,imgs);
    case 'ptt':
        // BeautyPTT(event);
        return replayImg(event,global.imgs);
        break;
    case '狗':
        imgs = ['https://i.imgur.com/6jHEGXt.png',
        'https://i.imgur.com/dx38cy8.jpg',
        'https://i.imgur.com/6Hd2TeQ.jpg',
        'https://i.imgur.com/2rgRUeP.jpg',
        'https://i.imgur.com/km9BZZ5.jpg',
        'https://i.imgur.com/jkzUyjF.jpg',
        'https://i.imgur.com/Hh2NX1m.jpg',
        'https://i.imgur.com/l36y14Y.jpg',
        ];
        return replayImg(event,imgs);
    case 'gg':
        return replayImg(event,imgs,true);
    default:
    }

    //檢查是否是需要匯率
    exchange(event,txt);

    return ;
}

function replayMsg(event,msg,agree = false){
    if (agree == true && agreeID.indexOf(event.source.userId) == -1)
    {//agree == true 檢查權限 沒有權限則離開
        return ;
    }
    //回傳msg
    return event.reply(msg).then(function(data) {
      // success
      console.log(msg);
    }).catch(function(error) {
      // error
      console.log('error');
    });
}

function replayImg(event,imgs,agree = false){
    if (agree == true && agreeID.indexOf(event.source.userId) == -1)
    {//agree == true 檢查權限 沒有權限則離開
        return ;
    }
    //取得隨機數
    var num = Math.ceil(Math.random()*imgs.length)-1;

    console.log('random = '+num);
    //回傳圖片
    return event.reply({
    type: 'image',
    originalContentUrl: imgs[num],
    previewImageUrl: imgs[num]
    });
}

function exchange(event,currency) {
    var currencyNum = 0;
    switch(currency) {
    case 'USD':
        currencyNum = 1;
        break;
    case 'HKD':
        currencyNum = 3;
        break;
    case 'JPY':
        currencyNum = 15;
        break;
    case 'EUR':
        currencyNum = 29;
        break;
    case 'CNY':
        currencyNum = 37;
        break;
    default:
        return;
    }
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return "錯誤";
    }else{
        // 爬完網頁後要做的事情
        var $ = cheerio.load(body);
        var target = $(".rate-content-sight.text-right.print_hide");
        var msg = currency+"/TWD 匯率:"+target[currencyNum].children[0].data;
        return replayMsg(event,msg);
    }
  });
}


function template(event){
    return event.reply({
    type: 'template',
    altText: 'this is a buttons template',
    template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
        }, {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123'
        }, {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123'
        }]
    }
});
}






