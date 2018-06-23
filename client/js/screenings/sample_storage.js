define(function(require,exports,module) {
    var utils = require('../utils');
    var config = require('../config');

    function randomNum(n) {
        var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }


    var $sampleCode = $('.sampleCode');
    function add_code(data,cb,serviceType) {
        // console.log("data:",data)
        var serviceType = serviceType||1;
        $.ajax({
            type:'POST',
            data:data,
            url:'/screening/booking/add_code',
            success:function(json){
                ////console.log(json)
                var json = json
                if(json.success){
                    cb&&cb(data,serviceType);
                }else{
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:json.msg
                    }).hideMsg()
                }


            }
        })
    }
    var randomCode = '';
    var serviceTypeArr = ['','门诊取样','上门取样','快递取样'];
    $('body').on('click','.serchBtn',(function(){
        var $self = $(this);
        var reservationId=$('.reservationId').val();
        $self.data('serviceType','');
        $self.data('storage','');
        $self.data('reservationStatus','');
        $self.data('sampleCode','');
        var bizParam = {
            "bSend":true,
            "reservationId": reservationId
        };
        $sampleCode.val('');
        if(!reservationId){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请填写订单编号"
            }).hideMsg()
            return
        }else if(reservationId.length!=19||isNaN(reservationId)){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请输入正确的订单编号"
            }).hideMsg();
            return
        }
        $.ajax({
            type:'get',
            data:bizParam,
            url:'/screening/booking/get_code',
            beforeSend:function () {
              $self.text('查询中…')
            },
            success:function(json){
                $self.text('查询')
                var json = json;
                var msg  = ''
                var storageArr=['未入库','已入库'],
                    serviceType = serviceTypeArr[json.serviceType],
                    msg=serviceType;
                $self.data('serviceType',json.serviceType);
                $self.data('storage',json.storage);
                $self.data('reservationStatus',json.reservationStatus);
                if(json.serviceType==1){
                    // msg = '门诊取样：请手动输入采用编码';
                    // $sampleCode.val(json.sampleCode)
                    if(!randomCode){
                        randomCode = randomNum(8);
                    }
                    if(json.storage==0&&json.reservationStatus<=1150){  //未入库前
                        $self.data('sampleCode',json.sampleCode);
                        if(json.sampleCode==0){  //采用编码为零，自动生成一个
                            $sampleCode.val(randomCode)
                            return
                        }else{
                            $sampleCode.val(json.sampleCode)
                        }

                    }else{
                        $sampleCode.val(json.sampleCode)
                    }


                }else{
                    if(json.success){
                        var sampleCode = json.data;
                        ////console.log(typeof sampleCode)
                        if(typeof sampleCode=='object'){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'暂无采样编码'
                            }).hideMsg();
                            return;
                        }
                        $sampleCode.val(sampleCode)
                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:json.msg
                        }).hideMsg()
                    }
                }
				if(json.serviceType){
					$('.msg').html(msg+'：'+storageArr[json.storage])
				}
                

            }
        })
    }))

    $('body').on('focus','.reservationId',function () {
        $('.msg').html('')
    })

    $('body').on('change keyup keydown','.reservationId',function () {
        $sampleCode.val('')
    })
    $('body').on('click','.submitBtn',(function(){
        var $self = $(this)
        var id = $self.parent().parent().attr('data-id');
        var reservationId=$('.reservationId').val();
        var sampleCode=$sampleCode.val();
        var bizParam = {
            "sampleCode":sampleCode,
            "reservationId": reservationId
        }
        ////console.log(bizParam)
        if(!reservationId){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请填写订单编号"
            }).hideMsg()
            return
        }
        if(!sampleCode){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请填写采样编码"
            }).hideMsg()
            return
        }
        var $serchBtn= $('.serchBtn');
        var storage = $serchBtn.data('storage');
        var serviceType = $serchBtn.data('serviceType');
        var reservationStatus = $serchBtn.data('reservationStatus');
        var sampleCode = $serchBtn.data('sampleCode');

        if(serviceType==1&&storage==0&&reservationStatus==1150){  //门诊取样，未入库，样品入库
            if(sampleCode==0){   //为添加采用编码时，自动添加采样编码，然后入库
                add_code(bizParam,sample_storage,serviceType)
            }else{  //已添加采样编码的，直接入库
                sample_storage(bizParam,serviceType)
            }


        }else{
            sample_storage(bizParam,serviceType)
        }

    }))

    //样品入库
    function sample_storage(bizParam,serviceType) {
        // console.log("serviceType:",serviceType)
        $.ajax({
            type:'POST',
            data:bizParam,
            url:'/screening/booking/sample_storage',
            beforeSend:function () {
                $('.submitBtn').html('样品入库中……')
            },
            success:function(json){
                ////console.log(json)
                // console.log("serviceType:",serviceType,serviceTypeArr[serviceType])
                var json = json;
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:json.msg
                    }).hideMsg()
					$('.msg').html(serviceTypeArr[serviceType]+'：已入库');
                    $sampleCode.val('')
                }else{
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:json.msg
                    }).hideMsg()
                }
                $('.submitBtn').html('确定入库')


            }
        })
    }

});