var request = require('../request/treatReq');

exports.render_coupon_list = function(req,res){
    var json = req.json
    var getCity = req.getCity
    var success = json.success
    var query = req.query;

    res.locals.success = success
    console.log('success::',success)
    if(success){
        delete query.page;
        var queryStr = '';
        for(var attr in query){
            queryStr += attr + '=' + query[attr] + '&';
        }

        res.locals.query = queryStr;
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = req.currentPage;

        res.render('activity/coupon',{
            title:'活动中心_优惠券管理',
            data:json.data.data,
            getCity:getCity,
            name:query.name,
            queryObj:query
        });
    }else{
        res.render('activity/coupon',{
            title:'活动中心_优惠券管理',
            data:JSON.stringify(json),
            queryObj:query
        });
    }

}

exports.render_coupon_detail_list = function(req,res){
    var json = req.json;
    var getCity = req.getCity;
    var success = json.success;
    var query = req.query;

    res.locals.success = success;
    console.log('success::',success);

    if(success){
        delete query.page;
        var queryStr = '';
        for(var attr in query){
            queryStr += attr + '=' + query[attr] + '&';
        }

        res.locals.query = queryStr;
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        res.locals.ftype = query.ftype;

        res.locals.resultCount = json.data.resultCount
        res.locals.pageSize = json.data.pageSize
        res.render('activity/coupon_detail',{
            title:'活动中心_优惠券管理_详情',
            data:json.data.data,
            getCity:getCity,
            name:query.name,
            queryObj:query
        });
    }else{
        res.render('activity/coupon_detail',{
            title:'活动中心_优惠券管理_详情',
            data:JSON.stringify(json),
            queryObj:query
        });
    }

}

exports.render_coupon_add = function(req,res){
    var getCity = req.getCity
    res.render('activity/coupon_add',{
        title:'活动中心_新增优惠券',
        getCity:getCity
    })
}
exports.render_coupon_update = function(req,res){

    var getCity = req.getCity
    var data = req.json.data

    res.render('activity/coupon_update',{
        title:'活动中心_修改优惠券',
        getCity:getCity,
        data:data
    })
}
exports.coupon_detail_cb = function(req,res){  //新增、修改成功后回调
    var json = req.json
    if(json.success){
        res.redirect('/activity/coupons')
    }
}