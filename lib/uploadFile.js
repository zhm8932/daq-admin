/**
 * Created by James on 16/4/11.
 */

var jade = require('jade');
var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');

var errorJson = {"code":"111","data":null,"msg":"json parse exception","success":false};

exports.uploadFile = function (opt) {
    getUploadAccess(opt.fileType,opt.fileName, opt.businessId, function (data, success) {
        var result = JSON.parse(data).data;
        var files = [
            {urlKey: "file", urlValue: opt.filePath,fileName:opt.fileName||'1.jpg'}
        ];

        var options = {
            // host: "jhd-daq-file.oss-cn-shanghai.aliyuncs.com",
            host: result.host && result.host.substring(7) || "jhd-daq-file.oss-cn-shanghai.aliyuncs.com",
            method: "POST"
        };

        console.log(JSON.stringify(options));

        var req = http.request(options, function (res) {
            var body = '';
            res.on("data", function (chunk) {
                body += chunk;
            }).on('end',function() {
                var success = true;
                var resObj = null;
                try {
                    resObj = JSON.parse(body);
                    success = resObj.success;
                }catch (error) {
                    success = false;
                    res.json(JSON.stringify(errorJson));
                }
                opt.callback && opt.callback(body,success);
            });
        });

        req.on('error', function (error) {
            errorJson.msg = error;
            var body = JSON.stringify(errorJson);
            opt.callback && opt.callback(body,false);
        });

        postFile(files, req, result);
        console.log("done");
    });
}


function getUploadAccess(fileType,fileName, businessId, callback) {
    var bizParam = {
        "command": {
            "rawRequest": {
                "fileType": fileType,
                "appId": "DAQ-WebPage",  //从都安全网页端注册的用户
                "fileName": fileName,
                "businessId": businessId   //用户头像:21001  ,商品图片:22001 ,医生头像:23001,banner:24001
            }
        }
    };

    if (typeof fileName == 'object') {
        fileName.forEach(function (str, index) {
            bizParam.command.rawRequest.fileName = str;
            //obj.command = JSON.stringify(bizParam.command)
            console.log('bizParam:', bizParam);

        })
    }

    util.ajax('GET', api.FileWebToken,null, bizParam, function (data, success) {
        callback && callback(data, success);
    });
}

function postFile(fileKeyValue, req, result) {
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';

    var files = new Array();
    for (var i = 0; i < fileKeyValue.length; i++) {
        var content = "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"name\"\r\n\r\n" + fileKeyValue[i].fileName +"\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"key\"\r\n\r\n" + result.objectKey +"\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"policy\"\r\n\r\n" + result.policy + "\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"OSSAccessKeyId\"\r\n\r\n" + result.accessId + "\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"success_action_status\"\r\n\r\n" + "200\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"callback\"\r\n\r\n" + result.callBack + "\r\n" +
            "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"signature\"\r\n\r\n" + result.signature +  "\r\n" ;


        for(var key in result.params){
            content += "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\""+ key +"\"\r\n\r\n" + result.params[key]+ "\r\n" ;
        }

        content += "----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"file\"; filename=\"pic01.jpg\"\r\n\r\n";

        var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。
        files.push({contentBinary: contentBinary, filePath: fileKeyValue[i].urlValue});
    }
    var contentLength = 0;
    for (var i = 0; i < files.length; i++) {
        var stat = fs.statSync(files[i].filePath);
        contentLength += files[i].contentBinary.length;
        contentLength += stat.size;
    }

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));


    // 将参数发出
    var fileindex = 0;
    var doOneFile = function () {
        req.write(files[fileindex].contentBinary);
        var fileStream = fs.createReadStream(files[fileindex].filePath, {bufferSize: 4 * 1024});
        fileStream.pipe(req, {end: false});
        fileStream.on('end', function () {
            fileindex++;
            if (fileindex == files.length) {
                req.end(enddata);
            } else {
                doOneFile();
            }
        });
    };
    if (fileindex == files.length) {
        req.end(enddata);
    } else {
        doOneFile();
    }
}



