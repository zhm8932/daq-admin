/**
 * Created by James on 16/4/9.
 */

module.exports = {

    Login : "daq.user.admin.login",

    UserDetailPage : "daq.user.detail.page",
    UserDetailGet : "daq.user.detail.get",
    // UserAvatarHistory : "ebusiness.user.avatar.history",
    UserAvatarHistory : "medical.user.avatar.history",
    AccountStatusChange : "daq.user.accountStatus.change",
    HospitalTimeSet:'medical.hospitalTime.set',
    HospitalTimeGetByType:'medical.hospitalTime.getByType',

    QueryDictionaryListByTypeAndLevel : "dictionary.queryDictionaryListByTypeAndLevel",
    QueryDictionaryTreeByType : "dictionary.queryDictionaryTreeByType",

    DictInsert : "dictionary.insertDict",
    DictUpdate : "dictionary.updateDictById",
    UpdateDictState : "dictionary.changeDictionaryState",
    UpdateDictOnlineState : "dictionary.changeDictionaryIsOnline",
    DictDelete : "dictionary.deleteDictByIdBatch",
    BannerFetch : "cms.banner.selectBannerByCategory",
    BannerAdd : "cms.banner.add",
    BannerUpdate : "cms.banner.update",
    BannerDetail : "cms.banner.selectBannerById",
    BannerDelete : "cms.banner.delBanner",

    ArticleDetail : "cms.article.queryArticleById",
    ArticleQuery : "pageQueryArticleByTitleOrContentAndCat",
    ArticleTerminate : "cms.article.delete",
    DeleteArticleAsso : "cms.article.deleteByArticleIdRecommendId",
    AddArticleAsso : "cms.article.recommend.add",
    ArticleCreate : "cms.article.add",
    ArticleChange : "cms.article.update",
    ArticleSearch : "cms.article.pageQueryArticleByTitleOrContent",
    GetArticleBatch : "cms.article.queryArticleByIdBatch",
    ArticleQueryPopularity : "community.statistics.query",
    QueryBannerBatch : "cms.banner.queryBannerByIdBatch",

    GoodsStateChange : "domain.goods.changeGoodsState",
    GoodsPriorityChange : "domain.goods.changeGoodsPriority",
    GoodsQuery : "domain.goods.goodsQueryFacade",
    GoodsDetail : "domain.goods.findGoodsById",
    GoodsCreate : "domain.goods.createGoods",
    GoodsChange : "domain.goods.changeGoods",

    ReservationPageSimpleInfo : "reservation.pageSimpleInfo",
    ReservationQuery : "reservation.queryReservation",
    ReservationTrace : "reservation.queryReservationTrace",

    FileWebToken : "file.webToken",

    //医生
    DoctorAdd:'daq.doctor.add',
    DoctorPage :'daq.medical.doctor.page.forAdmin',
    DoctorGet :'daq.medical.doctor.get.forAdmin',
    DoctorUpdate:'medical.doctor.update',
    DoctordoctorStatuschange:'medical.doctor.doctorStatus.change',
    Doctorrecommendadd:'medical.doctor.recommend.add',
    Doctorrecommendtypedelete:'medical.doctor.recommend.type.delete',
    Ddoctorconsultopen:'medical.doctor.consult.open',
    Doctorconsulttypeclose:'medical.doctor.consult.type.close',
    HospitalPage:'medical.hospital.page.forAdmin',
    HospitalGet :'medical.hospital.get.forAdmin',
    HospitalAll:'medical.hospital.all.list.forAdmin',
    HospitalUpdate:'medical.hospital.update',
    HospitalOperatingStateUpdate:'medical.hospital.operatingState.update',
    // DepartmentAll:'medical.department.all.list',
    DepartmentAll:'medical.department.all.list.forAdmin',
    HospitalAreaList:'medical.hospital.area.list.forAdmin',
    HospitalAdd:'medical.hospital.add',
    AccountDetailGet:'user.account.detail.get',

    PageQueryCoupon:'promotion.pageQueryCoupon',


    //角色管理
    RolePagingQueryRoles:'security.role.pagingQueryRoles',
    RoleCreate:'security.role.createRole',
    RoleChangeRoleProps:'security.role.changeRoleProps',
    RoleTerminateRoles:'security.role.terminateRoles',

    GetRolesByAcc:'security.role.listAllRolesByUser',
    CheckUrlAuthorityByRole:'security.resources.checkUserHasUrlAccessResource',
    
    GetMenuByRole:'security.resources.findMenuResourceByUserAsRole',//查询角色的菜单,用于渲染右侧菜单


    GetAllMenuTreeByRole:'security.resources.findMenuRecTreeSelItByRoleId',//查询整个菜单树,用于给角色分配菜单资源
    AssignMenuForRole:'security.resources.grantMenuResourcesToRole',

    GetEleByRole:'security.resources.pgGrantPageElRecByRoleIdAndTO',
    GetUnassignedEleByRole:'security.resources.pgNotGrantPageElRecByRIdAndTO',
    AddEleForRole:'security.resources.grantPageElementResourcesToRole',
    DelEleForRole:'security.role.terPageElementRecFromRole',

    GetURLByRole:'security.resources.pgGrantUrlAccRecByRoleIdAndTO',
    GetUnassignedUrlByRole:'security.resources.pgNotGrantUrlAccRecByRIdAndTO',
    AddUrlForRole:'security.resources.grantUrlAccessResourcesToRole',
    DelUrlForRole:'security.role.terminateUrlAccessResourcesFromRole',


    //权限管理
    AuthorityQuery:'',
    AuthorityCreate:'',
    AuthorityChange:'',
    AuthorityDel:'',

    //用户管理
    GetUserList:'daq.user.admin.page.forAdmin',
    AddUser:'',
    UpdateUser:'',
    DeleteUser:'',
    GetRoleListByUser:'security.role.pagingQueryGrantRolesByUserId',
    GetUnAssignedRoleByUser:'security.role.pagingQueryNotGrantRoles',
    AddRoleForUser:'security.role.grantRolesToUser',
    SetDftRoleForUser:'security.role.grantDefaultRolesToUser',
    DelRoleForUser:'security.role.terminateUserFromRoles',
    UserAdminUpdateForAdmin:'daq.user.admin.update.forAdmin',
    UserAdminPasswordResetForAdmin:'daq.user.admin.password.reset.forAdmin',
    UserAccountStatusChange:'daq.user.accountStatus.change',
    UserAdminAddForAdmin:'daq.user.admin.add.forAdmin',

    //菜单管理
    MenuQuery:'security.resource.menu.tree',
    MenuCreate:'',
    MenuChange:'',
    MenuDel:'',
    ResourcesFindAllMenusTree:'security.resources.findAllMenusTree',
    ResourcesChangeMenuResourceProps:'security.resources.changeMenuResourceProps',
    ResourcesTerminateMenuResources:'security.resources.terminateMenuResources',
    ResourcesCreateMenuResource:'security.resources.createMenuResource',
    ResourcesCreateChildMenuResouceToParent:'security.resources.createChildMenuResouceToParent',
    CheckEleAuthorityByRole:'security.resources.checkUserHasPageEleResourceSet',


    //url管理
    ResourceMngGetUrlList:'security.resources.pagingQueryUrlAccessResources',
    ResourceMngAddUrl:'security.resources.createUrlAccessResource',
    ResourceMngUpdateUrl:'security.resources.changeUrlAccessResourceProps',
    ResourceMngDeleteUrl:'security.resources.terminateUrlAccessResources',
    // ResourcesFindAllUrlAccessResources:'security.resources.pagingQueryUrlAccessResources',
    // ResourcesCreateUrlAccessResource:'security.resources.createUrlAccessResource',
    // UrlChange:'security.resources.changeUrlAccessResourceProps',
    // UrlDel:'security.resources.terminateUrlAccessResource',
    // PgUrlByRoleId:'security.resources.pgGrantUrlAccessRecByRoleId',
    // Pg:'security.resources.terminateUrlAccessResource',
    // UrlDel:'security.resources.terminateUrlAccessResource'


    //元素管理
    ResourceMngGetEleList:'security.resources.pagingQueryPageElementResources',
    ResourceMngAddEle:'security.resources.createPageElementResource',
    ResourceMngUpdateEle:'security.resources.changePageElementResourceProps',
    ResourceMngDeleteEle:'security.resources.terminatePageElementResources',

    // PgElementByRoleId:'security.resources.pgGrantUrlAccessRecByRoleId',


    InsertCoupon:'promotion.insertCoupon',
    SelectCouponById:'promotion.selectCouponById',
    PromotionGetCouponUseDetail:'promotion.getCouponUseDetail',
    UpdateCouponById:'promotion.updateCouponById',

    //预约查询
    // Reservationpage:'service.reservation.page',
    Reservationpage:'service.reservation.get.page',
    updapteReservationGroupStorage:'updapteReservationGroupStorage',
    ReservationTraceGet:'service.reservation.trace.get',
    // ReservationByid:'service.reservation.byid',
    ReservationByid:'service.reservation.get',
    ReservationStatusPut:'service.reservation.status.put',
    PagingQuerNurseDtoInfo:'pagingQuerNurseDtoInfo',
    cancelReservationGroup:'cancelReservationGroup',
    // Reservationcodebyid:'service.reservation.code.byid',
    Reservationcodebyid:'service.reservation.code.get.byid',
    ReservationCodeAdd:'service.reservation.code.add',
    ReservationExpressAdd:'service.reservation.express.add',
    // Reservationcancel:'service.reservation.cancel',
    // Reservationcancel:'service.reservation.cancel.tocrm',
    Reservationcancel:'service.reservation.cancel.crm',
    ReservationStorageAdd:'service.reservation.storage.add',
    ReservationBypwd:'service.reservation.bypwd',
    ReservationAdd:'service.reservation.add',
    ReservationChecked:'service.reservation.checked',
    ReservationArrange:'service.reservation.arrange',
    ReservationReport:'service.reservation.report',
    // ReservationByuser:'service.reservation.byuser',
    ReservationByuser:'service.reservation.get.byaccount',

    //webIM
    MessageHistory:"pagingQueryMessageHistory",
    MsgHistoryBtUser:"im.message.between.page",
    ConsultUsers:"im.message.userwithall.page",
    AccountDtlBatch:"user.account.detail.batch.get",
    ImPasswordGet:"user.imPassword.get",

    //订单
    OrderPage:'trade.order.page',
    OrderGet:'trade.order.get',
    OrderApplyrefund:'trade.order.apply_refund',
    OrderCancelrefund:'trade.order.cancel_refund',
    OrderCancel:'trade.order.cancel',
    OrderAffirmrefund:'trade.order.affirm_refund',
    OrderMyall:'trade.order.myall',

    //排班
    SchedulePageFromcrm:'service.schedule.page.fromcrm',
    SchedulePage:'his.schedule.page',
    SchedulePagePlus:'his.schedule.page.plus',
    ScheduleServicePage:'his.schedule.service.page',
    ScheduleServicePagePlus:'his.schedule.service.page.plus',
    ScheduleStop:'his.schedule.stop',
    RegsourceStatusPage:'his.regsource.status.page',
    RegsourceStatusPagePlus:'his.regsource.status.page.plus',
    RegsourceAddbatch:'his.regsource.addbatch',
    RegsourceTemppage:'his.regsource.temp.page',
    RegsourceTempGet:'his.regsource.temp.get',
    RegsourceGetByidByweek:'his.regsource.get.byid.byweek',
    RegsourceTempUpdate:'his.regsource.temp.update',
    RegsourceTempAdd:'his.regsource.temp.add',
    RegsourceStatusPutbatch:'his.regsource.status.putbatch',
    ScheduleAddBatch:'his.schedule.add.batch',


    //挂号订单
    // ReservationPage:'his.reservation.page',
    ReservationPage:'service.schedule.registration.get.page',
    // ReservationGetByid:'his.reservation.get.byid',
    ReservationGetByid:'service.schedule.registration.get.id',
    // ReservationRemarkAdd:'his.reservation.remark.add',
    ReservationRemarkAdd:'service.schedule.registration.comment.add',
    // ReservationCheck:'his.reservation.check',
    // ReservationCheck:'his.reservation.checkIn',
    ReservationCheck:'service.schedule.registration.check',
    // ReservationGetBbyaccount:'his.reservation.get.byaccount',
    ReservationGetBbyaccount:'service.schedule.registration.get.account',
    // ReservationRefund:'his.reservation.refund',
    ReservationRefund:'service.schedule.refund',

    //常用联系人
    ContactPersonList:'daq.contactPerson.list',
    AddressList:'daq.address.list'
};