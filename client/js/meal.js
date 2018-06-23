define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    //停用
    $('.disable').click(function(){
        $tr = $(this).parent().parent()
        var goodsId = $tr.attr('data-goodsid')
        console.log('goodsId:'+goodsId)
        var popup = new utils.Popup({
            msg:'<aside><h5>停用的套餐产品将下架，确认停用该套餐？</h5><p><label>备注：</label><textarea id="textarea"></textarea></p></aside>',
            okText:'确定停用',
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "goodsId":goodsId,
                    "goodsState":4
                }
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/meal/one/statue',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        console.log(typeof json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'停用成功!!'
                            }).hideMsg(function(){
                                    $tr.remove();
                                })

                        }else{
                            console.log('333333333')
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'停用失败!!'
                            }).hideMsg()
                        }
                    }
                })



            }
        })
    })
    //启用
    $('.enable').click(function(){
        $tr = $(this).parent().parent()
        var goodsId = $tr.attr('data-goodsid')
        console.log('goodsId:'+goodsId)
        var popup = new utils.Popup({
            msg:'<aside><h5>确认启用该套餐？</h5><p><label>备注：</label><textarea id="textarea"></textarea></p></aside>',
            okText:'确定启用',
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "goodsId":goodsId,
                    "goodsState":2
                }
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/meal/one/statue',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        console.log(typeof json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'启用成功!!'
                            }).hideMsg(function(){
                                $tr.remove();
                            })

                        }else{
                            console.log('333333333')
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:'启用失败!!'
                            }).hideMsg()
                        }
                    }
                })



            }
        })
    })

    //审核中套餐通过,不通过
    $('.isPass').click(function(){
        $tr = $(this).parent().parent()
        var goodsId = $tr.attr('data-goodsid'),
            goodsState = $(this).attr('data-goodsstate')
        console.log(goodsState)
        var msgHtml = ''
        var title = ''
        if(goodsState==2){
            msgHtml = '<h5>通过审核后，套餐将线上展示，确认通过！</h5>'
            title = '套餐审核通过设置成功!'
        }else if(goodsState==3){
            msgHtml = '<h5>请输入不通过的理由</h5><p><label>备注：</label><textarea id="textarea"></textarea></p>'
            title = '套餐审核不通过设置成功!'
        }
        console.log('goodsId:'+goodsId)
        var popup = new utils.Popup({
            msg:'<aside>'+msgHtml+'</aside>',
            okText:'通过',
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "goodsId":goodsId,
                    "goodsState":goodsState   //商品状态：1,.审核中，2.显示中，3.审核不通过，4.已停用
                }
                console.log('bizParam:',bizParam)
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/screening/meal/one/statue',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        console.log(typeof json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title
                            }).hideMsg(function(){
                                    $tr.remove();
                                })

                        }else{
                            console.log('333333333')
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:data.msg
                            }).hideMsg()
                        }
                    }
                })



            }
        })
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
                                        $tdFirst.append('<p><span class="statue">已置顶</span></p>')
                                        $self.html('<span>取消置顶</span>')
                                    }else{
                                        $tr.attr('data-priority','1')
                                        $tdFirst.find('p').remove()
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
