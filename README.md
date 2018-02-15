
## 下載
node.js

## 安裝套件
* npm init
* npm install request cheerio fs nodemailer get-json mssql --save
* npm install linebot express --save
* npm install firebase --save
* npm install tedious async //azure DB

* 修改config.js 內的內容

## 執行bot的指令
node index.js

## 本機測試
* 打開
http://127.0.0.1:3000/
* 看到Hello World! 即執行成功

## SQL測試
* 修改index.js   db.selectAll('test',.... //test 改為要查詢的表名稱
* 打開 
http://127.0.0.1:3000/getsql
* 看到該表所有內容 即執行成功

## 建議

* 利用ngrok 架設
* 至官網依作業系統下載 ngrok 並解壓縮
* $ ngrok http 3000
* 即可看到Forwarding出現網址

## 參考資料
* https://simonhsu.blog/2017/01/25/%E4%B8%8D%E5%BF%85%E7%9C%9F%E7%9A%84%E6%9E%B6%E7%AB%99%E4%B9%9F%E8%83%BD-5-%E5%88%86%E9%90%98%E5%AF%A6%E6%A9%9F%E9%AB%94%E9%A9%97-line-bot-message-api-%E6%87%89%E7%94%A8-by-node-js-ngrok/
* http://www.oxxostudio.tw/articles/201701/line-bot.html

firebase
* https://chihpindu.wordpress.com/2016/08/25/firebase-%E5%88%A9%E7%94%A8node-js-%E8%A8%AD%E5%AE%9A%E3%80%81%E5%8F%96%E5%BE%97database%E8%B3%87%E6%96%99/

知呼爬蟲
* https://github.com/AnyISalIn/zhihu_fun
