---
title: css世界-流
---

### 1 CSS基本术语

* 属性： height color等
* 值：分为颜色值，整数值，百分比，长度值等
* 长度单位：px em 等
* 功能符：`rgb(0,0,0,.5)  url('someurl' ) attr('title')`
* 选择器：id选择器 类选择器 属性选择器 伪类选择器 关系选择器

### 2 CSS中的流，元素，和基本尺寸

块级元素： `div li ul p h1~h5等`，内联元素 `span i 等`

以最原始的 `block  inline为模型，扩展了其他的新的值`

`display的取值： block  inline-block  table inline flex list-itemlist-item`

对于盒模型的理解，

* block 尺寸元素的width  height其实是作用在 内部盒子上的，外在盒子就是其占据的整个流体空间；
* inline 不能设置 width height
* inline-block 也可以理解为设置在 内在盒子上，其外在盒子还是其本身；

### 3 css世界

####3.1 关于width height

* 宽度分离原则：为了避免某个盒子的宽度会受到padding和marign,以及border的影响

```css
.father {
 width: 180px;
}
.son {
 margin: 0 20px;
 padding: 20px;
 border: 1px solid;
} 
```

* 另外一个可以替换宽度分离原则的方案就是使用 box-sizing

如果想要一个元素高度等于浏览器的高度，那么需要设置

* height支持百分比

```javascript
html, body {
 height: 100%;
} 
```

这是因为，height的百分比值是相对于父元素的height为基准的，因为height的默认值为 auto,这样的百分比值出来也是auto;

* 还有两种方式就是显示的设置父元素的高度，这个不必多说
* 另外一种方式，就是设置元素的 position:absolute，这里在给定位元素设置height的时候，height就是相对于非static的定位元素的height为基准，如果找不到这样的值，那么就是相对于初始包含块；

```css
.pos{
    width:20px;
    height:100%; //这个高度其实是相对于初始包含块，也就是'首屏'；
    position:absolute;
    background-color: aqua;
  }
```

#### 3.2 关于 min-height  min-width max-height max-width

这两个属性会覆盖 width 和height的设置，同时，这两个属性都有的时候，会去值最大的那个为标准，而不是按照出现的顺序覆盖

```css
.wh{
    height:20px;
    background-color: aqua;
    min-width:300px;/**最终的效果是最小宽度 width 300px*/
    max-width:200px;/**后面的属性不会覆盖前面的属性，而是取两者的最大值*/
    width:100px !important;/**这个也不会起作用*/
  }
```

使用max-height实现展开和折叠效果

```javascript
.element {
 max-height: 0;
 overflow: hidden;
 transition: max-height .25s;
}
.element.active {
 max-height: 666px; /* 一个足够大的最大高度值 */
} 
```

#### 3.3 inline-block元素的包裹性  首选最小宽度

```html
<style>
  .inline-block{
    display:inline-block;
    background-color: aqua;
  }
  </style>
  <div class='inline-block'>
      <!-- asfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasf -->
      海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草
  </div>
```

**以上代码可以在浏览器试下，缩放浏览器的宽度，可以更好的理解首选最小宽度和 inline-block 的包裹性**

通俗来说，就是inline-block元素的尺寸是在**没有设置宽高**的时候，其宽高是由其内部元素的所决定的；在仅仅设置了宽度或者设置了高度的时候，其宽度或者高度会默认自适应；

* inline-block的元素尺寸在没有设置宽高的时候，其尺寸是由内部元素撑开的，但是永远小于其 **包含块**的元素的尺寸
* **注意，小于其包含块的尺寸有一点例外，就是包含块的尺寸小于  首选最小宽度**

为了便于理解，给上面的案例增加一个具体的包含块，而不再是首屏；

```html
 <style>
  .container{
    width:50px;
  }
  .inline-block{
    display:inline-block;
    background-color: aqua;
  }
  </style>
  <div class='container'>
      <div class='inline-block'>
          asfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasf
          <!-- 海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草 -->
         <!-- asfasfasfasfasfasf- asfasfasfasfasfasfasfasfasfasfasf
          asfasfasfasfasfasfasf-->
      </div>
  </div>
```

