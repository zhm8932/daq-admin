/**
 * Created by James on 16/4/12.
 */
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var qs = require('querystring');
var async = require('async');

exports.ChangeGoodsState = function (req,callback) {
    var goodsId = req.body.goodsId,
        goodsState = req.body.goodsState;

    var bizParam = {
        "goodsId":goodsId,
        "goodsState":goodsState,
        "goodsOperLogDTO":{
            "operatorId": req.operator.operatorId,
            "operatorName": req.operator.account,
            "reason":"1111"
        }
    };

    util.ajax('PUT',api.GoodsStateChange,req, bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.ChangeGoodsPrority = function (req,callback) {
    console.log('req:::',req.headers)
    var myBody = req.body;
    var goodsId = myBody.goodsId,
        priority = myBody.priority
    if(priority=='1'){
        priority =2
    }else{
        priority =1
    }

    var goodsOperLogDTO = {
        "operatorId": req.operator.operatorId,
        "operatorName": req.operator.account
    }
    var bizParam = {
        "goodsId":goodsId,
        "priority":priority,
        "goodsOperLogDTO":goodsOperLogDTO
    }

    util.ajax('PUT',api.GoodsPriorityChange,req, bizParam,function (data,success) {
        callback && callback(data,success);
    });
};

exports.GoodsAdd = function (req,callback) {
    var bizParam = {
        "type":"district", //地区
        "level":2,
        "activeState":1
    };

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req, bizParam,function (data) {
        req.getCity = JSON.parse(data).data;
    });

    bizParam = {
        "type":"goods_category", //栏目
        "level":1,
        "activeState":1
    };

    util.ajax('GET',api.QueryDictionaryListByTypeAndLevel,req, bizParam,function (data,success) {
        req.get_goods_category = JSON.parse(data).data;
        callback && callback(data,success);
    });  
};

//套餐详细信息
exports.add_detail = function (req,res,next) {
    var query = req.body;
    query.categorys = [config.articleParentCategory];//父级目录
    query.userId = req.accountId;
    var bizParam = {"dto": query};

    util.ajax('POST', api.ArticleCreate,req, bizParam, function (data, success) {
        callback && callback(data, success);
    });
}
//修改套餐详情到文章
exports.add_detail_article = function (req,res,next) {
    var body = req.body;
    body.category = '100';//父级目录 定义套餐父栏目为100
    body.userId = req.accountId||'2110021716219176155';
    var bizParam = {"dto": body};

    util.ajax('POST', api.ArticleCreate,req, bizParam, function (data, success) {
        res.send(data)
    });
}
exports.update_detail_article = function (req,res,next) {
    var body = req.body;
    body.category = '100';//父级目录
    body.userId = req.accountId||'2110021716219176155';
    var bizParam = {"dto": body};

    util.ajax('PUT', api.ArticleChange,req, bizParam, function (data, success) {
        res.send(data)
    });
}
exports.GoodsAddNew = function (req,res,callback) {
    var screeningObj = req.body;

    // var transmit_type = {
    //     "sampling_home":parseFloat(screeningObj.sampling_home_cost)*100,
    //     "sampling_delivery":parseFloat(screeningObj.sampling_delivery_cost)*100,
    //     "sampling_clinic":parseFloat(screeningObj.sampling_clinic_cost)*100
    // }

    var transmit_type = {};

    if(screeningObj.sampling_home_cost){
        transmit_type.sampling_home=parseFloat(screeningObj.sampling_home_cost)*100
    }
    if(screeningObj.sampling_delivery_cost){
        transmit_type.sampling_delivery=parseFloat(screeningObj.sampling_delivery_cost)*100
    }
    if(screeningObj.sampling_clinic_cost){
        transmit_type.sampling_clinic=parseFloat(screeningObj.sampling_clinic_cost)*100
    }

    var transmit_items = screeningObj.transmit_items;
    var transmit_items_num = screeningObj.transmit_items_num;
    console.log(transmit_items)
    console.log(transmit_items_num)
    var transmit_items_value = [];  //取样项目
    if(typeof transmit_items =='object'&& typeof transmit_items_num =='object'){
        transmit_items.forEach(function(item,index){
            var bNum = false;
            transmit_items_num.forEach(function(arr,i){
                if(index==i){
                    bNum = true;
                }
            })
            if(bNum){
                transmit_items_value.push({
                    "name":item,
                    "num":transmit_items_num[index]
                })
            }

        })
    }else{
        transmit_items_value.push({
            "name":transmit_items,
            "num":transmit_items_num
        })
    }

    var getCity = req.getCity
    var fit_area_arr = [];
    console.log('screeningObj::::::',screeningObj.fit_area)
    if(getCity){
        getCity.forEach(function (item,index) {

            if(typeof screeningObj.fit_area=='string'){
                if(item.name==screeningObj.fit_area){
                    fit_area_arr.push({"categoryId":item.id,"name":screeningObj.fit_area})
                }
            }else{
                screeningObj.fit_area.forEach(function (arr,i) {
                    if(item.name==arr){
                        fit_area_arr.push({"categoryId":item.id,"name":arr})
                    }
                })
            }


        })
    }
    console.log('fit_area_arr::',fit_area_arr)
    var bizParam = {
        "goods": {
            "price": parseFloat(screeningObj.price)*100,
            "goodsName": screeningObj.goodsName,
            "discountPrice": parseFloat(screeningObj.discountPrice)*100,
            "goodsOperLogDTO": {
                "operatorId": req.operator.operatorId,
                "operatorName": req.operator.account
            },
            "goodsReCategories":screeningObj.categoryId,
            "productKeyAttributeList": [
                {
                    "attributeName": "transmit_type",
                    "value": JSON.stringify(transmit_type)
                },
                {
                    "attributeName": "transmit_items",
                    "value": JSON.stringify(transmit_items_value)
                },
                {
                    "attributeName": "fit_people",
                    "value": screeningObj.fit_people
                },
                {
                    "attributeName": "slogan",
                    "value": screeningObj.slogan
                },
                {
                    "attributeName": "title",
                    "value": screeningObj.title||screeningObj.goodsName
                },
                {
                    "attributeName": "keyword",
                    "value": screeningObj.keyword
                },
                {
                    "attributeName": "page_description",
                    "value": screeningObj.page_description
                },
                {
                    "attributeName": "storage_condition",
                    "value": screeningObj.storage_condition
                }
            ],
            "saleAttributes": [
                {
                    "attributeName": "fit_area",
                    "value": JSON.stringify(fit_area_arr)
                }
            ],
            "goodsImages":screeningObj.goodsImages&&JSON.parse(screeningObj.goodsImages)||'',
            "summary": screeningObj.summary,
            "commonQa": screeningObj.commonQa,
            "detail": screeningObj.detail
        }
    }
    var goodsReCategoriesArr = [];
    if(typeof bizParam.goods.goodsReCategories=='string'){
        goodsReCategoriesArr.push({"categoryId":bizParam.goods.goodsReCategories})
    }else{
        bizParam.goods.goodsReCategories.forEach(function(item,index){
            goodsReCategoriesArr.push({"categoryId":item})
        })
    };

    bizParam.goods.goodsReCategories = goodsReCategoriesArr
    bizParam.goods.saleAttributes.forEach(function(item,index){
        if(item.attributeName=='fit_area'){
            if(typeof bizParam.goods.saleAttributes[index].value=='object'){
                bizParam.goods.saleAttributes[index].value = item.value.join("，")
            }
        }
    });

    //bizParam.goods.goodsName = encodeURI(screeningObj.goodsName),
    //    bizParam.goods.productKeyAttributeList.forEach(function(item,index){
    //        if(item.attributeName=='transmit_items'){
    //            bizParam.goods.productKeyAttributeList[index].value = JSON.parse(item.value)
    //            item.value.forEach(function(arr,i){
    //                bizParam.goods.productKeyAttributeList[index].value[i].name=encodeURI(arr.name)  //中文转码
    //            })
    //            bizParam.goods.productKeyAttributeList[index].value = JSON.stringify(bizParam.goods.productKeyAttributeList[index].value)  //转化为字符串对象
    //        }else if(item.attributeName!='transmit_type'&&item.attributeName!='transmit_items'){
    //            bizParam.goods.productKeyAttributeList[index].value = encodeURI(item.value)
    //        }
    //
    //    });
    //
    //bizParam.goods.saleAttributes.forEach(function(item,index){
    //    if(item.attributeName=='fit_area'){
    //        if(typeof bizParam.goods.saleAttributes[index].value=='string'){
    //            bizParam.goods.saleAttributes[index].value = encodeURI(item.value)
    //        }else{
    //            item.value.forEach(function(arr,i){
    //                console.log('arr',arr)
    //                bizParam.goods.saleAttributes[index].value[i]=encodeURI(arr)
    //            })
    //            bizParam.goods.saleAttributes[index].value = bizParam.goods.saleAttributes[index].value.join(',')  //此处转化为字符串会显示签名错误
    //        }
    //    }
    //});

    util.ajax('POST',api.GoodsCreate,req, bizParam,function (data,success) {
        res.send(data)
        // callback && callback(data,success);
    });  
};

exports.GoodUpdate = function (req,res,next) {
    bizParam = {"goodsId":req.params.goodsId};
    util.ajax('GET',api.GoodsDetail,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.locals.success = json.success;
        req.success = json.success;
        req.json = json;
        if(success){
            req.appArticle = json.data.appArticle||'';
            req.pcArticle = json.data.pcArticle||'';
            req.mobileArticle = json.data.mobileArticle||'';
        }
        next();
    });  
};
var appArticleData = {}
function get_article_one(appArticle,keys,req,res,next,type) {
    // var bizParam = {"id": appArticle.detail};
    // res.locals.appArticleData = {};
    // var appArticleData = {};

    console.log("typetype:",type)
    var a = {};
    if(appArticle&&appArticle!='null'){
        console.log("appArticle:",appArticle)
        var appArticle = JSON.parse(appArticle);
        console.log("appArticle:::",appArticle)
        // console.log("keys:::",keys)
        if(!res.locals[type]){
            res.locals[type] = {};

        }

        for(var key in appArticle){
            console.log("keys::",keys)
            console.log("key::",key)
            if(key==keys){

                console.log("req.appArticle1111:",appArticle[keys])
                if(appArticle[keys]&&appArticle[keys]!=''){
                    util.ajax('GET', api.ArticleDetail,req, {"id": appArticle[keys]}, function (data, success) {
                        // console.log("keys:::",keys)

                        var json = JSON.parse(data);
                        if(json.success){
                            // console.log("keys:::",keys)
                            // res.locals.appArticle[key] = json.data.content;
                            // appArticle_[key] = json.data.content;
                            // res.locals.appArticleData[keys]= json.data.content;
                            // appArticleData[keys]= json.data.content;
                            appArticleData[keys]= json.data.id;


                            // res.locals.appArticleData = appArticleData;
                            // res.locals[ArticleData] = appArticleData;
                            // res.locals[type]= appArticleData;
                            res.locals[type][keys]= json.data.content;
                            // a[ArticleData] = appArticleData

                            console.log("appArticleData::",appArticleData)
                            // console.log("aaa::",res.locals)

                        }
                        // callback&&callback()
                        next()

                    });
                }else{
                    next()
                }

            }else{
                // next()
            }
        }
        // if(appArticle[keys]){
        //
        // }

    }else{
        res.locals[type] = {};
        next()
    }

    // util.ajax('GET', api.ArticleDetail,req, {"id": appArticle.detail}, function (data, success) {
    //     console.log("req.appArticle1:",appArticle.detail);
    //     var json = JSON.parse(data);
    //     if(json.success){
    //         // res.locals.appArticle[key] = json.data.content;
    //         // appArticle_[key] = json.data.content;
    //         res.locals.appArticle_detail= json.data.content;
    //         console.log("appArticle_::",appArticle)
    //
    //     }
    //     next()
    //
    // });
}
// exports.get_detail_article= function (req,res,cb) {
//     console.log("第二部:",req.appArticle)
//
//     var appArticle = req.appArticle;
//     appArticle = JSON.parse(appArticle)
//     res.locals.appArticleData = {};
//     var appArticleData = {};
//
//     async.parallel([
//         function (callback) {
//                 util.ajax('GET', api.ArticleDetail,req, {"id": appArticle.summary}, function (data, success) {
//                     // console.log("req.appArticle1:",appArticle[keys])
//
//                     var json = JSON.parse(data);
//                     if(json.success){
//                         // console.log("keys:::",keys)
//                         // res.locals.appArticle[key] = json.data.content;
//                         // appArticle_[key] = json.data.content;
//                         // res.locals.appArticleData[keys]= json.data.content;
//                         appArticleData.summary= json.data.id;
//
//                         console.log("appArticle_11::",appArticle.summary)
//                         console.log("appArticleData::",appArticleData)
//
//                     }
//                     // callback&&callback()
//                     // next()
//
//                 });
//         }]
//         ,function (err, results) {
//             console.log("第二步results：",results)
//             cb(err, results)
//
//         }
//     );
//     // next()
//
// }

