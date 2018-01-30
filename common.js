
exports.replayMsg = function (event,msg,agree = false){
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

exports.replayImg = function (event,imgs,agree = false){
    if (agree == true && agreeID.indexOf(event.source.userId) == -1)
    {//agree == true 檢查權限 沒有權限則離開
        return ;
    }
    //取得隨機數
    var num = exports.randomNum(imgs.length)-1;

    console.log('random = '+num);
    //回傳圖片
    return event.reply({
    type: 'image',
    originalContentUrl: imgs[num],
    previewImageUrl: imgs[num]
    });
}

exports.template = function (event){
    //選擇方塊 測試中 未完成
    return event.reply({
    type: 'template',
    altText: 'this is a buttons template',
    template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        actions: [{
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123'
        }, {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123'
        }, {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123'
        }]
    }
});
}

exports.randomNum = function (max){
    //取得隨機數
    var num = Math.ceil(Math.random()*max);
    return num;
}
