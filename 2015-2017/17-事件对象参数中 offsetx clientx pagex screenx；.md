---
title: jQuery中和DOM中 offset系列的不同
date: 2016-08-17 12:36:00
tags: jQuery
categories: css
comments : true 
updated : 
layout : 
---

jQuery中和DOM中 offset系列的不同；

一 、jQuery中offset( ) 方法获取元素距离边界的值，该方法返回两个整形数值，一个代表left,一个代表top，其始终是获取的当前jquery对象相对于文档的边界的距离；

不写参数：jqueryObj.offset().left     jqueryObj.offset().top  可以获取相应值

传入键值对参数：jQueryObj.offset({left:30,left:50});可以将匹配的元素设置距离边界的距离。

  DOM中的offsetLeft   offsetTop  获取**元素**距离边界值，

1)如果父元素有定位，那么DOM子元素是相对于父元素的border内边界的距离；

2)如果父元素没有定位，那么子元素是相对于文档边界的距离；

3)offsetLeft  offsetTop  只能获取值，不能设置值，是一个只读属性；

二，事件对象参数的offsetX  offsetY  clientX  clientY  pageX  pageY screenX  screenY的区别

先总结下区别：(注意这些值都是整形的数值，代表事件源距离不同边界的以px计 的距离)

**event.clientX、event.clientY**

鼠标相对于[浏览器](http://www.2cto.com/os/liulanqi/)窗口可视区域的X，Y坐标（窗口坐标），可视区域不包括工具栏和滚动条。IE事件和标准事件都定义了这2个属性

**event.pageX、event.pageY**

类似于event.clientX、event.clientY，但它们使用的是文档坐标而非窗口坐标。这2个属性不是标准属性，但得到了广泛支持。IE事件中没有这2个属性。

**event.offsetX、event.offsetY**

鼠标相对于事件源元素（srcElement）的X,Y坐标，只有IE事件有这2个属性，标准事件没有对应的属性。

offsetX  offsetY(偏移) 获取鼠标点击事件源相对于元素(content+padding)的左上角的坐标值,如果点击在border边界上的话，那么值为负数；

**event.screenX、event.screenY** 

鼠标相对于用户显示器屏幕左上角的X,Y坐标。标准事件和IE事件都定义了这2个属性

![图xy2  :执行完rotateZ(90deg)](img/2014091409260873.png)

