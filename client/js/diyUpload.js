define(function(require,exports,module){
    require('./libs/plupload-2.1.2/js/plupload.full.min.js')
    //require('./libs/plupload-2.1.2/js/plupload.dev')

    Array.prototype.unique = function()
    {
        var n = [this[0]]; //结果数组
        for(var i = 1; i < this.length; i++) //从第二项开始遍历
        {
            //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
            //那么表示第i项是重复的，忽略掉。否则存入结果数组
            if (this.indexOf(this[i]) == i) n.push(this[i]);
        }
        return n;
    }

    var utils = require('utils');
    $.fn.extend({
        diyUpload:function(opts){
            // console.log('999999999')

            accessid = '';
            accesskey = '';
            host = '';
            policyBase64 = '';
            signature = '';
            callbackbody = '';
            filename = '';
            key = '';
            appId = '';
            bucketId = '';
            directoryId = '';
            title = '';
            fileType = '';
            expire = 0;
            now = timestamp = Date.parse(new Date()) / 1000;

            //function send_request()
            //{
            //    var xmlhttp = null;
            //    if (window.XMLHttpRequest)
            //    {
            //        xmlhttp=new XMLHttpRequest();
            //    }
            //    else if (window.ActiveXObject)
            //    {
            //        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            //    }
            //
            //    if (xmlhttp!=null)
            //    {
            //
            //        //phpUrl = 'http://18680345944.oicp.net/token/web?appId=a1ffe72997d0488f80c5a3cbdc8b3137&fileType=1&businessId=1&fileName=1.jpg'
            //        //phpUrl = 'http://120.76.76.191:8181/token/web?appId=a1ffe72997d0488f80c5a3cbdc8b3137&fileType=1&businessId=1&fileName=1.jpg'
            //        //phpUrl = 'http://120.76.24.129:8080/router?bizParam='+JSON.stringify(bizParam)+'&sysParam='+JSON.stringify(sysParam)
            //        phpUrl = '/upload'
            //        console.log("phpUrl:",phpUrl)
            //        xmlhttp.open( "POST", phpUrl, false );
            //        //xmlhttp.send( null );
            //        var data = {'name':'222222222222222'}
            //        xmlhttp.send(JSON.stringify(data));
            //        console.log("xmlhttp.responseText:::",xmlhttp.responseText)
            //        return xmlhttp.responseText
            //    }
            //    else
            //    {
            //        alert("Your browser does not support XMLHTTP.");
            //    }
            //};
            fileNameArr = []



            function send_request(){

                var responseText = {};

                $('.diyFileName').each(function(){
                    // console.log('txt:',$(this).text())
                    fileNameArr.push($(this).text())
                })
                //console.log('fileNameArr:',fileNameArr)
                fileNameArr.unique()
                // console.log('fileNameArr:',fileNameArr)
                $.ajax({
                    async: false,
                    type:'POST',
                    data:{
                        "fileName":fileNameArr.unique(),
                        "businessId":opts.businessId
                    },
                    dataType:'json',
                    url:"/upload",
                    success:function(json){
                        console.log('json:',json)
                        responseText = json
                    }
                })
                //console.log('responseText:',responseText)
                return responseText
            }


            paramsObj = {};
            function get_signature()
            {
                //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
                now = timestamp = Date.parse(new Date()) / 1000;
                // console.log('get_signature ...');
                // console.log('expire:' + expire.toString());
                // console.log('now:', + now.toString())


                if (expire < now + 3)
                {
                    // console.log('get new sign')
                    body = send_request()
                    // console.log('body:',body)
                    // console.log('body:',typeof body)
                    //var obj = eval ("(" + body + ")");
                    //var obj = JSON.parse(JSON.parse(body));
                    // var obj = JSON.parse(body);
                    var obj = body;

                    // console.log('obj:',typeof obj);
                    // console.log('obj:',obj);

                    obj = obj.data;

                    // console.log('obj2:',obj);

                    host = obj['host'];
                    policyBase64 = obj['policy']
                    accessid = obj['accessId']
                    signature = obj['signature']
                    expire = parseInt(obj['expire'])
                    callbackbody = obj['callBack']
                    key = obj['objectKey']

                    var params = obj.params;

                    $.each(params,function(index,item){
                        paramsObj[index]=item;
                    })
                    expire = 0;  //重置expire  必须
                    //return true;
                }
                return obj;
            };

            function set_upload_param(up)
            {
                // console.log("set_upload_param---up:",up)
                var ret = get_signature()
                console.log(ret)
                if (typeof ret=='object')
                {
                    new_multipart_params = {
                        'key' : key,
                        'policy': policyBase64,
                        'OSSAccessKeyId': accessid,
                        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                        'callback' : callbackbody,
                        'signature': signature,
                    };
                    new_multipart_params = $.extend({},new_multipart_params,paramsObj)

                    // console.log(new_multipart_params)
                    up.setOption({
                        'url': host,
                        'multipart_params': new_multipart_params
                    });

                    // console.log('reset uploader')
                    //uploader.start();
                }
            }
            var imgArr = []
            var imgStr = ''
            var uploader = new plupload.Uploader({
                runtimes : 'html5,flash,silverlight,html4',
                //browse_button : 'selectfiles',

                browse_button : opts.browse_button,
                container:opts.container||document.querySelector('#container'),
                // container: document.getElementById('container'),
                flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
                silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

                url : 'http://jhd-daq-img.oss-cn-shanghai.aliyuncs.com',
                multi_selection: !opts.bReplace,
                //url : host,

                init: {
                    PostInit: function() {
                        if(opts.bReplace){
                            //document.getElementById(opts.previewImageBox).innerHTML = '';
                        }
                        //document.getElementById(opts.postfiles).innerHTML = '';

                        document.getElementById(opts.postfiles).onclick = function() {
                            set_upload_param(uploader);
                            uploader.start();
                            return false;
                        };
                        //document.getElementById('postfiles').onclick = function() {
                        //    set_upload_param(uploader);
                        //    uploader.start();
                        //    return false;
                        //};
                    },

                    FilesAdded: function(up, files) {
                        // console.log('加入队列up:',up)
                        // console.log('加入队列files:',files)
                        if(opts.bReplace){
                            // console.log("up.files:",up.files);
                            if (up.files.length > 1) {
                                // alert("上传过多")
                                console.log("上传过多：FilesAdded")
                            }
                            $.each(up.files, function (i, file) {

                                // if (up.files.length > 1) {
                                //     // alert("上传过多")
                                //     console.log('file:',file)
                                //     console.log("i:",i)
                                //     if(i>0){
                                //         // $('#'+file.id).remove()
                                //
                                //         up.removeFile(file);
                                //     }
                                //     // return;
                                // }
                                if(up.files.length<=1){
                                    return
                                }
                                up.removeFile(file);

                            });
                        }

                        var previewImageBox = opts.previewImageBox;
                        var fileBoxUlHtml = '<ul class="fileBoxUl fileBoxUl_'+previewImageBox+'"></ul>'
                        var $fileBoxUl = $('.fileBoxUl_'+previewImageBox)
                        //var $fileBoxUl = $('.fileBoxUl')
                        if($('.fileBoxUl_'+previewImageBox).length<=0){
                            //$("#ossfile").append(fileBoxUlHtml)
                            $("#"+previewImageBox).append(fileBoxUlHtml)
                        }

                        console.log('files::::::',files)
                        for(var i = 0, len = files.length; i<len; i++){
                            var file_name = files[i].name; //文件名
                            var file_id = files[i].id; //文件名
                            //构造html来更新UI
                            //var html = '<li id="file-' + files[i].id +'"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
                            var html = '<li id="' + file_id +'" class="diyUploadHover">'+
                                '<div class="viewThumb"></div> '+
                                '<div class="diyCancel"></div>'+
                                '<div class="diySuccess"></div> '+
                                '<div class="diyFileName">'+file_name+'</div>'
                                // '<span class="left"></span><span class="right"></span>'+
                                // '<div class="diyBar"> '+
                                // '<div class="diyProgress"></div>'+
                                // '<div class="diyProgressText">0%</div> '+
                                // '</div>'+
                                // '</li>';
                            //$(html).appendTo('#file-list');
                            //$(html).appendTo('#ossfile ');
                            if(opts.bReplace){
                                html+= '<div class="diyBar"> '+
                                    '<div class="diyProgress"></div>'+
                                    '<div class="diyProgressText">0%</div> '+
                                    '</div>'+
                                    '</li>';
                                $('.fileBoxUl_'+previewImageBox).html(html)
                            }else{
                                html+='<span class="left"></span><span class="right"></span>'+
                                    '<div class="diyBar"> '+
                                    '<div class="diyProgress"></div>'+
                                    '<div class="diyProgressText">0%</div> '+
                                    '</div>'+
                                    '</li>';
                                $(html).appendTo('.fileBoxUl_'+previewImageBox);
                            }

                            // console.log("html:",html)
                            !function(i){
                                previewImage(files[i],function(imgsrc){
                                    //添加子容器;
                                    var li = '';

                                    // console.log('imgsrc:',imgsrc)
                                    //$('#file-'+files[i].id).append(li);
                                    $('#'+files[i].id).append('<img src="'+ imgsrc +'" />');
                                })
                            }(i);



                            var $parentFileBox = $('.parentFileBox');
                            var $fileBox = $parentFileBox.find('#'+file_id);
//绑定取消事件;
                            var $diyCancel = $fileBox.children('.diyCancel').one('click',function(){
                                // console.log('删除图片')
                                removeLi( $(this).parent('li'), file_id, uploader );
                            });




                        }
                        //plupload.each(files, function(file) {
                        //   console.log('file:',file)
                        //	//document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                        //	//+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                        //	//+'</div>';
                        //});
                    },

                    UploadProgress: function(up, file) {
                        // console.log('上传过程file:',file)
                        //var d = document.getElementById(file.id);
                        //d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        //
                        //var prog = d.getElementsByTagName('div')[0];
                        //var progBar = prog.getElementsByTagName('div')[0]
                        //progBar.style.width= 2*file.percent+'px';
                        //progBar.setAttribute('aria-valuenow', file.percent);
                        var progress = file.percent;
                        var text = '';
                        if ( progress >= 100 ) {
                            progress = progress + '%';
                            text = text || '上传完成';
                        } else {
                            progress = progress + '%';
                            text = text || progress;
                        }

                        var $fileBox = $("#"+file.id)
                        var $diyBar = $fileBox.find('.diyBar');
                        var $proBar = $fileBox.find('.diyProgressText')
                        var $diyProgress = $fileBox.find('.diyProgress')

                        $fileBox.find('.diyBar').show();
                        $diyProgress.width( progress );
                        $proBar.html(progress)
                    },

                    FileUploaded: function(up, file, info) {
                        // console.log(file)
                        // console.log('uploaded')
                        // console.log(info.status)
                        // console.log('上传结果up:',up,"file-----:",file,"info--------:",info)
                        if(opts.bReplace){
                            // console.log("up.files:",up.files);
                            if (up.files.length > 1) {
                                // var up =up[0];
                                set_upload_param(up);
                            }
                        }else{
                            // console.log('不替换:')
                            set_upload_param(up);
                        }

                        if (info.status == 200)
                        {

                            var $fileBox = $('#'+file.id);
                            // $fileBox.removeClass('diyUploadHover');
                            //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
                            $fileBox.children('.diySuccess').show();
                            $fileBox.find('.diyBar').hide();
                            // console.log(info.response)
                            // console.log(typeof info.response)
                            var data = JSON.parse(info.response).data
                            // console.log(typeof data)
                            // console.log("data:",data)
                            // console.log(data.id)
                            var oldImgArr = $(opts.stroageImgBtn).val()
                            if(!opts.bReplace){
                                if (oldImgArr && oldImgArr!='undefined'){
                                    // console.log(oldImgArr)
                                    oldImgArr = JSON.parse(oldImgArr)
                                }
                                // console.log('可以插入数据1：',typeof oldImgArr)
                                // console.log('可以插入数据2：',oldImgArr)
                                // console.log('可以插入数据3：',oldImgArr.length)
                                //if(oldImgArr && oldImgArr.length ){
                                if(oldImgArr && typeof oldImgArr=='object' ){
                                    imgArr = oldImgArr
                                    // console.log('可以插入数据')
                                }
                            }else{
                                imgArr = [];
                            }

                            imgArr.push({
                                "imageId":data.id,
                                "imageUrl":data.fileName
                            })
                            // console.log("imgArr:",imgArr)
                            //$("#summary").attr('value',JSON.stringify(imgArr))
                            $(opts.stroageImgBtn).attr('value',JSON.stringify(imgArr))
                            //$("#detail").attr('value',imgArr)
                            // console.log('imgArr:',imgArr)
                        }
                        else
                        {
                            // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                            console.log('info.status:',info)
                            console.log('info.status:',info.status)
                            alert('上传失败-status:'+info.status)
                        }
                    },

                    Error: function(up, err) {
                        set_upload_param(up);
                        console.log('err',err)
                        alert('上传失败：请联系管理员\r\nstatus：'+err.status)
                        // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                    }
                }
            });

            uploader.init();


            //操作进度条;
            function showDiyProgress( progress, $diyBar, text ) {

                if ( progress >= 100 ) {
                    progress = progress + '%';
                    text = text || '上传完成';
                } else {
                    progress = progress + '%';
                    text = text || progress;
                }

                var $diyProgress = $diyBar.find('.diyProgress');
                var $diyProgressText = $diyBar.find('.diyProgressText');
                $diyProgress.width( progress );
                $diyProgressText.text( text );

            }

//plupload中为我们提供了mOxie对象
//有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
//如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
            function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if(!file || !/image\//.test(file.type)) return; //确保文件是图片
                if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    var fr = new mOxie.FileReader();
                    fr.onload = function(){
                        callback(fr.result);
                        fr.destroy();
                        fr = null;
                    }
                    fr.readAsDataURL(file.getSource());
                }else{
                    var preloader = new mOxie.Image();
                    preloader.onload = function() {
                        preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
                        var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        callback && callback(imgsrc); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load( file.getSource() );
                }
            }

//取消事件;
            function removeLi ( $li ,file_id ,uploader) {
                uploader.removeFile( file_id );
                if ( $li.siblings('li').length <= 0 ) {
                    // $li.parents('.parentFileBox').remove();
                } else {
                    $li.remove();
                }

            }
        }
    })
})


