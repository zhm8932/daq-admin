/*
* 用户管理模块  user
* */
var express = require('express');
var router = express.Router();
var request = require('../request/userReq');
var qs = require('querystring')
var ScreeningReq = require('../request/screeningReq');

router.get('/visit',function (req,res,next) {
    res.render('user/visit',{
        title:'都安全用户管理_用户回访',
        content:'用户回访内容'
    })
});

router.get('/account(/list)?',function (req,res,next) {
    request.fetchUserDetailPage(req,res,function (json,success) {
        res.locals.success = success;
        if(success){
            var query = req.query;
            res.locals.pagecount = json.data.pageCount;
            res.locals.currentpage = query.page||1;
            res.locals.resultCount = json.data.resultCount;
            res.locals.pageSize = json.data.pageSize;
            res.locals.queryStr = req.query;
            delete query.page;
            var queryStr = qs.stringify(query)
            queryStr = queryStr?queryStr+='&':''
            res.locals.query = queryStr;
            res.render('user/account',{
                title: '都安全用户管理_账号管理',
                content: '账号管理内容',
                data: json.data.data,
                mobile: req.query.mobile||'',
                status: req.query.status||'',
            });
        }else{
            res.render('user/account',{
                title: '都安全用户管理_账号管理',
                content: '账号管理内容',
                data: json
            });
        }



    });
});

//账号详情
router.get('/account/detail/:accountId',
    ScreeningReq.get_my_order,
    ScreeningReq.get_my_book,
    ScreeningReq.get_my_register,
    request.get_my_contact,
    request.get_my_address,
    request.get_im_password,
    request.get_my_chats,
    function (req,res,next) {
        request.fetchAccountDetail(req,function (json,success) {
            // console.log('req:',req.query)
            // console.log('params:',req.params)
            // console.log('body:',req.body)
            res.render('user/user_detail',{
                title:'都安全用户管理_账号管理_账号详情',
                data:json.data
            });
    });
});

//改变账号状态
router.put('/account/change_statue',function (req,res,next) {
    request.changeAccountState(req,function (data,success) {
        res.send(data);
    });
});
router.post('/account/get_history_avatar',request.get_history_avatar);


module.exports = router;