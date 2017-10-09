---
title:  seajsuse实例应用与理解
date: 2017-05-2 12:36:00
categories: seajs
tags : seajs
comments : true 
updated : 
layout : 
---

五一小长假已经过完,心里很愧疚,因为没有学习,没有学习就没有进步,没有进步就没有薪水,没有薪水我就无法生活,没有生活我就无法生存,没有生存我还能怎样拯救世界呢?为了世界和平,继续学习;嗯,开始节后第一博;回顾原理,夯实基础.

**seajs.use**

首先看下在没有这些工具的时候我们如何加载一个js文件的

```javascript
var script = document.createElement('script');
script.setAttribute('src', 'example.js');
script.onload = function() {
    console.log("script loaded!");
};
document.body.appendChild(script);
```

### 1 seajs.use语法

```javascript
seajs.use(id, callback?)
// 加载一个模块
seajs.use('./a');

// 加载一个模块，在加载完成时，执行回调
seajs.use('./a', function(a) {
  a.doSomething();
});

// 加载多个模块，在加载完成时，执行回调
seajs.use(['./a', './b'], function(a, b) {
  a.doSomething();
  b.doSomething();
});
```

### 2 seajs.use模块加载在所在文件的用途:通过seajs.use引入的文件在当前页面都是可用的,相当于引入的js文件在当前页面执行(src引入js文件的原理一样)

考虑如下文件目录

```
F:
	workspace
		-sea.js
		-jquery-1.12.4.js
		-seajsTest
			-module.js
			-js
				module1.js
				module2.js
			-css
				common.css
			-page
				index.html
						
```

index.html

```html
<body>
    <p id='test'>this is a test for seajsuse</p>

    <script>
    seajs.use(['../../jquery-1.12.4'],function(){
        console.log($)
        // seajs.use('../module');
    })


    setTimeout(function(){
        console.log('1');
        
         console.log($);
    },200)

    console.log($);

    </script>
</body>
```

输出

```
Uncaught ReferenceError: $ is not defined   // 最后一行代码输出
function ( selector, context ) {}  //回调函数输出
function ( selector, context ) {}	//定时器输出
```

这个时候要对函数的同步执行,异步执行以及回调函数有着清晰的认识:简单来说就是   **同步 _ 异步 _ 回调**

seajs.use的回调函数在依赖模块**加载完毕**之后触发执行.因为模块的加载时同步加载的,加载完成之后才会执行回调函数common.css也可以通过seajs.use引入当前页面

```css
p {
    font-size : 50px ;
}
```

index.html加上如下代码

```html

    <script>
        seajs.use('../css/common.css')
    </script>
```

可以发现字体被加上了css样式，字体变大了。

**注意引入css文件的时候,一定要加上css后缀名,因为seajs不会为我们加上后缀,默认是  .js**

a.加载css的时候一定要加后缀的

b.路径中有”？“的时候javascript文件的后缀不能省略

c.路径中是以"#"号结尾的文件也不可以省去后缀

### 3 seajs.use如果嵌套seajs.use,还是从原理层面去考虑,seajs.use依赖的模块也是可以直接调用外部seajs.use引用的模块数据(可以理解嵌套的使用script -src加载js文件)

module.js

```javascript
$('#test').css('backgroundColor','red')
```

然后再浏览器中打开index.html文件,可以发现字体变红了,module.js可以使用$这样的jquery封装的代码

**一个文件就是一个模块**,通过seajs.use加载一个模块本质上就是通过script标签src属性引入一个文件而已,但是需要注意命名空间的问题

3.1 当这个模块使用define定义的时候,那么就不会污染全局,define定义的变量**必须通过exports对象**提供接口才能被外部访问

3.2 当这个模块不是通过define函数定义的时候,那么就会容易产生全局的变量污染,因为通过script标签引入的js文件会在全局执行;

module1.js

```javascript
var foo = 'bar';
```

module2.js

```javascript
define(function(require,exports,){
    var foo1 = 'bar1';
    exports.foo1 = foo1 ;
  //通过模块可以直接操作DOM元素
    document.getElementById('test').style.color = 'green';//字体会变成绿色
})
```

module.js

```javascript
$('#test').css('backgroundColor','red');
console.log('module.js',foo);
console.log('module.js',foo1);
```

index.html

```html
<body>
    <p id='test'>this is a test for seajsuse</p>

    <script>
        seajs.use('../css/common.css')
    </script>

    <script>
    seajs.use(['../../jquery-1.12.4','../js/module1','../js/module2'],function(a,b,c){
        // console.log($);
        console.log(arguments);//null  null  Object
        
        seajs.use('../module');

        console.log('seajs',foo);
        
        console.log('seajs',c.foo1);
        
    })

   setTimeout(function(){
        console.log('setTimeout',foo);
    
        console.log('setTimeout',c.foo1);
   },2000)

//define定义的变量不会污染全局     直接引入的js文件会污染全局   seajs在加载完这两种文件之后，都会执行所加载的文件
    </script>
</body>
```

输出如下

```
-(3) [null, null, Object, callee: function, Symbol(Symbol.iterator): function]
-seajs bar
-seajs bar1
-module.js bar
-Uncaught ReferenceError: foo1 is not defined
-setTimeout bar
-Uncaught ReferenceError: c is not defined
```

### 4 module  模块的生命周期

```javascript
var STATUS = Module.STATUS = {
  // 1 - The `module.uri` is being fetched
  FETCHING: 1,
  // 2 - The meta data has been saved to cachedMods
  SAVED: 2,
  // 3 - The `module.dependencies` are being loaded
  LOADING: 3,
  // 4 - The module are ready to execute
  LOADED: 4,
  // 5 - The module is being executed
  EXECUTING: 5,
  // 6 - The `module.exports` is available
  EXECUTED: 6
}
```

### 5 详细源码可以查看(通过npm install seajs下载的资源包里面也会有响应的代码,有兴趣的可以看下里面的源码,以下是我参考的文章)

[seajs源码解析1](https://segmentfault.com/a/1190000000471722)

[seajs源码解析2](http://www.codeceo.com/article/javascript-seajs.html)

[seajs](https://segmentfault.com/a/1190000000354302)

[这篇总结的比较好](http://www.cnblogs.com/jfmblog/p/5650979.html)