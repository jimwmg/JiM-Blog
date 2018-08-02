---
title：margin合并

---

### 1 基本概念

外边距合并定义：

W3C: In CSS, the adjoining margins of two or more boxes (which might or might not be siblings) can combine to form a single margin. Margins that combine this way are said to collapse, and the resulting combined margin is called a collapsed margin.

在CSS中,两个或者多个盒模型（可能是兄弟元素，也可能不是兄弟元素）毗邻的margin可以合并之后组成单个margin.这种margin合并的方式称作margin塌陷；

要点：

* 毗邻盒子元素：margin之间有接触，没有被 padding 和 border, clear 或者 line-box 分开；

* 两个或者元素盒元素：可以是父子元素之间的margin接触地带，也可以是兄弟元素之间的margin接触地带；

* 垂直方向：只有在垂直方向的margin才会发生外边距合并，水平方向的外边距不会存在叠加情况；

* 普通流（in flow): 只要不是float ,absolute ,root element 就是普通流；**也就是说只有都是普通流种的元素才能进行margin的合并**

  An element is called out of flow if it is floated, absolutely positioned, or is the root element.An element is called in-flow if it is not out-of-flow.

### 2 父元素 和 子元素 margin 的  **接触**  边缘进行合并（注意margin合并必须有元素之间的margin发生身体接触才会有margin 合并的发生，如果想要阻断margin合并，可以通过设置阻断 元素之间的margin接触就可以避免margin合并；

```html
<style>
    #container {
        height: 200px;
        background: yellow;
        width:100px;
        margin-top:10px;
    }
    #inner{
        background-color: aquamarine;
        height:20px;
        margin-top:50px;
    }
</style>

<div id="container">
    <div id='inner'>333</div>
</div>  
```

接下来针对上面的案例，给出拒绝margin合并的解决方案

####2.1 毗邻盒子元素：针对这个margin形成的要点，可以设置隔离地带，拒绝margin合并；

* 设置父元素的 border 或者 padding

```html
<style>
 #container {
      height: 200px;
      background: yellow;
      width:100px;
      margin-top:30px;
      padding:10px;
      border:1px solid #000;
  }
  #inner{
    background-color: aquamarine;
    height:20px;
    margin-top:50px;

  }
</style>
  
  <div id="container">

    <div id='inner'>333</div>

  </div>  
```

* 在父 子 元素之间添加一个隔离元素(被 line-box 隔离，阻止了margin的接触，从而使得margin之间塌陷现象消失)

```html
<style>
 #container {
      height: 200px;
      background: yellow;
      width:100px;
      margin-top:30px;
      /* padding:10px; */
      /* border:1px solid #000; */
  }
  #inner{
    background-color: aquamarine;
    height:20px;
    margin-top:50px;

  }
  #seprate{
    padding:10px;
    height:10px;
    background-color:blueviolet;
  }

</style>
  
  <div id="container">
    <div id='seprate'></div>
    <div id='inner'>333</div>

  </div>  
    
```

#### 2.2 普通流：另外一种方式就是针对这个形成margin塌陷的要点，改变元素的状态，使其脱离普通流；因为只有普通流中的元素之间的margin的接触才会形成margin的合并，所以可以改变这个条件；

`position:fixed absolute  float:left right`

```html
<style>
 #container {
      height: 200px;
      background: yellow;
      width:100px;
      margin-top:30px;
      /* padding:10px; */
      /* border:1px solid #000; */
  }
  #inner{
    background-color: aquamarine;
    height:20px;
    margin-top:50px;
    /**position:absolute; float:left*/
  }
</style>
  
  <div id="container">
    <div id='inner'>333</div>

  </div> 
```

#### 2.3 将父元素设置成 BFC元素(对于触发了BFC的元素，其内部的元素排列不会影响外部，同样外部也不会影响它内部)

```html
<style>
 #container {
      height: 200px;
      background: yellow;
      width:100px;
      margin-top:30px;
      overflow:hidden;
     /*
     overflow:hidden(auto,scroll，clip) // 除visible
     float:left(right);
     position:fixed(absolute);
     display:inline-block(flex,grid,table-cell);
     **/
  }
  #inner{
    background-color: aquamarine;
    height:20px;
    margin-top:50px;
    position:relative;
  }


</style>
  
  <div id="container">
    <div id='inner'>333</div>

  </div> 
```



### 3 兄弟元素之间的 margin的接触，也会进行margin的合并；

兄弟元素垂直方向的margin塌陷的解决方式和上面的思路大概类似；这里不再具体展开；



