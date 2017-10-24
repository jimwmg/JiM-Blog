---
title: jquery中position 方法
date: 2015-12-15 12:36:00
tags: jQuery
categories: html
comments : true 
updated : 
layout : 
---

### position()  jquery   DOM

一  相关position定位基准建议回顾：

 1 DOM 中获取元素定位相关属性的方法：

obj.style.property    obj.currentStyle(attr)   window.getComputedStyle(element,null)[attr]  

将attr设置为  定位的 left  top 等 即可。

2 jquery中获取定位元素的偏移，官方文档定义：获取匹配元素相对父元素的偏移。

返回的对象包含两个整型属性：top 和 left。

嗯，就是这么简洁。初学者需要注意,官方文档说的很模糊，我在这里详细说明一下：

二 代码：

```html
 <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            border: 5px solid #000;
            width: 300px;
            height: 200px;
            margin: 100px;

        }
        p{
            border: 1px solid green;
            width: 200px;
            position: absolute;
            padding: 10px;
            margin: 25px;
        }
    </style>
<div><p id="p2">这是一个段落</p></div>
<script src="jquery-1.12.2.js"></script>
<script>
    var pos = $("#p2").position();
    console.log(pos);//object
    console.log(pos.top);//105
    console.log(pos.left);//105
</script>	
```

定位还是按原来的走：

*  如果父元素有除了static定位以外的定位，那么就相对于父元素进行定位；
*  如果父元素没有定位，那么就相对于body定位
*  定位的基准是 ：子元素整体(margin +border+padding+content)的最外边界，相对于有定位的父元素或者body的内边界。

如果给div加一个定位 

```html	
	position: absolute;
```

此时：

    console.log(pos);//object
    console.log(pos.top);//0
    console.log(pos.left);//0
三：总结，jquery中position(  )方法不能对定位进行设置，只能获取定位的top  left 值，如果要设置定位的坐标，还是的用 css(  ) 方法。