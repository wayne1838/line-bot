var request = require("request");
var cheerio = require("cheerio");
var common=require("./common.js");
//node js 模組化 http://www.cnblogs.com/dolphinX/p/3485260.html
//匯率爬蟲
var timer;
var currencyData = [];


function getData() {//啟動定時 將資料匯入變數

  clearTimeout(timer);
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
        target.forEach(function(e) {
            currencyData[i] = e.children[0].data;
            });
        //old : var msg = currency+"/TWD 匯率:"+target[currencyNum].children[0].data;
        //var msg = currency+"/TWD 匯率:"+currencyData[currencyNum];
    }
  });

  timer = setInterval(_getJSON, 600000); //每10分抓取一次新資料
}

function reExhangeMsg(event,currency) {//即時取得資料 回傳對話
    console.log("currency"+currency);
    var currencyNum = 0;
    switch(currency) {
    case 'usd':
        currencyNum = 1;
        break;
    case 'hkd':
        currencyNum = 3;
        break;
    case 'jpy':
        currencyNum = 15;
        break;
    case 'eur':
        currencyNum = 29;
        break;
    case 'cny':
        currencyNum = 37;
        break;
    default:
        return '';
    };
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
        target.forEach(function(e) {
            currencyData[i] = e.children[0].data;
            });
        var msg = currency+"/TWD 匯率:"+target[currencyNum].children[0].data;
        //var msg = currency+"/TWD 匯率:"+currencyData[currencyNum];
        console.log("GET"+msg);
        return common.replayMsg(event,msg);
        
    }
  });
}

function reExhangeMsgLast(event,currency) {//非即時取得資料 回傳對話
  return common.replayMsg(event,getExchangeData[currency]);
}

function getExchangeData(currency) {//取得幣別匯率資料
    var currencyNum = 0;
 switch(currency) {
    case 'usd':
        currencyNum = 1;
        break;
    case 'hkd':
        currencyNum = 3;
        break;
    case 'jpy':
        currencyNum = 15;
        break;
    case 'eur':
        currencyNum = 29;
        break;
    case 'cny':
        currencyNum = 37;
        break;
    default:
        currencyNum = 15;
        break '';
    };
    return currencyData[currencyNum];
}

function checkExchange(){
    //匯率低於參數 則通知
    var jpy = getExchangeData("jpy");
    if(jpy <0.267){
        var userId = "Uf4bd6364fa8f00a5d8b779d8173b5ab7";
        var sendMsg = "目前日幣匯率低於"+jpy;
        bot.push(userId,sendMsg);
    }
}


exports.currencyData = currencyData;
exports.reExhangeMsg = reExhangeMsg;
exports.reExhangeMsgLast = reExhangeMsgLast;
exports.getExchangeData = getExchangeData;
exports.checkExchange = checkExchange;