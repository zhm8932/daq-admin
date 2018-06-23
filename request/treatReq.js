// 治疗业务
var util = require('../lib/ajax');
var api = require('../lib/api');
var config = require('../config');
var qs = require('querystring')


exports.get_clinic_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var hospitalName = query.hospitalName||'';
    var telephone = query.telephone||'';
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        "props": '{"hospitalName":"'+hospitalName+'","telephone":"'+telephone+'"}', //签名之前中文不能转码
        "sort":'',
        "order":'',
        "q":''

    }
    util.ajax('GET',api.HospitalPage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next();
        //callback && callback(json,success);
    });
}

exports.get_doctor_list = function (req,res,next) {
    var currentPage = req.query.page||1;
    var hospitalName = req.query.hospitalName||'';
    var telephone = req.query.telephone||'';
    var query = req.query;
    var bizParam = {
        "pageSize": config.pageSize,
        "pageIndex": currentPage,
        //"props": '{"hospitalName":"'+hospitalName+'","telephone":"'+telephone+'"}', //签名之前中文不能转码
        "props": {}, //签名之前中文不能转码
        // "sort":'',
        // "order":'',
        // "q":''
    }
    // console.log("query:",query)

    for(var key in query){
        if(query[key]){
            bizParam.props[key] = query[key]
        }
    }

    if(query.isRecommend){
        // console.log("bizParam:",bizParam)
        bizParam.props.isRecommend ='true';
        bizParam.props.isRecommend=(bizParam.props.isRecommend==query.isRecommend)
    }
    util.ajax('GET',api.DoctorPage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next()
    });
};

exports.get_doctor_detail = function(req,res,next){
    var id = req.params.id
    // console.log('id:',id)
    var bizParam = {
        "doctorId": id
    }
    util.ajax('GET',api.DoctorGet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        //callback && callback(json,success);
        var hospitalId ='';
        var accountId ='';
        if(json.success){
            hospitalId = json.data.hospitalReDepartments[0]?json.data.hospitalReDepartments[0].hospitalId:'';
            accountId =json.data.accountId;
        }

        req.hospitalId = hospitalId;
        req.accountId = accountId;
        req.json = json;
        next()

    });

}
exports.get_account_detail = function(req,res,next){
    var accountId =req.accountId
    console.log('accountId:',accountId)
    var bizParam = {
        "accountId": accountId
    }
    util.ajax('GET',api.AccountDetailGet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.locals.get_account_detail=json;
        if(json.success){
            res.locals.get_account_detail_success=json.success;
            res.locals.get_account_detail = json.data;
        }
        next()

    });

}
exports.update_doctor_detail = function(req,res,next){
    var body = req.body
    // console.log("body:",body)
    var doctorPhoto =JSON.parse(body.doctorPhoto)[0].imageUrl
    var bizParam = {
            "request": {
                rawRequest:{
                    id: body.id,
                    //doctorStatus: 1,
                    doctorPhoto: doctorPhoto,
                    doctorCode: body.doctorCode,
                    telephone: body.telephone,
                    cost: parseFloat((body.cost*100).toFixed(2)),
                    //accountId: '1002',
                    doctorName: body.doctorName,
                    titleId: body.doctorTitle,
                    introduction: body.introduction,
                    skill: body.skill,
                    "hospitalReDepartments": [
                        {
                            "hospitalId": body.hospital,
                            "departmentId": body.department
                        }
                    ]
                }
            }
    }
    // console.log("bizParam:",bizParam)
    util.ajax('PUT',api.DoctorUpdate,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next()

    });
}

exports.doctor_add = function(req,res,next){
    var body = req.body
    // console.log('body:',body)
    // console.log('JSON.parse(body.doctorPhoto):',JSON.parse(body.doctorPhoto))
    var bizParam = {
        "request":{
            "rawRequest":{
                registerUser:{
                    account:body.telephone,
                    password:body.password
                },
                doctorDTO:{
                    doctorStatus: 1,
                    //doctorPhoto: body.doctorPhoto,
                    doctorPhoto: JSON.parse(body.doctorPhoto)[0].imageUrl,
                    doctorCode: '',
                    doctorName: body.doctorName,
                    titleId: body.titleId,
                    telephone:body.telephone,
                    cost: body.cost*100,
                    introduction: body.introduction,
                    skill: body.skill,
                    "hospitalReDepartments": [
                        {
                            "hospitalId": body.hospitalId,
                            "departmentId": body.departmentId
                        }
                    ]
                }

            }
        }

    }
    util.ajax('POST',api.DoctorAdd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        // req.json = json;
        res.json(json)
        //next()
        //callback && callback(json,success);
    });
}

exports.change_doctorStatus =function(req,res,next){
    var body = req.body;
    var bizParam = {
        "doctorId": body.doctorId,
        "doctorStatus":body.doctorStatus
    }

    util.ajax('put',api.DoctordoctorStatuschange,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.json(json);
        //callback && callback(json,success);
    });
}
exports.add_doctorRecommend =function(req,res,next){
    var body = req.body;
    var bizParam = {
        "request":{
            "rawRequest":{
                "doctorId": body.doctorId,
                "recommendType":body.recommendType
            }
        }
    }

    util.ajax('post',api.Doctorrecommendadd,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.json(json)
    });
}

exports.delete_doctorRecommend =function(req,res,next){
    var body = req.body;
    var bizParam = {
        "doctorId": body.doctorId,
        "recommendType":body.recommendType
    }

    util.ajax('delete',api.Doctorrecommendtypedelete,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.json(json)
    });
}


