define(function (require, exports, module) {
    var utils = require('../utils');
    var Tabs = require('../libs/Tabs');
    var Pages = require('../libs/Pages');
    var TableTree = require('../libs/TableTree');
    var systemCom = require('./system_com');
    var roleTabs = new Tabs.Tabs('#roleTabs');//初始化tabs
    $(function () {
        var $body = $('body');

        var page = new Pages.Pages({
            showPage: 5,
            url:'/systems/role/list',
            contentEle:$('#roleList'),
            parentEle:$('#tab1')
        });

        $('#roleSearchForm .searchBtn').on('click',function(){
            var param = $('#roleSearchForm').serialize();
            var page = new Pages.Pages({
                showPage: 5,
                url:'/systems/role/list?'+param,
                contentEle:$('#roleList'),
                parentEle:$('#tab1')
            });
        });

        $('.assignMenu').on('click', function () {
            assignMenuResource('/role/menu/list','菜单资源管理','menuRes');
        });
        $('.assignUrl').on('click', function () {
            assignResource('/role/url/list','url资源管理','urlRes',['URL名称','URL路径','URL描述'],['nameLike','urlLike']);
        });
        $('.assignEle').on('click', function () {
            assignResource('/role/ele/list','页面元素管理','eleRes',['页面元素名称','页面元素标识','页面元素描述'],['nameLike','identifierLike']);
        });

        $body.on('click', '.urlRes .addBtn', function () {
            getUnassignedResDialog({
                tableTitle:['URL名称','URL路径','URL描述'],
                searchWord:['nameLike','urlLike'],
                saveUrl:'/role/url/add',
                listUrl:'/role/url/list',
                unassingnedListUrl:'/role/url/unassignedList',
                tipText:'url资源',
                paramName:'resourceIds'
            });
        });

        $body.on('click', '.urlRes .delBtn', function () {
            delResForRole('/role/url/del','urlAccessResourceIds','/role/url/list','URL资源');
        });

        $body.on('click', '.urlRes .searchBtn', function () {
            searchRes('/role/url/list');
        });

        $body.on('click', '.eleRes .searchBtn', function () {
            searchRes('/role/ele/list');
        });

        function searchRes(url){
            var currentPanel = roleTabs.getCurrentPanel();
            var roleId = currentPanel.find('.contentBox').attr('data-role-id');
            var param = currentPanel.find('form.search').serialize();

            var page = new Pages.Pages({
                showPage: 5,
                url:url+'?roleId='+roleId+'&'+param,
                contentEle:currentPanel.find('.tbody'),
                parentEle:currentPanel
            });
        }

        $body.on('click', '.eleRes .addBtn', function () {
            getUnassignedResDialog({
                tableTitle:['页面元素名称','页面元素标识','页面元素描述'],
                searchWord:['nameLike','identifierLike'],
                saveUrl:'/role/ele/add',
                listUrl:'/role/ele/list',
                unassingnedListUrl:'/role/ele/unassignedList',
                tipText:'页面元素资源',
                paramName:'pageElementResourceIds'
            });
        });

        $body.on('click', '.eleRes .delBtn', function () {
            delResForRole('/role/ele/del','pageElementResourceIds','/role/ele/list','页面元素资源');
        });

        function assignMenuResource(){
            if (!checkCheckBoxNum(1)) {
                return false;
            }

            var width = $(window).width() * 0.7;
            var height = $(window).height() * 0.9;
            var currentPanel = roleTabs.getCurrentPanel();
            var roleId = currentPanel.find('ul .success').attr('data-id');
            var tableTree;
            var popup = new utils.Popup({
                otherBox: 'listPopBox',
                msg: '<div class="menuList">加载中...</div>',
                okText: '确定',
                height: height,
                width: width,
                delayTime: 100,
                isHide:false,
                callback: function () {
                    utils.SendAjax({
                        url: '/role/menu/list',
                        method:'GET',
                        param:{roleId:roleId},
                        tipText: '获取菜单列表',
                        callback: function (result) {
                            var columns = [ {
                                title: "菜单名",
                                name: "name",
                                width:'20%'
                            }, {
                                title: "链接",
                                name: "url",
                                width:'20%'
                            }, {
                                title: "描述",
                                name: "description",
                                width:'40%'
                            }];

                            tableTree = new TableTree.TableTree({
                                itemList:result.data,//数据数组,必传
                                columnList:columns,//表格展示列,必传
                                useChkBox:true,
                                parentEle:$('.popupBox .menuList')
                            });
                        }
                    });


                },
                okCallback: function () {
                    var roleId = $('#roleList').find('ul .success').eq(0).attr('data-id');
                    var $liOn = tableTree.getCheckedTrList();
                    addResourceForRole(popup,{
                        menu:true,
                        saveUrl:'/role/menu/add',
                        listUrl:'/systems/role/list',
                        tipText:'菜单资源',
                        paramName:'menuResourceIds'
                    },$liOn,roleId);
                }
            })
        }


        function delResForRole(delUrl,paramName,listUrl,tipText){
            if (!checkCheckBoxNum(1)) {
                return false;
            }
            var popup = new utils.Popup({
                msg: '确定删除该角色的'+tipText+'吗?',
                okText: '确定删除',
                delayTime: 100,
                okCallback: function () {
                    var currentPanel = roleTabs.getCurrentPanel();
                    var $liOn = currentPanel.find('ul .success');
                    var roleId = currentPanel.find('.contentBox').attr('data-role-id');
                    var resourceIds = [];
                    $.each($liOn, function (index, item) {
                        resourceIds.push($(item).attr('data-id'));
                    });
                    var param = {
                        roleId:roleId
                    };
                    param[paramName] = resourceIds;
                    utils.SendAjax({
                        url: delUrl,
                        method:'POST',
                        param:param,
                        tipText: '删除角色的'+tipText,
                        callback: function (result) {
                            utils.AlertTip('success','删除角色的'+tipText+'成功');
                            var page = new Pages.Pages({
                                showPage: 5,
                                url:listUrl+'?roleId='+roleId,
                                contentEle:currentPanel.find('.tbody'),
                                parentEle:currentPanel
                            });
                        },
                        errorFun:function(){
                            // $(obj).removeClass('disabled').off('click').on('click',function(){
                            //     self.turnPage(index,obj,fun);
                            // });
                        }
                    });
                }
            });
        }

        function getUnassignedResDialog(options) {
            var width = $(window).width() * 0.7;

            var currentPanel = roleTabs.getCurrentPanel();
            var roleId = currentPanel.find('.contentBox').attr('data-role-id');

            var popup = new utils.Popup({
                otherBox: 'listPopBox',
                msg: '<form class="search"><label>'+options.tableTitle[0]+':</label><input name="'+options.searchWord[0]+'" type="text" value=""/><label>'+options.tableTitle[1]+'</label><input name="'+options.searchWord[1]+'" type="text" value=""/>' +
                    '<button class="btn searchBtn">搜索</button></form>'+
                    '<div class="resource"><div class="thead"><span class="w1 allCheck"><input type="checkbox"/></span>'+
                    '<span class="w4">'+options.tableTitle[0]+'</span><span class="w7">'+options.tableTitle[1]+'</span><span>'+options.tableTitle[2]+'</span></div><div class="tbody"><aside>加载中...</aside></div></div>',
                okText: '确定',
                height: 550,
                width: width,
                delayTime: 100,
                isHide:false,
                callback: function () {
                    var popupBox = $('.popupBox');
                    //加载第一页文章
                    var page = new Pages.Pages({
                        showPage: 5,
                        url:options.unassingnedListUrl+'?roleId='+roleId,
                        contentEle:popupBox.find('.resource .tbody'),
                        parentEle:popupBox.find('.resource')
                    });

                    // 搜索功能
                    popupBox.find('.searchBtn').on('click',function(){
                        var param = popupBox.find('form.search').serialize();
                        var page = new Pages.Pages({
                            showPage: 5,
                            url:options.unassingnedListUrl+'?roleId='+roleId+'&'+param,
                            contentEle:popupBox.find('.resource .tbody'),
                            parentEle:popupBox.find('.resource')
                        });
                    });
                },
                okCallback: function () {
                    var currentPanel = roleTabs.getCurrentPanel();
                    var roleId = currentPanel.find('.contentBox').attr('data-role-id');
                    var $liOn = $('.popupBox').find('ul .success');
                    addResourceForRole(popup,options,$liOn,roleId);
                }
            })
        }

        function addResourceForRole(popup,options,$liOn,roleId){
            var currentPanel = roleTabs.getCurrentPanel();
            var resourceIds = [];
            $.each($liOn, function (index, item) {
                resourceIds.push($(item).attr('data-id'));
            });
            var param = {
                roleId:roleId
            };
            param[options.paramName] = resourceIds;

            utils.SendAjax({
                url: options.saveUrl,
                method:'POST',
                param: param,
                tipText: '分配'+options.tipText,
                callback: function (result) {
                    utils.AlertTip('success','分配'+options.tipText+'成功');
                    popup.cancelCallback();
                    var page = new Pages.Pages({
                        showPage: 5,
                        url:options.listUrl+'?roleId='+roleId,
                        contentEle:currentPanel.find('.tbody'),
                        parentEle:currentPanel
                    });
                },
                errorFun:function(){
                    // $(obj).removeClass('disabled').off('click').on('click',function(){
                    //     self.turnPage(index,obj,fun);
                    // });
                }
            });
        }


        //新增
        $body.on('click', '.addRoleBtn', function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:", checkLen);

            var $liOn = systemCom.$tbody.find('ul .success');


            var oldData = {
                "id": $liOn.attr('data-id'),
                "name": $liOn.find('.name').text(),
                "description": $liOn.find('.description').text()

            };

            console.log("oldData:", oldData);
            var popup = new utils.Popup({
                msg: "<h2>新增角色</h2><ul>" +
                "<li><label>角色名称：</label><input type='text' class='name' name='name' value=''><em>*</em></li>" +
                "<li><label>角色描述：</label><input type='text' class='description' name='description' value=''></li>" +
                "<li><label>角色标识：</label><input type='text' class='identifier' name='identifier' value=''></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                isHide: false,
                okCallback: function () {
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'), function (index, item) {
                        var key = $(item).attr('name')
                        if ($(item).val()) {
                            serializeObj[key] = $(item).val()
                        }

                    })

                    console.log("serializeObj:", serializeObj);
                    var reg = /^[0-9a-zA-Z]+$/;
                    if (!serializeObj.name) {
                        new utils.MsgShow({
                            title: '请输入角色名称'
                        }).hideMsg();
                        return
                    }
                    if (!serializeObj.description) {
                        new utils.MsgShow({
                            title: '请输入角色描述'
                        }).hideMsg();
                        return
                    }
                    if (!serializeObj.identifier) {
                        new utils.MsgShow({
                            title: '请输入角色标识'
                        }).hideMsg();
                        return
                    }else if(!reg.test(serializeObj.identifier)){
                        new utils.MsgShow({
                            title: '角色标识只能为数字或字母'
                        }).hideMsg();
                        return
                    }

                    utils.myAjax({
                        type: 'PUT',
                        data: serializeObj,
                        url: '/systems/role/add',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "角色新增成功"
                                }).hideMsg(function () {
                                    popup.hideBoxNoTime();
                                    var page = new Pages.Pages({
                                        showPage: 5,
                                        url:'/systems/role/list',
                                        contentEle:$('#roleList'),
                                        parentEle:$('#tab1')
                                    });
                                })

                            } else {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: json.msg
                                }).hideMsg()
                            }


                        }
                    })

                }
            })

        });

        //修改
        $body.on('click', '.updateRoleBtn', function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:", checkLen);
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择一个要修改的角色'
                }).hideMsg();
                return
            } else if (checkLen > 1) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择一个要修改的角色'
                }).hideMsg();
                return
            }
            var $liOn = systemCom.$tbody.find('ul .success');


            var oldData = {
                "id": $liOn.attr('data-id'),
                "name": $liOn.find('.name').text(),
                "description": $liOn.find('.description').text(),
                "identifier": $liOn.find('.identifier').text()

            };

            console.log("oldData:", oldData);
            var popup = new utils.Popup({
                msg: "<h2>修改角色</h2><ul>" +
                "<li><label>角色名称：</label><input type='hidden' class='id' name='id' value=" + oldData.id + "><input type='text' class='name' name='name' value=" + oldData.name + "></li>" +
                "<li><label>角色描述：</label><input type='text' class='description' name='description' value=" + oldData.description + "></li>" +
                "<li><label>角色标识：</label><input disabled='true' type='text' class='identifier' name='identifier' value=" + oldData.identifier + "></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                okCallback: function () {
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'), function (index, item) {
                        var key = $(item).attr('name')
                        if ($(item).val()) {
                            serializeObj[key] = $(item).val()
                        }

                    })

                    console.log("serializeObj:", serializeObj);

                    utils.myAjax({
                        type: 'PUT',
                        data: serializeObj,
                        url: '/systems/role/update',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "角色修改成功"
                                }).hideMsg(function () {
                                    // window.location.reload();
                                    //window.location.href=pathname
                                    // $liOn.find('.name').html(serializeObj.name)
                                    // $liOn.find('.description').html(serializeObj.description)
                                    var page = new Pages.Pages({
                                        showPage: 5,
                                        url:'/systems/role/list',
                                        contentEle:$('#roleList'),
                                        parentEle:$('#tab1')
                                    });
                                })

                            } else {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: json.msg
                                }).hideMsg()
                            }


                        }
                    })

                }
            })

        });

        //删除
        $body.on('click', '.delRoleBtn', function () {
            var checkLen = systemCom.checkOne();
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择要删除的角色'
                }).hideMsg();
                return
            }
            var serializeObj = [];
            var id = '';
            var name = '';
            var names = [];
            var $liOn = systemCom.$tbody.find('ul .success');
            $.each($liOn, function (index, item) {
                id = $(item).attr('data-id');
                name = $(item).find('.name').text();
                serializeObj.push(id);
                names.push(name)
            })


            console.log("serializeObj:", serializeObj);
            console.log("names:", names);
            var msgHtml = '';
            names.forEach(function (item, index) {
                console.log(item)
                msgHtml += '<p>' + item + '</p>'
            })
            var popup = new utils.Popup({
                msg: "<h2>删除角色</h2><ul>" + msgHtml + "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                okCallback: function () {
                    console.log("serializeObj:", serializeObj);
                    utils.myAjax({
                        type: 'delete',
                        data: {roleIds: serializeObj},
                        url: '/systems/role/delete',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "删除角色成功"
                                }).hideMsg(function () {
                                    $liOn.remove();
                                    //window.location.href=pathname
                                })
                            } else {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: json.msg
                                }).hideMsg()
                            }
                        }
                    })

                }
            })

        });

        function assignResource(url,tipText,contentClass,tableTitle,searchWord) {
            if (!checkCheckBoxNum(1)) {
                return false;
            }

            var selectedLi = $('.tabs-bd-panel.active ul .success');
            var title = selectedLi.find('.name').html()+'的'+tipText;
            var roleId = selectedLi.attr('data-id');

            var newPanel = roleTabs.addTab({
                title: title,
                content: '<div class="'+contentClass+' contentBox" data-role-id="'+roleId+'">'+
                '<form class="search"><label>'+tableTitle[0]+':</label><input name="'+searchWord[0]+'" type="text" value=""/><label>'+tableTitle[1]+':</label><input name="'+searchWord[1]+'" type="text" value=""/>' +
                '<button class="btn searchBtn">搜索</button></form>'+
                '<div class="toolbar"><span class="btn addBtn">添加</span><span class="btn delBtn">删除</span></div>'+
                '<div class="resource"><div class="thead"><span class="w1 allCheck"><input type="checkbox"/></span>'+
                '<span class="w4">'+tableTitle[0]+'</span><span class="w7">'+tableTitle[1]+'</span><span>'+tableTitle[2]+'</span></div><div class="tbody"><aside>加载中...</aside></div></div></div>'
            }).newPanel;

            var page = new Pages.Pages({
                showPage: 5,
                url:url+'?roleId='+roleId,
                contentEle:newPanel.find('.tbody'),
                parentEle:newPanel
            });
        }

        function checkCheckBoxNum(num) {
            var checkLen = roleTabs.getCurrentPanel().find('ul .success').length;
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择一个角色'
                }).hideMsg();
                return false;
            } else if (num && checkLen > num) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择' + num + '个角色'
                }).hideMsg();
                return false;
            }
            return true;
        }

    })

});


console.log("1111")