exports.get_article_app_detail = function (req,res,next) {
    // var appArticleData = {};
    var appArticleData = 'appArticleData';
    if(req.appArticle){
        get_article_one(req.appArticle,'detail',req,res,next,'app')
    }else{
        next()
    }


    // if(appArticle){
    //     // appArticle = JSON.parse(appArticle);
    //     if(appArticle.detail){
    //
    //     }
    //
    // }

}
exports.get_article_app_summary = function (req,res,next) {
    var appArticleData = {};
    if(req.appArticle){
        get_article_one(req.appArticle,'summary',req,res,next,'app')
    }else{
        get_article_one(req.appArticle,'summary',req,res,next,'app')
    }


}
exports.get_article_app_commonQa = function (req,res,next) {
    var appArticleData = {};
    if(req.appArticle){
        get_article_one(req.appArticle,'commonQa',req,res,next,'app')
    }else{
        next();
    }


}
exports.get_article_pc_detail = function (req,res,next) {
    var pcArticleData = {};
    // console.log("req.pcArticle::",req.pcArticle)
    get_article_one(req.pcArticle,'detail',req,res,next,'pc')

}
exports.get_article_pc_summary = function (req,res,next) {
    get_article_one(req.pcArticle,'summary',req,res,next,'pc')

}
exports.get_article_pc_commonQa = function (req,res,next) {
    get_article_one(req.pcArticle,'commonQa',req,res,next,'pc')

}
exports.get_article_mobile_detail = function (req,res,next) {
    get_article_one(req.mobileArticle,'detail',req,res,next,'mobile')

}
exports.get_article_mobile_summary = function (req,res,next) {
    get_article_one(req.mobileArticle,'summary',req,res,next,'mobile')

}
exports.get_article_mobile_commonQa = function (req,res,next) {
    get_article_one(req.mobileArticle,'commonQa',req,res,next,'mobile')

}

