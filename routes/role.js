/*
 * 数据字典模块  dataDic
 * */
var express = require('express');
var router = express.Router();
var request = require('../request/roleReq');
var System = require('./system');
var qs = require('querystring');


router.get('/role',System.loginRequired,function (req,res,next) {
    res.render('role/role',{
        title:'角色管理_角色',
        content:'角色管理角色页面'
    });
});

// router.get('/authority',System.loginRequired,function (req,res,next) {
//     res.render('role/authority',{
//         title:'角色管理_权限管理',
//         content:'角色管理权限页面'
//     });
// });
//
// router.get('/user',System.loginRequired,function (req,res,next) {
//     res.render('role/user',{
//         title:'角色管理_用户',
//         content:'角色管理用户页面'
//     });
// });

router.get('/roleAdd',System.loginRequired,function (req,res,next) {
    request.AddRole(req,function (data,success) {
        res.send(data);
    });
});

router.get('/roleModify',function (req,res,next) {
    request.UpdateRole(req,function (data,success) {
        res.send(data);
    });
});

router.get('/roleDel',System.loginRequired,function (req,res,next) {
    request.DeleteRole(req,function (data, success) {
        res.send(data);
    });
});

// router.get('/roleList',System.loginRequired,function (req,res,next) {
//     request.FetchRoleList(req,function (data,success) {
//         res.send(data);
//     });
// });


//查询整个菜单树,用于给角色分配菜单资源
router.get('/menu/list',System.loginRequired,function (req,res,next) {
    request.GetAllMenuTreeByRole(req,function(data,success){
        res.send(data);
    });
});

router.post('/menu/add',System.loginRequired,function (req,res,next) {
    request.AddMenuForRole(req,function (data,success) {
        res.send(data);
    });
});



router.get('/ele/list',System.loginRequired,function (req,res,next) {
    request.GetEleByRole(req,function(data,success){
        if (success) {
            var json = JSON.parse(data);
            var query = req.query;
            res.render('resource/ajax_element',{
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
        }else{
            res.render('error', {
                title: '页面元素管理',
                message: data,
                error:{}
            });
        }
    });
});

router.get('/ele/unassignedList',System.loginRequired,function (req,res,next) {
    request.GetUnassignedEleByRole(req,function(data,success){
        res.render('resource/ajax_element',{
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

router.post('/ele/add',System.loginRequired,function (req,res,next) {
    request.AddEleForRole(req,function (data,success) {
        res.send(data);
    });
});

router.post('/ele/del',System.loginRequired,function (req,res,next) {
    request.DelEleForRole(req,function (data,success) {
        res.send(data);
    });
});

router.get('/url/list',System.loginRequired,function (req,res,next) {
    request.GetURLByRole(req,function(data,success){
        if (success) {
            var json = JSON.parse(data);
            var query = req.query;
            res.render('resource/ajax_url', {
                data: json.data,
                title: '角色管理_角色管理',
                content: '角色管理角色页面'
            },function(err, html) {
                console.log(err);
                res.send(html);
            });
        }else{
            res.render('error', {
                title: 'url管理',
                message: data,
                error:{}
            });
        }
    });
});

router.get('/url/unassignedList',System.loginRequired,function (req,res,next) {
    request.GetUnassignedUrlByRole(req,function(data,success){
        res.render('resource/ajax_url',{
            data:JSON.parse(data).data,
            title:'角色管理_角色管理',
            content:'角色管理角色页面'
        },function(err, html) {
            console.log(err);
            res.send(html);
        });
    });
});

router.post('/url/add',System.loginRequired,function (req,res,next) {
    request.AddUrlForRole(req,function (data,success) {
        res.send(data);
    });
});

router.post('/url/del',System.loginRequired,function (req,res,next) {
    request.DelUrlForRole(req,function (data,success) {
        res.send(data);
    });
});



module.exports = router;


