define(function(require,exports,module) {
    var utils = require('../utils');
    var moment = require("moment");
    var daterangepicker = require("daterangepicker");
    require('./schedule_com');

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

    function getObj(name,serializeObj,$self) {
        var $ele = $('.'+name,$self);
        var nameArr = [];
        $.each($ele,function (i,item) {
            if($(item).val()){
                nameArr.push($(item).val())
            }

        })
        serializeObj[name] = nameArr;
    }
    $('body').on('click','.saveBtn',function () {
        var $self = $(this);
        var $selfTable = $self.parents('.table');
        var serialize = $('.formBox').serialize();
        var serializeObj = {};
        console.log(serializeObj);
        var key= '';
        $.each($self.parents('.table').find('input,textarea,select'),function (index,item) {
            key =$(item).attr('name');
            serializeObj[key] = $(item).val()
        })

        getObj('start',serializeObj,$selfTable);
        getObj('end',serializeObj,$selfTable);
        getObj('capacity',serializeObj,$selfTable);
        getObj('cost',serializeObj,$selfTable);
        var sourceList = [];
        for(var i = 0,len =serializeObj.start.length; i < len; i++){
            sourceList.push({
                "start":serializeObj.start[i],
                "end":serializeObj.end[i],
                "capacity":serializeObj.capacity[i],
                "cost":serializeObj.cost[i]*100
            });
        }
        delete serializeObj.start;
        delete serializeObj.end;
        delete serializeObj.capacity;
        delete serializeObj.cost;
        serializeObj.regSourceTemplateDetailDTOList=sourceList;

        var url = '/scheduling/numbers/update_template';
        var title = '修改'
        if(!serializeObj.id){
            url = '/scheduling/numbers/add_template';
            title='新增';
        }
        if(!sourceList.length){
            new utils.MsgShow({
                delayTime:2000,
                title:'请填写模板相关数据'
            }).hideMsg()
            return false;
        }
        $.ajax({
            type:'put',
            data:serializeObj,
            url:url,
            success:function(json){
                console.log(json)
                var json = JSON.parse(json);
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:title+'模板成功'
                    }).hideMsg(function () {
                        window.location='/scheduling/numbers/template'
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