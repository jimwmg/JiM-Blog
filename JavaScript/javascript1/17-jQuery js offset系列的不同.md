---
title: jQuery js offset系列的不同
date: 2016-11-10 12:36:00
categories: css
tags: css
comments : true 
updated : 
layout : 
---

jQuery中和DOM中 offset系列的不同；
一　offset

* jQuery中offset( ) 方法获取元素距离边界的值，该方法返回两个整形数值，一个代表left,一个代表top，其始终是获取的当前jquery对象相对于文档的边界的距离；

不写参数：jqueryObj.offset().left     jqueryObj.offset().top  可以获取相应值

传入键值对参数：jQueryObj.offset({left:30,left:50});可以将匹配的元素设置距离边界的距离。

* DOM中的offsetLeft   offsetTop  获取**元素**距离边界值，

1)如果父元素有定位，那么DOM子元素是相对于父元素的border内边界的距离；

2)如果父元素没有定位，那么子元素是相对于文档边界的距离；

3)offsetLeft  offsetTop  只能获取值，不能设置值，是一个只读属性；

4)offsetLeft 经常结合定位进行轮播图的封装，因为offsetLeft指的是子元素border外边界相对于父元素border内边界的距离，而定位的left值代表的也是这一段距离。

二，事件对象参数的offsetX  offsetY  clientX  clientY的区别

先总结下区别：

**event.clientX、event.clientY**

鼠标相对于[浏览器](http://www.2cto.com/os/liulanqi/)窗口可视区域的X，Y坐标（窗口坐标），可视区域不包括工具栏和滚动条。IE事件和标准事件都定义了这2个属性

**event.pageX、event.pageY**

类似于event.clientX、event.clientY，但它们使用的是文档坐标而非窗口坐标。这2个属性不是标准属性，但得到了广泛支持。IE事件中没有这2个属性。

**event.offsetX、event.offsetY** 

鼠标相对于事件源元素（srcElement）的X,Y坐标，只有IE事件有这2个属性，标准事件没有对应的属性。

**event.screenX、event.screenY** 

鼠标相对于用户显示器屏幕左上角的X,Y坐标。标准事件和IE事件都定义了这2个属性

![图xy2  :执行完rotateZ(90deg)](img/2014091409260873.png)

