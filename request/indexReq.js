/**
 * Created by James on 16/4/12.
 */

var util = require('../lib/ajax');
var api = require('../lib/api');
var crypto = require('crypto');
var config = require('../config');
var globalWeixin = require('./globalWeixin');

exports.UploadImage = function (req,callback) {
    var body = req.body
    console.log('req.businessId:',req.body)
    var businessId = body.businessId
    var bizParam = {
        "command": {
            "rawRequest": {
                "fileType": 1,
                "appId": "DAQ-WebPage",  //从都安全网页端注册的用户
                ///"fileName": "1452580879.jpg",
                "fileName": "1.jpg",
                "businessId": businessId   //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
            }
        }
    };

    var fileName = body.fileName;
    if(typeof fileName=='object'){
        fileName.forEach(function(str,index){
            bizParam.command.rawRequest.fileName = str || '1.jpg';
            //obj.command = JSON.stringify(bizParam.command)
            console.log('bizParam:',bizParam)

        })
    }

    util.ajax('GET',api.FileWebToken,req,bizParam,function (data,success) {
        console.log('图片上传');
        console.log(data);
        callback && callback(data,success);
    });

};

exports.Login = function (req,callback) {
    // console.log('crypto:',crypto)
    var body = req.body
    var password = body.password
    var content = 'password'
    var md5 = crypto.createHash('md5');
    md5.update(password);
    var d = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99


    // console.log('d:',d)
    var bizParam = {
        "req": {
            "rawRequest": {
                "account": body.account,
                "password":password

            }
        }
    };
    util.ajax('POST',api.Login,req,bizParam,function (data,success) {
        // var data = JSON.parse(data)
       callback && callback(data,success);
    });

};


// exports.GetglobalWeixin = function (req,callback) {
//     if(req.session.weixin_access_token){
//         getJsapiTicket(req,req.session.weixin_access_token,callback);
//     }else{
//         util.reqOther({
//             moduleName:'https',
//             hostname:'api.weixin.qq.com',
//             port:'',
//             path:'/cgi-bin/token',
//             param:'grant_type=client_credential&appid='+config.weixin_appId+'&secret='+config.weixin_secret,
//             method:'GET'
//         },function(body,success){
//             console.log('===请求1:'+success,'请求结果:'+body);
//             if(success){
//                 var json = JSON.parse(body);
//                 req.session.weixin_access_token = json.access_token;
//                 getJsapiTicket(req,json.access_token,callback);
//             }else{
//                 callback && callback(body,success);
//             }
//         });
//     }
//     // getJsapiTicket('N5vKWNe_t7da6muQBHlpG52KqhrtfBewYeRkUnDeHj7C0jLW9940iYF3jsbkGxDJxEpjprF3J-tkx1kP1o9TPIH4FgvWBSqzh8DS-eCncK6sqOxzjXwKjvHt16_yfw6YPTPgABADHD',callback);
// };
//
// function getJsapiTicket(req,token,callback){
//     if(req.session.weixin_jsapi_ticket) {
//         var json = {'ticket':req.session.weixin_jsapi_ticket};
//         callback && callback(JSON.stringify(json), true);
//     }else{
//         util.reqOther({
//             moduleName: 'https',
//             hostname: 'api.weixin.qq.com',
//             port: '',
//             path: '/cgi-bin/ticket/getticket',
//             param: 'access_token=' + token + '&type=jsapi',
//             method: 'GET'
//         }, function (body, success) {
//             console.log('===请求2:' + success, '请求结果:' + body);
//             callback && callback(body, success);
//         });
//     }
// }


//获取微信config
exports.Getweixinconfig = function (req,callback) {
    if(globalWeixin.getTicket()!=""){
        callback && callback(globalWeixin.getTicket());
    }
    else if(globalWeixin.getToken()!=""){
        getJsapiTicketTwice(globalWeixin.getToken(), callback);
    }else{
        getAccessToken(function () {
            getJsapiTicketTwice(globalWeixin.getToken(), callback);
        });
    }
    // getJsapiTicket('N5vKWNe_t7da6muQBHlpG52KqhrtfBewYeRkUnDeHj7C0jLW9940iYF3jsbkGxDJxEpjprF3J-tkx1kP1o9TPIH4FgvWBSqzh8DS-eCncK6sqOxzjXwKjvHt16_yfw6YPTPgABADHD',callback);
};

//获取微信token
function getAccessToken(callback) {
    util.reqOther({
        moduleName:'https',
        hostname:'api.weixin.qq.com',
        port:'',
        path:'/cgi-bin/token',
        param:'grant_type=client_credential&appid='+config.weixin_appId+'&secret='+config.weixin_secret,
        method:'GET'
    },function(body,success){
        console.log('===请求1:'+success,'请求结果:'+body);
        var json = JSON.parse(body);
        globalWeixin.setToken(json.access_token, json.expires_in);
        callback && callback();
    });
}
//获取微信ticket
//两次获取ticket以防token过期
function getJsapiTicketTwice(token,callback){
    util.reqOther({
        moduleName:'https',
        hostname:'api.weixin.qq.com',
        port:'',
        path:'/cgi-bin/ticket/getticket',
        param:'access_token='+token+'&type=jsapi',
        method:'GET'
    },function(body,success){
        console.log('===请求2:'+success,'请求结果:'+body);
        var json = JSON.parse(body);
        if(json.errcode == '0') {
            globalWeixin.setTicket(json.ticket, json.expires_in);
            callback && callback(globalWeixin.getTicket());
        } else {
            getAccessToken(function () {
                getJsapiTicketOnce(globalWeixin.getToken(), callback);
            });
        }
    });
}
//只单次获取ticket以防死循环，傻做法。。。
function getJsapiTicketOnce(token,callback){
    util.reqOther({
        moduleName:'https',
        hostname:'api.weixin.qq.com',
        port:'',
        path:'/cgi-bin/ticket/getticket',
        param:'access_token='+token+'&type=jsapi',
        method:'GET'
    },function(body,success){
        console.log('===请求2:'+success,'请求结果:'+body);
        var json = JSON.parse(body);
        globalWeixin.setTicket(json.ticket, json.expires_in);
        callback && callback(globalWeixin.getTicket());
    });
}