exports.get_detail_article = function (req,res,next) {
    var query = req.query;
    var bizParam = {"id":query.id};

    util.ajax('GET', api.ArticleDetail,req,bizParam, function (data, success) {
        res.send(data);

    });



};

exports.GoodsUpdateNew = function (req,res,next) {
    // var screeningObj = req.body.screening
    var screeningObj = req.body
    var screeningObjId = req.body.screeningId

    var goodsState = screeningObj.goodsState
    // req.goodsState = goodsState
    // console.log('goodsState:',goodsState)
    console.log('screeningObj:',screeningObj)

    var transmit_type = {};
    // var transmit_type = {
    //     "sampling_home":parseFloat(screeningObj.sampling_home_cost)*100,
    //     "sampling_delivery":parseFloat(screeningObj.sampling_delivery_cost)*100,
    //     "sampling_clinic":parseFloat(screeningObj.sampling_clinic_cost)*100
    // }

    if(screeningObj.sampling_home_cost){
        transmit_type.sampling_home=parseFloat(screeningObj.sampling_home_cost)*100
    }
    if(screeningObj.sampling_delivery_cost){
        transmit_type.sampling_delivery=parseFloat(screeningObj.sampling_delivery_cost)*100
    }
    if(screeningObj.sampling_clinic_cost){
        transmit_type.sampling_clinic=parseFloat(screeningObj.sampling_clinic_cost)*100
    }

    var transmit_items = screeningObj.transmit_items
    var transmit_items_num = screeningObj.transmit_items_num
    var transmit_items_value = [];  //取样项目
    if(typeof transmit_items =='object'&& typeof transmit_items_num =='object'){
        transmit_items.forEach(function(item,index){
            var bNum = false;
            transmit_items_num.forEach(function(arr,i){
                if(index==i){
                    bNum = true;
                }
            })
            if(bNum){
                transmit_items_value.push({
                    "name":item,
                    "num":transmit_items_num[index]
                })
            }


        })
    }else{
        transmit_items_value.push({
            "name":transmit_items,
            "num":transmit_items_num
        })
    }

    var getCity = req.getCity
    var fit_area_arr = [];
    // console.log('screeningObj::::::',screeningObj.fit_area)
    if(getCity){
        getCity.forEach(function (item,index) {

                if(typeof screeningObj.fit_area=='string'){
                    if(item.name==screeningObj.fit_area){
                        fit_area_arr.push({"categoryId":item.id,"name":screeningObj.fit_area})
                    }
                }else{
                    screeningObj.fit_area.forEach(function (arr,i) {
                        if(item.name==arr){
                            fit_area_arr.push({"categoryId":item.id,"name":arr})
                        }
                    })
                }


        })
    }


    // console.log("fit_area_arr:",fit_area_arr)
    // console.log("req.operator:",req.operator)

    var appArticle = {
        detail:screeningObj.app_detail_id,
        summary:screeningObj.app_summary_id,
        commonQa:screeningObj.app_commonQa_id
    }
    var pcArticle = {
        detail:screeningObj.pc_detail_id,
        summary:screeningObj.pc_summary_id,
        commonQa:screeningObj.pc_commonQa_id
    }
    var mobileArticle = {
        detail:screeningObj.mobile_detail_id,
        summary:screeningObj.mobile_summary_id,
        commonQa:screeningObj.mobile_commonQa_id
    }
    // console.log("fit_area_arr:",fit_area_arr)
    var bizParam = {
        "goods":{
            "id":screeningObj.id,
            "price": parseFloat(screeningObj.price)*100,
            "goodsName": screeningObj.goodsName,
            "discountPrice": parseFloat(screeningObj.discountPrice)*100,
            "goodsOperLogDTO": {
                "operatorId": req.operator.operatorId,
                "operatorName": req.operator.account
            },
            "goodsReCategories":screeningObj.categoryId,
            "saleAttributes": JSON.parse(screeningObj.saleAttributes),
            // "saleAttributes": [
            //     {
            //         "id":screeningObj.fit_area_id,
            //         "attributeName": "fit_area",
            //         "value": JSON.stringify(fit_area_arr)
            //     }
            // ],
            "productKeyAttributeList": [
                {
                    "id":screeningObj.transmit_type_id,
                    "attributeName": "transmit_type",
                    "value": JSON.stringify(transmit_type)
                },
                {
                    "id":screeningObj.transmit_items_id,
                    "attributeName": "transmit_items",
                    "value": JSON.stringify(transmit_items_value)
                },
                {
                    "id":screeningObj.fit_people_id,
                    "attributeName": "fit_people",
                    "value": screeningObj.fit_people
                },
                {
                    "id":screeningObj.slogan_id,
                    "attributeName": "slogan",
                    "value": screeningObj.slogan
                },
                {
                    "id":screeningObj.title_id,
                    "attributeName": "title",
                    "value": screeningObj.title||screeningObj.goodsName
                },
                {
                    "id":screeningObj.keyword_id,
                    "attributeName": "keyword",
                    "value": screeningObj.keyword
                },
                {
                    "id":screeningObj.page_description_id,
                    "attributeName": "page_description",
                    "value": screeningObj.page_description
                },
                {
                    "id":screeningObj.storage_condition_id,
                    "attributeName": "storage_condition",
                    "value": screeningObj.storage_condition
                }
            ],
            "appCoverImages":JSON.parse(screeningObj.appCoverImages),
            "appDetailImages":JSON.parse(screeningObj.appDetailImages),
            "pcCoverImages":JSON.parse(screeningObj.pcCoverImages),
            "pcDetailImages":JSON.parse(screeningObj.pcDetailImages),
            "mobileCoverImages":JSON.parse(screeningObj.mobileCoverImages),
            "mobileDetailImages":JSON.parse(screeningObj.mobileDetailImages),
            // "summary": screeningObj.summary,
            // "commonQa": screeningObj.commonQa,
            // "detail": screeningObj.detail,
            "appArticle":JSON.stringify(appArticle)||'',
            "pcArticle":JSON.stringify(pcArticle)||'',
            "mobileArticle":JSON.stringify(mobileArticle)||''
        }

    };

    console.log("bizParam:",bizParam)

    var goodsReCategoriesArr = [];
    if(typeof bizParam.goods.goodsReCategories=='string'){
        goodsReCategoriesArr.push({"categoryId":bizParam.goods.goodsReCategories})
    }else{
        bizParam.goods.goodsReCategories.forEach(function(item,index){
            goodsReCategoriesArr.push({"categoryId":item})
        })
    }
    bizParam.goods.goodsReCategories = goodsReCategoriesArr
    // bizParam.goods.saleAttributes.forEach(function(item,index){
    //     if(item.attributeName=='fit_area'){
    //         if(typeof bizParam.goods.saleAttributes[index].value=='object'){
    //             // bizParam.goods.saleAttributes[index].value = item.value.join("，")
    //             bizParam.goods.saleAttributes[index].value = push()
    //         }
    //     }
    // });

    //bizParam.goods.goodsName = encodeURI(screeningObj.goodsName),
    //bizParam.goods.productKeyAttributeList.forEach(function(item,index){
    //    if(item.attributeName=='transmit_items'){
    //        bizParam.goods.productKeyAttributeList[index].value = JSON.parse(item.value)
    //        item.value.forEach(function(arr,i){
    //            bizParam.goods.productKeyAttributeList[index].value[i].name=encodeURI(arr.name)  //中文转码
    //        })
    //        bizParam.goods.productKeyAttributeList[index].value = JSON.stringify(bizParam.goods.productKeyAttributeList[index].value)  //转化为字符串对象
    //    }else if(item.attributeName!='transmit_type'&&item.attributeName!='transmit_items'){
    //        bizParam.goods.productKeyAttributeList[index].value = encodeURI(item.value)
    //    }
    //
    //})
    //
    //bizParam.goods.saleAttributes.forEach(function(item,index){
    //    if(item.attributeName=='fit_area'){
    //        if(typeof bizParam.goods.saleAttributes[index].value=='string'){
    //            bizParam.goods.saleAttributes[index].value = encodeURI(item.value)
    //        }else{
    //            item.value.forEach(function(arr,i){
    //                console.log('arr',arr)
    //                bizParam.goods.saleAttributes[index].value[i]=encodeURI(arr)
    //            })
    //            bizParam.goods.saleAttributes[index].value = bizParam.goods.saleAttributes[index].value.join(',')  //此处转化为字符串会显示签名错误
    //        }
    //    }
    //});

    util.ajax('PUT',api.GoodsChange,req, bizParam,function (data,success) {
        res.send(data)
        // var json = JSON.parse(data);
        // req.json = json
        //
        // next()
        // callback && callback(data,success);
    });
};

