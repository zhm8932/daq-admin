/*
 * 生产环境配置
 * */

var config = {
    '/kepu/detail':['ArticleAssoAdd','ArticleAssoDelete','ArticleEdit'],
    '/kepu/add':['ArticleNewDraft','ArticleNewPublish'],
    '/kepu/modifyView':['ArticleNewDraft','ArticleNewPublish'],
    '/kepu/search':['ArticleAdd','ArticleSearch','ArticleRecommend','ArticleCancelRecommend','ArticlePublish','ArticleEdit','ArticleCancelPublish'],
    '/resource/element':['ResourceEleAdd','ResourceEleUpdate','ResourceEleDel','ResourceEleSearch'],
    '/resource/url':['ResourceUrlAdd','ResourceUrlUpdate','ResourceUrlDel','ResourceUrlSearch'],
    '/resource/menu':['ResourceMenuAdd','ResourceMenuUpdate','ResourceMenuDel','ResourceMenuStateUpdate'],
    '/systems/role':['RoleAdd','RoleUpdate','RoleDel','RoleSearch','RoleAssignMenu','RoleAssignUrl','RoleAssignEle'],
    '/systems/user':['SystemUserSearch','SystemUserAdd','SystemUserUpdate','SystemUserDel','SystemUserAssignRole','SystemUserUpdatePsd','SystemUserForbidden','SystemUserEnable'],
    '/dataDic/root/view':['DataDicRootAdd','DataDicRootUpdate','DataDicRootDel','DataDicRootUpdateState'],
    '/dataDic/biz/view':['DataDicBizAdd','DataDicBizUpdate','DataDicBizDel','DataDicBizUpdateState','DataDicUpdateOnline'],
    '/interacts/consultUser':['ChatHistorySearch','ChatWithOthers'],
    '/screening/meal*':['MealEnableList','MealInAuditList','MealDisableList','MealAuditNoPassedList','MealAuditPass','MealAuditNoPass','MealEdit','MealDisable','MealTop','MealEnable'],
    '/screening/order*':['OrderHasPaidList','OrderNotPaidList','OrderInRefundList','OrderHasRefundList','OrderHasCancelList','OrderSearch','OrderApplyRefund','OrderCancelRefund','OrderConfirmRefund'],
    '/screening/booking*':['BookingUnTreatedList','BookingInTreatedList','BookingHasTreatedList','BookingHasCancelList','BookingSerch','BookingSampling','BookingDeliver','BookingClinicRegister','BookingCancel','BookingChageStatus','BookingSampleStorage'],
    '/treats/clinic':['ClinicSearch','ClinicAdd','ClinicEdit','ClinicOpen','ClinicClose'],
    '/treats/doctor':['DoctorSearch','DoctorAdd','DoctorEdit','DoctorEnable','DoctorDisable','DoctorOpenConsult','DoctorCloseConsult','DoctorRecommend','DoctorCancelRecommend','DoctorCharge'],
    '/treats/register':['RegisterNotRegisteredList','RegisterHasRegosreredList','RegisterOverdueList','RegisterCancelList','RegisterInRefundList','RegisterHasRefundList','RegisterHasDeleteList','RegisterSearch','RegisterClinicRegister','RegisterClinicRefund'],
    '/activity/index*':['BannerIndexAdd','BannerIndexEdit','BannerIndexRelease','BannerIndexClose','BannerIndexRerelease','BannerIndex_2140010948244539022','BannerIndex_2140012014350639002','BannerIndex_2140012017549908010','BannerIndex_2140012020391025014','BannerIndex_2140011010455652016','BannerIndex_2140011111336224044','BannerIndex_2140010947444103020'],
    '/activity/health*':['BannerHealthAdd','BannerHealthEdit','BannerHealthRelease','BannerHealthClose','BannerHealthRerelease'],
    '/activity/coupons':['CouponSearch','CouponStop','CouponDetail'],
    '/users/account/detail*':['AccountEnable','AccountDisable','AccountAvatar','AccountOrderList','AccountBookList','AccountRegisterList','AccountContactList','AccountAddressList','AccountChatsList'],
    '/users/account':['AccountSearch','AccountDetail'],
    '/scheduling/list':['SchedulingSearch']
};

module.exports = config;