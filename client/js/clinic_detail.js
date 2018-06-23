define(function(require,exports,module) {
    //var BMap = require('http://api.map.baidu.com/api?v=2.0&ak=Xxl3KBGneiWgAPS3jIN8Zar5qTpGqDMF')
    //var BMap = require('http://api.map.baidu.com/getscript?v=2.0&ak=Xxl3KBGneiWgAPS3jIN8Zar5qTpGqDMF=&t=20150901171226')
    //var BMap = require('http://api.map.baidu.com/getscript?v=2.0&ak=Xxl3KBGneiWgAPS3jIN8Zar5qTpGqDMF&services=&t=20160401164342')
    $(function(){
        var city = $("#city").text();
        var address = city+$("#address").text();
        console.log(address)


        var BMap = require('./libs/BMap.js')
        console.log(BMap)
        var map = new BMap.Map("allmap"); // 创建地图实例

        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
        map.centerAndZoom(point, 11);                 // 初始化地图，设置中心点坐标和地图级别

        map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用


        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
        //map.addControl(top_right_navigation);


        //var myGeo = new BMap.Geocoder();
        //// 将地址解析结果显示在地图上，并调整地图视野
        //myGeo.getPoint(address, function(point){
        //    if (point) {
        //        map.centerAndZoom(point, 16);
        //        map.addOverlay(new BMap.Marker(point));
        //    }else{
        //        alert("您选择地址没有解析到结果!");
        //    }
        //});

        //
        //var local = new BMap.LocalSearch(map,
        //    {
        //        renderOptions:{map: map, panel:"r-result"},
        //        onInfoHtmlSet:function(){
        //            console.log('99999999999999')
        //        }
        //    }
        //);
        //local.search(address);                                 // 开启标注工具

        var options = {
            renderOptions:{map: map, panel:"r-result"},
            onSearchComplete: function(results){
                console.log(results)
                //document.getElementById("log").innerHTML = JSON.stringify(results)
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    // 判断状态是否正确
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i ++){
                        s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                    }
                    console.log(s)
                    //document.getElementById("log").innerHTML = s.join("<br>");

                }
            }
        };
        var local = new BMap.LocalSearch(map, options);
        local.search(address);

    })




});

