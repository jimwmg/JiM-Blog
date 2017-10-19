---
title: CommonJS
date: 2017-08-22
categories: node
tags: commonJS
---

### 1 CommonJS扼要

* CommonJS规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。
* 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
* 每个文件都是一个模块，在该模块内定义的函数，类，变量都是私密的对其他文件不可见;
* CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用
* 如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范

####注意：如果在一个文件（模块）中直接在global对象上定义属性，那么在其他文件引入这个文件的时候，可以直接访问到global对象上的定义的属性，所有引入该模块的其他模块，都可以访问到在该模块中定义在global对象上的属性。

### 2 module对象

Node里面提供了一个内建函数,所有的函数都是Module构建函数的实例

```javascript
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  // ...
```

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 表示模块对外输出的值。

此外，Node为每一个模块都提供了一个exports变量，该变量指向module.exports的引用，相当于在每个模块的顶部

```javascript
var exports = module.exports;
```

如果在命令行下调用某个模块，比如`node something.js`，那么`module.parent`就是`undefined`。如果是在脚本之中调用，比如`require('./something.js')`，那么`module.parent`就是调用它的模块。利用这一点，可以判断当前模块是否为入口脚本。

```javascript
if (!module.parent) {
    // ran with `node something.js`
    app.listen(8088, function() {
        console.log('app listening on port 8088');
    })
} else {
    // used with `require('/.something.js')`
    module.exports = app;
}

```

### 3 require命令

**require命令的基本功能是: **

**1,读入  并执行(是在模块的作用域执行，而不是在全局作用域执行)  一个javascript文件，在内存生成一个对象，然后返回该对象的module.exports对象(即exports的引用）; **生成的对象如下

```javascript
{
  id: '...',  //模块的id,如果为定义则是文件的绝对路径
  exports: { ... },
  loaded: true,
  ...
}
```

**2 第一次加载模块会从指定的路径加载该模块，然后会将其缓存起来，以后每次加载该模块，都会从缓存中读取；**

**3 以后在加载同样的模块，则不会执行该模块；**

02module.js文件

```javascript
var a = 5 ,b = 5 ;
console.log(a+b);
module.exports = {func:function(){},name:'Jhon'}
```

03module.js文件

```javascript
var ret = require('./02module');//require进来的是02module.js的exports对象的引用而已；
require('./02module');
require('./02module').age = 14 ;
console.log('require模块的返回值',require('./02module'));
console.log(ret);
console.log(a);//a is not defined
```

随笔：但是对于seats.use引入的文件，如果不是通过define定义的模块，那么相当于在被引入的文件全局作用域执行。如果经过define定义，那么只对外导出了exports对象的接口。同样seajs.use如果先引入了不使用define定义的模块，那么后续引入的模块可以使用先引入的模块的中的变量。（其实就是seajs.use引入的依赖会按照引入的顺序加载并执行，后面的模块可以依赖前面的模块。

```javascript
//module2.js
var foo = 'bar';
//module3.js
define(function(require,exports,module){
    console.log(foo) ;//bar
    exports.something = 'something';
})
//index.html. //相当于module2.js，module3.js在index.html通过script标签引入并执行；
//module2.js相当于是直接执行，module3.js相当于一个闭包执行；但是函数作用域可以访问全局作用域中的变量foo
seajs.use('../js/module2','../js/module3'],function(a,b,c){
  
  seajs.use(['../module'],function(){
    // console.log(BDP)

  });
})

```



执行 : node  03module.js

```javascript
10     //证明require命令功能1
require模块的返回值 { func: [Function: func], name: 'Jhon', age: 14 } //证明require命令功能2
{ func: [Function: func], name: 'Jhon', age: 14 }
//以后在加载02module.js并不会执行该js文件,仅仅从缓存中取出exports属性的引用；
```

### 4 模块的加载规则

* 文件的加载规则

`require`命令用于加载**文件**，后缀名默认为`.js`。

```
var foo = require('foo');
//  等同于
var foo = require('foo.js');

```

根据参数的不同格式，`require`命令去不同路径寻找模块文件。

（1）如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，`require('/home/marco/foo.js')`将加载`/home/marco/foo.js`。

（2）如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，`require('./circle')`将加载当前脚本同一目录的`circle.js`。

（3）如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。

举例来说，脚本`/home/user/projects/foo.js`执行了`require('bar.js')`命令，Node会依次搜索以下文件。

- /usr/local/lib/node/bar.js
- /home/user/projects/node_modules/bar.js
- /home/user/node_modules/bar.js
- /home/node_modules/bar.js
- /node_modules/bar.js

这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。

（4）如果参数字符串不以“./“或”/“开头，而且是一个路径，比如`require('example-module/path/to/file')`，则将先找到`example-module`的位置，然后再以它为参数，找到后续路径。

（5）如果指定的模块文件没有发现，Node会尝试为文件名添加`.js`、`.json`、`.node`后，再去搜索。`.js`件会以文本格式的JavaScript脚本文件解析，`.json`文件会以JSON格式的文本文件解析，`.node`文件会以编译后的二进制文件解析。

（6）如果想得到`require`命令加载的确切文件名，使用`require.resolve()`方法。

* 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让`require`方法可以通过这个入口文件，加载整个目录。

在目录中放置一个`package.json`文件，并且将入口文件写入`main`字段。下面是一个例子。

```
// package.json
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }

```

`require`发现参数字符串指向一个目录以后，会自动查看该目录的`package.json`文件，然后加载`main`字段指定的入口文件。如果`package.json`文件没有`main`字段，或者根本就没有`package.json`文件，则会加载该目录下的`index.js`文件或`index.node`文件。

require加载文件流程如下：

http://www.infoq.com/resource/articles/nodejs-module-mechanism/zh/resources/image1.jpg

![image1](/Users/jim-w/Desktop/02studyspace/02mblog/img/image1.jpg)





[深入浅出nodeJs](http://www.infoq.com/cn/articles/nodejs-module-mechanism)

[阮一峰ES6-Module加载机制](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

[配置ES6运行环境](http://www.ruanyifeng.com/blog/2016/01/babel.html)

[ES6Module和nodeJSModule的区别](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

