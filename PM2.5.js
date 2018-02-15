
var common=require("./common.js");
var request = require("request");
var cheerio = require("cheerio");
var getJSON = require('get-json'); //FOR PM2.5
var db=require("./sql.js");

var timer,timerRain;
var pm2_5 =[];
var rainData =[];

function _getJSON() {
  console.log("PM25");
  clearTimeout(timer);
  getJSON('http://opendata.epa.gov.tw/ws/Data/ATM00625/?$format=json', function(error, response) {
    if (error || !response) {
      setInterval(_getJSON, 60000);//失敗60S重試
      console.log(error);
      return;
    }
    response.forEach(function(e, i) {
      pm2_5[i] = e;
      pm2_5[i][0] = e.Site;
      pm2_5[i][1] = e.PM25;
      pm2_5[i][2] = e.DataCreationDate;
    });
    insertPM25(response);
  });
  timer = setInterval(_getJSON, 1800000); //每30分抓取一次新資料
}

function insertPM25(arr){//PM25 存入sql
  var values = '';
  arr.forEach(function(e, i) {
    values = values  + 
    ' (\''+e.Site+'\',\''+e.county+'\',\''+e.PM25+'\',\''+e.DataCreationDate+'\',\''+e.ItemUnit+'\') , ';
  });
  values = values.substring(0, values.lastIndexOf(',') )+ '; ';  //去掉最後的逗號加上分號
  //console.log("values:"+values);
  
  db.querySql('insert into [dbo].[PM25] '+ 'values ' + values ,
    '',
    function (err, result) { 
        console.log('PM25 err:  '+err);
  });

}

function _getPM25Txt(txt) {//取得地區資料
  var msg = "";
  if (pm2_5.length == 0 ) {
    return "來源錯誤";
  }
  pm2_5.forEach(function(e, i) {
    if (txt.indexOf(e[0]) != -1) {
      msg =  e[0] + ' PM2.5: ' + e[1]+'  ['+e[2]+']';
    }
  });
  if (msg !=""){
    return msg;
  }else{
    return '請輸入正確的地點 如 "松山的PM2.5"';
  }
};

function _getPM25FormSql(event,txt) {//資料庫取得地區資料 直接回傳訊息
  var key = txt.replace('PM2.5', '').replace('pm2.5', '').trim();
  var msg = "";
  db.querySql('SELECT TOP 1 * FROM [dbo].[PM25]'+
      ' where [Site] like \'%'+key+'%\''+
      ' order by [DataCreationDate] desc',
    '',
    function (err, result) { 
      var e = result.recordset[0];
      if (e){
        msg =  e.Site + ' PM2.5: ' + e.PM25+'  ['+e.DataCreationDate+']';
      }else{
        msg =  '資料錯誤或該地區無資料';
      }
      return common.replayMsg(event,msg);
  });
};


//下雨 氣象meteorology  http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json
function _getRain() {
 console.log("Rain");
  clearTimeout(timerRain);
  getJSON('http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$format=json', function(error, response) {
    if (error || !response) {
      setInterval(_getRain , 60000);//失敗60S重試
      console.log(error);
      return; 
    }
    response.forEach(function(e, i) {
      rainData[i] = e;
      rainData[i][0] = e.SiteName;
      rainData[i][1] = e.Rainfall10min;
      rainData[i][2] = e.Rainfall1hr ;
      rainData[i][3] = e.Rainfall3hr ;
      rainData[i][4] = e.PublishTime ;
    });
    insertRain(response);
  });
  
  // if (rainData == ""){//取得資料失敗 三十秒重試
  //   timer = setInterval(_getRain, 30000);
  // }
  timerRain = setInterval(_getRain, 1800000); //每30分抓取一次新資料
}

