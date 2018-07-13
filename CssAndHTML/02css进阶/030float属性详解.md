---
title：float属性详解
---

### 1 float

要想掌握浮动元素的浮动原理，只要理解浮动元素的浮动起始位置、浮动方向和浮动结束位置即可。

- 浮动起始位置

  浮动元素（包括左右）的浮动起始位置，为最后一行最左侧的空白位置，而不管空白位置是否能够容纳当前浮动元素；

- 浮动方向

  左浮动元素的浮动方向为从起始位置向左浮动；

  右浮动元素的浮动方向为从起始位置向右浮动；

* 浮动结束位置

​       左浮动元素遇到第一个左浮动元素或包含块的最左侧padding时，结束浮动；

​        右浮动元素遇到第一个右浮动元素或包含块的最右侧padding时，结束浮动；

### 2 浮动出现的根源： 解决文字环绕图片

* 浮动元素和定位元素的主要区别：

**绝对定位的元素脱离了文档流，而浮动元素依旧在文档流中**；而这造成的显示上的差异就是：同处于文档流中的文字实体不会与浮动元素重叠，而会与绝对定位元素重叠。这就是文字环绕显示的重要原因之一；

**即使元素设置了浮动，其依然在文档流中占据着自己的位置，也不会被后来的字体内容覆盖，所以后来的浮动元素也会挨着继续排列**

* 浮动和 display：inline-block 元素的区别

浮动元素和display:inline-block的元素都占据文档的位置；但是浮动元素没有高度；不会撑开父容器；

```html
<style>
    #container{

    }
    #f1{
        float:left;
        height:20px;
        background-color:aqua;
        width:20%;
    }
    #f2{
        height:50px;
        background-color: beige;
        width:30%;
        word-wrap: break-word;
    }
</style>
<div id="container">
    <div id='f1'>1</div>
    <div id='f2'>afafafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafafafadfafadf</div>
</div>
```

浮动造成的问题是 浮动的元素不会再产生高度，不会撑开父元素，所以形成了“高度塌陷”的问题；

```HTML
<style>
    #container{
        border:1px solid red;
    }
    #f1{
        float:left;
        height:20px;
        background-color:aqua;
        width:20%;
    }

</style>
<div id="container">
    <div id='f1'>1</div>
</div>
```

### 3 清除浮动

clear :  适用于 **块级元素** 属性的取值有left、right和both。那么它们的应用场景分别是什么？

left值的应用场景是，前面声明的浮动元素是向左浮动（float: left）;

right的应用场景是，前面声明的浮动元素是向右浮动（float: right）;

both的应用场景是，前面声明的浮动元素的浮动方向不确定，可能是左，也可能是右（了解过clearfix实现原理的同学，就不难明白）；

* 方法一：设置clear属性（必须是块级元素，因为clear属性只能应用于块级元素）

```html
<style>
    #container{
        border:1px solid red;
    }
    #f1{
        float:left;
        height:20px;
        background-color:aqua;
        width:20%;
    }
    .fix{
        clear:left; 
     /**left,both 都可以清除浮动，但是right就不行，因为这个元素前面的元素 f1是 float:left*/
    }
</style>
<div id='container'>
    <div id='f1'>1</div>
    <div class='fix'></div>
</div>
```

伪对象 `::before  ::after` 必须定义 content 属性的值；结合清除元素 clear 的要求，所以也必须设置 为块级元素；

对照上面那个方法，为了减少不必要的div标签，可以添加伪对象（伪对象也必须声明为display:block 块级元素才能用 clear属性）

```html
<style>
    #container{
        border:1px solid red;
    }
    #f1{
        float:left;
        height:20px;
        background-color:aqua;
        width:20%;
    }
    .clearfix::after{
        content:'';
        clear:both;
        display:block;/**table*/
        /**上面三个属性是必须设置的；下面两个不是必须的*/
        line-height: 0;
        visibility: hidden;
    }

</style>
<div id="container" class="clearfix">
    <div id='f1' >1</div>
</div>
```

* 方法二：触发父元素的 BFC 特性，因为 BFC可以感知到浮动元素的高度；

触发 BFC 特性的方式如下：

- 根元素，即 html;

- `float`的值不为`none`。
- `overflow`的值为`auto`,`scroll`或`hidden，clip，非visible`。
- `display`的值为`table-cell`, `table-caption`, `inline-block`中的任何一个。
- `position`的值不为`relative`和`static`。

```html
<style>
  #container{
    border:1px solid red;
    position:absolute;
    /*float:left;*/
    /*overflow:hidden;*/
  }
  #f1{
    float:left;
    height:20px;
    background-color:aqua;
    width:20%;
  }
  
  </style>
  <div id='container'>
    <div id='f1'>1</div>
  </div>
```

* 方法三：直接给父元素一个高度

### 4 play-ground

可以将下面的代码复制到自己编辑器中，在浏览器改变 f3 的高度，看下浮动的变化；挺好玩；

```html
<style>
    #container{

    }
    #f1{
        /* float:left; */
        display:inline-block;
        height:100px;
        background-color:aqua;
        width:20%;
    }
    #f2{
        /* float:left; */
        display:inline-block;
        height:50px;
        background-color: beige;
        width:25%;
    }
    #f3{
        /* float:left; */
        display:inline-block;
        height:30px;
        background-color: blanchedalmond;
        width:30%;
    }
    #f4{
        /* float:left; */
        display:inline-block;
        height:200px;
        background-color: aquamarine;
        width:35%;
    }
</style>
<div id="container">
    <div id='f1'>1</div>
    <div id='f2'>2</div>
    <div id='f3'>3</div>
    <div id='f4'>4</div>
</div>
```





[参考/css-float浮动的深入研究、详解及拓展一](https://www.zhangxinxu.com/wordpress/2010/01/css-float%E6%B5%AE%E5%8A%A8%E7%9A%84%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6%E3%80%81%E8%AF%A6%E8%A7%A3%E5%8F%8A%E6%8B%93%E5%B1%95%E4%B8%80/)

