define(function(require,exports,module) {
    var utils = require('../utils');
    $(function () {
        var $body = $('body');
        var $resource = $('.resource');
        var check = '.resource ul .check';
        var checkInput = '.resource ul .check input';
        var li = '.resource ul li';


        $body.on('click','.resource ul .name',function (e) {
            e.stopPropagation();
            var $self = $(this);
            // console.log("nama:",$(this).text());
            $self.parent().toggleClass('tree_open');
            $self.parent().next('ol').slideToggle();
        })

        function checkOne() {
            var checkLen = $(check).find('input:checked').length;
            return checkLen;
        }

        //新增
        $body.on('click','.addBtn',function () {
            var checkLen = checkOne();
            if (checkLen>1){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'只能选择一项菜单'
                }).hideMsg();
                return
            }
            var $liOn =$resource.find('ul .success');


            var oldData =  {
                "id": $liOn.attr('data-id'),
                "parentId": $liOn.attr('data-parentId')||'',
                "parentName": $liOn.attr('data-name')||'',
                "name": $liOn.find('.name').text(),
                "url": $liOn.find('.url').text(),

                // "menuIcon": "子菜单资源图标1",
                "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData);
            var popup = new utils.Popup({
                msg:"<h2>新增菜单</h2><ul>" +
                "<li><label>父级：</label><input type='hidden' class='parentId' name='parentId' value="+oldData.id+">" +
                "<input type='text' disabled class='parentName' name='parentName' value="+oldData.name+">" +
                "</li>" +
                "<li><label>菜单名：</label><input type='text' class='name' name='name' value=''></li>" +
                "<li><label>链接：</label><input type='text' class='url' name='url' value=''></li>" +
                "<li><label>描述：</label><input type='text' class='description' name='description' value=''></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox:'menuBox',
                okText:"确认",
                // isHide:false,
                okCallback:function(){
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'),function (index,item) {
                        key =$(item).attr('name');
                        console.log("$(item).val():",$(item).val())
                        if($(item).val()&&$(item).val()!='undefined'){
                            serializeObj[key] = $(item).val()
                        }
                    })

                    // {
                    //     "command": {
                    //     "name": "菜单资源名称:",
                    //         "url": "菜单资源URL",
                    //         "menuIcon": "菜单资源图标",
                    //         "description": "description"
                    // }
                    // }
                    console.log("serializeObj:",serializeObj);
                    if(!serializeObj.name){
                        new utils.MsgShow({
                            delayTime:2000,
                            title:"请填写菜单名"
                        }).hideMsg();
                        return false
                    }

                    $.ajax({
                        type:'POST',
                        data:serializeObj,
                        url:'/resource/menu/add',
                        success:function(json){
                            var json = JSON.parse(json);
                            console.log(json)
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:"新增菜单成功"
                                }).hideMsg()
                                window.location.reload();

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

        //修改
        $body.on('click','.updateBtn',function () {
            var checkLen = checkOne();
            if(!checkLen){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'请选择一项要修改的菜单'
                }).hideMsg();
                return
            }else if (checkLen>1){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'只能选择一项要修改的菜单'
                }).hideMsg();
                return
            }
            var $liOn =$resource.find('ul .success');


            var oldData =  {
                    "id": $liOn.attr('data-id'),
                    "parentId": $liOn.attr('data-parentId'),
                    "parentName": $liOn.attr('data-parentName')||'',
                    "name": $liOn.find('.name').text(),
                    "url": $liOn.find('.url').text(),

                    // "menuIcon": "子菜单资源图标1",
                    "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData)
            var popup = new utils.Popup({
                msg:"<h2>修改菜单</h2><ul>" +
                            "<li><label>父级：</label><input type='hidden' class='parentId' name='parentId' value="+oldData.parentId+">" +
                                                "<input type='text' disabled class='parentName' name='parentName' value="+oldData.parentName+"></li>" +
                            "<li><label>菜单名：</label><input type='hidden' class='id' name='id' value="+oldData.id+"><input type='text' class='name' name='name' value="+oldData.name+"></li>" +
                            "<li><label>链接：</label><input type='text' class='url' name='url' value="+oldData.url+"></li>" +
                            "<li><label>描述：</label><input type='text' class='description' name='description' value="+oldData.description+"></li>" +
                            // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                    "</ul>",
                otherBox:'menuBox',
                okText:"确认",
                okCallback:function(){
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'),function (index,item) {
                        key =$(item).attr('name')
                        if($(item).val()){
                            serializeObj[key] = $(item).val()
                        }

                    })

                    console.log("serializeObj:",serializeObj);


                    var bizParam = {
                            "id": 208,
                            "name": "子菜单资源名称1",
                            "url": "子菜单资源URL1",
                            "description": "description1"
                    }
                    delete serializeObj.parentId;
                    delete serializeObj.parentName;

                    $.ajax({
                        type:'PUT',
                        data:serializeObj,
                        url:'/resource/menu/update',
                        success:function(json){
                            var json = JSON.parse(json);
                            console.log(json)
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:"菜单修改成功"
                                }).hideMsg(function(){
                                      window.location.reload();
                                    //window.location.href=pathname
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
            console.log('popup:',popup)

        });
        //启用、禁用
        $body.on('click','.usableBtn',function () {
            var checkLen = checkOne();
            if(!checkLen){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'请选择一项要修改的菜单'
                }).hideMsg();
                return
            }else if (checkLen>1){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'只能选择一项要修改的菜单'
                }).hideMsg();
                return
            }
            var $liOn =$resource.find('ul .success');


            var oldData =  {
                "id": $liOn.attr('data-id'),
                "parentId": $liOn.attr('data-parentId'),
                "parentName": $liOn.attr('data-parentName'),
                "name": $liOn.find('.name').text(),
                "url": $liOn.find('.url').text(),

                // "menuIcon": "子菜单资源图标1",
                "description": $liOn.find('.description').text()

            };

            console.log("oldData:",oldData)
            var popup = new utils.Popup({
                msg:"<h2>启用/禁用菜单</h2><ul>" +
                "<li><label>父级：</label><input type='hidden' class='parentId' name='parentId' value="+oldData.parentId+">" +
                "<input type='text' class='parentName' name='parentName' value="+oldData.parentName+" disabled></li>" +
                "<li><label>菜单名：</label><input type='hidden' class='id' name='id' value="+oldData.id+"><input type='text' class='name' name='name' value="+oldData.name+"></li>" +
                "<li><label>链接：</label><input type='text' class='url' name='url' value="+oldData.url+"></li>" +
                "<li><label>描述：</label><input type='text' class='description' name='description' value="+oldData.description+"></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox:'menuBox',
                okText:"确认",
                isHide:false,
                okCallback:function(){
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'),function (index,item) {
                        key =$(item).attr('name')
                        serializeObj[key] = $(item).val()
                    })

                    console.log("serializeObj:",serializeObj);


                    var bizParam = {
                        "id": 208,
                        "name": "子菜单资源名称1",
                        "url": "子菜单资源URL1",
                        "description": "description1"
                    }
                    delete serializeObj.parentId;
                    delete serializeObj.parentName;

                    $.ajax({
                        type:'PUT',
                        data:serializeObj,
                        url:'/resource/menu/update',
                        success:function(json){
                            var json = JSON.parse(json);
                            console.log(json)
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:obj.title
                                }).hideMsg(function(){

                                    //window.location.href=pathname
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
            console.log('popup:',popup)

        });
        //删除
        $body.on('click','.delBtn',function () {
            var checkLen = checkOne();
            if(!checkLen){
                new utils.MsgShow({
                    delayTime:2000,
                    title:'请选择要删除的菜单'
                }).hideMsg();
                return
            }
            var serializeObj =[];
            var id = '';
            var name = '';
            var names = [];
            var $liOn =$resource.find('ul .success');
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
                msg:"<h2>删除菜单</h2><ul>"+msgHtml+"</ul>",
                otherBox:'menuBox',
                okText:"确认",
                okCallback:function(){
                    console.log("serializeObj:",serializeObj);
                    $.ajax({
                        type:'put',
                        data:{resourceId:serializeObj},
                        url:'/resource/menu/delete',
                        success:function(json){
                            var json = JSON.parse(json);
                            console.log(json)
                            if(json.success){
                                var myMsg = new utils.MsgShow({
                                    delayTime:2000,
                                    title:"删除菜单成功"
                                }).hideMsg(function(){
                                    $liOn.remove();
                                    //window.location.href=pathname
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

        //全选
        $body.on('click','.allCheck',function () {
            var $self = $(this);
            var $allCheck = $(this).find('input');
            var $checkInput = $(checkInput);
            if($allCheck.is(':checked')){
                $checkInput.prop('checked',true);
                $resource.find('ul li').addClass('success')
            }else{
                $checkInput.prop('checked',false);
                $resource.find('ul li').removeClass('success')
            }
        });
        //单选
        $body.on('click',li,function () {
            var $self = $(this);
            var $input = $self.find('input');
            $self.toggleClass('success');
            console.log("nama:",$(this).text());
            if($input.is(':checked')){
                $input.prop('checked',false)
            }else{
                $input.prop('checked',true)
            }

        })
        $body.on('click',checkInput,function (e) {
            var $self = $(this);
            var $input = $self;
            // console.log("nama:",$(this).text());
            if($input.is(':checked')){
                $input.prop('checked',false)
            }else{
                $input.prop('checked',true)
            }

        })

    })

});

