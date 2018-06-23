define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');

    //门诊开业,停业
    $('.isOperating').click(function(){
        var $self = $(this)
        $tr = $(this).parent().parent()
        var id = $tr.attr('data-id'),
            statue = $(this).attr('data-statue'),
            operatingState = ''
        console.log(statue)
        var msgHtml = ''
        var title =''
        if(statue==1){
            msgHtml = '<h5>确定要设置该门诊为暂停业吗？</h5>'
            title='暂停业设置成功！'
            operatingState = 2
        }else{
            msgHtml = '<h5>确定要设置该门诊为运营中吗？</h5>'
            title='运营中设置成功！'
            operatingState = 1
        }
        console.log('statue:'+statue)
        var popup = new utils.Popup({
            msg:'<aside>'+msgHtml+'</aside>',
            okText:'确定',
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "id":id,
                    "operatingState":operatingState   //0未开业，1运营中，2暂停业
                }
                console.log('bizParam:',bizParam)
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/treats/clinic/one/statue',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        console.log(typeof json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title
                            }).hideMsg(function(){
                                    var $tdFirst = $tr.find('td').eq(0)
                                    if (statue==1){
                                        $self.attr('data-statue','2')
                                        $tdFirst.find('p').html('<em class="statue redBg">暂停业</em>')
                                        $self.html('<span>开业</span>')
                                    }else{
                                        $self.attr('data-statue','1')
                                        $tdFirst.find('p').html('<em class="statue">运营中</em>')
                                        $self.html('<span class="red">停业</span>')
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
        console.log(popup)
    })



    //置顶
    $('.top').click(function(){
        var $self = $(this)
        $tr = $self.parent().parent()
        var goodsId = $tr.attr('data-goodsid')
        var priority = $tr.attr('data-priority')
        console.log('priority:'+priority)
        var title = '';
        var msg = ''
        if (priority==1){
            title = '置顶';
            msg = '置顶套餐靠前显示在列表中，确定置顶该套餐？'
        }else{
            title = '取消置顶'
            msg='取消置顶套餐将不再靠前显示，确定取消置顶该套餐？'
        }

        var popup = new utils.Popup({
            msg:msg,
            okText:'确定'+title,
            okCallback:function(){
                var bizParam = {
                    "goodsId":goodsId,
                    "priority":priority,
                    "goodsOperLog":{
                        "operatorId":"1",
                        "operatorName":"后台管理员"
                    }
                }
                console.log(bizParam)
                utils.myAjax({
                    type:'put',
                    data:bizParam,
                    url:'/screening/meal/one/priority',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title+'成功!!'
                            }).hideMsg(function(){
                                    var $tdFirst = $tr.find('td').eq(0)
                                    if (priority==1){
                                        $tr.attr('data-priority','2')
                                        $tdFirst.append('<p class="statue">已置顶</p>')
                                        $self.html('<span>取消置顶</span>')
                                    }else{
                                        $tr.attr('data-priority','1')
                                        $tdFirst.find('.statue').remove()
                                        $self.html('<span>置顶</span>')
                                    }
                                })

                        }else{
                            console.log('333333333')
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title+'失败!!'
                            }).hideMsg()
                        }
                    }
                })


            }
        })
        console.log(popup)
    })

});
