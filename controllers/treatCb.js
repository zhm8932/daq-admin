var request = require('../request/treatReq');
var qs = require('querystring')

exports.clinic = function (req,res) {
    var json = req.json
    res.locals.success = json.success
    if(json.success){
        var query = req.query;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr?queryStr+='&':'';
        res.locals.pagecount = json.data.pageCount;
        res.render('treat/clinic',{
            title:'治疗业务_门诊管理',
            data:json.data.data,
            hospitalName:req.query.hospitalName,
            telephone:req.query.telephone

        })
    }else{
        res.render('treat/clinic',{
            title:'治疗业务_门诊管理',
            data:json
        })
    }

}
exports.get_clinic_detail = function (req,res) {
    var json = req.json;
    console.log('data:',json)
    console.log('success:',json.success)
    res.locals.success = json.success
    if(json.success){
        res.render('treat/clinic_detail',{
            title:'治疗业务_门诊管理_门诊详情',
            data:json.data
        })
    }else{
        res.render('treat/clinic_detail',{
            title:'治疗业务_门诊管理_门诊详情',
            data:JSON.stringify(json),
        })
    }
}
exports.render_updata_clinic_detail = function(req,res){
    var json = req.json;
    // var get_hospital_time = req.get_hospital_time;
    res.locals.success = json.success;
    // var get_hospital_time_success = res.locals.get_hospital_time_success =  get_hospital_time.success;
    // if(get_hospital_time_success){
    //     res.locals.get_hospital_time=get_hospital_time.data
    // }
    if(json.success){
        res.render('treat/clinic_update_detail',{
            title:'治疗业务_门诊管理_编辑',
            data:json.data
        })
    }else{
        res.render('treat/clinic_update_detail',{
            title:'治疗业务_门诊管理_编辑',
            data:JSON.stringify(json)
        })
    }
}
exports.updata_clinic_detail = function(req,res){
    var json = req.json
    res.locals.success = json.success
    if(json.success){
        console.log('success:',json)
        res.locals.success = json.success
        res.redirect('/treats/clinic')
    }
}

exports.updata_clinic_statue = function(req,res){
    var json = req.json
    res.json(json)
}

exports.render_clinic_add = function(req,res){
    var get_doctor_title=req.get_doctor_title
    var get_hospital_all=req.get_hospital_all
    var get_department=req.get_department
    res.render('treat/clinic_add',{
        title:'新增门诊',
        get_doctor_title:get_doctor_title,
        get_hospital_all:get_hospital_all,
        get_department:get_department
    })
}
exports.render_clinic_cb = function(req,res){
    var json = req.json
    if(json.success){
        console.log('success:',json)
        res.locals.success = json.success
        res.redirect('/treats/clinic')
    }
}

exports.render_doctor_list = function (req,res) {
    var json = req.json
    var get_doctor_title = req.get_doctor_title ;
    var get_department = req.get_department
    var get_hospital_all = req.get_hospital_all
    res.locals.success = json.success;
    if(json.success){
        var query = req.query;
        res.locals.currentpage = query.page||1;
        delete query.page;
        var queryStr = qs.stringify(query)
        queryStr = queryStr?queryStr+='&':''
        res.locals.query = queryStr;
        res.locals.pagecount = json.data.pageCount;


        res.render('treat/doctor',{
            title:'治疗业务_医生管理',
            data:json.data.data,
            get_doctor_title:get_doctor_title,
            get_department:get_department,
            get_hospital_all:get_hospital_all,
            queryObj:query,
            hospitalName:req.query.hospitalName||'',
            telephone:req.query.telephone||''
        })
    }else{
        res.render('treat/doctor',{
            title:'治疗业务_医生管理',
            data:json
        })
    }

    //request.getDoctor(req,res,function(json,success){
    //    console.log('data:',json)
    //    console.log('success:',json.success)
    //
    //})
}

exports.render_doctor_detail = function (req,res) {
    var json = req.json
    if(json.success){
        res.render('treat/doctor_detail',{
            title:'治疗业务_医生管理_医生详情',
            data:json.data
        })
    }else{
        res.render('treat/doctor_detail',{
            title:'治疗业务_医生管理_医生详情',
            data:JSON.stringify(json)
        })
    }
}


exports.render_update_doctor_detail = function(req,res){
    var json = req.json
    var get_hospital_all = req.get_hospital_all;
    var get_doctor_title = req.get_doctor_title;
    var get_department = req.get_department
    if(json.success){
        console.log('22222222')
        res.render('treat/doctor_update_detail',{
            title:'治疗业务_医生管理_医生详情',
            data:json.data,
            get_hospital_all:get_hospital_all,
            get_doctor_title:get_doctor_title,
            get_department:get_department
        })

    }else{
        console.log('33333333')
        res.render('treat/doctor_update_detail',{
            title:'治疗业务_医生管理_医生详情',
            data:JSON.stringify(json),
            get_hospital_all:get_hospital_all,
            get_doctor_title:get_doctor_title
        })

    }
    //res.json(json)

}

exports.update_doctor_detail = function(req,res){
    var json = req.json
    console.log('修改医生信息')
    if(json.success){
        res.redirect('/treats/doctor')
    }
}

exports.render_doctor_add = function(req,res){
    var get_doctor_title=req.get_doctor_title
    var get_hospital_all=req.get_hospital_all
    var get_department=req.get_department
    res.render('treat/doctor_add',{
        title:'新增医生',
        get_doctor_title:get_doctor_title,
        get_hospital_all:get_hospital_all,
        get_department:get_department
    })
}

exports.render_doctor_cb = function(req,res){
    var json = req.json
    console.log('新增')
    if(json.success){
        res.redirect('/treats/doctor')
    }
    
}

exports.render_register_list = function (req,res,next) {
    var json = req.json;
    var query = req.query;
    res.locals.success = json.success;
    res.locals.queryObj = query;
    if(json.success) {
        res.locals.pagecount = json.data.pageCount;
        res.locals.currentpage = query.page || 1;
        delete query.page;
        var queryStr = qs.stringify(query);
        queryStr = queryStr ? queryStr += '&' : '';
        res.locals.query = queryStr;
        res.render('treat/register', {
            title: '治疗业务_挂号订单',
            content: '挂号订单页面内容',
            data:json.data.data
        })
    }else{
        res.render('treat/register', {
            title: '治疗业务_挂号订单',
            content: '挂号订单页面内容',
            data:json
        })
    }
}
exports.render_register_detail = function (req,res) {
    var json = req.json
    if(json.success){
        res.render('treat/register_detail',{
            title:'治疗业务_挂号订单_挂号详情',
            data:json.data
        })
    }else{
        res.render('treat/register_detail',{
            title:'治疗业务_挂号订单_挂号详情',
            data:JSON.stringify(json)
        })
    }
}