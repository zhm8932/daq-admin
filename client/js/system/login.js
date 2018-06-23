define(function(require,exports,module) {
    require('../jquery')
    //var utils = require('utils');
    //var config = require('../config');
    //console.log(utils)
    //console.log(config)

    //账号状态
    $('.submitBtn').click(function(){
        $.ajax({
            type:'post',
            url:'/login',
            data:{"password":"111111","account":"13012345678"},
            success:function(json){
                var json = JSON.parse(json)
                console.log(json)


            }
        })

    })



});
