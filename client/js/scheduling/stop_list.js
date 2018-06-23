define(function(require,exports,module) {
    var utils = require('../utils');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker");

    console.log(utils)

    $('.startDate').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        locale : {
            format : 'YYYY-MM-DD',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, function(start, end, label) {
        $('.startDate').val(start.format('YYYY-MM-DD'));
    });

    //门诊登记
    $('body').on('click','.serverBtn',function () {
        var $self = $(this);
        var $tr= $self.parents().parents();
        var doctorName = $tr.attr('data-doctorName');
        var doctorId = $tr.attr('data-doctorId');
        var hospitalId = $tr.attr('data-hospitalid');
        var timeslot = $self.attr('data-timeslot');
        var servicestatus = $self.attr('data-servicestatus');
        var startDate = $('.startDate').val();
        var timeslotArr = ['未知','上午','下午','晚上'];
        var msgTip = '停诊';
        if(servicestatus=='true'){
            msgTip = '停诊'
        }else{
            msgTip = '出诊'
        }
        // var status = $self.parents().parents().attr('data-reservationStatus')
        var msg = '<h2>设置医生'+msgTip+'</h2>确定【'+doctorName+'】医生'+startDate+timeslotArr[timeslot]+msgTip+'？';
        var okText = '确定';

        var bizParam = {
            "command": {
                "doctorId": doctorId,
                "hospitalId": hospitalId,
                "list": [{
                    "scheduleDate": startDate,
                    "timeSlot": timeslot
                }]
            }
        }

        console.log('bizParam:',bizParam)
        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            okCallback:function(){
                $.ajax({
                    type:'PUT',
                    data:bizParam,
                    url:'/scheduling/stopup/stop_server',
                    success:function(json){
                        console.log(json);
                        var json = JSON.parse(json);
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'医生'+msgTip+'设置成功!!'
                            }).hideMsg(function(){
                                if(servicestatus=='true'){
                                    $self.attr('data-servicestatus',false)
                                    $self.addClass('red').removeClass('serverBtn')
                                    $self.find('.state').html('已停诊')
                                }else{
                                    $self.attr('data-servicestatus',true)
                                    $self.removeClass('red')
                                    $self.find('.state').html('出诊')
                                }

                            })
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
    })


});