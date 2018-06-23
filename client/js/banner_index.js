define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    //改变banner状态
    $('body').on('click','.opetate_banner',function(){
        var $self = $(this);
        var $tr = $self.parent().parent();
        var postStatus = $self.attr('data-statue');
        var title = '';
        var statueTxt = ''
        var statue = ''
        var operateTxt = ''
        switch(postStatus){
            case '1':
                title = '发布';
                operateTxt='关闭';
                statueTxt = '发布中';
                statue = '2';
                break;
            case '2':
                title = '关闭';
                operateTxt='重新发布';
                statueTxt = '已关闭';
                statue = '3';
                break;
            case '3':
                title = '重新发布';
                operateTxt='关闭';
                statueTxt = '发布中';
                statue = '2';
                break;
        }

        var data = {
            id:$tr.attr('data-id'),
            postStatus:statue
        }
        $.ajax({
            type:'POST',
            data:data,
            url:'/activity/change_statue_banner',
            success:function(json){
                console.log(json)
                var json = JSON.parse(json)

                console.log(typeof json)
                if(json.success){
                    var myMsg = new utils.MsgShow({
                        delayTime:2000,
                        title:title+'成功!!'
                    }).hideMsg(function(){
                            $tr.find('.statue').html(statueTxt)
                            $self.attr('data-statue',statue)
                            $self.html(operateTxt)
                            console.log('postStatus:',postStatus)
                            if(postStatus==2){
                                $tr.find('.statue').addClass('redBg')
                                $self.removeClass('red')
                            }else{
                                $tr.find('.statue').removeClass('redBg')
                                $self.addClass('red')

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
    })


});
