---
title:  NodeJsFoundation 
date: 2016-11-20 12:36:00
categories: nodejs
comments : true 
updated : 
---

## 1 node.js基础

* 是建立在Chrome的JavaScript运行时很容易构建快速，可扩展的网络应用程序的平台。 Node.js使用**事件驱动**，**非阻塞I/O模型**，使得它重量轻，效率高，完美的跨分布式设备**运行数据密集型**实时应用。
* 传统的网络服务技术，是每个新增一个连接（请求）便生成一个新的线程，这个新的线程会占用系统内存，最终会占掉所有的可用内存。而 Node.js 仅仅只运行在一个单线程中，使用非 阻塞的异步 I/O 调用，所有连接都由该线程处理，在 libuv 的加分下，可以允许其**支持数万并发连接**（全部挂在该线程的[事件循环](http://en.wikipedia.org/wiki/Nodejs)中）。


````javascript
Node.js = Runtime Environment + JavaScript Library
````

### 1.1 node.js的特性

- **Node.js库异步和事件驱动 - **所有API异步是非阻塞。 这意味着一个基于Node.js的服务器不会等待API返回数据。 服务器移动到下一个API后调用它，Node.js事件的一个通知机制有助于服务器，以获得从以API调用的响应。
- **非常快** - 正在构建在谷歌Chrome的V8 JavaScript引擎，Node.js库代码执行是非常快的。
- **单线程但高度可扩展** - Node.js使用事件循环单线程模型。事件机制有助于服务器在非阻塞的方式作出反应，并使得服务器的高可扩展性，而不是它创建线程限制来处理请求的传统服务器。 Node.js使用单线程的程序和同样的程序处理比传统的服务器要大的多，比如：比Apache HTTP服务器请求服务的数量大得多。
- **无缓冲** - Node.js的应用从来没有缓冲任何数据。这些应用程序只需输出块中的数据。
- **许可证** - Node.js是在MIT许可下发布的。

### 1.2 node.js使用

* 引入 required 模块：我们可以使用 require 指令来载入 Node.js 模块。

  这个是Node.js自带的http模块，然后将其赋值给http变量

```javascript
  var http = require("http");
```

* 创建服务器：服务器可以监听客户端的请求，类似于 Apache 、Nginx 等 HTTP 服务器。以下代码可以建立一个正常工作的HTTP服务器；

```javascript
  var http = require('http');
  //http模块提供的函数:createSever，该函数会返回一个对象，这个对象有一个listen方法，listen方法有一个数值参数，指定  这个HTTP服务器监听的端口号
  http.createServer(function (request, response) {

  	// 发送 HTTP 头部 
  	// HTTP 状态值: 200 : OK
  	// 内容类型: text/plain
  	response.writeHead(200, {'Content-Type': 'text/plain'});

  	// 发送响应数据 "Hello World"
  	response.end('Hello World\n');
  }).listen(8888);

  // 终端打印如下信息
  console.log('Server running at http://127.0.0.1:8888/');
```

* 接收请求与响应请求 服务器很容易创建，客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。

### 1.3 nodejs组成

* 核心模块  由node环境提供，比如http  fs，url , path等模块
* 第三方模块，由社区，比如第三方提供，例如gulp browerSync moment等

##2 npm使用简介

```javascript
$ npm -v  查看版本号
$ npm install <Module name>  安装Node.js的模块的语法格式，比如
$ npm install express (本地安装)这个是常用的web框架模块 express
$ npm install express -g (全局安装)
var express = require("express") ; //安装好之后，express 包就放在了工程目录下的 node_modules 目录中，因此在代码中只需要通过 require('express') 的方式就好，无需指定第三方包路径。
$ npm uninstall express //卸载Node.js模块
$ npm ls 命令可以查看本地安装的包
$ npm ls -g 命令可以查看全局安装的包
$ npm search express 可以用来搜索模块
$ npm init 可以创建模块，这个模块是你自己的模块，会创建一个package。json文件
$ npm publish 可以发布模块，发布以后就可以像其他模块一样使用npm来进行安装
比如 创建一个 $ npm init myMoudle 信息填写正确之后
$ npm install myModule 可以安装这个模块
```

### Package.json 属性说明

- **name** - 包名。
- **version** - 包的版本号。
- **description** - 包的描述。
- **homepage** - 包的官网 url 。
- **author** - 包的作者姓名。
- **contributors** - 包的其他贡献者姓名。
- **dependencies** - 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。
- **repository** - 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。
- **main** - main 字段是一个模块ID，它是一个指向你程序的主要项目。就是说，如果你包的名字叫 express，然后用户安装它，然后require("express")。
- **keywords** - 关键字

### NPM 常用命令

除了本章介绍的部分外，NPM还提供了很多功能，package.json里也有很多其它有用的字段。

NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。

- NPM提供了很多命令，例如`install`和`publish`，使用`npm help`可查看所有命令。
- 使用`npm help `可查看某条命令的详细帮助，例如`npm help install`。
- 在`package.json`所在目录下使用`npm install . -g`可先在本地安装当前命令行程序，可用于发布前的本地测试。
- 使用`npm update `可以把当前目录下`node_modules`子目录里边的对应模块更新至最新版本。
- 使用`npm update  -g`可以把全局安装的对应命令行程序更新至最新版。
- 使用`npm cache clear`可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。
- 使用`npm unpublish @`可以撤销发布自己发布过的某个版本代码。


## 3 Node.js REPL(Read Eval Print Loop) (交互式解释器)

- **读取** - 读取用户输入，解析输入了Javascript 数据结构并存储在内存中。
- **执行** - 执行输入的数据结构
- **打印** - 输出结果
- **循环** - 循环操作以上步骤直到用户两次按下 **ctrl-c** 按钮退出。

Node 的交互式解释器可以很好的调试 Javascript 代码。并且可以直接调试node核心模块的代码;

比如下面的一些调试方法

```javascript
$ node   //可以启动node的终端
> url.parse('http://localhost:3000/a/b/c/d?name=Jhon',true)
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: null,
  search: '?name=Jhon',
  query: { name: 'Jhon' },
  pathname: '/a/b/c/d',
  path: '/a/b/c/d?name=Jhon',
  href: 'http://localhost:3000/a/b/c/d?name=Jhon' }
//使用简单表达式
> 3*6
18
//使用变量
> var x = 10 
undefined  //使用var生命的变量可以使用console.log打印出来
> console.log(x)
> console.log('hello there')
> x = 10 
10       //没有使用var声明的变量在回车键之后会直接打印出来
//多行表达式
> var x = 0
undefined
> do {
... x++;  //···符号是系统自动生成的，node会自动检测是否是连续的表达式
... console.log("x: " + x);
... } while ( x < 5 );
x: 1
x: 2
x: 3
x: 4
x: 5
undefined
//下划线(_) 变量可以直接获取表达式的运算结果
> var x =100
undefined    //var声明的变量不会直接打印出来
> var y = _  // _ 变量可以获取表达式运算的结果
undefined	//var声明的变量不会直接打印出来
> x++      //表达式运算的结果也会直接打印出来
100
> var y = _  
undefined
> console.log(y)  //打印运算结果
100
undefined
> ++x
102
> var y = _
undefined
> console.log(y)
102
undefined
> x+y
204
> var z = _
undefined
> console.log(z)
204
>

```

### REPL 命令

- **ctrl + c** - 退出当前终端。
- **ctrl + c 按下两次** - 退出 Node REPL。
- **ctrl + d** - 退出 Node REPL.
- **向上/向下 键** - 查看输入的历史命令
- **tab 键** - 列出当前命令
- **.help** - 列出使用命令
- **.break** - 退出多行表达式
- **.clear** - 退出多行表达式
- **.save filename** - 保存当前的 Node REPL 会话到指定文件
- **.load filename** - 载入当前 Node REPL 会话的文件内容。


## 4 Node中的全局变量，全局对象，和全局函数

###全局对象

- **global**：表示Node所在的全局环境，类似于浏览器的window对象。需要注意的是，如果在浏览器中声明一个全局变量，实际上是声明了一个全局对象的属性，比如`var x = 1`等同于设置`window.x = 1`，但是Node不是这样，至少在模块中不是这样（REPL环境的行为与浏览器一致）。在模块文件中，声明`var x = 1`，该变量不是`global`对象的属性，`global.x`等于undefined。这是因为模块的全局变量都是该模块私有的，其他模块无法取到。
- **process**：该对象表示Node所处的当前进程，允许开发者与该进程互动。
- **console**：指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能。

### 全局函数

- **setTimeout()**：用于在指定毫秒之后，运行回调函数。实际的调用间隔，还取决于系统因素。间隔的毫秒数在1毫秒到2,147,483,647毫秒（约24.8天）之间。如果超过这个范围，会被自动改为1毫秒。该方法返回一个整数，代表这个新建定时器的编号。
- **clearTimeout()**：用于终止一个setTimeout方法新建的定时器。
- **setInterval()**：用于每隔一定毫秒调用回调函数。由于系统因素，可能无法保证每次调用之间正好间隔指定的毫秒数，但只会多于这个间隔，而不会少于它。指定的毫秒数必须是1到2,147,483,647（大约24.8天）之间的整数，如果超过这个范围，会被自动改为1毫秒。该方法返回一个整数，代表这个新建定时器的编号。
- **clearInterval()**：终止一个用setInterval方法新建的定时器。
- **require()**：用于加载模块。
- **Buffer()**：用于操作二进制数据。

### 全局变量

- `__filename`：指向当前运行的脚本文件名。
- `__dirname`：指向当前运行的脚本所在的目录。

