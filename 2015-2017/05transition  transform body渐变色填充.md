---
title: transition  transform 效果进阶1     body如何渐变色填充
date: 2016-11-12 12:36:00
tags: css3
categories: css 
comments : true 
updated : 
layout : 
---

transition  transform 效果进阶1     body如何渐变色填充

一  transition的拆分写

*  明确其拥有的四个属性值

 transition-property   发生渐变效果的属性

transition-duration  完成过渡效果的时间

transition- timing-function  完成过渡效果的动画效果 linear  ease ease-in ease-out

step-start= step(1 ,start)

step-end=step(1,end)  

steps( n1,n2),n1代表完成的步数，n2代表start或者end ,指定每一步的值发生变化的时间点。第二个参数是可选的，默认值为end。

transition-deplay  开始进行过渡效果的延迟

*  transition 属性连写

transition : all  2s  ease-in 1s

all 代表所有的属性都会有过渡效果，只要设置了，2s代表一个过渡效果的时间，ease-in 代表过渡的方式，1s代表延迟

二  transform属性(2d)(x 正方向水平向右，y正方向垂直向下，z正方向在垂直于窗口向外)

*  translate(x,y )  指定对象移动，基准是父盒子左上角，移动 x y z是代表距离左上角的距离translatex(length|percentage),translatey(number)指定x  y的移动距离。如果第二个参数省略，那么默认为0 ；其中百分比的基准是以元素自身的宽高为基准，然后乘以百分比，得到移动的距离值。

   ​	transform：translate(50px,40px)代表向右和向下移动50px  40px；

* scale(x,y) ,代表指定对象缩放比例，x，y分别对应x y轴的缩放。scalex(number) scaley(number),如果第二个参数省略默认和第一个参数相等。
* rotate(angle) 输入角度值，代表元素2d的旋转角度 需要有个transition-origin属性。关于旋转的方向：遵循“左手定则”大拇指指向轴的正方向，四指的方向就是旋转的方向，也是角度值为正的方向;rotate(angle),默认以z轴为基准进行旋转，rotatex(angel)，rotatey(angle),rotatez(angle) 以x和y轴为基准进行旋转(3D)。注意在3d里面才有rotatex(angel)，rotatey(angle),rotatez(angle)，在2d里面只有rotate(angle)
* skew(x,y) 指定x  y的扭曲距离。如果第二个参数省略，那么默认为0 ;skewx(number) skewy(number).

三 : 有关body的渐变色填充问题：

​	body默认是没有高度的，但是却可以直接给body设置背景颜色，这是为什么呢?好多人会问，不是应该元素有了宽高才能有背景色吗？

这里明确一点，body设置背景色是浏览器自动配置的，如果直接给body设置背景色，默认全部填充整个文档；即使body的高度是默认的高度。

走个小demo理解下这个问题、

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
		body {
			background-color: blue;
			/* background: linear-gradient(to bottom,rgba(0,0,255,0.1),rgba(0,0,255,0.5),rgb(0,0,255));*/
		}
	</style>
</head>
<body>
</body>
</html>
```

![纯色填充](img/1.jpg)

```html
body {
	background: linear-gradient(to
bottom,rgba(0,0,255,0.1),rgba(0,0,255,0.5),rgb(0,0,255));
		}	
```

![渐变填充出问题了](img/gradient.jpg)

给body一个高度：

​	height:100px	;

![给个高度](img/h.jpg)

我们会发现的问题是：纯色填充body没有问题，那么如何解决渐变填充body这种情况呢？

很简单，

```html
html,body {
  height :100% ;
}
```

![解决问题](img/solve.jpg)

四  ，写个demo玩一下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>	
	<style>
		html,body{
			height: 100%;
			margin: 0;
		}
		body{
			background: linear-gradient(to bottom,rgba(0,0,255,0.1),rgba(0,0,255,0.5),rgb(0,0,255));
			box-sizing:border-box;
		}
		.fish {
			width: 174px;
			height: 126px;
			background:url(img/fish.png) no-repeat;
			/*border: 1px solid #000;*/
			transition: all 2s linear;
		}
		body:hover .fish{
			transform:translate(1000px,500px) rotate(45deg) scale(.5,.5);
		} 
		/*背景图片默认左上角平铺，然后改变背景图片的位置即可*/
		.animation {
      		animation: autoMove 1s steps(8) infinite;
    	}
     /*动画关键字 */
    
	    @keyframes autoMove {
	    from {}
	      to {
	        background-position: 0 -1008px;
	      }
	    }

	</style>
</head>
<body>
	<div class="fish animation"></div>
</body>
</html>
```

![](img/gif.gif)



