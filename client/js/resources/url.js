define(function(require,exports,module) {
    var utils = require('../utils');
    var systemCom = require('../systems/system_com');
    console.log("systemCom:",systemCom);
    $(function () {
        var $body = $('body');

        //新增
        $body.on('click','.addBtn',function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:",checkLen);

            var $liOn =systemCom.$tbody.find('ul .success');


            var oldData =  {
                "id": $liOn.attr('data-id'),
                "name": $liOn.find('.name').text(),
                "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData);
            var popup = new utils.Popup({
                msg:"<h2>新增URL</h2><ul>" +
                "<li><label>URL名称：</label><input type='text' class='name' name='name' value=''><em>*</em></li>" +
                "<li><label>URL路径：</label><input type='text' class='url' name='url' value=''></li>" +
                "<li><label>URL描述：</label><input type='text' class='description' name='description' value=''></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox:'menuBox',
                okText:"确认",
                isHide:false,
                okCallback:function(){
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'),function (index,item) {
                        var key =$(item).attr('name')
                        if($(item).val()){
                            serializeObj[key] = $(item).val()
                        }

                    })

                    console.log("serializeObj:",serializeObj);
                    if(!serializeObj.name){
                        new utils.MsgShow({
                            title:'请输入URL名称'
                        }).hideMsg();
                        return
                    }
                    if(!serializeObj.url){
                        new utils.MsgShow({
                            title:'请输入URL路径'
                        }).hideMsg();
                        return
                    }

                    utils.SendAjax({
                        url: '/resource/url/add',
                        method:'POST',
                        param: serializeObj,
                        tipText: 'URL新增',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"URL新增成功"
                            }).hideMsg(function(){
                                popup.hideBoxNoTime();
                                window.location.reload();
                            });
                        }
                    });
                }
            })

        });

        //修改
        $body.on('click','.updateBtn',function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:",checkLen);
            if(!checkLen){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'请选择一个要修改的角色'
                }).hideMsg();
                return
            }else if (checkLen>1){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'只能选择一个要修改的角色'
                }).hideMsg();
                return
            }
            var $liOn =systemCom.$tbody.find('ul .success');


            var oldData =  {
                    "id": $liOn.attr('data-id'),
                    "name": $liOn.find('.name').text(),
                    "url": $liOn.find('.url').text(),
                    "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData);
            var popup = new utils.Popup({
                msg:"<h2>修改URL</h2><ul>" +
                            "<li><label>URL名称：</label><input type='hidden' class='id' name='id' value="+oldData.id+"><input type='text' class='name' name='name' value="+oldData.name+"></li>" +
                            "<li><label>URL路径：</label><input type='text' class='url' name='url' value="+oldData.url+"></li>" +
                            "<li><label>URL描述：</label><input type='text' class='description' name='description' value="+oldData.description+"></li>" +
                            // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                    "</ul>",
                otherBox:'menuBox',
                okText:"确认",
                okCallback:function(){
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'),function (index,item) {
                        var key =$(item).attr('name')
                        if($(item).val()){
                            serializeObj[key] = $(item).val()
                        }

                    })

                    console.log("serializeObj:",serializeObj);

                    utils.SendAjax({
                        url: '/resource/url/update',
                        method:'POST',
                        param: serializeObj,
                        tipText: 'URL修改',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"URL修改成功"
                            }).hideMsg(function(){
                                popup.hideBoxNoTime();
                                window.location.reload();
                            });
                        }
                    });

                }
            })

        });

        //删除
        $body.on('click','.delBtn',function () {
            var checkLen = systemCom.checkOne();
            if(!checkLen){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'请选择要删除的URL'
                }).hideMsg();
                return
            }
            var serializeObj =[];
            var id = '';
            var name = '';
            var names = [];
            var $liOn =systemCom.$tbody.find('ul .success');
            $.each($liOn,function (index,item) {
                id = $(item).attr('data-id');
                name = $(item).find('.name').text();
                serializeObj.push(id);
                names.push(name)
            })



            console.log("serializeObj:",serializeObj);
            console.log("names:",names);
            var msgHtml = '';
            names.forEach(function (item,index) {
                console.log(item)
                msgHtml+='<p>'+item+'</p>'
            })
            var popup = new utils.Popup({
                msg:"<h2>删除URL</h2><ul>"+msgHtml+"</ul>",
                otherBox:'menuBox',
                okText:"确认",
                okCallback:function(){
                    console.log("serializeObj:",serializeObj);

                    utils.SendAjax({
                        url: '/resource/url/del',
                        method:'POST',
                        param: {resourceIds:serializeObj},
                        tipText: 'URL删除',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"URL删除成功"
                            }).hideMsg(function(){
                                popup.hideBoxNoTime();
                                window.location.reload();
                            });
                        }
                    });

                }
            })

        });


    })

});

