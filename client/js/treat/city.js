define(function(require,exports,module) {
    var utils = require('../utils');

    $(function(){

        var $body = $('body');
        var $region = $('.region')
        var $area = $('.area');
        $body.on('mouseleave','.area',function () {
            $(this).hide();
        })
        $('.provinces > li > em').click(function () {
            var $self = $(this)
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            $self.next().show().parent().siblings().find('.citys').hide();
            var id = $self.attr('data-id');
            $('.province').val(id)
        })
        $('.citys > ul > li > em').click(function () {
            var $self = $(this)
            console.log($self.text())
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            $self.next().show().parent().siblings().find('.districts').hide();
            var id = $self.attr('data-id');
            $('.city').val(id)
        })

        $('.districts li em').click(function () {
            var $self = $(this);
            $self.addClass('on').parent().siblings().find('em').removeClass('on');
            var $emOn  = $('.provinces').find('em.on');
            var cityHtml = '';
            var id = $self.attr('data-id');
            $('.district').val(id);
            $.each($emOn,function (index,item) {
                cityHtml+=$(item).text()
            })
            $region.val(cityHtml)
            $('.area').hide();
        })
        $body.on('click','.region',function () {
            $('.area').show()
        })


    })



});
