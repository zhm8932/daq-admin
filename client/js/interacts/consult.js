define(function (require, exports, module) {
    var utils = require('../utils');
    require('../libs/sdk/strophe');
    require('../libs/sdk/easemob.im-1.1');
    require('../libs/sdk/easemob.im-1.1.shim');
    var imConfig = require('../easemob.im.config');


    var masterId = $('#user-list').attr('data-masterAccId');
    var masterAccount = $('#user-list').attr('data-masterAccName');
    var customerId = '';
    var customerAccount = '';

    var conn = null;
    var $body = $('body');
    var $chatBox = $('.chatBox');

    var accessToken = '';

    var emotionFlag = false;
    // var customerId = 1;
    var groupFlagMark = "groupchat";
    var chatRoomMark = "chatroom";
    var groupQuering = false;
    var textSending = false;
    var time = 0;
    var flashFilename = '';
    var audioDom = [];
    var picshim;
    var audioshim;
    var fileshim;
    var PAGELIMIT = 8;
    var pageLimitKey = new Date().getTime();
    var maxWidth = 200;

    var curUserId = null;
    var curChatUserId = null;
    var conn = null;
    var curRoomId = null;
    var curChatRoomId = null;
    var msgCardDivId = "chat01";
    var talkToDivId = "talkTo";
    var talkInputId = "talkInputId";
    var bothRoster = [];
    var toRoster = [];
    var maxWidth = 200;
    var groupFlagMark = "groupchat";
    var chatRoomMark = "chatroom";
    var groupQuering = false;
    var textSending = false;
    var time = 0;
    var flashFilename = '';
    var audioDom = [];
    var picshim;
    var audioshim;
    var fileshim;
    var PAGELIMIT = 8;
    var pageLimitKey = new Date().getTime();


    var getObjectURL = function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    };

    $(function () {
        var userIds = $('#user-list').find('.fromUser,.toUser');
        getAccountDtlBatch(userIds);
        conn = new Easemob.im.Connection();
        loginEaseMob();

        //初始化连接
        conn.init({
            onOpened: function () {
                // console.log(JSON.stringify(conn));
                accessToken = conn.context.accessToken;
                console.log('===='+accessToken);
                conn.setPresence();
            },
            onClosed: function () {
                //处理登出事件
                //当连接关闭时的回调方法
                conn.clear();
                conn.close();

                utils.AlertTip('fail','账号已在其他设备登录,请重新登录',function(){
                    window.location.href = '/login';
                });
            },
            onTextMessage: function (message) {  //收到文本消息处理动作
                handleTimelyMessage(message,'text');
            },
            //收到表情消息时的回调方法
            onEmotionMessage : function(message) {
                handleTimelyMessage(message,'emotion');
            },
            onPictureMessage : function(message) {
                handleTimelyMessage(message,'pic');
            },
            //收到音频消息的回调方法
            onAudioMessage : function(message) {
                handleTimelyMessage(message,'audio');
            },
            // //收到位置消息的回调方法
            // onLocationMessage : function(message) {
            //     handleLocationMessage(message);
            // },
            // //收到文件消息的回调方法
            // onFileMessage : function(message) {
            //     handleFileMessage(message);
            // },
            // //收到视频消息的回调方法
            // onVideoMessage: function(message) {
            //     handleVideoMessage(message);
            // },
            onError: function (e) {
                //异常处理
                utils.AlertTip('fail',e.msg);
            }
        });


        //发送文字消息
        $body.on('click', '.sendMsg', sendText);
        //表情
        $('#chatBox').find('.emotion').on('click',showEmotionDialog);
        $('#chatBox').find('.wl_faces_close').on('click',turnoffFaces_box);
        $(window).on('keyup', function () {
            if (event.keyCode == '13') {  //回车会换行 这里去掉发送功能
                var css = $chatBox.css('display');
                if ($chatBox.css('display') != 'none') {
                    // sendText();
                }
            }
        });


        $body.on('click', '.close', closeChatDialog);

        //获取历史记录
        $('body').on('click', '.chatBtn', function () {
            getChatHistory(this);
        });
        

        // $('#fileInput').on('change', function() {
        //     switch ( this.getAttribute('data-type') ) {
        //         case 'img':
        //             sendPic();
        //             break;
        //         case 'audio':
        //             sendAudio();
        //             break;
        //         default:
        //             sendFile();
        //             break;
        //     }
        // });
    });

    //easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
    //统一的处理，不需要用户自己区别字符是文本还是表情符号。
    function handleEmotion(message) {
        var from = message.from;
        var room = message.to;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(message.from, mestype + message.to, message);
        } else {
            appendMsg(from, from, message);
        }
    }
    //easemobwebim-sdk收到图片消息的回调方法的实现
    function handlePictureMessage(message) {
        // var filename = message.filename;//文件名称，带文件扩展名
        // var from = message.from;//文件的发送者
        // var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        // var contactDivId = from;
        // if (mestype == groupFlagMark || mestype == chatRoomMark) {
        //     contactDivId = mestype + message.to;
        // }
        // var options = message;
        //
        // var img = document.createElement("img");
        // img.src = message.url;
        var msgHtml = '<img class="thumb" src="'+message.url+'"/>';
        var dialogueHtml = getDialogueHtml('customer', customerAccount, utils.GetLoacalTimeString(), msgHtml);
        appendMsg(dialogueHtml);
        // appendMsg(from, contactDivId, {
        //     data : [ {
        //         type : 'pic',
        //         filename : filename || '',
        //         data : img
        //     } ]
        // });
    }


    //easemobwebim-sdk收到音频消息回调方法的实现
    function handleAudioMessage(message) {
        var filename = message.filename;
        var filetype = message.filetype;
        var from = message.from;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + message.to;
        }

        var msgHtml = '<audio src="'+message.url+'" controls="controls" type="video/mp4">Your browser does not support the audio element.</audio>';
        var dialogueHtml = getDialogueHtml('customer', customerAccount, utils.GetLoacalTimeString(), msgHtml);

        var dialogue = appendMsg(dialogueHtml);
        var audio = dialogue.find('audio')[0];

        downloadAudio(message,audio);
    }


    function downloadAudio(options,audio){
        options.onFileDownloadComplete = function(response, xhr) {
            var objectURL = Easemob.im.Helper.parseDownloadResponse.call(this, response);
            if (Easemob.im.Helper.getIEVersion != 9 && window.Audio) {
                audio.onload = function() {
                    audio.onload = null;
                    window.URL && window.URL.revokeObjectURL && window.URL.revokeObjectURL(audio.src);
                };
                audio.onerror = function() {
                    audio.onerror = null;
                };
                audio.src = objectURL;
                return;
            }
        };
        options.onFileDownloadError = function(e) {
            // appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
            // utils.AlertTip('fail',e.msg + ",下载音频" + options.filename + "失败");
            console.log(e.msg + ",下载音频" + options.filename + "失败");
        };
        options.headers = {
            "Accept" : "audio/mp3"
        };
        Easemob.im.Helper.download(options);
    }



    function getAccountDtlBatch(eles) {
        var ids = [];
        for (var i = 0; i < eles.length; i++) {
            ids.push(eles.eq(i).html());
        }
        if(ids.length <= 0){
            return false;
        }
        var url = '/interacts/getAccountDtlBatch';
        utils.SendAjax({
            url: url,
            param: {ids: ids},
            tipText: '获取用户账号',
            callback: function (result) {
                for(var i = 0; i < ids.length; i++){
                    for (var j = 0; j < result.data.length; j++) {
                        if(eles.eq(i).html() == result.data[j].id){
                            eles.eq(i).html(result.data[j].account);
                        }
                    }
                }
            }
        });
    }

    function appendMsg(html) {
        var $chat01_content = $('.chat01_content');

        var OHtml = $(html);

        $chat01_content.append(OHtml);
        var scrollHeight = $chat01_content[0].scrollHeight;
        $chat01_content.scrollTop(scrollHeight);
        return OHtml;
    }


    // 对聊天内容的统一处理方法
    function getMsgHtml( message) {
        var msgHtml = '';

        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        var type = typeof message;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message,{});
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }
        var messageContent = localMsg;
        for (var i = 0; i < messageContent.length; i++) {
            var msg = messageContent[i];
            var type = msg.type;
            var data = msg.data;

            if (type == "emotion") {
                msgHtml += "<p3><img src='" + data + "'/></p3>";
            } else if (type == "pic" || type == 'audio' || type == 'video') {
                var filename = msg.filename;
                msgHtml += "<p3>" + filename + "</p3><br>";
                if(type == 'audio' && msg.audioShim) {
                    var t = new Date().getTime();
                    msgHtml += '<div class="'+t+'"></div><button class="play'+t+'">播放</button><button style="display:none" class="play'+t+'">暂停</button>';
                }
                if(type == 'pic'){
                    msgHtml += "<img class='thumb' src='"+ data.src +"'/>";
                    // msgHtml += msg.data.outerHTML;
                }
            } else {
                msgHtml += "<p3>" + data + "</p3>";
            }
        }
        if(type == 'audio' && msg.audioShim) {
            setTimeout(function(){
                playAudioShim(d.find('.'+t), data.masterSrc, t);
            }, 0);
        }
        return msgHtml;
    }


    // 对聊天历史的统一处理方法
    function getHistoryMsgHtml( message) {
        var msgHtml = '';

        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        var type = message.type;
        var body = JSON.parse(message.body);
        if (type == 'txt') {
            localMsg = Easemob.im.Helper.parseTextMessage(body.msg,{});
            localMsg = localMsg.body;
            var messageContent = localMsg;
            for (var i = 0; i < messageContent.length; i++) {
                var data = messageContent[i];
                var type = data.type;
                if (type == "emotion") {
                    msgHtml += "<p3><img src='" + data.data + "'/></p3>";
                }else {
                    msgHtml += "<p3>" + data.data + "</p3>";
                }
            }
        } else {
            var filename = body.filename;
            msgHtml += "<p3>" + filename + "</p3><br>";
            if(type == 'audio') {
                msgHtml += '<audio data-msg='+JSON.stringify(message)+' src="'+body.url+'" controls="controls" type="video/mp4">Your browser does not support the audio element.</audio>';
            }
            if(type == 'img'){
                msgHtml += '<img  class="thumb" src="'+body.url+'">';
            }
        }
        return msgHtml;




        // var msgHtml = '';
        //
        // var type = msg.type;
        // var body = JSON.parse(msg.body);
        //
        // if (type == "emotion") {
        //     msgHtml += "<p3><img src='" + body.src + "'/></p3>";
        // } else if (type == "img" || type == 'audio' || type == 'video') {
        //
        //     var filename = body.filename;
        //     msgHtml += "<p3>" + filename + "</p3><br>";
        //     if(type == 'audio') {
        //         msgHtml += '<audio data-msg='+JSON.stringify(msg)+' src="'+body.url+'" controls="controls" type="video/mp4">Your browser does not support the audio element.</audio>';
        //     }
        //     if(type == 'img'){
        //         msgHtml += '<img src="'+body.url+'">';
        //     }
        // } else {
        //     msgHtml += "<p3>" + body.msg + "</p3>";
        // }
        // return msgHtml;
    }



    //identity为master时代表自己,为customer时代表他人
    function getDialogueHtml(identity, name, time, msg) {
        return '<div class="' + identity + '"><span class="user-name">' + name + '&nbsp;&nbsp;&nbsp;</span><span>' + time + '<br></span> ' +
            '<p classname="chat-content-p3" class="chat-content-p3">' + msg + ' </p> </div>';
    }


    //构造出消息HTML,并显示在页面中
    function handleMsgAndAppend(message,identity, name, time){
        var msgHtml =  getMsgHtml( message);
        var dialogueHtml = getDialogueHtml(identity, name, time, msgHtml);
        appendMsg(dialogueHtml);
    }

    function handleTimelyMessage(message,msgType) {
        var trHtmlArr = [];
        console.log(JSON.stringify(message));
        console.log('customerId:'+customerId);
        if(message.from == customerId){
            if(msgType == 'audio'){
                handleAudioMessage(message);
            }else if(msgType == 'pic'){
                handlePictureMessage(message);
            }else{
                handleMsgAndAppend(message.data,'customer', customerAccount, utils.GetLoacalTimeString());
            }
        }else{
            var msgContent = '';
            if(msgType == 'audio'){
                msgContent = '[语音]';
            }else if(msgType == 'pic'){
                msgContent = '[图片]';
            }else{
                msgContent = message.data;
            }

            trHtmlArr.push('<tr class="'+message.from+' '+ message.to +'" data-fromUserId="'+message.from+'" data-toUserId="'+message.to+'">');
            trHtmlArr.push('<td class="fromUser">'+message.from+'</td><td class="toUser">'+message.to+'</td><td>'+utils.GetLoacalDateAndTime()+'</td><td>'+msgContent+'</td>');
            trHtmlArr.push('<td><a class="chatBtn" href="javascript:;">会话</a></td></tr>');
            var tr = $(trHtmlArr.join(''));
            var tbody = $('#user-list tbody');
            if(tbody.find('tr.no-record').length > 0){
                tbody.find('tr.no-record').remove();
                tbody.append(tr);
            }else{
                tbody.find('tr').eq(0).before(tr);
                var exitedTr = tbody.find('.'+message.from);
                if(exitedTr.length > 0){
                    exitedTr.eq(1).remove();
                }
            }
            getAccountDtlBatch(tr.find('.fromUser,.toUser'));
            tr.find('.chatBtn').on('click',function(){
                getChatHistory(this);
            });
        }
    }

    function loginEaseMob() {
        var password = $('#user-list').attr('data-p');
        var config = {
            user: masterId,
            pwd: password,
            appKey: imConfig.appkey,
            apiUrl: imConfig.apiURL
        };
        
        console.log("config:",config)
        conn.open({
            user: masterId,
            pwd: password,
            appKey: imConfig.appkey,
            apiUrl: imConfig.apiURL
        });


    }

    function getChatHistory(obj) {
        var fromUserId = $(obj).closest('tr').attr('data-fromUserId');
        var toUserId = $(obj).closest('tr').attr('data-toUserId');
        if(masterId == fromUserId){
            customerId = toUserId;
            customerAccount = $(obj).closest('tr').find('.toUser').html();
        }else{
            customerId = fromUserId;
            customerAccount = $(obj).closest('tr').find('.fromUser').html();
        }

        //设置聊天框的toUser和fromUSer
        // $("#chatBox").attr('data-fromUserId', fromUserId).attr('data-fromUserName', fromUserName);
        $('#toUser').html(customerAccount);
        $('#fromUser').html(masterAccount);

        $chatBox.fadeIn();

        var url = '/interacts/consultHis';
        var param = {user1: masterId, user2: customerId, queryDataType: 'json', pageSize: 100};
        //加载聊天记录
        utils.SendAjax({
            url: url,
            param: param,
            tipText: '获取聊天记录',
            callback: function (result) {
                var items = result.data.data;
                var hisMsgHtml = '';
                for (var i = items.length - 1; i >= 0; i--) {
                    var msgHtml = getHistoryMsgHtml(items[i]);
                    if (items[i].fromUser == masterId) {
                        hisMsgHtml += getDialogueHtml('master', masterAccount, utils.GetLoacalTimeString(items[i].updatedAt), msgHtml);
                    } else {
                        hisMsgHtml += getDialogueHtml('customer', customerAccount, utils.GetLoacalTimeString(items[i].updatedAt), msgHtml);
                    }
                }
                var OHtml = appendMsg(hisMsgHtml);
                var audioList = OHtml.find('audio');
                audioList.each(function(index,ele){
                    var $this = $(ele);
                    var m = $this.attr('data-msg');
                    var audio = $this[0];
                    console.log(m);
                    var message = JSON.parse(JSON.parse(m).body);
                    message.accessToken = accessToken;
                    downloadAudio(message,audio);

                });

            },
            errorFun: function () {

            }
        });
    }

    function closeChatDialog() {
        var popup = new utils.Popup({
            msg: '<aside><h5>确定退出吗?</h5>',
            okText: '确定',
            width: '360',
            //  isHide:false,
            okCallback: function () {
                var myMsg = new utils.MsgShow({
                    delayTime: 2000,
                    title: '退出会话成功!!'
                }).hideMsg(function () {
                    $chatBox.fadeOut();
                    window.location.reload();
                })
            }
        })
    }

    function sendText() {
        //接收者给发送者回复消息
        var msg = $('#chatContent').val();

        var options = {
            to: customerId,  //用户登录名，sd根据appkey和domain组织jid，如easemob-demo#chatdemoui_**TEST**@easemob.com，中"to:TEST",下同
            msg: msg,
            type: "chat"
        };

        console.log("options:",options)
        console.log("masterAccount:",masterAccount)

        if (msg) {
            conn.sendTextMessage(options);   ////发送文本消息接口
            handleMsgAndAppend(options.msg,'master', masterAccount, utils.GetLoacalTimeString());
            $('textarea').val('');
        }
    }


    var pictype = {
        "jpg" : true,
        "gif" : true,
        "png" : true,
        "bmp" : true
    };
    $('#fileInput').on('change', function() {

        switch ( this.getAttribute('data-type') ) {
            case 'img':
                sendPic();
                break;
            case 'audio':
                sendAudio();
                break;
            default:
                // sendFile();
                sendPic();
                break;
        }
    });



    //发送图片消息时调用方法
    function sendPic() {

        var to = customerId;
        if (to == null) {
            return;
        }

        // Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为 input 标签的id值
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');
        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请先选择图片");
            return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || filetype in pictype) {
            var opt = {
                type : 'chat',
                fileInputId : 'fileInput',
                filename : flashFilename || filename,
                to : to,
                apiUrl: imConfig.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送图片文件失败:" + (filename || flashFilename);
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                onFileUploadComplete : function(data) {
                    var file = document.getElementById('fileInput');
                    if ( Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        var objUrl = getObjectURL(file.files[0]);
                        if (objUrl) {
                            var img = document.createElement("img");
                            img.src = objUrl;
                            img.width = maxWidth;
                        }
                    } else {
                        filename = data.filename || '';
                        var img = document.createElement("img");
                        img.src = data.uri + '/' + data.entities[0].uuid;
                        img.width = maxWidth;
                    }
                    var messageContent = {
                        data : [ {
                            type : 'pic',
                            filename : filename,
                            data : img
                        } ]
                    };
                    // appendMsg(masterId, to, {
                    //     data : [ {
                    //         type : 'pic',
                    //         filename : filename,
                    //         data : img
                    //     } ]
                    // });
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                flashUpload: flashPicUpload
            };

            conn.sendPicture(opt);
            return;
        }
        alert("不支持此图片类型" + filetype);
    };
    var audtype = {
        "mp3" : true,
        "wma" : true,
        "wav" : true,
        "amr" : true,
        "avi" : true
    };
    //发送音频消息时调用的方法
    function sendAudio() {
        var to = customerId;
        if (to == null) {
            return;
        }
        //利用easemobwebim-sdk提供的方法来构造一个file对象
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');
        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请先选择音频");
            return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || filetype in audtype) {
            var opt = {
                type : "chat",
                fileInputId : 'fileInput',
                filename : flashFilename || filename,
                to : to,//发给谁
                apiUrl: imConfig.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送音频失败:" + (filename || flashFilename);
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                onFileUploadComplete : function(data) {
                    var messageContent = "发送音频" + data.filename;

                    var file = document.getElementById('fileInput');
                    var aud = document.createElement('audio');
                    aud.controls = true;

                    if (Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        var objUrl = getObjectURL(file.files[0]);
                        if (objUrl) {
                            aud.setAttribute('src', objUrl);
                        }
                    } else {
                        aud.setAttribute('src', data.uri + '/' + data.entities[0].uuid);
                    }

                    // appendMsg(masterId, to, {
                    //     data : [ {
                    //         type : 'audio',
                    //         filename : filename,
                    //         data : aud,
                    //         audioShim: !window.Audio
                    //     } ]
                    // });
                    var messageContent = {
                        data : [ {
                            type : 'audio',
                            filename : filename,
                            data : aud,
                            audioShim: !window.Audio
                        } ]
                    };
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                flashUpload: flashAudioUpload
            };
            //构造完opt对象后调用easemobwebim-sdk中发送音频的方法
            if (customerId.indexOf(groupFlagMark) >= 0) {
                opt.type = groupFlagMark;
                opt.to = curRoomId;
            } else if (customerId.indexOf(chatRoomMark) >= 0) {
                opt.type = groupFlagMark;
                opt.roomType = chatRoomMark;
                opt.to = curRoomId;
            }
            conn.sendAudio(opt);
            return;
        }
        alert("不支持此音频类型" + filetype);
    }

    var filetype = {
        "mp3" : true,
        "wma" : true,
        "wav" : true,
        "amr" : true,
        "avi" : true,
        "jpg" : true,
        "gif" : true,
        "png" : true,
        "bmp" : true,
        "zip" : true,
        "rar" : true,
        "doc" : true,
        "docx" : true,
        "pdf" : true
    };
    //发送文件消息时调用的方法
    function sendFile() {
        var to = customerId;
        if (to == null) {
            return;
        }
        //利用easemobwebim-sdk提供的方法来构造一个file对象
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');
        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请选择发送音频");
            return;
        }
        var fileType = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || fileType in filetype) {
            var opt = {
                type : "chat",
                fileInputId : 'fileInput',
                filename : filename || flashFilename,
                to : to,//发给谁
                apiUrl: imConfig.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送文件失败:" + (filename || flashFilename);
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                onFileUploadComplete : function(data) {
                    var messageContent = "发送文件" + data.filename;
                    handleMsgAndAppend(messageContent,'master', masterAccount, utils.GetLoacalTimeString());
                },
                flashUpload: flashFileUpload
            };
            //构造完opt对象后调用easemobwebim-sdk中发送音频的方法
            // if (customerId.indexOf(groupFlagMark) >= 0) {
            //     opt.type = groupFlagMark;
            //     opt.to = curRoomId;
            // } else if (customerId.indexOf(chatRoomMark) >= 0) {
            //     opt.type = groupFlagMark;
            //     opt.roomType = chatRoomMark;
            //     opt.to = curRoomId;
            // }
            conn.sendFile(opt);
            return;
        }
        alert("不支持此文件类型" + fileType);
    }

    //提供上传接口
    function flashUpload( swfObj, url, options ) {
        swfObj.setUploadURL(url);
        swfObj.uploadOptions = options;
        swfObj.startUpload();
    };
    function flashPicUpload( url, options ) {
        flashUpload(picshim, url, options);
    };
    function flashAudioUpload( url, options ) {
        flashUpload(audioshim, url, options);
    };
    function flashFileUpload( url, options ) {
        flashUpload(fileshim, url, options);
    };



    function clearPageSign() {
        if (imConfig.multiResources && window.localStorage) {
            try {
                localStorage.clear();
            } catch (e) {
            }
        }
    }

    //异常情况下的处理方法
    function handleError(e) {
        console.log(e)
        curChatRoomId = null;

        clearPageSign();
        e && e.upload && $('#fileModal').modal('hide');
        var msg = e.msg;
        if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
            if (msg == "" || msg == 'unknown') {
                alert("服务器断开连接,可能是因为在别处登录");
            } else {
                alert("服务器断开连接");
            }
        } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
            console.log("用户已经在管理后台删除");
            if (msg.toLowerCase().indexOf("user removed") != -1) {
                alert("用户已经在管理后台删除");
            }
        } else {
            console.log("msg");
            alert(msg);
        }
        conn.stopHeartBeat(conn);
    }


    //处理不支持<audio>标签的浏览器，当前只支持MP3
    function playAudioShim( dom, url, t ) {
        var d = $(dom),
            play = d.next(),
            pause = play.next(),
            u = url;

        if ( !d.jPlayer ) {
            return;
        }

        Easemob.im.Helper.getIEVersion < 9 && audioDom.push(d);
        d.jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: u
                });
            },
            solution: (Easemob.im.Helper.getIEVersion != 9 ? "html, flash" : "flash"),
            swfPath: "sdk/jplayer",
            supplied: "mp3",
            ended: function () {
                pause.hide();
                play.show();
            }
        });
        play.on('click', function () {
            d.jPlayer('play');
            play.hide();
            pause.show();
        });
        pause.on('click', function () {
            d.jPlayer('pause');
            play.show();
            pause.hide();
        });
    };

    function showEmotionDialog() {
        if (emotionFlag) {
            $('#wl_faces_box').css({
                "display" : "block"
            });
            return;
        }
        emotionFlag = true;
        // Easemob.im.Helper.EmotionPicData设置表情的json数组
        var sjson = Easemob.im.EMOTIONS,
            data = sjson.map,
            path = sjson.path;

        for ( var key in data) {
            var emotions = $('<img>').attr({
                "id" : key,
                "src" : path + data[key],
                "style" : "cursor:pointer;"
            }).click(function() {
                selectEmotionImg(this);
            });
            $('<li>').append(emotions).appendTo($('#emotionUL'));
        }
        $('#wl_faces_box').css({
            "display" : "block"
        });
    }
    //表情选择div的关闭方法
    function turnoffFaces_box() {
        $("#wl_faces_box").fadeOut("slow");
    }

    function selectEmotionImg(selImg) {
        var txt = document.getElementById('chatContent');
        txt.value = txt.value + selImg.id;
        txt.focus();
    }


    Easemob.im.EMOTIONS = {
        path: '/images/chat_faces/',
        map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
    };

});

function send( e ) {
    var e = (e || window.event),
        tar = e.target || e.srcElement;

    var fI = $('#fileInput');
    fI.val('').attr('data-type', tar.getAttribute('type')).click();
}