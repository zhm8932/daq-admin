/*
 * 系统管理路由  user
 * */
// var config = require('../config');
var resourceReq = require('../request/resourceReq');
var pageEleConfig = require('../config/pageEleConfig');
var roleReq = require('../request/roleReq');
var url = require('url');

exports.loginRequired = function(req,res,next){
    var _user = req.cookies.userAllInfo;
    //console.log('_user:',_user)
    console.log('登录控制器')

    if(!_user){
        return res.redirect('/login')
    }
    var userAllInfo = req.cookies.userAllInfo;
    var operatorId = userAllInfo.accountCommon.id;
    var account = userAllInfo.accountCommon.account;
    req.operator = {
        operatorId:operatorId||'1',
        account:account||'admin'
    }
    next()
};

// exports.CheckUrlAuthority = function(req,res,next){
//     resourceReq.CheckUrlAuthorityByAcc(req,function(data,success){
//         if(success){
//             var json = JSON.parse(data);
//             if(json.access){
//                 return next();
//             }
//         }
//         res.json(data);
//     });
// };

exports.adminRequired = function(req,res,next){
    var user = req.session.user
    if(user.role <=10 ){
        return res.redirect('/signin')
    }
    next()
}
exports.signinRequired = function(req,res,next){
    var user = req.session.user
    if(!user){
        return res.redirect('/signin')
    }
    next()
}

exports.adminRequired = function(req,res,next){
    var user = req.session.user
    if(user.role <=10 ){
        return res.redirect('/signin')
    }
    next()
}


exports.getCurrentUser = function(req,res,next){
    var _user = req.cookies.userAllInfo;

    if(!_user){
        res.redirect('/login')
    }else{
        req.query.user = _user.accountCommon.id;
    }
    next()
}


exports.judgeEleAuthority = function(req,res,next){
    var urlPathname = url.parse(req.url).pathname;

    // console.log("urlPathname:",urlPathname)
    for(var path in pageEleConfig){
        var newPath = '';
        // console.log("path:",path)
        path.indexOf('*') >= 0? newPath = path.substring(0,path.indexOf('*')) : newPath = path;

        if(urlPathname.indexOf(newPath) === 0){
            req.elementsList = pageEleConfig[path];
            break;
        }
    }

    if(req.elementsList){
        roleReq.CheckEleAuthorityByRole(req, function (data, success) {
            res.locals.eleAuthority = JSON.parse(data).data;
            next();
        });
    }else{
        next();
    }
};