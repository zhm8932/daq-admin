define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    require('./diyUpload.js');
    var move = require('./move');

    $('#images').diyUpload({
        "bReplace":true,
        "browse_button":"selectfiles_images",  //文件选择按钮
        "postfiles":'postfiles_images',   //文件上传按钮
        "previewImageBox":"previewImage_images",  //图片预览
        "stroageImgBtn":"#images",                  //图片存储区域 隐藏域
        "businessId":24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
    })

    // function tab(hd,con){
    //     var $hdeles = $(hd).children();
    //     var $coneles = $(con).children();
    //     if(!$hdeles.hasClass('on')){
    //         $hdeles.first().addClass('on')
    //     }
    //     $coneles.first().show()
    //     // var index = $('.tabBox .hd .on').index();
    //     var index = $(hd).find('.on').index();
    //     // console.log("index:",index)
    //     $coneles.eq(index).show().siblings().hide();
    //     $hdeles.click(function(){
    //         index = $(this).index();
    //         $(this).addClass('on').siblings().removeClass();
    //         $coneles.eq(index).show().siblings().hide()
    //     })
    // }

    utils.tab('.tabBox .hd','.tabBox .con');

    new move.Move();

    $('.submitBtn').click(function(){

        var type = $('.tabBox').find('.on').children('input').val();
        var images = $("#images").val();
        var imgUrl = '';
        var id = $("#id").val();
        var title = '';
        var part1 = new RegExp("/activity/index");
        var part2 = new RegExp("/activity/health");

        var pathname = window.location.pathname;
        var url = pathname=='/activity/add'?'/activity/add':'/activity/update';
        if(pathname=='/activity/add'){
            url = '/activity/add';
            title='首页banner新增成功'
        }else if(part1.test(pathname)){
            url = '/activity/index/update';
            title='首页banner修改成功'
        }else if(pathname=='/activity/healths/add'){
            url = '/activity/healths/add';
            title='健康科普Banner新增成功'
        }else if(part2.test(pathname)){
            url = '/activity/health/update';
            title='健康科普Banner修改成功'
        }
        var displayOrder = parseFloat($('.displayOrder').val())||100,
            link = $('.link1').val()||$('.link2').val(),
            category = $('#category').find('option:selected').val(),
            descText = $(".descText").val();

        console.log(url)
        console.log(images.length);

        if(!images.length){
            //alert('请先上传banner图片')
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"请先上传banner图片"
            }).hideMsg();
            return
        }else if(displayOrder<0||displayOrder>10000000000){
            var myMsg = new utils.MsgShow({
                delayTime:2000,
                title:"排序必须在0-10000000000之间"
            }).hideMsg();
            return
        }else{
            if(typeof images=='object'){
                images = JSON.parse(images);
                imgUrl = images[0]
            }else{
                imgUrl = images
            }
            var data = {
                "displayOrder":displayOrder,
                "imgUrl":imgUrl,
                "link":link,
                "type":type,
                "category":category,
                "descText":descText
            }
            if(id){
                data.id = id;
            }
            $.ajax({
                type:'POST',
                data:data,
                url:url,
                success:function(json){
                    var json = JSON.parse(json);
                    console.log(json)
                    if(json.success){
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:title
                        }).hideMsg(function(){
                               // window.location.reload();
                                var part1 = new RegExp("/activity/index");
                                var part2 = new RegExp("/activity/health");
                                if(pathname=='/activity/add'){
                                    window.location.href='/activity/index'
                                }else if(part1.test(pathname)){

                                    window.location.href='/activity/index'
                                }else if(pathname=='/activity/healths/add'){
                                    window.location.href='/activity/health'
                                }else if(part2.test(pathname)){
                                    window.location.href='/activity/health'
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

});
