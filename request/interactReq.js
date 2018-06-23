/**
 * Created by Administrator on 2016/4/29.
 */
// 互动管理
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
exports.get_consult_list = function (req, res, callback) {
    var query = req.query;
    var currentPage = query.page || 1;
    var bizParam = {
        "pageSize": query.pageSize || config.pageSize,
        "pageIndex": currentPage,
        "queryMessageHistoryCondition": {
            // fromUser: query.fromUser || '',
            // toUser:query.toUser || '',
            // msgSize:query.msgSize || '',
            // body:query.body || '',
            // chatType:query.chatType || '',
            // type:query.type || '',
            // id:query.id || '',
            // sentAt:query.toUser || '',
            // msgId:query.msgId || ''
        }
    };

    if(query.fromUser){bizParam.queryMessageHistoryCondition.fromUser = query.fromUser}
    if(query.toUser){bizParam.queryMessageHistoryCondition.toUser = query.toUser}

    util.ajax('get', api.MessageHistory,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.get_msg_his = function (req, res, callback) {
    var query = req.query;
    var currentPage = query.page || 1;
    var bizParam = {
        "pageSize": query.pageSize || config.pageSize,
        "pageIndex": currentPage,
        "user1": query.user1,
        "user2":query.user2
    };

    util.ajax('get', api.MsgHistoryBtUser,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

//得到当前用户列表
exports.consult_user_list = function (req, res, callback) {
    var query = req.query;
    var currentPage = query.page || 1;
    var bizParam = {
        "pageSize": query.pageSize || config.pageSize,
        "pageIndex": currentPage,
        "user":query.user
    };

    util.ajax('get', api.ConsultUsers,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.get_accountDtl_batch = function (req, res, callback) {
    var bizParam = {
        "accountIds": req.query.ids
    };

    util.ajax('get', api.AccountDtlBatch,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};