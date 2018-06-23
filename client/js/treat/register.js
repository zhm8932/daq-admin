define(function(require,exports,module) {
    var utils = require('../utils');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker");

    console.log(utils)

    $('.startDate').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        autoUpdateInput: false,   //默认为空
        locale : {
            format : 'YYYY-MM-DD',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, function(start, end, label) {
        $('.startDate').val(start.format('YYYY-MM-DD'));
    });

    //备注
    $('body').on('click','.noteBtn',function () {
        var $self = $(this);
        var $tr= $self.parents().parents();
        var reservationId = $tr.attr('data-reservationId');
        var data = {
            reservationId:reservationId
        };
        var popup = new utils.Popup({
            msg:'<h2>备注</h2><textarea class="remark" name="remark" placeholder="请输入备注内容"></textarea>',
            okText:"保存",
            isHide:false,
            okCallback:function(){
                data.remark = $('.remark').val();
                if(!data.remark){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请输入备注内容'
                    }).hideMsg();
                    return
                }
                utils.myAjax({
                    type:'PUT',
                    data:data,
                    url:'/treats/register/add_remark',
                    success:function(json){
                        console.log(json);
                        var json = JSON.parse(json);
                        if(json.success){
                            new utils.MsgShow({
                                delayTime:2000,
                                title:'挂号备注成功!!'
                            }).hideMsg();
                            popup.hideBox()
                        }else{
                            new utils.MsgShow({
                                delayTime:2000,
                                title:json.msg
                            }).hideMsg()
                        }


                    }
                })

            }
        })
    })

    //退款
    $('body').on('click','.confirmRefund',function () {
        var $self = $(this);
        var $tr= $self.parents().parents();
        var reservationId = $tr.attr('data-reservationId');
        var data = {
            reservationId:reservationId
        };
        var popup = new utils.Popup({
            msg:'<h2>确认退款</h2><textarea class="reason" name="reason" placeholder="请输入备注内容"></textarea>',
            okText:"保存",
            isHide:false,
            okCallback:function(){
                data.reason = $('.reason').val();
                if(!data.reason){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请输入备注内容'
                    }).hideMsg();
                    return
                }
                utils.myAjax({
                    type:'PUT',
                    data:data,
                    url:'/treats/register/refund_register',
                    success:function(json){
                        console.log(json);
                        var json = JSON.parse(json);
                        if(json.success){
                            var data = json.data;
                            if(data.credentia&&data.credentia.refund_info){
                                new utils.MsgShow({
                                    delayTime:2000,
                                    title:"支付宝退款，即将跳转支付"
                                }).hideMsg(function () {
                                    // window.location.href=data.credentia.refund_info
                                    window.open(data.credentia.refund_info,'_blank','width=980,height=700');
                                    $('.'+reservationId).remove()
                                    popup.hideBox();
                                })
                            }else{
                                new utils.MsgShow({
                                    delayTime:2000,
                                    title:"确认退款成功"
                                }).hideMsg(function(){
                                    $('.'+reservationId).remove()
                                    popup.hideBoxNoTime();
                                })
                            }

                        }else{
                            new utils.MsgShow({
                                delayTime:2000,
                                title:json.msg
                            }).hideMsg()
                        }


                    }
                })

            }
        })
    })

    //门诊登记
    $('body').on('click','.toRegister',function () {
        var $self = $(this);
        var $tr= $self.parents().parents();
        var reservationId = $tr.attr('data-reservationId');
        var data = {
            reservationId:reservationId
        };
        var popup = new utils.Popup({
            msg:'<h2>门诊登记</h2><p>用户已到门诊就诊</p>',
            okText:"保存",
            okCallback:function(){
                utils.myAjax({
                    type:'PUT',
                    data:data,
                    url:'/treats/register/add_register',
                    success:function(json){
                        console.log(json);
                        var json = JSON.parse(json);
                        if(json.success){
                            new utils.MsgShow({
                                delayTime:2000,
                                title:'门诊登记成功!!'
                            }).hideMsg(function () {
                                $('.'+reservationId).remove()
                            });
                        }else{
                            new utils.MsgShow({
                                delayTime:2000,
                                title:json.msg
                            }).hideMsg()
                        }


                    }
                })

            }
        })
    })


});