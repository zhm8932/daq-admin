/*
* 首页  treat
* */
var express = require('express');
var router = express.Router();
var request = require('../request/indexReq');
var roleReq = require('../request/roleReq');
var userReq = require('../request/userReq');
var systemReq = require('../request/systemReq');
var authorityReq = require('../controllers/authority');
var app = express();
var System = require('./system');
var weixinSign = require('../lib/weixinSign');
var config = require('../config');
var async = require('async');

//必须放在检查权限get('*')前面:检查权限时必须登录,登录如果放在后面,那就死循环了。
router.get('/login',function(req,res){
    console.log('登录')
    res.render('login',{
        title:'都安全后台管理系统首页'
    });
});

//必须放在检查权限get('*')前面:获取微信配置不需要检查权限
router.get('/getweixinconfig',function(req,res){
    var url = req.query.url;
    request.Getweixinconfig(req,function (ticket) {
        if(ticket != "") {
            var result = weixinSign(ticket,url);
            result.appId = config.weixin_appId;
            console.log('===appId'+result.appId);
            console.log('===config:'+JSON.stringify(result));
            res.header("Access-Control-Allow-Origin", "*");
            res.send(result);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.send("");
        }
    });
});


router.use(function(req, res, next) {
    var _user = req.session.userInfo;
    if(_user){//如果已登录,每次请求首页都会动态从session获取值，并保存在本地变量中
        res.locals.account = _user.userAllInfo.accountCommon.account;
        req.accountId = res.locals.accountId = _user.userAllInfo.accountCommon.id;
        res.locals.menuData = req.session.menuData;

        //next();

        //判断用户是否有该权限
        roleReq.CheckUrlAuthorityByRole(req,function(data,success){
            var json = JSON.parse(data);
            if(success && json.data){
                next();
            }else{
                console.log("json:",json);
                var code = json.code;
                if(code==300){
                    res.format({
                        html:function () {
                            res.render('error',{
                                message:JSON.stringify(json),
                                error:{}
                            })
                        }
                    });
                    //next()
                }else {
                    res.format({
                        html:function(){
                            res.render('error', {
                                message: '抱歉,您没有权限访问：'+req.url,
                                // error:new Error('抱歉,您没有权限访问'+req.url)
                                error:{}
                            });
                        },
                        json:function(){
                            var errorJson = {code: code, msg: '抱歉,您没有权限访问'+req.url, success: false};
                            res.send(errorJson);
                        }
                    });
                }

                // next()
            }

        });
    }else{
        next();
    }
});

router.get('*',System.loginRequired,authorityReq.judgeEleAuthority);

/* GET home page. */
router.get('/', System.loginRequired,function(req, res, next) {
    //console.log('message in session: ');
    //console.log("Cookies值: ", req.cookies);
    res.locals.menuResourceMsg = req.cookies.menuResourceMsg||'';  //未获取到菜单资源
    res.render('index',{
        title:'都安全管理系统首页',
        content:'首页内容'
    });
});

router.post('/upload', function(req, res) {
    request.UploadImage(req,function (data,success) {
        if(success){
            res.send(data)
        }
    });
});



router.post('/login',function(req,res){
    request.Login(req,function (loginData,success) {
        var jsonLoginData = JSON.parse(loginData);
        res.cookie('menuResourceMsg','',{maxAge:0});
        if(success){
            req.session.userInfo = jsonLoginData.data;
            req.accountId = jsonLoginData.data.userAllInfo.accountCommon.id;

            //登录成功后获取该用户的角色,并根据默认角色获取该角色能访问的菜单资源,并保存在session中
            userReq.GetRolesByAcc(req,function(data,success){
                if(success){
                    var roleList = JSON.parse(data).data;
                    var defaultRole = '';
                    for(var i = 0; i < roleList.length; i++){
                        if(roleList[i].isDefault){
                            defaultRole = roleList[i];
                        }
                    }
                    if(!defaultRole){
                        defaultRole = roleList[roleList.length - 1];
                        jsonLoginData.data.noRole = true;
                        req.session.destroy();

                    }else{
                        req.session.currentRole = defaultRole;//把当前角色存入session中
                    }
                    req.query.roleId = defaultRole.id;
                    roleReq.GetMenuByRole(req,function(data,success){
                        if(success){
                            var json = JSON.parse(data);
                            if(req.session){
                                req.session.menuData = json.data;
                            }
                            // console.log("json.data:",json.data)
                            if(!json.data.length){
                                res.cookie('menuResourceMsg','你没有可访问的菜单资源')
                            }
                            res.send(JSON.stringify(jsonLoginData));
                        }else{
                            res.send(data);
                        }

                    });
                }else{
                    res.send(data);
                }

            });
        }else{
            res.send(loginData);
        }

    });
});



router.get('/admin/login',function (req,res,next) {
    req.session.destroy(function(){
        console.log('退出登录');
    });
    res.cookie('menuResourceMsg',null,{maxAge:0});
    res.redirect('/login');
});



module.exports = router;