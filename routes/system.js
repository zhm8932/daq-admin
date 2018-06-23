/*
 * 权限控制  user
 * */
exports.loginRequired = function(req,res,next){
    var _user = req.session.userInfo;

    if(!_user){
        return res.redirect('/login')
    }
    var operatorId = _user.userAllInfo.accountCommon.id;
    var account = _user.userAllInfo.accountCommon.account;
    req.operator = {
        operatorId:operatorId||'1',
        account:account||'admin'
    }
    next()
}

exports.adminRequired = function(req,res,next){
    var user = req.session.userInfo;
    if(user.role <=10 ){
        return res.redirect('/signin')
    }
    next()
}
exports.signinRequired = function(req,res,next){
    var user = req.session.userInfo;
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
    var _user = req.session.userInfo;

    if(!_user){
        res.redirect('/login')
    }else{
        req.query.user = _user.userAllInfo.accountCommon.id;
    }
    next()
};
