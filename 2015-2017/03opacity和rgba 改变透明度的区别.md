---
title: opacity和rgba 改变透明度的区别
date: 2015-10-17 12:36:00
tags: css
categories:  css html
comments : true 
updated : 
layout : 
---

一  opacity和rgba 改变透明度的区别

需要注意，rgba()

*  仅仅改变的是背景的透明度，
*  不会对文本造成影响，不具有继承性

然而，opacity 

*  不仅会改变背景的透明度，
*  还会改变文本的透明度，并且具有继承性

二 代码演示：

```html
 <style>
        div{
            width: 500px;
            height: 100px;
            background-color:  rgba(344,24,67,.3);

        }
    </style>
	<div>这一段话是div里面的文字,opacity 透明度会改变字体的透明度 ，rgba  则不会
   		<p>这一段话是p里面的文字，如果对div设置透明度的时候，用opacity那么将会被继承，如果用rgba设置			透明度的时候，则不会被继承
      	</p>
	</div>	
```

```html
  <style>
        div{
            width: 500px;
            height: 100px;
            background-color:  rgb(344,24,67);
            opacity: 0.3;  
        }
    </style>
```

三  总结：在做项目的时候，尽量用rgba 来改变透明度，因为opacity透明度具有继承性，并且还会改变文本的透明度，会造成一些影响

