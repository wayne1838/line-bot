var request = require("request");
var cheerio = require("cheerio");
var common=require("./common.js");
//匯率爬蟲
exports.getCurrency = function (event,currency) {
    var currencyNum = 0;
    switch(currency.toUpperCase()) {
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