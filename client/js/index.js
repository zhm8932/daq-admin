define(function(require,exports,module) {
    var data = {
        "value": "{\"sampling_home\":\"20000\",\"sampling_delivery\":\"10000\",\"sampling_clinic\":\"0\"}"
    }

    var testObj =  {
        "attributeName": "fit_people",
        "value": "担心或不确定性行为是否安全，多性伴、性伴感染史、为爱负责需定期体检者。"
    }

    var myobj ={
        name:'jok',
        test:testObj
    }
    myobj.test = JSON.stringify(testObj)
    console.log(JSON.stringify(myobj))

    var a = {
        x:1,
        y:2,
        z:{
            s:'aa',
            t:'bb'
        }
    }

    a.z = JSON.stringify(a.z);
    console.log(a.z);
    console.log(JSON.stringify(a));

});

