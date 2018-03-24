---
title:  width 百分比取值基准 
date: 2016-11-22 12:36:00
categories: html
tags : html
comments : true 
updated : 
layout : 
---

**对于inline元素，宽度由内容决定，不能设置宽度，无效**

**对于inline-block  block 元素可以设置宽高**

width  百分比取值相对基准问题

一 ：标准流下，父元素不定位，不浮动，子元素的100% width相对于哪个元素的width进行取值

二：脱离标准流之后，父元素设置了定位或者浮动之后，子元素的100% width相对于哪个元素的width进行取值

注意理解：

*  当**子元素**`是`**标准流**的元素的时候，(包括子元素设置position:relative，也是永远相对于父元素的宽高为基准)

  无论**父元素是否是标准流** 的元素，**子元素**的width和height的百分比取值永远都是**相对于父元素**的;

此时无论父元素是否设置定位，子元素的width height padding margin 通过百分数取值的时候，都是相对于其**直接父元素**。

* 当**子元素**`不是`**标准流**的时候，比如子元素设置了position:absolute；

   此时子元素的宽高百分比设置的时候，百分比的宽高基准是顺着DOM元素往上寻找最近的一个设置了定位了父元素的宽高为基准，如果祖先元素都没有定位的话，那么就是相对于body的宽高；注意position除了static的父元素 ；

  注意**position除了static的父元素** ；

* 其实绝对定位的子元素的  margin  padding  等值的百分比都是相对于顺着DOM节点树向上第一个设置了除了static定位之外的position 的元素的宽度为基准的；

* % 重点理解：width 是 基于父元素的 width 计算的值 
  height 是基于父元素的 height 计算的值 
  padding 和 margin 的无论上下左右 值 都是基于DOM树节点祖先元素中第一个设置了除了static定位之外的第一个祖先元素的宽度 

  ​

  ​

  ​

  ​