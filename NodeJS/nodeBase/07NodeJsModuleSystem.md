---
title:  NodeJs Module System 
date: 2016-10-27 12:36:00
categories: nodejs
tags : Module
comments : true 
updated : 
layout : 
---

### 1 Node.js 模块系统

模块是Node.js 应用程序的基本组成部分，文件和模块是一一对应的。换言之，一个 Node.js 文件就是一个模块，这个文件可能是JavaScript 代码、JSON 或者编译过的C/C++ 扩展。

模块之间的通信方式 : require引入  module.exports  和 exports 暴露某个模块的对外接口

### 2 创建一个模块

2.1 首先来看下node本身模块是什么

2.1.1 b.js文件

```javascript
console.log(module);
console.log(module.exports);
```

执行命令 node b.js  输出如下

```javascript
Module {
  id: '.',
  exports: {},
  parent: null,  //
  filename: 'F:\\workspace\\01-node\\b.js', //代表文件的路径
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
{}   //这个是module.exports  本身是一个空对象

```

a.js 文件            require(package)  返回值是module.exports

```javascript
var res = require('./b.js');
console.log(res);
```

执行命令 node a.js  输出如下

```javascript
Module {
  id: 'F:\\workspace\\01-node\\b.js',
  exports: {},
  parent:
   Module {
     id: '.',
     exports: {},
     parent: null,
     filename: 'F:\\workspace\\01-node\\a.js',
     loaded: false,
     children: [ [Circular] ],
     paths:
      [ 'F:\\workspace\\01-node\\node_modules',
        'F:\\workspace\\node_modules',
        'F:\\node_modules' ] },
  filename: 'F:\\workspace\\01-node\\b.js',
  loaded: false,
  children: [],        //被该模块引用的模块对象。
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }

{}   //以上是b.js输出

{}  //这个是a.js输出
```

由此可得知require返回的是所引的package的module.exports；

**所以我们可以通过改变exports的值**

 2.1.2返回一个构造函数

b.js 

```javascript
module.exports = function(){

}
console.log(module.exports);
```

执行 node b.js 

```html
[Function]
```

执行 node a.js

```html
[Function]   //这个是b.js的输出 console.log(module.exports);
[Function]   //这个是a.js的输出 console.log(res);
```

2.1.3 或者直接给module.exports对象添加属性

 b.js  

```javascript
module.exports.prop = function(){}
console.log(module.exports);
```

执行node b.js

```javascript
{ prop: [Function] }
```

此时a.js通过require引用的时候返回的就是这个对象

以下实例便于理解:

2.2 exports.prop   形式创建模块

```javascript
//sayHello.js
exports.sayhi = function(){ //exports对象可以定义sayhello.js将该模块的接口
    console.log("this is a module we made");
}
```

引入创建的模块

```javascript
//main.js
var hello = require('./sayHello'); 
console.log(hello) ;//{ sayhi: [Function] }
hello.sayhi();
```

以上实例中，代码 require('./sayhello') 引入了当前目录下的sayhello.js文件（./ 为当前目录，node.js默认后缀为js）。Node.js 提供了exports 和 require 两个对象，其中 exports 是模块公开的接口，require 用于从外部获取一个模块的接口，即所获取模块的 exports 对象。

2.3 module.exports = function(){   }

如果希望模块根导出为一个函数（比如构造函数）或一次导出一个完整的对象而不是每次都创建一个属性，可以把它赋值给 module.exports 而不是 exports。

```javascript
//square.js
module.exports = (width) => {
    return{
            area : () => width*width
    }
}
```

```javascript
//main.js
const square = require('./square');  
console.log(square);//[Function]
var res = square(2);//{ area: [Function: area] }
console.log(res);
console.log(res.area());
```

```javascript
const square = require('./square');
//可以理解为 
const square = (width) => {
    return{
            area : () => width*width
    }
}
```

返回一个构造函数

```javascript
//myevents.js
module.exports = function myEvents(){
    this.on = function(){
        console.log("通过on绑定事件");
    };
    this.emit = function(){
        console.log("通过emit触发事件");
    };
}
```

