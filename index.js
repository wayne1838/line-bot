
let linebot = require('linebot'),
    express = require('express');
var common=require("./common.js");
var PM2_5=require("./pm2.5.js");
var exchange=require("./exchange.js");
const fs = require("fs"); // 流
var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
var imgPTT=require("./img.js");
var getJSON = require('get-json'); //FOR PM2.5

const config = require('./package.json'),

    util = require('util');
let bot = linebot({
    channelSecret: '2c1016ab2d465bfe3045a6db1718ec6d',
    channelAccessToken: 'KQktopegf2akiZ5CHi6WJ2bEFea/PaqNNKC7r9I4XaGNQKl6aOH9D1JyqvTatDn/OoY6cmiCB2rIfm11LkesIgLE/T025uWlmlFhOBvX6aF7Ehguw6MV1jXP5RMySzQTIfCZYSXitQtL/U3DDhZEHgdB04t89/1O/w1cDnyilFU='
});
//設定有權限的使用者ID
let agreeID = ["Uf4bd6364fa8f00a5d8b779d8173b5ab7","Uef5b83b111745ae5d6c9198b61363d44"];




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

     //每小時檢查匯率
    //setInterval(exchange.checkExchange,3600000);
    exchange.checkExchange();
    //setInterval(function(){  PM2_5._getJSON();console.log('KKK');}, 1800);
    PM2_5._getJSON();//取得pm2.5內容
    PM2_5._getRain();
});








bot.on('message', function(event) {
  if (event.message.type = 'text') {
    // 把收到訊息的 event 印出來
    console.log(event.source.userId + ' :' + event.message.text);
    //common.replayMsg(event);
    analysisMsg(event);
  }
});


function analysisMsg(event) {
    //解析訊息
    //圖片出處 https://meteor.today/a/mHfzMQ
    var txt = event.message.text;
     if(!txt){//如果為undefined or null
        return ;
    }

    var msg = '';
    var imgs = ['https://imgur.com/GfozkL2.jpg',
        'https://cdn2.ettoday.net/images/2457/d2457713.jpg',
        'https://luna.komica.org/12/src/1516616711084.jpg',
        'https://luna.komica.org/12/thumb/1516646875952s.jpg',
        'https://i.imgur.com/CmN8KXq.jpg',
        'https://i.imgur.com/wF8gsYg.png',
        'https://i.imgur.com/JSzsAQP.jpg',
        'https://i.imgur.com/pFFZpC1.jpg',
        ];

    //pm2.5
    if (txt.indexOf('PM2.5') != -1) {
    	if (PM2_5.pm2_5.length == 0 ) return common.replayMsg(event,"來源錯誤");
        PM2_5.pm2_5.forEach(function(e, i) {
          if (txt.indexOf(e[0]) != -1) {
            msg = e[0] + '的 PM2.5 數值為 ' + e[1]+',時間:'+e[2];
            return common.replayMsg(event,msg);
          }
        });
        if (msg == '') {
          msg = '請輸入正確的地點 如 "松山的PM2.5"';
          return common.replayMsg(event,msg);
        }
      }

    if (txt.indexOf('下雨') != -1 || txt.indexOf('rain') != -1) {
    	if (PM2_5.rainData.length == 0 ) return common.replayMsg(event,"來源錯誤");
        PM2_5.rainData.forEach(function(e, i) {
          if (txt.indexOf(e[0]) != -1) {
            if (e[1] > 0) { 
                msg = e[0] + '正在下雨[' +e[4] + ']'
            }else if (e[2] > 0){
                msg = e[0] + '一小時內曾經下雨[' +e[4] + ']'
            }else if (e[3] > 0){
                msg = e[0] + '不久前曾經下雨[' +e[4] + ']'
            }else if (e[3] == 0){
                msg = e[0] + '沒有下雨[' +e[4] + ']'
            }else{

                console.log(e[3]);
                msg = '資料錯誤或該地區無觀測站，請指定地區如 松山下雨'
            }
            return common.replayMsg(event,msg);
          }
        });
        if (msg == '') {
          msg = '請輸入正確的地點 如 "松山下雨"';
          return common.replayMsg(event,msg);
        }
      }

    switch(txt.toLowerCase()) {
    case '?':
        imgs = ['https://i.imgur.com/CmN8KXq.jpg'];
        return common.replayImg(event,imgs);
    case '1':
        return common.replayImg(event,imgs);
    case '2':
        msg =  "安安，怎麼了??"
        PM2_5._getJSON();//取得pm2.5內容
    	PM2_5._getRain();
        //getimg.start(); 測試中
        return common.replayMsg(event,msg);
    case '你好':
        msg =  "安安"
        return common.replayMsg(event,msg);
    case 'id':
        msg =  event.source.userId
        return common.replayMsg(event,msg);
    case 'HAHA':
        // BeautyPTT(event);
        return HAHA(event);
    case 't':
        return common.template(event);
    case '肥宅':
        imgs = ['https://i.imgur.com/FqDgzOi.jpg'];
        return common.replayImg(event,imgs);
    case '大塊':
        imgs = ['https://i.imgur.com/Cx9agyu.jpg',
        'https://i.imgur.com/KuE0i5J.png',
        'https://i.imgur.com/rN2taZ6.jpg'];
        return common.replayImg(event,imgs);
    case '車干':
        imgs = ['https://i.imgur.com/bZY2D65.jpg'];
        return common.replayImg(event,imgs);    
    case '波波':
        imgs = ['https://i.imgur.com/ymgGXkA.png',
        'https://i.imgur.com/7lPKmdN.jpg',
        'https://i.imgur.com/t2Tf1qa.jpg',
        'https://i.imgur.com/u1d7wQv.jpg',
        'https://i.imgur.com/5OL3Bdq.jpg'];
        return common.replayImg(event,imgs);
    case '旺旺仙貝':
       imgs = ['https://i.imgur.com/vS5oVPS.jpg',
        'https://i.imgur.com/BnK2vi0.jpg',
        'https://i.imgur.com/VAb7tgu.jpg',
        ];
        return common.replayImg(event,imgs);
    case '抽':
    case '抽卡':    
    case 'ptt':
        // BeautyPTT(event);
        return common.replayImg(event,global.imgs);
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
        return common.replayImg(event,imgs);
    case 'jp':
        return exchange.reExhangeMsg(event,'jpy');
    case '匯率':
    	msg =  "請輸入要查詢匯率的幣別的英文，如[日幣]請輸入:jpy";
        return common.replayMsg(event,msg);
    case 'gg':
        return common.replayImg(event,imgs,true);
    default:
    }
        //檢查是否是需要匯率
        exchange.reExhangeMsg(event,txt);
    return ;
}

