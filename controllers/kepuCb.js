var sysSettingRequest = require('../request/sysSettingReq');
var resourceReq = require('../request/resourceReq');

exports.FetchDataDictCategory = function(req,res,callback){
    req.query.type = 'article_category';
    req.query.level = 1;
    req.query.activeState = 1;
    sysSettingRequest.FetchDataDictCategory(req, function (data, success) {
        if (success) {
            callback(null, data);
        }else{
            req.categoryErr = new Error('获取目录失败');
        }
    });
};

