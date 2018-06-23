/*
 * 互动管理 interact
 * */
var express = require('express');
var router = express.Router();

var Request = require('../request/interactReq');
var System = require('./system');

router.get('/consultUser',System.getCurrentUser,function(req,res,next) {
    Request.consult_user_list(req,res,function (data,success){
        if(success){
            var json = JSON.parse(data);
            var query = req.query;
            res.locals.pagecount=json.data.pageCount;
            res.locals.currentpage = req.query.page||1;
            res.locals.imToken = req.session.userInfo.imToken;
            // delete query.page;
            // var queryStr = '';
            // for(var attr in query){
            //     queryStr += attr + '=' + query[attr] + '&';
            // }
            // res.locals.query = queryStr;
            // res.locals.category = query.category || '1';
            // res.locals.tc = query.tc || '';
            if(query.queryDataType == 'json'){
                res.send(JSON.stringify(json));
            }else{
                res.render('interact/consult',{
                    title:'互动管理_指定医生咨询',
                    content:'指定医生咨询页面内容',
                    data:json.data.data
                })
            }
        }else{
            res.send(data);
        }
    });
});

router.get('/getAccountDtlBatch',function(req,res,next) {
    Request.get_accountDtl_batch(req,res,function (data,success){
        res.send(data);
    });
});


router.get('/consultHis',function(req,res,next) {
    Request.get_msg_his(req,res,function (data,success){
        if(success){
            var json = JSON.parse(data);
            var query = req.query;
            res.locals.pagecount=json.data.pageCount;
            res.locals.currentpage = req.query.page||1;
            delete query.page;
            var queryStr = '';
            for(var attr in query){
                queryStr += attr + '=' + query[attr] + '&';
            }
            res.locals.query = queryStr;
            if(query.queryDataType == 'json'){
                res.send(JSON.stringify(json));
            }else{
                res.render('interact/consult',{
                    title:'互动管理_指定医生咨询',
                    content:'指定医生咨询页面内容',
                    data:json.data.data
                })
            }
        }else{
            res.send(data);
        }
    });
});

router.get('/consult',System.loginRequired,System.getCurrentUser,function(req,res,next) {
    Request.get_consult_list(req,res,function (data,success){
        if(success){
            var json = JSON.parse(data);
            var query = req.query;
            res.locals.pagecount=json.data.pageCount;
            res.locals.currentpage = req.query.page||1;
            delete query.page;
            var queryStr = '';
            for(var attr in query){
                queryStr += attr + '=' + query[attr] + '&';
            }
            res.locals.query = queryStr;
            // res.locals.category = query.category || '1';
            // res.locals.tc = query.tc || '';
            if(query.queryDataType == 'json'){
                res.send(JSON.stringify(json));
            }else{
                res.render('interact/consult',{
                    title:'互动管理_指定医生咨询',
                    content:'指定医生咨询页面内容',
                    data:json.data.data
                })
            }
        }else{
            res.send(data);
        }
    });
});


router.get('/ask',function (req,res,next) {
    res.render('interact/ask',{
        title:'互动管理_快速提问',
        content:'快速提问页面内容'
    })
});

router.get('/service',function (req,res,next) {
    res.render('interact/ask',{
        title:'互动管理_服务台',
        content:'服务台页面内容'
    })
});
module.exports = router;
