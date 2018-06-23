define(function(require,exports,module){
    var utils = require('../utils');
    var config = require('../config');
    $(function(){
        $('body').on('click','.isEnableBtn',function(){
            var $self = $(this);
            var $tr =$self.parent().parent();
            // console.log($tr);
            var doctorId =$self.parent().parent().attr('data-doctorid');
            var doctorStatus =$self.parent().parent().attr('data-doctorstatus');
            var hospitalid =$self.parent().parent().attr('data-hospitalid');
            var msg='';
            var isEnableTxt = '';
            var statueTxt = '';
            if(doctorStatus==1){
                msg='<h2>禁用医生设置</h2><p>禁用医生后，该医生不可以被预约。是否确定禁用该医生</p>';
                doctorStatus =2;
                isEnableTxt = '启用';
                title = '禁用';
                statueTxt = '禁用';
            }else{
                msg='<h2>启用医生设置</h2><p>启用医生后，该医生可以被预约。是否确定启用该医生</p>';
                doctorStatus =1;
                isEnableTxt = '禁用';
                title = '启用';
                statueTxt = '正常'
            }
            var popup = new utils.Popup({
                msg:msg,
                okText:'确定',
                width:'360',
                isHide:false,
                okCallback:function(){
                    var bizParam = {
                        "doctorId": doctorId,
                        "doctorStatus": doctorStatus,
                        "hospitalid":hospitalid
                    }

                    // $('.'+popup.opts.ok).attr('disabled',true).css({"background":'#F00'})
                    if(doctorStatus==1){
                        //启用
                        utils.myAjax({
                            type:'get',
                            data:bizParam,
                            url:'/treats/clinic/detail',
                            success:function(json){
                                console.log("医生禁用请求成功")
                                if(json.data.operatingState==2){
                                    new utils.MsgShow({
                                        delayTime:2000,
                                        title:'启用失败：该医生所在门诊已被禁用，请先修改'
                                    }).hideMsg()
                                }else{
                                    change_doctorStatus(bizParam,$tr,doctorStatus,isEnableTxt,statueTxt,$self)
                                }
                            }
                        });
                        
                        // utils.myAjax({
                        //     type:'get',
                        //     data:bizParam,
                        //     beforeSend:function () {
                        //       console.log("医生禁用开始请求：",popup)
                        //         // $('.'+popup.opts.ok).attr('disabled',true)
                        //     },
                        //     url:'/treats/clinic/detail',
                        //     success:function(json){
                        //         console.log("医生禁用请求完成")
                        //         // $('.'+popup.opts.ok).attr('disabled',false).css({"background":'#000'})
                        //         // $('.'+popup.opts.ok).attr('disabled',false)
                        //         if(json.data.operatingState==2){
                        //             new utils.MsgShow({
                        //                 delayTime:2000,
                        //                 title:'启用失败：该医生所在门诊已被禁用，请先修改'
                        //             }).hideMsg()
                        //         }else{
                        //             change_doctorStatus(bizParam,$tr,doctorStatus,isEnableTxt,statueTxt,$self)
                        //         }
                        //     }
                        // });
                    }else{
                        //禁用
                        change_doctorStatus(bizParam,$tr,doctorStatus,isEnableTxt,statueTxt,$self)
                    }

                }
            })
        });

        //医生账号禁用启用
        function change_doctorStatus(bizParam,$tr,doctorStatus,isEnableTxt,statueTxt,$self) {
            utils.myAjax({
                type:'PUT',
                data:bizParam,
                url:'/treats/doctor/change_doctorStatus',
                success:function(json){
                    var json = json;
                    if(json.success){
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:title+'医生成功!!'
                        }).hideMsg(function(){
                            $tr.attr('data-doctorstatus',doctorStatus);
                            if(doctorStatus==1){
                                $self.removeClass('red').html(isEnableTxt);
                                $tr.find('.statue').removeClass('redBg').html(statueTxt)
                            }else{
                                $self.addClass('red').html(isEnableTxt);
                                $tr.find('.statue').addClass('redBg').html(statueTxt)
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

        $('body').on('click','.isRecomendBtn',function(){
            var $self = $(this);
            var $tr =$self.parent().parent();
            console.log($tr)
            var doctorId =$self.parent().parent().attr('data-doctorid');
            var isrecommend =$self.parent().parent().attr('data-isrecommend');
            var msg='';
            var recommendType=1;
            var isRecommentTxt = '';
            var url = '';
            if(isrecommend=='true'){
                msg='<h2>取消优医推荐设置</h2><p>是否要取消推荐该医生</p>';
                url='/treats/doctor/delete_doctorRecommend';
                title = '取消优医';
                isRecommentTxt = '优医推荐';
            }else{
                msg='<h2>优医推荐设置</h2><p>是否要推荐该医生？</p>';
                url='/treats/doctor/add_doctorRecommend';
                title = '优医推荐';
                isRecommentTxt = '取消优医';


            }
            var popup = new utils.Popup({
                msg:msg,
                okText:'确定',
                width:'360',
                okCallback:function(){
                    var bizParam = {
                        "doctorId": doctorId,
                        "recommendType": recommendType
                    };
                    utils.myAjax({
                        type:'POST',
                        data:bizParam,
                        url:url,
                        success:function(json){
                            console.log(json);
                            var json = json;
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:title+'成功!!'
                                }).hideMsg(function(){
                                    if(isrecommend=='true'){
                                        $tr.attr('data-isrecommend',false);
                                        $self.addClass('RecommendBtn').removeClass('deleteRecommendBtn red').html(isRecommentTxt)
                                    }else{
                                        $tr.attr('data-isrecommend',true);
                                        $self.addClass('deleteRecommendBtn red').removeClass('RecommendBtn').html(isRecommentTxt)
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

        //收费设置
        $('body').on('click','.isCousultBtn',function(){
            var $self = $(this);
            var $tr =$self.parent().parent();
            console.log($tr)
            var doctorId =$self.parent().parent().attr('data-doctorid');
            var isConsult =$self.parent().parent().attr('data-isConsult');
            var msg='';
            var consultType=1;
            var isConsultTxt = '';
            var url = '';
            var type = 'POST';

            console.log(isConsult);
            if(isConsult=='true'){
                msg='<h2>关闭医生咨询设置</h2><p>是否要关闭医生咨询</p>';
                url='/treats/doctor/delete_doctorConsult';
                title = '关闭医生咨询';
                isConsultTxt = '开通咨询';
                type = 'delete'
            }else{
                msg='<h2>开通医生咨询设置</h2><p>是否要开通医生咨询？</p>';
                url='/treats/doctor/add_doctorConsult';
                title = '开通医生咨询';
                isConsultTxt = '关闭咨询';

            }
            var popup = new utils.Popup({
                msg:msg,
                okText:'确定',
                width:'360',
                okCallback:function(){
                    var bizParam = {
                        "doctorId": doctorId,
                        "consultType": consultType
                    };
                    utils.myAjax({
                        type:type,
                        data:bizParam,
                        url:url,
                        success:function(json){
                            var json = json;
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:title+'成功!!'
                                }).hideMsg(function(){
                                    if(isConsult=='true'){
                                        $tr.attr('data-isConsult',false);
                                        $self.removeClass('red').html(isConsultTxt)
                                    }else{
                                        $tr.attr('data-isConsult',true);
                                        $self.addClass('red').html(isConsultTxt)
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

        $('body').on('click','.chargeBtn',function(){
            var $self = $(this);
            var doctorId =$self.parent().parent().attr('data-doctorid');
            var $needPayStatus = $self.parent().parent().find('.needPayStatus');
            var payInstruction = $self.parent().attr('data-payInstruction');
            var needpay = $self.attr('data-needpay');
            var popup = new utils.Popup({
                msg:'<aside><h2>收费设置</h2>' +
                '<p><em>是否强制线上收费：</em>' +
                '<input type="radio" name="needPay" class="needPay" value="true">是 ' +
                '<input type="radio" name="needPay" class="needPay" value="false">否</p>' +
                '<p><label>请填写支付说明：</label><textarea class="payInstruction" id="payInstruction" name="payInstruction">'+payInstruction+'</textarea></p></aside>',
                okText:'保存',
                width:'360',
                isHide:false,
                callback:function () {
                  var $needPay= $('.needPay');
                    $.each($needPay,function (index,item) {
                        if($(item).val()==needpay){
                            $(item).attr('checked',true)
                        }

                    })
                },
                okCallback:function(){
                    var needPay = $('.needPay:checked').val();
                    var payInstruction = $('.payInstruction').val();
                    var bizParam = {
                        "id": doctorId,
                        "needPay": needPay,
                        "payInstruction": payInstruction
                    };
                    if(!bizParam.needPay){
                        new utils.MsgShow({
                            delayTime:2000,
                            title:'请选择是否强制线上收费'
                        }).hideMsg();
                        return;
                    }
                    var title = needPay=='true'?'收费':'取消收费';
                    utils.myAjax({
                        type:'PUT',
                        data:bizParam,
                        url:'/treats/doctor/charge_doctor',
                        success:function(json){
                            var json = JSON.parse(json);
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:title+'设置成功!!'
                                }).hideMsg(function(){
                                    $self.parent().attr('data-payinstruction',bizParam.payInstruction);
                                    if(needPay=='true'){
                                        $needPayStatus.addClass('red').html('是');
                                        $self.attr('data-needpay',true)
                                    }else if(needPay=='false'){
                                        $self.attr('data-needpay',false);
                                        $needPayStatus.removeClass('red').html('否')
                                    }
                                    popup.hideBoxNoTime();
                                })
                            }else{
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:title+'失败!!'
                                }).hideMsg()
                            }


                        }
                    })



                }
            })
        })



    })
})