/**
 * Created by James on 16/4/12.
 */
var url = require('url');
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
//菜单
exports.get_menu_tree = function (req, res, next) {
    var bizParam = req.query;
    util.ajax("GET", api.ResourcesFindAllMenusTree, req, bizParam, function (data, success) {
        //callback && callback(data,success);
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
};
exports.add_menu = function (req, res, next) {
    var body = req.body;
    var bizParam = {
        command: body
    };
    console.log("bizParambizParam:", bizParam);
    var apiName = api.ResourcesCreateMenuResource;
    if (body.parentId) {
        apiName = api.ResourcesCreateChildMenuResouceToParent;
    }
    util.ajax("POST", apiName, req, bizParam, function (data, success) {
        res.send(data)
    });
};
exports.update_menu = function (req, res, next) {
    var body = req.body
    var bizParam = {
        command: body
    };
    console.log("bizParambizParam:", bizParam)
    util.ajax("PUT", api.ResourcesChangeMenuResourceProps, req, bizParam, function (data, success) {
        res.send(data)
    });
};
exports.usable_menu = function (req, res, next) {
    var body = req.body
    var bizParam = {
        command: body
    };
    console.log("bizParambizParam:", bizParam)
    util.ajax("PUT", api.ResourcesChangeMenuResourceProps, req, bizParam, function (data, success) {
        res.send(data)
    });
};
exports.del_menu = function (req, res, next) {
    var body = req.body;
    var bizParam = {
        resourceIds: body.resourceId
    };
    console.log("bizParambizParam:", bizParam)
    util.ajax("delete", api.ResourcesTerminateMenuResources, req, bizParam, function (data, success) {
        res.send(data)
    });
};

exports.AddMenu = function (req, callback) {
    //接收页面传过来的数据
    var query = req.query;

    var bizParam = {
        "dictionaryDTO": query,
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    };

    util.ajax('POST', api.DictInsert, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.UpdateMenu = function (req, callback) {

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

exports.DeleteMenu = function (req, callback) {
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


exports.FetchMenuList = function (req, callback) {
    var bizParam = req.query;
    util.ajax("GET", api.MenuQuery, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


exports.ResourceMngGetUrlList = function (req, callback) {
    var bizParam = {
        "pageIndex": req.query.page || 1,//页码从0开始
        "pageSize": 10,
        "queryUrlAccessResourceCondition": {
            "category": "URL_ACCESS_RESOURCE",
            "nameLike": req.query.nameLike || '',
            "urlLike": req.query.urlLike || ''
        }
    };
    util.ajax("GET", api.ResourceMngGetUrlList, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.ResourceMngAddUrl = function (req, callback) {
    var bizParam = {
        command: req.body
    };
    util.ajax('POST', api.ResourceMngAddUrl, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.ResourceMngUpdateUrl = function (req, callback) {
    var bizParam = {
        command: req.body
    };
    util.ajax('PUT', api.ResourceMngUpdateUrl, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.ResourceMngDeleteUrl = function (req, callback) {
    var bizParam = req.body;
    util.ajax('DELETE', api.ResourceMngDeleteUrl, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};


exports.ResourceMngGetEleList = function (req, callback) {
    var bizParam = {
        "pageIndex": req.query.page || 1,
        "pageSize": 10,
        "queryPageElementResourceCondition": {
            "category": "PAGE_ELEMENT_RESOURCE",
            "nameLike": req.query.nameLike || '',
            "identifierLike": req.query.identifierLike || ''
        }
    };
    util.ajax("GET", api.ResourceMngGetEleList, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.ResourceMngAddEle = function (req, callback) {
    var bizParam = {
        command: req.body
    };
    util.ajax('POST', api.ResourceMngAddEle, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.ResourceMngUpdateEle = function (req, callback) {
    var bizParam = {
        command: req.body
    };
    util.ajax('PUT', api.ResourceMngUpdateEle, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.ResourceMngDeleteEle = function (req, callback) {
    var bizParam = req.body;
    util.ajax('DELETE', api.ResourceMngDeleteEle, req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};