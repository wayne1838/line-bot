var request = require("request");
var cheerio = require("cheerio");
var common=require("./common.js");
//node js 模組化 http://www.cnblogs.com/dolphinX/p/3485260.html
//匯率爬蟲
function getCurrency(event,currency) {
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
        return common.replayMsg(event,msg);
        
    }
  });
}

exports.getCurrency = getCurrency;