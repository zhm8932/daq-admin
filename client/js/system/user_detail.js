define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    console.log(utils)
    console.log(config)

    //账号状态
    $('.submitBtn').click(function(){
        $.ajax({
            type:'PUT',
            data:bizParam,
            url:'/login',
            success:function(json){
                var json = JSON.parse(json)
                console.log(json)
                if(json.code==0){
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
                }


            }
        })

    })



});
