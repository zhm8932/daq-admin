define(function(require,exports,module) {
    //require('jquery')
    //var utils = require('utils');
    var config = require('./config');
    var utils = require('./utils');
    require('./libs/md5');

    // var hash = hex_md5("123456");

    function md5(str) {
        return hex_md5(str).toUpperCase();
    }

    // console.log("hash:",hash.toUpperCase());

    

    function login(){
        $.ajax({
            type:'post',
            url:'/login',
            data:{
                "password":md5($(".password").val()),
                "account":$(".username").val()
            },
            success:function(json){
                // console.log(json)
                var json = JSON.parse(json)
                console.log(typeof json)
                if(json.success){
                    if(json.data.noRole){
                        new utils.MsgShow({
                            delayTime:2000,
                            title:'您没有登录权限！'
                        }).hideMsg()
                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:'登录成功!!'
                        }).hideMsg(function(){
                            window.location='/'

                        })
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
    //登录
    $('.submitBtn').click(function(){
        login()

    })

    $(window).on('keydown',function(e){
        if(e.keyCode=='13'){
            login()
        }
    })



});
