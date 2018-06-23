//用于全局缓存微信token和ticket

var weixin_jsapi_ticket = '';
var weixin_access_token = '';
var ticketTime = null;
var tokenTime = null;

exports.getToken = function () {
    return weixin_access_token;
};

exports.setToken = function (token, expire_in) {
    if(tokenTime) {
        clearTimeout(tokenTime);
    }

    weixin_access_token = token;

    tokenTime = setTimeout(function () {
        weixin_access_token = '';
    },expire_in*1000);
};

exports.getTicket = function () {
    return weixin_jsapi_ticket;
};

exports.setTicket = function (ticket, expire_in) {
    if(ticketTime) {
        clearTimeout(ticketTime);
    }

    weixin_jsapi_ticket = ticket;

    ticketTime = setTimeout(function () {
       weixin_jsapi_ticket = '';
    },expire_in*1000);
};
