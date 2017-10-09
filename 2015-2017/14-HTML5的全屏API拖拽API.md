---
title: HTML5 拖拽
date: 2016-07-08 12:36:00
categories: HTML5
comments : true 
updated : 
layout : 
---

HTML5的高级ＡＰＩ

1,全屏API:DOM元素支持全屏，HTML5的标准写法是   ele.requestFullScreen( ), 即可使DOM元素全屏；但是由于该方法处于不够完善，所以需要写各个浏览器的兼容代码；

```html
 if(this.webkitRequestFullScreen){
      this.webkitRequestFullScreen();
    }else if(this.mozRequestFullScreen){
      this.mozRequestFullScreen();
    }else if(this.requestFullScreen){
      this.requestFullScreen();
    }else if(this.msRequestFullscreen){
      //  ie 比较恶心
      //  去 微软的 开发中中心查询 MSDN
      // msRequestFullscreen
      this.msRequestFullscreen();
    }
```



2,拖拽API:拖拉事件(drag&&drop)

拖拉指的是，用户在某个对象上按下鼠标键不放，拖动它到另一个位置，然后释放鼠标键，将该对象放在那里。

拖拉的对象有好几种，包括Element节点、图片、链接、选中的文字等等。在HTML网页中，除了Element节点默认不可以拖拉，其他（图片、链接、选中的文字）都是可以直接拖拉的。为了让Element节点可拖拉，可以将该节点的draggable属性设为true。

draggable属性可用于任何Element节点，但是图片（img元素）和链接（a元素）不加这个属性，就可以拖拉。对于它们，用到这个属性的时候，往往是将其设为false，防止拖拉。

注意，一旦某个Element节点的draggable属性设为true，就无法再用鼠标选中该节点内部的文字或子节点了

首先来看有哪些拖放(drag和drop)的事件，如果要是元素可以拖拽，

首先要给该元素设置  draggable = true 属性，保证该元素可以被拖放.(img标签默认支持拖放，div默认不支持拖放)

拖拽元素的监听事件如下：

*  ondrag   当拖动元素的时候运行脚本被拖动的元素在拖动过程中持续触发
*  ondragstart    当元素拖动操作开始时候运行脚本
*  ondragend   当拖动操作结束的时候运行脚本

目标元素的上的监听事件如下：在默认情况下，拖放的目标元素是不允许接受元素的，为了把元素拖放到其中，必须把默认处理给关掉    给目标元素设置  e.preventDefault()  阻止默认事件的发生；使得被拖放元素可以放入目标元素里面。

* ondragover   当元素被拖动至有效拖放目标元素上方时持续执行脚本

* ondragenter  当元素被拖动至有效拖动目标元素时执行脚本

* ondragleave 当元素离开至有效拖放目标元素时运行脚本

* ondrop  当被拖动元素正在被放下的时候运行脚本;注意，如果当前节点不允许drop，即使在该节点上方松开鼠标键，也不会触发该事件。如果用户按下Escape键，取消这个操作，也不会触发该事件。该事件的监听函数负责取出拖拉数据，并进行相关处理。**注意：只有鼠标松开才算放下，鼠标松开的时候才会触发该事件** 

  dragenter和dragover事件的监听函数，用来指定可以放下（drop）拖拉的数据。由于网页的大部分区域不适合作为drop的目标节点，所以这两个事件的默认设置为当前节点不允许drop。如果想要在目标节点上drop拖拉的数据，首先必须阻止这两个事件的默认行为，或者取消这两个事件。

注意如果想要使目标元素可以被放进来拖放的元素，因为默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。此时需要对目标元素进行处理，调用dragover阻止默认事件 的方法：

```html
目标元素.ondragover = function(event){
		event.preventDefault() ;
}
```

3 代码演示

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    html,
    body {
      height: 100%;
    } 
    body {
      margin: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    div {
      width: 400px;
      height: 400px;
      border: 1px solid #000;
    }
    .left {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
    } 
    div>img {
      width: 70px;
      height: 70px;
      margin: 10px;
      background-color: ;
    }
    /* 使用css来修改 定义一个 高亮的颜色 */ 
    .right.active {
      background-color: lightblue;
    }
  </style>
</head>
<body>
  <div class="left">
    <img src="imgs/lofter_1_noval_icon_ (1).jpg" alt="">
    <img src="imgs/lofter_1_noval_icon_ (2).jpg" alt="">
    <img src="imgs/lofter_1_noval_icon_ (3).jpg" alt="">
  </div>
  <div class="right"></div>
</body>
</html>
<script>
  // .right 盒子 元素移入  颜色高亮 
  document.querySelector('.right').ondragenter = function () {
    // this.style.background = 'lightgray';
    this.classList.add('active');
    // $(this).addClass('active');
  }
  // .right 移出 颜色还原 
  document.querySelector('.right').ondragleave = function () {
    //  颜色 就是 直接设置透明 
    // this.style.background = 'transparent';
    // this.style.background = 'rgba(0,0,0,0)';
    this.classList.remove('active');
  }
  // 为了能够触发drop 必须设置如下代码,给目标元素设置阻止默认处理方式，允许元素可以被放置
  document.querySelector('.right').ondragover = function (event) {
    event.preventDefault();
  }
  //  drop  .right盒子绑定
  //  img 拖拽开始的 时候 保存为 全局变量
  var imgs = document.querySelectorAll('.left>img');
  // 当前移动的 img
  var moveImg = undefined;
  // 循环绑定，给每个拖拽元素设置拖拽事件，每个元素被拖拽时触发该事件
  for(var i=0;i<imgs.length;i++){
    imgs[i].ondragstart = function(){
      // 保存为全局变量
      moveImg = this;
      // 打印是否保存
      console.log(moveImg);
    }
  }
  document.querySelector('.right').ondrop = function () {
//  moveImg.ondrop = function () {
    console.log('进来了');
    // 将 丢进来的 元素 设置为 子元素 
    // 获取丢进来的元素 在拖拽img的时候 将当前拖拽的img 存起来获取保存的img
    // 通过全局变量 moveImg  添加给自己
    document.querySelector('.right').appendChild(moveImg);
    //  还原 自己的颜色
    this.classList.remove('active') 
  }
</script>
```

