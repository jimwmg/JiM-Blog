---
title:  jQuery核心
date: 2016-07-10 12:36:00
categories: jQuery
tags : jQuery
comments : true 
updated : 
layout : 
---

jQuery核心

一 对象访问

1 each(callback)方法：定义 $("selector").each(callback),为每一个匹配到的元素作为**上下文** 执行callback函数；

*  首先这是一个循环，会给所有匹配到的DOM元素执行callback函数；
*  每次执行传递进来的callback函数的时候， 函数中的this关键字都指向不同的元素(注意this指的是DOM对象，而不是jquery对象，$(this)可以返回jquery对象)
*  每次执行函数的时候，都会给函数传递一个当前执行函数的元素在所有匹配到的元素集合中的所处位置作为参数(从0开始的整形)
*  如果callback中   return:false ,将停止循环；返回 true 将继续执行循环函数

2 get(index)方法，将匹配到的jquery对象作为DOM对象返回：定义 $("selector").get(index),可以返回第几个DOM元素

* 如果不传参数  $("selector").get(),那么将返回所有匹配到的DOM元素集合；
* 如果传递参数 $("selector").get(n)那么将返回匹配到的第n个DOM元素；

3 length属性和size()方法  $("selector").length  ,\$("selector").size()  将返回匹配到的所DOM元素的个数；

4 context属性和selector属性 $("selector").context 返回DOM元素被选中的上下文  ，\$("selector").selector  返回选择器；

5 $('selector').index() :如果不传参数，那么返回匹配元素在其同辈元素中的位置

二 核心函数 

1 jQuery("selector",[context])  :选择器  在context中查找元素 ，不仅仅可以匹配到页面中的DOM元素，还可以匹配到script等，如下栗子

```html
<script id="jq" src="jquery-1.12.2.js"></script>
<script> code here </script>
$("#jq"):获取唯一id的script (第一个)   $("script") :获取页面中所有的script,此语境下可以获取两个;返回的同样是jQuery对象那个，然后也可以用jQuery的方法。
```

2 jQuery(html) :可以创建元素  $("<p>通过jquery动态创建元素</p>");

3 jQuery(function(){  }) :文档就绪执行函数

4 $("button").click(function () { $("div").each(function (index, domEle) {   // domEle == this   $(domEle).css("backgroundColor", "yellow");    if ($(this).is("#stop")) {   $("span").text("Stopped at div index #" + index);   return false;   } });});

三 : each(callback) 函数的每次循环都会向函数传入一个index元素位置参数的理解:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        div{
            border: 1px solid #000;
            height: 50px;
            width: 100px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
<button>Change colors</button>
<span></span>
<div></div>
<div></div>

<div></div>
<div></div>
<div id="stop">Stop here</div>
<div></div>

<div></div>
<div></div>
<script src="jquery-1.12.2.js"></script>
<script>
    $(function(){
        $("button").click(function(){
           $("div").each(function(index,DOM){
                console.log(arguments);
                console.log(index+DOM);
           })
        });
    });
</script>
</body>
</html>
```

each(callback)中的回调函数中有两个参数，一个是 代表元素当前位置的整形数值，从0开始；一个是当前的DOM元素。(注意不是jQuery对象)

四     **$**   或者  **jQuery**  (注意不是jquery)  是顶级对象.

```html
console.log($)  console.log(jQuery)  结果是一样的;
```

注意区分 $.each(obj,callbakc)需要传入两个参数，一个对象，一个函数;\$("selector").each(callback),只需要传入一个函数即可; callback函数中也会传入两个参数，第一个是当前元素的索引位置(从0开始计)，第二个是当前DOM元素。

``` javascript
console.log($.each);//结果如下
each: function( obj, callback ) {
  var length, i = 0;

  if ( isArrayLike( obj ) ) {
    length = obj.length;
    for ( ; i < length; i++ ) {
      if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
        break;
      }
    }
  } else {
    for ( i in obj ) {
      if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
        break;
      }
    }
  }
```

```javascript
console.log($("selector").each) //结果如下
each: function( callback ) {
  return jQuery.each( this, callback );
}
```



