define(function(require,exports,module) {
    var utils = require('../utils');
    var systemCom = require('../systems/system_com');
    console.log("systemCom:",systemCom);
    $(function () {
        var $body = $('body');

        $().on('click',function(){
            
        });

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
                msg:"<h2>新增页面元素</h2><ul>" +
                "<li><label>页面元素名称：</label><input type='text' class='name' name='name' value=''><em>*</em></li>" +
                "<li><label>页面元素标识：</label><input type='text' class='identifier' name='identifier' value=''></li>" +
                "<li><label>页面元素描述：</label><input type='text' class='description' name='description' value=''></li>" +
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
                            title:'请输入页面元素名称'
                        }).hideMsg();
                        return
                    }
                    if(!serializeObj.identifier){
                        new utils.MsgShow({
                            title:'请输入页面元素标识'
                        }).hideMsg();
                        return
                    }


                    utils.SendAjax({
                        url: '/resource/element/add',
                        method:'POST',
                        param: serializeObj,
                        tipText: '页面元素新增',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"页面元素新增成功"
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
                    "identifier": $liOn.find('.identifier').text(),
                    "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData);
            var popup = new utils.Popup({
                msg:"<h2>修改页面元素</h2><ul>" +
                            "<li><label>页面元素名称：</label><input type='hidden' class='id' name='id' value="+oldData.id+"><input type='text' class='name' name='name' value="+oldData.name+"></li>" +
                            "<li><label>页面元素标识：</label><input type='text' class='identifier' name='identifier' value="+oldData.identifier+"></li>" +
                            "<li><label>页面元素描述：</label><input type='text' class='description' name='description' value="+oldData.description+"></li>" +
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
                        url: '/resource/element/update',
                        method:'POST',
                        param: serializeObj,
                        tipText: '页面元素修改',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"页面元素修改成功"
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
                    title:'请选择要删除的页面元素'
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
                msg:"<h2>删除页面元素</h2><ul>"+msgHtml+"</ul>",
                otherBox:'menuBox',
                okText:"确认",
                okCallback:function(){
                    console.log("serializeObj:",serializeObj);

                    utils.SendAjax({
                        url: '/resource/element/del',
                        method:'POST',
                        param: {resourceIds:serializeObj},
                        tipText: '页面元素删除',
                        callback: function (result) {
                            var myMsg = new utils.MsgShow({
                                delayTime:2000,
                                title:"页面元素删除成功"
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

