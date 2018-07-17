---
title:  css3 background
date: 2016-11-22 12:36:00
categories: css3
tags : css3
comments : true 
updated : 
layout : 
---

CSS3 background-origin clip size 背景

1 盒子大小大于背景图的大小，如何避免精灵图周边的其他图片显示出来

一  对于背景色：（背景色默认从border-box处开始填充；背景图片默认从padding-box处开始填充,注意必须设置no-repeat）

*  background-clip : border-box || padding-box || content-box || text 

 定义元素的**背景图像或者背景色**从何处开始**向外** 裁剪，默认值是border-box；

*  bakcground-origin : border-box || padding-box || content-box  该属性改变**背景图像** 的填充开始原点，对**背景色** 没有影响;默认值是padding-box,即从元素盒子的padding处开始填充；

**重点重新理解下：其实是用于决定背景图像从那个区域开始显示**

border-box：从border区域（含border）开始显示背景图像。

padding-box：从padding区域（含padding）开始显示背景图像。（默认值）

content-box：从content区域开始显示背景图像。

定义元素的**背景图像** 从何处开始填充，即填充开始的原点；**默认值是padding-box ；**

**注意背景图像必须设置为  no-repeat才会有效果，不然将会完全平铺** 

*  background-size : auto || length || percentage || cover || container 

该属性值设置背景图像的大小，

*  auto是默认值，即背景图像的真实大小，
*  length 可以直接设置背景图像的大小，会将背景图像进行压缩 ，
*  percentage 以百分比设置背景图像的大小，百分比的基准是盛放背景图像的元素的宽高，而不是背景图像本身尺寸的宽高，

**重点理解百分比的基准值是：**当属性值为百分比时，参照背景图像的[background-origin](http://css.doyoe.com/properties/backgrounds/background-origin)区域大小进行换算（而不是包含块大小）。如果改变 background-origin的值 content-box,那么百分比的基准值就是 content 的宽高；

*  length和percentage如果只设置一一个值，那么将设置为背景图像的宽度尺寸，第二个值默认auto,根据宽度进行等比缩放；
*  cover 会将背景图像进行**等比** 缩小或者放大，使其可以完全覆盖容器 ，此时背景图像可能会溢出；
*  container会将背景图像进行**等比**缩小或者放大到宽度或者高度与容器的宽度或者高度一样，使其可以完全在容器内，此时容器可能会有空余空间；

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        div{
            border: 10px dashed blue;
            width: 150px;
            height: 150px;
            background-color: red;
            margin: 50px auto  ;
            padding: 20px;
        }
    </style>
</head>
<body>
<div></div>
</body>
</html>
```

```css
给div依次设置以下属性:
background-clip: border-box;  //会将背景从border开始向外剪裁
background-clip: padding-box; //会将背景从padding开始向外剪裁
background-clip: content-box;  //会将背景从content开始向外剪裁
注意背景默认是填充border边界的，即以border-box为默认值
**对于背景色而言，永远都之直接填充包括border-box为边界内部的区域，background-origin对背景色不起作用;
background-origin:border-box; 
background-origin: padding-box;
background-origin: content-box;
```

将这三个属性依次设置给div ,效果如下：

![border-box](img/back1.jpg)   ![padding-box](img/back2.jpg)



![content-box](img/back3.jpg)

二 对于背景图像：

```html	
 div{
            border: 10px dashed blue;
            width: 150px;
            height: 150px;
            background-color: red;
            margin: 50px auto  ;
            padding: 20px;
            background: url("img/01.jpg") no-repeat;

        }
```

```html

            /*background-clip: border-box;*/
            /*background-clip: padding-box;*/
            /*background-clip: content-box;*/
和背景色一样，都是向外裁剪，但是需要注意，背景图像填充的时候，默认是以padding-box，即padding左上角为原点进行填充整个div的，也就是说，div的上边框和左边框不会被填充，但是下边框和有边框会被填充，如果想要所有的边框被填充，那么需要设置background-origin:border-box ;
```

三 background属性连写:新版CSS3支持可以写多个背景连写在一起,中间用逗号隔开，最后以分号结尾

```
background: 
url(img/bg1.png) no-repeat left top,
url(img/bg2.png) no-repeat right top,
url(img/bg4.png) no-repeat left bottom,
url(img/bg3.png) no-repeat right bottom,
url(img/dog.gif) no-repeat center/400px 270px;
background:none  [0% 0%] /auto repeat  scroll padding-box content-box transparent
background:image  pisition size repeat attachment origin clip color
```

