define(function(require,exports,module) {
    var utils = require('../utils');
    require("DateTimePicker");
    // var periodArr = [];
    // function get_period() {
    //     var html = '<option value=""></option>';
    //     if(!periodArr.length){
    //         $.ajax({
    //             type:'get',
    //             url:'/scheduling/numbers/get_period',
    //             success:function(json){
    //                 if(json.success){
    //                     var data = json.data;
    //                     periodArr = data;
    //                     $.each(periodArr,function (index,item) {
    //                         html += '<option value='+item+'>'+item+'</option>'
    //                     })
    //                     $('.newPeriod').html(html)
    //                 }
    //             }
    //         })
    //     }else{
    //         $.each(periodArr,function (index,item) {
    //             html += '<option value='+item+'>'+item+'</option>'
    //         })
    //         $('.newPeriod').html(html)
    //
    //     }
    //
    //
    // }
    $("#dtBox").DateTimePicker(
        {
            dateFormat: "dd-MMM-yyyy"
        });
    $('body').on('click','.addRow',function () {
        var $self = $(this);
        var $selfTable = $self.parents('.table');
        // var html = '<tr><td><select name="start" class="start newPeriod"></select></td><td><select name="end" class="end newPeriod"></select></td><td><input type="text" name="capacity" class="capacity" placeholder="放号数"></td><td><input type="text" name="cost" class="cost" placeholder="挂号费"></td><td><a class="delete" href="javascript:;">删除</a></td></tr>';
        var html = '<tr><td><input name="start" class="start newPeriod" data-field="time"></td><td><input name="end" class="end newPeriod" data-field="time"></td><td><input type="text" name="capacity" class="capacity" placeholder="放号数"></td><td><input type="text" name="cost" class="cost" placeholder="挂号费"></td><td><a class="delete" href="javascript:;">删除</a></td></tr>';
        if($selfTable.find('td').text()=='暂无数据'||$selfTable.find('td').text()=='在这里新增模板'){
            $selfTable.find('tbody').html('')
        }
        $selfTable.find('tbody').append(html);
        utils.get_period();


    })

    $('body').on('click','.delete',function () {
        var $self = $(this);
        $self.parent().parent().remove();

    })





});