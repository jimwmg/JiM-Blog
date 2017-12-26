---
title:ajax传给后台的data字符串序列化的多种方式
date: 2017-12-07
categories: javascript

---

* 直接拼接（这种方式效率最低，因为字符串的不可变性，每次都会开辟新的内存来存放字符串）

```javascript
    
function param(obj) {
        var str = "";
        for (var key in obj) {
            //console.log(key);
            str += key + "=" + obj[key] + "&"
        }
        console.log(str);
        str = str.substr(0, str.length - 1);

        console.log(str);

        return str;
    }
} 
```

```javascript
var data = {name:'jhon=gini',age:12};   
console.log(param(data));//name=jhon=gini&age=12 ;如果将这个字符串传递给后台，明显不是我们想要结果
```

**注意上面是一个很不严谨并且消耗内存的错误示例，对于key-value的值都没有进行encodeURIComponent编码,后台拿到数据之后，在解析的时候，很容易出现错误**；

* 进行编码

```javascript
function param(data){
  var str = '';
  for(var key in data){
    str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
  };
  return str.substring(0,str.length-1);
}
```

```javascript
var data = {name:'jhon=gini',age:12};   
console.log(param(data));//name=jhon%3Dgini&age=12;这样传递给后台的数据才是正确
```

* 该用数据数据拼接(这个也是jQuery内部的大致实现)

```javascript
function param(data){
  var a = [];
  for(var key in data){
    a[a.length] = encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  };
  return a.join('&');
};
```

```javascript
var data = {name:'jhon=gini',age:12};   
console.log(param(data));//name=jhon%3Dgini&age=12;这样传递给后台的数据才是正确
```



