
let linebot = require('linebot'),
    express = require('express');
const config = require('./package.json'),
    util = require('util');
let bot = linebot({
    channelSecret: '25ffb3104b69334901d25f703fb6d9ae',
    channelAccessToken: 'ZeOAKeuHO4/CVhzLNv4C4bP30RSv78SFovLi/1bylh3r/rkyfZWF4I95Pn2AS9b5LwoaF61UIUaq0Cy/kovrhBTksR8TYUEBbcklwfAKng4xk/LPYZkxplKMYV0FTPdFG1tEv0eIdjb3tr2PNMX6ZQdB04t89/1O/w1cDnyilFU='
});
const linebotParser = bot.parser(),
    app = express();
app.post('/webhook', linebotParser);
// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
     setTimeout(function(){
        var userId = "U1eb026dd7325f88ffd1b331b7b6975c2";
        var sendMsg = 'FDF';
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

    setTimeout(function(){
        var userId = event.source.userId;
        var sendMsg = 'FDF';
        bot.push(userId,sendMsg);
        console.log('send: '+sendMsg);
    },5000);
  }
});

function analysisMsg(event) {
    //解析訊息
    var txt = event.message.text;
    var msg = '?';
    var imgs = ['https://imgur.com/GfozkL2.jpg',
        'https://cdn2.ettoday.net/images/2457/d2457713.jpg',
        'https://luna.komica.org/12/src/1516616711084.jpg',
        'https://luna.komica.org/12/thumb/1516646875952s.jpg',
        ];

    switch(txt) {
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
    default:
        //msg =  "ggggg"
        //return replayMsg(event,msg);
    }

    return ;
}


function replayMsg(event,msg){
    //回傳msg
    return event.reply(msg).then(function(data) {
      // success
      console.log(msg);
    }).catch(function(error) {
      // error
      console.log('error');
    });
}

function replayImg(event,imgs){
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
