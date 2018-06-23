define(function(require,exports,module) {
    var utils = require('utils');
    var config = require('./config');
    //require('./libs/plupload-2.1.2/js/plupload.full.min.js')
    //require('./upload.js')
    require('./diyUpload.js')
    var move = require('./move')
    new move.Move()

    $(function () {

        $('body').on('click','.addTransmitItems',function(){
            console.log('22222222')
            var $transmitItems = $('.transmitItems');
            var itemHtml = "<p><input class='wid transmit_items' type='text' name='transmit_items' placeholder='样品名称' value=''>" +
                "数量：<input type='text' class='transmit_items_num' name='transmit_items_num' value=''>份</p>";
            var itemHtml = $transmitItems.find('p').html();
            $transmitItems.append('<p class="transmit_items_wrapper">'+itemHtml+'</p>')

        });
        $('#summary').diyUpload({
            "browse_button":"selectfiles_summary",  //文件选择按钮
            "postfiles":'postfiles_summary',   //文件上传按钮
            "previewImageBox":"previewImage_summary",  //图片预览
            "stroageImgBtn":"#summary",                  //图片存储区域 隐藏域
            "businessId":22001  //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
        });
        // $('#detail').diyUpload({
        //     "browse_button":"selectfiles_detail",
        //     "postfiles":'postfiles_detail',
        //     "previewImageBox":"previewImage_detail",
        //     "stroageImgBtn":"#detail",
        //     "businessId":22001
        // });

        // $('#goodsImages').diyUpload({
        //     "browse_button":"selectfiles_goodsImages",
        //     "postfiles":'postfiles_goodsImages',
        //     "previewImageBox":"previewImage_goodsImages",
        //     "stroageImgBtn":"#goodsImages",
        //     "businessId":22001
        // })


        // $('#appCoverImg').diyUpload({
        //     "browse_button":"selectfiles_appCoverImg",
        //     "postfiles":'postfiles_appCoverImg',
        //     "previewImageBox":"previewImage_appCoverImg",
        //     "stroageImgBtn":"#appCoverImg",
        //     "businessId":22001
        // })
        //
        // $('#appDetailImg').diyUpload({
        //     "browse_button":"selectfiles_appDetailImg",
        //     "postfiles":'postfiles_appDetailImg',
        //     "previewImageBox":"previewImage_appDetailImg",
        //     "stroageImgBtn":"#appDetailImg",
        //     "businessId":22001
        // })

        function renderUpload(ele,bReplace) {
            $('#'+ele).diyUpload({
                "bReplace":bReplace||false,
                "multi_selection":!bReplace,
                "browse_button":"selectfiles_"+ele,
                "postfiles":'postfiles_'+ele,
                "previewImageBox":"previewImage_"+ele,
                "stroageImgBtn":"#"+ele,
                "container":document.querySelector('.containerImg'),
                "businessId":22001
            })
        }

        renderUpload('appCoverImages',true);
        renderUpload('appDetailImages');
        renderUpload('pcCoverImages',true);
        renderUpload('pcDetailImages');
        renderUpload('mobileCoverImages',true);
        renderUpload('mobileDetailImages');


        function check(title) {
            new utils.MsgShow({
                title:title
            }).hideMsg();
            return
        }

        // var UE_CONFIG = {
        //     toolbars: [
        //         ['undo', 'redo', 'bold','italic','underline','fontsize','forecolor','backcolor','strikethrough','subscript',
        //             'fontborder','superscript','paragraph','link','unlink','simpleupload','insertimage','lineheight',
        //             'justifyleft','justifyright','justifycenter','insertorderedlist','insertunorderedlist','fullscreen',
        //             'inserttable',
        //             'preview']
        //     ]
        // }
        var UE_CONFIG = {
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    // 'redo', //重做
                    'bold', //加粗
                    // 'indent', //首行缩进
                    // 'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    // 'formatmatch', //格式刷
                    'source', //源代码
                    // 'blockquote', //引用
                    // 'pasteplain', //纯文本粘贴模式
                    // 'selectall', //全选
                    // 'print', //打印
                    'preview', //预览
                    // 'horizontal', //分隔线
                    // 'removeformat', //清除格式
                    // 'time', //时间
                    // 'date', //日期
                    // 'unlink', //取消链接
                    // 'insertrow', //前插入行
                    // 'insertcol', //前插入列
                    // 'mergeright', //右合并单元格
                    // 'mergedown', //下合并单元格
                    // 'deleterow', //删除行
                    // 'deletecol', //删除列
                    // 'splittorows', //拆分成行
                    // 'splittocols', //拆分成列
                    // 'splittocells', //完全拆分单元格
                    // 'deletecaption', //删除表格标题
                    // 'inserttitle', //插入标题
                    // 'mergecells', //合并多个单元格
                    // 'deletetable', //删除表格
                    // 'cleardoc', //清空文档
                    // 'insertparagraphbeforetable', //"表格前插入行"
                    // 'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    'insertimage', //多图上传
                    // 'edittable', //表格属性
                    // 'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    // 'searchreplace', //查询替换
                    'map', //Baidu地图
                    // 'gmap', //Google地图
                    // 'insertvideo', //视频
                    // 'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    // 'directionalityltr', //从左向右输入
                    // 'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    // 'pagebreak', //分页
                    // 'insertframe', //插入Iframe
                    // 'imagenone', //默认
                    // 'imageleft', //左浮动
                    // 'imageright', //右浮动
                    'attachment', //附件
                    // 'imagecenter', //居中
                    // 'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    // 'autotypeset', //自动排版
                    // 'webapp', //百度应用
                    // 'touppercase', //字母大写
                    // 'tolowercase', //字母小写
                    // 'background', //背景
                    // 'template', //模板
                    // 'scrawl', //涂鸦
                    // 'music', //音乐
                    'inserttable', //插入表格
                    // 'drafts', // 从草稿箱加载
                    // 'charts', // 图表
                ]
            ]
        }
        //套餐简介编辑
        var detail_UE = UE.getEditor('detail_editor', UE_CONFIG);
        var detail = $(".detail").val();
        // console.log("detail:",detail)
        detail_UE.ready(function() {
            $(this.container).click(function(e){
                e.stopPropagation()
            });
            detail_UE.setContent(detail);
        });
        var summary_UE = UE.getEditor('summary_editor', UE_CONFIG);
        var summary = $(".summary").val();
        summary_UE.ready(function() {
            $(this.container).click(function(e){
                e.stopPropagation()
            });
            summary_UE.setContent(summary);
        });
        var commonQa_UE = UE.getEditor('commonQa_editor', UE_CONFIG);
        var commonQa = $(".commonQa").val();
        commonQa_UE.ready(function() {
            $(this.container).click(function(e){
                e.stopPropagation()
            });
            commonQa_UE.setContent(commonQa);
        });

        function get_detail_article_one(obj) {


            $.ajax({
                type:'get',
                async:false,
                data:{id:obj.id},
                url:'/screening/meal/get_detail_article',
                beforeSend:function () {
                    console.log("正在获取套餐详情")
                },
                success:function(json){
                    // console.log("json:",json)
                    var json = JSON.parse(json)
                    obj.callback&&obj.callback(json);

                }
            })

        }
        var $tabSpans = $('.tab .hd span');
        //选项卡
        $('.bd>ul').first().show();
        $('body').on('click','.tab .hd span',function () {
            // console.log("span:",$(this).text());
            var index = $(this).index();
            var content = '';
            console.log("index:",index);

            // $('.bd ul:eq('+index+')').find('li').addClass('on').parents('ul').show().siblings('ul').hide().find('li').removeClass('on');
            $('.bd>ul:eq('+index+')').addClass('on').show().siblings('ul').hide().removeClass('on');
            var $target = $('.bd>ul.on');
            var $inputIds = $conTabUl.eq(index).find('.article_id');  //存储id

            var ids = [];
            var number = 0;
            var numbers = [];
            var max_number = '';
            //处理内容
            if(index>0){
                // var detail = $conTabUl.eq(index).find('li input').val();
                var $detailInputs = $conTabUl.eq(index).find('li input'); //存储内容
                // ue_reset($target)

                console.log($inputIds);
                if($tabSpans.eq(index).hasClass('geted')){
                    console.log("已经获取过数据了")
                    ue_reset($target);
                    return;
                }
                $.each($inputIds,function (i,item) {
                    // ue_reset($target)
                    id = $(item).val();
                    if(id){
                        ids.push(id)
                    }
                    console.log("id:",id);

                    if(id){
                        get_detail_article_one({
                            id:id,
                            callback:function (json) {
                                content =json.data.content;
                                number++;
                                // numbers.push(number);
                                // console.log("content:::",content)

                                if(json.success){
                                    content = json.data.content
                                }else{
                                    content = '内容获取失败：'+json.msg
                                }
                                // $conTabUl.eq(index).find('.detail').val(content);
                                // console.log("content:",content)
                                // console.log("number:",number)
                                // console.log("num22ber:",numbers)

                                $conTabUl.eq(index).find('li input').eq(i).val(content);
                                // max_number = numbers.max();
                                $tabSpans.eq(index).addClass('geted');
                                // console.log("$target:",$target)
                                // console.log("max_number:",max_number)
                                if(i==2){  //执行三次请求后才能重置UE
                                    ue_reset($target)
                                }

                            }
                        })

                        // console.log("newIds:",newIds)
                        console.log("number:",number)

                    }

                })
                if(!ids.length){
                    console.log("3333333:",ids);
                    ue_reset($target)
                }

            }else{
                //详细信息app
                ue_reset($target)
            }





            // var $target = $(this);
            // var $target = $('.bd ul:eq('+index+')');


            // var content = $target.html();
            // var detail_content = $target.find('.detail_app.on input,.detail_pc.on input,.detail_wap.on input').val();
            // var summary_content = $target.find('.summary_app.on input,.summary_pc.on input,.summary_wap.on input').val();
            // var commonQa_content = $target.find('.commonQa_app.on input,.commonQa_pc.on input,.commonQa_wap.on input').val();




        })

        function ue_reset($target) {
            console.log("$target:",$target.index())
            var detail_content = $target.find('.detail_app input,.detail_pc input,.detail_wap input').val();
            var summary_content = $target.find('.summary_app input,.summary_pc input,.summary_wap input').val();
            var commonQa_content = $target.find('.commonQa_app input,.commonQa_pc input,.commonQa_wap input').val();


            var detail_currentParnet = detail_UE.container.parentNode.parentNode;
            var summary_currentParnet = summary_UE.container.parentNode.parentNode;
            var commonQa_currentParnet = commonQa_UE.container.parentNode.parentNode;

            console.log("detail_currentContent:",detail_UE.getContent())
            console.log("summary_currentContent:",summary_UE.getContent())
            console.log("commonQa_currentContent:",commonQa_UE.getContent())


            var detail_currentContent = detail_UE.getContent();
            var summary_currentContent = summary_UE.getContent();
            var commonQa_currentContent = commonQa_UE.getContent();

            // console.log("detail_currentContent:",detail_currentContent)



            $target.find('.ueditorDivWapper').html('');
            $target.find('.detail_app,.detail_pc,.detail_wap').find('.ueditorDivWapper').append(detail_UE.container.parentNode);
            // $target.find('.summary_pc .ueditorDiv').append('检查须知等等等等');
            $target.find('.summary_app ,.summary_pc ,.summary_wap ').find('.ueditorDivWapper').append(summary_UE.container.parentNode);
            $target.find('.commonQa_app ,.commonQa_pc ,.commonQa_wap ').find('.ueditorDivWapper').append(commonQa_UE.container.parentNode);




            detail_UE.reset();
            summary_UE.reset();
            commonQa_UE.reset();

            setTimeout(function(){
                detail_UE.setContent(detail_content);
                summary_UE.setContent(summary_content);
                commonQa_UE.setContent(commonQa_content);
            },200);

            // $target.find('.detail_app input,.detail_pc input,.detail_wap input').val(detail_currentContent)
            // $target.find('.detail_app input,.detail_pc input,.detail_wap input').val(detail_currentContent)
            // $target.find('.summary_app ,.summary_pc ,.summary_wap ').find('input').val(detail_currentContent)
            // $target.find('.commonQa_app ,.commonQa_pc ,.commonQa_wap ').find('input').val(detail_currentContent)

            // console.log("detail_currentContent:",detail_currentContent)
            // console.log("summary_currentContent:",summary_currentContent)
            // console.log("commonQa_currentContent:",commonQa_currentContent)
            $(detail_currentParnet).prev('input').val(detail_currentContent);
            $(summary_currentParnet).prev('input').val(summary_currentContent);
            $(commonQa_currentParnet).prev('input').val(commonQa_currentContent);
        }

        function getIndex() {
            var index = $('.tab .hd span.on').index();
            console.log("index：：：:",index)
            return index;
        }
        getIndex();

        var $conTabUl = $('.formBox .tab ul.detailBox');
        // var $conTabUl = $('.formBox .tab').children('ul');
        var $buttons = $('.fixed_bottom button')

        function detail_article(obj) {

            obj.requestData.title = $('.goodsName').val()+'_'+obj.type;

            // console.log("requestData:",obj.requestData)
            // console.log("requestData。ID:",obj.requestData.id)
            var articleId =obj.requestData.id
            var url = '/screening/meal/update_detail_article';
            if(!obj.requestData.id){
                url = '/screening/meal/add_detail_article';
                delete obj.requestData.id
            }

            $.ajax({
                type:'POST',
                data:obj.requestData,
                url:url,
                beforeSend:function () {
                    new utils.MsgShow({
                        delayTime:2000,
                        title:obj.beTitle||'正在提交信息……'
                    }).hideMsg()
                },
                success:function(json){
                    // console.log(json);
                    var json = JSON.parse(json);
                    if(json.success){
                        var id = json.data.id;
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:obj.title
                        }).hideMsg(function () {
                            // window.location=location
                        });
                        // $buttons.eq(obj.indexSpan+1).css({'background':'#00955E'})
                        // console.log("$buttons.index():",$buttons.index())
                        $buttons.eq(obj.index).css({'background':'#00955E'})
                        // console.log("obj.requestData.id:",obj.requestData.id)
                        // console.log("articleId:",articleId)
                        //$conTabUl.eq(obj.indexSpan).find('.article_id').eq(obj.indexSpan).val(id)

                        if(!articleId){
                            // console.log("nage:",$conTabUl.eq(obj.indexSpan).find('.article_id').eq(obj.indexIput))
                            $conTabUl.eq(obj.indexSpan).find('.article_id').eq(obj.indexIput).val(id)
                        }

                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:json.msg
                        }).hideMsg()
                    }

                }
            })
        }



        function details(obj) {
            var index = getIndex();
            var requestData = {};
            var datas = [];
            var ids = [];
            var details = [];
            var $inputs = $conTabUl.eq(obj.index).find('li input');
            // var $ids = $('.appArticle_id');
            var $ids = $('.'+obj.ids);
            // console.log("$conTabUl:",$conTabUl)
            // console.log("$inputs:",$inputs)

            // console.log("index==obj.index:",index,obj.index)

            if(index==obj.index){
                detail = UE.getEditor('detail_editor').getContent();
                summary = UE.getEditor('summary_editor').getContent();
                commonQa = UE.getEditor('commonQa_editor').getContent();
                details.push(detail);
                details.push(summary);
                details.push(commonQa);

                // requestData.content = detail;
            }


            // console.log("$ids:",$ids)

            $.each($ids,function (index,item) {
                ids.push($(item).val());

            })
            // console.log("ids:",ids);
            // console.log("details:",details);

            $.each($inputs,function (i,item) {
                // console.log('item:',item)
                var content = $(item).val();
                if(index==obj.index){
                    // requestData.content = detail;
                    requestData.content = details[i];
                }else{
                    requestData.content =content;
                }

                requestData.id =ids[i];
                detail_article({
                    requestData:requestData,
                    beTitle:'正在保存详细信息（'+obj.type+'）……',
                    title:'保存详细信息（'+obj.type+'）成功',
                    type:obj.type,
                    requestData:requestData,
                    indexIput:i,
                    indexSpan:index,
                    index:obj.index+1

                })
            })
        }

        //保存app详情

        $('body').on('click','.appBtn',function () {
            console.log("保存app详情");

            details({
                ids:'appArticle_id',
                type:'APP',
                index:0
            })

        });

        //保存pc详情
        $('body').on('click','.pcBtn',function () {
            console.log("保存pc详情");
            details({
                ids:'pcArticle_id',
                type:'PC',
                index:1
            })

        });

        Array.prototype.max = function(){   //最大值
            return Math.max.apply({},this)
        }

        //保存mobile详情
        $('body').on('click','.wapBtn',function () {
            console.log("保存mobile详情");
            details({
                ids:'mobileArticle_id',
                type:'WAP',
                index:2
            })

        })



        $('body').on('click','.submitBtn',function () {
            var serialize = $('.formBox').serialize();
            var serializeObj = {};
            var key= '';
            $.each($('.formBox').find('input,textarea,select'),function (index,item) {
                key =$(item).attr('name');
                serializeObj[key] = $(item).val()
            })
            if(!serializeObj.goodsName){
                new utils.MsgShow({
                    title:"请输入套餐名称！"
                }).hideMsg();
                return
            }else{
                if (utils.getLength(serializeObj.goodsName)>20){
                    new utils.MsgShow({
                        title:"套餐名称需为20字符长度以内！"
                    }).hideMsg();
                    return
                }
            }
            if(!serializeObj.price){
                new utils.MsgShow({
                    title:"请输入市场价！"
                }).hideMsg();
                return
            }else{
                if (parseFloat(serializeObj.price)<=0){
                    new utils.MsgShow({
                        title:"套餐市场价必须大于0！"
                    }).hideMsg();
                    return
                }
                if (serializeObj.price.toString().split(".")[1]&&serializeObj.price.toString().split(".")[1].length>2){
                    new utils.MsgShow({
                        title:"套餐市场价最多可输入两位小数！"
                    }).hideMsg();
                    return
                }
            }
            if(!serializeObj.discountPrice){
                new utils.MsgShow({
                    title:"请输入优惠价！"
                }).hideMsg();
                return
            }else{
                if (parseFloat(serializeObj.discountPrice)<=0){
                    new utils.MsgShow({
                        title:"套餐优惠价必须大于0！"
                    }).hideMsg();
                    // return
                }else if(parseFloat(serializeObj.discountPrice)>parseFloat(serializeObj.price)){
                    new utils.MsgShow({
                        title:"套餐优惠价不得大于市场价"
                    }).hideMsg();
                    // return
                }
                if (serializeObj.discountPrice.toString().split(".")[1]&&serializeObj.discountPrice.toString().split(".")[1].length>2){
                    new utils.MsgShow({
                        title:"套餐优惠价最多可输入两位小数！"
                    }).hideMsg();
                    // return
                }
            }

            if(!serializeObj.slogan){
                new utils.MsgShow({
                    title:"请输入广告语！"
                }).hideMsg();
                return
            }
            if(!serializeObj.keyword){
                new utils.MsgShow({
                    title:"请输入关键字！"
                }).hideMsg();
                return
            }
            if(!serializeObj.page_description){
                new utils.MsgShow({
                    title:"请输入网页描述！"
                }).hideMsg();
                return
            }
            if(!serializeObj.fit_people){
                new utils.MsgShow({
                    title:"请输入检查目的！"
                }).hideMsg();
                return
            }
            if(!$('.sampling_home').is(':checked')&&!$('.sampling_delivery').is(':checked')&&!$('.sampling_clinic').is(':checked')){
                new utils.MsgShow({
                    title:"请选择一种取样方式！"
                }).hideMsg();
                return
            }
            if($('.sampling_home').is(':checked')){
                if(!serializeObj.sampling_home_cost){
                    console.log("serializeObj.sampling_home:",$('.sampling_home:checked'))
                    new utils.MsgShow({
                        title:"请输入上门取样服务费！"
                    }).hideMsg();
                    // return
                }else{
                    if(parseFloat(serializeObj.sampling_home_cost)%1!==0||parseFloat(serializeObj.sampling_home_cost)<0){
                        new utils.MsgShow({
                            title:"上门取样服务费必须大于零的整数"
                        }).hideMsg();
                        // return
                    }
                }

            }

            if(serializeObj.sampling_home_cost){
                if(!$('.sampling_home').is(':checked')){
                    new utils.MsgShow({
                        title:"请选择上门取样方式"
                    }).hideMsg();
                    return
                }
            }
            if($('.sampling_delivery').is(':checked')){
                if(!serializeObj.sampling_delivery_cost){
                    new utils.MsgShow({
                        title:"请输入快递取样服务费！"
                    }).hideMsg();
                    return
                }else{
                    if(parseFloat(serializeObj.sampling_delivery_cost)%1!==0||parseFloat(serializeObj.sampling_delivery_cost)<0){
                        new utils.MsgShow({
                            title:"快递取样服务费必须大于零的整数"
                        }).hideMsg();
                        // return
                    }
                }

            }
            if(serializeObj.sampling_delivery_cost){
                if(!$('.sampling_delivery').is(':checked')){
                    new utils.MsgShow({
                        title:"请选择快递取样方式"
                    }).hideMsg();
                    return
                }
            }
            if($('.sampling_clinic').is(':checked')){
                if(!serializeObj.sampling_clinic_cost){
                    new utils.MsgShow({
                        title:"请输入门诊取样服务费！"
                    }).hideMsg();
                    return
                } else{
                    if(parseFloat(serializeObj.sampling_clinic_cost)%1!==0||parseFloat(serializeObj.sampling_clinic_cost)<0){
                        new utils.MsgShow({
                            title:"门诊取样服务费必须大于零的整数"
                        }).hideMsg()
                        // return
                    }
                }

            }
            if(serializeObj.sampling_clinic_cost){
                if(!$('.sampling_clinic').is(':checked')){
                    new utils.MsgShow({
                        title:"请选择门诊取样"
                    }).hideMsg();
                    return
                }
            }
            var $transmit_items = $('.transmit_items_wrapper .transmit_items');
            var transmit_items = [];
            $.each($transmit_items,function (i,item) {
                if($(item).val()){
                    transmit_items.push($(item).val())
                }

            });
            serializeObj.transmit_items = transmit_items;

            var $transmit_items_num = $('.transmit_items_wrapper .transmit_items_num');
            var transmit_items_num = [];
            $.each($transmit_items_num,function (i,item) {

                console.log("$(item).val():",$(item).val())
                if(!$(item).val()||parseFloat($(item).val())<=0||parseFloat($(item).val())%1!=0){
                    transmit_items_num = [];
                    new utils.MsgShow({
                        title:"取样项目份数必须大于零的整数"
                    }).hideMsg();
                    // return false;
                }else{
                    transmit_items_num.push($(item).val())
                }
            });

            serializeObj.transmit_items_num = transmit_items_num;
            if(!serializeObj.transmit_items_num.length){
                new utils.MsgShow({
                    title:"取样项目分数必须大于零的整数!"
                }).hideMsg();
                return
            }

            if(!serializeObj.appCoverImages||!JSON.parse(serializeObj.appCoverImages).length){
                new utils.MsgShow({
                    title:"请上传APP套餐封面图片！"
                }).hideMsg();
                return
            }
            if(!serializeObj.appDetailImages||!JSON.parse(serializeObj.appDetailImages).length){
                new utils.MsgShow({
                    title:"请上传APP套餐详情图片！"
                }).hideMsg();
                return
            }
            if(!serializeObj.pcCoverImages||!JSON.parse(serializeObj.pcCoverImages).length){
                console.log("请上传PC套餐封面图片")
                new utils.MsgShow({
                    title:"请上传PC套餐封面图片！"
                }).hideMsg();
                return
            }
            if(!serializeObj.pcDetailImages||!JSON.parse(serializeObj.pcDetailImages).length){
                new utils.MsgShow({
                    title:"请上传PC套餐详情图片！"
                }).hideMsg();
                return
            }
            if(!serializeObj.mobileCoverImages||!JSON.parse(serializeObj.mobileCoverImages).length){
                new utils.MsgShow({
                    title:"请上传wap套餐封面图片！"
                }).hideMsg();
                return
            }
            if(!serializeObj.mobileDetailImages||!JSON.parse(serializeObj.mobileDetailImages).length){
                new utils.MsgShow({
                    title:"请上传wap套餐详情图片！"
                }).hideMsg();
                return
            }

            var $categoryId = $('.categoryId:checked');
            var categoryId = [];
            $.each($categoryId,function (i,item) {
                categoryId.push($(item).val())
            });
            serializeObj.categoryId = categoryId;
            if(!serializeObj.categoryId.length){
                new utils.MsgShow({
                    title:"请输入所属栏目"
                }).hideMsg();
                return
            }
            if(!serializeObj.saleAttributes){
                new utils.MsgShow({
                    title:"请获取服务门诊"
                }).hideMsg();
                return
            }
            // var $fit_area = $('.fit_area:checked');
            // var fit_area = [];
            // $.each($fit_area,function (i,item) {
            //     fit_area.push($(item).val())
            // });
            // serializeObj.fit_area = fit_area;
            // if(!serializeObj.fit_area.length){
            //     new utils.MsgShow({
            //         title:"请输入服务地区"
            //     }).hideMsg();
            //     return
            // }

            serializeObj.detail = $('.detail').first().val();
            serializeObj.summary = $('.summary').first().val();
            serializeObj.commonQa = $('.commonQa').first().val();

            var $fit_area_id = $('.fit_area_id');
            var fit_area_id = [];
            $.each($fit_area_id,function (i,item) {
                fit_area_id.push($(item).val())
            });
            serializeObj.fit_area_id = fit_area_id;

            detail = UE.getEditor('detail_editor').getContent();
            serializeObj.detail = detail;
            summary = UE.getEditor('summary_editor').getContent();
            serializeObj.summary = summary;
            commonQa = UE.getEditor('commonQa_editor').getContent();
            serializeObj.commonQa = commonQa;
            var url = '/screening/meal/add/new';
            var msg='新增'
            if(serializeObj.id){
                url='/screening/meal/updates/new';
                msg='修改'
            }
            var location='/screening/meal/list/1';
            switch (serializeObj.goodsState){
                case '1':
                    location='/screening/meal/list/1';
                    break;
                case '2':
                    location='/screening/meal/list/2';
                    break;
                case '3':
                    location='/screening/meal/list/3';
                    break;
                case '4':
                    location='/screening/meal/list/4';
                    break;
                default :
                    location='/screening/meal/list/1';
            }
            $.ajax({
                type:'POST',
                data:serializeObj,
                url:url,
                beforeSend:function () {
                    new utils.MsgShow({
                        delayTime:2000,
                        title:'正在'+msg+'套餐……'
                    }).hideMsg()
                },
                success:function(json){
                    var json = JSON.parse(json);
                    if(json.success){
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:msg+'套餐成功'
                        }).hideMsg(function () {
                            window.location=location
                        })

                    }else{
                        var myMsg = new utils.MsgShow({
                            delayTime:2000,
                            title:json.msg
                        }).hideMsg()
                    }

                }
            })

        })

        function fixed_bottom() {
            var $fixed_bottom = $('.fixed_bottom');
            var winW = $(window).width();
            var mainW = $('.main').width();
            var containerW = $('.container').width();
            var leftNavW = $('.leftMenu nav').width()+10;
            var fixed_bottom_w = winW-containerW;
            if(winW<758){
                leftNavW=0;
                fixed_bottom_w=0;
                mainW=winW;
            }
            // console.log("fixed_bottom_w:",fixed_bottom_w)
            // console.log("leftNavW:",leftNavW)
            // console.log("winW:",winW)
            $fixed_bottom.css({'width':mainW,'left':fixed_bottom_w/2+leftNavW})
        }
        fixed_bottom();
        $(window).resize(function () {
            fixed_bottom()
        })



    })







});
