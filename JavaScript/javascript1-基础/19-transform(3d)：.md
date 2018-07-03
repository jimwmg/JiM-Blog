---
title: Transform 
date: 2016-11-19 12:36:00
tags: transform
categories: css
comments : true 
updated : 
layout : 
---

Transform(3d)：x轴向右是正方向，y轴向下是正方向，z轴垂直向外是正方向；注意transform:rotate(angle)，可以使元素发生旋转，发生旋转之后的元素，其对应的  x  y  z的方向指向会发生变化，本文重点讲解；

**在设置transition的前提下，transform变换才会有类似动画的效果**

一：首先看一些有关3d的常用属性：

*  transform-origin：参数1   参数2 

 设置对象的围绕的旋转中心，默认值是50% 50% 

参数1 取值：百分比  基准是元素自身宽度，length 值，left center right  分别旋转中心是水平方向的左边界  居中 和右边界

参数2  取值：百分比  基准是元素自身高度，length 值，top center bottom  分别旋转中心是水平方向的左边界  居中 和右边界

如果第二个值没有设置默认是50%；

*  transform-style:flat | preserve-3d  默认是flat

 指定某元素的子元素是（看起来）位于三维空间内，还是在该元素所在的平面内被扁平化。只有在设置该属性值为preserve-3d的时候，才会有rotatex  rotatey rotatez属性值，因为在2d里面只有rotate  

当该属性值为「preserve-3d」时，元素将会创建局部堆叠上下文。 
决定一个变换元素看起来是处在三维空间还是平面内，需要该元素的父元素上定义 <' transform-style '> 属性。

* perspective ：none |length    默认是none

指定某元素距离浏览器窗口的垂直于浏览器窗口的距离，当length>0  的时候，会使得元素看起来比实际要大，length<0 的时候，会使得元素看起来比实际要小。

*  translate3d(x,y,z )三个参数不允许省略；

二  老司机带带我，不要走错路

transform: rotate(angle)  translate(length  | percentage)之间的关系。translate的百分比取值元素自身的宽(x)和高(y)来确定移动的距离。

1 明确浏览器的解析过程，从上到下  从左到右

2 明确rotate()会使坐标也跟着旋转  

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        img {
           /*transform: translateX(1000px) translateY(500px) rotateZ(90deg);*/
          transform: translateX(1000px) rotateZ(90deg) translateX(500px);
    </style>
</head>
<body>
<img src="img/car.jpg" alt="" />
</body>
</html>
```

*  代码执行过程1：

transform: translateX(1000px) translateY(500px) rotateZ(90deg);

对应的图片如下：执行过程是先向x轴正方向移动1000px，在向y轴正方向移动500px,然后图片围绕元素中心旋转90deg。 

![图xy1 : xy轴如下  ](img/xy1.jpg)

执行完之后是

![图xy2  :执行完rotateZ(90deg)](img/xy2.jpg)

*  代码执行2 

  transform: translateX(1000px) rotateZ(90deg) translateX(500px);

最初状态是     图xy1  先向x轴正方向移动1000px 然后执行rotateZ(90deg),此时图片变换为   图xy2  所以这一步还是对应translateX(500px)来移动飞车。

注意：一般建议将旋转放在最后。不过还是眼看项目实际需求来

三  撸一段动画大家体验下：

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        img {
            width: 200px;
        }
        @keyframes autoMove{
            20%{
                /*0~40%的时候的变换过程,初始默认x向右 y向下 z垂直向外*/
                transform:translatex(1000px)
            }
            25%{
                /*40%~50%的时候的变换过程*/
                transform: translatex(1000px)  rotatez(90deg);
            }
            50%{
                /*50%~90%时候的变换过程*/
                transform: translatex(1000px) translatey(500px) rotatez(90deg) ;
            }
            55%{
                /*注意每次的变化都是在上一次的基础上进行变化*/
                transform:translatex(1000px) translatey(500px)  rotatez(180deg);
            }
            75% {
                transform:translatex(0px) translatey(500px) rotate(180deg);
            }
            80% {
                transform: translatex(0px) translatey(500px) rotate(270deg);
            }
            95% {
                transform: translatex(0px) translatey(0px) rotate(270deg);
            }
            100%{
                transform:translatex(0px) translatey(0px) rotate(360deg);
            }

        }
        .autoMove{
            
            animation:autoMove 5s linear ;
        }

    /*注意，每次动画都要保持上一步动画的结果，才能继续进行动画，如果不保持上一步动画的结果，那么会导致动画回归到原来的值*/
    </style>
</head>
<body>
<img src="img/car.jpg" alt="" class="autoMove"/>
</body>
</html>
```

1 建议将每个阶段的动画注释掉，看下效果。

2  旋转的效果都是放在了最后，避免混乱。

![gif动画效果](img/car.gif)

