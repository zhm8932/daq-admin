/**
 * Created by James on 16/4/12.
 */

var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');


exports.get_coupon_list = function(req,res,next){
    var query = req.query
    var currentPage = query.page||1;
    var name = query.name||'';
    var couponState = query.couponState||'';
    var fitArea = query.fitArea||'';

    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "coupon":{} //签名之前中文不能转码

    }
    //if(name){
    //    bizParam.coupon={"name":name}
    //}
    // console.log(query)
    bizParam.coupon = {}
    for(var key in query){
        // console.log(key,":--------:",query[key])
        //bizParam.coupon[key] = query[key]
        if(query[key]){
            bizParam.coupon[key] = query[key]

        }

    }
    // console.log("bizParam:",bizParam)
    util.ajax('GET',api.PageQueryCoupon,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.query = query
        req.currentPage = currentPage
        req.json = json
        next();
        //callback && callback(json,success);
    });
}
exports.coupon_add = function(req,res,next){
    var body = req.body
    var beginTime = Date.now(body.beginTime)
    // console.log(beginTime)

    var fit_area = body.fitArea
    var fitArea_arr = [];

    var getCity = req.getCity
    if(getCity&&fit_area){
        getCity.forEach(function (item,index) {

            if(typeof fit_area=='string'){
                if(item.name==fit_area){
                    fitArea_arr.push({"categoryId":item.id,"name":fit_area})
                }
            }else{
                fit_area.forEach(function (arr,i) {
                    if(item.name==arr){
                        fitArea_arr.push({"categoryId":item.id,"name":arr})
                    }
                })
            }


        })
    }

    var bizParam = {
            coupon:{
                "beginTime": new Date(body.beginTime).getTime(),
                "limitGet": body.limitGet,
                "endTime": new Date(body.endTime).getTime(),
                "amount":parseFloat(body.amount) ,
                "description": "ddddd",
                "name": body.name,
                //"inviteCode": "2234568802",
                "ftype": body.ftype,
                "fitArea":fitArea_arr
                //"faceValue": body.faceValue,
                //"enoughMoney": body.enoughMoney
            },
            couponOperLog: {
                "operatorId": "1",
                "operatorName": encodeURI("admin")
            }
    }
    if (body.ftype == 'discount'){
        bizParam.coupon.discount = body.discount
        bizParam.coupon.mostDeduction = parseFloat(body.mostDeduction)*100
    }else if (body.ftype == 'cash'){
        bizParam.coupon.faceValue = parseFloat(body.faceValue)*100
        bizParam.coupon.enoughMoney = parseFloat(body.enoughMoney)*100
    }


    // console.log('bizParam:::::',bizParam)
    util.ajax('POST',api.InsertCoupon,req,bizParam,function(data,success){
        res.send(data)
        // var json = JSON.parse(data)
        // req.json = json
        // next()
    })
}
exports.get_coupon_detail_list = function(req,res,next){
    var query  = req.query;
    var currentPage = query.page||'1';
    var id = req.query.id;
    var useState = req.params.useState||'1';
    res.locals.id = id;
    res.locals.useState = useState;
    var bizParam = {
        "id":id,
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "useState": useState,
    };
    util.ajax('GET',api.PromotionGetCouponUseDetail,req,bizParam,function (json,success) {
        var json = JSON.parse(json);
        req.json = json
        next()
    });
}

exports.get_coupon_detail = function(req,res,next){
    var id = req.params.id
    var bizParam = {
        "id":id
    };
    util.ajax('GET',api.SelectCouponById,req,bizParam,function (json,success) {
        var json = JSON.parse(json);
        req.json = json
        next()
    });
}
exports.update_coupon_detail  = function(req,res,next){
    var body = req.body
    var beginTime = Date.now(body.beginTime)
    // console.log(beginTime)
    var fit_area = body.fitArea
    var fitArea_arr = [];

    var getCity = req.getCity
    if(getCity){
        getCity.forEach(function (item,index) {

            if(typeof fit_area=='string'){
                if(item.name==fit_area){
                    fitArea_arr.push({"categoryId":item.id,"name":fit_area})
                }
            }else{
                fit_area.forEach(function (arr,i) {
                    if(item.name==arr){
                        fitArea_arr.push({"categoryId":item.id,"name":arr})
                    }
                })
            }


        })
    }
    // console.log('getCity::',getCity)
    // console.log('fitArea_arr::',fitArea_arr)

    var bizParam = {
        coupon:{
            "id":body.id,
            "inviteCode":body.inviteCode,
            "beginTime": new Date(body.beginTime).getTime(),
            "limitGet": body.limitGet,
            "endTime": new Date(body.endTime).getTime(),
            "amount":parseFloat(body.amount) ,
            "description": "ddddd",
            "name": body.name,
            "ftype": body.ftype,
            "fitArea":fitArea_arr
        },
        couponOperLog: {
            "operatorId": "1",
            "operatorName": encodeURI("admin")
        }
    }
    if (body.ftype == 'discount'){
        bizParam.coupon.discount = body.discount
        bizParam.coupon.mostDeduction = parseFloat(body.mostDeduction)*100
    }else if (body.ftype == 'cash'){
        bizParam.coupon.faceValue = parseFloat(body.faceValue)*100
        bizParam.coupon.enoughMoney = parseFloat(body.enoughMoney)*100
    }
    util.ajax('put',api.UpdateCouponById,req,bizParam,function(data,success){
        var json = data;
        res.send(json);
    })
}
exports.change_coupon_status = function(req,res){
    var body = req.body
    // console.log("body::::",body)

    var bizParam = {
        coupon:{
            "id":body.id,
            "couponState":body.couponState
        },
        couponOperLog: {
            "operatorId": "1",
            "operatorName": encodeURI("admin")
        }
    }
    util.ajax('put',api.UpdateCouponById,req,bizParam,function(data,success){
        var json = JSON.parse(data)
        res.send(json)
    })
}
exports.fetchCity = function (req,callback) {
    var bizParam = {
        "type":"district", //地区
        "level":2,
        "activeState":1
    };
    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        var data = JSON.parse(data);
        callback && callback(data.data,success);
    });
};

