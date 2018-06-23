
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
appId = ''
bucketId = ''
directoryId = ''
title = ''
fileType = ''
expire = 0
now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        //phpUrl = './php/get.php'
		//phpUrl = 'http://18680345944.oicp.net/token/web?appId=a1ffe72997d0488f80c5a3cbdc8b3137&fileType=1&businessId=1&fileName=1.jpg'
		phpUrl = 'http://120.76.76.191:8181/token/web?appId=a1ffe72997d0488f80c5a3cbdc8b3137&fileType=1&businessId=1&fileName=1.jpg'
        xmlhttp.open( "GET", phpUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    console.log('get_signature ...');
    console.log('expire:' + expire.toString());
    console.log('now:', + now.toString())
    if (expire < now + 3)
    {
        console.log('get new sign')
        body = send_request()
        var obj = eval ("(" + body + ")");
        console.log(obj)
		obj = obj['data']
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessId']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callBack'] 
        key = obj['objectKey']
		appId = obj['params']['x:appid']
        bucketId = obj['params']['x:bucketid']
        directoryId = obj['params']['x:directoryid']
        title = obj['params']['x:title']
        fileType = obj['params']['x:filetype']
        return true;
    }
    return false;
};

function set_upload_param(up)
{
    var ret = get_signature()
    if (ret == true)
    {
        new_multipart_params = {
		    'key' : key,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : callbackbody,
            'signature': signature,
			 "x:appid":appId,
				"x:bucketid":bucketId,
				"x:directoryid":directoryId,
				"x:title":title,
				"x:filetype":fileType

        };

        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });

        console.log('reset uploader')
        //uploader.start();
    }
}
var imgArr = []
var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfiles', 
	container: document.getElementById('container'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

    url : 'http://oss.aliyuncs.com',

	init: {
		PostInit: function() {
			document.getElementById('ossfile').innerHTML = '';
			document.getElementById('postfiles').onclick = function() {
            set_upload_param(uploader);
            uploader.start();
            return false;
			};
		},

		FilesAdded: function(up, files) {
            var fileBoxUlHtml = '<ul class="fileBoxUl"></ul>'
            var $fileBoxUl = $('.fileBoxUl')
            if($fileBoxUl.length<=0){
                $("#ossfile").append(fileBoxUlHtml)
            }

            for(var i = 0, len = files.length; i<len; i++){
                var file_name = files[i].name; //文件名
                var file_id = files[i].id; //文件名
                //构造html来更新UI
                //var html = '<li id="file-' + files[i].id +'"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
                var html = '<li id="' + file_id +'" class="diyUploadHover">'+
                    '<div class="viewThumb"></div> '+
                    '<div class="diyCancel"></div>'+
                    '<div class="diySuccess"></div> '+
                    '<div class="diyFileName">'+file_name+'</div>'+
                    '<div class="diyBar"> '+
                    '<div class="diyProgress"></div>'+
                    '<div class="diyProgressText">0%</div> '+
                    '</div>'+
                    '</li>';
                //$(html).appendTo('#file-list');
                //$(html).appendTo('#ossfile ');
                $(html).appendTo('.fileBoxUl');
                !function(i){
                    previewImage(files[i],function(imgsrc){
                        //添加子容器;
                        var li = '';

                        console.log('imgsrc:',imgsrc)
                        //$('#file-'+files[i].id).append(li);
                        $('#'+files[i].id).append('<img src="'+ imgsrc +'" />');
                    })
                }(i);



                var $parentFileBox = $('.parentFileBox');
                var $fileBox = $parentFileBox.find('#'+file_id);
//绑定取消事件;
                var $diyCancel = $fileBox.children('.diyCancel').one('click',function(){
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
			//var d = document.getElementById(file.id);
			//d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            //
            //var prog = d.getElementsByTagName('div')[0];
			//var progBar = prog.getElementsByTagName('div')[0]
			//progBar.style.width= 2*file.percent+'px';
			//progBar.setAttribute('aria-valuenow', file.percent);
            //var $proBar = $("#"+file.id).find('.diyProgressText')
            //$proBar.html(file.percent)
		},

		FileUploaded: function(up, file, info) {
            console.log(file)
            console.log('uploaded')
            console.log(info.status)
            console.log('info:',info)
            set_upload_param(up);
            if (info.status == 200)
            {

                var $fileBox = $('#'+file.id);
                $fileBox.removeClass('diyUploadHover');
                //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
                $fileBox.children('.diySuccess').show();
                console.log(info.response)
                var data = info.response
                imgArr.push({
                    "imageId":data.id,
                    "imageUrl":data.url
                })
                //$("#detail").attr('value',JSON.stringify(imgArr))
                $("#detail").attr('value',JSON.stringify(imgArr))
                console.log('imgArr:',imgArr)
            }
            else
            {
               // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},

		Error: function(up, err) {
            set_upload_param(up);
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploader.init();


//绑定文件添加进队列事件
//uploader.bind('FilesAdded',function(uploader,files){
//    var fileBoxUlHtml = '<ul class="fileBoxUl"></ul>'
//    var $fileBoxUl = $('.fileBoxUl')
//    if($fileBoxUl.length<=0){
//        $("#ossfile").append(fileBoxUlHtml)
//    }
//
//    for(var i = 0, len = files.length; i<len; i++){
//        var file_name = files[i].name; //文件名
//        var file_id = files[i].id; //文件名
//        //构造html来更新UI
//        //var html = '<li id="file-' + files[i].id +'"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
//        var html = '<li id="' + file_id +'" class="diyUploadHover">'+
//                        '<div class="viewThumb"></div> '+
//                        '<div class="diyCancel"></div>'+
//                        '<div class="diySuccess"></div> '+
//                        '<div class="diyFileName">'+file_name+'</div>'+
//                        '<div class="diyBar"> '+
//                                '<div class="diyProgress"></div>'+
//                                '<div class="diyProgressText">0%</div> '+
//                        '</div>'+
//                    '</li>';
//        //$(html).appendTo('#file-list');
//        //$(html).appendTo('#ossfile ');
//        $(html).appendTo('.fileBoxUl');
//        !function(i){
//            previewImage(files[i],function(imgsrc){
//                //添加子容器;
//                var li = '';
//
//                console.log('imgsrc:',imgsrc)
//                //$('#file-'+files[i].id).append(li);
//                $('#'+files[i].id).append('<img src="'+ imgsrc +'" />');
//            })
//        }(i);
//
//
//
//        var $parentFileBox = $('.parentFileBox');
//        var $fileBox = $parentFileBox.find('#'+file_id);
////绑定取消事件;
//        var $diyCancel = $fileBox.children('.diyCancel').one('click',function(){
//            removeLi( $(this).parent('li'), file_id, uploader );
//        });
//    }
//});

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
        $li.parents('.parentFileBox').remove();
    } else {
        $li.remove();
    }

}

