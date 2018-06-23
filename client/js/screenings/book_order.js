define(function(require,exports,module) {
    var utils = require('../utils');
    var config = require('../config');
    var moment = require("moment")
    var daterangepicker = require("daterangepicker")
    var moment = window.moment;

    var $body = $('body');
    var $tbody = $('.table tbody');

    var dataObj = [];
    var transmitTypeHtml = '';  //取样方式
    var addressHtml ='' ; //取样地址
    var addressHtmlTo ='' ; //取样地址
    var idArr = []
    //添加预约
    function add_order() {
        var password=$('.password').val();
        var bizParam = {
            "password": password
        };
        var $tbody = $('.table tbody');
        if(!password){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请输入套餐密码"
            }).hideMsg()
            return
        }
        utils.myAjax({
            type:'POST',
            data:bizParam,
            url:'/screening/order/book_order',
            success:function(json){
                var json = json;
                var html='';
                if(json.success){
                    var data = json.data;
                    var goodsInfo = data.goodsInfo;
                    var transmitItemsHtml = '';
                    var transmitTypeObj = {"sampling_home":"上门取样","sampling_delivery":"快递收样","sampling_clinic":"门诊取样"};
                    var id = data.id;
                    var trId = '';
                    var addressHtml = '服务区域：';
                    var $tr = $tbody.find('tr');
                    var bIsert = true;
                    $.each($tr,function(index,item) {
                        trId=$(item).attr('data-id');
                        if(trId==id){
                            bIsert = false;
                        }
                    })
                    if(bIsert){
                        dataObj.push(data);
                        console.log('dataObj:',dataObj);
                        if(goodsInfo.transmitItems){
                            var transmitItemsArr = JSON.parse(goodsInfo.transmitItems);

                            for(var i=0,len=transmitItemsArr.length;i<len;i++){
                                if(transmitItemsArr[i].name!=''){
                                    if(i<len-1){
                                        transmitItemsHtml+=transmitItemsArr[i].name+'，'
                                    }else{
                                        transmitItemsHtml+=transmitItemsArr[i].name
                                    }
                                }

                            }
                        }
                        var transmitType='';
                        if(goodsInfo.transmitType){
                            transmitType = JSON.parse(goodsInfo.transmitType)
                            for(var key in transmitType){
                                transmitTypeHtml = transmitTypeObj[key];
                            }
                        }

                        if(goodsInfo.address){
                            var address = JSON.parse(goodsInfo.address)
                            $.each(address,function (index,item) {
                                addressHtml+=item.name
                            })
                            if(!addressHtmlTo) {
                                addressHtmlTo=addressHtml;
                            }
                            // if(!transmitType.sampling_clinic){
                            //     addressHtml=''
                            // }

                        }

                        html+='<tr data-id='+data.id+' class='+data.id+' data-transmitType='+transmitTypeHtml+' data-address='+addressHtml+' data-transmitItems='+transmitItemsHtml+'><td><input type="checkbox"></td><td>'+data.id+'</td><td>'+new Date().Format("yyyy-M-d h:m:s")+'</td><td><p>'+transmitTypeHtml+'</p><p>'+addressHtml+'</p></td><td><p><a href="/screening/meal/detail/'+goodsInfo.goodsId+'",target="_blank">'+goodsInfo.goodsName+'</a><em>('+data.password+')</em></p>样本类型：'+transmitItemsHtml+'<p>检测人群：'+goodsInfo.fitPeople+'</p></td><td>'+data.goodsInfo.moblie+'</td></tr>'

                        var bTrue = $tbody.attr('data-bTrue')
                        if(bTrue){
                            $tbody.attr('data-bTrue',true).append(html)
                        }else{
                            $tbody.attr('data-bTrue',true).html(html)
                        }
                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            width:320,
                            title:'订单已添加套餐列表，请勿重复添加！'
                        }).hideMsg()
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

    var transmitType='';
    var address='';
    var transmititems='';
    var transmitTypeNew='';
    var id =''
    //选中
    $body.on('click','.table tbody tr td input',function (e) {
        //e.stopPropagation()
        var $self = $(this);
        var $tr = $self.parent().parent();
        if($self.prop('checked')){
            if(transmitType==''){
                transmitType =$tr.addClass('checked').attr('data-transmittype');
                address =$tr.attr('data-address');
                transmititems =$tr.attr('data-transmititems');
                id =$tr.attr('data-id');
                idArr.push(id)
            }else if(transmitType&&transmitType!=$tr.attr('data-transmittype')){
                $(this).prop('checked',false);
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:'[取样方式]不一致，请重新选择'
                }).hideMsg()
            }else if(address&&address !=$tr.attr('data-address')){
                $(this).prop('checked',false);
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:'[取样地址]不一致，请重新选择'
                }).hideMsg()
            }else{
                transmitType =$tr.addClass('checked').attr('data-transmittype');
                address =$tr.attr('data-address');
                transmititems =$tr.attr('data-transmititems');
                id =$tr.attr('data-id');
                idArr.push(id)
            }
            // console.log('idArr::',idArr)
            //$(this).prop('checked',true)

        }else{
            $tr.removeClass('checked')
            $(this).prop('checked',false)
            transmitType = $tbody.find('tr.checked').attr('data-transmittype') //获取第一个选中的取样方式
            address = $tbody.find('tr.checked').attr('data-address') //获取第一个选中的地区
            id =$tr.attr('data-id');
            for(i in idArr){
                if(idArr[i]==id){
                    idArr.splice(i,1)
                }
            }
            console.log('idArr2::',idArr)
        }

        // console.log('transmittype:',transmitType)
    })

    function yuyue() {
        var dataObjNew = [];
        for(arr in dataObj){
            for(i in idArr){
                if(idArr[i]==dataObj[arr].id){
                    // dataObj.splice(arr,1)
                    dataObjNew.push(dataObj[arr])
                }
            }
        }
        var addressObj =dataObjNew[0].goodsInfo.address;
        var moblie =dataObjNew[0].goodsInfo.moblie?dataObjNew[0].goodsInfo.moblie:'';
        var reservationsId = [];
        var goodsName = ''
        for (i in dataObjNew){
            reservationsId.push({"id":dataObjNew[i].id});
            goodsName+='<p>'+dataObjNew[i].goodsInfo.goodsName+'</p>'
        }
        // console.log('reservationsId:',reservationsId)

        var msg = '<h2>确认预约</h2>' +
            '<ul><input type="hidden" name="accountId" value='+moblie+'><input type="hidden" name="customerId" value=""><li><label>已选套餐：</label><input type="hidden" name="reservations" value='+JSON.stringify(reservationsId)+'><aside>'+goodsName+'</aside></li>' +
            '<li><label>受检人：</label><input type="text" name="checkedName" class="checkedName" placeholder="请输入受检人姓名"></li>' +
            '<li><label>联系电话：</label><input type="text" name="telNum" class="telNum" placeholder="请输入联系电话"></li>' +
            '<li><label>样品种类：</label><input type="text" name="transmititems" class="transmititems" value="'+transmititems+'" disabled></li>' +
            '<li><label>取样方式：</label><input type="text" name="transmitType" class="transmitType" value="'+transmitType+'" disabled></li>' +
            '<li><label>取样地址：</label><input type="hidden" name="addressObj" class="addressObj" value='+addressObj+'><input type="text" name="address_area" class="address_area" value="'+address+'" disabled></li>'
        if(transmitType=='快递收样'){
            msg +='<li><label>详细地址：</label><input type="text" name="address" class="address"></li>';
        } else if(transmitType=='上门取样'){
            msg +='<li><label>详细地址：</label><input type="text" name="address" class="address"></li><li><label>取样时间：</label><input type="text" name="time" class="time"></li>';
        }else if(transmitType=='门诊取样'){
            msg +='<li><label>就诊门诊：</label><select name="address" class="hospital"></select></li><li><label>预约时间：</label><input type="text" name="time" class="time"></li>';
        }

        msg+='</ul>';
        var serializeObj = {};
        var key = ''

        var popup = new utils.Popup({
            msg:msg,
            okText:'提交预约',
            isHide:false,
            otherBox:'yuyueBox',
            callback:function () {
                $('.time').daterangepicker({
                    "startDate": moment().add('days',1),
                    // "endDate": moment().subtract('days', 6),
                    // startDate: moment().subtract('days', 29),
                    "singleDatePicker": true,
                    "showDropdowns": true,
                    "autoUpdateInput": false,   //默认为空
                    "timePicker24Hour": true,
                    timePicker: true,
                    timePickerIncrement: 30,
                    // maxDate :  moment().subtract('days', -14), //最大时间
                    maxDate :  moment().add(14,'days'),
                    // minDate :  moment().startOf('day',-1), //最小时间
                    minDate :  moment().add('days'), //最小时间 至少提前一天
                    rangesHour:[8,18],   //限制选择8-18小时内
                    dateLimit : {
                           days : 14
                    }, //起止时间的最大间隔
                    locale : {
                        format : 'YYYY-MM-DD HH:mm',
                        daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                        monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                            '七月', '八月', '九月', '十月', '十一月', '十二月' ]
                    }
                }, function(start, end, label) {
                    $('.time').val(start.format('YYYY-MM-DD HH:mm'));
                });

                if(transmitType=='门诊取样'){
                    get_hospital()
                }

            },
            okCallback:function(){

                var key = '';
                $.each($(".yuyueBox").find('input,textarea,select'),function (index,item) {
                    key =$(item).attr('name');
                    serializeObj[key] = $(item).val();
                    if(typeof serializeObj[key]=='object'){
                        serializeObj[key] = JSON.stringify(serializeObj[key])
                    }
                });
                if(!serializeObj.checkedName){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请输入受检人！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.telNum){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请输入联系电话！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.address){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请选择就诊门诊或详细地址！'
                    }).hideMsg();
                    return
                }

                utils.myAjax({
                    type:'post',
                    data:serializeObj,
                    url:'/screening/order/add_reservation',
                    success:function(json){
                        var json = json;
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'预约成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove();
                                transmitType ='';
                                address='';
                                serializeObj = {};

                            })
                            popup.hideBox();
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

        // popup.hideBox(function () {
        //     console.log('77777')
        // })
    }
    //就诊门诊获取
    function get_hospital() {
        var addressObj = $('.addressObj').val();
        utils.myAjax({
            type:'post',
            data:{addressObj:addressObj},
            url:'/treats/doctor/get_hospital_area',
            success:function(json){
                // console.log(json)
                var  json= JSON.parse(json);
                var html = '<option value="">请选择门诊</option>'
                if(json.success){
                    var data = json.data;
                    $.each(data,function (index,item) {
                        html +='<option value='+item.alias+'>'+item.alias+'</option>'
                    })
                    $('.hospital').html(html)

                }else{
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:json.msg
                    }).hideMsg()
                }


            }
        })
    }

    //确定预约
    $body.on('click','.yuyueBtn',function () {
        // console.log('transmitTypeHtml:',transmitTypeHtml)
        // console.log('addressHtmlTo:',addressHtmlTo)
        // console.log($tbody.find('input').prop('checked'))
        // console.log($tbody.find('input').length);

        var $inputs =$tbody.find('input')
        var bChecked = false;
        var select_transmitType = ''
        var select_address = ''
        $.each($inputs,function (index,item) {
            if($(item).prop('checked')){
                bChecked = true;
                select_transmitType = $(item).parent().parent().attr('data-transmittype')
                select_address = $(item).parent().parent().attr('data-address')
            }
        })
        // console.log('bChecked:',bChecked)
        // console.log('select_transmitType:',select_transmitType)
        // console.log('select_address:',select_address)
        if(!bChecked){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:'请至少选中一个订单'
            }).hideMsg()
            return;
        }


        yuyue()

    })

    $('body').on('click','.submitBtn',(function(){
        add_order();

    }))

    $(window).on('keydown',function (e) {
        if(e.keyCode=='13'){
            add_order();
        }
    })
    
    function Order(options) {
        var defaults = {
            addBtn: '.submitBtn',
            yuyueBtn: '.yuyueBtn',
            input:'.table tr td input'
        }


        this.opts = $.extend({}, defaults, options);
        this.$body = $('body')
        this.init();
    }

    Order.prototype = {
        init:function () {
            var self = this;
            self.$body.on('click', self.opts.addBtn, function () {
                self.getOrder()
            })
            self.$body.on('click', self.opts.input, function () {
                if($(this).prop('checked')){
                    self.select(this)
                }else{
                    self.deselect(this)
                }

            })
        },
        getOrder:function () { //查询订单
            this.render()
            console.log('查询订单')
        },
        select:function(self) {  //选择订单
            console.log('选择订单')
        },
        deselect:function () {  //取消订单
            console.log('取消订单')
        },
        render:function () {  //插入订单
            console.log('插入订单')
        },
        getTransmitType:function () { //获取取样方式
            
        },
        getAddress:function () {  //获取取样地址
            
        },
        yuyue:function () { //确定预约

        }
    }
    //var order = new Order();



});