---
title: Ajax 如何处理缓存 
date: 2016-04-17 12:36:00
categories: http ajax
tags: http
comments : true 
updated : 
layout : 
---

1.GET请求缓存处理，不想要缓存GET请求？

浏览器会缓存GET请求，不会缓存POST请求，因此解决为：

浏览器就会在本地硬盘上 查找 与该 URL 相关联的 Cookie 。如果该 Cookie 存在，浏览器就将它添加到 request header的Cookie字段中，与 http请求`一起发送到该站点

方法1：GET请求URL后加随机数，让服务器认为是不同的请求，如："http://www.example.com/index.jsp?class=articele&page=5&t"+new Date().getTime();

或者  URL 参数后加上 "?ran=" + Math.random(); //当然这里参数 ran可以任意取了

方法2：在ajax发送请求前加上xmlHttpRequest.setRequestHeader("If-modified-since","0");

方法3：在ajax发送请求前加上xmlHttpRequest.setRequestHeader("Cache-Control","no-cache");

方法4：若为[jQuery](http://lib.csdn.net/base/jquery) ajax, 设置ajax属性cache:false;(注意：cache属性对post没有用，对get才有用)或者

beforeSend :function(xmlHttp){ 
xmlHttp.setRequestHeader("If-Modified-Since","0"); 
xmlHttp.setRequestHeader("Cache-Control","no-cache");
},

方法5：在服务器端响应请求时加上response.setHeader("Cache-Control","no-cache,must-revalidate");

方法6：使用POST代替GET,浏览器不会对POST做缓存



注意：为什么cache属性对post没有用，对get才有用？

因为1.浏览器缓存url请求原理就是判断url是否相同，url相同则读取缓存，url不相同则读取服务器

2.使用GET方式提交url类似"http://www.example.com/index.jsp?class=articele&page=5“，而POST方式提交url类似http://www.example.com/index.jsp，参数是在请求 head里的，不在url上，请求参数url始终相同

3.jquery ajax GET方式提交： data: "t=" + new Date().getTime(),  或者 data:{"t": new Date().getTime()}或者cash:false都是在请求后面加上不同的参数，cach:false会启动生成参数附加在url请求里，因此浏览器认为是不同的请求，就重新请求服务器