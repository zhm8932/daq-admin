define(function (require, exports, module) {
    require('jquery');

    function Tabs(selector){
        this.root = null;
        this.navs = [];
        this.init(selector);
    }

    Tabs.prototype.init = function(selector){
        var self = this;
        this.root = $(selector);
        this.navs = this.root.find('ul.tabs-nav li');
        this.navs.each(function(index,ele){
            var closeEle = $(ele).find('.close');
            $(ele).on('click',function(){
                self.triggerTab($(ele));
            });
            closeEle.on('click',function(){
                self.closeTab(closeEle);
            });
        });
    };

    Tabs.prototype.getCurrentTab = function(){
        return this.root.find('.tabs-nav li.active');
    };

    Tabs.prototype.getCurrentPanel = function(){
        return $(this.getCurrentTab().attr('data-target'));
    };

    Tabs.prototype.closeTab = function(closeEle){
        var nav = $(closeEle).closest('li');
        var targetPanel = $(nav.attr('data-target'));
        targetPanel.remove();
        nav.remove();
        this.triggerTab(this.navs.eq(0));
    };

    Tabs.prototype.triggerTab = function(nav){
        this.getCurrentPanel().removeClass('active');
        this.getCurrentTab().removeClass('active');
        nav.addClass('active');
        $(nav.attr('data-target')).addClass('active');
    };

    Tabs.prototype.addTab = function(options){
        var self = this;
        var tabId = 'tab'+(this.navs.length+1);
        var defaults = {
            title:tabId,
            content:tabId
        };
        options = $.extend({}, defaults, options);

        var newTab = $('<li data-target="#'+tabId+'"><a href="javascript:void(0)">'+options.title+'</a><div class="close"></div></li>');
        var newPanel = $('<div id="'+tabId+'" class="tabs-bd-panel">'+options.content+'</div>');
        self.root.find('.tabs-nav').append(newTab);
        self.root.find('.tabs-bd').append(newPanel);
        self.navs.push(newTab);
        self.triggerTab(newTab);
        newTab.on('click',function(){
            self.triggerTab(newTab);
        });
        newTab.find('.close').on('click',function(){
            self.closeTab($(this));
        });
        return{
            newTab:newTab,
            newPanel:newPanel
        }
    };

    module.exports.Tabs = Tabs;

});