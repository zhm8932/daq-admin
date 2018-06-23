/**
 * Created by James on 16/4/11.
 */

var jade = require('jade');
var fs = require('fs');
var config = require('../config');
var uploadFile = require('./uploadFile');

exports.staticize = function (path, options, des, fileName, fn) {
    options.server_img_path = config.server_img_path;
    options.server_file_path = config.server_file_path;
    options.req_domain_name = config.req_domain_name;
    jade.renderFile(path, options, function (error, html) {
        if (html) {
            fs.writeFileSync(des, html, 'utf8');
            var data = uploadFile.uploadFile({
                fileType:3,
                fileName: fileName,
                businessId: 41001,
                filePath: des,
                callback:function(data,success){
                    fn && fn(data,success);
                }
            });
        } else {
            console.log(error);
            var data = {success:false,msg:error.message,data:{}};
            fn && fn(JSON.stringify(data),false);
        }
    });
};





