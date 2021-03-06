/**
 * Created by James on 16/4/8.
 */
var http = require('http');
var config = require('../config');
var md5 = require("blueimp-md5");
var request = require("request");
var BufferHelper = require('./bufferhelper');//处理buffer接收问题
var https = require('https');

var errorJson = {"code":"111","data":null,"msg":"json parse exception","success":false};

function signParam(sysParam,bizParam) {
    var params = {};//把bizParam和sysParam一起存放到params里
    var propertyArr = [];//用来给属性名称排序
    var paramsArr = [];//用来存放排好序的属性名和属性值
    extend(params,sysParam,bizParam);

    //给属性名排序
    for(var property in params){
        propertyArr.push(property);
    }
    propertyArr.sort();

    //拼接属性名和属性值
    for(var i = 0; i <propertyArr.length; i++){
        //为json或数组时,要stringify
        if((typeof(params[propertyArr[i]]) == "object" && Object.prototype.toString.call(params[propertyArr[i]]).toLowerCase() == "[object object]" && !params[propertyArr[i]].length)|| Array.isArray(params[propertyArr[i]])){
            paramsArr.push(propertyArr[i] + JSON.stringify(params[propertyArr[i]]));
        }else{
            paramsArr.push(propertyArr[i] + params[propertyArr[i]]);
        }
    }

    var str =  config.secret + paramsArr.join('') + config.secret;

    return md5(str);

};

function sysParam(apiName,bizParam,accessToken) {

    var timestamp = Date.now();

    var appKey = config.appKey;
    
    var version = config.v;
    
    var format = config.format;

    var sysParameters = {
        "timestamp" : timestamp,
        "v" : version,
        "format" : format,
        "appKey" : appKey,
        "apiName" : apiName,
        "session":accessToken
    };

    sysParameters.sign = signParam(sysParameters,bizParam);

    return JSON.stringify(sysParameters);
}

module.exports.ajax = function (method,apiName,browserReq,bizParam,callback) {
    var method = method.toUpperCase();

    var accessToken = (browserReq && browserReq.session && browserReq.session.userInfo && browserReq.session.userInfo.accessToken) || '11';
    var sysPara = sysParam(apiName,bizParam,accessToken);
    var param = encodeURI('bizParam=' + encodeURIComponent(JSON.stringify(bizParam))+'&sysParam=' + sysPara);

    var path = config.path;

    console.log('---method:'+method);
    console.log('---bizParam:'+JSON.stringify(bizParam));
    console.log('---sysPara:'+sysPara);

    if(method == 'GET') {
        path += '?' + param;
    }

    var url = 'http://' + config.hostname_test + ":" + config.port_test + path;

    var options = {
        hostname : config.hostname_test,
        port : config.port_test,
        path : path,
        method : method,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
            'enctype':'application/x-www-form-urlencoded'
        }
    };


    if(method == 'DELETE') {
        request({
            uri: {
                protocol:'http:',
                hostname : config.hostname_test,
                port : config.port_test,
                path : path
            },
            method: "DELETE",
            form: {
                bizParam: JSON.stringify(bizParam),
                sysParam: sysPara
            },
            header:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'enctype':'application/x-www-form-urlencoded'
            }
        }, function(error, response, body) {

            console.log(body);

            var success = true;

            var resObj = null;

            if (error) {
                console.log('problem with request: ' + error);
                success = false;
                errorJson.msg = error;
                body = JSON.stringify(errorJson);
            }else {
                try {
                    resObj = JSON.parse(body);
                    success = resObj.success;
                }catch (err) {
                    success = false;
                    body = JSON.stringify(errorJson);
                }
            }

            callback && callback(body,success);
        });

    }else {
        var req = http.request(options,function(response) {
            var bufferHelper = new BufferHelper();

            response.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            }).on('end',function() {
                var body = bufferHelper.toBuffer().toString('utf-8');

                console.log(body);

                var success = true;

                var resObj = null;

                try {
                    resObj = JSON.parse(body);     
                    success = resObj.success;
                }catch (err) {
                    success = false;
                    body = JSON.stringify(errorJson);
                }

                callback && callback(body,success);
            });

        }).on('error', function (e) {
            console.log('problem with request: ' + e.message);
            errorJson.msg = e.message;
            var body = JSON.stringify(errorJson);
            callback && callback(body,false);
        });

        if(method != 'GET') {req.write(param);}

        // console.log(req);
        req.end();

    }

};


//请求其他服务器
module.exports.reqOther = function(param,callback){
    var client = require(param.moduleName);//http或者https

    if(param.method == 'GET') {
        param.path += '?' + param.param;
    }

    var options = {
        hostname : param.hostname,
        port : param.port,
        path : param.path,
        method : param.method,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
            'enctype':'application/x-www-form-urlencoded'
        }
    };
    var req = client.request(options,function(response) {
        var bufferHelper = new BufferHelper();

        response.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        }).on('end',function() {
            var body = bufferHelper.toBuffer().toString('utf-8');

            console.log(body);

            var success = true;

            var resObj = null;

            try {
                resObj = JSON.parse(body);
                success = true;
            }catch (err) {
                success = false;
                body = JSON.stringify(errorJson);
            }

            callback && callback(body,success);
        });

    }).on('error', function (e) {
        console.log('problem with request: ' + e.message);
        errorJson.msg = e;
        var body = JSON.stringify(errorJson);
        callback && callback(body,false);
    });

    if(param.method != 'GET') {req.write(param.param);}
    req.end();
};


function extend() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        // skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }
    // extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }
    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];
                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }
                target[ name ] = copy;
            }
        }
    }
    // Return the modified object
    return target;
};