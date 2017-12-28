---
title: DOMContentLoaded 
date: 2016-05-13 12:36:00
categories: DOM
tegs : DOM 
comments : true 
updated : 
layout : 
---

1 DOMContentLoaded 和 onload事件

onload事件会在页面或者图像加载完成后立即发生。

DOMContentLoaded这个事件是从HTML中的onLoad的延伸而来的，当一个页面完成加载时,初始化脚本的方法是使用load事件，但这个类函数的缺点是仅在所有资源都完全加载后才被触发,这有时会导致比较严重的延迟,开发人员随后创建了一种自定义事件,domready,它在DOM加载之后及资源加载之前被触发。jQuery中的$(function(){})就是封装的这个方法

1.1 先来看下浏览器向服务器发送请求之后，请求到了HTML文档之后便开始解析，先生成DOM树 ，然后生成CSSDOM树，再由二者结合生成渲染树(RenderTree),有了所有的节点的样式，浏览器便可以genuine这些节点以及它们的样式确定它们的位置和大小，这就是layout阶段，之后浏览器会进行渲染，总结如下

DOM-->CSSOM-->RenderTree-->layout-->Paint

1.2 当然了这个时候我们还没有考虑到javascript;javascript会阻塞DOM的生成，也就是说当浏览器解析HTML的时候，如果遇到了script标签就会停止对HTML的解析，转而进行处理javascript脚本

* 如果脚本是内联的，浏览器会先执行这段javascript代码
* 如果脚本是外联的，浏览器会先加载脚本，然后执行
* 因为javascript可以查询任意对象的样式，也就是说在CSSOM解析完毕之后，javascript才会被执行

处理完毕脚本之后会继续解析HTML文档

1.3 总结:

* 当文档中没有javascript脚本的时候，浏览器解析玩文档便能触发DOMContentLoaded事件
* 如果文档中包含脚本，则会阻塞文档的解析，同时脚本的执行需要等待CSSOM解析完毕才能执行
* DOMContentLoaded事件的触发不需要等待图片等其他资源加载完成

2 异步脚本

2.1 我们知道同步脚本的解析对网页渲染有影响，如果我们想要页面尽快的显示，那我们可以使用异步脚本；HTML5中有两种执行异步脚本的方法:defer和async

2.2 看下二者的区别

2.2.1 script脚本，没有defer和async属性

```html
<script src="***.js"></script>
```

当HTML文档解析的时候遇到javascript标签，会停止对文档的解析，进而加载javascript脚本，加载完毕之后**立即执行**

2.2.2 defer脚本

```html
<script src="***.js" defer></script>
```

当HTML文档解析的时候遇见defer脚本，则会在后台加载脚本，文档的解析过程不会中断，

**当文档解析结束之后，defer脚本执行**；defer脚本的执行顺序与定义的时候的位置有关

* defer属性只适用于外联脚本，如果script标签没有src属性，只是内联脚本，不要使用defer
* 如果声明了多个defer脚本，则会按照顺序进行执行
* defer脚本会在DOMContentLoaded和loaded事件触发之前执行

```html
<!DOCTYPE html>
<html>
    <head>
        <title>defer & async</title>
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <!-- adding a 'defer' attribute, by default, the value will be 'true' -->
        <script type="text/javascript" src="js/1.js" defer></script>
        <script type="text/javascript" src="js/2.js" defer></script>
        <script type="text/javascript" defer>
            console.log(3);
        </script>
    </head>
    <body>
        <div class="text">Hello World</div>

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", function() {
                console.log('dom content loaded, ready state:', this.readyState);
            }, false);

            window.addEventListener('load', function() {
                console.log('window loaded, dom ready state:', document.readyState);
            }, false);
        </script>
    </body>
</html>
```

```javascript
//js/1.js
console.log("1");
```

```javascript
//js/2.js
console.log("2");
```

输出如下

```html
3
1
2
20defer.html:17 dom content loaded, ready state: interactive
20defer.html:21 window loaded, dom ready state: complete
```

2.2.3 async脚本

```html
<script src="***.js" async></script>
```

当HTML文档解析的时候遇见async脚本，则会在后台加载脚本，文档的解析过程不会中断，

**脚本加载完成之后，文档停止解析，async脚本执行**；async脚本执行完毕之后，文档继续解析

* 只适用于外联脚本，这一点和defer一致 
* 如果有多个声明了async的脚本，其下载和执行也是异步的，不能确保彼此的先后顺序 
* async会在load事件之前执行，但并不能确保与DOMContentLoaded的执行先后顺序

2.2.4 async脚本不考虑依赖，加载完毕之后马上会执行，这点对于不需要依赖的javascript脚本是非常合适的，但是对于需要依赖的javascript脚本而言，defer无疑是最合适的。

