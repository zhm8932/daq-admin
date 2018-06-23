define(function (reuire,exports,module) {
    var hostname = window.location.hostname;

    var appkey = hostname == "localhost" || hostname == "120.76.24.129" || hostname=="beta.manager.douanquan.com" ? 'jihuiduo#douanquan' : "jihuiduo#proddouanquan";

    console.log("hostname:",hostname,"appkey:",appkey)

    var config = {
        /*
         The global value set for xmpp server
         */
        xmppURL: 'im-api.easemob.com',
        /*
         The global value set for Easemob backend REST API
         "http://a1.easemob.com"
         */
        apiURL: 'https://a1.easemob.com',
        /*
         连接时提供appkey
         */
        // appkey: "jihuiduo#douanquan",
        // appkey: "jihuiduo#proddouanquan",  //正式环境
        appkey: appkey,
        /*
         * 是否使用https
         */
        https : true,
        /*
         * 是否使用多resource
         */
        multiResources: false,

        md5Secret:'897EFEDB01661BA0004F186F17DDE609'

    }



    module.exports=config


})
// Easemob.im.config = {
//     /*
//         The global value set for xmpp server
//     */
//     xmppURL: 'im-api.easemob.com',
//     /*
//         The global value set for Easemob backend REST API
//         "http://a1.easemob.com"
//     */
//     apiURL: 'https://a1.easemob.com',
//     /*
//         连接时提供appkey
//     */
//     appkey: "easemob-demo#chatdemoui",
//     /*
//      * 是否使用https
//      */
//     https : true,
//     /*
//      * 是否使用多resource
//      */
//     multiResources: false
//
// }
