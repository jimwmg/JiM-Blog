---
title: background-position
date: 2017-9-26
categories: typescript
tags: css
---

## 写在开头：

###background-origin：content-box || padding-box || border-box 

| 值           | 描述              | 测试                                       |
| ----------- | --------------- | ---------------------------------------- |
| padding-box | 背景图像相对于内边距框来定位。 | [测试](http://www.w3school.com.cn/tiy/c.asp?f=css_background-origin) |
| border-box  | 背景图像相对于边框盒来定位。  | [测试](http://www.w3school.com.cn/tiy/c.asp?f=css_background-origin&p=2) |
| content-box | 背景图像相对于内容框来定位。  | [测试](http://www.w3school.com.cn/tiy/c.asp?f=css_background-origin&p=3) |

以下默认backgroun-origin:padding-box；为默认值；

###background-position

##一  当给一个元素设置背景图片的时候，背景图片的background-position可以设置背景图片的位置：有以下几种方式：

语法：
background-position : length || length
background-position : position || position 
####第一个值代表是水平位置，第二个值代表是垂直位置；
a  两个值默认都是  0%  0%  表示背景图片在元素的左上角显示，超出部分无法显示
b  如果只设置了其中一个，另外一个没有设置，那么默认是居中效果，超出部分无法显示
c  如果没有设置background的值，默认是在元素区域（content（width+height）+padding）左上角显示，不受padding值影响
d  其实，背景图片嘛 ，就是给内容区域（content（width+height）+padding）设置的背景，所以不会受padding的“挤压  打压”。
length : 　百分数 | 由浮点数字和单位标识符组成的长度值
position : 　top | center | bottom | left | center | right 
####注意点：第一：必须首先指定background-image链接
#### 第二：明确基准问题，图片的背景位置是相对于图片所在元素的整体的宽高（content+padding：也就是boder内边界而言的）；

第一种：由浮点数字和单位标识符组成的长度值，比如 em   ex  px  等单位
background-position ： 10px  20px ;表示距离元素左边border内边界10px  ，距离元素上边border内边界20px;
第二种：top | center | bottom | left | center | right 
backgroun-position：right  top ;表示图片在元素(content+padding)围成的***区域***中，水平位置居中，垂直距离图片顶部紧贴***区域***顶部;
####第三种，通过百分数设置宽度；重点说明（看这个和尚是不是天龙八部的虚竹，尜尜）
![先上传图片有需要的小伙伴可以下载实验，](http://img.blog.csdn.net/20170107171016346?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzU4MDkyNDU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

html代码
​	
	#img {
			background:no-repeat url('images/con-1.jpg');
			background-position: 50% 50% ;
			padding-left: 100px;
			margin: 100px;
			width: 680px;
			height: 620px;
			border:2px green solid;
			border: 50px blue solid;
			/*图片的大小是width 380*height 320*/
		}
		
		<div id="img"></div>
容器的宽高等于  content+padding   此时 容器的宽度  W = 680px+100px(padding-left)
容器的高度等于    H = 620px （没有设置padding）；

相对于左边的距离  x  = ( W - 380 ) * 50% ;  200px
相对于上边的距离 y = ( H - 320 ) * 50% ; 150px 

等价于  background-position : center  center;

![这里写图片描述](http://img.blog.csdn.net/20170107173602639?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzU4MDkyNDU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

	background-position: 100% 100% ;

此时 x = ( W - 380 ) *100% ;   400px
	 y = ( H - 320 ) * 100%;  300px

等价于  background-position : right  bottom;

![这里写图片描述](http://img.blog.csdn.net/20170107173845469?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzU4MDkyNDU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#二 重点理解：
第一，背景图片的百分比其实是相对于（元素的宽高 - 图片的宽高）为基准，
第二，背景图片是元素的背景，不受padding的影响，但是后期计算元素的宽高要算上padding
第三，如果两个值都不设置，那么默认相对于元素左上角对齐，如果只设置了其中的一个，那么另外一个默认居中。
#三，还有一种情况就是容器的宽度小于图片的宽高，其定位仍然遵循这个规律，只不过超出部分会无法显示，这也是精灵图实现的原理。


相关链接：http://blog.csdn.net/qq_35809245/article/details/53638986

