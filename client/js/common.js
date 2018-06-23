//公共

define(function(require,exports,module) {
    require('jquery')
    var utils = require('./utils')
    $(function(){
        //加载左侧导航
        var $leftMenu = $(".leftMenu")
        var $h3_menu = $('.leftMenu').find('h3')

        $leftMenu.on('click','h3',function(){
            var self = this
            leftMenu.menuTab(self)
        })


        //左侧导航构造函数
        function LeftMenu(){
            //this.opts = $.extend({},LeftMenu.Defaults,opts);
            this.li = $(".leftMenu ul li");
            this.curPathname = window.location.pathname
            //console.log(window.location)
            this.liOn()
        }

        //导航tab效果
        LeftMenu.prototype.menuTab = function(ele){
            var $ele = $(ele);
            $ele.addClass('on').siblings(self).removeClass('on');
            $ele.next("ul").slideToggle().siblings("ul").slideUp();
            return false
        }
        //给导航每一项的根据当前页面链接自动添加样式
        LeftMenu.prototype.liOn = function(ele) {
            //console.log(this)
            var ele = $(this.li).find('a')   // li中的每个a
            //var indexName = window.location.pathname; //获取当前页路径
            var indexName = this.curPathname; //获取当前页路径
            //遍历每个li a，获取href
              for (var i = 0, len = ele.length; i < len; i++) {
                var mUrl = $(ele[i]).attr('href');
                  // console.log("mUrl:",mUrl)
                if ((mUrl.search(indexName) != -1 && mUrl != ''&& indexName != '/')||mUrl != ''&&indexName.search(mUrl) != -1) {
                    $(ele[i]).parent().addClass("active").parent().show()
                    $(ele[i]).parent().parent().prev().addClass("on")

                }

            }
        }
        //实例化
        var leftMenu = new LeftMenu()
        //console.log(leftMenu)

        var tabSpan = $('.tab .hd span')
        var $menu_a = $(".leftMenu ul li.active a")
        var menu_active_href = $menu_a.attr('href')
        var curUrl = window.location.pathname
        // console.log('curUrl:',curUrl);
        //console.log('menu_active_href:',menu_active_href);
        for(var i= 0,len=tabSpan.length;i<len;i++){
            var sUrl = $(tabSpan[i]).find('a').attr('href');
            if(sUrl){
                if(sUrl.search(curUrl)!=-1 && menu_active_href!=curUrl){
                    $(tabSpan[i]).addClass('on')
                }else if(sUrl.search(curUrl)!=-1){
                    $(tabSpan[0]).addClass('on')
                }
            }else{
                $(tabSpan[0]).addClass('on')
            }


        }
        $('.tab .hd span').click(function(){
            $(this).addClass('on').siblings().removeClass('on');
        })






        $('.header button').click(function(e){
            e.stopPropagation()
            if($('.leftMenu nav').is(':hidden')){
                console.log("11111")
                $('.leftMenu nav').show().animate({left:'0px'})
            }else{
                console.log("2222222")
                $('.leftMenu nav').animate({left:'-200px'}).hide(300)
            }

        })

        $('.main,.header').click(function(){
            if(utils.browser.mobile){
                console.log('mobile')
                if(!$('.leftMenu nav').is(':hidden')){
                    $('.leftMenu nav').animate({left:'-200px'}).hide(300)
                }
            }

        })

        $('body').on('change','.select',function () {
            window.location = $(this).val()
        })


    })

})
