---
title: HTML5  Storage 
date: 2016-09-21 12:36:00
categories: HTML5 storage
comments : true 
tags : storage
updated : 
layout : 
---

HTML5  Storage 

1 localStorage 存储数据没有时间限制，一周，一个月之后都可以使用

2 sessionStorage  存储数据只是针对一个session进行，当用户关闭当前网页的时候，数据随即也被清除；

3 当点击开发者工具里面的 clear storage的时候，localStorage会被删除，但是，sessionStorage不会被删除，只要浏览器窗口不被关闭，那么sessionStorage本地存储就不会被删除；

如何判断浏览器是否支持HTML5这个新的API，如果window.loaclStorage  window.sessinoStorage 存在，那么证明浏览器支持该对象

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<input type="button" value="按钮"/>
<script src="jquery-1.12.2.js"></script>
<script>
     $("input:button").click(function(){
         if(window.localStorage){  //object转化为布尔为true
             console.log(typeof window.localStorage);//object
             console.log(window.localStorage);
         }
         if(window.sessionStorage){
           	console.log(typeof window.sessionStorage);//object
             console.log(window.sessionStorage);
         }
     });
</script>
</body>
</html>
```

3 本地存储 localStorage  sessionStorage 对象常用方法如下

```javascript
 3.1 获取localStorage对象或者sessionStorage对象里面的key值
 	 getItem(key)   localStorage.key   sessionStorage.key
 3.2 增加localStorage对象或者sessionStorage对象里面的key值
 	 setItem(key,value) localStorage.key = "value" sessionStorage.key = "value"
 3.3 removeItem(key)    删除localStorage对象或者sessionStorage对象里面的key值
 3.4 clear()		   清空localStorage对象或者sessionStorage对象里面的所有存储值
 3.5 key(num) 可以得到localStorage对象的键值,对应的num参数必须存在.
```

```javascript
    localStorage.name = "jim";//设置localStorage 对象 name 值
    sessionStorage.name2='wmg';//设置sessionStorage对象 name值
    localStorage.setItem("age",12);//设置 localStorage 对象age值
	loaclStorage.getItem("age");//获取localStorage 对象里面的 age值
    localStorage.clear();//清除localStorage 对象里面所有的值
```

4 详说二者的不同

*  loaclStorage 本地存储数据不会被销毁，除非用户主动删除,存储容量大 5M，对于基本的字符串的存储足够了；
*  sessionStorage 本地存储数据很特别，引入了一个"浏览器窗口"的概念，sessionStorage是在一个**同源**  的**同窗口** 中始终存在的数据，
*  浏览器窗口没有被关闭，那么就一直存在，即使刷新了页面  或者  进入**同源**另外一个页面，仍然存在
*  浏览器窗口被关闭 或者 再次独立的打开同样的这个页面，两个窗口的sessionStorage并不通用
*  简单解释来说就是:sessionStorage是仅仅存在于当前"浏览器窗口的"本地存储对象，"当前浏览器窗口"不关闭，则一直存在，关闭则自动销毁；

大家可以看下这个栗子 综合考虑下

```html
<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>LocalStorage</title>
    <script src="jquery-1.12.2.js"></script>
    <script type="text/javascript">
        function clickCounter() {
            if (typeof (Storage) !== "undefined") {
                if (sessionStorage.clickcount) {
                    sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
                }
                else {
                    sessionStorage.clickcount = 1;
                }
                $('#result').html('');
                $('#result').append('<p>' + sessionStorage.clickcount + '</p>');
            }
            else {
                $('#result').text('抱歉您的浏览器不支持本地存储');
            }
        }
        function clickCounter2() {
            if (typeof (Storage) !== "undefined") {
                if (localStorage.clickcount) {
                    localStorage.clickcount = Number(localStorage.clickcount) + 1;
                }
                else {
                    localStorage.clickcount = 1;
                }
                $('#result2').html('');
                $('#result2').append('<p>' + localStorage.clickcount + '</p>');
            }
            else {
                $('#result2').text('抱歉您的浏览器不支持本地存储');
            }
        }
    </script>
</head>
<body>
<div>
    <p>
        <button onclick="clickCounter()" type="button">sessionStorage查看单击次数</button>
    </p>
    <div id="result"></div>
    <p>单击按钮查看统计次数</p>

</div>

<div>
    <p>
        <button onclick="clickCounter2()" type="button">localStorage查看单击次数</button>
    </p>
    <div id="result2"></div>
    <p>单击按钮查看统计次数</p>

</div>
</body>
</html>
```

