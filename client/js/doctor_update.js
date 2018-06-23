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

    new move.Move()
    $(function(){

        function get_department(){
            var id = $('#hospital option:selected').val();
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
                    //console.log(json)
                    var data = json.data
                    $.each(data,function(index,item){
                        html +='<option value="'+item.id+'">'+item.deptName+'</option>'
                    })
                    //console.log(html)
                    $("#department").html(html)


                }
            })
        }

        $("#hospital").change(function(){
            console.log('2222222222')
            get_department()
        })



    })



});
