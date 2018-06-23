define(function(require,exports,module) {
    var utils = require('../utils');
    var check = '.tbody ul .check';
    var $body = $('body');
    var $tbody = $('.tbody');
    var checkInput = '.tbody ul .check input';
    var li = '.tbody ul li';
    $(function () {
        $body.on('click','.tbody ul li .icon',function (e) {
            e.stopPropagation();
            var $self = $(this);
            // console.log("nama:",$(this).text());
            $self.parent().toggleClass('tree_open');
            $self.parent().next('ol').slideToggle();
        });
        //全选
        $body.on('click','.allCheck',function () {
            $tbody = $('.tbody');
            var $self = $(this);
            var $allCheck = $(this).find('input');
            var $checkInput = $(checkInput);
            if($allCheck.is(':checked')){
                $allCheck.closest('.resource').find('input[type=checkbox]').prop('checked',true);
                $allCheck.closest('.resource').find('ul li').addClass('success')
            }else{
                $allCheck.closest('.resource').find('input[type=checkbox]').prop('checked',false);
                $allCheck.closest('.resource').find('ul li').removeClass('success')
            }
        });
        //单选
        $body.on('click',li,function () {
            var $self = $(this);
            var $input = $self.find('input');
            $self.toggleClass('success');
            // console.log("nama:",$(this).text());
            if($input.is(':checked')){
                $input.prop('checked',false)
            }else{
                $input.prop('checked',true)
            }

        })
        $body.on('click',checkInput,function (e) {
            var $self = $(this);
            var $input = $self;
            // console.log("nama:",$(this).text());
            if($input.is(':checked')){
                $input.prop('checked',false)
            }else{
                $input.prop('checked',true)
            }

        })


    })
    function checkOne() {
        var checkLen = $(check).find('input:checked').length;
        return checkLen;
    }


    module.exports = {
        checkOne:checkOne,
        $tbody:$tbody
    }

});

