
define(function(require,exports,module){
    require('jquery')
    var utils = require('utils');
    var config = require('./config')
    var move = require('./move')
    require('./diyUpload.js')

    $('body').on('click','.addTransmitItems',function(){
        console.log('22222222')
        var $transmitItems = $('.transmitItems')
        var itemHtml = "<p><input class='wid' type='text' name='screening[transmit_items]' placeholder='样品名称' value=''>" +
            "数量：<input type='text' name='screening[transmit_items_num]' value=''>份</p>"
        $transmitItems.append(itemHtml)

    })

    $('#summary').diyUpload({
        "browse_button":"selectfiles_summary",  //文件选择按钮
        "postfiles":'postfiles_summary',   //文件上传按钮
        "previewImageBox":"previewImage_summary",  //图片预览
        "stroageImgBtn":"#summary",                  //图片存储区域 隐藏域
        "businessId":22001
    })

    $('#goodsImages').diyUpload({
        "browse_button":"selectfiles_goodsImages",
        "postfiles":'postfiles_goodsImages',
        "previewImageBox":"previewImage_goodsImages",
        "stroageImgBtn":"#goodsImages",
        "businessId":22001
    })

    $('#detail').diyUpload({
        "browse_button":"selectfiles_detail",
        "postfiles":'postfiles_detail',
        "previewImageBox":"previewImage_detail",
        "stroageImgBtn":"#detail",
        "businessId":22001
    })
    $('#commonQa').diyUpload({
        "browse_button":"selectfiles_commonQa",
        "postfiles":'postfiles_commonQa',
        "previewImageBox":"previewImage_commonQa",
        "stroageImgBtn":"#commonQa",
        "businessId":22001
    })

    console.log(move)

    new move.Move()


    var UE_CONFIG = {
        toolbars: [
            ['undo', 'redo', 'bold','italic','underline','fontsize','forecolor','backcolor','strikethrough','subscript',
                'fontborder','superscript','paragraph','link','unlink','simpleupload','insertimage','lineheight',
                'justifyleft','justifyright','justifycenter']
        ]
    }
    //套餐简介编辑
    var detail_UE = UE.getEditor('detail_editor', UE_CONFIG);
    var detail = $("#detail").val();
    detail_UE.ready(function() {
        detail_UE.setContent(detail);
    });
    var summary_UE = UE.getEditor('summary_editor', UE_CONFIG);
    var summary = $("#summary").val();
    summary_UE.ready(function() {
        summary_UE.setContent(summary);
    });
    var commonQa_UE = UE.getEditor('commonQa_editor', UE_CONFIG);
    var commonQa = $("#commonQa").val();
    commonQa_UE.ready(function() {
        commonQa_UE.setContent(commonQa);
    });


    $('body').on('click','.submitBtn',function () {
        var serialize = $('.formBox').serialize();
        var serializeObj = {};
        var key= '';
        $.each($('.formBox').find('input,textarea,select'),function (index,item) {
            key =$(item).attr('name');
            serializeObj[key] = $(item).val()
        })
        if(!serializeObj.goodsName){
            new utils.MsgShow({
                title:"请输入套餐名称！"
            }).hideMsg();
            return
        }else{
            if (utils.getLength(serializeObj.goodsName)>20){
                new utils.MsgShow({
                    title:"套餐名称需为20字符长度以内！"
                }).hideMsg();
                return
            }
        }
        if(!serializeObj.price){
            new utils.MsgShow({
                title:"请输入市场价！"
            }).hideMsg();
            return
        }else{
            if (parseFloat(serializeObj.price)<=0){
                new utils.MsgShow({
                    title:"套餐市场价必须大于0！"
                }).hideMsg();
                return
            }
        }
        if(!serializeObj.discountPrice){
            new utils.MsgShow({
                title:"请输入优惠价！"
            }).hideMsg();
            return
        }else{
            if (parseFloat(serializeObj.discountPrice)<=0){
                new utils.MsgShow({
                    title:"套餐优惠价必须大于0！"
                }).hideMsg();
                return
            }else if(parseFloat(serializeObj.discountPrice)>parseFloat(serializeObj.price)){
                new utils.MsgShow({
                    title:"套餐优惠价不得大于市场价"
                }).hideMsg();
                return
            }
        }

        if(!serializeObj.slogan){
            new utils.MsgShow({
                title:"请输入广告语！"
            }).hideMsg();
            return
        }
        if(!serializeObj.keyword){
            new utils.MsgShow({
                title:"请输入关键字！"
            }).hideMsg();
            return
        }
        if(!serializeObj.page_description){
            new utils.MsgShow({
                title:"请输入网页描述！"
            }).hideMsg();
            return
        }
        if(!serializeObj.fit_people){
            new utils.MsgShow({
                title:"请输入检测人群！"
            }).hideMsg();
            return
        }
        if(!serializeObj.sampling_home_cost){
            new utils.MsgShow({
                title:"请输入上门取样优惠金额！"
            }).hideMsg();
            return
        }else{
            if (parseFloat(serializeObj.sampling_home_cost)>=parseFloat(serializeObj.discountPrice)){
                new utils.MsgShow({
                    title:"上门取样优惠须小于套餐优惠价"
                }).hideMsg();
                return
            }
        }
        if(!serializeObj.sampling_delivery_cost){
            new utils.MsgShow({
                title:"请输入快递取样优惠金额！"
            }).hideMsg();
            return
        }else{
            if (parseFloat(serializeObj.sampling_home_cost)>=parseFloat(serializeObj.discountPrice)){
                new utils.MsgShow({
                    title:"快递取样优惠须小于套餐优惠价"
                }).hideMsg();
                return
            }
        }


        if(!serializeObj.sampling_clinic_cost){
            new utils.MsgShow({
                title:"请输入门诊取样优惠金额！"
            }).hideMsg();
            return
        }else{
            if (parseFloat(serializeObj.sampling_home_cost)>=parseFloat(serializeObj.discountPrice)){
                new utils.MsgShow({
                    title:"门诊取样优惠须小于套餐优惠价"
                }).hideMsg();
                return
            }
        }
        console.log("serializeObj:",serializeObj);

        var $transmit_items = $('.transmit_items');
        var transmit_items = [];
        $.each($transmit_items,function (i,item) {
            transmit_items.push($(item).val())
        });
        serializeObj.transmit_items = transmit_items;

        var $transmit_items_num = $('.transmit_items_num');
        var transmit_items_num = [];
        $.each($transmit_items_num,function (i,item) {
            transmit_items_num.push($(item).val())
        });
        serializeObj.transmit_items_num = transmit_items_num;
        if(!serializeObj.transmit_items_num){
            new utils.MsgShow({
                title:"请输入取样份数!"
            }).hideMsg();
            return
        }

        if(!serializeObj.goodsImages){
            new utils.MsgShow({
                title:"请上传宣传图片！"
            }).hideMsg();
            return
        }
        var $categoryId = $('.categoryId:checked');
        var categoryId = [];
        $.each($categoryId,function (i,item) {
            categoryId.push($(item).val())
        });
        serializeObj.categoryId = categoryId;
        if(!serializeObj.categoryId.length){
            new utils.MsgShow({
                title:"请输入所属栏目"
            }).hideMsg();
            return
        }
        var $fit_area = $('.fit_area:checked');
        var fit_area = [];
        $.each($fit_area,function (i,item) {
            fit_area.push($(item).val())
        });
        serializeObj.fit_area = fit_area;
        if(!serializeObj.fit_area.length){
            new utils.MsgShow({
                title:"请输入服务地区"
            }).hideMsg();
            return
        }

        var $fit_area_categoryId = $('.fit_area_categoryId');
        var fit_area_categoryId = [];
        $.each($fit_area_categoryId,function (i,item) {
            fit_area_categoryId.push($(item).val())
        });
        serializeObj.fit_area_categoryId = fit_area_categoryId;

        detail = UE.getEditor('detail_editor').getContent();
        serializeObj.detail = detail;
        summary = UE.getEditor('summary_editor').getContent();
        serializeObj.summary = summary;
        commonQa = UE.getEditor('commonQa_editor').getContent();
        serializeObj.commonQa = commonQa;
        $.ajax({
            type:'post',
            data:serializeObj,
            url:'/screening/meal/updates/new',
            beforeSend:function () {
                new utils.MsgShow({
                    delayTime:2000,
                    title:'正在修改套餐……'
                }).hideMsg()
            },
            success:function(json){
                console.log(json);
                var json = JSON.parse(json);
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:'修改套餐成功'
                    }).hideMsg(function () {
                        // window.location='/screening/meal/list/1'
                    })

                }else{
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:json.msg
                    }).hideMsg()
                }

            }
        })

    })

})