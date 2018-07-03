---
title: js event compare with jQuery event
date: 2016-10-22 12:36:00
categories: javascript event
tags : event
comments : true 
updated : 
layout : 
---

## js  jQuery绑定事件的比较:

### 一 事件分类

```javascript
1 window 事件:onload  onunload onafterprint onbeforeprint onerror  onresize 
2 From表单 事件(仅在表单元素中有效):onblur  onfocus onreset onsubmit onselect onchange  oninput
3 键盘事件 : onkeydown  onkeyup onkeyup
4 鼠标事件: onclick onmouseout onmouseleave onmouseenter onmousedown onmouseup onscroll(当元素滚动条被滚动的时候) ondrag ondragstart ondragend ondragenter ondragover ondragleave ondrop 
//键盘事件和鼠标事件在base, bdo, br, frame, frameset, head, html, iframe, meta, param, script, style, title 元素无效；
5 触摸事件 :touchstart touchend touchmove 
6 媒介事件 : 
7 自定义事件:
8 所有的事件都是成元素的一个属性，原始值为null;输出一个DOM元素可以查看其所有的属性;
```

### 二 绑定事件

*  JS绑定事件:(onclick之类的本身就是一属性，通过给属性设置函数，可以使其具有功能，而addEventListener是一个函数，通过函数体的内容给元素绑定事件)

```javascript
ele.on+事件类型 = function(){  };     ele.addEventListener("事件类型"，function(){ } );
ele.onclick = function(){ };		ele.addEventListener("click",function(){ } );
ele.onmouseout = function(){ };      ele.attachEvent("onclick",function(){ } );(注意有on)
window.onlaod = function(){ };		window.addEventListener("load",function(){ } );
ele.ondragstart = function(){ };	ele.addEventListener("dragstart",function(){ } );
```

**注意**: 触摸事件只能通过addEventListener来绑定,过渡结束事件(自定义事件)

```javascript
ele.addEventListener("touchstart",function(){ } );
```


* JS移除事件(该事件通过什么方式绑定的就要通过什么方式移除)

```javascript
// 1注册事件
	my$("btn1").onclick = fn;//(onclick指向一个函数体)
//1移除事件
	my$("btn1").onclick = null;//(将指向设置为null,则可以清除事件)
// 2 注册事件
my$("btn1").addEventListener("click",fn,false);
// 2 移除事件
my$("btn1").removeEventListener("click",fn,false);
// 3 注册事件  谷歌和火狐不支持
 my$("btn1").attachEvent("onclick",fn);
// 3 移除事件
 my$("btn1").detachEvent("onclick",fn);
```


* jQuery绑定事件和移除事件

```javascript
--ready(fn):当DOM元素载入就绪就可以执行的一个函数
data 是传递给jQuery事件对象参数event.data的数据，fn是绑定在该事件上的处理程序，events和type是要绑定的事件类型

--$("selector").on(events,data,fn)   可以一次绑定多个事件  
  $("selector").off(events,data,fn)  移除on绑定的事件 如果不写任何参数，则移除匹配元素的所有事件
  $("selector").bind(type,data,fn)   可以一次绑定多个事件，可以绑定自定义事件;
  $("selector").unbind(type,data,fn) 移除bind绑定的事件 如果不写任何参数，则移除匹配元素的所有事件

--$("selector").mouseover(), $("selector").mouseover(fn)  如果不写参数，将触发选定元素的该事件，如果写   了函数体，则将为选定的元素绑定事件  
  mouseout  mousemove  mouseenter mouseleave mouseup mousedown  click keyup keydown change blur
    都是一样的特性，如果不传函数体，就是触发该事件;如果传了函数体，就是绑定该事件的处理程序.
--$("selector").hover(fn(in)/fn(oout)  可以给选中的元素绑定hover事件，鼠标悬浮在上面的时候，执行			fn(in),鼠标离开元素的时候执行fn(out);

//事件委派 使用 delegate() 方法的事件处理程序适用于当前或未来的元素（比如由脚本创建的新元素）。

--$("selector1").delegate("selector2","type",fn)  selector1必须是selector2的父元素，事件的执行程序绑定在selector2(子元素选择器)上 。
```

### 三   js  和  jQuery 绑定事件的区别 

*  两者绑定的事件符合事件的传播过程，比如冒泡，捕获
*  两者的事件对象参数基本一致，不同点在于jQuery绑定的事件，事件对象参数多了两个参数，一个是event.originalEvent  一个是event.data 

### 四 自定义事件底层实现原理

```javascript
// 绑定事件
function addEvent(obj,type,fn){
  obj.listener = obj.listener || {};
  obj.listener[type] = obj.listener[type] || [];
  obj.listener[type].push(fn);
}

// 触发事件
function fireEvent(obj,type){
  var arr = obj.listener[type];
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
```

