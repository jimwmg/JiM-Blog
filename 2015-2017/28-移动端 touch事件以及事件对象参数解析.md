---
title:  js touch 事件对象参数 
date: 2016-08-13 12:36:00
categories: javascript event
tags : event 
comments : true 
updated : 
layout : 
---

移动端 touch事件以及事件对象参数解析

一  :理解**touch事件**对象参数,其实就是事件对象参数新增了额外的几个参数，其中包括:

TouchEvent :  

```html
- changedTouches   所有改变的触摸点的集合
- targetTouches  目标元素上方的触摸点的
- touches 改变的触摸点
- 这三个对象里面的
changdTouches:TouchList:
[0]:Touch
  {clientX:202.43899536132812
  clientY:56.097999572753906
  force:1
  identifier:0
  pageX:202.43899536132812
  pageY:56.097999572753906
  radiusX:14.02439022064209
  radiusY:14.02439022064209
  rotationAngle:0
  screenX:348
  screenY:
  }
  属性值都是一样的
```

每个事件对象参数可能包含以下两个属性[0] :包含触摸点的信息，length:包含触摸点的数量

二 : 触摸事件的绑定方法

走个demo看下效果,注意看控制台的输出：以下列出了一部分TouchEvent的参数

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <style>
        .box {
            width: 200px;
            height: 200px;
            background-color: skyblue;
        }
    </style>
</head>
<body>
<div class="box"></div>
<script>
    window.onload = function(){
        var box = document.querySelector(".box");
        box.addEventListener("touchstart",function(e){
            console.log("触发了touchstart");
            console.log(e);
            console.log(e.changedTouches[0]);

        });
        box.addEventListener("touchmove",function(e){
//            console.log("触发了touchmove");
            console.log(e);
        })
        box.addEventListener("touchend",function(e){
            console.log("触发了touchend");
            console.log(e);
        })
    }
</script>
</body>
</html>
```

1. TouchEvent

2. 1. altKey:false

   2. bubbles:true

   3. cancelBubble:false

   4. cancelable:true

   5. **changedTouches:TouchList** 

   6. 1. 0:Touch

      2. 1. clientX:88
         2. clientY:157
         3. force:1
         4. identifier:0
         5. pageX:88
         6. pageY:157
         7. radiusX:15.333333015441895
         8. radiusY:15.333333015441895
         9. rotationAngle:0
         10. screenX:258
         11. screenY:275
         12. target:div.box
         13. __proto__:Touch

      3. length:1

   7. 二 Touch事件:每一个Touch事件都对应一个TouchEvent,  只不过可能事件对象参数中的某些数值可能会不一样

   8. touchstart   touchmove(move过程持续触发)  touchend

   9. touchstart  touchmove  包含changedTouches  targetTouches touches 这三个事件参数，且length不为0 

   10. 但是 touchend 包含changedTouches   的length不为0 ，targetTouches  touches的length为0 

