---
title:mouseout mouseleave和mouseenter mosueover的区别
date: 2017-12-07
categories: javascript

---

```html
<style>
    #dv1{
        height:100px;
        width:100px;
        background-color:aqua;
        position:relative;
    }
    #dv2{
        height:50px;
        width:50px;
        background-color:blue;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
    }
    #dv3{
        height:20px;
        width:20px;
        background-color:greenyellow;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
    }
</style>
    <div id='dv1'>1
        <div id='dv2'>2
            <div id='dv3'>3</div>
        </div>
    </div>
 <script>
        var dv1 = document.getElementById('dv1'),
            dv2 = document.getElementById('dv2'),
            dv3 = document.getElementById('dv3');
        
    </script>
```

### 1 `mouseout  mouseleave`

- mouseout: MDN :The `mouseout` event is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children. Note that it is also triggered on the parent when you move onto a child element, since you move out of the visible space of the parent. 

  也就是说mouseout事件触发有两种情况

  第一：将鼠标指针移到某个元素的外部，会触发该元素上的mouseout事件

  第二：如果该元素内部还有子元素，将鼠标移到子元素上面也会触发父元素的mouseout事件

  子元素如果也触发了mouseout事件，那么该事件会冒泡到父元素

- mouseleave : MDN:The `mouseleave` event is fired when the pointer of a pointing device (usually a mouse) is moved out of an element.

  这里也就是说触发元素的mouseleave事件只有一种情况，就是鼠标指针离开元素（移到元素外部）会触发该事件;

  对于子元素的mouseleave不会触发父元素的mouseleave事件

  以下这个代码可以注释掉mouseout,或者mouseleave单独测试，或者绑定多个div的事件

```javascript
function addListenerOut(eles){
  for(var i = 0,len=eles.length;i<len;i++){
    var ele = eles[i];
    debugger;
    ele.onmouseout = function(e){
      console.log(e.target )
      console.log('mouseOut触发')
    }
    ele.onmouseleave = function(e){
      console.log(e.target )
      console.log('mouseLeave触发')
    }
  }
}
addListenerOut([dv1]);//参数可以传[dv1,dv2,dv3]
```

### 2 `mouseover  mouseenter`

* mouseover :MDN:The `mouseover` event is fired when a pointing device is moved onto the element that has the listener attached or onto one of its children.

  也就是说mouseover事件触发有两种情况

  第一：将鼠标指针移到某个元素的上面，会触发该元素上的mouseover事件

  第二：如果该元素内部还有子元素，将鼠标移到子元素上面也会触发父元素的mouseover事件(冒泡导致)

  子元素如果也触发了mouseover事件，那么该事件会冒泡到父元素

* mouseenter :MDN:The `mouseenter` event is fired when a pointing device (usually a mouse) is moved over the element that has the listener attached.

  这里也就是说触发元素的mouseenter事件只有一种情况，就是鼠标指针进入元素（移到元素内部）会触发该事件;

  对于子元素的mouseenter不会触发父元素的mouseenter事件



```javascript
function addListenerIn(eles){
  for(var i = 0,len=eles.length;i<len;i++){
    var ele = eles[i];
    debugger;
    ele.onmouseenter = function(e){
      console.log(e.target ,e.currentTarget)
      console.log('mouseEnter触发')
    }
    ele.onmouseover = function(e){
      console.log(e.target ,e.currentTarget)
      console.log('mouseover触发')
    }
  }

}
addListenerIn([dv1]);

```

### 3 如何阻止子元素的mouseout  mouseover冒泡到父元素的mouseout. mouseover？

```javascript
        function addListenerIn(eles){
            for(var i = 0,len=eles.length;i<len;i++){
                var ele = eles[i];
                debugger;
                ele.onmouseenter = function(e){
                    console.log(e.target ,e.currentTarget)
                    console.log('mouseEnter触发')
                }
                ele.onmouseover = function(e){
                    console.log(e.target ,e.currentTarget)
                  //可以通过给子元素阻止冒泡来实现
                    e.stopPropagation();
                    console.log('mouseover触发')
                }
            }
           
        }
        // addListenerOut([dv1,dv2]);
        addListenerIn([dv1,dv2]);
```