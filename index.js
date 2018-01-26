
let linebot = require('linebot'),
    express = require('express');
const config = require('./package.json'),
    util = require('util');
let bot = linebot({
    channelSecret: '',
    channelAccessToken: ''
});
//設定有權限的使用者ID
let agreeID = ["Uf4bd6364fa8f00a5d8b779d8173b5ab7",]
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
         bot.push('wayne1838',sendMsg);
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
    case 'gg':
        msg =  event.source.userId
        return replayImg(event,imgs,true);
    default:
        //msg =  "ggggg"
        //return replayMsg(event,msg);
    }

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
