/*
 * 科普模块  kepu
 * */
var express = require('express');
var jade = require('jade');
var path = require('path');
var async = require('async');
var router = express.Router();
var request = require('../request/kepuReq');
var System = require('./system');
var dataDicRequest = require('../request/dataDicReq');
var roleReq = require('../request/roleReq');


router.get('/detail', System.loginRequired,function (req, res, next) {
    var articleJSON, assoListJSON,categoryJSON,popularityJSON,eleAuthorityJSON;
    async.parallel([function (callback) {
        req.query.type = 'article_category';
        req.query.level = 1;
        req.query.activeState = 1;
        dataDicRequest.FetchDataDictCategory(req, function (data, success) {
            if (success) {
                categoryJSON = JSON.parse(data).data;
            }
            callback(null, data);
        });
    },function (callback) {
        req.query.infoIds=[req.query.id];
        req.query.infoType='1';
        request.QueryPopularity(req, function (data, success) {
            if (success) {
                popularityJSON = JSON.parse(data).data;
            }
            callback(null, data);
        });
    },function(callback){
        async.series([
            function (callback) {
                request.FetchArticleDetail(req, function (data, success) {
                    if (success) {
                        articleJSON = JSON.parse(data).data;
                    }
                    callback(null, data);
                });
            },
            function (callback) {
                if (articleJSON && articleJSON.recommendIds) {
                    req.query.ids = articleJSON.recommendIds;
                    request.GetArticleBatch(req, function (data, success) {
                        if (success) {
                            assoListJSON = JSON.parse(data).data;
                        }
                        callback(null, data);
                    });
                } else {
                    callback(null, null);
                }
            }
        ], function () {
            callback(null, null);
        });
    }],function(){
        res.render('kepu/detail', {
            title: '健康科普_文章详情页',
            data: articleJSON,
            assoList: assoListJSON,
            category: categoryJSON,
            popularity:popularityJSON
        });
    });
});

router.get('/add', System.loginRequired, function (req, res, next) {
    req.query.type = 'article_category';
    req.query.level = 1;
    req.query.activeState = 1;
    dataDicRequest.FetchDataDictCategory(req, function (data, success) {
        var category = JSON.parse(data).data;
        res.render('kepu/add', {
            title: '健康科普_新增文章',
            content: '健康常识页面内容',
            category: category
        });
    });

});

router.post('/new', System.loginRequired, function (req, res, next) {
    request.CreateArticle(req, function (data, success) {
        res.send(data);
    });
});

router.get('/popularityQuery', System.loginRequired, function (req, res, next) {
    request.QueryPopularity(req, function (data, success) {
        res.send(data);
    });
});

router.get('/modifyView', System.loginRequired, function (req, res, next) {
    var articleJSON;
    var categoryJSON;
    async.parallel([function (callback) {
        request.FetchArticleDetail(req, function (data, success) {
            if (success) {
                articleJSON = JSON.parse(data).data;
            }
            callback(null, data);
        });
    }, function (callback) {
        req.query.type = 'article_category';
        req.query.level = 1;
        req.query.activeState = 1;
        dataDicRequest.FetchDataDictCategory(req, function (data, success) {
            if (success) {
                categoryJSON = JSON.parse(data).data;
            }
            callback(null, data);
        });
    }],function (err, results) {
        res.render('kepu/modify', {
            title: '健康科普_文章修改',
            data: articleJSON,
            category: categoryJSON
        });
    });
});

router.post('/modify', System.loginRequired, function (req, res, next) {
    request.ModifyArticle(req, function (data, success) {
        res.send(data);
    });
});

router.get('/del', System.loginRequired, function (req, res, next) {
    request.DeleteArticle(req, function (data, success) {
        res.send(data);
    });
});

router.post('/asso/del', System.loginRequired, function (req, res, next) {
    request.DeleteArticleAsso(req, function (data, success) {
        res.send(data);
    });
});

router.post('/asso/add', System.loginRequired, function (req, res, next) {
    request.AddArticleAsso(req, function (data, success) {
        res.send(data);
    });
});

router.get('/search', System.loginRequired, function (req, res, next) {
    request.SearchArticle(req, function (data, success) {
        res.locals.success = success
        if (success) {
            var json = JSON.parse(data);
            var query = req.query;
            res.locals.pagecount = json.data.pageCount;
            res.locals.currentpage = req.query.page || 1;
            delete query.page;
            var queryStr = '';
            for (var attr in query) {
                queryStr += attr + '=' + query[attr] + '&';

            }
            res.locals.query = queryStr;
            res.locals.category = query.category || '1';
            res.locals.tc = query.tc || '';
            res.locals.status = query.status || '';
            res.render('kepu/list', {
                title: '健康科普_文章列表',
                data: json.data.data
            });
        } else {
            res.render('kepu/list', {
                title: '健康科普_文章列表',
                data: data
            });
            // next();
        }
    });
});

router.get('/list/ajax', System.loginRequired, function (req, res, next) {
    request.SearchArticle(req, function (data, success) {
        if (success) {
            var json = {
                data:JSON.parse(data).data,
                recommendIds:req.query.recommendIds || [],
                articleId:req.query.articleId
            };
            var htmlPath = path.resolve(__dirname, '../views/kepu/ajax_list.jade');
            jade.renderFile(htmlPath, json, function (error, html) {
                var resJson;
                if(error){
                    resJson = {success: false, html: error.message, data: {}};
                }else {
                    resJson = {
                        html: html,
                        pageCount: json.data.pageCount
                        // recommendIds:req.query.recommendIds || []
                    }
                }
                res.send(JSON.stringify(resJson));
            });
        } else {
            next();
        }
    });
});

module.exports = router;




