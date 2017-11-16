---
title: jquery height  innerHeight outerHeight
date: 2016-04-17 12:36:00
tags: jQuery
categories: jQuery
comments : true 
updated : 
layout : 
---

一  看解释：

1 height( )只可以获取内容高度，也就是原本设置的height高度值，或者由内容撑开的高度值

2 innerHeight( ) ,获取的高度包括 padding，不包括边框  

3 outerHeight( ),获取的高度值包括 padding 和border ，不包括margin，

二  撸代码：

*  不写参数可以获取当前值

```html
<style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            border: 5px solid #000;
            position: absolute;
            width: 300px;
            height: 200px;
            margin: 100px;

        }
        p{
            border: 1px solid green;
            width: 200px;
         	height:18px
            padding: 10px;
            margin: 20px;
        }
    </style>
	<div>
      <p id="p2">这是一个段落</p>
	</div>
	<script src="jquery-1.12.2.js"></script>
<script>
    console.log($("#p2").height());       //18     padding   18  margin 18
    console.log($("#p2").innerHeight());  //18               38         38
    console.log($("#p2").outerHeight());  //20               40         40
</script>

```

代码解释：padding  和  margin 逐渐加上之后，输出值变化如注释所示。

*  写了参数可以设置  height(number)  innerHeight(number)  outerHeight(number) 它们各自代表的高度的值 
*  写了参数也可以这么设置 height(number+"px") 栗子: $("selector").height(100+"px");
*  Tips  $("selector").width(number) 等价于 \$("selector").css("width",number);

```html
<script>
    $("#btn").click(function(){
        $("#p2").height(30);
        $("#p2").innerHeight(60);
        $("#p2").outerHeight(70)；
        console.log($("#p2").height());
        console.log($("#p2").innerHeight());
        console.log($("#p2").outerHeight());
    })
</script>
```

三：width( )  innerWidth( )  outerWidth( )也是一样的道理。

四：这些方法对隐藏元素和显示元素均有效。

五：如果获取的元素是一个节点列表，那么可以获取或者设置该列表元素的额第一个元素的宽高；

六 ：window对象的尺寸 

### js  中有三种方法能够确定浏览器窗口的尺寸（浏览器的视口，不包括工具栏F12和滚动条）。

```javascript
对于Internet Explorer、Chrome、Firefox、Opera 以及 Safari
- window.innerHeight - 浏览器窗口的内部高度 
- window.innerWidth - 浏览器窗口的内部宽度 
对于 Internet Explorer 8、7、6、5：
- document.documentElement.clientHeight 
- document.documentElement.clientWidth 
或者
- document.body.clientHeight 
- document.body.clientWidth 
//封装一个兼容各个浏览的代码
var height = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight
var width = window.innerWidth || document.documentElement.clientWidth || docuemnt.body.clientWidth 
```

### jQuery中

```javascript
$(window).height()    $(window),width() ;
```