exports.GoodsQuery = function (req,res,callback) {
    var goodsState = req.params.goodsState||2,
        currentPage = req.query.page||1;
    res.locals.goodsState = goodsState;
    var bizParam = {
        "pageIndex": currentPage,
        "pageSize": config.pageSize,
        "categoryId": '',
        "goodsState": goodsState
    };

    util.ajax('GET',api.GoodsQuery,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        callback && callback(json,success);
    });
};

exports.GoodsDetail = function (req,res,next) {
    // console.log('看你执行了几次')

    var goodsId = req.params.goodsId;
    // console.log('goodsId:',goodsId)
    var bizParam = {"goodsId":goodsId};

    util.ajax('GET',api.GoodsDetail,req, bizParam,function (json,success) {
        var json = JSON.parse(json);
        req.json=json
        if(success){
            req.appArticle = json.data.appArticle||'';
            // req.pcArticle = json.data.pcArticle||'';
            // req.mobileArticle = json.data.mobileArticle||'';
        }
        next()
        //callback && callback(obj,success);
    });
};

exports.Booking = function (req,res,next) {
    var status = req.params.status||0,
        currentPage = req.query.page||1;
    //res.locals.goodsState = goodsState;
    var query = req.query;
    res.locals.status = status;
    // console.log(query)
    var bizParam = {
        request:{
            "pageIndex": currentPage,
            "pageSize": config.pageSize,
            "process": status
            // "status": status
        }

    };
    if(status==4){
        bizParam.request.valid=0;
    }
    for(var key in query){
        // console.log(key,":--------:",query[key])
        if(query[key]){
            bizParam.request[key] = query[key]

        }

    }
    util.ajax('GET',api.Reservationpage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
};
//单个订单详情
exports.ReservationQuery = function (req,res,next) {
    var id = req.params.id||req.query.reservationId;
    var bizParam = {"id" : id};

    util.ajax('GET',api.ReservationByid,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        if(req.query&&req.query.bSend){
            if(json.success){
                var data = json.data;
                req.serviceType = data.serviceType;
                req.reservationStatus = data.reservationStatus;
                req.storage = data.storage;
                req.sampleCode = data.sampleCode;
            }else{

            }

        }else{
            req.json = json
        }
        next()
    });
};

