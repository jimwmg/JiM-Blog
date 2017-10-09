---
title: cookie设置 读取 删除操作
date: 2016-08-10 12:36:00
categories: cookies storage
tags : cookies
comments : true 
updated : 
layout : 
---

### cookie设置，读取，删除

```html
<script>
    function setCookie(name,value,expiresHours){
        var cookieString = name+'='+escape(value);
        if(expiresHours > 0){
            var date = new Date();
            date.setHours(date.getHours()+expiresHours);
            cookieString = cookieString + ";expires="+date.toUTCString();
        }
        //然后设置cookie
        document.cookie = cookieString ;
    }

    setCookie('malename','Jhon',20);

    function getCookie(name){
        var strCookie = document.cookie ;
        var arrCookie = strCookie.split(';');
        for(var i = 0 ; i < arrCookie.length ; i++){
            var arr = arrCookie[i].split("=");
            if(arr[0] == name){
                return unescape(arr[1]);
            }else{
                return "";
            }
        }
    }
    console.log(getCookie('malename'));
//    document.cookie = 'malename = v;expire'
    //删除一个cookie
    function deleteCookie(name){
        var date = new Date();
        date.setHours(date.getHours()-10);
        document.cookie = name+'=v'+';expires='+date.toUTCString();
    }

    function deleteCookie(name){
        var date=new Date();
        date.setTime(date.getTime()-10000); //设定一个过去的时间即可
        document.cookie=name+"=v; expires="+date.toGMTString();
    }

    function deleteCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    document.getElementById('btn').onclick = function(){
        console.log("1");
        deleteCookie('malename');
    };

</script>
```

