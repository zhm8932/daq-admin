define(function(require,exports,module) {
    var utils = require('../utils');
    var config = require('../config');
    require("moment")
    require("daterangepicker");

    $(function(){

        var $body = $('body');
        var $region = $('.region')
        var $area = $('.area');
        $body.on('mouseleave','.area',function () {
            $(this).hide();
        })
        $('.provinces > li > em').click(function () {
            var $self = $(this)
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            $self.next().show().parent().siblings().find('.citys').hide();
            var id = $self.attr('data-id');
            $('.province').val(id)
        })
        $('.citys > ul > li > em').click(function () {
            var $self = $(this)
            console.log($self.text())
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            $self.next().show().parent().siblings().find('.districts').hide();
            var id = $self.attr('data-id');
            $('.city').val(id)
        })

        $('.districts li em').click(function () {
            var $self = $(this);
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            var $emOn  = $('.provinces').find('em.on');
            var cityHtml = '';
            var id = $self.attr('data-id');
            $('.district').val(id);
            $.each($emOn,function (index,item) {
                cityHtml+=$(item).text()
            })
            $region.val(cityHtml)
            $('.area').hide();
        })
        $body.on('click','.region',function () {
            $('.area').show()
        })

        $('.time').daterangepicker({
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
            $('.time').val(start.format('YYYY-MM-DD'));
        });


        $('body').on('click','.submitBtn',function () {
            var serialize = $('.formBox').serialize()
            // var serializeObj = utils.stringJSON(serialize);
            var serializeObj = {};
            console.log(serialize)
            console.log(serializeObj)
            var key= ''
            $.each($('.formBox').find('input,textarea,select'),function (index,item) {
                key =$(item).attr('name')
                serializeObj[key] = $(item).val()
            })
            console.log(serializeObj)
            if(!serializeObj.hospitalName){
                new utils.MsgShow({
                    delayTime:2000,
                    title:"请输入门诊名称"
                }).hideMsg()
                return
            }
            if(!serializeObj.establishedTime){
                new utils.MsgShow({
                    delayTime:2000,
                    title:"请输入成立时间"
                }).hideMsg()
                return
            }
            if(!serializeObj.region){
                new utils.MsgShow({
                    delayTime:2000,
                    title:"请输入门诊地区"
                }).hideMsg()
                return
            }

            console.log(serializeObj)
            utils.myAjax({
                type:'POST',
                data:serializeObj,
                url:'/treats/clinic/add',
                success:function(json){
                    console.log(json)
                    var json = JSON.parse(json);
                    if(json.success){
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:'新增门诊成功'
                        }).hideMsg(function () {
                            window.location='/treats/clinic'
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



});
