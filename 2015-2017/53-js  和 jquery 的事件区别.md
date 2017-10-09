---
title:  onload trigger
date: 2016-02-19 12:36:00
categories: javascript
comments : true 
updated : 
layout : 
---

1 onload  支持该事件的标签和JavaScript对象: HTML标签\<body>,\<frame>, \<frameset>,\<iframe>, \<img>, \<link>, \<script>，javascript  window image layer

```html
js: window.onload = function(){  };  //onload 事件会在页面或图像加载完成后立即发生
jquery:$(function(){ });		//当DOM载入就绪可以查询及操纵时绑定一个要执行的函数。
这是事件模块中最重要的一个函数，因为它可以极大地提高web应用程序的响应速度。
简单地说，这个方法纯粹是对向window.load事件注册事件的替代方法。通过使用这个方法，可以在DOM载入就绪能够读取并操纵时立即调用你所绑定的函数，而99.99%的JavaScript函数都需要在那一刻执行。
有一个参数－－对jQuery函数的引用－－会传递到这个ready事件处理函数中。可以给这个参数任意起一个名字，并因此可以不再担心命名冲突而放心地使用$别名。
1 js中只能写一个，如果一个页面写了多个，后面的会将前面的覆盖
  jquery中可以写多个，后面的不会覆盖
2 执行时间不同，js中是在页面元素加载完成之后执行 
```

```html
js :  script.onload = function(){ } ;表示页面中script标签加载完毕
```

当向jQuery中传入参数的时候，该参数可以作为全局的对   --jQuery-- 的引用

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        div{
            width: 100px;
            height: 100px;
            background-color: #003C78;
        }
    </style>
</head>
<body>
<div></div>
<script src="jquery-1.12.2.js"></script>
<script>
    $(function(ev){
        console.log(arguments);
        console.log(ev);
//        $("div").click(function(){
//            $(this).css("background-color","red")
      //等价于下面
          ev("div").click(function(){
              ev(this).css("background-color","red")
        })
    })
</script>
</body>
</html>
```

2 trigger(type,[data])  在每一个匹配的元素上触发某个事件(该事件必须已经绑定在了所匹配的元素上)，以下代码是等价的

```javascript
functin render(){
  	console.log("我被执行了");
}
$(window).on('resize',function(){
        render();
    }).trigger('resize');
   /* 等价于*/
$(window).resize(function(){
      render();
});
window.onresize = function(){
     render();
};
```