//预约单状态
exports.get_book_track = function (req,res,next) {

    var id = req.params.id;
    var bizParam = {
        "reservationId" : id
    };

    util.ajax('GET',api.ReservationTraceGet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.get_book_track = json.data;
        next()
    });
}
exports.sample_storage = function (req,res,next) {
    var body = req.body
    var bizParam = {
        "sampleCode": body.sampleCode,
        "reservationId": body.reservationId

    };
    util.ajax('post',api.ReservationStorageAdd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json);
    });
}
exports.change_status = function (req,res,next) {
    var body = req.body;
    var serviceType = body.serviceType;
    var status = body.status;
    if(!status){
        switch (serviceType){
            case '1':
                status='1900';
                break;
            case '2':
                status='2900';
                break;
            case '3':
                status='3900';
                break;
        }
    }

    // console.log(body);
    // console.log("status:",status);
    var bizParam = {
        "id": body.id,
        "status": status
    };
    util.ajax('PUT',api.ReservationStatusPut,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
exports.register_book = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        "id": body.id
    };
    util.ajax('PUT',api.ReservationChecked,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}

exports.arrange_book = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        "id": body.id
    };
    util.ajax('PUT',api.ReservationArrange,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
exports.change_report = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        "id": body.id
    };
    util.ajax('PUT',api.ReservationReport,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
//发货
exports.delivery = function (req,res,next) {
    var body = req.body
    console.log(body)
    var bizParam = {
        expressDTO:{
            "addressee": body.addressee,
            "backAddress": body.backAddress,
            "company": body.company,
            // "id": null,
            "numbers": body.numbers,
            // "others": null,
            "prompt": body.prompt,
            "reservationId":body.reservationId,
            "telNum": body.telNum,
            "type": 0
        }

    }
    console.log('bizParam:',bizParam)
    util.ajax('post',api.ReservationExpressAdd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}

exports.get_nurse = function (req,res,next) {
    var currentPage = req.query.page||1;
    var bizParam = {
        "pageIndex": currentPage,
        "pageSize": config.pageSize

    };
    util.ajax('get',api.PagingQuerNurseDtoInfo,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
}

exports.cancle_booking = function (req,res,next) {
    var body = req.body
    console.log(body)
    var bizParam = body;
    util.ajax('PUT',api.Reservationcancel,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
exports.get_code = function (req,res,next) {
    var body = req.body
    console.log(body)
    console.log("serviceType:",req.serviceType)
    var bizParam = {
        "reservationId": req.query.reservationId
    };
    util.ajax('get',api.Reservationcodebyid,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        json.serviceType =req.serviceType;
        json.reservationStatus =req.reservationStatus;
        json.storage =req.storage;
        json.sampleCode =req.sampleCode;
        res.send(json)
    });
}

exports.add_code = function (req,res,next) {
    var bizParam = req.body;
    util.ajax('POST',api.ReservationCodeAdd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json);
    });
}
exports.get_order_list = function(req,res,next){
    var query = req.query;
    var orderState = req.params.orderState||'2';
    var currentpage = req.query.page||1;
    var bizParam = {
        "pageIndex": currentpage,
        // "pageSize": config.pageSize,
        "pageSize": 5,
        "orderState":orderState,
        "condition":{}

    };
    if(query.date){
        var date = query.date.split(' - ');
        query.startTime = new Date(date[0]).getTime();
        query.endTime = new Date(date[1]).getTime()
    }
    for(var key in query){
        console.log(key,":--------:",query[key])
        if(query[key]){
            bizParam.condition[key] = query[key]

        }
    }
    if(query.date) delete bizParam.condition.date;
    util.ajax('get',api.OrderPage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        if(json.success){
            res.locals.pagecount=json.data.pageCount;
        }
        res.locals.get_order_list_success = json.success;
        res.locals.currentpage = currentpage;
        res.locals.orderState=orderState;
        req.json = json;
        next()
    });
}

exports.get_order_detail = function (req,res,next) {
    var id = req.params.id;
    var bizParam = {"id" : id};
    util.ajax('GET',api.OrderGet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        console.log("get_order_detail_success:",json.success)
        res.locals.get_order_detail_success=json.success;
        req.json = json
        next()
    });
};

