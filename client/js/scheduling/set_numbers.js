define(function(require,exports,module) {
    var utils = require('../utils');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker");
    var DateTimePicker = require("DateTimePicker");
    require('./schedule_com')
    console.log(utils)

    $('.startDate').daterangepicker({
        "singleDatePicker": true,
        "autoUpdateInput": false,   //默认为空
        "timePicker24Hour": true,
        timePicker: true,
        timePickerIncrement: 30,
        rangesHour:[8,18],   //限制选择8-16小时内
        // "showDropdowns": true,
        locale : {
            format : 'HH:mm',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ]
        }
    }, function(start, end, label) {
        // $('.startDate').val(start.format('HH:mm'));
        console.log($(this))
        $(this).val(start.format('HH:mm'));
    });


    $("#dtBox").DateTimePicker(
        {
            dateFormat: "dd-MMM-yyyy"
        });
    
    function getObj(name,serializeObj) {
        var $ele = $('.'+name);
        var nameArr = [];
        $.each($ele,function (i,item) {
            if($(item).val()){
                nameArr.push($(item).val())
            }

        })
        serializeObj[name] = nameArr;
    }
    $('body').on('click','.submitBtn',function () {
        var serialize = $('.formBox').serialize();
        var serializeObj = {};
        console.log(serialize);
        console.log(serializeObj);
        var key= '';
        $.each($('.scheduling').find('input,textarea,select'),function (index,item) {
            key =$(item).attr('name');
            serializeObj[key] = $(item).val()
        });
        utils.getObj('start',serializeObj);
        utils.getObj('end',serializeObj);
        utils.getObj('capacity',serializeObj);
        utils.getObj('cost',serializeObj);
        console.log('serializeObj:',serializeObj);
        var sourceList = [];
        console.log("sourceList:",sourceList)
        // $.each(serializeObj.start,function (index,start) {
        //     $.each(serializeObj.end,function (index2,end) {
        //         $.each(serializeObj.capacity,function (index3,capacity) {
        //             $.each(serializeObj.cost,function (index4,cost) {
        //                 if(index==index2&&index2==index3&&index3==index4){
        //                     sourceList.push({
        //                         "start":start,
        //                         "end": end,
        //                         "capacity": capacity,
        //                         "cost": cost,
        //                         "others": "{}"
        //
        //                     })
        //                 }
        //
        //             })
        //         })
        //
        //     })
        // });


        for(var i = 0,len =serializeObj.start.length; i < len; i++){
            if(serializeObj.capacity[i]<=0||parseFloat(serializeObj.capacity[i])%1!==0){
                new utils.MsgShow({
                    title:"放号数必须是大于零的整数",
                    delayTime:2500
                }).hideMsg()
                return
            }
            console.log("serializeObj.cost:",serializeObj.cost[i])
            if(!serializeObj.cost[i]||serializeObj.cost[i]<=0){
                new utils.MsgShow({
                    title:"挂号费不能小于零",
                    delayTime:2500
                }).hideMsg();
                return
            }
            sourceList.push({
                "start":serializeObj.start[i],
                "end":serializeObj.end[i],
                "capacity":serializeObj.capacity[i],
                "cost":serializeObj.cost[i]*100,
                "others": "{}"
            });
        }
        console.log("sourceList2:",sourceList)
        serializeObj.doctorRegSourceDetailDTOList=sourceList;
        delete serializeObj.start
        delete serializeObj.end
        delete serializeObj.capacity
        delete serializeObj.cost

        console.log("serializeObj:",serializeObj);

        if(!sourceList.length){
            new utils.MsgShow({
                delayTime:2000,
                title:'请填写号源相关数据'
            }).hideMsg()
            return false;
        }
        $.ajax({
            type:'POST',
            data:serializeObj,
            url:'/scheduling/numbers/set_numbers',
            success:function(json){
                console.log(json)
                var json = JSON.parse(json)
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:'新增号源成功'
                    }).hideMsg(function () {
                        // window.location='/scheduling/numbers'
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


    var templateHtml ='';
    $('body').on('change','.dayOfWeek',function () {
        var $tbody = $('.table tbody');
        var $choose_template = $('.choose_template');
        if($choose_template.length&&!templateHtml.length){
            templateHtml = $tbody.html()
            console.log($choose_template.length)
        }
        // console.log(templateHtml);
        $.ajax({
            type:'get',
            data:{
                week:$('.dayOfWeek option:selected').val(),
                doctorId:$('.doctorId').val(),
                bSend:true
            },
            url:'/scheduling/numbers/get_numbers_detail',
            success:function(json){
                var json = json;
                if(json.success){
                    var data = json.data;
                    var html =''
                    if(data.doctorRegSourceDetailDTOList.length){
                        $.each(data.doctorRegSourceDetailDTOList,function (index,item) {
                           //html += '<tr><td><select name="start" class="start newPeriod"></select></td><td><select name="end" class="end newPeriod"></select></td><td><input type="text" name="capacity" class="capacity" placeholder="放号数"  value="'+item.capacity+'"></td><td><input type="text" name="cost" class="cost" placeholder="挂号费" value="'+item.cost+'"></td><td><a class="delete" href="javascript:;">删除</a></td></tr>';
                            html += '<tr><td><input name="start" class="start" value="'+item.start+'"></td><td><input name="end" class="end" value="'+item.end+'"></td><td><input type="text" name="capacity" class="capacity" placeholder="放号数"  value="'+item.capacity+'"></td><td><input type="text" name="cost" class="cost" placeholder="挂号费" value="'+parseFloat(item.cost)/100+'"></td><td><a class="delete" href="javascript:;">删除</a></td></tr>';

                        })
                    }else{
                        html +='<tr><td colspan="5">暂无数据</td></tr>'
                    }

                    if($choose_template.length){
                        $tbody.html(templateHtml)
                    }else{
                        $tbody.html(html)
                    }



                    // if(!data.doctorRegSourceDetailDTOList.length){
                        //     var $myTip = $('.myTip')
                        //     if($myTip.length){
                        //         $myTip.show();
                        //         setTimeout(function () {
                        //             $myTip.hide()
                        //         },2000)
                        //     }else{
                        //         $('.dayOfWeek').after('<div class="myTip">该医生当天无排班，可以使用模板</div>');
                        //         setTimeout(function () {
                        //             $myTip.hide()
                        //         },2000)
                        //     }
                        //
                        //     $tbody.html(templateHtml)
                        // }else{
                        //     $tbody.html(html)
                        // }

                    utils.get_period(data.doctorRegSourceDetailDTOList);

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