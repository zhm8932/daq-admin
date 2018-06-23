/**
 * Created by Administrator on 2016/7/13 0013.
 */
var qs = require('querystring');
exports.render_role_list = function (req,res) {
    var json = req.json;
    var query = req.query;
    res.locals.success = json.success;
    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.query = queryStr;

        res.render('system/role',{
            title:'角色管理_系统管理',
            content:'资源管理',
            data:json.data.data
        });
    }else{
        res.render('system/role',{
            title:'URL管理_资源管理',
            content:'资源管理',
            data:json
        });
    }
}

exports.render_user_list = function (req,res,next) {
    var json = req.json;
    res.locals.success = json.success;
    if(json.success){
        res.render('system/user',{
            title:'用户管理_系统管理',
            content:'资源管理',
            data:json.data.data
        });
    }else{
        res.render('system/user',{
            title:'用户管理_资源管理',
            content:'资源管理',
            data:json
        });
    }
}

exports.render_menu_tree = function (req,res,next) {
    var json = req.json;
    res.locals.success = json.success;
    if(json.success){
        res.render('system/role',{
            title:'角色管理_系统管理',
            content:'资源管理',
            data:json.data
        });
    }else{
        res.render('system/role',{
            title:'URL管理_资源管理',
            content:'资源管理',
            data:json
        });
    }
}

exports.render_url_list = function (req,res,next) {
    var json = req.json;

    res.locals.success = json.success;
    if(json.success){
        res.render('resource/url',{
            title:'URL管理_资源管理',
            content:'资源管理',
            data:json.data
        });
    }else{
        res.render('resource/url',{
            title:'URL管理_资源管理',
            content:'资源管理',
            data:json
        });
    }

}