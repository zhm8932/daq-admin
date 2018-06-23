define(function(require,exports,module) {
    var utils = require('../utils');
    var config = require('../config');

    $('body').on('click','.endBtn',(function(){
        var $self = $(this)
        var id = $self.parent().parent().attr('data-id')
        var couponState = $self.attr('data-couponState')
        var $statue = $('.statue')
        var title ='结束'
        var popup = new utils.Popup({
            msg:'<h5>确定结束该优惠券？</h5>',
            okText:'确定'+title,
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "id": id,
                    "couponState": 2
                }
                console.log(bizParam)
                $.ajax({
                    type:'PUT',
                    data:bizParam,
                    url:'/activity/coupon/change_status',
                    success:function(json){
                        console.log(json)
                        var json = json
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title+'成功!!'
                            }).hideMsg(function(){
                                    if(couponState==1){
                                        $self.parent().parent().find('.statue').addClass('redBg').html('手动结束')
                                        $self.prev().remove();
                                        $self.remove();
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
    }))

});