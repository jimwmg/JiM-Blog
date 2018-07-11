---
title: margin  auto  position定位使盒子居中
date: 2016-05-23 12:36:00
tags: css
categories: css html
comments : true 
updated : 
layout : 
---

position定位如何在父盒子居中 

因为position默认值是static,所以对于absolute的元素都要先找到其祖先元素中最近的 position 值不为 static 的元素，如果找不到则定位的基准就是body；

一 简单了解position定位取值：

*  position:left right bottom top     length | %
*  length  是确定单位距离的取值，单位以px  em等
*  百分比%,此时要明确百分比对应的取值标准，水平方向 left= 百分比值 X 父元素的宽度(基准是父元素padding+width)，垂直方向 top = 百分比值 X 父元素的高度(此时基准是父元素的padding+height)；前提是父元素设置了除 static之外的定位，否则，百分比取值基准是浏览器的高度和宽度。

二  margin 取值

*  auto：水平（默认）书写模式下，margin-top/margin-bottom计算值为0，margin-left/margin-right取决于可用空间；这也是**块级元素的流体特性** 。**思考 auto 的取值什么时候会起作用**。
*  length : 用长度值来定义外补白。可以为负值 
*  百分比： 用百分比来定义外补白。水平（默认）书写模式下，参照其包含块 [width](../dimension/width.htm) 进行计算，其它情况参照 [height](../dimension/height.htm) ，可以为负值

三：理解margin的auto取值问题：

*  标准流下的margin的auto取值：对于块级元素，margin: 0 auto ;可以使块级元素居中显示，就是利用了块级元素的流体特性

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        .bigbox {
            width: 800px;
            height: 200px;
            margin: 100px auto;
            //使bigbox在body中居中
            border: 1px solid #000;        
        }  
        .smallbox {
            width: 100px;
            height: 100px;
            background-color: limegreen;  
            margin:0  auto;
            //使smallbox在bigbox中居中
        }
    </style>
</head>
<body>
<div class="bigbox">
    <div class="smallbox"></div>
</div>
</body>
</html>
```



*  标准流下的auto取值：如果发生了元素转化，块级元素转化为行内块元素,display:inline-block  position float 等

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        .bigbox {
            width: 800px;
            height: 200px;
            margin: 100px auto;
            //使bigbox在body中居中
            border: 1px solid #000; 
          position:absolute;
          //display:inline-block;
          
        }  
        .smallbox {
            width: 100px;
            height: 100px;
            background-color: limegreen;  
            margin:0  auto;
            //使smallbox在bigbox中居中
          position:absolute;
          //display:inline-block;
        }
    </style>
</head>
<body>
<div class="bigbox">
    <div class="smallbox"></div>
</div>
</body>
</html>
```

建议大家拿到自己的浏览器上看效果：此时  margin的 auto 你会奇怪的发现不起作用了。

bigbox不在body中居中，smallbox不在bigbox中居中。

**auto：水平（默认）书写模式下，margin-top/margin-bottom计算值为0，margin-left/margin-right取决于可用空间。品味这句话：我们可以理解，块级元素独占一整行，即使设置了宽高，仍然独占一整行；而行内块元素却不是。所以 ，margin   的auto值对于块级元素使用时候，会使其居中显示，而对于行内块元素使用的时候，却不会使其居中。**

四：定位使盒子居中的方法：

两种方法：

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        .bigbox {
            width: 800px;
            height: 200px;
            margin: 100px auto;
            border: 1px solid #000;
            position: relative;
        }
        .smallbox {
            width: 100px;
            height: 100px;
            background-color: limegreen;
            position: absolute;
            left: 50%;
            /*定位的百分比  left=百分比*父元素的宽度*/
			margin-left: -50px;
        }
        
    </style>
</head>
<body>
<div class="bigbox">
    <div class="smallbox"></div>
</div>
</body>
</html>		
```

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        .bigbox {
            width: 800px;
            height: 200px;
            margin: 100px auto;
            border: 1px solid #000;
            position: relative;
        }

        .smallbox{
            background-color: limegreen;
            width: 100px;
            height: 100px;
            position: absolute;
            left: 0;
            right: 0;
            margin:0  auto;
        }       
    </style>
</head>
<body>
<div class="bigbox">
    <div class="smallbox"></div>
</div>
</body>
</html>
```



其中第二种方法适用于不知道子元素的高宽的时候想要使子元素居中的效果。其实也是利用了流体特性，因为元素既要距离左边距0 又要距离右边距0 同时给该元素设置了margin:0 auto; 所以会用margin值填充左右的补白；

扩展：如果去掉bigbox的宽度设置，那么，无论浏览器的窗口如何变化，都可以使盒子居中，包括大盒子的body居中，小盒子在大盒子居中。