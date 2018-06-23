/*
 * 数据字典模块  dataDic
 * */
var express = require('express');
var router = express.Router();
var request = require('../request/resourceReq');
var ResourceCb = require('../controllers/resourceCb');
var System = require('./system');
var qs = require('querystring');


router.get('/menu', System.loginRequired, request.get_menu_tree, ResourceCb.render_menu_tree);
router.post('/menu/add', System.loginRequired, request.add_menu);
router.put('/menu/update', System.loginRequired, request.update_menu);
router.put('/menu/usable', System.loginRequired, request.usable_menu);
router.put('/menu/delete', System.loginRequired, request.del_menu);

// router.get('/url',System.loginRequired,Request.get_url_list,ResourceCb.render_url_list);
// router.post('/url/add',System.loginRequired,Request.add_url);


router.get('/url', System.loginRequired, function (req, res, next) {
    request.ResourceMngGetUrlList(req, function (data, success) {
        if (success) {
            var json = JSON.parse(data);
            if (success) {
                var query = req.query;
                res.locals.pagecount = json.data.pageCount;
                res.locals.currentpage = query.page || 1;
                delete query.page;
                var queryStr = qs.stringify(query);
                queryStr = queryStr ? queryStr += '&' : '';
                res.locals.query = queryStr;
                //在页面展示搜索信息
                res.locals.nameLike = query.nameLike || '';
                res.locals.urlLike = query.urlLike || '';

                res.render('resource/url', {
                    title: '资源管理_url访问管理',
                    data: json.data.data
                });
            }

        } else {
            res.render('error', {
                title: '资源管理_url管理',
                message: data,
                error:{}
            });
        }
    });
});

router.post('/url/add', System.loginRequired, function (req, res, next) {
    request.ResourceMngAddUrl(req, function (data, success) {
        res.send(data);
    });
});

router.post('/url/update', System.loginRequired, function (req, res, next) {
    request.ResourceMngUpdateUrl(req, function (data, success) {
        res.send(data);
    });
});

router.post('/url/del', System.loginRequired, function (req, res, next) {
    request.ResourceMngDeleteUrl(req, function (data, success) {
        res.send(data);
    });
});

router.get('/element', System.loginRequired, function (req, res, next) {
    request.ResourceMngGetEleList(req, function (data, success) {
        if (success) {
            var json = JSON.parse(data);
            if (success) {
                var query = req.query;
                res.locals.pagecount = json.data.pageCount;
                res.locals.currentpage = query.page || 1;
                delete query.page;
                var queryStr = qs.stringify(query);
                queryStr = queryStr ? queryStr += '&' : '';
                res.locals.query = queryStr;
                //在页面展示搜索信息
                res.locals.nameLike = query.nameLike || '';
                res.locals.identifierLike = query.identifierLike || '';

                res.render('resource/element', {
                    title: '资源管理_页面元素管理',
                    data: json.data.data
                });
            }

        } else {
            res.render('error', {
                title: '资源管理_页面元素管理',
                message: data,
                error:{}
            });
        }
    });
});

router.post('/element/add', System.loginRequired, function (req, res, next) {
    request.ResourceMngAddEle(req, function (data, success) {
        res.send(data);
    });
});

router.post('/element/update', System.loginRequired, function (req, res, next) {
    request.ResourceMngUpdateEle(req, function (data, success) {
        res.send(data);
    });
});

router.post('/element/del', System.loginRequired, function (req, res, next) {
    request.ResourceMngDeleteEle(req, function (data, success) {
        res.send(data);
    });
});

// router.get('/menuAdd', System.loginRequired, function (req, res, next) {
//     Request.AddMenu(req, function (data, success) {
//         res.send(data);
//     });
// });
//
// router.get('/menuModify', function (req, res, next) {
//     Request.UpdateMenu(req, function (data, success) {
//         res.send(data);
//     });
// });
//
// router.get('/menuDel', System.loginRequired, function (req, res, next) {
//     Request.DeleteMenu(req, function (data, success) {
//         res.send(data);
//     });
// });
//
// router.get('/menuList', System.loginRequired, function (req, res, next) {
//     Request.FetchMenuList(req, function (data, success) {
//         res.send(data);
//     });
// });


module.exports = router;


