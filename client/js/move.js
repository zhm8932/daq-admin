define(['jquery'],function(require,exports,module){
    function Move(options){
        var defaults = {
            leftCell:'left',
            rightCell:'right',
            leftHtml:'<span class="left"></span>',
            rightHtml:'<span class="right"></span>'
        }
        this.$body = $('body')
        this.opts = $.extend({},defaults,options)
        this.init()
    }
    Move.prototype = {
        init:function(){
            var $body = this.$body;
            var _self = this;
            $body.on('click','.'+_self.opts.leftCell,function(){
                var $self = $(this)
                console.log($self);
                _self.arrLeft($self);
                _self.domLeft($self);

            })
            $body.on('click','.'+_self.opts.rightCell,function(){
                var $self = $(this)
                console.log($self);
                _self.arrRight($self);
                _self.domRight($self);

            })

            $body.on('click','.diyCancel',function(){
                var $self = $(this)
                _self.spliceArr($self)
            })
        },
        renderLeft:function(){
            var leftHtml='<span class="'+this.opts.leftCell+'"></span>';
            return leftHtml
        },
        renderRight:function(){
            var rightHtml='<span class="'+this.opts.rightCell+'"></span>';
            return rightHtml
        },
        swapArrItem:function(arr, index1, index2){
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        getImgId:function($self){
            //var imgId = $self.parent().attr('id')

            // var imgId = $self.index();
            var imgId = $self.parent().index();
            // console.log(imgId)
            // console.log($self)
            return imgId;

        },
        getIndex:function($self){
            var index = $self.parent().index();
            return index;
        },
        getLiLen:function($self){
            var liLen = $self.parent().parent().children().length;
            return liLen;
        },
        getDomStorage:function($self){
            var $prevStorage = $self.parents('.parentFileBox').prev('.imgUploadBox').find('input');
            return $prevStorage;
        },
        getArr:function($self){
            var $prevStorage = $self.parents('.parentFileBox').prev('.imgUploadBox').find('input');
            var imgArr = JSON.parse($prevStorage.val());
            return imgArr
        },
        spliceArr:function($self){  //删除数组
            var basic = this.getBasic($self);
            var imgId = this.getImgId($self);
            var $prevStorage = basic.$prevStorage;
            var imgArr = basic.imgArr;
            var liLen = basic.liLen;
            var index = basic.index;
            var $parent = $self.parent()
            console.log(imgArr)
            for(var i in imgArr){
                //if(imgArr[i].imageId==imgId){
                console.log("i:",i)
                console.log("imgId:",imgId)
                if(i==imgId){
                    imgArr.splice(i,1);
                }
            }
            console.log('imgArr:',imgArr);
            $prevStorage.attr('value',JSON.stringify(imgArr));

            if(liLen==2){
                console.log('222222222')
                console.log($parent.next())
                $parent.siblings('li').find('span').remove();
            }else if(liLen>2){
                if(index==0){
                    $parent.next().find('.left').remove()
                }else if(index==liLen-1){
                    $parent.prev().find('.right').remove()
                }
            }
            $self.parent().remove()
        },
        arrLeft:function($self){
            var basic = this.getBasic($self)
            var index = basic.index;
            var $prevStorage = basic.$prevStorage
            var imgArr = basic.imgArr;
            this.swapArrItem(imgArr,index,index-1)
            //console.log('imgArr:',imgArr)
            $prevStorage.attr('value',JSON.stringify(imgArr))

        },
        arrRight:function($self){
            var basic = this.getBasic($self)
            var index = basic.index;
            var $prevStorage = basic.$prevStorage
            var imgArr = basic.imgArr;

            this.swapArrItem(imgArr,index,index+1)
            //console.log('imgArr:',imgArr)
            $prevStorage.attr('value',JSON.stringify(imgArr))
        },
        getBasic:function($self){  //获取基本信息
            var index = this.getIndex($self);
            var liLen = this.getLiLen($self);
            var $prevStorage = this.getDomStorage($self)
            var imgArr = this.getArr($self)
            return {
                index:index,
                liLen:liLen,
                imgArr:imgArr,
                $prevStorage:$prevStorage
            }
        },
        domLeft:function($self){
            var leftHtml = this.renderLeft();
            var rightHtml = this.renderRight();
            var basic = this.getBasic($self)

            var $parent = $self.parent()
            var index = basic.index;
            var liLen = basic.liLen;

            //console.log('index:',index)
            console.log('basic:',basic)
            if(index==1){
                $parent.find('.left').remove()
                $parent.prev().append(leftHtml)
            }
            if(index==liLen-1){
                console.log('123456')
                $parent.prev().find('.right').remove()
                $parent.append(rightHtml)
            }
            var selfHtml = $parent.clone()
            $parent.prev().before(selfHtml)
            $parent.remove()
        },
        domRight:function($self){
            var leftHtml = this.renderLeft();
            var rightHtml = this.renderRight();
            var basic = this.getBasic($self)

            var $parent = $self.parent()
            var index = basic.index;
            var liLen = basic.liLen;

            //console.log('index:',index)
            if(index==0){
                $parent.append(leftHtml)
                $parent.next().find('.left').remove()
            }
            if(index==liLen-2){
                $parent.find('.right').remove()
                $parent.next().append(rightHtml)
            }
            var selfHtml = $parent.clone()
            $parent.next().after(selfHtml)
            $parent.remove()

            //console.log(selfHtml)
        }

    }

    module.exports={
        Move:Move  //移动图片，改变数组元素位置
    }

})


//(function(){
//
//
//    utils = {
//        Popup:Popup,
//        MsgShow:MsgShow
//    }
//})()