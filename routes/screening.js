/*
* 筛选业务模块  screening
* */
var express = require('express');
var router = express.Router();
var request = require('../request/screeningReq');
var ScreeningCb = require('../controllers/screeningCb');
var Com = require('./com');
var System = require('./system');


//修改套餐状态
//goodsState 商品状态：1,.审核中，2.显示中，3.审核不通过，4.已停用

router.put('/meal/one/statue',System.loginRequired,function (req,res,next) {
    request.ChangeGoodsState(req,function (data,success) {
        res.send(data);
    });
});

//是否置顶
router.put('/meal/one/priority',System.loginRequired,function (req,res,next) {
    request.ChangeGoodsPrority(req,function (data, success) {
        res.send(data);
    });
});
router.get('/meal/add',System.loginRequired,Com.get_city,Com.get_goods_category,Com.get_sample_category,function (req,res,next) {
    var get_goods_category = req.get_goods_category
    // console.log('req.get_sample_category:',req.get_sample_category)
    res.render('screening/add',{
        title:'筛查业务_套餐管理_新增套餐',
        data:{
            getCity:req.getCity,
            get_goods_category:req.get_goods_category,

        },
        get_sample_category:req.get_sample_category
    });
});

//新增套餐
router.post('/meal/add/new',System.loginRequired,Com.get_city,request.GoodsAddNew);
//新增套餐详细信息
router.post('/meal/add_detail',System.loginRequired,request.add_detail);

router.post('/meal/add_detail_article',System.loginRequired,request.add_detail_article);
router.post('/meal/update_detail_article',System.loginRequired,request.update_detail_article);

router.get('/meal/get_detail_article',System.loginRequired,request.get_detail_article);

//修改套餐
router.get('/meal/update/:goodsId',System.loginRequired,Com.get_city,Com.get_sample_category,Com.get_goods_category,request.GoodUpdate,
    request.get_article_app_detail,
    request.get_article_app_summary,
    request.get_article_app_commonQa,
    // request.get_article_pc_detail,
    // request.get_article_pc_summary,
    // request.get_article_pc_commonQa,
    // request.get_article_mobile_detail,
    // request.get_article_mobile_summary,
    // request.get_article_mobile_commonQa,
    ScreeningCb.render_update_detail);
// router.get('/meal/update/:goodsId',System.loginRequired,Com.get_city,Com.get_goods_category,function (req,res,next) {
//     request.GoodUpdate(req,res);
// });

// router.post('/meal/updates/new',System.loginRequired,Com.get_city,request.GoodsUpdateNew,ScreeningCb.render_updates_new);
router.post('/meal/updates/new',System.loginRequired,request.GoodsUpdateNew);

//套餐管理
router.get('/meal(/list/:goodsState)?',System.loginRequired,Com.get_goods_category,function (req,res,next) {
    request.GoodsQuery(req,res,function (data,success) {
        res.locals.success = data.success;
        var currentPage = req.query.page||1
        if(success){
            res.locals.pagecount=data.data.pageCount;
            res.locals.currentpage = currentPage;
            res.render('screening/meal',{
                title:'筛查业务_套餐管理',
                content:'套餐管理页面内容',
                data:data.data.data,
                get_goods_category:req.get_goods_category
            })
        }else{
            res.locals.code=data.code
            res.render('screening/meal',{
                title:'筛查业务_套餐管理',
                data:JSON.stringify(data),
                msg:data.msg
            })
        } 
    });
});


//套餐详情
router.get('/meal/detail/:goodsId',System.loginRequired,request.GoodsDetail,Com.get_goods_category,
    request.get_article_app_detail,
    request.get_article_app_summary,
    request.get_article_app_commonQa,
    ScreeningCb.render_meal_detail);



//预约管理
router.get('/booking(/list/:status)?',System.loginRequired,Com.get_city,request.Booking,ScreeningCb.book_list);

router.get('/booking/detail/:id',System.loginRequired,request.ReservationQuery,request.get_book_track,ScreeningCb.render_book_detail);
router.get('/booking/sample_storage',System.loginRequired,ScreeningCb.render_sample_storage)
// router.put('/booking/change_status',System.loginRequired,request.change_status);
router.get('/booking/arrangeNurse/:id',System.loginRequired,request.get_nurse,ScreeningCb.render_nurse_list);


router.put('/booking/cancle_booking',System.loginRequired,request.cancle_booking);
router.get('/booking/get_code',System.loginRequired,request.ReservationQuery,request.get_code);
router.post('/booking/add_code',System.loginRequired,request.add_code);  //添加采样编码

router.post('/booking/delivery',System.loginRequired,request.delivery);
router.post('/booking/sample_storage',System.loginRequired,request.sample_storage);
router.put('/booking/register_book',System.loginRequired,request.register_book);  //门诊登记
router.put('/booking/arrange_book',System.loginRequired,request.arrange_book);  //安排取样
router.put('/booking/change_report',System.loginRequired,request.change_report);  //修改报告状态


//订单
//orderState 订单状态,UNPAID(1,"未支付"),PAID(2,"已支付"),CANCELED(3,"已取消"),REFUNDING(4,"退款中"),REFUND(5,"已退款")
router.get('/order(/list/:orderState)?',System.loginRequired,Com.get_hospital_all,Com.get_city,request.get_order_list,ScreeningCb.render_order_list);
router.get('/order/detail/:id',System.loginRequired,request.get_order_detail,ScreeningCb.render_order_detail);
router.put('/order/opetate_order',System.loginRequired,request.opetate_order);  //订单处理
// router.put('/order/apply_refund',System.loginRequired,request.apply_refund);
// router.put('/order/cancel_refund',System.loginRequired,request.cancel_refund);
// router.put('/order/confirm_refund',System.loginRequired,request.confirm_refund);
// router.put('/order/cancel_order',System.loginRequired,request.cancel_order);
router.get('/order/book_order',System.loginRequired,ScreeningCb.book_order);
router.post('/order/book_order',System.loginRequired,request.get_order);
router.post('/order/add_reservation',System.loginRequired,request.add_reservation);




module.exports = router;
