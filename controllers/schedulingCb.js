var qs = require('querystring');
var dateRange = require('../lib/dateRange');
var moment = require('moment');
// moment.locale('fr')
moment.defineLocale('zh-cn', {
    // months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    // monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    // weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_')
    // weekdaysMin : '日_一_二_三_四_五_六'.split('_')}
})



function sortNumber(a,b)
{
    return a.start - b.start
}

exports.render_scheduling_list = function(req,res){
    var json = req.json;
    var query = req.query;
    var weekdays = req.weekdays
    res.locals.success = json.success;
    res.locals.queryObj = query;

    // console.log("weekdays999:",weekdays)

    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.query = queryStr;
        var data = json.data.data;

        // console.log("weekdays:",weekdays)


        // weekdays.forEach(function (day,j) {
        //     console.log("day:",moment(day).format('dddd'))
        // })

        data.forEach(function (item,index) {
            if(item.scheduleItems){
                // item.scheduleItems.forEach(function (arr,i) {
                //     // console.log("format('YYYY-MM-DD'):",i,moment(arr.start).format('YYYY-MM-DD HH:mm'));
                // })
                item.scheduleItems.sort(function (a,b) {
                    return a.start-b.start   //按起始时间排序
                })


                weekdays.forEach(function (day,j) {
                    // console.log("day::",day)
                    item[day] = item.scheduleItems.filter(function (marr,arr2) {
                        // console.log("marr:",marr)
                        // console.log("arr2:",arr2)
                        return moment(marr.start).format('YYYY-MM-DD')==day
                    })
                    // delete item.scheduleItems
                })


                // console.log("scheduleItems1:",scheduleItems1)
                // console.log("item.scheduleItems:",item.day)

            }
        })


        console.log("data:",JSON.stringify(data))
        res.render('scheduling/list',{
            title:'系统排班_排班管理',
            content:'排班管理页面内容',
            data:data
        });
    }else{
        res.render('scheduling/list',{
            title:'系统排班_排班管理',
            content:'排班管理页面内容',
            data:json
        });
    }

}

//排班第一版
// exports.render_scheduling_list = function(req,res){
//     var json = req.json;
//     var query = req.query;
//     var weekdays = req.weekdays
//     res.locals.success = json.success;
//     res.locals.queryObj = query;
//
//     console.log("weekdays999:",weekdays)
//     if(json.success){
//         res.locals.pagecount = json.data.pageCount;
//         res.locals.currentpage = query.page||1;
//         delete query.page;
//         var queryStr = qs.stringify(query);
//         queryStr = queryStr?queryStr+='&':'';
//         res.locals.query = queryStr;
//         var data = json.data.data;
//         data.forEach(function (item,index) {
//
//             if(item.regDayList){
//                 item.regDayList.forEach(function (arr,i) {
//                     // console.log('arr:',arr)
//                     arr.day = weekdays[i]
//                 })
//             }
//         })
//
//         res.render('scheduling/list',{
//             title:'系统排班_排班管理',
//             content:'排班管理页面内容',
//             data:data
//         });
//     }else{
//         res.render('scheduling/list',{
//             title:'系统排班_排班管理',
//             content:'排班管理页面内容',
//             data:json
//         });
//     }
//
// }

exports.render_stop_list =function (req,res,next) {
    var json = req.json;

    var query = req.query;
    res.locals.success = json.success;
    res.locals.queryObj = query;
    if(json.success) {
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.query = queryStr;

        res.render('scheduling/stop_list', {
            title: '系统排班_停诊管理',
            content: '排班管理页面内容',
            data:json.data.data
        })
    }else{
        res.render('scheduling/stop_list', {
            title: '系统排班_停诊管理',
            content: '排班管理页面内容',
            data:json
        })
    }
}

exports.render_numbers_list = function(req,res){
    var json = req.json;
    var query = req.query;
    res.locals.success = json.success;
    res.locals.queryObj = query;
    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.query = queryStr;

        res.render('scheduling/numbers',{
            title:'系统排班_号源管理',
            data:json.data.data
        });
    }else{
        res.render('scheduling/numbers',{
            title:'系统排班_号源管理',
            data:json
        });
    }

}

exports.render_set_numbers = function (req,res,next) {
    var json = req.json;
    res.locals.success = json.success;
    if(json.success){
        res.render('scheduling/set_numbers',{
            title:'系统排班_号源设置',
            content:'排班管理页面内容',
            data:json.data
        });
    }else{
        res.render('scheduling/set_numbers',{
            title:'系统排班_号源设置',
            content:'排班管理页面内容',
            data:JSON.stringify(json)
        });
    }

}
exports.render_template = function (req,res,next) {
    var json = req.json;
    var query = req.query;
    res.locals.success = json.success;
    res.locals.queryObj = query;
    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.render('scheduling/template', {
            title: '系统排班_模板管理',
            content: '排班管理页面内容',
            data:json.data.data
        })
    }else{
        res.render('scheduling/template', {
            title: '系统排班_模板管理',
            content: '排班管理页面内容',
            data:json
        })
    }
}

exports.render_choose_template = function (req,res,next) {
    var json = req.json;
    console.log("render_choose_template:",json)
    var query = req.query;
    res.locals.doctorId = query.id

    console.log("query.id:",query.id)
    res.locals.success = json.success;
    res.locals.queryObj = query;
    if(json.success){
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';

        var data = json.data.pageCount?json.data.data:json.data


        res.render('scheduling/choose_template',{
            title:'系统排班_模板选择',
            data:data
        })
    }else{
        res.render('scheduling/choose_template',{
            title: '系统排班_模板管理',
            content: '排班管理页面内容',
            data:json
        })
    }

}

