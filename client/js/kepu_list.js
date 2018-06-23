define(function(require,exports,module) {
	var utils = require('utils');
    var config = require('./config');

    //获取所有类目
    var menudata = {"type":"article_category","level":"1","activeState":"1"};
    utils.SendAjax({
        url: '/dataDic/category',
        param: menudata,
        tipText: '获取类目',
        callback: function (result) {
            var options = result.data;
            var html = "<option value='all'>所有</option>";
            for(var i = 0; i < options.length; i++){
                var selectedCat = $('#selectedCat').val();
                if(selectedCat == options[i].id){
                    html += "<option value='"+options[i].id+"' selected>"+options[i].name+"</option>";
                }else{
                    html += "<option value='"+options[i].id+"'>"+options[i].name+"</option>";
                }
            }
            $("#category").html(html);
        }
    });

    var selectedPostStatus = $('#selectedPostStatus').val();
    // $("#publishState option[value=" + selectedPostStatus +"]").attr('selected','selected');
    $("#publishState option[value=" + selectedPostStatus +"]").attr('selected','selected');

    $('.edit').on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var idVal = $(this).parent().find('.idVal').val();
        window.location.href = '/kepu/modifyView?id=' + idVal;
    });

    $('.cancelPub').on('click',function(e){
        changeArticleState(e,this,'取消发布','postStatus','pending');
    });

    $('.recommend').on('click',function(e){
        changeArticleState(e,this,'推荐','status','1');
    });

    $('.cancelRec').on('click',function(e){
        changeArticleState(e,this,'取消推荐','status','0');
    });


    function changeArticleState(e,obj,tipText,paramKey,paramValue){
        e.stopPropagation();
        e.preventDefault();
        var popup = new utils.Popup({
            msg:'确定'+tipText+'该文章吗？',
            okText:'确定'+tipText,
            okCallback:function(){
                var idVal = $(obj).parent().find('.idVal').val();
                var param = {changeState:true,id:idVal};
                param[paramKey] = paramValue;
                utils.SendAjax({
                    url: '/kepu/modify',
                    method:'POST',
                    param: param,
                    tipText: tipText,
                    callback: function () {
                        window.location.reload();
                    }
                });
            }
        })
    }

});



