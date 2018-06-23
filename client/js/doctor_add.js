define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    require('./diyUpload.js')
    var move = require('./move')
    $('#images').diyUpload({
        "bReplace":true,
        "browse_button":"selectfiles_images",  //文件选择按钮
        "postfiles":'postfiles_images',   //文件上传按钮
        "previewImageBox":"previewImage_images",  //图片预览
        "stroageImgBtn":"#images",                  //图片存储区域 隐藏域
        "businessId":23001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
    })
    $(function(){
        function get_department(){
            var id = $('#hospitalId option:selected').val();
            console.log('id:',id)
            var data = {
                "hospitalId": id
            }
            var html = "<option value=''>请选择科室</option>"
            $.ajax({
                type:'POST',
                data:data,
                url:'/treats/doctor/get_department_web',
                success:function(json){
                    console.log(json)
                    var data = json.data
                    $.each(data,function(index,item){
                        html +='<option value="'+item.id+'">'+item.deptName+'</option>'
                    })
                    $("#departmentId").html(html)


                }
            })
        }

        $("#hospitalId").change(function(){
            get_department()
        })


        




        $('body').on('click','.submitBtn',function () {
            var serialize = $('.formBox').serialize()
            // var serializeObj = utils.stringJSON(serialize);
            var serializeObj = {};
            console.log(serialize)
            console.log(serializeObj)
            var key= ''
            $.each($('.formBox').find('input,textarea,select'),function (index,item) {
                key =$(item).attr('name')
                serializeObj[key] = $(item).val()
            })
            console.log(serializeObj)
            if(!serializeObj.telephone){
                console.log('手机号码必填')
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"请输入手机号码"
                }).hideMsg()
                return
            }
            if(!serializeObj.password){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"请填写密码"
                }).hideMsg()
                return
            }
            else if(!serializeObj.repassword){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"请填写确认密码"
                }).hideMsg()
                return
            }
            else if(serializeObj.password&&serializeObj.password!=serializeObj.repassword){
                console.log('密码不一致')
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"密码不一致"
                }).hideMsg()
                return
            }
            // else if(!serializeObj.departmentId){
            //     var myMsg = new utils.MsgShow({
            //         delayTime:2000,
            //         title:"科室id不能为空"
            //     }).hideMsg()
            //     return
            // }
            else if(!serializeObj.titleId){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"医生职称id不能为空"
                }).hideMsg()
                return
            }
            else if(!serializeObj.introduction){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"医生简介不能为空"
                }).hideMsg()
                return
            }
            if(!serializeObj.introduction){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"医生擅长不能为空"
                }).hideMsg()
                return
            }
            if(!serializeObj.doctorPhoto){
                var myMsg = new utils.MsgShow({
                    delayTime:2000,
                    title:"请上传头像！"
                }).hideMsg()
                return
            }
            console.log(serializeObj)
            $.ajax({
                type:'POST',
                data:serializeObj,
                url:'/treats/doctor/add',
                success:function(json){
                    console.log(json)
                    if(json.success){
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:'新增医生成功'
                        }).hideMsg(function () {
                            window.location='/treats/doctor'
                        })

                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:json.msg
                        }).hideMsg()
                    }

                }
            })

        })


        


    })



});
