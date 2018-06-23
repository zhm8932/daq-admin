/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var url = require('url');

exports.AddRole = function (req, callback) {
    //接收页面传过来的数据
    var query = req.query;

    var bizParam = {
        "dictionaryDTO": query,
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    }

    util.ajax('POST', api.DictInsert, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.UpdateRole = function (req, callback) {

    var query = req.query;

    if (query.name) {
        query.name = encodeURI(query.name);
    }

    if (query.description) {
        query.description = encodeURI(query.description);
    }

    query.displayOrder = "1";

    var bizParam = {
        "dictionaryDTO": query,
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    };

    util.ajax('PUT', api.DictUpdate, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });

};

exports.DeleteRole = function (req, callback) {
    //接收页面传过来的数据
    var query = req.query;

    var bizParam = {
        "ids": JSON.parse(query.ids),
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    };

    util.ajax('DELETE', api.DictDelete, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


exports.FetchRoleList = function (req, callback) {
    var bizParam = req.query;
    util.ajax("GET", api.QueryDictionaryListByTypeAndLevel, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


exports.GetMenuByRole = function (req, callback) {
    var bizParam = {
        roleId: req.query.roleId,
        accountId: req.accountId
    };
    util.ajax("GET", api.GetMenuByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.CheckUrlAuthorityByRole = function (req, callback) {
    var bizParam = {
        roleId: req.session.currentRole.id,
        accountId: req.accountId,
        url: url.parse(req.url).pathname
    };
    util.ajax("GET", api.CheckUrlAuthorityByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.CheckEleAuthorityByRole = function (req, callback) {
    var bizParam = {
        roleId: req.session.currentRole.id,
        accountId: req.accountId,
        resourceIdentifiers: req.elementsList
    };
    util.ajax("GET", api.CheckEleAuthorityByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


exports.GetAllMenuTreeByRole = function (req, callback) {
    var bizParam = req.query;
    util.ajax("GET", api.GetAllMenuTreeByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.AddMenuForRole = function (req, callback) {
    var bizParam = req.body;
    util.ajax("POST", api.AssignMenuForRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


exports.GetEleByRole = function (req, callback) {
    var query = req.query;
    var bizParam = {
        "pageIndex": query.page || 1,
        "pageSize": query.pageSize || config.AuthorityPageSize,
        "roleId": query.roleId,
        "queryPageElementResourceCondition":{
            "category": "PAGE_ELEMENT_RESOURCE",
            "nameLike": query.nameLike || '',
            "identifierLike": query.identifierLike || ''
        }
    };
    util.ajax("GET", api.GetEleByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.GetUnassignedEleByRole = function (req, callback) {
    var query = req.query;
    var bizParam = {
        "pageIndex": query.page || 1,
        "pageSize": query.pageSize || config.AuthorityPageSize,
        "roleId": query.roleId,
        "queryPageElementResourceCondition": {
            "version": query.version || "",
            "category": "PAGE_ELEMENT_RESOURCE",
            "nameLike": query.nameLike || '',
            "identifierLike": query.identifierLike || ''
        }
    };
    util.ajax("GET", api.GetUnassignedEleByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.AddEleForRole = function (req, callback) {
    var bizParam = req.body;
    util.ajax("POST", api.AddEleForRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.DelEleForRole = function (req, callback) {
    var bizParam = req.body;
    util.ajax("DELETE", api.DelEleForRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.GetURLByRole = function (req, callback) {
    var query = req.query;
    var bizParam = {
        "pageIndex": query.page || 1,
        "pageSize": query.pageSize || config.AuthorityPageSize,
        "roleId": query.roleId,
        "queryUrlAccessResourceCondition": {
            "version": query.version || "",
            "category": "URL_ACCESS_RESOURCE",
            "nameLike": query.nameLike || '',
            "urlLike": query.urlLike || ''
        }
    };
    util.ajax("GET", api.GetURLByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.GetUnassignedUrlByRole = function (req, callback) {
    var query = req.query;
    var bizParam = {
        "pageIndex": query.page || 1,
        "pageSize": query.pageSize || config.AuthorityPageSize,
        "roleId": query.roleId,
        "queryUrlAccessResourceCondition": {
            "version": query.version || "",
            "category": "URL_ACCESS_RESOURCE",
            "nameLike": query.nameLike || '',
            "urlLike": query.urlLike || ''
        }
    };
    util.ajax("GET", api.GetUnassignedUrlByRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.AddUrlForRole = function (req, callback) {
    var bizParam = req.body;
    util.ajax("POST", api.AddUrlForRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.DelUrlForRole = function (req, callback) {
    var bizParam = req.body;
    util.ajax("DELETE", api.DelUrlForRole, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

