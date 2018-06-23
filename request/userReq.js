/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var qs = require('querystring')
exports.fetchUserDetailPage = function (req,res,callback) {

    var currentPage = req.query.page||1;
    var mobile = req.query.mobile||'';
    var status = req.query.status||'';
    var query = req.query;

    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "condition":{}
    }

    for(var key in query){
        if(query[key]){
            bizParam.condition[key] = query[key]
        }
    }
    // console.log("query:",query)

    // if(mobile&&!status){
    //     bizParam.condition = '{"mobile":'+mobile+'}'
    // }else if(status&&!mobile){
    //     bizParam.condition = '{"accountStatus":"'+status+'"}'
    // }else if(mobile&&status){
    //     bizParam.condition = '{"mobile":'+mobile+',"accountStatus":"'+status+'"}'
    // }

    // if(query){
    //     for(var key in query){
    //         console.log(key,":--------:",query[key])
    //         if(query[key]){
    //             bizParam.condition[key] = query[key]
    //
    //         }
    //     }
    // }


    // console.log('bizParam:::',bizParam)

    util.ajax('GET',api.UserDetailPage,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        //delete query.page;
        //var queryStr = qs.stringify(query)
        //queryStr = queryStr?queryStr+='&':''
        //res.locals.query = queryStr;
        //res.locals.pagecount = json.data.pageCount;
        //res.locals.currentpage = currentPage;
        callback && callback(json,success);
    });
    
};

exports.fetchAccountDetail = function (req,callback) {
    var bizParam = {accountId:req.params.accountId};
    util.ajax('GET',api.UserDetailGet,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        callback && callback(json,success);
    });
};

exports.changeAccountState = function (req,callback) {
    var bizParam = {
        "accountId": req.body.accountId,
        "accountStatus": req.body.status
    };
    util.ajax('PUT',api.AccountStatusChange,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.get_my_contact = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId};
    var query = req.query;
    var type = query.type;
    res.locals.type=type;
    if(type=='contact'){
        util.ajax('GET',api.ContactPersonList,req,bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_my_contact_success=json.success;
            req.get_my_contact = json;
            res.locals.get_my_contact = json.data;
            next();
        });
    }else{
        next();
    }

}
exports.get_my_address = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId};
    var query = req.query;
    var type = query.type;
    res.locals.type=type;
    if(type=='address'){
        util.ajax('GET',api.AddressList,req,bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_my_address_success=json.success;
            req.get_my_address = json;
            res.locals.get_my_address = json.data;
            next();
        });
    }else{
        next();
    }

}

exports.get_im_password = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId};

    var query = req.query;
    var type = query.type;
    res.locals.type=type;

    if(type=='chats'){
        util.ajax('GET',api.ImPasswordGet,req,bizParam,function (data,success) {
            var json = JSON.parse(data);
            console.log("get_im_password:",json)
            res.locals.imToken = json.data;
            next();
        });
    }else{
        next();
    }




}

exports.get_history_avatar = function (req,res,next) {
    var bizParam = req.body;
    util.ajax('GET',api.UserAvatarHistory,req,bizParam,function (data,success) {
        res.send(data);
    });
};

//得到当前用户列表
exports.get_my_chats = function (req, res, next) {
    var query = req.query;
    var type = query.type;
    var currentPage = query.page || 1;
    var accountId = req.params.accountId;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "user":accountId
    };
    if(type=='chats'){
        util.ajax('get', api.ConsultUsers,req, bizParam, function (data, success) {
            var json = JSON.parse(data);
            res.locals.get_my_chats_success=json.success;
            req.get_my_chats = json;
            res.locals.get_my_chats = json.data.data;
            next();
        });
    }else{
        next();
    }
};


exports.GetRolesByAcc = function (req,callback) {
    var bizParam = {
        accountId:req.accountId
    };
    util.ajax("GET",api.GetRolesByAcc,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};