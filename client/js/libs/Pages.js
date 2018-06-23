define(function (require, exports, module) {
    require('jquery');
    var utils = require('../utils');

    /**
     *页码控件
     * @param options
     * options = {
            pageCount: 1,//总页数。如果new Pages时没传总页数,则初始化时在页面中通过contentEle.find('.pageCount').val()获取。如果传了总页数,则初始化时无需获取。
            currentPage: 1,//当前页,必传
            showPage: 5,//显示页码按钮的个数
            url:'',//翻页时请求的URL,必传
            contentEle:'',//内容区的顶级元素,必传
            parentEle:'body'//页码控件的父级元素,必传
        };
     * @constructor
     */
    function Pages(options) {
        this.defaults = {
            currentPage: 1,
            showPage: 5,
            url: '',
            contentEle: null,
            parentEle: null
        };
        this.options = $.extend(this.defaults, options);
        this.pageEle = null;
        this.pageHtml = '<div class="pagination"><span class="firstPage">首页</span><span class="lastPage">上一页</span>' +
            '<span class="nextPage">下一页</span><span class="finalPage">末页</span><span class="disabled"><em class="currentPage">%%</em>/<em class="pageCount">??</em></span></div>';

        this.init();
    }

    Pages.prototype.init = function (selector) {
        var self = this;
        //如果new Pages时没传总页数,则初始化时在页面中通过contentEle.find('.pageCount').val()获取。如果传了总页数,则初始化时无需获取。
        if (self.options.pageCount) {
            self.turnPage(1, this);
        } else {
            self.turnPage(1, this, function () {
                var pageCount = parseInt(self.options.contentEle.find('.pageCount').val());
                self.options.pageCount = isNaN(pageCount) ? 0 : pageCount;
            });
        }
    };

    /**
     * 翻页:加载新的数据,构造新的页面元素
     * @param index 当前页
     */
    Pages.prototype.turnPage = function (index, obj, fun) {
        var self = this;
        $(obj).addClass('disabled').off('click');
        utils.SendAjax({
            url: self.options.url,
            param: {
                page: index,
                t: new Date().getTime()
            },
            tipText: '翻页',
            dataType: 'html',
            callback: function (result) {
                self.options.currentPage = index;
                self.options.contentEle.html(result);
                fun && fun();
                self.changePageEle(index);
                $(obj).removeClass('disabled').off('click').on('click', function () {
                    self.turnPage(index, obj, fun);
                });
            },
            errorFun: function () {
                $(obj).removeClass('disabled').off('click').on('click', function () {
                    self.turnPage(index, obj, fun);
                });
            }
        });
    };

    /**
     * 构造新的翻页控件元素,给各元素添加点击事件
     * @param index 当前页
     */
    Pages.prototype.changePageEle = function (index) {
        var self = this;
        var pageCount = self.options.pageCount;
        var currentPage = self.options.currentPage;

        //移除原有翻页组件
        self.options.parentEle.find('.pagination').remove();
        if (pageCount > 0) {
            //构造新的翻页控件,并添加进页面中
            self.pageEle = $(self.pageHtml.replace('%%', currentPage).replace('??', pageCount));
            self.options.parentEle.append(self.pageEle);

            //给翻页控件中的元素添加点击事件
            if (pageCount === 1) {//总页数为1时,所有按钮都置灰
                self.pageEle.find('.firstPage,.lastPage,.finalPage,.nextPage').addClass('disabled');
            } else {
                //总页数大于1时,当前页为1,首页、上一页按钮置灰,末页、下一页添加点击事件
                if (index === 1) {
                    self.pageEle.find('.firstPage,.lastPage').addClass('disabled');
                    self.pageEle.find('.nextPage').on('click', function () {
                        self.turnPage(currentPage + 1, this);
                    });
                    self.pageEle.find('.finalPage').on('click', function () {
                        self.turnPage(pageCount, this);


                    });
                } else if (index === pageCount) {//总页数大于1时,当前页为最后一页,首页、上一页按钮添加点击事件,末页、下一页置灰
                    self.pageEle.find('.finalPage,.nextPage').addClass('disabled');
                    self.pageEle.find('.lastPage').on('click', function () {
                        self.turnPage(currentPage - 1, this);
                    });
                    self.pageEle.find('.firstPage').on('click', function () {
                        self.turnPage(1, this);
                    });
                } else {//总页数大于1时,当前页不为最后一页,也不为第一页,首页、上一页、末页、下一页按钮都添加点击事件
                    self.pageEle.find('.nextPage').on('click', function () {
                        self.turnPage(currentPage + 1, this);
                    });
                    self.pageEle.find('.finalPage').on('click', function () {
                        self.turnPage(pageCount, this);
                    });
                    self.pageEle.find('.lastPage').on('click', function () {
                        self.turnPage(currentPage - 1, this);
                    });
                    self.pageEle.find('.firstPage').on('click', function () {
                        self.turnPage(1, this);
                    });
                }
            }
        }

    };

    module.exports.Pages = Pages;

});