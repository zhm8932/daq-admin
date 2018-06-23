/*
 * 活动中心 activity
 * */
var config = require('../config')
// var utils = require('../app/models/utils')
var util = require('../lib/ajax');
var api = require('../lib/api');

//获取城市信息
//exports.get_city = function(req,res,next){
//    var bizParam = {
//        "type":"district", //地区
//        "level":2,
//        "activeState":1
//    }
//    //console.log('bizParam:::',bizParam)
//    var obj = {
//        "apiName":"dictionary.queryDictionaryListByTypeAndLevel"
//    }
//    utils.extend(obj,bizParam);
//    var sysParam = utils.tbSign(obj)
//    console.log('obj:::',obj)
//
//    utils.ajaxSign({
//        bizParam:bizParam,
//        sysParam:sysParam,
//        type:'GET',
//        res:res,
//        success:function(json){
//            var data = JSON.parse(json)
//            req.getCity = data.data
//            next()
//        }
//
//    })
//}
exports.get_city = function(req,res,next){
    var bizParam = {
        "type":"district", //地区
        "level":2,
        "activeState":1
    }

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        // console.log("get_city:",json)
        if(json&&json.success) {
            console.log("333333333:")
            req.getCity = json.data;
            res.locals.getCity = json.data;
            res.locals.get_city_success = json.success;
        }
        next()
        //callback && callback(json,success);
    });
}
exports.get_city_all = function(req,res,next){
    var bizParam = {
        "type":"district", //地区
        // "level":'0',
        "activeState":1
    }

    util.ajax('GET',api.QueryDictionaryTreeByType,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        // console.log("get_city:",json)
        res.locals.get_city_all_success = json.success;
        if(json&&json.success) {
            req.get_city_all = json.data;
            res.locals.get_city_all = json.data;
        }
        next()
        //callback && callback(json,success);
    });
}
//获取商品栏目
exports.get_goods_category = function(req,res,next){
    var bizParam = {
        "type":"goods_category", //栏目
        "level":1,
        "activeState":1
    }

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        console.log("goods_category:",json)
        var json = JSON.parse(data)
        res.locals.get_goods_category_success=json.success;
        if(json&&json.success) {

            req.get_goods_category = json.data
            res.locals.get_goods_category = json.data
        }
        next()
    });
}

//样品类型
exports.get_sample_category = function(req,res,next){
    var bizParam = {
        "type":"sample_category", //样品类型
        "level":1,
        "activeState":1
    }

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        var json = JSON.parse(data)
        res.locals.get_sample_category_success=json.success
        if(json&&json.success) {
            // console.log("goods_category:",json)
            req.get_sample_category = json.data;
            res.locals.get_sample_category=json.data;
        }
        next()
    });
}
exports.get_doctor_title = function(req,res,next){
    var bizParam = {
        "type":"doctor_title", //医生职称
        "level":1,
        "activeState":1
    }

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        //console.log("get_doctor_title:",json)
        res.locals.get_doctor_title_success = json.success;
        if(json&&json.success) {
            req.get_doctor_title = json.data;
            res.locals.get_doctor_title = json.data;
        }
        next()
        //callback && callback(json,success);
    });
}
exports.get_hospital_all = function(req,res,next){
    var bizParam = {"hospital":{}};
    util.ajax('GET',api.HospitalAll,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.locals.get_hospital_all_success = json.success;
        if(json&&json.success){
            req.get_hospital_all = json.data;
            res.locals.get_hospital_all = json.data
        }else{
            req.get_hospital_all = json;
        }
        next()
        //callback && callback(json,success);
    });
}
exports.get_hospital_all_enable = function(req,res,next){
    var bizParam = {"hospital":{"operatingState":1}}
    util.ajax('GET',api.HospitalAll,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.locals.get_hospital_all_success = json.success;
        if(json&&json.success){
            req.get_hospital_all = json.data;
            res.locals.get_hospital_all = json.data
        }else{
            req.get_hospital_all = json;
        }
        next()
        //callback && callback(json,success);
    });
}
exports.get_hospital_area = function (req,res) {
    var body = req.body;
    var addressObj = JSON.parse(body.addressObj);
    console.log('body:',body)
    var city = ''
    if(addressObj){
        addressObj.forEach(function (item,index) {
            city = item.level==2?item.categoryId:'';
        })
    }
    var bizParam ={
        "province": "",
        "city":city,
        "district":""
    }
    util.ajax('GET',api.HospitalAreaList,req,bizParam,function (data,success) {
        res.send(data);
    });

}

exports.get_department =function(req,res,next){
    var hospitalId = req.hospitalId
    console.log("hospitalId:",hospitalId)
    var bizParam = {
        "request":{
            "rawRequest":{
                "hospitalId": hospitalId||10
            }
        }
    }

    util.ajax('GET',api.DepartmentAll,req,bizParam,function (data,success) {
        var json = JSON.parse(data);
        // console.log("get_department:",json)
        res.locals.get_department_success=json.success;
        if(json&&json.success) {
            req.get_department = json.data;
            res.locals.get_department = json.data
        }
        next()
        //callback && callback(json,success);
    });
}