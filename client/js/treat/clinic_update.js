'use strict';
define(function(require,exports,module) {
    var utils = require('../utils');
    require('./city');

    $(function () {
        var $body = $('body');
        var hospitalId = $('.hospitalId').val();
        utils.tab('.tabBox .hd','.tabBox .con');
        $body.on('click','.tabBox .hd span',function () {
            var $self =$(this) ;
            var index = $(this).index();
            var timeType = this.getAttribute('data-timeType');
            var $ul = $('.tabBox .con ul').eq(index);
            // console.log("index:",index,$(this))
            var data = {
                bSend:true,
                timeType:timeType,
                hospitalId:hospitalId
            };
            if(!$self.hasClass('success')&&index>0){
                $.ajax({
                    type:'get',
                    data:data,
                    url:'/treats/clinic/get_hospital_time',
                    beforeSend:function(){
                        // console.log("正在获取数据")
                        $ul.html('正在获取数据……')
                    },
                    success:function(json){
                        // console.log("json:",json)
                        $self.addClass('success');
                        if(json.success){
                            $ul.html(json.html)
                        }else{
                            new utils.MsgShow({
                                title:json.msg
                            }).hideMsg()
                        }



                    }

                })
            }

        })
        $body.on('click','.updateBtn,.saveBtn',function () {
            var $self = $(this);
            var $inputs = $self.parents('ul').find('input');
            var index = $self.parents('.tabBox').find('.hd span.on').index();
            var timeType = $self.parents('.tabBox').find('.hd span.on').attr('data-timeType');
            // console.log("index:",index,"timeType:",timeType);
            // console.log("$self：",$self,$(this).hasClass("updateBtn"),$inputs)
            if($self.hasClass('updateBtn')){
                $self.addClass('saveBtn').removeClass('updateBtn').html('保存');
                $inputs&&$inputs.map(function (index,item) {
                    $(item).attr('disabled',false)
                })
            }else {
                var $selfUl = $self.parents('ul'),
                    intervals = $selfUl.find('.intervals').val()||'0',
                    startTimeH = $selfUl.find('.startTimeH').val(),
                    startTimeM = $selfUl.find('.startTimeM').val(),
                    endTimeH = $selfUl.find('.endTimeH').val(),
                    endTimeM = $selfUl.find('.endTimeM').val(),
                    startTime = startTimeH+':'+startTimeM+':00',
                    endTime = endTimeH+':'+endTimeM+':00';


                // console.log("startTimeH:",startTimeH,"startTimeM:",startTimeM,parseInt(startTimeH))

                var reg_hm = /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1}):(00)$/;
                if(!reg_hm.test(startTime)){
                    new utils.MsgShow({
                        title:'起始时间格式不正确'
                    }).hideMsg()
                    return
                }
                if(!reg_hm.test(endTime)){
                    new utils.MsgShow({
                        title:'结束时间格式不正确'
                    }).hideMsg()
                    return
                }


                if(startTime.split(':').join('')>=endTime.split(':').join('')){
                    new utils.MsgShow({
                        title:'结束时间必须大于起始时间'
                    }).hideMsg()
                    return
                }
                if(timeType!=1){
                    if(parseFloat(intervals)<=0||parseFloat(intervals)%1!=0||isNaN(intervals)){
                        new utils.MsgShow({
                            title:'间隔时间必须大于零的整数'
                        }).hideMsg()
                        return
                    }

                }
                var hourDiff = endTimeH-startTimeH,
                    minuteDiff = endTimeM-startTimeM,
                    timeDiff = hourDiff*60+minuteDiff;
                if(timeDiff<intervals){
                    new utils.MsgShow({
                        title:'起始和结束的时间差必需大于时间间隔'
                    }).hideMsg()
                    return
                }
                var integerTime = timeDiff%intervals;
                if(integerTime){
                    new utils.MsgShow({
                        title:'结束时间不正确，时间差距应该为时间间隔的倍数'
                    }).hideMsg()
                    return
                }
                var $weeks = $selfUl.find('.week:checked');
                var weeks = [];

                $.each($weeks,function(index,item){
                    weeks.push($(item).val())
                });
                    // console.log("weeks:",weeks);


                var data = {
                    "insertHospitalTimeRequests": [
                        // {
                        //     "hospitalId": "123",
                        //     "timeType": 1,
                        //     "startTime": "08:00",
                        //     "endTime": "17:30",
                        //     "intervals": 30,
                        //     "week": 1
                        // }
                    ]
                }

                if(weeks.length){
                    for(var value in weeks)
                        data.insertHospitalTimeRequests.push({
                            hospitalId:hospitalId,
                            timeType:timeType,
                            startTime:startTime,
                            endTime:endTime,
                            intervals:intervals,
                            week:weeks[value]
                        })
                }
                var popop = new utils.Popup({
                    msg:'<h2>时间编辑提示</h2><p>保存后时间会被修改</p>',
                    bCancel:true,
                    okText:'保存',
                    isHide:false,
                    okCallback:function (){
                        $.ajax({
                            type:'POST',
                            data:data,
                            url:'/treats/clinic/set_hospital_time',
                            success:function(json){
                                // console.log("json:",json)
                                if(json.success){
                                    new utils.MsgShow({
                                        title:'保存成功'
                                    }).hideMsg()
                                    popop.hideBox(function () {
                                        $inputs&&$inputs.map(function (index,item) {
                                            $(item).attr('disabled',true)
                                        });
                                        $self.addClass('updateBtn').removeClass('saveBtn').html('编辑')
                                    })
                                }else{
                                    new utils.MsgShow({
                                        title:json.msg
                                    }).hideMsg()
                                    popop.hideBox()
                                }



                            }

                        })



                    }
                })

            }
        })

    })



});
