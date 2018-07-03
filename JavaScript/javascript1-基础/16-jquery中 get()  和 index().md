---
title: jQuery核心
date: 2016-09-24 12:36:00
categories: jQuery
comments : true 
updated : 
layout : 
---

1   核心  $("selector"):这个函数接收一个包含 CSS 选择器的**字符串**，然后用这个字符串去匹配一组元素。**注意**：如果**选择器字符串**含有**变量** 的话需要进行**字符串拼接**。

```
<div class="bd">
    <ul>
        <li class="current">我是体育模块</li>
        <li>我是娱乐模块</li>
        <li>我是新闻模块</li>
        <li>我是综合模块</li>
    </ul>
</div>
如果index是以变量的形式存在的话，那么，第一行代码获取对应索引位置的li元素是无法获取的，第二行字符串的拼接才是正确的写法。
var index = 2 ；
 $(".bd li:eq(index)").prop("class","current");//错误写法
 $(".bd li:eq("+index+")").prop("class","current");
```

2   jquery中 get()  和 index()  如何区分DOM对象和jquery对象的区分

*  get()方法：这能够让你选择一个实际的DOM 元素并且对他直接操作，而不是通过 jQuery 函数,也就是说此时将jquery对象转化成了DOM对象；

jqueryObj.get():如果不传参数index，那么将返回匹配到的所有对象组成的DOM元素集合；

jqueryObj.get(index):如果传入index参数，那么将返回匹配到元素集合中的第几个DOM元素，其中index代表索引值；

**注意返回值是DOM元素，不能用jquery方法** ；get(index)方法中的index索引值是从0 开始的；

*  index()方法：如果不传参数，那么返回值是当前jquery对象在其同辈元素中的索引值(从0 开始)

