---
title: DOM元素和jquery对象的互相转化
date: 2015-12-22 21:02:00
tags: [DOM]
categories: jQuery
comments : true 
updated : 
layout : 
---

DOM元素和jquery对象的互相转化

1 DOM对象转化为jquery对象,语法：$(DOM对象)：用js一些固有的操作获取页面元素。比如 document.getElementById(),getElementsByTagName()，等js方法获取页面元素的所得为DOM对象,将DOM对象放在中括号里面所得便是jquery对象；

2 jquery对象转化为DOM对象，语法：jquery对象[ index]或者 jquery对象.get(index); 用jquery方法获取页面元素，通过jquery选择器，筛选器进行选择，所得结果为jquery对象，jquery对象有两种方法可以转化为DOM对象：jqueryObj[index]  和   jqueryObj . get(index);(如果不写参数的话，那么则将匹配到的所有的jquery对象转化为DOM对象)

3 DOM中this代表DOM对象  jquery中$(this)代表jquery对象。

4 栗子说明下：

```html
<div class="bd">
  <ul>
    <li class="current">我是体育模块</li>
    <li>我是娱乐模块</li>
    <li>我是新闻模块</li>
    <li>我是综合模块</li>
  </ul>
</div>
console.log($(".hd>span"));//jquery对象
console.log($(".hd>span:first-child"));//jquery对象
console.log($(".hd>span").get(1));//DOM对象
console.log($(".hd>span").get());//DOM对象
console.log($(".hd>span")[1]);//DOM对象
```

5  注意jQuery对象和DOM对象的方法不能通用，

DOM对象只能用 innerHTML，innerText  ，属性操作 setAttribute() 、getAttribute() 、ele.style.property ；

jQuery对象只能用html()  text(), 属性操作，attr() 、prop( )、 css( );



