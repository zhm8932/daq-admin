window.onload = function(){
    var createdAt = document.getElementById('createdAt').value;
    var date = getLoacalTimeString(createdAt);
    document.getElementById('date').innerHTML = date;

    var elem = document.getElementById('rundiv');
    window.rundiv = Rundiv(elem, {
        startSlide: 1,
        auto: 4000,
        continuous: true
    });
};

function getLoacalTimeString(timestamp) {
    if(timestamp){
        var date = new Date(parseInt(timestamp));
    }else{
        var date = new Date();
    }
    var year =  date.getFullYear();
    var month = date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var time = year + '-' + month + '-' + d;
    return time;
}

