define(function (require, exports, module) {
    var utils = require('../utils');
    var Tabs = require('../libs/Tabs');
    var Pages = require('../libs/Pages');
    var systemCom = require('./system_com');

    require('../libs/md5');

    var userTabs = new Tabs.Tabs('#userTabs');//初始化tabs

    function md5(str) {
        return hex_md5(str).toUpperCase();
    }

    $(function () {
        var $body = $('body');

        var page = new Pages.Pages({
            showPage: 5,
            // url:'/systems/user/list?roleIds='+JSON.stringify([1,2,3]),
            url:'/systems/user/list',
            contentEle:$('#userList'),
            parentEle:$('#tab1')
        });

        //新增
        var roleData = '';  //用户角色
        $body.on('click', '.addBtn', function () {
            var popup = new utils.Popup({
                msg: "<h2>新增系统用户</h2><ul>" +
                "<li><label>用户名称：</label><input type='text' class='nick' name='nick' value='' ></li>" +
                "<li><label>用户账号：</label><input type='text' class='account' name='account' value='' placeholder='支持英文字母、数字组合，4-20个字符'><em>*</em></li>" +
                "<li><label>设置密码：</label><input type='password' class='password' name='password' value=''><em>*</em></li>" +
                "<li><label>确认密码：</label><input type='password' class='rePassword' name='rePassword' value=''><em>*</em></li>" +
                "<li><label>用户角色：</label><select class='roleIds' name='roleId'></select><em>*</em></li>" +
                "<li><label>默认角色：</label>是<input type='radio' class='isDefault' name='isDefault' value='true' checked='true'>否<input type='radio' class='isDefault' name='isDefault' value='false'></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                isHide: false,
                callback:function () {
                    var data = '';
                    if(!roleData){
                        utils.myAjax({
                            type: 'get',
                            data: {bSend:true},
                            url: '/systems/get_role_list',
                            success: function (json) {
                                if(json.success){
                                    roleData = json.data.data;
                                    var html = '<option value="">请选择用户角色</option>';
                                    roleData.forEach(function (item,index) {
                                        html +='<option value="'+item.id+'">'+item.name+'</option>';
                                        $('.roleIds').html(html);

                                    })
                                }


                            }
                        })
                    }else{
                        var html = '<option value="">请选择用户角色</option>';
                        roleData.forEach(function (item,index) {
                            html +='<option value="'+item.id+'">'+item.name+'</option>';
                            $('.roleIds').html(html);

                        })
                    }

                },
                okCallback: function () {
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'), function (index, item) {
                        var key = $(item).attr('name')
                        if ($(item).val()) {
                            serializeObj[key] = $(item).val()
                        }

                    })

                    serializeObj.isDefault = $('.menuBox input:radio:checked').val();

                    console.log("serializeObj:", serializeObj);
                    var reg=/^(([a-zA-Z])|([0-9]+[a-zA-Z]+))[a-zA-Z0-9]*$/;  //不能为纯数字，

                    if (!serializeObj.account) {
                        new utils.MsgShow({
                            title: '请输入用户账号'
                        }).hideMsg();
                        return
                    }
					if(!reg.test(serializeObj.account)){
                        new utils.MsgShow({
                            title: '用户账号支持英文字母、数字，4-20个字符（不能为纯数字）'
                        }).hideMsg();
                        return
                    }
					if (serializeObj.account.length<4||serializeObj.account.length>20) {
                        new utils.MsgShow({
                            title: '用户账号请输入4-20个字符'
                        }).hideMsg();
                        return
                    }
                    
                    if (!serializeObj.password) {
                        new utils.MsgShow({
                            title: '请设置密码'
                        }).hideMsg();
                        return
                    }
                    if (serializeObj.rePassword!=serializeObj.password) {
                        new utils.MsgShow({
                            title: '设置密码和确认密码必须一致！'
                        }).hideMsg();
                        return
                    }

                    if (!serializeObj.roleId) {
                        new utils.MsgShow({
                            title: '请选择用户角色'
                        }).hideMsg();
                        return
                    }

                    serializeObj.password = md5(serializeObj.password);


                    utils.myAjax({
                        type: 'post',
                        data: serializeObj,
                        url: '/systems/user/add',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "新增用户成功"
                                }).hideMsg(function () {
                                    popup.hideBoxNoTime();
                                    // var page = new Pages.Pages({
                                    //     showPage: 5,
                                    //     url:'/systems/role/list',
                                    //     contentEle:$('#roleList'),
                                    //     parentEle:$('#tab1')
                                    // });
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
        $body.on('click', '.updateBtn', function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:", checkLen);
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择一个要修改的用户'
                }).hideMsg();
                return
            } else if (checkLen > 1) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择一个要修改的用户'
                }).hideMsg();
                return
            }
            var $liOn = systemCom.$tbody.find('ul .success');


            var oldData = {
                "id": $liOn.attr('data-id'),
                "account": $liOn.find('.account').text(),
                "nick": $liOn.find('.nick').text(),
                "mobile": $liOn.find('.mobile').text()

            };

            console.log("oldData:", oldData);
            var popup = new utils.Popup({
                msg: "<h2>修改系统用户</h2><ul>" +
                "<li><label>用户账号：</label><input type='text' disabled='true' class='account' name='account' value=" + oldData.account + "></li>" +
                "<li><label>用户名称：</label><input type='hidden' class='accountId' name='accountId' value=" + oldData.id + "><input type='text' class='nick' name='nick' value=" + oldData.nick + "></li>" +
                // "<li><label>手机号码：</label><input type='text' class='mobile' name='mobile' value=" + oldData.mobile + "></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                isHide:false,
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
                        url: '/systems/user/update',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "用户修改成功"
                                }).hideMsg(function () {
                                    // window.location.reload();
                                    //window.location.href=pathname
                                    $liOn.find('.account').html(serializeObj.account)
                                    $liOn.find('.nick').html(serializeObj.nick);
                                    $liOn.find('.mobile').html(serializeObj.mobile);
                                    $liOn.removeClass().find('.check input').attr('checked',false);
                                    popup.hideBoxNoTime();
                                    // var page = new Pages.Pages({
                                    //     showPage: 5,
                                    //     url:'/systems/role/list',
                                    //     contentEle:$('#roleList'),
                                    //     parentEle:$('#tab1')
                                    // });
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

        //重置密码
        $body.on('click', '.resetPasswordBtn', function () {
            var checkLen = systemCom.checkOne();
            console.log("checkLen:", checkLen);
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择一个要修改的用户'
                }).hideMsg();
                return
            } else if (checkLen > 1) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择一个要修改的用户'
                }).hideMsg();
                return
            }
            var $liOn = systemCom.$tbody.find('ul .success');


            var oldData = {
                "id": $liOn.attr('data-id'),
                "account": $liOn.find('.account').text(),
                "nick": $liOn.find('.nick').text(),

            };

            console.log("oldData:", oldData);
            var popup = new utils.Popup({
                msg: "<h2>重置密码</h2><ul>" +
                "<li><label>用户名称：</label><input type='hidden' class='accountId' name='accountId' value=" + oldData.id + "><input type='text' class='nick' name='nick' value=" + oldData.nick + " disabled=true></li>" +
                "<li><label>用户账号：</label><input type='text' class='account' name='account' value=" + oldData.account + " disabled=true></li>" +
                "<li><label>新&nbsp;&nbsp;密&nbsp;&nbsp;码：</label><input type='password' class='newPassword' name='newPassword' value=''></li>" +
                // "<li><label>排序：</label><input type='text' class='pos' name='position' value="+oldData.id+"></li>" +
                "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                isHide:false,
                okCallback: function () {
                    var serializeObj = {};
                    $.each($('.menuBox').find('input,textarea,select'), function (index, item) {
                        var key = $(item).attr('name')
                        if ($(item).val()) {
                            serializeObj[key] = $(item).val()
                        }

                    });
                    if(serializeObj.newPassword){
                        serializeObj.newPassword = md5(serializeObj.newPassword)
                    }else{
                        new utils.MsgShow({
                            delayTime: 2000,
                            title: '请输入新密码！'
                        }).hideMsg();
                        return
                    }

                    console.log("serializeObj:", serializeObj);

                    utils.myAjax({
                        type: 'PUT',
                        data: serializeObj,
                        url: '/systems/user/reset_password',
                        success: function (json) {
                            var json = JSON.parse(json);
                            console.log(json)
                            if (json.success) {
                                var myMsg = new utils.MsgShow({
                                    delayTime: 2000,
                                    title: "用户密码修改成功"
                                }).hideMsg(function () {
                                    popup.hideBoxNoTime();

                                    // window.location.reload();
                                    //window.location.href=pathname
                                    // $liOn.find('.name').html(serializeObj.name)
                                    // $liOn.find('.description').html(serializeObj.description)
                                    // var page = new Pages.Pages({
                                    //     showPage: 5,
                                    //     url:'/systems/role/list',
                                    //     contentEle:$('#roleList'),
                                    //     parentEle:$('#tab1')
                                    // });
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

        //禁用、启用
        $body.on('click', '.disableBtn,.enableBtn', function () {
            var checkLen = systemCom.checkOne();
            var $liOn = systemCom.$tbody.find('ul .success');
            var originalState = $liOn.attr('data-accountStatus');
            var accountStatus = '';
            var msg = '';
            var serializeObj = [];
            var id = '';
            var name = '';
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择要'+msg+'的用户账号'
                }).hideMsg();
                return
            } else if (checkLen > 1) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择一个要'+msg+'的用户账号'
                }).hideMsg();
                return
            }

            var oldData = {
                "id": $liOn.attr('data-id'),
                "account": $liOn.find('.account').text(),
                "nick": $liOn.find('.nick').text()

            };

            if($(this).hasClass('disableBtn')){
                accountStatus = 'disable';
                msg = '禁用';
                if(originalState=='disable'){
                    new utils.MsgShow({
                        delayTime: 2000,
                        title: '账号【'+oldData.account+'】已禁用，请勿重复操作'
                    }).hideMsg();
                    return
                }
            }else{
                accountStatus = 'normal';
                msg = '启用';
                if(originalState=='normal'){
                    new utils.MsgShow({
                        delayTime: 2000,
                        title: '账号【'+oldData.account+'】已启用，请勿重复操作'
                    }).hideMsg();
                    return
                }
            }


            var popup = new utils.Popup({
                msg: "<h2>"+msg+"用户账号</h2><ul>用户账号：" + oldData.account + "</ul>",
                otherBox: 'menuBox',
                okText: "确认",
                okCallback: function () {
                    var serializeObj = {};
                    serializeObj.accountId = oldData.id;
                    serializeObj.accountStatus = accountStatus;
                    utils.myAjax({
                        type: 'put',
                        data: serializeObj,
                        url: '/systems/user/change_status',
                        success: function (json) {
                            var json = JSON.parse(json);
                            if (json.success) {
                                 new utils.MsgShow({
                                    delayTime: 2000,
                                    title: msg+"用户账号成功"
                                }).hideMsg(function () {
                                    var html = accountStatus =='normal'?'<em>启用</em>':'<em class="red">禁用</em>';
                                    $liOn.attr('data-accountStatus',accountStatus)
                                    $liOn.find('.accountStatus').html(html)
                                    $liOn.removeClass().find('.check input').attr("checked",false);
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

        //搜索
        
        $body.on('click','.searchBtn',function () {
            // var roleIdsDefault = [1,2,3,4];
            var account = $('.search .account').val();
            var nick = $('.search .nick').val();
            var accountStatus = $('.search .accountStatus').val();
            var roleId = $('.search .roleIds').val();
            var roleIds  = roleId?[roleId]:'';
            var query = {
                account:account,
                nick:nick,
                accountStatus:accountStatus,
                roleIds:JSON.stringify(roleIds)
            };
            var queryStr = '';
            for (var key in query){
                if(query[key]){
                    if(key!='roleIds'){
                        queryStr+= key+'='+query[key]+'&'
                    }else{
                        queryStr+= key+'='+query[key]
                    }

                }
            }

            console.log(queryStr)

            var page = new Pages.Pages({
                showPage: 5,
                url:'/systems/user/list?'+queryStr,
                contentEle:$('#userList'),
                parentEle:$('#tab1')
            });
        });




        $('.assignRole').on('click',function(){
            assignRole('/systems/user/roleList','角色管理','roleMng',['角色名称','角色描述','角色标识','角色状态']);
        });


        $body.on('click', '.roleMng .addBtn', function () {
            getUnassignedRoleDialog({
                tableTitle:['角色名称','角色描述','角色标识','角色状态'],
                saveUrl:'/systems/user/addRole',
                listUrl:'/systems/user/roleList',
                unassingnedListUrl:'/systems/user/unassignedRolelist',
                tipText:'角色',
                paramName:'roleIds'
            });
        });

        $body.on('click', '.roleMng .delBtn', function () {
            delRoleForUser('/systems/user/delRole','roleIds','/systems/user/roleList','角色');
        });

        $body.on('click', '.roleMng .setDftRoleBtn', function () {
            setDftRoleForUser();
        });

        function setDftRoleForUser(delUrl,paramName,listUrl,tipText){
            if (!checkCheckBoxNum(1)) {
                return false;
            }

            var popup = new utils.Popup({
                msg: '确定设置该角色为用户的默认角色吗?',
                okText: '确定',
                delayTime: 100,
                okCallback: function () {
                    var currentPanel = userTabs.getCurrentPanel();
                    var roleId = currentPanel.find('ul .success').attr('data-id');
                    var userId = currentPanel.find('.contentBox').attr('data-id');

                    var param = {
                        userId:userId,
                        roleId:roleId
                    };
                    utils.SendAjax({
                        url: '/systems/user/dftRole',
                        method:'POST',
                        param:param,
                        tipText: '设置默认角色',
                        callback: function (result) {
                            utils.AlertTip('success','设置默认角色成功');
                            var page = new Pages.Pages({
                                showPage: 5,
                                url:'/systems/user/roleList'+'?userId='+userId,
                                contentEle:currentPanel.find('.tbody'),
                                parentEle:currentPanel
                            });
                        }
                    });
                }
            });
        }


        function delRoleForUser(delUrl,paramName,listUrl,tipText){
            var currentPanel = userTabs.getCurrentPanel();
            var $liOn = currentPanel.find('ul .success');
            var isDefault = false;
            $liOn.each(function(index,ele){
                if($(ele).attr('data-isDefault') === 'true'){
                    utils.AlertTip('fail','不能删除默认角色');
                    isDefault = true;
                    return false;
                }
            });
            if(isDefault){return false;}
            var popup = new utils.Popup({
                msg: '确定删除该用户的'+tipText+'吗?',
                okText: '确定删除',
                delayTime: 100,
                okCallback: function () {

                    var id = currentPanel.find('.contentBox').attr('data-id');
                    var idList = [];
                    $.each($liOn, function (index, item) {
                        idList.push($(item).attr('data-id'));
                    });
                    var param = {
                        userId:id
                    };
                    param[paramName] = idList;
                    utils.SendAjax({
                        url: delUrl,
                        method:'POST',
                        param:param,
                        tipText: '删除用户的'+tipText,
                        callback: function (result) {
                            utils.AlertTip('success','删除用户的'+tipText+'成功');
                            var page = new Pages.Pages({
                                showPage: 5,
                                url:listUrl+'?userId='+id,
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

        function getUnassignedRoleDialog(options) {
            var width = $(window).width() * 0.7;

            var currentPanel = userTabs.getCurrentPanel();
            var id = currentPanel.find('.contentBox').attr('data-id');

            var popup = new utils.Popup({
                otherBox: 'listPopBox',
                msg: '<div id="searchForm" class="search"><label>搜索:</label><input id="tc" type="text" placeholder="可根据标题、内容搜索",name="tc" value=""/>' +
                '<label>所属栏目:</label><select name="category"></select>' +
                '<button class="btn search">搜索</button></div><div class="resource"><div class="thead"><span class="w1 allCheck"><input type="checkbox"/></span>'+
                '<span class="w4">'+options.tableTitle[0]+'</span><span class="w4">'+options.tableTitle[1]+'</span><span class="w4">'+options.tableTitle[2]+'</span></div><div class="tbody"><aside>加载中...</aside></div></div>',
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
                        url:options.unassingnedListUrl+'?userId='+id,
                        contentEle:popupBox.find('.resource .tbody'),
                        parentEle:popupBox.find('.resource')
                    });

                    //搜索功能
                    // var page = new Pages.Pages({
                    //     showPage: 5,
                    //     url:'/role/url/unassignedList'+'?roleId='+roleId+'&',
                    //     contentEle:popupBox.find('.resource .tbody'),
                    //     parentEle:popupBox.find('.resource')
                    // });

                },
                okCallback: function () {
                    var currentPanel = userTabs.getCurrentPanel();
                    var id = currentPanel.find('.contentBox').attr('data-id');
                    var $liOn = $('.popupBox').find('ul .success');
                    addResourceForRole(popup,options,$liOn,id);
                }
            })
        }

        function addResourceForRole(popup,options,$liOn,id){
            var currentPanel = userTabs.getCurrentPanel();
            var idList = [];
            $.each($liOn, function (index, item) {
                idList.push($(item).attr('data-id'));
            });
            var param = {
                userId:id
            };
            param[options.paramName] = idList;

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
                        url:options.listUrl+'?userId='+id,
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



        function assignRole(url,tipText,contentClass,tableTitle) {
            if (!checkCheckBoxNum(1)) {
                return false;
            }

            var selectedLi = $('.tabs-bd-panel.active ul .success');
            var title = selectedLi.find('.account').html()+'的'+tipText;
            var id = selectedLi.attr('data-id');

            var newPanel = userTabs.addTab({
                title: title,
                content: '<div class="'+contentClass+' contentBox" data-id="'+id+'"><div class="toolbar"><span class="btn addBtn">添加</span><span class="btn delBtn">删除</span><span class="btn setDftRoleBtn">设为默认角色</span></div>'+
                '<div class="resource"><div class="thead"><span class="w1 allCheck"><input type="checkbox"/></span>'+
                '<span class="w4">'+tableTitle[0]+'</span><span class="w4">'+tableTitle[1]+'</span><span class="w4">'+tableTitle[2]+'</span><span>'+tableTitle[3]+'</span></div><div class="tbody"><aside>加载中...</aside></div></div></div>'
            }).newPanel;

            var page = new Pages.Pages({
                showPage: 5,
                url:url+'?userId='+id,
                contentEle:newPanel.find('.tbody'),
                parentEle:newPanel
            });
        }


        function checkCheckBoxNum(num) {
            var checkLen = userTabs.getCurrentPanel().find('ul .success').length;
            if (!checkLen) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '请选择一条项目'
                }).hideMsg();
                return false;
            } else if (num && checkLen > num) {
                new utils.MsgShow({
                    delayTime: 2000,
                    title: '只能选择' + num + '条项目'
                }).hideMsg();
                return false;
            }
            return true;
        }

    })

});

