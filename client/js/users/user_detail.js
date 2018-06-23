define(function(require,exports,module) {
    var utils = require('../utils');
    var config = require('./../config');
    console.log(utils)
    require('swipebox');

    var $tabSpan = $('.tab .hd span');
    var search = window.location.search||"?type=order";
    console.log(search)
    // $tabSpan.click(function () {
    //     var $self = $(this);
    //     $(this).addClass('on').siblings().removeClass()
    //     var href = $self.attr('href');
    //     console.log($self)
    // })
    $.each($tabSpan,function (index,item) {
        if($(item).find('a').attr('href')==search){
            $(this).addClass('on').siblings().removeClass('on')
        }
    })
    //账号状态
    $('.statueBtn').click(function(){
        var $statueBtn = $('.statueBtn')
        var $status = $('.status')
        var curStatues = $(this).attr('data-statues')
        var statues = curStatues=='normal'?'disable':'normal';
        var title = curStatues=='normal'?'禁用':'解禁';
        console.log(statues)
        var accountId = $("#content").attr('data-accountid')
        var popup = new utils.Popup({
            msg:'<aside><h5>确认禁用该账号？</h5><p><label>备注：</label><textarea id="textarea"></textarea></p></aside>',
            okText:'确定'+title,
            width:'360',
            okCallback:function(){
                var bizParam = {
                    "accountId": accountId,
                    "status": statues
                }
                utils.myAjax({
                    type:'PUT',
                    data:bizParam,
                    url:'/users/account/change_statue',
                    success:function(json){
                        var json = JSON.parse(json)
                        console.log(json)
                        if(json.success){
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:title+'成功!!'
                            }).hideMsg(function(){
                                    if(curStatues=='normal'){
                                        $statueBtn.addClass('redBg').attr('data-statues','disable').html('禁用')
                                        $('.status').html('违禁')
                                    }else if(curStatues=='disable'){
                                        $statueBtn.removeClass('redBg').attr('data-statues','normal').html('解禁')
                                        $('.status').html('正常')
                                    }
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
        console.log(popup)
    })

    var avatarArr = [];
    $('body').on('click','.historyAvatar',function () {
        console.log('获取用户图像');
        if(!avatarArr.length){
            get_history_avatar();
        }else{
            $.swipebox(avatarArr);
        }

    });
    function get_history_avatar() {
        $.ajax({
            type: 'post',
            data: {accountId:$('.accountId').text()},
            url: '/users/account/get_history_avatar',
            success: function (json) {
                var json = JSON.parse(json);
                if(json.success){
                    var data = json.data;
                    for(var i in data){
                        avatarArr.push({href:data[i]})
                    }
                    if(!avatarArr.length){
                        new utils.MsgShow({
                            delayTime:2000,
                            title:'暂无历史头像'
                        }).hideMsg()
                    }else{
                        $.swipebox(avatarArr);
                    }
                }
            }
        })
    }

    require('../chats')
    // require('../interacts/consult')


});
