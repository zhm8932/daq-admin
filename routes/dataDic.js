/*
* 数据字典模块  dataDic
* */
var express = require('express');
var router = express.Router();
var request = require('../request/dataDicReq');
var System = require('./system');



// router.get('/dataDicView',System.loginRequired,function (req,res,next) {
//     var dicType = req.query.dicType || 'goods_category';
//     var isShowPages = req.query.isShowPages || 'false';
//     res.render('sysSetting/dataDic',{
//         title:'数据字典_业务数据',
//         content:'数据字典_业务数据',
//         data:{"dicType":dicType,"isShowPages":isShowPages}
//     });
// });

router.get('/biz/view',System.loginRequired,function (req,res,next) {
    req.query.type = 'DAQ-ROOT';
    request.FetchDataDictList(req,function (data,success) {
        var json = JSON.parse(data);
        res.render('dataDic/bizData',{
            title:'数据字典_业务数据',
            content:'数据字典_业务数据',
            data:json.data
        });
    });
});


router.get('/root/view',System.loginRequired,function (req,res,next) {
    res.render('dataDic/rootData',{
        title:'数据字典_根节点设置',
        content:'数据字典_根节点设置',
        data:{}
    });
});

router.post('/add',System.loginRequired,function (req,res,next) {
    request.AddDataDict(req,function (data,success) {
        res.send(data);
    });
});

router.post('/updateState',function (req,res,next) {
    request.UpdateDictState(req,function (data,success) {
        res.send(data);
    });
});

router.post('/updateOnlineState',function (req,res,next) {
    request.UpdateDictOnlineState(req,function (data,success) {
        res.send(data);
    });
});

router.post('/update',function (req,res,next) {
    request.UpdateDataDict(req,function (data,success) {
        res.send(data);
    });
});

router.post('/del',System.loginRequired,function (req,res,next) {
    request.DeleteDataDict(req,function (data, success) {
        res.send(data);
    });
});

router.get('/list',System.loginRequired,function (req,res,next) {
    request.FetchDataDictList(req,function (data,success) {
        res.send(data);
    });
});

router.get('/category',System.loginRequired,function (req,res,next) {
    request.FetchDataDictCategory(req,function (data,success) {
        res.send(data);
    });
});

module.exports = router;