```javascript
//main.js
const Event = require('./myevents');
console.log(Event);
var event = new Event();
console.log(event);
console.log(event.on);
console.log(event.emit);
```

```javascript
const Event = require('./myevents');
//可以理解为 
const Event = function myEvents(){
    this.on = function(){
        console.log("通过on绑定事件");
    };
    this.emit = function(){
        console.log("通过emit触发事件");
    };
}
```

2.4 require(module)   的内部实现，就是返回所引用模块的module.exports 

module.exports 和 exports 的区别 :

exports 变量是在模块的文件级别作用域内有效的，**它在模块  被执行  前被赋于 module.exports的值**。

它有一个快捷方式，以便 module.exports.prop= ... 可以被更简洁地写成 exports.prop= ...。 注意，就像任何变量，如果一个新的值被赋值给 exports，它就不再绑定到 module.exports；

之所以有这个简洁的写法，根本原因的node做了一个工作  exports在模块执行前被赋值 module.exports

2.4.1  b.js 

```javascript
console.log(module);
exports.name = "Jhon";
//可以被导出到引用的模块
console.log(module);
```

执行  node b.js   终端输出如下

```javascript
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
Module {
  id: '.',
  exports: { name: 'Jhon' },
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
```

a.js

```javascript
var res = require('./b.js');//可以得到 b 模块定义的数据  { name: 'Jhon' }
```

2.4.2 b.js

```javascript
console.log(module);
exports = {name:"Jhon"};//此时exports不再和module.exports指向同一块内存地址，最后导出的module.exports 还是未初始化的时候的一个空对象
//不会导出到引用的模块，只在模块内有效
console.log(module);
```

执行 node b.js    注意exports的内容

```javascript
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
```

a.js

```javascript
var res = require('./b.js');//此时得到 b 模块到处的内容  为 { }
```

2.4.3  b.js

```javascript
console.log(module);
module.exports = {name:"Jhon"};
console.log(module);
```

执行  node b.js

```javascript
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }
Module {
  id: '.',
  exports: { name: 'Jhon' },
  parent: null,
  filename: 'F:\\workspace\\01-node\\10b.js',
  loaded: false,
  children: [],
  paths:
   [ 'F:\\workspace\\01-node\\node_modules',
     'F:\\workspace\\node_modules',
     'F:\\node_modules' ] }

```

a.js

```javascript
var res = require('./b.js');//可以得到 b 模块定义的数据  { name: 'Jhon' }
```

2.4.4 根据以上的实验结果，可以大概得知require函数的内部实现

```javascript
//require()实现
function require(...) {
    var module = { exports: {} };
        ((module, exports) => {
            // 你的模块代码在这。在这个例子中，定义了一个函数。
            function some_func() {};
            exports = some_func;// exports在文件执行前被赋值为 module.exports,这里在重新赋值其他数据，
        // 此时，exports 不再是一个 module.exports 的快捷方式，
        // 且这个模块依然导出一个空的默认对象。
            module.exports = some_func;
        // 此时，该模块导出 some_func，而不是默认对象。
        })(module, module.exports);
    return module.exports; //require函数导出的是模块的 module.exports,而不是exports
}
```

2.5 require加载模块的查找规则

2.5.1 nodejs模块载入策略

[参阅深入浅出nodejs]: http://www.infoq.com/cn/articles/nodejs-module-mechanism

Node.js的模块分为两类，一类为**原生（核心）模块**，一类为**文件模块**。原生模块在Node.js源代码编译的时候编译进了二进制执行文件，加载的速度最快。另一类文件模块是动态加载的，加载速度比原生模块慢。但是Node.js对原生模块和文件模块都进行了缓存，于是在第二次require时，是不会有重复开销的。其中原生模块都被定义在lib这个目录下面，文件模块则不定性

文件模块又分为以下三类模块，这三类文件以后缀名来区分，nodejs会根据后缀名来决定如何加载文件模块

