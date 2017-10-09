---
title: URL operation
date: 2016-10-22 12:36:00
categories: javascript URL
tags : URL
comments : true 
updated : 
layout : 
---

如何操作查询字符串，返回一个查询字符串包含信息的对象

```javascript
var url ='http://www.myvirtual.com?username=Jhon&age=12';//将查询字符串转换为js对象
function queryParam(url){
  var newUrl = url.slice(url.indexOf('?')+1);
  var urlArr = newUrl.split('&');
  var ret = {}
  for(var i = 0 ; i < urlArr.length ; i++){
    var arr = urlArr[i].split('=');
    ret[arr[0]] = arr[1];
  }
  return ret ;
}

queryParam(url);
```

