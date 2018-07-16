---
title：position属性详解
---

### 1 position: 默认值 static,对于非 static的元素，可以通过 z-index进行层叠级别的设置；

取值以及释义如下：

static：对象遵循常规流。此时4个定位偏移属性不会被应用。

relative：对象遵循常规流，并且参照自身在常规流中的位置通过[top](http://css.doyoe.com/properties/positioning/top.htm)，[right](http://css.doyoe.com/properties/positioning/right.htm)，[bottom](http://css.doyoe.com/properties/positioning/bottom.htm)，[left](http://css.doyoe.com/properties/positioning/left.htm)这4个定位偏移属性进行偏移时不会影响常规流中的任何元素。

absolute：对象脱离常规流，此时偏移属性参照的是离自身最近的定位祖先元素，如果没有定位的祖先元素，初始块。盒子的偏移位置不影响常规流中的任何元素，其`margin`不与其他任何`margin`折叠（因为触发了BFC ）。

fixed：与`absolute`一致，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动。

sticky：对象在常态时遵循常规流。它就像是`relative`和`fixed`的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如`fixed`。该属性的表现是现实中你见到的吸附效果。

### 2 理解包含块

* 尺寸包含块：用于在获取元素的 padding margin width height 百分比取值的基准块；（content-box)，指的是该子元素的祖先元素（一般是块级父元素）的content-box;(padding,margin的取值基准是尺寸包含块的width)
* 定位包含块：用于获取元素定位的 left right top bottom 的百分比布局基准块；（padding-box)，指的是该子元素的祖先元素（定位position非static的元素）的padding-box，如果祖先元素都没有非static的定位，那就是初始包含块；
* 初始包含块：**直观来看，根元素`<html />`的包含块ICB，就是“首屏”。
* 理解`box-sizing`,content-box ,padding border不包括在 width和height的定义之中；border-box中 padding和border会在 width 和 height 的定义之中；（所以就会出现padding-box和content-box被挤压的情况）

####2.1 尺寸包含块：(子元素通过百分比基准获取自身盒模型content padding margin的基准)

* 对于非定位元素（包括一般的块级元素，浮动元素），其**尺寸包含块**就是其块级父元素的 **content-box 的宽高**;

`box-sizing的默认值是 content-box;`

```html
<style>
  #container{
    width:100px;
    height:200px;
    padding:20px;
    margin:10px;
    background-color:gold;
  }
  #inner{
    float:left;/**浮动和一般元素都是以块级父元素为基准，也包括position:static,position:relative*/
    width:20%; /**20px*/
    height:20%;/**40px*/
    padding:10%;/**10px*/
    margin:10%;/**10px*/
    background-color:grey;

  }
  </style>
  <div id="container">
    <div id="inner"></div>
  </div>
```

对于`box-sizing: border-box;会导致content-box的width和height受到挤压`

```html
<style>
    #container{
        box-sizing:border-box;
        width:100px;
        height:200px;
        padding:20px;
        margin:10px;
        background-color:gold;
        /**
        增加了 box-sizing:border-box的时候，content-box的width(60px)和height(140px)
        */
    }
    #inner{
        float:left;/**浮动和一般元素都是以块级父元素为基准，也包括position:static,position:relative*/
        width:20%; /**60 x 20% = 12px*/
        height:20%;/**140 x 20% = 32px*/
        padding:10%;/**60 x 10% = 6px*/
        margin:10%;/**60 x 10% = 6px*/
        background-color:grey;
    }
</style>
<div id="container">
    <div id="inner"></div>
</div>
```

* 对于定位元素：其**尺寸包含块 **就是其块级父元素的 **padding-box 的宽高**;

`box-sizing的默认值是 content-box;`

```html
<style>
  #container{
    width:100px;
    height:200px;
    padding:20px;
    margin:10px;
    background-color:gold;
    position:relative;
    /* box-sizing:border-box; */
  }
  #inner{
    position:absolute;
    width:20%;/**140 x 20% = 28*/
    height:20%;/**240 x 20% = 48*/
    padding:10%;/**140 x 10% = 14*/
    margin:10%;/**140 x 10% = 14*/
    background-color:grey;

  }
  </style>
  <div id="container">
    <div id="inner"></div>
  </div>
```

`box-sizing取值为 padding-box`其**尺寸包含块 依旧**就是其块级父元素（非static定位）的 **padding-box 的宽高**;