首选最小宽度：元素最适合的最小宽度；这里重点理解类名为 inline-block 的那个元素的宽度；

* 东亚文字（比如中文）情况下，首选最小宽度为每个汉字的宽度，可以调试下container的宽度，看下变化；当 inline-block元素的内容宽度大于container元素的宽度的时候会自动换行；
* 西方文字的连续宽度由**特定的连续**的英文单元决定，并不是所有的自问字符都会组成连续单元，一般会终止于空格 - 问号，以及其他非英文字符等，此时inline-block元素的宽度为所有特定的连续的英文单元中最大的宽度所决定；
* 类似图片这样的替换元素的最小宽度就是该元素本身的内容

```html
 <style>
  .container{
    width:50px;
  }
  .inline-block{
    display:inline-block;
    background-color: aqua;
    white-space: normal;
  }
  </style>
  <div class='container'>
      <div class='inline-block'>
          asfasfasfasfasfasf- asfasfasfasfasfasfasfasfasfasfasf
          asfasfasfasfasfasfasf
          <!-- 海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草海草 -->
      </div>
  </div>
```

**对于具体的换行规则，这里可以结合 white-space这个属性来看下，可以在浏览器切换下white-space的值来看下效果；**

##### white-space

normal：默认处理方式。会将序列的空格合并为一个，内部是否换行由换行规则决定。(具体规则就是上面的关于文字和字母的换行规则的描述)

pre：原封不动的保留你输入时的状态，空格、换行都会保留，并且当文字超出边界时不换行。等同 pre 元素效果

nowrap：与`normal`值一致，不同的是会强制所有文本在同一行内显示。

pre-wrap：与`pre`值一致，不同的是文字超出边界时将自动换行。

pre-line：与`normal`值一致，但是会保留文本输入时的换行。

```html
 <style>
  .ao{
    display:inline-block;
    width:0px;
  }
  .ao::before{
    content:'test 文字 test';
    outline:2px solid black;
    color:aqua;
  }
  </style>
  <div class='ao'>

  </div>
```

####3.4 内联元素 `dispaly:inline   inline-block inline-table 按钮 输入框 span等都是内联元素`

内联元素的特征就是不会让内容独占一行一行，而是在一行上进行排列；

### 4 盒尺寸详解

#### 4.1 content的深入理解

* 替换属性的定义：这种通过修改某个属性值呈现的内容就可以被替换的元素就称为“替换元素”。因此，`<img/>`或者表单元素&lt;textarea&gt;和&lt;input&gt;都是典型 的替换元素;

替换原宿和非替换元素支架只隔了一个 content属性，content属性可以决定元素的 content-box的内容展示什么东西

```html
<style>
  .img{
    content:url('./test.JPG');
    width:200px;
  }
  .logo{
    content:url('./test.JPG');/**会覆盖掉字体**/
    width:50px;
    height:100px;
  }
  
  </style>
  <!-- <img class ='img' src="" alt=""> -->
  <div class='logo'>费发放</div>
```

* 利用content属性清除浮动

```css
.clear::after{
	content:'';/**伪元素必须有content属性*/
    clear:both;
    display:table;/**clear属性必须用于块状元素，所以这里取值block也是可以的**/
}
```

#### 4.2 padding深入理解

* 对于内联元素设置padding不会影响布局；
* 对于非定位元素 padding的百分比是相对于父元素的宽度 content-box的width计算的；对于定位元素，其padding的百分比是基于其非static定位的父元素的 padding-box为基准；

#### 4.3 margin深入理解

* margin:auto 的填充规则如下。 （1）如果一侧定值，一侧 auto，则 auto 为剩余空间大小。 （2）如果两侧均是 auto，则平分剩余空间。
* margin外边距合并：简单来讲，普通流中的元素（不能是float,absolute,BFC元素）margin在垂直方向上有接触的时候就会发生合并；

### 5 内联元素与流

