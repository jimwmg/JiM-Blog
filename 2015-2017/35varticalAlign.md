---
title:  vertivalAlign
date: 2016-02-27 12:36:00
categories: html
tags : html
comments : true 
updated : 
layout : 
---

vertical-align  

1 在一行中，行内元素默认是以baseline为基准进行垂直对齐的，行内元素包括  img  a  span 等

2 baseline 基线:可以简单的理解为是在四线格中字母x的底部的那根线

3 img标签默认对齐行内的文本的基线

4 那么由于图片默认对齐基线，会在下面出现几像素的间隙，如何去除该间隙？

5 先来看看间隙的产生：(注意浏览器默认字体大小，所以对于所有的DOM元素都有)

```html
.div1{
  font-size:50px;
}
<div class="div1">
    <span>该行的基线以文本的baseline为基准</span> <img src="img/01.jpg" alt="" width="20px"/>
</div>
```

一 : 既然产生间隙的根源是**行内元素** 默认以**文本**的基线为基准的对齐方式导致的，那么只需要将改行的文本字体大小设置为font-size 为0  即可这行代码将图片所在行的文本大小设置为0 ，由于文本相关属性的继承性，该元素内所有元素的文本大小均为0px，所以此时可以消除间隙

```html
.div1 {
  font-size:0px	;
}
```

二:既然间隙是有行内元素默认以改行的文本的baseline为基准进行垂直方向的对齐，那么将图片设置为块级元素，也可以消除间隙：

```html	
 .div1>img{
            display: block;
        }
```

三 利用vertical-align属性：设置元素的对齐方式 可能值 baseline  top bottom middle text-top text-bottom

```html
.div1>img{
  vertical-align:bottom;
}
```

四 如果想要更好地理解vertical-align属性的作用，可以将图片width="20px"，改成可以和字体比较的大小，然后文本设置font-size设置大一些，然后看效果，有助于理解vertical-align的属性。