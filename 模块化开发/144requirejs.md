---
title: the config of require js  
date: 2016-09-16 12:36:00
categories:  javascript 
comments : true 
tags :  requirejs
updated : 
layout : 
---

### 1 require源码上可以看出来require.js有三个全局变量 require    requirejs 和  define

​    define ([ module1,module2····] ,callback) 中的module路径依赖

​    require([ module1,module2····],callback) 中的module路径依赖

二者的路径依赖如何？

* 如果设置了data-main,那么module引入路径就是相对于data-main文件所在目录为基准
* 如果设置了require.config   baseUrl 的路径，那么define和require依赖的mudule引入 路径就是相对于baseUrl的

### 2 以data-main路径为准，且不设置baseUrl

目录如下

```javascript
pathTest
- index.html
- js
  - jquery.js
  - main.js
  - require.js
  - test.js
```

index.html

```html
<script src="js/require.js" data-main="js/main"></script>
```

main.js

```javascript
require(['test'],function(w){   //引入test模块的路径 js/test.js
    console.log(w);
})
```

test.js

```javascript
define(['jquery'],function(){   //引入jquery模块的路径 js/jquery.js
    var w = $(window).width()
    return w ;
})
```

### 3 设置baseUrl,看下路径变化

改变下目录结构

```javascript
pathTest
- index.html
- js
  - main.js
  - require.js
  - test.js
  - jq
	- jquery.js
```

main.js  设置baseUrl 

[关于date-main的实现原理](http://www.html-js.com/article/2176)

```javascript
//源码实现方式
if (isBrowser && !cfg.skipDataMain) {

  eachReverse(scripts(), function (script) {

    if (!head) {
      head = script.parentNode;
    }

    dataMain = script.getAttribute('data-main');
    if (dataMain) {

      mainScript = dataMain;

      if (!cfg.baseUrl) {

        src = mainScript.split('/');
        mainScript = src.pop();
        subPath = src.length ? src.join('/')  + '/' : './';

        cfg.baseUrl = subPath;
      }

      mainScript = mainScript.replace(jsSuffixRegExp, '');

      if (req.jsExtRegExp.test(mainScript)) {
        mainScript = dataMain;
      }

      cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

      return true;
    }
  });
}
```



```javascript
require.config({
  baseUrl : 'js/jq'
})
require(['../test'],function(w){   //此时如果在想依赖test模块，路径有变化需要向上走一级
    console.log(w);
})
```

test.js  依赖模块路径以js/jq为准

```javascript
define(['jquery'],function(){  //没有变化
    var w = $(window).width()
    return w ;
})
```

### 4 如果直接以 **绝对路径**  /  引入包，**文件名后缀  js 不能再省略了**；代表相对于服务器的根目录  

scheme:host : port  /  path  即path根目录

  myvirtual 是我的一个虚拟主机

```javascript
myvirtual
  - test.js
  - jquery.js
  - pathTest
    - index.html
    - js
      - main.js
      - require.js      
```

main.js

```javascript
require(['/test.js'],function(w){  // 代表域名根路径 myvirtual/test.js
    console.log(w);
})
```

test.js

```javascript
define(['/jquery.js'],function(){  //myvirtual/jquery.js
    var w = $(window).width()
    return w ;
})
```

### 5 通过require.config直接设置模块的路径，requirejs支持跨域获取文件 require.config

```javascript
myvirtual    //这是一个虚拟主机
  - jquery.js
  - pathTest
	- module1.js
    - test.js
    - index.html
    - js
      - main.js
      - require.js  
myvirtual2	//这是另外一个虚拟主机
   - innervirtual2.js
```

index.html

```html
<script src="js/require.js" data-main="js/main"></script>
```

main.js	

```javascript
require.config({
    paths : {
        mytest : "../test",//index.html设置data-main属性，所以默认根路径是main文件所在目录
        myinner: "http://www.myvirtual2.com/innervirtual2" , //跨域设置路径
        myabs : "/module1" ,//通过域的根目录设置包路径
        myjquery : '/jquery' //通过域的根目录设置包路径
    }

})
require(['mytest','myinner','myabs'],function(arg1,arg2,arg3){
    console.log(arg1,arg2,arg3);
})
```

test.js

```javascript
define(['myjquery'],function(){
    var w = $(window).width()
    return 'this is test---'+w ;
})
```

module1.js

```javascript
define(function(){
    var add = function(a,b){
        return a+b;
    };
    return {
        add : add
    }
});
```

myvirtual2  /  innervirtual2.js

```javascript
define(function(){
    var innerV2 = function(){
        console.log("this is cross package");
    }
    return {
        innerV2 : innerV2
    }
})
```

### 6 submit 

6.1 如果直接通过路径获取包，如 2,3部分，文件后缀js可以省略

6.2 如果直接通过绝对路径获取包，如4部分，文件后缀js不能省略

6.3 如果设置require.config   paths  设置包的路径，文件后缀js可以省略





