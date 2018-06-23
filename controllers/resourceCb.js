/**
 * Created by Administrator on 2016/7/13 0013.
 */
var qs = require('querystring');
exports.render_menu_tree = function (req,res,next) {
    var json = req.json;
    res.locals.success = json.success;
    if(json.success){
        res.render('resource/menu',{
            title:'菜单管理_资源管理',
            content:'资源管理menu管理',
            data:json.data
        });
    }else{
        res.render('resource/menu',{
            title:'菜单管理_资源管理',
            content:'资源管理menu管理',
            data:json
        });
    }

};

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