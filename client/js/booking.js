define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    console.log(utils)
    console.log(config)
    $('.top').click(function(){

        console.log('88888')
        var popup = new utils.Popup({
            msg:'置顶套餐靠前显示在列表中，确定置顶该套餐？',
            okText:'确定置顶',
            isHide:false,
            okCallback:function(){
                $.ajax({

                })
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:'置顶成功!!'
                }).hideMsg()

            }
        })
        console.log(popup)
    })


    $('.cancelBooking').click(function(){

        console.log('88888')
        var popup = new utils.Popup({
            msg:'用户已到门诊就诊',
            okText:'确定登记',
            isHide:false,
            okCallback:function(){
                console.log('登记成功')
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:'登记成功!!'
                }).hideMsg()

            }
        })
        console.log(popup)
    })

});