$(document).ready(function() {
    if($("#pagination")){
        //var pagecount = <%= locals.pagecount %>
        //var pagesize = pagesize;
        //var currentpage = currentpage;

        var pagecount = 100
        var pagesize = 5;
        var currentpage = 3;
        var counts,pagehtml="";

        //console.log(locals.pagecount)
        console.log(pagecount)
        if(pagecount%pagesize==0){
            counts = parseInt(pagecount/pagesize);
        }else{
            counts = parseInt(pagecount/pagesize)+1;
        }
        //只有一页内容  
        if(pagecount<=pagesize){pagehtml="";}
        //大于一页内容  
        if(pagecount>pagesize){
            if(currentpage>1){
                pagehtml+= '<a href="?page='+(currentpage-1)+'">上一页</a>';
            }
            for(var i=0;i<counts;i++){
                if(i>=(currentpage-3) && i<(currentpage+3)){
                    if(i==currentpage-1){
                        pagehtml+= '<span class="current">'+(i+1)+'</span>';
                    }else{
                        pagehtml+= '<a href="?page='+(i+1)+'">'+(i+1)+'</a>';
                    }

                }
            }
            if(currentpage<counts){
                pagehtml+= '<a href="?page='+(currentpage+1)+'">下一页</a>';
            }
        }
        console.log(pagehtml)
        $("#pagination").html(pagehtml);
    }
});