exports.opetate_order = function (req,res,next) {
    var body = req.body;

    console.log("body:",body)
    var userAllInfo = req.session.userInfo?req.session.userInfo.userAllInfo:req.cookies.userAllInfo;
    var bizParam = {
        "id":body.id,
        "orderLog":{
            "operatorId":userAllInfo.accountCommon.id,
            "operatorName":userAllInfo.accountCommon.account,
            "reason":body.reason
        }
    };
    var type = body.type;
    var aipName = ''
    switch (type){
        case '1':
            aipName = api.OrderApplyrefund;
            break;
        case '2':
            aipName = api.OrderCancelrefund;
            break;
        case '3':
            aipName = api.OrderAffirmrefund;
            break;
        case '4':
            aipName = api.OrderCancel;
            break;
    }
    util.ajax('put',aipName,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
};

exports.get_order = function (req,res,next) {
    var body = req.body
    var bizParam = {
        "password": body.password
    };
    util.ajax('get',api.ReservationBypwd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
exports.add_reservation = function (req,res,next) {
    var body = req.body
    var addressObj = JSON.parse(body.addressObj)
    var transmitType = body.transmitType
    var bizParam = {
        "reservation": {
            "accountId": body.accountId||"13812345458",
            "customerId":body.customerId||"13812345678",
            "serviceType": 3,
            "telNum": body.telNum,
            "time": body.time,
            "checkedName": body.checkedName,
            "city": "深圳市",
            "country": "中国",
            "province": "广东省",
            "region": "南山区",
            "address": body.address,
            "reservations": JSON.parse(body.reservations)
        }
    };
    if(addressObj){
        addressObj.forEach(function (item,index) {
            console.log('item:',item)
            if(item.level==1){
                bizParam.reservation.province =item.name
            }
            if(item.level==2){
                bizParam.reservation.city =item.name
            }
            if(item.level==3){
                bizParam.reservation.region =item.name
            }
        })
    }
    //服务方式：门诊取样：1    上门取样：2    快递取样：3
    switch (transmitType){
        case '门诊取样':
            bizParam.reservation.serviceType = '1';
            break;
        case '上门取样':
            bizParam.reservation.serviceType = '2';
            break;
        case '快递取样':
            bizParam.reservation.serviceType = '3';
            break;

    }
    console.log('bizParam::',bizParam)
    util.ajax('post',api.ReservationAdd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)
    });
}
exports.get_my_order = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId};
    var query = req.query;
    var type = query.type||'order';
    res.locals.type=type;
    if(type=='order'){
        util.ajax('GET',api.OrderMyall,req, bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_my_order_success=json.success;
            req.get_my_order = json;
            res.locals.get_my_order = json.data;
            next();
        });
    }else{
        next();
    }


}
exports.get_my_register = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId,"role":2};
    var query = req.query;
    var type = query.type;
    res.locals.type=type;
    if(type=='register'){
        util.ajax('GET',api.ReservationGetBbyaccount,req, bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_my_register_success=json.success;
            req.get_my_register = json;
            res.locals.get_my_register = json.data;
            next();
        });
    }else{
        next();
    }

}
exports.get_my_book = function (req,res,next) {
    var accountId = req.params.accountId;
    var bizParam = {"accountId" : accountId};
    var query = req.query;
    var type = query.type;
    res.locals.type=type;
    if(type=='book'){
        util.ajax('GET',api.ReservationByuser,req, bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_my_book_success=json.success;
            req.get_my_book = json;
            res.locals.get_my_book = json.data;
            next();
        });
    }else{
        next();
    }

}

