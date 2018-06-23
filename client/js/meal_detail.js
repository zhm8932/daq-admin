define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    require('swipebox');

    $( '.swipebox' ).swipebox();

    var winWidth = $('.detail-other').width();
    console.log(winWidth)
    var imgs = $('.detail-other .con').find('img');
    $.each(imgs,function(index,arr) {
        var imgWidth = $(arr).width()
        var img = $(this);
        var realWidth;//真实的宽度
        var realHeight;//真实的高度
//这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
        $("<img/>").attr("src", $(img).attr("src")).load(function () {
            realWidth = this.width;
            realHeight = this.height;
//如果真实的宽度大于浏览器的宽度就按照100%显示
            if (realWidth >= winWidth) {
                $(img).css("width", "100%").css("height", "auto");
            }
            else {//如果小于浏览器的宽度按照原尺寸显示
                $(img).css("width", realWidth + 'px').css("height", realHeight + 'px');
            }


        })
    })



    //获取单个详细
    function get_detail_article_one(obj) {
        $.ajax({
            type:'get',
            // async:false,
            data:{id:obj.id},
            url:'/screening/meal/get_detail_article',
            beforeSend:function () {
                console.log("正在获取套餐详情")
                obj.$conDiv.eq(obj.i).html("正在获取套餐详情……")
            },
            success:function(json){
                var json = JSON.parse(json)
                obj.callback&&obj.callback(json);

            }
        })

    }
    
    function getConDiv(indexParent) {
        var $conDiv = $detail_other.eq(indexParent).find('.con').children();
        return $conDiv
    }
    var $detail_other = $('.detail-other');
    var indexParent = 0;

    $('body').on('click','.tab > .hd span',function () {
            console.log($(this).text());
        var $self = $(this);
        indexParent = $self.index();
        $detail_other.eq(indexParent).show().siblings('.detail-other').hide()
        var $conDiv = getConDiv(indexParent);
        $conDiv.hide()
        $conDiv.first().show()

        var $detailSpan = $detail_other.eq(indexParent).find('.hd span');
        $detailSpan.removeClass('on');
        $detailSpan.first().addClass('on');

        var $inputIds = $detail_other.eq(indexParent).find('aside input');
        // console.log("$inputIds:",$inputIds)
        if($self.hasClass('geted')){
            // console.log("已经获取过了")
            return
        }
        $.each($inputIds,function (i,item) {
            console.log('item:',$(item).val())
            var id = $(item).val();
            if(!id){
                $conDiv.eq(i).html('暂无内容……')
                return;

            }
            get_detail_article_one({
                id:id,
                i:i,
                $conDiv:$conDiv,
                callback:function (json) {
                    // console.log("json:",json)
                    if(json.success){
                        var content = json.data.content;
                        // console.log("content:",content)
                        $conDiv.eq(i).html(content)
                        // console.log("$conDiv:",$conDiv.html())
                        $self.addClass('geted')
                    }
                }
            })

        })


    })

    var $detailSpan = $detail_other.find('.hd span');
    $detail_other.first().show();
    var $conDiv = getConDiv(indexParent);
    $detailSpan.first().addClass('on');
    $conDiv.first().show();

    // $detail_other.first().find('.con').children().first().show();
    $detailSpan.click(function(){
        var index = $(this).index();
        var $conDiv = getConDiv(indexParent);
        console.log("index:",index)
        $(this).addClass('on').siblings().removeClass('on');
        $conDiv.eq(index).show().siblings().hide()
    })



    var $imgBd = $('.imgBd');
    var $imgHd = $('.imgHd');

    $.each($imgHd,function (index,item) {
        $(item).find('span').first().addClass('on')
    })
    // $($imgBd).find('ul li').first().show();
    $.each($imgBd,function (index,item) {
        console.log("$imgBd:",item)
        $(item).find('ul li').first().show();
    })

    $('span',$imgHd).mouseover(function(){
        $(this).addClass('on').siblings().removeClass('on')
        var index = $(this).index();
        $imgBd = $(this).parent().siblings('.imgBd')
        // console.log("$imgBd:",$imgBd)
        $imgBd.find('ul li').eq(index).show().siblings().hide();
    })






});