- .js。通过fs模块同步读取js文件并编译执行。
- .node。通过C/C++进行编写的Addon。通过dlopen方法进行加载。
- .json。读取文件，调用JSON.parse解析加载。

我们有没有考虑过这样一个情况，为什么一个文件没有声明require  module却可以直接使用这些变量值呢？其实nodejs做了以下工作:

假如有一个 circle.js

```javascript
var PI = Math.PI;
exports.area = function (r) {
    return PI * r * r;
};
exports.circumference = function (r) {
    return 2 * PI * r;
};
```

app.js

```javascript
var circle = require('./circle.js');
console.log( 'The area of a circle of radius 4 is ' + circle.area(4));
```

当我们在终端执行命令  node app.js    的时候，nodejs会对app.js进行编译包装，包装之后其实就是

```javascript
(function (exports, require, module, __filename, __dirname) {
    var circle = require('./circle.js');
    console.log('The area of a circle of radius 4 is ' + circle.area(4));
});
```

这就是为什么我们直接在终端输入命令    node filename.js的时候，可以直接调用 exports require module等

### 3 node模块解析规则

#### 从文件模块缓存中加载

尽管原生模块与文件模块的优先级不同，但是都不会优先于从文件模块的缓存中加载已经存在的模块。

#### 从原生模块加载

原生模块的优先级仅次于文件模块缓存的优先级。require方法在解析文件名之后，优先检查模块是否在原生模块列表中。以http模块为例，尽管在目录下存在一个http/http.js/http.node/http.json文件，require(“http”)都不会从这些文件中加载，而是从原生模块中加载。

原生模块也有一个缓存区，同样也是优先从缓存区加载。如果缓存区没有被加载过，则调用原生模块的加载方式进行加载和执行。

#### 从文件加载

当文件模块缓存中不存在，而且不是原生模块的时候，Node.js会解析require方法传入的参数，并从文件系统中加载实际的文件，加载过程中的包装和编译细节在前一节中已经介绍过，这里我们将详细描述查找文件模块的过程，其中，也有一些细节值得知晓。

require方法接受以下几种参数的传递：

- http、fs、path等，原生模块。
- ./mod或../mod，相对路径的文件模块。
- /pathtomodule/mod，绝对路径的文件模块。
- mod，非原生模块的文件模块。

**绝对路径：**require支持以（/）或者盘符（C:）开头的绝对路径

**相对路径：**支持以（./开头的相对路径）

==**注意：**==但这两种路径在模块之间建立了强耦合关系，一旦某个模块文件的存放位置需要变更，使用该模块的其它模块的代码也需要跟着调整，变得牵一发动全身，不建议使用。

**第三种形式的路径（常用方法）：**写法类似于`foo/bar`，按照以下规则进行解析，直到找到模块

- **内置模块：**如果传递给require函数的是`NodeJS内`置模块名称，不做路径解析，直接返回内部模块的导出对象，例如`require('fs')`。

- **node_modules目录：**`NodeJS`定义了一个特殊的node_modules目录用于存放模块。例如某个模块的绝对路径是`/home/user/hello.js`，在该模块中使用`require('foo/bar')`方式加载模块时，则`NodeJS`依次尝试使用以下路径

  - `/home/user/node_modules/foo/bar`
  - `/home/node_modules/foo/bar`
  - `/node_modules/foo/bar`

- **NODE_PATH环境变量：**与PATH环境变量类似，`NodeJS`允许通过NODE_PATH环境变量来指定额外的模块搜索路径。NODE_PATH环境变量中包含一到多个目录路径，路径之间在Linux下使用`:`分隔，在Windows下使用`;`分隔。例如定义了以下NODE_PATH环境变量：

  - `NODE_PATH=/home/user/lib:/home/lib`

  当使用`require('foo/bar')`的方式加载模块时，则NodeJS依次尝试以下路径。

  - `/home/user/lib/foo/bar`
  - `/home/lib/foo/bar`

对于如何设置 `NODE_PATH` 

```javascript
"exec": "export NODE_PATH=/Users/path/to/dir && node xxx.js",
```

