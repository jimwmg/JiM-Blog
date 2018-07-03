---
title:  offset scroll client  
date: 2016-07-21 12:36:00
categories: html
tags : html
comments : true 
updated : 
layout : 
---

###  一   js   offset

1 :如果父元素没有定位，那么offsetLeft   offsetTop是元素自身**border** 边界左上角相对于**body边界** 的距离  

2 :如果父元素有定位，那么offsetLeft   offsetTop是元素自身**border** 边界左上角相对于**父元素的border边界** 

3 offsetWidth  offsetHeight 是一个只读属性，该属性的宽高包括  内容区+padding+border；返回它的屏幕尺寸；

*  通过ele.offsetWidth ele.offsetHeight可以获取元素的宽高 ; **包括padding值和border值** 


*  ele.offsetLeft  和  ele.offsetTop  指的是相对于文档或者定位父节点的左边距和上边距，是一个**只读** 属性
*  offset系列的属性值是数字类型，只可读，不能设置

4 所有的HTML元素都有offsetHeight offsetWidth属性，offsetTop  offsetLeft 可以获取当前元素相对于  **文档坐标系统**的x   y   坐标值;

*  对于很多元素，都是相对于文档坐标系统的值；
*  但是对于**已经定位的元素**的**后代元素和一些其他 元素**(表格元素)，这些属性返回的坐标是相对于祖先元素定位的的而非文档；offsetParent属性指定这些属性所相对的父元素，如果offsetParent为null,这些属性都是文档坐标； 

### js  scroll 

1 ele.scrollHeight ele.scrollWidth  用来获取元素的内容的宽高，包括padding,不包括 border(**如果产生了滚动条，则不包括滚动条的宽度**)，是一个**只读** 属性，包括内容区，内边距以及任何溢出的内容，当么有溢出的时候，等于clientHeight he clientWidth ，当有溢出的时候，大于它们；

2 ele.scrollTop  ele.scorllLeft  用来获取元素自身(比如当元素内容宽高大于元素自身的时候，会产生scroll，经常用来获取body的卷曲距离)内容向上或者向左卷曲出去的距离，也就是元素的内容区相对于滚动条顶部的距离；是一个**可读可写** 的属性；可以设置滚动出去的距离；

3 如何获取页面的卷曲出去的距离，由于不同的浏览器支持不一样有的支持window.pageXoffset, window.pageYoffset(股和火狐都不支持) 有的支持(html)document.documentElement.scrollLeft  ,document.documentElement.scrollTop(火狐)有的支持(body)document.body.scrollLeft, document.body.scrollTop(谷歌)

4 封装一个获取相对浏览器窗口偏移的兼容性代码：

```javascript
function scrollTop(){
return  window.pageYoffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ;
}
fuction scrollLeft(){
 return window.pageXoffset || document.documentElement.scrollLeft || document.body.scrollTop || 0 ;  
}
function getScroll() {
  	return{
      	left :  window.pageXoffset || document.documentElement.scrollLeft || document.body.scrollTop || 0 ;
	return top :  window.pageYoffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ;
  	} ;
}
```

5 HTML元素并没有像window对象那样的scrollTop( ) 和scrollBy( ) 方法 ；

### js  client 

1 ele.clientHeight  ele.clientWidth  用来获取元素可视区域的宽高，是一个**只读** 属性；**包括padding值，不包括border** ，**不包括滚动条**，对于内联元素只是0 ；

2 ele.clientTop  ele.clientLeft  用来获取元素的边框的宽度，以像素计；是一个**只读** 属性

3 如果元素设置了display:none ,不可见，那么无法获取宽高;结果为0；

### Submit

*  offsetWidth  offsetHeight  获取元素的元素的宽度包括 content+padding+border ,**包括border** ;scrollWidth  scrollHeight  clientWidth clientHeight  获取的元素的宽度仅仅包括content+padding,**不包括border **； 

*  offsetTop   offsetLeft  获取**该元素的border外边界** 距离已经定位了了**父元素的border内边界** 的距离，如果没有祖先元素都没有定位，则获取相对于body的边界的距离；scrollLeft  scrollTop  获取元素相对于**滚动条头部** 的距离，clientLeft  clientTop  获取元素的边框的宽度

*  以上所有的属性，只有scrollTop  和 scrollLeft  是一个可读可写的属性，其余仅仅可读 :语法 

```javascript
ele.scrollTop = number ; ele.scrollLeft  = number ;
```

```javascript
ele.scrollTop = 5  ;ele.scrollLeft = 10;
```

* 所有获取的结果是一个number类型的数字；设置值的时候也仅仅设置数字；

注意区分事件对象参数里面的 (都是只读属性)

*  offsetX  offsetY(偏移) 获取鼠标点击事件源相对于元素(content+padding)的左上角的坐标值,如果点击在border边界上的话，那么值为负数；
*  clientX  clientY 获取事件源相对于浏览器窗口的可视区域(不包括滚动条和工具栏)的左上角的坐标值 pageX pageY也是
*  screenX  screenY 获取的是鼠标点击点相对于显示屏的屏幕的左上角的坐标值

**滚动条是浏览器添加的，在内边距和边框之间添加了滚动条**

### 二   jquery  offset( )这是jquery中的一个方法

1 如果不传参数，那么可以获取该元素的距离body边界的距离；

2 如果传了参数，那么可以设置该元素距离body的边界的距离，

3 注意，无论该元素的**父元素是否定位** ，都是相对于**body** 边界的距离；这点和js不一样；

*  jquery对象.offset( )    ;  该方法有两个整形返回值，一个代表left  一个代表top 
*  jquery对象.offset().left    jquery对象.offset().top   可以获取left和top的值
*  jquery对象.offset( { left : 30 ,top : 20 }  )  可以设置该元素距离body边界的距离；

### jquery中如何获取元素的宽高

1 height( )只可以获取内容高度，也就是原本设置的height高度值，或者由内容撑开的高度值

2 innerHeight( ) ,获取的高度包括 padding，不包括边框  

3 outerHeight( ),获取的高度值包括 padding 和border ，不包括margin,outerHeight(false)，里面默认值是false，当设置为outerHeight(true)的时候，可以获取到margin的值；

3 width( )  innerWidth( )  outerWidth( )也是一样的道理

4 如果传入了数值参数，那么可以为元素设置宽高；

### jquery  scroll 

1 $("selector").scrollTop( )   、\$("selector").scrollLeft( )  不传参数的时候，可以获取该对象 相对滚动条顶部和左侧的偏移

2 $("selector").scrollTop( number)  、 \$("selector").scrollLeft(number) 传入参数的话，则代表可以设置相对滚动条顶部和左侧的距离

### 三  所有的HTML元素都有scroll  client offset这三组属性；

scrollHeight scrollWidth scrollLeft scrollTop   	

offsetHeight offsetWidth offsetLeft offsetTop  offsetParent

clientHeight clientWidth clientLeft clientTop 