var moment = require('moment');

exports.getWeeks = function(obj){

    //实现当前日期是当年的第几周,再向前和向后推几周,js数组保存当前日期的前后两周(共五周的数据)

    var weekArr = []
    var curWeekDays = [];
    var startDate=obj.startDate||moment().add('days').format('YYYY-MM-DD')||'2016-05-10';
    // var startDate='2016-05-10';

    var vNowDate=moment(new moment(startDate).format("YYYY-MM-DD"));
    //-.add('month',0).add('days',-1);

    var vWeekOfDay=moment(vNowDate).format("E");//算出这周的周几

    var vWeekOfDays=7-vWeekOfDay;

    var vStartDate=moment(vNowDate).add('days',-vWeekOfDay+1).format('YYYY-MM-DD');

    var vEndDate=moment(vNowDate).add('days',vWeekOfDays).format('YYYY-MM-DD');

    var vStartDateNew=moment(vStartDate).add('days',7*1).format('YYYY-MM-DD');

    var vEndDateNew=moment(vEndDate).add('days',7*2).format('YYYY-MM-DD');

    var vYearAndWeek=moment(vStartDate).format("YYYY")+'-'+moment(vStartDate).format("WW");
    //
    // searchMajorChanges(vStartDateNew,vEndDateNew);
    // console.log("vNowDate:",vNowDate)
    console.log("距离周日的天数vWeekOfDays:",vWeekOfDays)
    console.log("这周的周几:",vWeekOfDay)
    console.log("这周周一的日期vStartDate:",vStartDate)
    console.log("这周周日的日期vEndDate:",vEndDate)
    console.log("vStartDateNew:",vStartDateNew)
    console.log("vEndDateNew:",vEndDateNew)
    console.log("vYearAndWeek:",vYearAndWeek)
    console.log("duration:",moment.duration().toJSON())
    // weekArr = [["2016-06-06","2016-06-12"],["2016-06-13","2016-06-19"]]
    // weekArr.push({
    //     wk1:moment(vStartDate).add('days',-7*2).format('YYYY-MM-DD'),
    //     wk7:moment(vStartDate).add('days',-7*1-1).format('YYYY-MM-DD')
    // })
    // weekArr.push({
    //     wk1:moment(vStartDate).add('days',-7*1).format('YYYY-MM-DD'),
    //     wk7:moment(vStartDate).add('days',-7*0-1).format('YYYY-MM-DD')
    // })
    // weekArr.push({
    //     wk1:moment(vStartDate).add('days',7*0).format('YYYY-MM-DD'),
    //     wk7:moment(vStartDate).add('days',7*1-1).format('YYYY-MM-DD')
    // })
    // weekArr.push({
    //     wk1:moment(vStartDate).add('days',7*1).format('YYYY-MM-DD'),
    //     wk7:moment(vStartDate).add('days',7*2-1).format('YYYY-MM-DD')
    // })

    //连续几周，从周一到周日的时间
    if(obj.range){
        var start = obj.range[0]||-2;
        var end = obj.range[1]||2;
        // for(var i=-2;i<2;i++){
        for(var i=start;i<=end;i++){
            var bCur = false;
            if(moment(vNowDate).isSame(moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'), 'day')||moment(vNowDate).isSame(moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'), 'day')){
                bCur = true;
            }else if(moment(vNowDate).isAfter(moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'), 'day')&&moment(vNowDate).isBefore(moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'), 'day')){
                bCur = true;
            }else{
                bCur = false;
            }

            weekArr.push({
                wk1:moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'),
                wk7:moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD'),
                bCur:bCur
            })
        }
    }

    //一个星期的连续时间
    if(obj.curWeek){
        // curWeekArr.push({
        //     wk1:moment(vStartDate).add('days',7*i).format('YYYY-MM-DD'),
        //     wk7:moment(vStartDate).add('days',7*(i+1)-1).format('YYYY-MM-DD')
        // })
        if(obj.startDate){
            vStartDate = obj.startDate
        }
        for(var i=0;i<7;i++) {
            curWeekDays.push(moment(vStartDate).add('days',i).format('YYYY-MM-DD'))
        }
        console.log("curWeekDays:",curWeekDays)
    }
    var data = {
        weekArr:weekArr,
        wStartDate:vStartDate,
        wEndDate:vEndDate
    }
    if(obj.curWeek){
        data.curWeekDays = curWeekDays
    }
    return data;

}