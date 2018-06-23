var request = require('../request/screeningReq');
var qs = require('querystring')

exports.render_meal_detail = function (req,res) {
    console.log("开始渲染")
    var obj = req.json
    res.locals.success = obj.data
    if(obj.data){
        console.log('11111')
        var obj = obj.data
        var productKey = obj.productKeyAttributeList;
        var goodsReCategories = obj.goodsReCategories||'';
        var productKeyObj = {};
        var goodsReCategoriesObj = {};


        productKey.forEach(function(item,index){
            productKeyObj[item.attributeName] = item.value
        });

        if(goodsReCategories){
            goodsReCategories.forEach(function(item,index){
                goodsReCategoriesObj.categoryId = item.categoryId
            });
        }

        res.render('screening/detail',{
            title:'筛查业务_套餐管理_套餐详情_'+obj.goodsName,
            content:'筛查业务_套餐管理_套餐详情',
            data:obj,
            productKeyObj:productKeyObj,
            keyword:productKeyObj.keyword,
            description:productKeyObj.page_description
        });
    }else{
        console.log('2222')
        res.render('screening/detail',{
            title:'筛查业务_套餐管理_套餐详情_'+obj.goodsName,
            content:'筛查业务_套餐管理_套餐详情',
            data:obj

        });
    }


}
exports.render_update_detail = function(req,res){
    console.log("这里是最后执行的")

    var get_goods_category = req.get_goods_category;
    var getCity = req.getCity;

    var json = req.json;
        data = json.data;
    var productObj = {};
    if(data&&data.productKeyAttributeList){
        var productKey = data.productKeyAttributeList;
        productKey.forEach(function(item,index){
            if(item.attributeName=='transmit_type'&&item.value){
                console.log("item.value:",typeof  item.value);
                console.log("item.value:",item.value);
                productObj.transmit_type = JSON.parse(item.value)
            }else if(item.attributeName=='transmit_items'){
                productObj.transmit_items = item.value
            }else if(item.attributeName=='fit_people'){
                productObj.fit_people = item.value
            }
        });
    }

    var goodsReCategories = data.goodsReCategories||'';

    var goodsReCategoriesObj = {};

    if(goodsReCategories){
        goodsReCategories.forEach(function(item,index){
            goodsReCategoriesObj.categoryId = item.categoryId
        });
    }

    // console.log("所属栏目get_goods_category：",get_goods_category)
    res.render('screening/update',{
        title:'筛查业务_套餐管理_修改套餐',
        position:'修改套餐',
        data:data,
        productObj:productObj,
        "getCity":getCity,
        "get_goods_category":get_goods_category,
        "transmit_type":productObj.transmit_type
    });

}

exports.render_updates_new = function(req,res){
    var json = req.json
    var goodsState = req.goodsState
    console.log(json.success)
    if(json.success){
        // console.log('888888')
        switch(goodsState){
            case '1':
                res.redirect('/screening/meal/list/1');
                break
            case '2':
                res.redirect('/screening/meal/list/2');
                break
            case '3':
                res.redirect('/screening/meal/list/3');
                break
            case '4':
                res.redirect('/screening/meal/list/4');
                break
        }

    };
}

exports.book_list = function(req,res){
    var json = req.json;
    var query = req.query;
    res.locals.success = json.success
    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.actionUrl = '/screening'+req.url;
        res.render('screening/booking',{
            title:'筛查业务_预约管理',
            content:'预约管理页面内容',
            data:json.data.data,
            queryObj:query,
            getCity:req.getCity

        });
    }else{
        res.locals.code=json.code;
        res.render('screening/booking',{
            title:'筛查业务_套餐管理',
            data:json,
            queryObj:query
        });
    }
}

exports.render_book_detail = function (req,res) {
    var json = req.json
    res.render('screening/booking_detail',{
        title:'筛查业务_预约管理_预约详情',
        data:json.data,
        get_book_track:req.get_book_track
    })
}
exports.render_sample_storage = function (req,res) {
    res.render('screening/sample_storage',{
        title:'筛查业务_预约管理_样品入库'

    })
}

exports.render_nurse_list = function (req,res) {
    var json = req.json
    res.render('screening/booking_detail',{
        title:'筛查业务_预约管理_预约详情',
        data:json.data
    })
}

exports.render_order_list = function (req,res,next) {
    // System.loginRequired
    var json = req.json;
    var query = req.query;
    res.locals.queryObj=query;
    if(json.success){
        delete query.page;
        var queryStr = qs.stringify(query)
        queryStr = queryStr?queryStr+='&':'';

        res.locals.query = queryStr;

        res.locals.actionUrl = '/screening'+req.url;
        /*
        * isRefund判断是否需要退款
        * true 表示订单已有部分被使用，不可退款
        * false  表示可以退款
        * */
        var data = json.data.data;
        data.map(function (item) {
            if(item.goodsItemDTOs){
                item.goodsItemDTOs.some(function (arr) {
                    return item.isRefund = arr.reservationState==1
                })
            }
        })

        // console.log("datadatadata:",data)
        res.render('screening/order',{
            title:'筛查业务_订单管理',
            content:'订单管理页面内容',
            data:data
            // data:data
        });
    }else{
        res.locals.code=json.code;
        res.render('screening/order',{
            title:'筛查业务_套餐管理',
            data:JSON.stringify(json)
        })
    }



}
exports.render_order_detail = function(req,res){
    var json = req.json,
        data=json.success?json.data:JSON.stringify(json)
    res.render('screening/order_detail',{
        title:'筛查业务_订单管理_订单详情',
        data:data

    })
}

exports.book_order = function (req,res) {
    res.render('screening/book_order',{
        title:'筛查业务_订单管理_新增预约'

    })
}