function insertRain(arr){//rain 存入sql
  // [{"SiteId":"120570","SiteName":"嘉南水利","County":"臺南市",
  // "Township":"學甲區","TWD67Lon":"120.1627","TWD67Lat":"23.2350",
  // "Rainfall10min":"0","Rainfall1hr":"0","Rainfall3hr":"0",
  // "Rainfall6hr":"0","Rainfall12hr":"0","Rainfall24hr":"0",
  // "Now":"0","Unit":"局屬合作測站","PublishTime":"2018-02-15 14:20:00"}
  var values = '';
  arr.forEach(function(e, i) {
    values = values  + 
    ' (\''+e.SiteId+'\',\''+e.SiteName+'\',\''+e.County+'\',\''+
    e.Township+'\',\''+e.TWD67Lon+'\',\''+e.TWD67Lat+'\',\''+
    e.Rainfall10min+'\',\''+e.Rainfall1hr+'\',\''+e.Rainfall3hr+'\',\''+
    e.Rainfall6hr+'\',\''+e.Rainfall12hr+'\',\''+e.Rainfall24hr+'\',\''+
    e.Now+'\',\''+e.Unit+'\',\''+e.PublishTime+'\') , ';
  });
  values = values.substring(0, values.lastIndexOf(',') )+ '; ';  //去掉最後的逗號加上分號
  //console.log("values:"+values);
  
  db.querySql('insert into [dbo].[rain] '+ 'values ' + values ,
    '',
    function (err, result) { 
        console.log('Rain err:  '+err);
  });

}

function _getRainTxt(txt) {//取得地區資料
  var msg = "";
  if (rainData.length == 0 ) {
    return "來源錯誤";
  }
   rainData.forEach(function(e, i) {
    if (txt.indexOf(e[0]) != -1) {
      if (e[1] > 0) { 
        msg =  e[0] + '正在下雨[' +e[4] + ']';
      }else if (e[2] > 0){
        msg =  e[0] + '一小時內曾經下雨[' +e[4] + ']';
      }else if (e[3] > 0){
        msg =  e[0] + '不久前曾經下雨[' +e[4] + ']';
      }else if (e[3] == 0){
        msg =  e[0] + '沒有下雨[' +e[4] + ']';
      }else{
        msg =  '資料錯誤或該地區無資料';
      }
    }
  });
  if (msg !=""){
    return msg;
  }else{
  return'請輸入正確的地點 如 "松山下雨"';
  }
}
function _getRainFormSql(event,txt) {//資料庫取得地區資料 直接回傳訊息
  var key = txt.replace('下雨', '').replace('rain', '').trim();
  var msg = "";
  db.querySql('SELECT TOP 1 * FROM [dbo].[rain]'+
      ' where [SiteName] like \'%'+key+'%\''+
      ' order by [PublishTime] desc',
    '',
    function (err, result) { 
      console.log('Rain err:  '+err);
      console.log('Rain result:  '+result);
      var e = result.recordset[0];
      if (e){
        if (e.Rainfall10min > 0) { 
          msg =  e.SiteName + '正在下雨[' +e.PublishTime + ']';
        }else if (e.Rainfall1hr > 0){
          msg =  e.SiteName + '一小時內曾經下雨[' +e.PublishTime + ']';
        }else if (e.Rainfall3hr > 0){
          msg =  e.SiteName + '不久前曾經下雨[' +e.PublishTime + ']';
        }else if (e.Rainfall3hr == 0){
          msg =  e.SiteName + '沒有下雨[' +e.PublishTime + ']';
        }else{
          msg =  '資料錯誤或該地區無資料';
        }
      }else{
        msg =  '資料錯誤或該地區無資料';
      }
      return common.replayMsg(event,msg);
  });
};

exports.pm2_5 =  pm2_5;
exports.rainData =  rainData;
exports._getJSON =  _getJSON;
exports._getRain =  _getRain;
exports._getPM25Txt =  _getPM25Txt;
exports._getRainTxt =  _getRainTxt;
exports._getPM25FormSql =  _getPM25FormSql;
exports._getRainFormSql =  _getRainFormSql;