exports.add_doctorConsult =function(req,res,next){
    var body = req.body;
    var bizParam = {
        "consult":{
            "doctorId": body.doctorId,
            "consultType":parseInt(body.consultType)
        }

    }

    util.ajax('post',api.Ddoctorconsultopen,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.json(json)
    });
}
exports.delete_doctorConsult =function(req,res,next){
    var body = req.body;
    var bizParam = {
        "doctorId": body.doctorId,
        "consultType":parseInt(body.consultType)

    }

    util.ajax('delete',api.Doctorconsulttypeclose,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.json(json)
    });
}
exports.get_department_web =function(req,res,next){
    var hospitalId = req.body.hospitalId;
    var bizParam = {
        "request":{
            "rawRequest":{
                "hospitalId": hospitalId
            }
        }
    }

    util.ajax('GET',api.DepartmentAll,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        //console.log("get_department:",json)
        res.json(json)
        //callback && callback(json,success);
    });
}

exports.charge_doctor = function(req,res,next){
    var body = req.body
    var bizParam = {
        "request": {
            rawRequest:body
        }
    }
    console.log("bizParam:",bizParam)
    util.ajax('PUT',api.DoctorUpdate,req, bizParam,function (data,success) {
        res.send(data)

    });
}
exports.get_clinic_detail = function(req,res,next){
    var id = req.params.id||req.query.hospitalid;
    var bizParam = {
        "hospitalId": id
    };
    util.ajax('GET',api.HospitalGet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        if(req.query.hospitalid){
            res.send(json)
        }else{
            next();
        }

        //callback && callback(json,success);
    });
}
exports.add_clinic = function(req,res,next){
    var body = req.body;
    var bizParam = {
        "hospitalDTO":body
    }
    util.ajax('post',api.HospitalAdd,req, bizParam,function (data,success) {
        res.send(data)
        // var json = JSON.parse(data);
        // req.json = json;
        // next()
        //callback && callback(json,success);
    });
}
exports.set_hospital_time = function(req,res,next){
    var requestData = req.body
    var bizParam = requestData;
    util.ajax('POST',api.HospitalTimeSet,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        res.send(json)

    });
}
exports.get_hospital_time = function(req,res,next){
    var query = req.query;
    var hospitalId = req.params.id||query.hospitalId;

    var bSend = query.bSend;
    var timeType = query.timeType;
    console.log("timeType：",timeType)
    var bizParam = {
        "hospitalId":hospitalId,
        "timeType":parseInt(timeType)||2   //	类型：1营业时间 2门诊取样 3上门取样
    }
    res.locals.timeType = timeType;
    util.ajax('get',api.HospitalTimeGetByType,req, bizParam,function (data,success) {
        var json = JSON.parse(data);

        var get_hospital_time_success = res.locals.get_hospital_time_success = json.success;
        if(get_hospital_time_success){
            res.locals.get_hospital_time=json.data
        }else{
            res.locals.get_hospital_time=json
        }

        if(!bSend){
            next()
        }else{
            // res.send(json)
            res.render('treat/clinic_update_sampling_time',{
                data:json.data,
            },function(err, html) {
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    console.log("html:",html)
                    var data = {
                        success:json.success,
                        msg:json.msg,
                        html:html||''
                    }
                    res.send(data);
                }
            });
        }


    });
}

exports.updata_clinic_detail = function(req,res,next){
    var requestData = req.body
    //console.log('requestData:',requestData)
    var bizParam = {
        "request":{
            "rawRequest":requestData
        }

    }
    // var bizParam = {
    //     "request":{
    //         "rawRequest":{
    //             "id": requestData.id,
    //             "address": requestData.address,
    //             "description": requestData.description,
    //             "telephone": requestData.telephone
    //         }
    //     }
    //
    // }
    util.ajax('PUT',api.HospitalUpdate,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next()
        //callback && callback(json,success);
    });
}
exports.updata_clinic_statue = function(req,res,next){
    var requestData = req.body
    //console.log('requestData:',requestData)
    var bizParam = {
        "hospitalId": requestData.id,
        "operatingState": requestData.operatingState
    }
    util.ajax('PUT',api.HospitalOperatingStateUpdate,req, bizParam,function(data,success){
        var json = data
        req.json = json
        next()
        //callback && callback(json,success);
    })
}


exports.get_register_list = function (req,res,next) {
    var query = req.query;
    var currentPage = query.page||1;
    var status = req.params.status||1;
    res.locals.status = status;
    var bizParam = {
        role:2,
        command:{
            "pageSize": config.pageSize,
            "pageIndex": currentPage,
            "status":status
        }

    }

    for(var key in query){
        if(query[key]){
            bizParam.command[key] = query[key]

        }
    }
    console.log("api.ReservationPage:",api.ReservationPage)
    util.ajax('GET',api.ReservationPage,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json
        next();

    });
}
exports.get_register_detail = function(req,res,next){
    var reservationId = req.params.reservationId;
    var bizParam = {
        "reservationId":reservationId,
        "role":2
    };
    util.ajax('get',api.ReservationGetByid,req, bizParam,function (data,success) {
        var json = JSON.parse(data);
        req.json = json;
        next()
    });
}
exports.add_remark = function(req,res,next){
    var body = req.body;
    var bizParam = body;
    util.ajax('PUT',api.ReservationRemarkAdd,req, bizParam,function(data,success){
        res.send(data)
    })
}
exports.refund_register = function(req,res,next){
    var body = req.body;
    var bizParam = body;
    util.ajax('PUT',api.ReservationRefund,req, bizParam,function(data,success){
        res.send(data)
    })
}

exports.add_register = function(req,res,next){
    var body = req.body;
    var bizParam = body;
    util.ajax('PUT',api.ReservationCheck,req, bizParam,function(data,success){
        res.send(data)
    })
}