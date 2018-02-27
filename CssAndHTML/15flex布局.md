---
title: flex布局
date: 2017-12-07 
categories: css
---

[阮一峰教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

### 1 容器的属性

- flex-direction：row | row-reverse | column | column-reverse，**该属性通过定义flex容器的主轴方向来决定felx子项在flex容器中的位置。这将决定flex需要如何进行排列;同时决定了子元素在扩展自身大小的时候，往那个方向扩展**;

- flex-wrap：nowrap | wrap | wrap-reverse，**该属性控制flex容器是单行或者多行，同时横轴的方向决定了新行堆叠的方向**

- flex-flow：flex-direction |  flex-wrap

- justify-content：flex-start | flex-end | center | space-between | space-around，**设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式，以该行的宽度为基准**

- align-items：flex-start | flex-end | center | baseline | stretch，**定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式，以该行的高度为基准**

- align-content：flex-start | flex-end | center | space-between | space-around | stretch，**当伸缩容器的侧轴还有多余空间时，本属性可以用来调准「伸缩行」在伸缩容器里的对齐方式，这与调准伸缩项目在主轴上对齐方式的 <' justify-content'> 属性类似。请注意本属性在只有一行的伸缩容器上没有效果。**

  注意：适用于多行

### 2 项目的属性

- order`
  - `flex-grow`：**flex-grow的默认值为0，如果没有显示定义该属性，是不会拥有分配剩余空间权利的。如果被分配空间的子元素flex-grow的值相加值小于1 ，那么就以1 为分母进行剩余空间分配，只有在flex-grow值相加值大于1的情况下才以该值为分母进行空间分配**；
- `flex-shrink`
- `flex-basis`
- `flex`:**复合属性。设置或检索弹性盒模型对象的子元素如何分配空间。在父元素设置了display:flex的情况下，该父元素就是弹性盒模型对象，该父元素下面所有的子元素都是会根据flex属性的值自动的去分配空间**
- `align-self`

```css
#box {
    display:flex;
    flex-direction:column;
    width:300px;
    height:300px;
    background-color:aqua;
}
#box1{
    flex:1 ;
    width:20px;
    height:20px;
    background-color:red;

}
```

```html
<div id='box'>
    <div id='box1'></div>
</div>
```

