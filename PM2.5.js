
var common=require("./common.js");
var request = require("request");
var cheerio = require("cheerio");
var getJSON = require('get-json'); //FOR PM2.5

var timer;
var pm2_5 =[];
var rainData =[];

function _getJSON() {
  console.log("PM25");
  clearTimeout(timer);
  //http://opendata2.epa.gov.tw/AQX.json--這網址好像是假資料?
  getJSON('http://opendata.epa.gov.tw/ws/Data/ATM00625/?$format=json', function(error, response) {
    response.forEach(function(e, i) {
       //console.log("PM");
      pm2_5[i] = [];
      pm2_5[i][0] = e.Site;
      pm2_5[i][1] = e.PM25 * 1;
      pm2_5[i][2] = e.DataCreationDate ;
    });
  });
  //console.log("PM");
  if (pm2_5 == ""){//取得資料失敗 三十秒重試
    timer = setInterval(_getJSON, 30000);
  }
  timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}
//下雨 氣象meteorology  http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json
function _getRain() {
  console.log("Rain");
  clearTimeout(timer);
  //http://opendata2.epa.gov.tw/AQX.json--這網址好像是假資料?
  getJSON('http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$format=json', function(error, response) {
    response.forEach(function(e, i) {
      rainData[i] = [];
      rainData[i][0] = e.SiteName;
      rainData[i][1] = e.Rainfall10min;
      rainData[i][2] = e.Rainfall1hr ;
      rainData[i][3] = e.Rainfall3hr ;
    });
  });
  if (rainData == ""){//取得資料失敗 三十秒重試
    timer = setInterval(_getRain, 30000);
  }
  timer = setInterval(_getRain, 1800000); //每半小時抓取一次新資料
}



exports.pm2_5 =  pm2_5;
exports._getJSON =  _getJSON;
exports.rainData =  rainData;
exports._getRain =  _getRain;
