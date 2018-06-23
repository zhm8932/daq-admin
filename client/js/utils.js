//define(['jquery'],function(require,exports,module) {
define(function (require, exports, module) {
    //弹出框
    require('jquery')

    var config = require('./config');

    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function Popup(options) {
        var defaults = {
            ok: 'ok',
            cancel: 'cancel',
            close: 'close',
            globalBg: 'globalBg',
            popupBox: 'popupBox',
            otherBox: '',
            isHide: true,
            msg: '请输入内容',
            delayTime: 2000,
            okText: '确定',
            cancelText: '取消',
            bCancel:false,
            okCallback: null,
            callback: null
        }
        this.opts = $.extend({}, defaults, options);
        this.popupBox = this.opts.popupBox;
        this.$body = $('body');
        this.init()
    }

    Popup.prototype = {
        init: function () {
            var self = this;
            self.render();
            $('.' + self.popupBox).show();
            //事件解绑
            self.$body.off('click', '.' + self.opts.ok);
            self.$body.on('click', '.' + self.opts.ok, function () {
                self.opts.okCallback();
                if (self.opts.isHide) {
                    self.hideBox()
                }
            });
            $(window).on('keydown',function(e){
                if(e.keyCode =='13'){
                    self.opts.okCallback();
                    if(self.opts.isHide){
                        self.hideBox()
                    }
                }
            });

            //点击取消
            this.$body.on('click', '.' + this.opts.cancel, function () {
                self.cancelCallback();


            })
            //关闭
            this.$body.on('click', '.' + this.opts.close, function () {
                self.cancelCallback();


            })
        },
        hideBox: function (cb) {
            var self = this;
            setTimeout(function () {
                $('.' + self.popupBox).hide();
                //console.log(self.opts)
                $('.' + self.opts.globalBg).hide();
                cb && cb()
            }, self.opts.delayTime)
        },
        hideBoxNoTime: function (cb) {
            var self = this;
            $('.' + self.popupBox).hide();
            //console.log(self.opts)
            $('.' + self.opts.globalBg).hide();
            cb && cb()
        },
        globalBgFn: function () {
            var globalBgHtml = '<div class="globalBg"></div>'
            if ($('.globalBg').length) {
                $('.globalBg').show();
            } else {
                this.$body.append(globalBgHtml)
            }
        },
        render: function () {
            var self = this;
            self.globalBgFn();
            if ($('.' + self.popupBox).length) {
                $('.' + self.popupBox).remove()
                self.$body.append(this.popupHtml())
            } else {
                this.$body.append(this.popupHtml())
            }

            // var heigth = '';
            // if(this.opts.height){
            //     height = this.opts.height + 'px';
            // }else{
            //     height =  $('.' + this.opts.popupBox).height();
            // }
            var height =  this.opts.height || $('.' + this.opts.popupBox).height();
            var width =  $('.' + this.opts.popupBox).outerWidth();
            $('.' + self.popupBox).css({'height': height, 'margin-top': -height / 2,'margin-left':-width/2});
            self.opts.callback&&self.opts.callback()
        },
        popupHtml: function () {
            var opts = this.opts;
            var ConfimHtml='',cancelHtml='';
            if(opts.bCancel){
                // console.log("取消按钮")
                cancelHtml = '<button class="' + this.opts.cancel + '">' + opts.cancelText + '</button>'
            }

            ConfimHtml =
                '<div class="' + this.popupBox + ' ' + this.opts.otherBox + '" style="width: ' + this.opts.width + 'px;margin-left:-' + opts.width / 2 + 'px">' +
                    '<span class="' + this.opts.close + '">关闭</span>' +
                    '<article>' + this.opts.msg + '</article>' +
                    '<div class="submitBox">'+cancelHtml+'<button class="' + this.opts.ok + '">' + this.opts.okText + '</button></div>' +
                '</div>';


            return ConfimHtml
        },
        cancelCallback: function () {   //关闭弹窗
            $('.globalBg').hide();
            $('.' + this.popupBox).remove();

        }
    }

    //信息提示框
    function MsgShow(options) {
        var defaults = {
            closeBtn: '.closeBtn',
            mainCell: 'msgBox',
            title: '提示语',
            delayTime: 1500,
            interTime: 1500,
            width: 300,
            height: 50,
            effect: 'fade'
        };


        this.options = $.extend({}, defaults, options);
        this.mainCell = this.options.mainCell;

        this.init();
    }

    MsgShow.prototype = {
        init: function () {
            var self = this,
                opts = self.options,
                effect = opts.effect,
                interTime = opts.interTime;
            //console.log(effect)
            switch (effect) {
                case 'fade':
                    this.render();
                    $('.' + self.mainCell).fadeIn();
                    break;

            }

        },
        setHtml: function () {
            return '<div class="' + this.options.mainCell + '"></div>'
        },
        hideMsg: function (cb) {
            var self = this;
            setTimeout(function () {
                $('.' + self.mainCell).hide();
                if (typeof  cb == 'function') {
                    cb();
                }

            }, this.options.delayTime)
        },
        render: function () {
            var boxHtml = '';
            var opts = this.options,
                width = opts.width,
                height = opts.height;
            var $mainCell = $('.' + opts.mainCell);
            // console.log('99999999')
            // console.log('99999999:',$mainCell)

            if (!$('.' + opts.mainCell).length) {
                $('body').append(this.setHtml());
            } else {
                $('.' + opts.mainCell).show();
            }
            // $mainCell.show();
            $('.' + opts.mainCell).html(this.options.title);

            var height =$('.' + opts.mainCell).outerHeight();
            $('.' + opts.mainCell).css({
                width: width + 'px',
                // height: height + 'px',
                // 'line-height': height + 'px',
                'margin-left': -width / 2,
                'margin-top': -height / 2
            })




        }
    }

    function myAjax(option) {
        var $okBtn = $('.popupBox .ok');
        $.ajax({
            type:option.type||'get',
            data:option.data,
            beforeSend:function () {
                // console.log("开始发送请求");
                !option.bSend&&$okBtn.attr('disabled',true).addClass('disabled')

            },
            complete: function () {
                // console.log("请求完成");
                setTimeout(function () {
                    !option.bSend&&$okBtn.attr('disabled',false).removeClass('disabled');
                },option.delayTime||1500);

            },
            url:option.url,
            success:function (json) {
                // console.log("请求成功");
                option.success&&option.success(json)
            }
        })
    }
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var browser = {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    }

    function CheckNull(id) {
        var value = $('#' + id).val();
        if (value.trim() == '') {
            $('#' + id).parent().find('.tip').html('不能为空');
            return false;
        }
        return true;
    }

    function SendAjax(options) {
        $.ajax({
            url: options.url,
            type: options.method || 'GET',
            data: options.param || {},
            dataType:options.dataType || 'json',
            // contentType: options.contentType || 'application/x-www-form-urlencoded;charset=UTF-8;',
            success: function (result) {
                if(options.dataType == 'html'){
                    options.callback && options.callback(result);
                }else{
                    // var result = JSON.parse(data);
                    if (result.success) {
                        options.callback && options.callback(result);
                    } else {
                        //弹框提示失败
                        alertTip('fail', options.tipText + '失败,原因是:' + result.msg);
                        options.errorFun && options.errorFun();
                    }
                }
            },
            error: function (data) {
                if (data.status == '404') {
                    alertTip('fail', '页面丢失，稍后再试');
                } else if (data.status == '500') {
                    alertTip('fail', '系统忙，稍后再试');
                } else {
                    alertTip('fail', '出错了,响应码是' + data.status + ',请联系管理员');
                }
                options.errorFun && options.errorFun();
            }
        });
    }

    $.fn.center = function () {
        this.css('position', 'absolute');
        this.css('top', ( $(window).height() - this.height() ) / 2 + $(window).scrollTop() + 'px');
        this.css('left', ( $(window).width() - this.width() ) / 2 + $(window).scrollLeft() + 'px');
        return this;
    };

    function alertTip(success, tipText, fun) {
        if (success == 'success') {
            var html = '<div id="alertTip" class="alert-tip alert-success ">' + tipText + '</div>';
        } else {
            var html = '<div id="alertTip" class="alert-tip alert-fail">' + tipText + '</div>';
        }
        $(html).appendTo($("body").eq(0));
        $('#alertTip').center();
        $('#alertTip').show(1000);
        setTimeout(function () {
            $('#alertTip').hide(100);
            $('#alertTip').remove();
            fun && fun();
        }, 2500);
    }

    function addCookie(name, value, path, expireHours) {
        var cookieString = name + "=" + escape(value);
        cookieString += '; path=' + path;
        //判断是否设置过期时间
        if (expireHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expireHours * 3600 * 1000);
            cookieString = cookieString + "; expire=" + date.toGMTString();
        }
        document.cookie = cookieString;
    }

    function getCookie(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name)return arr[1];
        }
        return "";
    }

    function deleteCookie(name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=v; expire=" + date.toGMTString();
    }


    function getLoacalTimeString(timestamp) {
        if(timestamp){
            var date = new Date(timestamp);
        }else{
            var date = new Date();
        }
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        var time = hours + ':' + minutes + ':' + seconds;
        return time;
    };


    String.prototype.trim = function () {

        return this.replace(/(^\s*)|(\s*$)/g, '');
    }

    function stringJSON(serialize) {
        var serialize = serialize.replace(/\+/g, " ").split('&');
        var serializeObj = {},
            str = '';
        for (var i = 0, len = serialize.length; i < len; i++) {
            str = serialize[i].split('=');
            serializeObj[str[0]] = decodeURIComponent(decodeURI(str[1])).trim()
            //serializeObj[str[0]] = unescape(str[1])
        }
        return serializeObj
    }
    //获取字节长度
    function getLength(str)
    {
        var realLength = 0;
        for (var i = 0; i < str.length; i++)
        {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 0.5;
            else
                realLength += 1;
        }
        console.log(realLength)
        return realLength;
    }

    function getObj(name,serializeObj,$self) {
        var $ele = $('.'+name,$self)
        var nameArr = [];
        $.each($ele,function (i,item) {
            if($(item).val()){
                nameArr.push($(item).val())
            }

        })
        serializeObj[name] = nameArr;
    }

    var periodArr = [];
    function get_period(source) {
        var html = '<option value=""></option>';
        var bSelsct = null;
        if(!periodArr.length){
            console.log('222222')
            $.ajax({
                type:'get',
                url:'/scheduling/numbers/get_period',
                success:function(json){
                    // console.log('json:',json)
                    if(json.success){
                        var data = json.data;
                        periodArr = data;
                        $.each(periodArr,function (index,item) {
                            if(source){
                                $.each(source,function (i,arr) {
                                    bSelsct = null;
                                    // console.log('arr:',arr)
                                    // console.log('item:',item)
                                    if(item==arr.start){
                                        bSelsct=true;
                                    }
                                })
                            }
                            // html += '<option value='+item+' selected='+bSelsct+'>'+item+'</option>'
                            html += '<option value='+item+' selected='+bSelsct+'>'+item+'</option>'
                        })

                        $('.newPeriod').html(html)
                    }
                }
            })
        }else{
            console.log('444')
            $.each(periodArr,function (index,item) {
                bSelsct = null;
                if(source){
                    $.each(source,function (i,arr) {

                        // console.log('arr.start:',arr.start)
                        // console.log('arr.end:',arr.end)
                        // console.log('item:',item)
                        if(item==arr.start){
                            // console.log('可以选择啊')

                            bSelsct=true;
                            console.log('bSelsct:',bSelsct)
                        }
                    })
                }
                if(bSelsct){
                    html += '<option value='+item+' selected>'+item+'</option>'
                }else{
                    html += '<option value='+item+'>'+item+'</option>'
                }


            })
            $('.newPeriod').html(html)

        }
        console.log("periodArr:",periodArr.length)
        // console.log("html:",html)


    }

    function getLoacalDateAndTime(timestamp) {
        if(timestamp){
            var date = new Date(timestamp);
        }else{
            var date = new Date();
        }
        var year = date.getFullYear();
        var m = parseInt(date.getMonth()) + 1;
        var month = m < 10 ? '0' + m : m;
        var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        var time = year + '-' + month + '-' + d + '&nbsp;' +hours + ':' + minutes + ':' + seconds;
        return time;
    }


    function tab(hd,con){
        var $hdeles = $(hd).children();
        var $coneles = $(con).children();
        if(!$hdeles.hasClass('on')){
            $hdeles.first().addClass('on')
        }
        $coneles.first().show()
        var index = $('.tabBox .hd .on').index();
        var index = $(hd).find('.on').index();
        // console.log("index:",index)
        $coneles.eq(index).show().siblings().hide();
        $hdeles.click(function(){
            index = $(this).index();
            $(this).addClass('on').siblings().removeClass('on');
            $coneles.eq(index).show().siblings().hide()
        })
    }

    module.exports = {
        Popup: Popup,
        MsgShow: MsgShow,
        CheckNull: CheckNull,
        browser: browser,
        SendAjax: SendAjax,
        stringJSON: stringJSON,
        AlertTip: alertTip,
        AddCookie: addCookie,
        GetCookie: getCookie,
        DeleteCookie: deleteCookie,
        GetLoacalTimeString: getLoacalTimeString,
        getLength:getLength,
        getObj:getObj,
        get_period:get_period,
        GetLoacalDateAndTime:getLoacalDateAndTime,
        myAjax:myAjax,
        tab:tab
    }

})