/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var staticize = require('../lib/staticize');
var path = require('path');

var prefix = 'article';//静态文件的名称前缀
var htmlJadePath = path.resolve(__dirname, '../views/kepu/detailHtml.jade');//静态文件的jade地址
var staticHtmlFolder = path.resolve(__dirname, '../public/htmls/kepu/') + '/';//静态文件存放的文件夹,以article开头
var htmlUrlFolder = 'http://' + config.hostname_node + ':' + config.port_node + '/htmls/kepu/';//静态文件的URL地址

exports.FetchArticleDetail = function (req, callback) {
    var query = req.query;
    var bizParam = {"id": query.id};
    util.ajax('GET', api.ArticleDetail,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.GetArticleBatch = function (req, callback) {
    var bizParam = {"ids": req.query.ids};
    util.ajax('GET', api.GetArticleBatch,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.CreateArticle = function (req, callback) {
    var query = req.body;

    query.categorys = [config.articleParentCategory];//父级目录
    query.userId = req.accountId;

    if (query.imgs) {
        query.imgs = JSON.parse(query.imgs);
    } else {
        query.imgs = [];
    }
    
    //得到URL,如  http://192.168.6.120:3000/htmls/kepu/article1461159818240.html
    var timestamp = new Date().getTime();
    var htmlName = prefix + timestamp + '.html';//文件名为article1461159818240.html
    var url = htmlUrlFolder + htmlName;//静态文件URL为 文件夹+文件名

    var bizParam = {"dto": query};
    query.createdAt = timestamp;

    //先生成静态文件,得到URL,再插入
    staticize.staticize(htmlJadePath, query, staticHtmlFolder + htmlName, htmlName, function (data,success) {
        if(success){
            var result = JSON.parse(data);
            query.url = result.data.url;
            delete query.createdAt;
            util.ajax('POST', api.ArticleCreate,req, bizParam, function (data, success) {
                callback && callback(data, success);
            });
        }else{
            callback && callback(data, success);
        }
    });
};

//修改整篇文章内容,涉及到imgs的处理和重新生成静态文件
exports.ModifyArticle = function (req, callback) {
    var query = req.body;

    if (query.changeState) {
        var bizParam = {"dto": query};
        util.ajax('PUT', api.ArticleChange,req, bizParam, function (data, success) {
            callback && callback(data, success);
        });
    } else {
        try{
            if (query.imgs) {
                query.imgs = JSON.parse(query.imgs);
            } else {
                query.imgs = [];
            }
        }catch(e){
            var data = JSON.stringify({success:false,msg:'Json parse error.Imgs is invalid.'});
            callback && callback(data, false);
            return false;
        }


        var bizParam = {"dto": query};

        //得到已经存在的静态文件名称
        var htmlName = query.url.substring(query.url.lastIndexOf('/') + 1);

        staticize.staticize(htmlJadePath, query, staticHtmlFolder + htmlName, htmlName, function (data) {
            var result = JSON.parse(data);
            query.url = result.data.url;
            util.ajax('PUT', api.ArticleChange,req, bizParam, function (data, success) {
                callback && callback(data, success);
            });
        });
    }
};

exports.DeleteArticle = function (req, callback) {
    var bizParam = {"id": req.query.id};
    util.ajax('DELETE', api.ArticleTerminate,req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.DeleteArticleAsso = function (req, callback) {
    var bizParam = req.body;
    util.ajax('DELETE', api.DeleteArticleAsso,req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.AddArticleAsso = function (req, callback) {
    var bizParam = req.body;
    util.ajax('POST', api.AddArticleAsso,req, bizParam, function (data, success) {
        callback && callback(data, success);
    })
};

exports.SearchArticle = function (req, callback) {
    var query = req.query;
    var currentPage = query.page || 1;

    if(typeof query.status === 'undefined'){
        query.status = 'publish';
    }

    if(typeof query.category === 'undefined' || query.category == 'all'){
        query.category = config.articleParentCategory;
    }

    var bizParam = {
        "pageIndex": currentPage,
        "pageSize": query.pageSize || 10,
        "category": query.category,
        "tc": query.tc || '',
        "status":query.status || ''
    };
    
    util.ajax('GET', api.ArticleSearch,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};

exports.QueryPopularity = function (req, callback) {
    var bizParam = {
        command:{
            rawRequest:{
                infoIds:req.query.infoIds,
                infoType:req.query.infoType
            }
        }
    };

    util.ajax('GET', api.ArticleQueryPopularity,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
};


