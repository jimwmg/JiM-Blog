---
title:  boostrap基础 
date: 2016-03-22 12:36:00
categories: boostrap
tags : boostrap
comments : true 
updated : 
layout : 
---

1 理解其核心思想:通过组合样式对标签进行样式操作，从而到达控制页面的样式以及网页结构

2 bootstrap环境搭建:引入相应的css  javascript

3 如何理解Bootstrap移动端优先，通过其媒体查询设置宽度可窥一二,Bootstrap框架代码的百分比设置优先基于

```css
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
/*默认移动端设备优先  width < 768px*/
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
/*sm 屏幕设备  768px < width < 992px*/
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}
/*md屏幕设备 992px < width < 1200px */
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
/*lg 屏幕设备 width > 1200px*/
```

4 Bootstrap 实现移动端自适应布局的基础是根据宽度 100% 设置自适应布局，宽度基准是以父元素的宽度为基准的。

5 栅格系统:如何理解 col-xs-*(超小屏<768px) col-sm-*(小屏768px  992px) col-md-*(1200px>中等屏 >992px) col-lg-* (大屏 >1200px)

```css
/* 超小屏幕（手机，小于 768px） */
/* 没有任何媒体查询相关的代码，因为这在 Bootstrap 中是默认的（Bootstrap 是移动设备优先的） */
/* 小屏幕（平板，大于等于 768px） */
@media (min-width: @screen-sm-min) { ... }
/* 中等屏幕（桌面显示器，大于等于 992px） */
@media (min-width: @screen-md-min) { ... }
/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media (min-width: @screen-lg-min) { ... }
```

```html
<div>
  	<div class="col-xs-6 col-sm-4 col-md-3">
      col-xs-6会优先作用，查看bootstrap源码可以得知，col-sm-4需要在@media(min-width : 768px){}成立的时		候，该类才会起作用，col-md-3需要在@media(min-width : 992px){}成立的时候才会起作用。
	</div>
   	<div class="col-xs-6 col-sm-4 col-md-3">
          源码中的书写顺序如下:
              .col-xs-6 {
                    width:100%;
              }
      			col-xs-*  是可以全局使用的
	</div>
   	<div class="col-xs-6 col-sm-4 col-md-3">
            @media(min-width : 768px){
                .col-sm-4 {
                     width: 33.33333333%;
                }  
            }
	</div>
   	<div class="col-xs-6 col-sm-4 col-md-3">
            @media(min-width : 992px){
                .col-md-3{
                    width: 25%;
                }
            }
	</div>
</div>
```

由此可见col-  类主要是改变元素的样式属性，width 的值，所以无论什么情况下，

```css
col-xs-6 { width:100%}
```

都是可以起作用的，但是当屏幕的大小变化的时候，比如由**超小屏幕**变化到—>**小屏幕** ,此时

```css
  @media(min-width : 768px){
                .col-sm-4 {
                     width: 33.33333333%;
                }  
            }
```

将会起作用，**覆盖** 掉原来的width：100%设置，变为width:33.3333333%;同理变为中等屏幕的时候，此时

```css
 @media(min-width : 992px){
                .col-md-3{
                    width: 25%;
                }
            }
```

将会起作用，覆盖掉原来的width:33.3333333%，变为width:25%.

**此时在回过头来理解Bootstrap是移动设备优先的这句话，可以看出，移动设备(width<768px)的时候，类样式默认没有使用条件，不需要媒介查询判断，任何时候都可以使用，但是其他屏幕设备上就需要通过媒介查询来判断该类样式是否可以执行**   

6 Bootstrap源码在全局定义了box-sizing:border-box ，所有的HTML元素都是以边框为准进行的宽度计算，内容会被压缩

```css
* {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
*:before,
*:after {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
```





