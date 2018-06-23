/*
 * 活动中心 activity
 * */
var express = require('express');
var router = express.Router();
var request = require('../request/activityReq');
var ActicityCb = require('../controllers/acticityCb');
var Com = require('./com');
var System = require('./system');
var roleReq = require('../request/roleReq');

//活动中心 activity
//router.param('bannerId',function (req,res,next,id) {
router.param('id',function (req,res,next,id) {
    console.log('id ::::::' + id);
    //request.fetchCity(req,function (data,success) {
    //    req.getCity = data;
    //    next();
    //});
    req.id = id
    next()
},Com.get_city);

router.get('/index(/:id)?',System.loginRequired,Com.get_city,function (req,res,next) {
    request.fetchBanner(req,function (json,success) {
        res.locals.success = success
        if(success) {
            res.locals.pagecount=json.data.pageCount;
            res.locals.currentpage = req.query.page||1;
            var mainData = json.data.data;
            res.render('activity/index',{
                title:'活动中心_首页Banner',
                data:mainData,
                getCity:req.getCity,
                errMsg:json
            });

        }else{
            res.locals.code = json.code;
            res.render('activity/index',{
                title:'活动中心_首页Banner',
                msg:json.msg
            })
        }
    });
});

router.get('/package',function (req,res,next) {
    res.render('activity/package',{
        title:'活动中心_套餐',
        content:'套餐页面内容'
    });
});

router.param('categoryId',function (req,res,next,id) {
    req.params.id = id||1000;
    req.query.page = req.query.page||1;
    next();
});

router.get('/health',System.loginRequired,function (req,res,next) {
    request.fetchHelthBanner(req,function (json,success) {
        res.locals.success = success
        if(success){
            res.locals.pagecount=json.data.pageCount;
            res.locals.currentpage = req.query.page||1;
            res.render('activity/health',{
                title:'活动中心_健康科普',
                data:json.data.data,
                errMsg:json
            })
        }else{
            res.locals.code=json.code;
            res.render('activity/health',{
                title:'活动中心_健康科普',
                msg:json.msg
            })
        }
    });
});
//router.get('/health/:categoryId',function (req,res,next) {
//    request.fetchHelthBanner(req,function (json,success) {
//        res.locals.success = success
//        if(success){
//            res.locals.pagecount=json.data.pageCount;
//            res.locals.currentpage = req.query.page;
//            res.render('activity/health',{
//                title:'活动中心_健康科普',
//                data:json.data.data,
//                errMsg:json
//            })
//        }else{
//            res.locals.code=json.code;
//            res.render('activity/health',{
//                title:'活动中心_健康科普',
//                msg:json.msg
//            })
//        }
//    });
//});

//活动添加
router.get('/add',System.loginRequired,function (req,res,next) {
    request.fetchCity(req,function (data,success) {
        res.render('activity/add',{
            title:'活动中心_套餐banner_新增banner',
            getCity:data
        })
    });
});

//健康科普新增banner
router.get('/healths/add',System.loginRequired,function (req,res,next) {
    res.render('activity/health_add',{
        title:'活动中心_套餐banner_新增banner'
    });
});

router.post('/add',System.loginRequired,function (req,res,next) {
    request.AddBanner(req,['10001'],function (data,success) {
        res.send(data);
    });
});

router.post('/healths/add',System.loginRequired,function (req,res,next) {
    request.AddBanner(req,null,function (data,success) {
        res.send(data);
    });
});

//修改banner广告 首页
router.post('/index/update',System.loginRequired,function (req,res,next) {
    request.UpdateBanner(req,['10001'],function (data,success) {
        console.log('UpdateBannerData/index/update:',data)
        res.send(data);
    });
});

router.post('/delete_banner',System.loginRequired,function (req,res,next) {
    request.DeleteBanner(req,function (data,success) {
        res.send(data);
    });
});

//修改套餐状态  发布，停用，重新发布
router.post('/change_statue_banner',System.loginRequired,function (req,res,next) {
    request.ChangeBannerState(req,function (data,success) {
        res.send(data);
    });
});

//单个banner详情
router.get('/index/detail/:bannerId',System.loginRequired,Com.get_city,function (req,res,next) {
    request.fetchBannerDetail(req,function (data,success) {
        res.render('activity/update',{
            title:'活动中心_首页banner_修改banner',
            getCity:req.getCity,
            data:data
        });
    });
});

router.get('/health/detail/:bannerId',System.loginRequired,function (req,res,next) {
    request.fetchBannerDetail(req,function (data,success) {
        res.render('activity/update_health',{
            title:'活动中心_健康科普banner_修改banner',
            data:data
        });
    });
});
//修改健康科普banenr
router.post('/health/update',System.loginRequired,function (req,res,next) {
    request.UpdateBanner(req,null,function (data,success) {
        res.send(data);
    });
});


router.get('/addBannerGoodsCat',System.loginRequired,function (req,res,next) {
    request.AddBannerGoodsCat(req,res,function (data,success) {
        res.send(data);
    });
});

router.get('/updateBannerGoodsCat',System.loginRequired,function (req,res,next) {
    request.UpdateBannerGoodsCat(req,res,function (data,success) {
        res.send(data);
    });
});

router.get('/queryBannerBatch',System.loginRequired,function (req,res,next) {
    request.QueryBannerBatch(req,res,function (data,success) {
        res.send(data);
    });
});

router.get('/coupons',System.loginRequired,Com.get_hospital_all,Com.get_city,request.get_coupon_list,ActicityCb.render_coupon_list);
router.get('/coupons/detail/:useState?',System.loginRequired,Com.get_hospital_all,request.get_coupon_detail_list,ActicityCb.render_coupon_detail_list);
router.get('/coupon/add',Com.get_city,ActicityCb.render_coupon_add)
router.post('/coupon/add',Com.get_city,request.coupon_add,ActicityCb.coupon_detail_cb)
router.get('/coupons/update/:id',Com.get_city,request.get_coupon_detail,ActicityCb.render_coupon_update)

router.post('/coupon/update',Com.get_city,request.update_coupon_detail)
router.put('/coupon/change_status',request.change_coupon_status)

module.exports = router;