//測試中的功能
//////-----------------------------------------------
request('http://www.cwb.gov.tw/V7/forecast/taiwan/Taipei_City.htm', (err, res, body) => {
  // 把 body 放進 cheerio 準備分析
const $ = cheerio.load(body)
let weathers = []
$('#box8 .FcstBoxTable01 tbody tr').each(function(i, elem) {
  weathers.push($(this).text().split('\n'))
})
console.log(weathers)
})
//-----------------------------------------------------
//以下功能未完成



function HAHA(event) {
    //取得傲游哈哈趣圖
  request({
    url: "https://www.haha.mx/good/day/"+common.randomNum(38), 
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return "錯誤";
    }else{
        // 爬完網頁後要做的事情
        var $ = cheerio.load(body);
        var img = $(".joke-main-img").attr('src');
        console.log('img:'+img);
        //取代中間字串取得大圖

        var src = ["https:"+img.replace("small", "big")];
        
        return common.replayImg(event,src);
    }
  });
}

function HAHA1(event) {
    //取得傲游哈哈趣圖 未完成
  request({
    url: "http://rinakawaei.blogspot.tw/2015/04/part1.html",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return "錯誤";
    }else{
        // 爬完網頁後要做的事情
        var $ = cheerio.load(body);
        // fs.writeFile("body.txt", body, function(err) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("The file was saved!");
        //     }
        // });
        img = $(".separator a")
        // for (i=0;i<=20;i++){
            
        //     img = $(".separator a")[i];
           
        //     console.log('img:'+img);
        //     if (img != null) break;
        // }
        // fs.writeFile("img.txt", img, function(err) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("The file was saved!");
        //     }
        // });
        var src = [img.attr("href")];
        console.log('img:'+img.attr("href"));
        // return common.replayImg(event,src);
        return common.replayImg(event,["http://3.bp.blogspot.com/-qVKrfypbxrQ/VSuSkmJ7bdI/AAAAAAAANJo/oq3w1-2mWGA/s1600/FireShot%2BScreen%2BCapture%2B%23076%2B-%2B%2B-%2Btwitter_com___eatchan_status_575277636299046912.png"]);
    }
  });
}


