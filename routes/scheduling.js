/*
*排班系统  scheduling
* */
var express = require('express');
var router = express.Router();
var SchedulingCb = require('../controllers/schedulingCb');
var Request = require('../request/schedulingReq');
var TreateRequest = require('../request/treatReq');
var Com = require('./com');
var System = require('./system');

//排班 interact
router.get('/list',System.loginRequired,Com.get_hospital_all,Request.get_scheduling_list,SchedulingCb.render_scheduling_list);

//号源管理分页
router.get('/numbers',System.loginRequired,Com.get_hospital_all,Request.get_numbers_list,SchedulingCb.render_numbers_list);


//停诊管理分页
router.get('/stopup',System.loginRequired,Com.get_hospital_all,Request.get_stop_list,SchedulingCb.render_stop_list);
router.put('/stopup/stop_server',System.loginRequired,Request.stop_server);

router.get('/numbers/template',System.loginRequired,Request.get_template,SchedulingCb.render_template);

router.get('/numbers/choose_template',System.loginRequired,Request.get_template,SchedulingCb.render_choose_template);
// router.get('/numbers/choose_template/:templateId',Request.get_one_template,SchedulingCb.render_choose_template);
router.get('/numbers/choose_template/:templateId',System.loginRequired,Request.get_one_template,SchedulingCb.render_choose_template);
router.put('/numbers/update_template',System.loginRequired,Request.update_template);
router.put('/numbers/add_template',System.loginRequired,Request.add_template);

router.get('/numbers/set_numbers/:id',System.loginRequired,TreateRequest.get_doctor_detail,Request.get_one_template,Request.get_numbers_detail,SchedulingCb.render_set_numbers);
router.get('/numbers/get_numbers_detail',System.loginRequired,Request.get_numbers_detail);
router.post('/numbers/set_numbers',System.loginRequired,Request.set_numbers)
router.get('/numbers/get_period',System.loginRequired,Request.get_period);
router.post('/numbers/set_numbers_batch',System.loginRequired,Request.set_numbers_batch)
router.post('/numbers/add_schedule_batch',System.loginRequired,Request.add_schedule_batch)


module.exports = router;