```html
<style>
  #container{
    width:100px;
    height:200px;
    padding:20px;
    margin:10px;
    /*border:10px solid #000;*/
    background-color:gold;
    position:relative;
    box-sizing:border-box;
  }
  #inner{
    position:absolute;
    width:20%;/**100 x 20% = 20*/    /*如果开了border的注释，那么就是 80 x 20% = 16*/
    height:20%;/**200 x 20% = 40*/   /*如果开了border的注释，那么就是 160 x 20% = 16*/
    padding:10%;/**100 x 10% = 10*/  /*如果开了border的注释，那么就是 80 x 10% = 8*/
    margin:10%;/**100 x 10% = 10*/   /*如果开了border的注释，那么就是 80 x 20% = 8*/
    background-color:grey;

  }
  </style>
  <div id="container">
    <div id="inner"></div>
  </div>
```



#### 2.2 定位包含块（子元素通过 left top right bottom 等值的百分比获取偏移量的基准）

* 对于定位为 position：relative的元素，其定位left top right bottom的百分比的取值基准是父元素的 **content-box;**（不包括padding)

`box-sizing:默认值是 content-box;`

```html
<style>
  #container{
    width:100px;
    height:200px;
    padding:20px;
    margin:10px;
    background-color:gold;
    position:relative;
  }
  #inner{
    position:relative;
    width:20%;
    height:20%;
    padding:10%;
    margin:10%;
    background-color:grey;
    left:10%;/**10px: left和right的百分比取值为content-box的宽度*/
    top:10%;/**20px:top和bottom的百分比取值为content-box的高度*/
    /**对于relative的元素，其定位left top bottom right的取值基准是其父元素的content-box为基准；位移的坐标系是其自身；*/
  }
  </style>
  <div id="container">
    <div id="inner"></div>
  </div>
```

`box-sizing:border-box;`则会挤压 content-box的值

```html
<style>
    #container{
        width:100px;
        height:200px;
        padding:20px;
        margin:10px;
        background-color:gold;
        position:relative;
        box-sizing:border-box;
    }
    #inner{
        position:relative;
        width:20%;
        height:20%;
        padding:10%;
        margin:10%;
        background-color:grey;
        left:10%;/**60 x 10 = 6px: left和right的百分比取值为content-box的宽度*/
        top:10%;/**160 x 10% = 16px:top和bottom的百分比取值为content-box的高度*/
        /**对于relative的元素，其定位left top bottom right的取值基准是其父元素的content-box为基准*/
    }
</style>
<div id="container">
    <div id="inner"></div>
</div>
```

* 对于定位是 position: absolute fixed的元素，其定位left top right bottom的百分比的取值的基准是第一个position:非static的祖先元素的**padding-box**，如果找不到这样的定位的祖先元素，则是相对于初始包含块;

`box-sizing默认值是 content-box`

```html
<style>
  #container{
    width:100px;
    height:200px;
    padding:20px;
    margin:10px;
    background-color:gold;
    position:relative;
  }
  #inner{
    position:absolute;
    width:20%;
    height:20%;
    padding:10%;
    margin:10%;
    background-color:grey;
    left:10%;/**14px: left和right的百分比取值为padding-box的宽度*/
    top:10%;/**24px:top和bottom的百分比取值为padding-box的高度*/
  }
  </style>
  <div id="container">
    <div id="inner"></div>
  </div>
```

`box-sizing:border-box`

```html
<style>
    #container{
        width:100px;
        height:200px;
        padding:20px;
        margin:10px;
        background-color:gold;
        position:relative;
        /*border:10px solid #000;*/
        box-sizing:border-box;
    }
    #inner{
        position:absolute;
        width:20%;
        height:20%;
        padding:10%;
        margin:10%;
        background-color:grey;
        left:10%;/**10px: left和right的百分比取值为padding-box的宽度*/ /**打开border的注释：8px*/
        top:10%;/**20px:top和bottom的百分比取值为padding-box的高度*/  /**打开border的注释：18px*/
    }
</style>
<div id="container">
    <div id="inner"></div>
</div>
```



#### 2.3 初始包含块:**根元素`<html />`的包含块ICB，就是“首屏”。**

ICB（初始包含块）是专有名词，它特指根元素`<html />`的包含块。不要将一个元素的初始包含块，错误理解为它的父元素;

对于自己之前的错误理解：设置了position:absolute定位的元素，是相对于其最近的祖先元素的非static得定位元素，如果找不到这样的元素，~~那么就是相对于根元素 html元素或者body元素；~~，是相对于初始包含块，也就是简单理解“首屏”

```html
<style>
  html{
    height:2000px;
  }
  #container{
    position:absolute;
    left:10%;
    bottom:0;
    height:20px;
    width:20px;
    background-color: brown;
  }
  
  </style>
  <div id='container'></div>
```

### 2.4 如何使一个未知宽高的元素水平垂直居中于屏幕；

```css
.center{
    width:200px;
    height:200px;
    background-color:greenyellow;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
}
.center{
    width:200px;
    height:200px;
    background-color:greenyellow;
    position:absolute;
	margin:auto;
    left:0;
    top:0;
    right:0;
    bottom:0;
}
```