// exports.apply_refund = function (req,res,next) {
//     var body = req.body
//     console.log(body)
//     var bizParam = {
//         "id":body.id,
//         "orderLog":{
//             "operatorId":"1111",
//             "operatorName":"管理员",
//             "reason":body.reason
//         }
//     };
//     util.ajax('put',api.OrderApplyrefund,req, bizParam,function (data,success) {
//         var json = JSON.parse(data);
//         res.send(json)
//     });
// };
// exports.cancel_refund = function (req,res,next) {
//     var body = req.body
//     console.log(body)
//     var bizParam = {
//         "id":body.id,
//         "orderLog":{
//             "operatorId":"1111",
//             "operatorName":"管理员",
//             "reason":"原因备注"
//         }
//     };
//     util.ajax('put',api.OrderCancelrefund,req, bizParam,function (data,success) {
//         var json = JSON.parse(data);
//         res.send(json)
//     });
// };
//
// exports.confirm_refund = function (req,res,next) {
//     var body = req.body
//     console.log(body)
//     var bizParam = {
//         "id":body.id,
//         "orderLog":{
//             "operatorId":"1111",
//             "operatorName":"管理员",
//             "reason":"原因备注"
//         }
//     };
//     util.ajax('put',api.OrderAffirmrefund,req, bizParam,function (data,success) {
//         var json = JSON.parse(data);
//         res.send(json)
//     });
// };
//
// exports.cancel_order = function (req,res,next) {
//     var body = req.body
//     console.log(body)
//     var bizParam = {
//         "id":body.id
//     };
//     util.ajax('put',api.OrderCancel,req, bizParam,function (data,success) {
//         var json = JSON.parse(data);
//         res.send(json)
//     });
// };