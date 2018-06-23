var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');//如果要使用cookie，需要显式包含这个模块
var bodyParser = require('body-parser') //用于表单提交
// var mongoose = require('mongoose');

var session = require('express-session')  //如果要使用session，需要单独包含这个模块 保存用户登录状态
var redis = require('redis');
var redisStore = require('connect-redis')(session);

var config = require('./config');
var fs = require('fs');
// var ejs = require('ejs');
var locals = require('./lib/const');
var app = express();

var ueditor = require("ueditor");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
//app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: true }))  //加载解析urlencoded请求体的中间件
// app.use(bodyParser.json())   //加载解析json的中间件
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));


app.use(express.static(path.join(__dirname, 'public')));
var redisClient = redis.createClient(6379,config.options.host, {});
// redisClient.auth(options.pass);
// console.log("options:",options);

redisClient.on("error", function (err) {
    console.log(err);

});

redisClient.on('ready',function(err){
    console.log('ready:Redis链接成功');
    console.log("config.options:",config.options)
});


//保存用户登录状态
app.use(cookieParser());//express.sessions 使 能够正常运转

app.use(session({
    name:"douanquan.manager.sid",
    store: new redisStore(config.options),
    secret: config.sessionSecret,
    cookie:{maxAge:12*60*60*1000,httpOnly:true}
}));
app.locals.moment = require('moment'); //本地模板中引入moment方法
app.locals.query = '';
app.locals.server_file_path = config.server_file_path;
app.locals.server_img_path = config.server_img_path;
app.locals.imgDomain = config.imgDomain;

app.locals.CONST = locals;

// app.use(function(req,res,next){
//     var menuPath = path.resolve(__dirname,'./menuData.json');
//     fs.readFile(menuPath,function(err,data){
//         if (err) throw err;
//         var data = JSON.parse(data.toString());
//         app.locals.menuData = data;
//         next()
//     })
// });

//配置开发环境
if('development'===app.get('env')){
    app.set('showStackError',true)
    //app.use(express.logger(':method :url :status'))  //打印请求状态等信息
    app.use(morgan(':method :url :status'))  //打印请求状态等信息
    app.locals.pretty = true  //格式化页面内容
    // mongoose.set('debug',true)  //

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var routes = require('./routes/index');
var activity = require('./routes/activity');
var screening = require('./routes/screening');
var treats = require('./routes/treat');
var users = require('./routes/user');
var kepu = require('./routes/kepu');
var interacts = require('./routes/interact');
var scheduling = require('./routes/scheduling');
var role = require('./routes/role');
var resource = require('./routes/resource');
var systems = require('./routes/systems');
var dataDic = require('./routes/dataDic');


app.use('/', routes);
app.use('/activity', activity);//活动中心
app.use('/screening', screening);//治疗业务
app.use('/treats',treats);//治疗业务
app.use('/users',users);//用户管理
app.use('/kepu',kepu);//治疗业务
app.use('/interacts',interacts);//互动管理
app.use('/scheduling',scheduling);//排班管理
app.use('/role',role);//角色管理
app.use('/resource',resource);//资源管理
app.use('/systems',systems);//系统管理
app.use('/dataDic',dataDic);//数据字典

app.use("/libs/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        console.log("imgname:",imgname)
        var img_url = '/images/ueditor/' ;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/libs/ueditor/nodejs/config.json');
    }
}));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log('4444444444')
    console.log(err)
    next(err);
});



// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = app;