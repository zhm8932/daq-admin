// define(function(require,exports,module) {
define(function(require,moment) {
    var utils = require('/js/utils');
    var moment = require('moment');
    var daterangepicker = require("daterangepicker");
    var moment = window.moment;
    var $body = $('body');

    // $('.startTime').daterangepicker({
    //     "singleDatePicker": true,
    //     "showDropdowns": true,
    //     autoUpdateInput: false,   //默认为空
    //     "timePicker": true,
    //     "timePicker24Hour": true,
    //     locale : {
    //         format : 'YYYY-MM-DD',
    //         daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
    //         monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
    //             '七月', '八月', '九月', '十月', '十一月', '十二月' ]
    //     }
    // }, function(start, end, label) {
    //     $('.startTime').val(start.format('YYYY-MM-DD hh:mm:ss'));
    // });

    $('.date').daterangepicker(
        {
            //startDate: moment().startOf('day'),
            //endDate: moment(),
            minDate: '01-01-2015',	//最小时间
            autoUpdateInput: false,   //默认为空
            //maxDate : moment(), //最大时间
//                dateLimit : {
//                    days : 90
//                }, //起止时间的最大间隔
            showDropdowns : true,
            "linkedCalendars": false,
            showWeekNumbers : false, //是否显示第几周
            timePicker : false, //是否显示小时和分钟
            ranges : {
                //'最近1小时': [moment().subtract('hours',1), moment()],
                '今日': [moment().startOf('day'), moment()],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days',1).endOf('day')],
                '最近7日': [moment().subtract('days', 6), moment()],
                '最近30日': [moment().subtract('days', 29), moment()],
                '全部':[moment().subtract('days',1000),moment()]
            },
            opens : 'right', //日期选择框的弹出位置
            buttonClasses : [ 'btn btn-default' ],
            applyClass : 'btn-small btn-primary blue',
            cancelClass : 'btn-small',
            // format : 'YYYY-MM-DD HH:mm', //控件中from和to 显示的日期格式
            separator : ' to ',
            locale : {
                // format : 'YYYY-MM-DD HH:mm:ss',
                format : 'YYYY-MM-DD HH:mm',
                applyLabel : '确定',
                cancelLabel : '取消',
                fromLabel : '起始时间',
                toLabel : '结束时间',
                customRangeLabel : '自定义',
                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                firstDay : 1
            }
        }, function(start, end, label) {//格式化日期显示框

            // console.log(start)
            // console.log(end)
            $('.date').html(start.format('YYYY-MM-DD HH:mm') + ' - ' + end.format('YYYY-MM-DD HH:mm'));
        });

    //设置日期菜单被选项  --开始--
    var dateOption ;
    if("${riqi}"=='day') {
        dateOption = "今日";
    }else if("${riqi}"=='yday') {
        dateOption = "昨日";
    }else if("${riqi}"=='week'){
        dateOption ="最近7日";
    }else if("${riqi}"=='month'){
        dateOption ="最近30日";
    }else if("${riqi}"=='year'){
        dateOption ="最近一年";
    }else{
        dateOption = "自定义";
    }
    $(".daterangepicker").find("li").each(function (){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }
        if(dateOption==$(this).html()){
            $(this).addClass("active");
        }
    });
    $('.date').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm') + ' - ' + picker.endDate.format('YYYY-MM-DD HH:mm'));
    });

    $('.date').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    function operate_order(obj) {
        var $self = obj.$self||$(this)
        // console.log($self)
        // var id = $self.parents().parents().attr('data-id');
        var id = $self.parents('tr').attr('data-id');
        var type = $self.attr('data-type');
        var bizParam = {
            id:id,
            type:type
        }
        var popup = new utils.Popup({
            msg:"<h2>"+obj.msgH2Txt+"</h2><aside><label>"+obj.placeholder+"：</label><textarea class='textarea' placeholder="+obj.placeholder+"></textarea></aside>",
            okText:obj.okText,
            isHide:obj.isHide,
            okCallback:function(){
                var textarea = $('.textarea').val();
                bizParam.reason = textarea||'';
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/order/opetate_order',
                    success:function(json){
                        var json = json;
                        if(json.success){
                            if(obj.callback){
                                obj.callback(json,popup,id)
                            }else{
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:obj.title
                                }).hideMsg(function(){
                                    $('.'+id).remove()
                                    //window.location.href=pathname
                                })
                            }

                        }else{
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:json.msg
                            }).hideMsg()
                        }


                    }
                })

            }
        })
        // console.log('popup:',popup)
    }
    //申请退款
    $body.on('click','.applyRefund',function () {
        var $self = $(this);
        operate_order({
            $self:$self,
            msgH2Txt:'申请退款',
            placeholder:'请输入退款备注',
            okText:"申请退款",
            title:'申请退款成功!!',
            url:'/screening/order/apply_refund'
        })

        // var $self = $(this)
        // var id = $self.parents().parents().attr('data-id')
        // var bizParam = {
        //     id:id
        // }
        // var popup = new utils.Popup({
        //     msg:"<h2>申请退款</h2><aside><label>请输入退款备注：</label><textarea class='textarea' placeholder='请输入退款备注'></textarea></aside>",
        //     okText:"申请退款",
        //     isHide:false,
        //     okCallback:function(){
        //         var textarea = $('.textarea').val();
        //         bizParam.reason = textarea||'';
        //         utils.myAjax({
        //             type:'PUT',
        //             data:bizParam,
        //             url:'/screening/order/apply_refund',
        //             success:function(json){
        //                 console.log(json)
        //                 var json = json
        //
        //                 if(json.success){
        //                     var myMsg = new utils.MsgShow({
        //                         delayTime:2000,
        //                         title:'申请退款成功!!'
        //                     }).hideMsg(function(){
        //                         window.location.href=pathname
        //                     })
        //                 }else{
        //                     var myMsg = new utils.MsgShow({
        //                         delayTime:2000,
        //                         title:json.msg
        //                     }).hideMsg()
        //                 }
        //
        //
        //             }
        //         })
        //
        //     }
        // })
        // console.log(popup)
    })

    //取消退款
    $body.on('click','.cancelRefund',function () {
        var $self = $(this);
        operate_order({
            $self: $self,
            msgH2Txt: '取消退款',
            placeholder: '请输入取消退款备注',
            okText: "取消退款",
            title: '取消退款成功!!',
            url: '/screening/order/cancel_refund'
        })
    })


    //确认退款
    $body.on('click','.confirmRefund',function () {
        var $self = $(this);
        operate_order({
            $self: $self,
            isHide:false,
            msgH2Txt: '确认退款',
            placeholder: '请输入确认退款备注',
            okText: "确认退款",
            title: '确认退款成功!!',
            url: '/screening/order/confirm_refund',
            callback:function (json,popup,id) {
                // console.log('退款哈')
                var data = json.data;
                // console.log(data)
                if(data.credentia&&data.credentia.refund_info){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:"支付宝退款，即将跳转支付"
                    }).hideMsg(function () {
                        // window.location.href=data.credentia.refund_info
                        window.open(data.credentia.refund_info,'_blank','width=980,height=700');
                        $('.'+id).remove();
                        popup.hideBox();
                    })
                }else{
                    new utils.MsgShow({
                        delayTime:2000,
                        title:"确认退款成功"
                    }).hideMsg(function(){
                        $('.'+id).remove();
                        popup.hideBoxNoTime();
                    })
                }

            }
        })
    });

    //取消订单
    $body.on('click','.cancelOrder',function () {
        var $self = $(this);
        operate_order({
            $self: $self,
            msgH2Txt: '取消订单',
            placeholder: '请输入取消订单备注',
            okText: "取消订单",
            title: '取消订单成功!!',
            url: '/screening/order/cancel_order'
        })
    })

});