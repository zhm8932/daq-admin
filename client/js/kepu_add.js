define(function (require, exports, module) {
    var move = require('./move');
    var bootstrap = require('bootstrap');
    var utils = require('utils');
    var config = require('./config');
    require('./diyUpload.js');

    // $(function(){

    var ue = UE.getEditor('editor', {
        toolbars: [
            ['undo', 'redo', 'bold', 'italic', 'underline', 'fontsize', 'forecolor', 'backcolor', 'strikethrough', 'subscript',
                'fontborder', 'superscript', 'paragraph', 'link', 'unlink', 'simpleupload', 'lineheight',
                'justifyleft', 'justifyright', 'justifycenter']
        ]
    });
    var saveUrl = $("#action").val();

    if (saveUrl == '/kepu/modify') {
        new move.Move();
        var contentVal = $('#contentVal').val();
        if (contentVal) {
            ue.ready(function () {
                //设置编辑器的内容
                ue.setContent(contentVal);
                //获取html内容，返回: <p>hello</p>
                //var html = ue.getContent();
                //获取纯文本内容，返回: hello
                //var txt = ue.getContentTxt();
            });
        }

    }

    $("#title").on('blur', function () {
        checkInputStr("title", 1, 50);
    });
    $("#author").on('blur', function () {
        checkInputStr("author", 0, 50);
    });
    $("#source").on('blur', function () {
        checkInputStr("source", 0, 50);
    });
    $("#keyword").on('blur', function () {
        checkInputStr("keyword", 0, 50);
    });
    $("#wapDesc").on('blur', function () {
        checkInputStr("wapDesc", 0, 255);
    });
    $("#brief").on('blur', function () {
        checkInputStr("brief", 1, 255);
    });


    $('#submitBtn').on('click', function () {
        saveArticle('submitBtn');
    });

    $('#draftBtn').on('click', function () {
        saveArticle('draftBtn');
    });

    function saveArticle(id) {
        //输入验证
        var checkInput = true;
        if (!checkInputStr('title', 1, 50)) {
            checkInput = false;
        }
        if (!checkInputStr('author', 0, 50)) {
            checkInput = false;
        }
        if (!checkInputStr('source', 0, 50)) {
            checkInput = false;
        }
        if (!checkInputStr('keyword', 0, 50)) {
            checkInput = false;
        }
        if (!checkInputStr('wapDesc', 0, 255)) {
            checkInput = false;
        }
        if (!checkInputStr('brief', 1, 255)) {
            checkInput = false;
        }
        if (!checkInputStr('goodsImages', 1, 500)) {
            checkInput = false;
        }

        if (checkInput == false) {
            utils.AlertTip('fail', '输入不符合规范,请检查');
            return false;
        }

        var images = JSON.parse($('#goodsImages').val());
        var imgs = [];
        if(images&&images.length){
            imgs.push(images[images.length - 1]);
        }
        if(!imgs.length){
            utils.AlertTip('fail', '请上传宣传图');
            return false;
        }
        $('#goodsImages').val(JSON.stringify(imgs));

        if (id == 'submitBtn') {
            $('#postStatus').val('publish');
        } else {
            $('#postStatus').val('draft');
        }

        var param = $('#articleForm').serialize();

        $('#' + id).addClass('disabled').off('click');
        utils.SendAjax({
            url: saveUrl,
            param: param,
            method: 'POST',
            tipText: '保存',
            callback: function (result) {
                utils.AlertTip('success', '保存成功', function () {
                    $('#' + id).removeClass('disabled').off('click').on('click', function () {
                        saveArticle(id);
                    });
                    if (result.data.id) {
                        window.location.href = "/kepu/detail?id=" + result.data.id;
                    } else {
                        var id = $("#articleId").val();
                        window.location.href = "/kepu/detail?id=" + id;
                    }
                });
            },
            errorFun: function () {
                $('#' + id).removeClass('disabled').off('click').on('click', function () {
                    saveArticle(id);
                });
            }
        });
    }

    $('#goodsImages').diyUpload({
        "bReplace": true,
        "browse_button": "selectfiles_goodsImages",
        "postfiles": 'postfiles_goodsImages',
        "previewImageBox": "previewImage_goodsImages",
        "stroageImgBtn": "#goodsImages",
        "businessId": 22001
    })

    function checkInputStr(id, smallNum, largenum) {
        var str = $("#" + id).val().trim();
        if (str.length < smallNum || str.length > largenum) {
            $('#' + id).closest('li').find('.tip').css('color', '#ee3e01');
            return false;
        }
        $('#' + id).closest('li').find('.tip').css('color', '#333');
        return true;
    }
});



