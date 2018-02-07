
var common=require("./common.js");
var request = require("request");
var cheerio = require("cheerio");
var getJSON = require('get-json'); //FOR PM2.5

var timer;
var pm2_5 =[];


function _getJSON() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    response.forEach(function(e, i) {
       //console.log("PM");
      pm2_5[i] = [];
      pm2_5[i][0] = e.SiteName;
      pm2_5[i][1] = e['PM2.5'] * 1;
      pm2_5[i][2] = e.PM10 * 1;
    });
  });
  console.log("PM");
  timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}
//下雨 氣象meteorology  http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json



exports.pm2_5 =  pm2_5;
exports._getJSON =  _getJSON;
