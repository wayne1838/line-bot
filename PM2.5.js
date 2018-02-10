
var common=require("./common.js");
var request = require("request");
var cheerio = require("cheerio");
var getJSON = require('get-json'); //FOR PM2.5

var timer,timerRain;
var pm2_5 =[];
var rainData =[];

function _getJSON() {
  console.log("PM25");
  clearTimeout(timer);
  //http://opendata2.epa.gov.tw/AQX.json--這網址好像是假資料?
  getJSON('http://opendata.epa.gov.tw/ws/Data/ATM00625/?$format=json', function(error, response) {
    if (!response) {return;}
    response.forEach(function(e, i) {
      pm2_5[i] = [];
      pm2_5[i][0] = e.Site;
      pm2_5[i][1] = e.PM25;
      pm2_5[i][2] = e.DataCreationDate ;
       console.log("PM25"+ e.Site);
    });
  });
  //console.log("PM");
  // if (pm2_5 == ""){//取得資料失敗 三十秒重試
  //   timer = setInterval(_getJSON, 30000);
  // }
  timer = setInterval(_getJSON, 30000); //每半小時抓取一次新資料
}
//下雨 氣象meteorology  http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json
function _getRain() {
 
  clearTimeout(timerRain);
  //http://opendata2.epa.gov.tw/AQX.json--這網址好像是假資料?
  getJSON('http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$format=json', function(error, response) {
     if (!response) {return;}
    response.forEach(function(e, i) {
      rainData[i] = [];
      rainData[i][0] = e.SiteName;
      rainData[i][1] = e.Rainfall10min;
      rainData[i][2] = e.Rainfall1hr ;
      rainData[i][3] = e.Rainfall3hr ;
      rainData[i][4] = e.PublishTime ;
      console.log("Rain"+ e.SiteName);
    });
  });
  // if (rainData == ""){//取得資料失敗 三十秒重試
  //   timer = setInterval(_getRain, 30000);
  // }
  timerRain = setInterval(_getRain, 30000); //每半小時抓取一次新資料
}

function _getPM25Txt(txt) {//取得地區資料
  if (PM2_5.pm2_5.length == 0 ) {
    return common.replayMsg(event,"來源錯誤");
  }
  pm2_5.forEach(function(e, i) {
    if (txt.indexOf(e[0]) != -1) {
      return e[0] + ' PM2.5: ' + e[1]+'  ['+e[2]+']';
    }
  });
  return '請輸入正確的地點 如 "松山的PM2.5"';
};

function _getRainTxt(txt) {//取得地區資料
  if (rainData.length == 0 ) {
    return "來源錯誤";
  }
   rainData.forEach(function(e, i) {
    if (txt.indexOf(e[0]) != -1) {
      if (e[1] > 0) { 
        return e[0] + '正在下雨[' +e[4] + ']';
      }else if (e[2] > 0){
          return e[0] + '一小時內曾經下雨[' +e[4] + ']';
      }else if (e[3] > 0){
        return e[0] + '不久前曾經下雨[' +e[4] + ']';
      }else if (e[3] == 0){
        return e[0] + '沒有下雨[' +e[4] + ']';
      }else{
        console.log(e[3]);
        return '資料錯誤或該地區無資料';
      }
    }
  });
  return'請輸入正確的地點 如 "松山下雨"';
}

exports.pm2_5 =  pm2_5;
exports._getJSON =  _getJSON;
exports.rainData =  rainData;
exports._getRain =  _getRain;
exports._getPM25Txt =  _getPM25Txt;
exports._getRainTxt =  _getRainTxt;
