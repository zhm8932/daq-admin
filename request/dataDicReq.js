/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');

exports.AddDataDict = function (req,callback) {
    //接收页面传过来的数据
    var query = req.body;
    //排序必须传
    if(!query.displayOrder){
        query.displayOrder = 1;
    }

    query.activeState = 2;

    var bizParam= {
        "dictionaryDTO":query,
        "operLogDTO":{"operName":req.session.userInfo.userAllInfo.accountCommon.account,"operId":req.accountId}
    };

    util.ajax('POST',api.DictInsert,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.UpdateDataDict = function (req,callback) {

    var query = req.body;

    var bizParam= {
        "dictionaryDTO":query,
        "operLogDTO":{"operName":req.session.userInfo.userAllInfo.accountCommon.account,"operId":req.accountId}
    };

    util.ajax('PUT',api.DictUpdate,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });

};

exports.UpdateDictState = function (req,callback) {

    var query = req.body;

    var bizParam= {
        "id":query.id,
        "activeState":query.activeState,
        "operLogDTO":{"operName":req.session.userInfo.userAllInfo.accountCommon.account,"operId":req.accountId}
    };

    util.ajax('PUT',api.UpdateDictState,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });

};

exports.UpdateDictOnlineState = function (req,callback) {
    var query = req.body;
    var bizParam= {
        "id":query.id,
        "isOnline":query.isOnline,
        "operLogDTO":{"operName":req.session.userInfo.userAllInfo.accountCommon.account,"operId":req.accountId}
    };

    util.ajax('PUT',api.UpdateDictOnlineState,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });

};


exports.DeleteDataDict = function (req,callback) {
    //接收页面传过来的数据
    var query = req.body;

    var bizParam= {
        "ids":JSON.parse(query.ids),
        "operLogDTO":{"operName":req.session.userInfo.userAllInfo.accountCommon.account,"operId":req.accountId}
    };

    util.ajax('DELETE',api.DictDelete,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.FetchDataDictList = function (req,callback) {
    var bizParam={
        "activeState":req.query.activeState || ""
    };
    var type = req.query.type;
    if(type){
        bizParam.type = type;
    }

    util.ajax('GET',api.QueryDictionaryTreeByType,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.FetchDataDictCategory = function (req,callback) {
    var bizParam = req.query;
    util.ajax("GET",api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};