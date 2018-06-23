seajs.config({
    // Sea.js 的基础路径
    base: "js",
    // 别名配置
    alias: {
        //"jquery": "./libs/jquery.js",
        "jquery": "/js/libs/1.9.1/jquery.min.js",
        "utils": "./utils.js",
       // "strophe":"./libs/sdk/strophe.js",
        "bootstrap":"../libs/bootstrap/dist/js/bootstrap.js",
        "moment":'/js/libs/moment',
        "daterangepicker":'/js/libs/daterangepicker',
        "DateTimePicker":'/js/libs/DateTimePicker',
        "swipebox":'/js/libs/jquery.swipebox'
    }
});