/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');

exports.get_role_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage
    }

    util.ajax("GET",api.RolePagingQueryRoles,req,bizParam,function (data,success) {
        //callback && callback(data,success);
        var json = JSON.parse(data);
        if(query.bSend){
            res.send(json)
        }else{
            res.locals.get_role_list_success = json.success;
            req.json  = json;
            res.locals.get_role_list = {};
            if(json.success){
                res.locals.get_role_list=json.data.data
            }
            next()
        }

    });
};
exports.add_role = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        command:body
    };
    util.ajax("post",api.RoleCreate,req,bizParam,function (data,success) {
        res.send(data)
    });
}
exports.update_role = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        command:body
    };
    util.ajax("put",api.RoleChangeRoleProps,req,bizParam,function (data,success) {
        res.send(data)
    });
}
exports.delete_role = function (req,res,next) {
    var body = req.body;
    var bizParam = body;
    util.ajax("delete",api.RoleTerminateRoles,req,bizParam,function (data,success) {
        res.send(data)
    });
}

exports.get_user_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage
    }

    util.ajax("GET",api.RolePagingQueryRoles,req,bizParam,function (data,success) {
        //callback && callback(data,success);
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
};

exports.get_menu_tree = function (req,res,next) {
    var bizParam = req.query;
    util.ajax("GET",api.ResourcesFindAllMenusTree,req,bizParam,function (data,success) {
        //callback && callback(data,success);
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
};


exports.GetRoleList = function (req,callback) {
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": req.query.page || 1,
        "queryRoleCondition":{
            "descriptionLike":req.query.descriptionLike,
            "nameLike":req.query.nameLike
        }
    };

    util.ajax("GET",api.RolePagingQueryRoles,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.GetUserList = function (req,callback) {
    var query = req.query;
    console.log("query:",query);
    console.log("query:",typeof  query);

    var roleIds = query.roleIds?JSON.parse(query.roleIds):'';
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": req.query.page || 1,
        "condition":{
            "account":query.account,
            "nick":query.nick,
            "accountStatus":query.accountStatus,
            // "roleIds":JSON.parse(query.roleIds)
            "roleIds":roleIds
        }
    };

    if(!roleIds){
        delete  bizParam.condition.roleIds;
    }

    util.ajax("GET",api.GetUserList,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};



exports.GetRoleListByUser = function (req, callback) {
    var bizParam = {
        "pageIndex": req.query.page || 1,
        "pageSize": 10,
        "userId": req.query.userId
        // "queryPageElementResourceCondition":{}
    };
    util.ajax("GET", api.GetRoleListByUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.GetUnAssignedRoleByUser = function (req, callback) {
    var query = req.query;
    var bizParam = {
        "pageIndex": query.page || 1,
        "pageSize": 10,
        "userId": query.userId,
        "queryRoleCondition": {
            "version": query.version || "",
            "category": "",
            "description": query.description || "",
            "name": query.name || ""
        }
    };
    util.ajax("GET", api.GetUnAssignedRoleByUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.AddRoleForUser = function (req, callback) {
    var bizParam = req.body;
    util.ajax("POST", api.AddRoleForUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.SetDftRoleForUser = function (req, callback) {
    var bizParam = {
        "userId":req.body.userId,
        "roles":[
            {
                "roleId":req.body.roleId,
                "isDefault":"1" //是否默认角色,0否,1是，只能有一个默认角色
            }
        ]};
    util.ajax("POST", api.SetDftRoleForUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.DelRoleForUser = function (req, callback) {
    var bizParam = req.body;
    util.ajax("DELETE", api.DelRoleForUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.AddUser = function (req, callback) {
    //接收页面传过来的数据
    var query = req.query;

    var bizParam = {
        "dictionaryDTO": query,
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    }

    util.ajax('POST', api.AddUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.UpdateUser = function (req, callback) {

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

    util.ajax('PUT', api.UpdateUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });

};

exports.DeleteUser = function (req, callback) {
    //接收页面传过来的数据
    var query = req.query;

    var bizParam = {
        "ids": JSON.parse(query.ids),
        "operLogDTO": {"operName": "nnn", "operId": "1"}
    };

    util.ajax('DELETE', api.DeleteUser, req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.add_user = function (req,res,next) {
    var body = req.body;
    body.operatorId = req.accountId;
    var bizParam = {
        addAdminRequest:body
    };
    util.ajax("post",api.UserAdminAddForAdmin,req,bizParam,function (data,success) {
        res.send(data)
    });
}
exports.update_user = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        updateAdminRequest:body
    };
    util.ajax("put",api.UserAdminUpdateForAdmin,req,bizParam,function (data,success) {
        res.send(data)
    });
}

exports.reset_password_user = function (req,res,next) {
    var body = req.body;
    var bizParam = body;
    util.ajax("put",api.UserAdminPasswordResetForAdmin,req,bizParam,function (data,success) {
        res.send(data)
    });
}

exports.change_status_user = function (req,res,next) {
    var body = req.body;
    var bizParam = body;
    util.ajax("put",api.UserAccountStatusChange,req,bizParam,function (data,success) {
        res.send(data)
    });
}
