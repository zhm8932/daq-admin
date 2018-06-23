/*
 * 系统管理路由  user
 * */
var express = require('express');
var router = express.Router();

var Request = require('../request/systemReq');
var SystemCb = require('../controllers/systemCb');
// var Authority = require('../controllers/authority');
var System = require('./system');

router.put('/role/update',System.loginRequired,Request.update_role);
router.put('/role/add',System.loginRequired,Request.add_role);
router.delete('/role/delete',System.loginRequired,Request.delete_role);

router.get('/role/byAcc',System.loginRequired,function (req,res,next) {
    res.send(data);
});

// router.get('/user',System.loginRequired,Request.get_user_list,SystemCb.render_user_list);

router.get('/authority',System.loginRequired,Request.get_menu_tree,SystemCb.render_menu_tree);

router.get('/role',System.loginRequired,function (req,res,next) {
    res.render('system/role',{
        title:'角色管理_角色管理',
        content:'角色管理角色页面'
    });
});

router.get('/role/list',System.loginRequired, function (req,res,next) {
    Request.GetRoleList(req,function(data,success){
        res.render('system/ajax_role',{
            data:JSON.parse(data).data,
            title:'角色管理_角色管理',
            content:'角色管理角色页面'
        },function(err, html) {
            if(err){
                console.log(err);
                res.send(err);
            }else{
                res.send(html);
            }
        });
    });
});

router.get('/get_role_list',System.loginRequired,Request.get_role_list);

router.get('/user',System.loginRequired,Request.get_role_list,function (req,res,next) {
    var query = req.query;
    console.log("query:",query);
    res.locals.query = query;

    res.render('system/user',{
        title:'系统管理_用户管理',
        content:'系统管理_用户管理'
    });
});

router.get('/user/list',System.loginRequired, function (req,res,next) {
    Request.GetUserList(req,function(data,success){
        res.locals.success = success;
        if(success){
            res.render('system/ajax_user',{
                data:JSON.parse(data).data
            },function(err,html){
                if(err){
                    console.log(err);
                    res.send(err);
                }
                res.send(html);
            });
        }else{
            res.render('system/ajax_user',{
                data:data
            });
        }

    });
});

//得到用户已分配的角色列表
router.get('/user/roleList',System.loginRequired,function (req,res,next) {
    Request.GetRoleListByUser(req,function(data,success){
        res.locals.success = success;
        console.log("success:",success)
        if(success){
            res.render('system/ajax_role_state',{
                data:JSON.parse(data).data
            });
        }else{
            res.render('system/ajax_role',{
                data:data
            });
        }

    });
});

//得到用户未分配的角色列表
router.get('/user/unassignedRolelist',System.loginRequired,function (req,res,next) {
    Request.GetUnAssignedRoleByUser(req,function(data,success){
        res.render('system/ajax_role',{
            data:JSON.parse(data).data
        });
    });
});

//给用户分配角色
router.post('/user/addRole',System.loginRequired,function (req,res,next) {
    Request.AddRoleForUser(req,function (data,success) {
        res.send(data);
    });
});

//给用户设置默认角色
router.post('/user/dftRole',System.loginRequired,function (req,res,next) {
    Request.SetDftRoleForUser(req,function (data,success) {
        res.send(data);
    });
});

//删除用户的角色
router.post('/user/delRole',System.loginRequired,function (req,res,next) {
    Request.DelRoleForUser(req,function (data,success) {
        res.send(data);
    });
});


router.post('/userAdd',System.loginRequired,function (req,res,next) {
    Request.AddUser(req,function (data,success) {
        res.send(data);
    });
});

router.post('/userModify',function (req,res,next) {
    Request.UpdateUser(req,function (data,success) {
        res.send(data);
    });
});

router.post('/userDel',System.loginRequired,function (req,res,next) {
    Request.DeleteUser(req,function (data, success) {
        res.send(data);
    });
});

router.post('/user/add',System.loginRequired,Request.add_user);
router.put('/user/update',System.loginRequired,Request.update_user);
router.put('/user/reset_password',System.loginRequired,Request.reset_password_user);
router.put('/user/change_status',System.loginRequired,Request.change_status_user);

module.exports = router;