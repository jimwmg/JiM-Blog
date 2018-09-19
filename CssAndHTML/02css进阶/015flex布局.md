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
- `flex-shrink`: 默认值为1 ，用来指定容器子项如何
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

### 3 实例

#### flex-shrink,默认值为1；如果所有子项的宽度加起来大于容器的宽度，那么就会根据收缩因子进行不足的宽度缩放；

```html
<ul class="flex">
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>

<style>
.flex{display:flex;width:400px;margin:0;padding:0;list-style:none;}
.flex li{width:200px;}
.flex li:nth-child(3){flex-shrink:3;}
</style>

```

**解释**：

flex-shrink的默认值为1，如果没有显示定义该属性，将会自动按照默认值1在所有因子相加之后计算比率来进行空间收缩。

本例中c显式的定义了flex-shrink，a,b没有显式定义，但将根据默认值1来计算，可以看到总共将剩余空间分成了5份，其中a占1份，b占1份，c占3分，即1:1:3

我们可以看到父容器定义为400px，子项被定义为200px，相加之后即为600px，超出父容器200px。那么这么超出的200px需要被a,b,c消化

通过收缩因子，
于是我们可以计算a,b,c将被移除的溢出量是多少：
a被移除溢出量：`1/5 * 200`，即约等于40px
b被移除溢出量：`1/5 * 200`*，即约等于40px
c被移除溢出量：`1/5 * 200`*，即约等于120px
最后a,b,c的实际宽度分别为：200-40=160px, 200-40=160px, 200-120=80px

#### flex-grow：该属性默认值为 0，如果没有显示的声明该属性，那么该flex子项是不会分配剩余空间的；

```html
<ul class="flex">
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>

<style>
.flex{display:flex;width:600px;margin:0;padding:0;list-style:none;}
.flex li:nth-child(1){width:200px;}
.flex li:nth-child(2){flex-grow:1;width:50px;}
.flex li:nth-child(3){flex-grow:3;width:50px;}
</style>

```

 **解释**：

flex-grow的默认值为0，如果没有显示定义该属性，是不会拥有分配剩余空间权利的。

本例中b,c两项都显式的定义了flex-grow，flex容器的剩余空间分成了4份，其中b占1份，c占3分，即1:3

flex容器的剩余空间长度为：600-200-50-50=300px，所以最终a,b,c的长度分别为：

a: 50+(300/4)=200px

b: 50+(300/4*1)=125px

a: 50+(300/4*3)=275px

 以上两个属性，之所以生效，另外一个原因可以归为是 flex-basis的默认值为 auto,因为该值默认为auto,也就是说明 **flex的子项的宽度width取决于其他属性值，上面两个例子，此时也就是width**

#### flex-basis （flex-basis的优先级高于width)

这个属性值的作用也就是width的替代品。 如果子容器设置了flex-basis或者width，那么在分配空间之前，他们会先跟父容器预约这么多的空间，然后剩下的才是归入到剩余空间，然后父容器再把剩余空间分配给设置了flex-grow的容器。 如果同时设置flex-basis和width，那么width属性会被覆盖，也就是说flex-basis的优先级比width高。有一点需要注意，如果flex-basis和width其中有一个是auto，那么另外一个非auto的属性优先级会更高。

#### flex简写[flex-grow,flex-shrink,flex-basis]

```css

flex:1;/*  [1 1 0% ]*  这个也就是我们常用来均分某个flex容器的时候常用的方式，这里的剩余空间就是整个flex容器的宽度*/
flex:auto /**[1 1 auto]  这里就会根据width的值计算剩余空间*/ 
flex:none /**[0 0 auto]* 这里不会收缩页不会扩张/
```

#### 4 总结

* flex布局会首先计算剩余空间，然后比较剩余空间的正负，如果剩余空间为正，那么会根据各个子项的flex进行比例分配，进行扩张；如果剩余空间的值为负，那么就会根据各个子项的flex进行比例分配，进行收缩；
* 剩余空间 = flex容器空间 - 子容器空间1(flex-basis || width ) - 子容器空间2(flex-basis || width ) - ....
* 如果flex子项的 flex-basis 为 0，那么计算剩余空间的时候将不会将该flex子项计算在内；
* 如果flex子项的 flex-basis 为auto 或者其他不为 0，那么在计算剩余空间的时候，就会将该flex子项的空间计算在内