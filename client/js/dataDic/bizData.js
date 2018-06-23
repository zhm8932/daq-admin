define(function (require, exports, module) {
    var utils = require('../utils');
    var TableTree = require('../libs/TableTree');
    require('../diyUpload.js');
    var move = require('../move');

    var tree = null;

    var columns = [
        {
            title: "名称",
            name: "name",
            width: "30%"
        }, {
            title: "排序",
            name: "displayOrder",
            width: "5%"
        }, {
            title: "状态",
            name: "activeState",
            width: "15%",
            render: function (item) {
                return item.activeState == 1 ? '启用' : '未启用';
            }
        }, {
            title: "描述",
            name: "description",
            width: "20%"
        }];

    $(function () {
        var navs = $('#nav span');
        navs.each(function (index, ele) {
            var $this = $(ele);
            $this.on('click', function () {
                var type = $this.attr('id');
                $('#dicType').val(type);

                $("#nav span.on").removeClass('on');
                $this.addClass('on');

                var columnLength = columns.length;
                if (type === 'goods_category') {
                    columns[4] = {
                        title: "pc官网宣传图",
                        name: "others",
                        width: 250,
                        render: function (item) {
                            if (item && item.others) {
                                try {
                                    var others = JSON.parse(item.others);
                                    return others.pcImage ? '<img src=' + others.pcImage[0].imageUrl + '>' : '';
                                } catch (e) {
                                    utils.AlertTip('fail', '该元素的others有误,无法展示其状态,请在根节点管理中根据规范手动修改好');
                                }
                            }
                        }
                    };
                    columns[5] = {
                        title: "手机官网宣传图",
                        name: "others",
                        width: 300,
                        render: function (item) {
                            if (item && item.others) {
                                try {
                                    var others = JSON.parse(item.others);
                                    return others.mobileImage ? '<img src=' + others.mobileImage[0].imageUrl + '>' : '';
                                } catch (e) {
                                    utils.AlertTip('fail', '该元素的others有误,无法展示其状态,请在根节点管理中根据规范手动修改好');
                                }
                            }
                        }
                    };
                    columns[6] = {
                        title: "app宣传图",
                        name: "others",
                        width: 250,
                        render: function (item) {
                            if (item && item.others) {
                                try {
                                    var others = JSON.parse(item.others);
                                    return others.appImage ? '<img src=' + others.appImage[0].imageUrl + '>' : '';
                                } catch (e) {
                                    utils.AlertTip('fail', '该元素的others有误,无法展示其状态,请在根节点管理中根据规范手动修改好');
                                }
                            }
                        }
                    };
                    $('#updateOnlineState').addClass('none');
                } else if (type === 'district') {
                    columns.splice(4, columnLength - 4);
                    columns[4] = {
                        title: "上线状态",
                        name: "others",
                        width: 200,
                        render: function (item) {
                            //是否上线：1.上线 2.下线
                            return parseInt(item.isOnline) === 1 ? '上线中' : '<em class="red">下线中</em>';
                        }
                    };
                    $('#updateOnlineState').removeClass('none');
                } else {
                    columns.splice(4, columnLength - 4);
                    $('#updateOnlineState').addClass('none');
                }

                reloadTable({
                    type: type
                });
            });
        });

        navs.eq(0).trigger('click');


        $('.addBtn').on('click', function () {
            if (!checkChoosedNum(0, 1, '最多选中一行')) {
                return false;
            }
            var options = {
                title: '新增',
                operation: 'add',
                url: '/dataDic/add'
            };

            var length = tree.getCheckedTrList().length;
            if (length > 0) {
                var index = tree.getCheckedTrList().eq(0).attr('data-index');
                var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
                options.choosedItem = choosedItem;
                showDialog(options);
            } else {
                showDialog(options);
            }
        });

        $('.updateBtn').on('click', function () {
            if (!checkChoosedNum(1, 1, '必须选中一行,且只能选中一行')) {
                return false;
            }
            var index = tree.getCheckedTrList().eq(0).attr('data-index');
            var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
            var options = {
                title: '修改',
                operation: 'update',
                url: '/dataDic/update',
                choosedItem: choosedItem
            };
            showDialog(options);
        });

        $('.delBtn').on('click', function () {
            if (!checkChoosedNum(1, 999, '至少选中一行')) {
                return false;
            }
            delMenu();
        });

        $('.updateStateBtn').on('click', function () {
            if (!checkChoosedNum(1, 1, '必须选中一行,且只能选中一行')) {
                return false;
            }
            updateState();
        });

        $('#updateOnlineState').on('click', function () {
            if (!checkChoosedNum(1, 1, '必须选中一行,且只能选中一行')) {
                return false;
            }
            updateOnlineState();
        });

    });

    function updateOnlineState() {
        var isOnline = 1, msg = '确定要上线该城市吗?', tipText = '上线';
        var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
        if (parseInt(choosedItem.isOnline) === 1) {//如果当前状态为1,即为上线状态,则将更改为下线状态
            msg = '确定要下线该城市吗?';
            isOnline = 2;
            tipText = '下线';
        }

        var popup = new utils.Popup({
            msg: msg,
            okText: '确定',
            okCallback: function () {
                utils.SendAjax({
                    url: '/dataDic/updateOnlineState',
                    method: 'POST',
                    param: {
                        id: choosedItem.id,
                        isOnline: isOnline
                    },
                    tipText: tipText,
                    callback: function () {
                        utils.AlertTip('success', tipText + '成功');
                        popup.hideBoxNoTime();
                        reloadTable({
                            type: $('#dicType').val()
                        });
                    }
                });
            }
        })
    }


    function updateState() {
        var activeState = 2, msg = '确定要禁用所选记录及其子记录吗?', tipText = '禁用';
        var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
        if (choosedItem.activeState != 1) {//如果当前状态不为1,即为禁用状态,则将更改为启用状态
            msg = '确定要启用该记录吗?';
            activeState = 1;
            tipText = '启用';
        }
        var popup = new utils.Popup({
            msg: msg,
            okText: '确定',
            okCallback: function () {
                utils.SendAjax({
                    url: '/dataDic/updateState',
                    method: 'POST',
                    param: {
                        id: choosedItem.id,
                        activeState: activeState
                    },
                    tipText: tipText,
                    callback: function () {
                        utils.AlertTip('success', tipText + '成功');
                        popup.hideBoxNoTime();
                        reloadTable({
                            type: $('#dicType').val()
                        });
                    }
                });
            }
        })
    }


    function delMenu() {
        var popup = new utils.Popup({
            msg: '确定删除该目录及其子目录吗？',
            okText: '确定删除',
            okCallback: function () {
                var ids = [];
                tree.getCheckedTrList().each(function (index, ele) {
                    ids.push($(ele).attr('data-id'));
                });
                utils.SendAjax({
                    url: '/dataDic/del',
                    method: 'POST',
                    param: {
                        ids: JSON.stringify(ids)
                    },
                    tipText: '删除',
                    callback: function () {
                        utils.AlertTip('success', '删除成功');
                        popup.hideBoxNoTime();
                        reloadTable({
                            type: $('#dicType').val()
                        });
                    }
                });
            }
        })
    }

    function reloadTable(param) {
        utils.SendAjax({
            url: '/dataDic/list',
            method: 'GET',
            param: param,
            tipText: '获取根节点数据',
            callback: function (result) {
                tree = new TableTree.TableTree({
                    itemList: result.data,//数据数组,必传
                    columnList: columns,//表格展示列,必传
                    useChkBox: true,
                    isCheckLinkage: false,
                    parentEle: $('#bizTable'),
                    afterRenderFun: function (parentEle) {
                        parentEle.find('tr').on('click', function () {
                            $(this).find('input[type=checkbox]').trigger('click');
                        })
                    },
                    afterCheckFun: function (ele) {
                        if ($(ele).prop('checked')) {
                            $(ele).closest('tr').addClass('success');
                        } else {
                            $(ele).closest('tr').removeClass('success');
                        }
                    }
                });
            }
        });
    }


    /**
     * 展示新增或修改的弹框
     * @param options : 传入的参数集合
     * title:弹框标题
     * operation:弹框的操作,'add'或'update'
     * choosedItem:如果有选中元素,则需传入choosedItem
     * url:点击确认后发起请求的URL
     */
    function showDialog(options) {
        var type = $('#dicType').val();
        var imgHtml = type != 'goods_category' ?
            '' :
        '<input type="hidden" name="others"/>' +
        '<li><label>PC官网图片</label>' +
        '<div id="container" class="imgUploadBox">' +
        '<input id="pcImage" type="hidden" value="">' +
        '<span id="pc_selectfiles_images" class="btn">选择图片</span>&nbsp;&nbsp;&nbsp;<span id="pc_postfiles_images" class="btn">开始上传</span>' +
        '</div>' +
        '<div id="pc_previewImage_images" class="parentFileBox clearfix"></div>' +
        '</li>' +
        '<li><label>手机官网图片</label>' +
        '<div id="mobileContainer" class="imgUploadBox">' +
        '<input id="mobileImage" type="hidden" value="">' +
        '<span id="mobile_selectfiles_images" class="btn">选择图片</span>&nbsp;&nbsp;&nbsp;<span id="mobile_postfiles_images" class="btn">开始上传</span>' +
        '</div>' +
        '<div id="mobile_previewImage_images" class="parentFileBox clearfix"></div>' +
        '</li>' +
        '<li><label>APP图片</label>' +
        '<div id="appContainer" class="imgUploadBox">' +
        '<input id="appImage" type="hidden"  value="">' +
        '<span id="app_selectfiles_images" class="btn">选择图片</span>&nbsp;&nbsp;&nbsp;<span id="app_postfiles_images" class="btn">开始上传</span>' +
        '</div>' +
        '<div id="app_previewImage_images" class="parentFileBox clearfix"></div>' +
        '</li>';

        var popup = new utils.Popup({
            msg: "<h2>" + options.title + "</h2><ul>" +
            "<form><input type='hidden' name='type' value='" + type + "'>" +
            "<li class='parent'><label>父级：</label></li>" +
            "<li><label>名称：</label><input type='text' name='name' value=''><em>*</em></li>" +
            "<li><label>排序：</label><input type='text' name='displayOrder' value='0'></li>" +
            "<li><label>描述：</label><input type='text' name='description' value=''></li>" + imgHtml +
            "</form></ul>",
            otherBox: 'menuBox',
            okText: "确认",
            isHide: false,
            callback: function () {
                var form = $('.popupBox').find('form');
                if (type === 'goods_category') {
                    $('.popupBox.menuBox').height(700);

                    $('#pcImage').diyUpload({
                        "bReplace": true,
                        "browse_button": "pc_selectfiles_images",  //文件选择按钮
                        "postfiles": 'pc_postfiles_images',   //文件上传按钮
                        "previewImageBox": "pc_previewImage_images",  //图片预览
                        "stroageImgBtn": "#pcImage",                  //图片存储区域 隐藏域
                        "businessId": 24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
                    });
                    $('#mobileImage').diyUpload({
                        "bReplace": true,
                        "browse_button": "mobile_selectfiles_images",  //文件选择按钮
                        "postfiles": 'mobile_postfiles_images',   //文件上传按钮
                        "previewImageBox": "mobile_previewImage_images",  //图片预览
                        "stroageImgBtn": "#mobileImage",                  //图片存储区域 隐藏域
                        "businessId": 24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
                    });
                    $('#appImage').diyUpload({
                        "bReplace": true,
                        "browse_button": "app_selectfiles_images",  //文件选择按钮
                        "postfiles": 'app_postfiles_images',   //文件上传按钮
                        "previewImageBox": "app_previewImage_images",  //图片预览
                        "stroageImgBtn": "#appImage",                  //图片存储区域 隐藏域
                        "businessId": 24001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
                    });
                }

                if (options.operation === 'add') {
                    //新增时有选中元素,则需把选中元素设为新增元素的父级
                    if (options.choosedItem) {
                        form.find('.parent').append($('<span>' + options.choosedItem.name + '</span><input type="hidden" name="parentId" value="' + options.choosedItem.id + '"/>'));
                    } else {
                        //业务数据中,未选中父级直接增加,默认父级为当前所在类目的父级
                        var parent = $('#' + type);
                        form.find('.parent').append($('<span>' + parent.attr('data-name') + '</span><input type="hidden" name="parentId" value="' + parent.attr('data-id') + '"/>'));
                    }
                } else if (options.operation === 'update') {
                    if (options.choosedItem) {//修改时必须有选中元素,需把选中元素的所有值设置,包括ID
                        var item = options.choosedItem;
                        form.find('.parent').append($('<span>' + item.parentName + '</span><input type="hidden" name="parentId" value="' + item.parentId + '"/>'));
                        form.append($('<input type="hidden" name="id" value="' + item.id + '"/>'));
                        form.find('input[name=name]').val(item.name);
                        form.find('input[name=displayOrder]').val(item.displayOrder);
                        form.find('input[name=description]').val(item.description);
                        if (type === 'goods_category' && item.others) {
                            var others = {};
                            try {
                                others = JSON.parse(item.others);
                            } catch (e) {
                                utils.AlertTip('fail', '该元素的others有误,无法展示图片,请在根节点管理中根据规范手动修改好');
                            }
                            var pcImageHtml = others.pcImage ? '<div class="fileBoxUl fileBoxUl_pc_previewImage_images"><li class="diyUploadHover">' +
                                '<div class="viewThumb"></div> <div class="diyCancel"></div>' +
                                '<div class="diySuccess"></div> <div class="diyFileName"></div><div class="diyBar"> <div class="diyProgress"></div>'+
                                '<div class="diyProgressText"></div> </div><img src=' + others.pcImage[0].imageUrl + '></li></div>' : '';
                            var mobileImageHtml = others.mobileImage ? '<div class="fileBoxUl fileBoxUl_mobile_previewImage_images"><li class="diyUploadHover">' +
                                '<div class="viewThumb"></div> <div class="diyCancel"></div>' +
                                '<div class="diySuccess"></div> <div class="diyFileName"></div><div class="diyBar"> <div class="diyProgress"></div>'+
                                '<div class="diyProgressText"></div> </div><img src=' + others.mobileImage[0].imageUrl + '></li></div>' : '';
                            var appImageHtml = others.appImage ? '<div class="fileBoxUl fileBoxUl_app_previewImage_images"><li class="diyUploadHover">' +
                                '<div class="viewThumb"></div> <div class="diyCancel"></div>' +
                                '<div class="diySuccess"></div> <div class="diyFileName"></div><div class="diyBar"> <div class="diyProgress"></div>'+
                                '<div class="diyProgressText"></div> </div><img src=' + others.appImage[0].imageUrl + '></li></div>' : '';
                            $('#pc_previewImage_images').html(pcImageHtml);
                            $('#mobile_previewImage_images').html(mobileImageHtml);
                            $('#app_previewImage_images').html(appImageHtml);
                            $('#pcImage').val(JSON.stringify(others.pcImage));
                            $('#mobileImage').val(JSON.stringify(others.mobileImage));
                            $('#appImage').val(JSON.stringify(others.appImage));

                            new move.Move();
                        }
                        form.find("input[name='others']").val(item.others);
                    }
                }
            },
            okCallback: function () {
                var form = $('.popupBox').find('form');
                if (!form.find('input[name=name]').val()) {
                    utils.AlertTip('fail', '名称不能为空');
                    return false;
                }
                if (type === 'goods_category') {
                    var pcImage = form.find('#pcImage').val();
                    var mobileImage = form.find('#mobileImage').val();
                    var appImage = form.find('#appImage').val();
                    if (!(pcImage && mobileImage && appImage)) {
                        utils.AlertTip('fail', '图片不能为空,需上传');
                        return false;
                    }
                    var others = {
                        "pcImage": JSON.parse(pcImage),
                        "mobileImage": JSON.parse(mobileImage),
                        "appImage": JSON.parse(appImage)
                    };

                    form.find('input[name=others]').val(JSON.stringify(others));

                }
                utils.SendAjax({
                    url: options.url,
                    method: 'POST',
                    param: form.serialize(),
                    tipText: options.title,
                    callback: function (result) {
                        utils.AlertTip('success', options.title + '成功');
                        popup.hideBoxNoTime();
                        reloadTable({
                            type: type
                        });
                    }
                });
            }
        })
    }


    function checkChoosedNum(min, max, tip) {
        var length = tree.getCheckedTrList().length;
        if (length < min || length > max) {
            var tipText = tip || '选中行数必须大于等于 ' + min + ' ,小于等于 ' + max;
            utils.AlertTip('fail', tipText);
            return false;
        }
        return true;
    }

});