define(function(require,exports,module) {
    var utils = require('../utils');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker");
    var moment = window.moment;


    /**

     * 实现当前日期是当年的第几周,再向前和向后推几周

     * js数组保存当前日期的前后两周(共五周的数据)

     * */

    console.log(moment().format('d'))
    console.log(moment().add('days',7).format('YYYY-MM-DD'))
    console.log(moment().add('days').format('YYYY-MM-DD'))
    console.log(moment("20160607", "YYYYMMDD"))
    console.log(moment("20160607", "YYYYMMDD").fromNow())
    console.log(moment("20160607", "YYYYMMDD").week())
    console.log(moment("20160607", "YYYYMMDD").weeksInYear())
    console.log(moment("20160607", "YYYYMMDD").weekYear())
    console.log(moment("20160607", "YYYYMMDD").weekday())
    console.log(moment("20160528", "YYYYMMDD").days())

    var getWeeks = function(obj){

        //实现当前日期是当年的第几周,再向前和向后推几周,js数组保存当前日期的前后两周(共五周的数据)

        var weekArr = []
        var curWeekDays = [];
        var startDate=obj.startDate||moment().add('days').format('YYYY-MM-DD')||'2016-05-10';
        // var startDate='2016-05-10';

        var vNowDate=moment(new moment(startDate).format("YYYY-MM-DD"));//.add('month',0).add('days',-1);

        var vWeekOfDay=moment(vNowDate).format("E");//算出这周的周几

        var vWeekOfDays=7-vWeekOfDay;

        var vStartDate=moment(vNowDate).add('days',-vWeekOfDay+1).format('YYYY-MM-DD');

        var vEndDate=moment(vNowDate).add('days',vWeekOfDays).format('YYYY-MM-DD');

        var vStartDateNew=moment(vStartDate).add('days',7*1).format('YYYY-MM-DD');

        var vEndDateNew=moment(vEndDate).add('days',7*2).format('YYYY-MM-DD');

        var vYearAndWeek=moment(vStartDate).format("YYYY")+'-'+moment(vStartDate).format("WW");
        //
        // searchMajorChanges(vStartDateNew,vEndDateNew);
        console.log("vNowDate:",vNowDate)
        console.log("距离周日的天数vWeekOfDays:",vWeekOfDays)
        console.log("这周的周几:",vWeekOfDay)
        console.log("这周周一的日期vStartDate:",vStartDate)
        console.log("这周周日的日期vEndDate:",vEndDate)
        console.log("vStartDateNew:",vStartDateNew)
        console.log("vEndDateNew:",vEndDateNew)
        console.log("vYearAndWeek:",vYearAndWeek)
        // weekArr = [["2016-06-06","2016-06-12"],["2016-06-13","2016-06-19"]]
        // weekArr.push({
        //     wk1:moment(vStartDate).add('days',-7*2).format('YYYY-MM-DD'),
        //     wk7:moment(vStartDate).add('days',-7*1-1).format('YYYY-MM-DD')
        // })
        // weekArr.push({
        //     wk1:moment(vStartDate).add('days',-7*1).format('YYYY-MM-DD'),
        //     wk7:moment(vStartDate).add('days',-7*0-1).format('YYYY-MM-DD')
        // })
        // weekArr.push({
        //     wk1:moment(vStartDate).add('days',7*0).format('YYYY-MM-DD'),
        //     wk7:moment(vStartDate).add('days',7*1-1).format('YYYY-MM-DD')
        // })
        // weekArr.push({
        //     wk1:moment(vStartDate).add('days',7*1).format('YYYY-MM-DD'),
        //     wk7:moment(vStartDate).add('days',7*2-1).format('YYYY-MM-DD')
        // })

        var start = obj.range[0]||-2;
        var end = obj.range[1]||2;
        // for(var i=-2;i<2;i++){
        for(var i=start;i<=end;i++){
            var bCur = false;
            // console.log("isAfter:",moment(vNowDate).isAfter(moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'), 'day'))
            // console.log("isBefore:",moment(vNowDate).isBefore(moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'), 'day'))
            if(moment(vNowDate).isSame(moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'), 'day')||moment(vNowDate).isSame(moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'), 'day')){
                bCur = true;
            }else if(moment(vNowDate).isAfter(moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'), 'day')&&moment(vNowDate).isBefore(moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'), 'day')){
                bCur = true;
            }else{
                bCur = false;
            }

            weekArr.push({
                wk1:moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'),
                wk7:moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'),
                bCur:bCur
            })
        }

        if(obj.curWeek){
            // curWeekArr.push({
            //     wk1:moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'),
            //     wk7:moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD')
            // })
            for(var i=0;i<7;i++) {
                curWeekDays.push(moment(vStartDate).add('days',i).format('YYYY-MM-DD'))
            }
            console.log("curWeekDays:",curWeekDays)
        }
        var data = {
            weekArr:weekArr,
            wStartDate:vStartDate,
            wEndDate:vEndDate
        }
        if(obj.curWeek){
            data.curWeekDays = curWeekDays
        }
        return data;

    }

    var dateWeek = getWeeks({
        // startDate:'2016-05-21',
        curWeek:true,
        range:[-3,1]
    })
    console.log('dateWeek:',dateWeek)
    // var weekdayshtml = '';
    // $.each(dateWeek.weekArr,function (index,item) {
    //     weekdayshtml+='<option value='+item.wk1+'-'+item.wk7+' selected='+item.bCur+'>'+item.wk1+' - '+item.wk7+'</option>'
    // })
    // $('.dateWeek').html('<ul>'+weekdayshtml+'</ul>')


    function cb(start, end) {
        var startDate = $('.startDate').val();
        if(!startDate){
            // $('.startDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            $('.startDate').val(dateWeek.wStartDate + ' - ' + dateWeek.wEndDate);
        }

    }
    cb(moment().subtract(6, 'days'), moment());

    $('.startDate').daterangepicker({
        // "singleDatePicker": true,
        "showDropdowns": true,
        "dateLimit": {
            "days": 6
        },
        // "startDate": dateWeek.wStartDate,
        // "endDate": dateWeek.wEndDate,
        locale : {
            format : 'YYYY-MM-DD',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, cb);
    //出诊停诊
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
        if(servicestatus==0){
            msgTip = '出诊'
        }else{
            msgTip = '停诊'
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
                                if(servicestatus==1){
                                    $self.attr('data-servicestatus',0)
                                    $self.addClass('red')
                                    $self.find('state').html('已停诊')
                                }else{
                                    $self.attr('data-servicestatus',1)
                                    $self.removeClass('red')
                                    $self.find('state').html('出诊')
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

    $('body').on('click','.table tbody input',function () {
        var $self = $(this);
        if(!$self.hasClass('all')){
            if($self.prop('checked')){
                $self.prop('checked',true)
                $self.parent().addClass('select')
            }else{
                $self.prop('checked',false)
                $self.parent().removeClass('select')
            }
        }else{
            if($self.prop('checked')){
                $self.parent().parent().find('input').prop('checked',true).parent().addClass('select')
                $self.removeClass('select')
            }else{
                $self.parent().parent().find('input').prop('checked',false).parent().removeClass('select')
            }

        }


    })
    $('body').on('click','.saveBtn',function () {
        var location = window.location;
        var url = location.pathname+location.search;
        var serialize = $('.table').serialize();
        console.log(serialize);
        var key= '';
        var sourceList = [];
        var $SelectInput = $('.select input');
        $.each($SelectInput,function (index,item) {
            var $parentTd = $(item).parent();
            console.log($parentTd)
            console.log($parentTd.attr('data-dayofweek'))
            sourceList.push({
                "dayOfWeek": $parentTd.attr('data-dayofweek'),
                "doctorId": $parentTd.parent().attr('data-doctorid'),
                "regSourceStatus": 1,
                "timeSlot":$parentTd.attr('data-timeSlot')
            })
        })


        console.log("sourceList:",sourceList)


        // for(var i = 0,len =serializeObj.start.length; i < len; i++){
        //     sourceList.push({
        //         "start":serializeObj.start[i],
        //         "end":serializeObj.end[i],
        //         "capacity":serializeObj.capacity[i],
        //         "cost":serializeObj.cost[i],
        //         "others": "{}"
        //     });
        // }
        console.log("sourceList2:",JSON.stringify(sourceList))
        var serializeObj=sourceList;
        if(!sourceList.length){
            new utils.MsgShow({
                delayTime:2000,
                title:'请选择一个要设置的号源！'
            }).hideMsg()
            return;
        }
        $.ajax({
            type:'post',
            data:{serializeObj:sourceList},
            url:'/scheduling/numbers/set_numbers_batch',
            success:function(json){
                console.log(json)
                var json = JSON.parse(json)
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:'号源设置成功'
                    }).hideMsg(function () {
                        // window.location='/scheduling/numbers'
                        window.location=url;
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