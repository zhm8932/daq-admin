define(function(require,exports,module) {
    var utils = require('/js/utils');
    var $body = $('body');
    //修改报告状态
    $body.on('click','.changeStatue',function () {
        var $self = $(this);
        var id = $self.parents().parents().attr('data-id');
        var status = $self.parents().parents().attr('data-status');
        var serviceType = $self.parents().parents().attr('data-serviceType');
        var msg = '';
        var okText = '';

        console.log("status:",status)
        if (status == 2900 || status== 3900||status== 1900){
            msg = '已查到该订单的报告，是否修改预约订单状态为“已出报告”';
            okText='确定报告已出，并更改状态';
        }else{
            msg = '未查到该订单的报告，请核查HIS系统上报告是否已生成。强制修改状态后，不可撤回！';
            okText ='确认报告已生成，强制更改状态'
        }
        var bizParam = {
            id:id,
            // status:status,
            serviceType:serviceType
        }

        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            okCallback:function(){
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/booking/change_report',
                    success:function(json){
                        console.log(json)
                        var json = json;
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'修改报告状态成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove()
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
        console.log(popup)
    })

    //门诊登记
    $body.on('click','.toRegister',function () {
        var $self = $(this)
        var id = $self.parents().parents().attr('data-id')
        var $tr= $self.parents().parents()
        // var status = $self.parents().parents().attr('data-reservationStatus')
        var msg = '<h2>门诊登记</h2>用户已到门诊就诊'
        var okText = '确定登记'

        var bizParam = {
            id:id,
            status:1200
        }

        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            okCallback:function(){
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/booking/register_book',
                    success:function(json){
                        console.log(json)
                        var json = json

                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'门诊登记成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove()
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

    //发货
    $body.on('click','.deliveryBtn',function () {
        var $self = $(this)
        var id = $self.parents().parents().attr('data-id')
        var $tr= $self.parents().parents()
        // var status = $self.parents().parents().attr('data-reservationStatus')
        var msg = '<h2>填写发货信息</h2>' +
                    '<ul><li><label>快递单号：</label><input type="text" name="numbers" class="numbers"></li>' +
                    '<li><label>快递公司：</label><input type="text" name="company" class="company"></li>' +
                    '<li><label>回寄地址：</label><input type="text" name="backAddress" class="backAddress"></li>' +
                    '<li><label>收&nbsp;件&nbsp;人：</label><input type="text" name="addressee" class="addressee"></li>' +
                    '<li><label>联系方式：</label><input type="text" name="telNum" class="telNum"></li>' +
                    '<li><label>快递提示：</label><textarea name="prompt" class="prompt">请选择顺丰标准件陆运，运费到付顺丰热线：95338</textarea></li></ul>'
        var okText = '确定发货'
        var serializeObj = {};
        var key = ''

        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            otherBox:'deliveryBox',
            isHide:false,
            okCallback:function(){
                $.each($(".deliveryBox").find('input,textarea,select'),function (index,item) {
                    key =$(item).attr('name')
                    serializeObj[key] = $(item).val()
                })
                console.log('serializeObj:',serializeObj)
                serializeObj.reservationId=id

                if(!serializeObj.numbers){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请填写快递单号！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.company){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请填写快递公司！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.backAddress){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请填写回寄地址！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.addressee){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请填写收件人！'
                    }).hideMsg();
                    return
                }
                if(!serializeObj.telNum){
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'请填写联系方式！'
                    }).hideMsg();
                    return
                }


                utils.myAjax({
                    type:'post',
                    data:serializeObj,
                    url:'/screening/booking/delivery',
                    success:function(json){
                        console.log(json)
                        var json = json
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'发货成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove()
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
    })

    //安排取样
    $body.on('click','.arrangeNurse',function () {
        var $self = $(this)
        var id = $self.parents().parents().attr('data-id')
        // var status = $self.parents().parents().attr('data-reservationStatus')
        var msg = '<h2>安排取样</h2>安排护士取样？'
        var okText = '确定'

        var bizParam = {
            id:id,
            status:2200
        }

        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            okCallback:function(){
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/booking/arrange_book',
                    success:function(json){
                        console.log(json)
                        var json = json
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'安排取样成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove()
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

    $body.on('click','.cancelBooking',function () {
        var $self = $(this)
        var id = $self.parents().parents().attr('data-id')
        // var status = $self.parents().parents().attr('data-reservationStatus')
        var msg = '<h2>取消预约</h2><p>请确认你已和受检人沟通，并且受检人同意取消本次预约！</p><textarea class="reason" name="reason"></textarea>'
        var okText = '确定'

        var bizParam = {
            id:id
        }

        var popup = new utils.Popup({
            msg:msg,
            okText:okText,
            okCallback:function(){
                bizParam.reason = $('.reason').val();
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/booking/cancle_booking',
                    success:function(json){
                        console.log(json)
                        var json = json

                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'取消预约成功!!'
                            }).hideMsg(function(){
                                $('.'+id).remove()
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