//排班系统
var fs = require('fs');
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var qs = require('querystring');
var moment = require('moment');
var dateRange = require('../lib/dateRange')


exports.get_scheduling_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var date =[];
    var d1 = new Date();
    var d2 = new Date(d1);
    d2.setDate(d1.getDate()-6);
    var startDate= moment(d2).format('YYYY-MM-DD');
    var endDate= moment(d1).format('YYYY-MM-DD');
    var weeks = dateRange.getWeeks({
        curWeek:true
    })

    console.log('query:',query)
    var dayLen = 7;
    if(query.startDate){
        date = query.startDate.split(' - ');
        weeks = dateRange.getWeeks({
            curWeek:true,
            startDate:date[0]||'2016-06-13'
        })
        console.log("weeks::::",weeks)

        var startDay = moment(date[0].split('-').join(' ,'));
        var endDay = moment(date[1].split('-').join(' ,'));

        dayLen = endDay.diff(startDay, 'days')+1// 1

        console.log("b.diff(a, 'days'):",endDay.diff(startDay, 'days'))




    }
    // console.log('query:',query);
    // console.log('date:',date);

    var weekdays =weeks.curWeekDays;

    // console.log("dayLen:",dayLen)
    // console.log("weekdays:",weekdays)
    weekdays.length = dayLen;
    res.locals.weekdays = weekdays;
    req.weekdays = weekdays;

    // console.log('weeks.curWeekDays:',weeks.curWeekDays)

    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "startDate": date[0]||weeks.wStartDate,
        "endDate": date[1]||weeks.wEndDate,
        "hospitalId":query.hospitalId||'',
        "doctor":query.doctor||''
    }
    // util.ajax('GET',api.SchedulePagePlus,req, bizParam,function (data,success) {
    util.ajax('GET',api.SchedulePageFromcrm,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next();

    });
}
exports.get_stop_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "startDate": query.startDate||moment().format('YYYY-MM-DD'),
        "doctor":query.doctor||''
    }
    for(var key in query){
        if(query[key]){
            bizParam[key] = query[key]
        }
    }
    util.ajax('GET',api.ScheduleServicePagePlus,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next();

    });
}

exports.stop_server = function (req,res,next) {
    var body = req.body;
    var bizParam = body;
    util.ajax('PUT',api.ScheduleStop,req, bizParam,function (data,success) {
        res.send(data);

    });
}

exports.get_numbers_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "hospitalId":query.hospitalId||'',
        "doctor":query.doctor||''
    }
    util.ajax('GET',api.RegsourceStatusPagePlus,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next();

    });
};
exports.set_numbers = function (req,res,next) {
    var body = req.body;
    var bizParam = {
        "command":body
    };
    util.ajax('POST',api.RegsourceAddbatch,req, bizParam,function (data,success) {
        res.send(data);

    });
}

exports.set_numbers_batch = function (req,res,next) {
    var body = req.body;
    console.log("body:::",body)
    var bizParam = {
        "command":body.serializeObj
    };
    util.ajax('put',api.RegsourceStatusPutbatch,req, bizParam,function (data,success) {
        res.send(data);

    });
}

exports.get_template = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
    }
    util.ajax('get',api.RegsourceTemppage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next();

    });
}

exports.get_one_template = function (req,res,next) {
    console.log('第二')
    var templateId = req.query.templateId
    var doctorId = req.params.doctorId
    var bizParam = {
        templateId:templateId
    }
    console.log("templateId:",templateId)
    console.log("req.query:",req.query)
    if(templateId){
        util.ajax('get',api.RegsourceTempGet,req, bizParam,function (data,success) {
            var json = JSON.parse(data);
            req.get_one_template = json;
            res.locals.get_one_template_all = json;
            res.locals.get_one_template = json.data;
            res.locals.get_one_template_success = json.success;
            next();
        });
    }else{
        next();
    }



}


exports.update_template = function (req,res,next) {
    var body = req.body;
    console.log("body:::",body)
    var bizParam = {
        "command": body
    }
    util.ajax('put',api.RegsourceTempUpdate,req, bizParam,function (data,success) {
        res.send(data);
    });
}
exports.add_template = function (req,res,next) {
    var body = req.body;
    console.log("body:::",body)
    var bizParam = {
        "command": body
    }
    util.ajax('post',api.RegsourceTempAdd,req, bizParam,function (data,success) {
        res.send(data);
    });
}
exports.get_period = function (req,res,next) {
    var CONST = require('../lib/const')
    var periodArr = CONST.periodArr;
    console.log("periodArr:",periodArr)
    res.send({
        success:true,
        data:periodArr
    })

}
exports.get_numbers_detail = function (req,res,next) {
    console.log('第三')
    var id = req.params.id
    var body = req.body;
    var query = req.query;
    console.log("query:",query)
    var bizParam = {
        "doctorId":id||query.doctorId,
        "week":query.week||'1'
    }
    if(req.get_one_template){
        console.log("222222222222")
       next()
    }else {
        console.log("3333333")
        util.ajax('get',api.RegsourceGetByidByweek,req, bizParam,function (data,success) {
            var json = JSON.parse(data);
            res.locals.get_numbers_detail_success = json.success;
            if(json.success){
                res.locals.get_numbers_detail = json.data;
            }
            if(query.bSend){
                res.send(json)
            }else{
                next();
            }


        });
    }

}

exports.add_schedule_batch = function (req,res,next) {
    var body = req.body;
    console.log("body:::",body)
    var bizParam = {
        "command":body
    };
    util.ajax('post',api.ScheduleAddBatch,req, bizParam,function (data,success) {
        res.send(data);

    });
}