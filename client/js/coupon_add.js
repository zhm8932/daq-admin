define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker")

    //console.log(utils)
    //console.log(config)

    $('.startTime').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        autoUpdateInput: false,   //默认为空
        "timePicker": true,
        "timePicker24Hour": true,
        locale : {
            format : 'YYYY-MM-DD',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, function(start, end, label) {
        $('.startTime').val(start.format('YYYY-MM-DD HH:mm'));
    });

    $('.endTime').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        autoUpdateInput: false,   //默认为空
        "timePicker": true,
        "timePicker24Hour": true,
        locale : {
            format : 'YYYY-MM-DD',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, function(start, end, label) {
        $('.endTime').val(start.format('YYYY-MM-DD HH:mm'));
    });


    $('#conditions').change(function(){
        var type = $("#conditions option:selected").val()
        //console.log(type)
        var htmlWay = ''
        var htmlDec = ''
        if(type=='faceValue'){
            htmlDec = "<input class='w1' type='text' name='enoughMoney'><em>元使用</em>"
            //htmlWay = "<label >面额：</label><input type='text' name='faceValue'><em>元</em>"
        }else if(type =='discount'){
            htmlDec = "<input class='w1' type='text' name='mostDeduction'><em>元</em>"
            //htmlWay = "<label >折扣：</label><input type='text' name='discount'><em>折</em>"
        }
        //console.log(htmlDec)
        //console.log(htmlWay)
        $('.conditionDec').html(htmlDec)


    })

    $("#ftype").change(function(){
        var type = $("#ftype option:selected").val()
        var htmlWay = ''
        var htmlDec = ''
        if(type=='discount'){
            htmlWay = "<label >折扣：</label><input type='text' name='discount'><em>折</em>"

            htmlDec = "<label>最高可折扣：</label><input type='text' name='mostDeduction'><em>元</em>"
        }else if(type =='cash'){
            htmlWay = "<label >面额：</label><input type='text' name='faceValue'><em>元</em>"
            htmlDec = "<label>满：</label><input type='text' name='enoughMoney'><em>元使用</em>"
        }

        $('.conditionWay').html(htmlWay)
        $('.conditions').html(htmlDec)
    })

    //console.log(3%1 === 0)
    //console.log(4.3%1)
    //新增优惠券
    $('body').on('click','.submitBtn',function () {
        var serialize = $('.formBox').serialize()
        var serializeObj = {};
        //console.log(serialize)
        //console.log(serializeObj)
        var key= ''
        var pathname = window.location.pathname;
        var url = pathname=='/activity/coupon/add'?'/activity/coupon/add':'/activity/coupon/update';
        var title = pathname=='/activity/coupon/add'? "新增优惠券成功":'修改优惠券成功';

        $.each($('.formBox').find('input,textarea,select'),function (index,item) {
            key =$(item).attr('name')
            serializeObj[key] = $(item).val()
        })

        //console.log("serializeObj:",serializeObj);
        if(!serializeObj.name){
            new utils.MsgShow({
                title:"请输入优惠券名称！"
            }).hideMsg()
            return
        }else{
            if (utils.getLength(serializeObj.name)>30){
                new utils.MsgShow({
                    title:"优惠券名称60字符以内（30个中文）！"
                }).hideMsg()
                return
            }
        }
        if(!serializeObj.beginTime||!serializeObj.endTime){
            new utils.MsgShow({
                title:"请输入有效日期"
            }).hideMsg()
            return
        }
        if(!serializeObj.limitGet){
            new utils.MsgShow({
                title:"请输入每人限领张数"
            }).hideMsg()
            return
        }else{
            if(parseFloat(serializeObj.limitGet)%1!==0||parseFloat(serializeObj.limitGet)<=0||parseFloat(serializeObj.limitGet)>=1000000000){
                new utils.MsgShow({
                    title:"只能输入大于0-1000000000的整数"
                }).hideMsg()
                return
            }

        }

        if(serializeObj.ftype=='discount'){
            if(!serializeObj.discount){
                new utils.MsgShow({
                    title:"请输入折扣"
                }).hideMsg()
                return
            }else{
                if(parseFloat(serializeObj.discount)<=0||parseFloat(serializeObj.discount)>=10){
                    new utils.MsgShow({
                        title:"折扣必须是0到10之间的数字"
                    }).hideMsg()
                    return
                }
            }
            if(!serializeObj.mostDeduction){
                new utils.MsgShow({
                    title:"请输入最高可折扣金额"
                }).hideMsg()
                return
            }else{
                if(parseFloat(serializeObj.mostDeduction)%1!==0||parseFloat(serializeObj.mostDeduction)<=0){
                    new utils.MsgShow({
                        title:"最高抵扣金额必须大于0的整数"
                    }).hideMsg()
                    return
                }
            }
        }else{
            if(!serializeObj.faceValue){
                new utils.MsgShow({
                    title:"请输入面额"
                }).hideMsg();
                return
            }else{
                if(parseFloat(serializeObj.faceValue)%1!==0||parseFloat(serializeObj.faceValue)<=0){
                    new utils.MsgShow({
                        title:"面额必须大于0的整数"
                    }).hideMsg();
                    return
                }
            }
            if(!serializeObj.enoughMoney){
                new utils.MsgShow({
                    title:"请输入优惠券使用条件"
                }).hideMsg();
                return
            }else{
                if(parseFloat(serializeObj.enoughMoney)%1!==0||parseFloat(serializeObj.enoughMoney)<=0){
                    new utils.MsgShow({
                        title:"使用条件金额必须大于0"
                    }).hideMsg();
                    return
                }
            }
        }


        if(!serializeObj.amount){
            new utils.MsgShow({
                title:"请输入发行量"
            }).hideMsg()
            return
        }else{
            if(parseFloat(serializeObj.amount)%1!==0||parseFloat(serializeObj.amount)<=0){
                new utils.MsgShow({
                    title:"发行量必须是大于0的整数"
                }).hideMsg()
                return
            }
        }
        var $fitArea = $('.fitArea:checked')
        var fitArea = [];
        $.each($fitArea,function (i,item) {
            fitArea.push($(item).val())
        })
        serializeObj.fitArea = fitArea
        if(!serializeObj.fitArea.length){
            new utils.MsgShow({
                title:"请输入适用地区"
            }).hideMsg()
            return
        }

        //console.log("serializeObj:",serializeObj)
        $.ajax({
            type:'POST',
            data:serializeObj,
            url:url,
            success:function(json){
                //console.log(json)
                var json = JSON.parse(json)
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:title
                    }).hideMsg(function () {
                       window.location='/activity/coupons'
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
});