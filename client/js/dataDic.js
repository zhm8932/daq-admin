define(function (require, exports, module) {
    var utils = require('utils');
    var itemTr = null;
    var opreateName = null;
    var dicType;

    // require('jquery');
    require('./diyUpload.js');
    var move = require('./move');
    var bootstrap = require('bootstrap');
    var koalaTree = require('../libs/koala/koala-tree.js');
    var koalaUi = require('../libs/koala/koala-ui.plugin.js');


    var url = "/sysSetting/dataDic/list";

    var buttons = [{
        content: '<ks:hasSecurityResource identifier="menuResourceManagerAdd"><button class="btn btn-primary" type="button" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-plus"><span>添加</button></ks:hasSecurityResource>',
        action: 'add'
    }, {
        content: '<ks:hasSecurityResource identifier="menuResourceManagerUpdate"><button class="btn btn-primary" type="button"><span class="glyphicon glyphicon-edit"><span>修改</button></ks:hasSecurityResource>',
        action: 'modify'
    }, {
        content: '<ks:hasSecurityResource identifier="menuResourceManagerTerminate"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"><span>删除</button></ks:hasSecurityResource>',
        action: 'delete'
    }, {
        content: '<ks:hasSecurityResource identifier="menuResourceManagerTerminate"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-disable"><span>禁用/启用</button></ks:hasSecurityResource>',
        action: 'updateState'
    }];


    if (dicType == 'district') {
        $('#addDialog').find('#displayOrder').hide();
    }
    var isShowPages = $("#isShowPages").val() == 'true' ? true : false;
    var $goods_category = $('#goods_category');

    var isRootFlag = $('#isRootFlag').val();
    if (isRootFlag == 'true') {
        var columns = [{
            title: "排序",
            name: "displayOrder",
            width: 50
        }, {
            title: "名称",
            name: "name",
            width: 200
        }, {
            title: "状态",
            name: "activeState",
            width: 100,
            render: function (item, activeState, index) {
                return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
            }
        }, {
            title: "type",
            name: "type",
            width: 140
        }, {
            title: "others",
            name: "others",
            width: 140
        }, {
            title: "描述",
            name: "description",
            width: 150
        }];

        initGrid(columns,buttons,isShowPages,'',url);
    } else {
        var columns = [{
            title: "排序",
            name: "displayOrder",
            width: 50
        }, {
            title: "名称",
            name: "name",
            width: 200
        }, {
            title: "状态",
            name: "activeState",
            width: 100,
            render: function (item, activeState, index) {
                return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
            }
        }, {
            title: "描述",
            name: "description",
            width: 180
        }];

        if($goods_category.hasClass('on')){
            columns.push({
                title: "宣传图",
                name: "others",
                width: 200,
                render: function (item, activeState, index) {
                    // return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
                    if(item.others&&item.others){
                        var others = JSON.parse(item.others)
                        return '<img src='+others[0].imageUrl+'>'
                    }
                    // return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
                }
            })
        }

        var navs = $('#nav span');

        var $goods_category = $('#goods_category');
        navs.each(function(index,ele){
            var $this = $(ele);
            var bHave = true;
            $this.on('click',function(){
                $("#nav span").removeClass('on');
                $this.addClass('on');
                if($goods_category.hasClass('on')){
                    if(columns.length<=4){
                        columns.push({
                            title: "宣传图",
                            name: "others",
                            width: 200,
                            render: function (item, activeState, index) {
                                // return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
                                if(item.others&&item.others){
                                    var others = JSON.parse(item.others)
                                    return '<img src='+others[0].imageUrl+'>'
                                }
                                // return item.activeState == 1 ? '<span>启用</span>' : '<span>未启用</span>';
                            }
                        })
                    }
                }else{
                    columns.splice(4,1)
                }


                var type = $this.attr('id');
                $('#dicType').val(type);
                dicType = type;
                initGrid(columns,buttons,isShowPages,dicType,url);


            });
        });

        navs.eq(0).trigger('click');
    }

    new move.Move();
    var othersHtml = '<div class="form-group"><label class="others col-lg-3 control-label">图片</label>' +
                        '<div class="col-lg-9">' +
                            '<div id="container" class="imgUploadBox">' +
                                '<input id="others" type="hidden" name="others" value="">' +
                                '<span id="selectfiles_images" class="btn">选择图片</span>&nbsp;&nbsp;&nbsp;<span id="postfiles_images" class="btn">开始上传</span>' +
                            '</div>' +
                        '<div id="previewImage_images" class="parentFileBox clearfix"></div>' +
                    '</div></div>';

    function initGrid(columns,buttons,isShowPages,dicType,url){
        // console.log($);
        // console.log($('[data-role="menuGrid"]').grid);
        $('[data-role="menuGrid"]').html('');
        /*解决id冲突的问题*/
        $('[data-role="menuGrid"]').grid({
            identity: 'id',
            columns: columns,
            buttons: buttons,
            isShowPages: isShowPages,
            type: dicType,
            url: url,
            method: 'GET',
            tree: {
                column: 'name'
            }
        }).off('add').off('delete').off('modify').on({
            'add': function (event, data) {//data change item
                var indexs = data.data;
                var grid = $(this);
                if (indexs.length > 1) {
                    grid.message({
                        type: 'warning',
                        content: '只能选择一条记录'
                    });
                    return;
                }
                var dialog = $('#addDialog');

                // console.log("data::",data);
                // var others = '<div class="form-group"><label class="others col-lg-3 control-label">图片</label><div class="col-lg-9"><input type="text" name="others" class="form-control"></div></div>'
                if($("#goods_category").hasClass('on')&&!dialog.find('.others').length){
                    dialog.find('.modal-footer').before(othersHtml);
                }

                // console.log("dialog::",dialog.html());
                initEditDialog(dialog, (data.data ? data.item[0] : null), grid, "add");
                $('#others').diyUpload({
                    "bReplace":true,
                    "browse_button":"selectfiles_images",  //文件选择按钮
                    "postfiles":'postfiles_images',   //文件上传按钮
                    "previewImageBox":"previewImage_images",  //图片预览
                    "stroageImgBtn":"#others",                  //图片存储区域 隐藏域
                    "businessId":24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
                })

            },
            'modify': function (event, data) {
                var indexs = data.data;
                var grid = $(this);
                if (indexs.length == 0) {
                    grid.message({
                        type: 'warning',
                        content: '请选择一条记录进行修改'
                    });
                    return;
                }
                if (indexs.length > 1) {
                    grid.message({
                        type: 'warning',
                        content: '只能选择一条记录进行修改'
                    });
                    return;
                }

                var dialog = $('#addDialog');

                if($("#goods_category").hasClass('on')&&!dialog.find('.others').length){
                    dialog.find('.modal-footer').before(othersHtml);
                }

                initEditDialog(dialog, data.item[0], grid, "modify");

                $('#others').diyUpload({
                    "bReplace":true,
                    "browse_button":"selectfiles_images",  //文件选择按钮
                    "postfiles":'postfiles_images',   //文件上传按钮
                    "previewImageBox":"previewImage_images",  //图片预览
                    "stroageImgBtn":"#others",                  //图片存储区域 隐藏域
                    "businessId":24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
                })

            },
            'delete': function (event, data) {
                var indexs = data.data;
                var grid = $(this);
                if (indexs.length == 0) {
                    grid.message({
                        type: 'warning',
                        content: '请选择要删除的记录'
                    });
                    return;
                }
                grid.confirm({
                    content: '确定要删除所选记录及其子记录吗?',
                    callBack: function () {
                        deleteMenu(data.item, grid);
                    }
                });

            },
            "updateState": function (event, data) {
                var indexs = data.data;
                var grid = $(this);
                if (indexs.length == 0) {
                    grid.message({
                        type: 'warning',
                        content: '请选择一条记录'
                    });
                    return;
                }
                if (indexs.length > 1) {
                    grid.message({
                        type: 'warning',
                        content: '只能选择一条记录进行修改'
                    });
                    return;
                }

                var item = data.item[0];
                var tip = '确定要禁用所选记录及其子记录吗?';
                if(item.activeState != 1){
                    tip = '确定要启用该记录吗?';
                }

                grid.confirm({
                    content: tip,
                    callBack: function () {
                        updateState(item, grid);
                    }
                });

            },
            "permissionAssign": function (event, data) {
                var items = data.item;
                var thiz = $(this);
                if (items.length == 0) {
                    thiz.message({type: 'warning', content: '请选择一条记录进行操作'});
                    return;
                } else if (items.length > 1) {
                    thiz.message({type: 'warning', content: '只能选择一条记录进行操作'});
                    return;
                }

                var menu = items[0];
                openTab('/pages/auth/menu-grant-permission.jsp', menu.name + '的权限管理', 'menuGrantPermissionManager_' + menu.id, menu.id, {menuId: menu.id});
            }
        });
    }

    function updateState(item, grid) {
        var tip = '禁用';
        var activeState = 2;
        if(item.activeState != 1){
            tip = '启用';
            activeState = 1;
        }
        utils.SendAjax({
            url: '/sysSetting/dataDic/updateState',
            param: {
                id:item.id,
                activeState:activeState
            },
            method:'POST',
            tipText: tip,
            callback: function (result) {
                grid.message({
                    type: 'success',
                    content: tip+'成功'
                });
                grid.grid('refresh');
            },
            errorFun: function (result) {

            }
        });
    };



    function saveData() {
        var dialog = $('#addDialog');
        var form = dialog.find('.page_form');
        var data = form.serialize();
        var url = '/sysSetting/dataDic/add';

        var others = form.find("input[name='others']").val();
        // console.log("others:",others)
        if(others){
            try{
                var others = JSON.parse(others);
                data.others = others[0].imageUrl;

            }catch(e){
                utils.AlertTip('fail','others不是一个json,请重新填写');
                return false;
            }
        }

        console.log("data:",data)
        if (opreateName == 'add') {
            if (itemTr != null) {//problem
                url = '/sysSetting/dataDic/add';
                data += ("&parentId=" + itemTr.id);
            } else {
                url = '/sysSetting/dataDic/add';
                if($('#isRootFlag').val() != 'true'){
                    var parentId = $('#'+dicType).attr('data-id');
                    data += ("&parentId=" + parentId);
                }

            }
        }
        if (itemTr && opreateName == 'modify') {
            url = '/sysSetting/dataDic/modify';
            data += ("&id=" + itemTr.id);
        }

        dialog.find('#save').attr('disabled', 'true').off('click');
        utils.SendAjax({
            url: url,
            param: data,
            tipText: '保存',
            callback: function (result) {
                dialog.trigger('complete');
                dialog.find('#save').removeAttr('disabled');
            },
            errorFun: function (result) {
                dialog.find('#save').attr('disabled', 'false').off('click').on('click', saveData);
            }
        });
    }

    function deleteMenu(menus, grid) {
        var ids = new Array();
        $.each(menus, function (i, menu) {
            ids.push(menu.id);
        });
        var data = 'ids=' + JSON.stringify(ids);

        var url = '/sysSetting/dataDic/del';
        $.get(url, data).done(function (data) {
            data = JSON.parse(data);
            if (data.success) {
                grid.message({
                    type: 'success',
                    content: '删除成功'
                });
                grid.grid('refresh');
            } else {
                grid.message({
                    type: 'error',
                    content: data.msg
                });
            }
        }).fail(function (data) {
            grid.message({
                type: 'error',
                content: '删除失败'
            });
        });
    };


    function initEditDialog(dialog, item, grid, opreate) {
        itemTr = item;
        opreateName = opreate;
        var isRootFlag = $('#isRootFlag').val();
        var title = dialog.find('.modal-header').find('.modal-title');
        var form = dialog.find(".page_form");
        form.find('.activeState').html('未启用');
        dialog.find('.save').off('click').on('click', saveData);
        if (item != null) {
            form.find("input[name='parentName']").val(item.name);
            //根节点管理时:新增的元素的父级元素非空时,给该元素的type赋值
            if (item && opreate == "add" && isRootFlag == 'true') {
                try{
                    if (item.others && JSON.parse(item.others).type) {
                        form.find("input[name='type']").val(JSON.parse(item.others).type);
                    } else {
                        form.find("input[name='type']").val(item.type);
                    }
                }catch (e){
                    utils.AlertTip('fail','父元素的others不是一个json,无法为新元素的type赋值,请手动填写');
                }
            }
            title.html('添加子菜单资源');
        } else {//添加菜单的时候不选中记录，那么就不显示父菜单。
            form.find("input[name='parentName']").val('');
            title.html('添加父级菜单');
        }

        if (item && opreate == "modify") {
            title.html('修改菜单');
            form.find("input[name='parentName']").val(item.parentName);
            form.find("input[name='name']").val(item.name);
            form.find("input[name='description']").val(item.description);
            // form.find("select[name='activeState']").val(item.activeState);
            var stateText = item.activeState == 1? '启用':'未启用';
            form.find('.activeState').html(stateText);
            // form.find("select[name='activeState'] option[value=" + item.activeState + "]").attr('selected', 'selected');
            form.find("input[name='displayOrder']").val(item.displayOrder);
            form.find("input[name='type']").val(item.type);

            if(item.others&&JSON.parse(item.others)){
                var ohters = JSON.parse(item.others)
                var othersHtml = '<div class="fileBoxUl fileBoxUl_previewImage_images"><li class="diyUploadHover">' +
                                 '<div class="viewThumb"></div> <div class="diyCancel"></div>' +
                                    '<div class="diySuccess"></div> <div class="diyFileName"></div><div class="diyBar"> <div class="diyProgress"></div><div class="diyProgressText"></div> </div><img src='+ohters[0].imageUrl+'></li></div>';
                $('#previewImage_images').html(othersHtml);
            }
            form.find("input[name='others']").val(item.others);
        }

        dialog.modal({
            keyboard: false
        }).on({
            'hidden.bs.modal': function () {
                $(this).modal('hide');
                $(this).find('form')[0].reset();
            },
            'complete': function () {
                grid.message({
                    type: 'success',
                    content: '保存成功'
                });
                $(this).modal('hide');
                $(this).find('form')[0].reset();
                grid.grid('refresh');
            }
        });
    }

});