exports.fetchBanner = function (req,callback) {
    var getCity = req.getCity
    var bizParam = {
        "pageIndex": req.query.page||1,
        "pageSize": config.pageSize,
        //"category": req.params.id || 2140011006322424000
        "category": req.id || getCity[0].id
    };
    util.ajax('GET',api.BannerFetch,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        callback && callback(json,success);
    });
};

exports.fetchHelthBanner = function (req,callback) {
    var bizParam = {
        "pageIndex": req.query.page||1,
        "pageSize": config.pageSize,
        //"category": req.params.id || 2140011006322424000
        "category": req.id || 1000
    };
    console.log('bizParam:::',bizParam)
    util.ajax('GET',api.BannerFetch,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        callback && callback(json,success);
    });
};
exports.AddBanner = function (req,categories,callback) {
    var data = req.body;
    // console.log(data)
    var dto = {
        "userid":1,
        "postStatus":1,
        "readNum":0,
        // "displayOrder":0,
        "displayOrder":data.displayOrder,
        "imgs":JSON.parse(data.imgUrl),
        "link":data.link,
        "type":data.type,
        "category":data.category,
        "descText":data.descText
    };
    
    if(categories != null) {
        dto.categorys = categories;
    }

    var bizParam = {"dto":dto};

    util.ajax('POST',api.BannerAdd,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.UpdateBanner = function (req,categories,callback) {
    var data = req.body;
    // console.log("UpdateBanner:",data)

    var bizParam = {
        "dto":{
            "id":data.id,
            "userid":1,
            //"readNum":0,
            "displayOrder":data.displayOrder,
            "imgs":JSON.parse(data.imgUrl),
            //"imgUrl":JSON.parse(data.imgUrl)[0].imageUrl,
            //"imgUrl":JSON.parse(data.imgUrl)[0].imageUrl,
            "link":data.link,
            "type":data.type,
            "category":data.category,
            "descText":data.descText
        }

    };

    if(categories != null) {
        bizParam.dto.categorys = categories;
    }
    //bizParam.dto = JSON.stringify(bizParam.dto)

    //util.ajax('POST',api.BannerUpdate,bizParam,function (data,success) {
    util.ajax('PUT',api.BannerUpdate,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.DeleteBanner = function (req,callback) {
    var bizParam = {'id':'1603162004520361005'};
    util.ajax('DELETE',api.BannerDelete,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.ChangeBannerState = function (req,callback) {
    var bizParam = {
        "dto":{
            'id':req.body.id,
            "postStatus":req.body.postStatus
        }
    };

    util.ajax('PUT',api.BannerUpdate,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.fetchBannerDetail = function (req,callback) {
    var bannerId = req.params.bannerId
    var bizParam = {'id':req.params.bannerId};
    // console.log('bizParamId:',bizParam)
    util.ajax('GET',api.BannerDetail,req,bizParam,function (data,success) {
        var obj = JSON.parse(data).data;
        callback && callback(obj,success);
    });
};

//exports.get_coupon_list = function(req,res,next){
//
//    var currentPage = req.query.page||1;
//    var hospitalName = req.query.hospitalName||'';
//    var telephone = req.query.telephone||'';
//    var query = req.query;
//    var bizParam = {
//        "pageSize": config.pageSize,
//        "pageIndex": currentPage,
//        "coupon": "" //签名之前中文不能转码
//
//    }
//    util.ajax('GET',api.PageQueryCoupon,bizParam,function (data,success) {
//        var json = JSON.parse(data);
//        delete query.page;
//        var queryStr = '';
//        for(var attr in query){
//            queryStr += attr + '=' + query[attr] + '&';
//        }
//        res.locals.query = queryStr;
//        res.locals.pagecount = json.data.pageCount;
//        res.locals.currentpage = currentPage;
//        req.json = json
//        next();
//        //callback && callback(json,success);
//    });
//}


exports.AddBannerGoodsCat = function (req,res,callback) {
    var query = req.query;
    if (query.imgs) {
        query.imgs = JSON.parse(query.imgs);
    } else {
        query.imgs = [];
    }
    query.userId = req.accountId;
    var bizParam = {"dto":query};

    util.ajax('POST',api.BannerAdd,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.QueryBannerBatch = function (req,res,callback) {
    var bizParam = req.query;

    util.ajax('POST',api.QueryBannerBatch,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.UpdateBannerGoodsCat = function (req,res,callback) {
    var query = req.query;
    if (query.imgs) {
        query.imgs = JSON.parse(query.imgs);
    } else {
        query.imgs = [];
    }
    var bizParam = {"dto": query};

    util.ajax('PUT',api.BannerUpdate,req,bizParam,function (data,success) {
        callback && callback(data,success);
    });
};