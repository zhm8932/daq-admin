define(function (require, exports, module) {
    require('jquery');
    var utils = require('../utils');

    /**
     *
     * @param options
     *
     *
     * columns示例:
     * var columns = [ {
            title: "名称",
            name: "name",
            width: 200
        }, {
            title: "状态",
            name: "activeState",
            width: 100,
            render: function (value) {
                return value == 1 ? '启用' : '未启用';
            }
        }]
     * @constructor
     */

    function TableTree(options) {
        this.defaults = {
            isTreeArray: true,//原始数据是否是树形结构
            isCheckLinkage:true, //子级、父级是否联动选择(选择一个元素：它的子元素都要被选中，它的父元素都要被选中;取消一个元素：它的子元素都要被取消选中)

            itemList: [],//数据数组,必传
            columnList: [],//表格展示列,必传

            openedFolderIconClass: 'icon-opened-folder',
            closedFolderIconClass: 'icon-closed-folder',

            tableClass:'table',
            parentEle: null,
            rootLevel:1 ,//根节点级别,默认为1,用于计算距离

            afterCheckFun:null, //选中后执行的方法
            afterRenderFun:null //渲染table完成后执行的方法

            // multiSelect : false,
            // loadingHTML : '<div>Loading...</div>',
            // cacheItems : true,
            // useChkBox : false,//是否带复选框
            // draggable : false,//节点可否拖放
            // editable : false,//节点可否编辑
            // mouseMenu : null,//弹出菜单，为下拉框的jQuery，
            // ajaxUrl : "",//异步加载的url，一旦设置这个，取代原生的json data
            // reqParam : null	//与ajaxUrl对应的请求参数，为一个{}对象
        };
        this.options = $.extend({}, this.defaults, options);

        // this.$element = $(element);
        // this.childrenElements = [];//子元素节点
        // this.childrenItems = [];//子元素节点数据
        // this.selectedDatas = {};//已选择的数据

        this.init();
    }

    TableTree.prototype.checkAll = function (obj) {
        var self = this;
        var trList = self.options.parentEle.find('tbody tr');
        var checkAllState = $(obj).prop('checked');
        trList.each(function(index,ele){
            if(checkAllState){
                $(ele).find('input[type=checkbox]').each(function(index,ele){
                    if(!$(ele).prop('checked')){
                        $(ele).trigger('click');
                    }
                });
            }else{
                $(ele).find('input[type=checkbox]').each(function(index,ele) {
                    if ($(ele).prop('checked')) {
                        $(ele).trigger('click');
                    }
                });
            }
        });

    };

    TableTree.prototype.getCheckedTrList = function (){
        var self = this;
        var checkedTrList = self.options.parentEle.find('tbody tr').filter(function(index,ele){
            if($(ele).find('input[type=checkbox]:checked').length > 0){
                return true;
            }else{
                return false;
            }
        });
        return checkedTrList;
    };

    TableTree.prototype.init = function () {
        var self = this;
        self.initTreeItems();
        self.renderTable();
        self.options.parentEle.find('.checkAll').on('click',function(){
            self.checkAll(this);
        });
        self.options.parentEle.find('.icon-tree').on('click', function (e) {
            e.stopPropagation();
            self.toggleFolder(this);
        });
        if(self.options.isCheckLinkage){
            self.options.parentEle.find('input[type=checkbox]').on('click', function (e) {
                e.stopPropagation();
                self.toggleCheck(this);
            });
        }
        if(self.options.afterCheckFun){
            self.options.parentEle.find('input[type=checkbox]').on('click', function (e) {
                e.stopPropagation();
                self.options.afterCheckFun(this);
            });
        }

    };

    TableTree.prototype.initTreeItems = function () {
        var self = this;
        if (self.options.isTreeArray) {
            self.options.itemList = _initTreeData([], self.options.itemList, '', 1);
        } else {
            self.options.itemList = _initArrayData([], self.options.itemList, self.options.itemList, 1);
        }
    };

    TableTree.prototype.renderTable = function () {
        var self = this;
        var columnList = self.options.columnList;
        var itemList = self.options.itemList;

        //构造表头
        var tableHtml = [];
        tableHtml.push('<table class="'+self.options.tableClass+'"><thead>');
        if (self.options.useChkBox) {
            tableHtml.push('<th width="3%"><input class="checkAll" type="checkbox"/></th>');
        }
        for (var i = 0; i < columnList.length; i++) {
            tableHtml.push('<th width="' + columnList[i].width + '">' + columnList[i].title + '</th>');
        }
        tableHtml.push('</thead><tbody>');

        //构造表格行
        if (itemList.length > 0) {
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                var level = item.level;
                var parentId = typeof item.parentId != 'undefined' ? item.parentId : '';
                tableHtml.push('<tr data-index="'+ i +'" data-id="' + item.id + '" data-level="' + level + '" data-parentId="' + parentId + '">');
                if (self.options.useChkBox) {
                    if(item.checked){
                        tableHtml.push('<td><input type="checkbox" checked/></td>');
                    }else{
                        tableHtml.push('<td><input type="checkbox"/></td>');
                    }
                }

                for (var j = 0; j < columnList.length; j++) {
                    var column = columnList[j];
                    var tdContent = column.render ? column.render(item) : item[column.name];
                    if (j === 0) {
                        // if (item.childrenLength <= 0) {
                        //     rowHtml.push('<td  style="padding-left:' + ((level - 1) * 25 + 8) + 'px;"><span class="icon-tree">└</span><span>' + tdContent + '</span></td>');
                        // } else {
                        //     rowHtml.push('<td  style="padding-left:' + ((level - 1) * 25 + 8) + 'px;"><span class="icon-tree has-children am-icon-minus-square-o open"></span><span>' + tdContent + '</span></td>');
                        // }
                        tableHtml.push('<td  style="padding-left:' + ((level - self.options.rootLevel) * 25 + 8) + 'px;"><span class="icon-tree open ' + self.options.openedFolderIconClass + '"></span><span>' + tdContent + '</span></td>');
                    } else {
                        tableHtml.push('<td>' + tdContent + '</td>');
                    }

                }
                tableHtml.push('</tr>');
            }
        } else {
            tableHtml.push('<tr><td colspan="4" class="am-text-center">暂无记录</td></tr>');
        }
        tableHtml.push('</tbody>');
        self.options.parentEle.html(tableHtml.join(''));
        self.options.afterRenderFun && self.options.afterRenderFun(self.options.parentEle);
    };

    /**
     * 选择一个元素：它的子元素都要被选中，它的父元素都要被选中
     * 取消一个元素：它的子元素都要被取消选中
     * @param obj 当前被点击的checkbox
     */
    TableTree.prototype.toggleCheck = function (obj) {
        var currentTr = $(obj).closest('tr');
        var level = currentTr.attr('data-level');
        var checkedState = obj.checked;

        var next = currentTr.next();
        while (next.length > 0) {
            if (level < parseInt(next.attr('data-level'))) {
                if (checkedState){
                    next.find('input[type=checkbox]').prop( "checked",true);
                } else {
                    next.find('input[type=checkbox]').prop( "checked",false);
                }
                next = next.next();
            } else {
                break;
            }
        }

        if (checkedState) {
            var last = currentTr.prev();
            while (last.length > 0) {
                var lastLevel = parseInt(last.attr('data-level'));
                if (level > parseInt(last.attr('data-level'))) {
                    last.find('input[type=checkbox]').prop( "checked",true);
                    level = lastLevel;
                }
                last = last.prev();
            }
        }
        return true;
    };

    TableTree.prototype.toggleFolder = function (obj) {
        var self = this;
        var currentTr = $(obj).closest('tr');
        var level = currentTr.attr('data-level');
        var next = currentTr.next();
        while (next.length > 0) {
            if (level < parseInt(next.attr('data-level'))) {
                if ($(obj).hasClass('open')) {
                    next.hide();
                    next.find('.icon-tree').removeClass(self.options.openedFolderIconClass).addClass(self.options.closedFolderIconClass);
                } else {
                    next.show();
                    next.find('.icon-tree').addClass(self.options.openedFolderIconClass).removeClass(self.options.closedFolderIconClass);
                }
                next = next.next();
            } else {
                break;
            }
        }
        if ($(obj).hasClass('open')) {
            $(obj).removeClass('open').removeClass(self.options.openedFolderIconClass).addClass(self.options.closedFolderIconClass);
        } else {
            $(obj).addClass('open').addClass(self.options.openedFolderIconClass).removeClass(self.options.closedFolderIconClass);
        }
    };

    /**
     * 初始化数据,把数据排列成前序遍历后的结果:初始数据为树形结构时的初始化方法
     * @param newItems 新数组:初始传入空数组
     * @param items 原始数据数组
     * @param parentName 父级名称:初始传入空
     * @returns {*}
     * @private
     */
    function _initTreeData(newItems, items, parentName, level) {
        for (var i = 0, j = items.length; i < j; i++) {
            var item = items[i];
            item.parentName = parentName;
            // console.log("parentName:"+item.parentName+",name:"+item.name);
            item.level = level;
            item.childrenLength = item.children && item.children.length;
            newItems.push(item);
            if (item.children) {
                newItems = _initTreeData(newItems, item.children, item.name, level + 1);
            }
        }
        return newItems;
    }


    /**
     * 初始化数据,把数据排列成前序遍历后的结果:初始数据为乱序数组时(不为树形结构)的初始化方法
     * @param newItems 新数组:初始值传入空数组
     * @param parents 父亲节点:初始值传入原始数组
     * @param originItems 原始数组
     * @param level 当前级别:初始值传入1
     * @private
     */
    function _initArrayData(newItems, parents, originItems, level) {
        for (var i = 0; i < parents.length; i++) {

            //判断是否存在于新数组中,如果存在就不放进去.如果不存在,就判断一下parentId是否为-1,是则放入新数组中,否则不放
            if ($.inArray(parents[i], newItems) < 0 && parents[i].parentId == -1) {
                newItems.push(parents[i]);
            }

            var index = $.inArray(parents[i], newItems);//得到当前节点在newItems中的位置
            if (index >= 0 && !newItems[index].level) {
                var children = [];
                //找到所有孩子节点,插入新的数组中
                for (var j = 0; j < originItems.length; j++) {
                    if (originItems[j].parentId == parents[i].id) {
                        newItems.splice(index + 1 + children.length, 0, originItems[j]);
                        children.push(originItems[j]);
                    }
                }

                newItems[index].level = level;
                newItems[index].childrenLength = children.length;

                if (children.length > 0) {
                    _initArrayData(newItems, children, originItems, level + 1);
                }
            }
        }
        return newItems;
    }

    module.exports.TableTree = TableTree;

});