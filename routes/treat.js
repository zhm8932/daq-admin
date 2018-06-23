/*
* 治疗业务模块  treat
* */

var express = require('express');
var router = express.Router();

var Request = require('../request/treatReq');
var TreatCb = require('../controllers/treatCb');
var System = require('./system');
var Com = require('./com');

//门诊管理
//router.get('/clinic',TreatCb.clinic);
router.get('/clinic',System.loginRequired,Request.get_clinic_list,TreatCb.clinic);
router.get('/clinic/detail(/:id)?',System.loginRequired,Com.get_city_all,Request.get_clinic_detail,TreatCb.get_clinic_detail);
router.get('/clinic/update/:id',System.loginRequired,Com.get_city_all,Request.get_hospital_time,Request.get_clinic_detail,TreatCb.render_updata_clinic_detail);
router.post('/clinic/update',System.loginRequired,Request.updata_clinic_detail,TreatCb.updata_clinic_detail);
router.put('/clinic/one/statue',System.loginRequired,Request.updata_clinic_statue,TreatCb.updata_clinic_statue);
router.get('/clinic/add',Com.get_hospital_all,Com.get_department,Com.get_city_all,TreatCb.render_clinic_add);
router.post('/clinic/add',System.loginRequired,Com.get_city_all,Request.add_clinic);
router.post('/clinic/set_hospital_time',System.loginRequired,Request.set_hospital_time);
router.get('/clinic/get_hospital_time',System.loginRequired,Request.get_hospital_time);

//医生管理
router.get('/doctor',System.loginRequired,Com.get_hospital_all,Com.get_doctor_title,Request.get_doctor_list,TreatCb.render_doctor_list);
router.get('/doctor/detail/:id',System.loginRequired,Request.get_doctor_detail,Request.get_account_detail,TreatCb.render_doctor_detail);
router.get('/doctor/update/:id',System.loginRequired,Com.get_hospital_all_enable,Com.get_doctor_title,Request.get_doctor_detail,Com.get_department,TreatCb.render_update_doctor_detail);
router.post('/doctor/update',Request.update_doctor_detail,TreatCb.update_doctor_detail);
router.post('/doctor/get_department_web',Request.get_department_web);   //前端获取科室信息

router.get('/doctor/add',Com.get_hospital_all_enable,Com.get_department,Com.get_doctor_title,TreatCb.render_doctor_add);
// router.post('/doctor/add',Request.doctor_add,TreatCb.render_doctor_cb)
router.post('/doctor/add',Request.doctor_add);

router.put('/doctor/change_doctorStatus',Request.get_clinic_detail,Request.change_doctorStatus);
router.post('/doctor/add_doctorRecommend',Request.add_doctorRecommend);
router.post('/doctor/delete_doctorRecommend',Request.delete_doctorRecommend);

router.post('/doctor/add_doctorConsult',Request.add_doctorConsult);
router.delete('/doctor/delete_doctorConsult',Request.delete_doctorConsult);
router.put('/doctor/charge_doctor',Request.charge_doctor);

//前端获取医院门诊信息
router.post('/doctor/get_hospital_area',System.loginRequired,Com.get_hospital_area);


router.get('/scheduling',function (req,res,next) {
    res.render('treat/scheduling',{
        title:'治疗业务_排班信息',
        content:'排班信息页面内容'
    })
});

router.get('/register(/list/:status)?',System.loginRequired,Com.get_hospital_all,Request.get_register_list,TreatCb.render_register_list);
router.get('/register/detail/:reservationId',System.loginRequired,Com.get_hospital_all,Com.get_doctor_title,Request.get_register_detail,TreatCb.render_register_detail);
router.put('/register/add_remark',Request.add_remark);
router.put('/register/refund_register',Request.refund_register);
router.put('/register/add_register',Request.add_register);
module.exports = router;