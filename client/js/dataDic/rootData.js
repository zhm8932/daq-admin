define(function (require, exports, module) {
    var utils = require('../utils');
    var TableTree = require('../libs/TableTree');
    var tree = null;

    var columns = [
        {
            title: "名称",
            name: "name",
            width: "30%"
        },{
            title: "排序",
            name: "displayOrder",
            width: "5%"
        },  {
            title: "状态",
            name: "activeState",
            width: "10%",
            render: function (item) {
                return item.activeState == 1 ? '启用' : '未启用';
            }
        }, {
            title: "type",
            name: "type",
            width: "15%"
        }, {
            title: "others",
            name: "others",
            width: "15%"
        }, {
            title: "描述",
            name: "description",
            width: "25%"
        }];

    $(function(){
        reloadTable();

        $('.addBtn').on('click',function(){
            if(!checkChoosedNum(0,1,'最多选中一行')){
                return false;
            }
            var options = {
                title:'新增',
                operation:'add',
                url:'/dataDic/add'
            };

            var length = tree.getCheckedTrList().length;
            if(length > 0){
                var index = tree.getCheckedTrList().eq(0).attr('data-index');
                var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
                options.choosedItem = choosedItem;
                showDialog(options);
            }else{
                showDialog(options);
            }
        });

        $('.updateBtn').on('click',function(){
            if(!checkChoosedNum(1,1,'必须选中一行,且只能选中一行')){
                return false;
            }
            var index = tree.getCheckedTrList().eq(0).attr('data-index');
            var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
            var options = {
                title:'修改',
                operation:'update',
                url:'/dataDic/update',
                choosedItem:choosedItem
            };
            showDialog(options);
        });

        $('.delBtn').on('click',function(){
            if(!checkChoosedNum(1,999,'至少选中一行')){
                return false;
            }
            delMenu();
        });

        $('.updateStateBtn').on('click',function(){
            if(!checkChoosedNum(1,1,'必须选中一行,且只能选中一行')){
                return false;
            }
            updateState();
        });

    });

    function updateState(){
        var activeState = 2,msg = '确定要禁用所选记录及其子记录吗?',tipText = '禁用';
        var choosedItem = tree.options.itemList[tree.getCheckedTrList().eq(0).attr('data-index')];
        if(choosedItem.activeState != 1){//如果当前状态不为1,即为禁用状态,则将更改为启用状态
            msg = '确定要启用该记录吗?';
            activeState = 1;
            tipText = '启用';
        }
        var popup = new utils.Popup({
            msg:msg,
            okText:'确定',
            okCallback:function(){
                utils.SendAjax({
                    url: '/dataDic/updateState',
                    method:'POST',
                    param: {
                        id:choosedItem.id,
                        activeState:activeState
                    },
                    tipText:tipText,
                    callback: function () {
                        utils.AlertTip('success',tipText+'成功');
                        popup.hideBoxNoTime();
                        reloadTable();
                    }
                });
            }
        })
    }


    function delMenu(){
        var popup = new utils.Popup({
            msg:'确定删除该目录及其子目录吗？',
            okText:'确定删除',
            okCallback:function(){
                var ids = [];
                tree.getCheckedTrList().each(function(index,ele){
                    ids.push($(ele).attr('data-id'));
                });
                utils.SendAjax({
                    url: '/dataDic/del',
                    method:'POST',
                    param: {
                        ids:JSON.stringify(ids)
                    },
                    tipText: '删除',
                    callback: function () {
                        utils.AlertTip('success','删除成功');
                        popup.hideBoxNoTime();
                        reloadTable();
                    }
                });
            }
        })
    }

    function reloadTable(){
        utils.SendAjax({
            url: '/dataDic/list',
            method:'GET',
            param:{},
            tipText: '获取根节点数据',
            callback: function (result) {
                tree = new TableTree.TableTree({
                    itemList:result.data,//数据数组,必传
                    columnList:columns,//表格展示列,必传
                    useChkBox:true,
                    isCheckLinkage:false,
                    parentEle:$('#rootTable'),
                    afterRenderFun:function(parentEle){
                        parentEle.find('tr').on('click',function(){
                            $(this).find('input[type=checkbox]').trigger('click');
                        })
                    },
                    afterCheckFun:function(ele){
                        if($(ele).prop('checked')){
                            $(ele).closest('tr').addClass('success');
                        }else{
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
    function showDialog(options){
        var popup = new utils.Popup({
            msg: "<h2>"+options.title+"</h2><ul>" +
                "<form>"+
                "<li class='parent'><label>父级：</label></li>" +
                "<li><label>名称：</label><input type='text' name='name' value=''><em>*</em></li>" +
                "<li><label>排序：</label><input type='text' name='displayOrder' value='0'></li>" +
                "<li><label>type：</label><input type='text' name='type' value=''></li>" +
                "<li><label>描述：</label><input type='text' name='description' value=''></li>" +
                "<li><label>others：</label><input type='text' name='others' value=''></li>" +
                "</form></ul>",
            otherBox: 'menuBox',
            okText: "确认",
            isHide: false,
            callback: function () {
                var form = $('.popupBox').find('form');
                if(options.operation === 'add'){
                    if(options.choosedItem){//新增时有选中元素,则需把选中元素设为新增元素的父级
                        form.find('.parent').append($('<span>'+options.choosedItem.name+'</span><input type="hidden" name="parentId" value="'+options.choosedItem.id+'"/>'));
                        try{
                            var others = options.choosedItem.others && JSON.parse(options.choosedItem.others);
                            if(others.type){
                                form.find('input[name=type]').val(others.type);
                            }else if(options.choosedItem.type){
                                form.find('input[name=type]').val(options.choosedItem.type);
                            }
                        }catch (e){
                            utils.AlertTip('fail','父元素的others不是一个json,无法为新元素的type赋值,请手动填写');
                        }
                    }
                }else if(options.operation === 'update'){
                    if(options.choosedItem){//修改时必须有选中元素,需把选中元素的所有值设置,包括ID
                        form.find('.parent').append($('<span>'+options.choosedItem.parentName+'</span><input type="hidden" name="parentId" value="'+options.choosedItem.parentId+'"/>'));
                        form.append($('<input type="hidden" name="id" value="'+options.choosedItem.id+'"/>'));
                        form.find('input[name=name]').val(options.choosedItem.name);
                        form.find('input[name=displayOrder]').val(options.choosedItem.displayOrder);
                        form.find('input[name=type]').val(options.choosedItem.type);
                        form.find('input[name=others]').val(options.choosedItem.others);
                        form.find('input[name=description]').val(options.choosedItem.description);
                    }
                }
            },
            okCallback:function(){
                var form = $('.popupBox').find('form');
                if(!form.find('input[name=name]').val()){
                    utils.AlertTip('fail','名称不能为空');
                    return false;
                }
                utils.SendAjax({
                    url: options.url,
                    method:'POST',
                    param:form.serialize(),
                    tipText: options.title,
                    callback: function (result) {
                        utils.AlertTip('success',options.title+'成功');
                        popup.hideBoxNoTime();
                        reloadTable();
                    }
                });
            }
        })
    }


    function checkChoosedNum(min,max,tip){
        var length = tree.getCheckedTrList().length;
        if(length < min || length > max){
            var tipText = tip || '选中行数必须大于等于 '+min+' ,小于等于 '+max;
            utils.AlertTip('fail',tipText);
            return false;
        }
        return true;
    }
    
});