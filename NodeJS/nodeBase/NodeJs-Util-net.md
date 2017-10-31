---
title:  NodeJs Util 模块 
date: 2016-12-21 12:36:00
categories: nodejs
tags : util
comments : true 
updated : 
layout : 
---

### 1 Node.js Net 模块提供了一些用于底层的网络通信的小工具，包含了创建服务器/客户端的方法，我们可以通过以下方式引入该模块：

1.1 net相关API

net.js 文件

```javascript
var net  = require('net');
console.log(net);
```

执行命令  node  net.js

```javascript
{ createServer: [Function],
  createConnection: [Function],
  connect: [Function],
  _normalizeConnectArgs: [Function: normalizeConnectArgs],
  Socket: { [Function: Socket] super_: { [Function: Duplex] super_: [Object] } },
  Stream: { [Function: Socket] super_: { [Function: Duplex] super_: [Object] } },
  Server:
   { [Function: Server]
     super_:
      { [Function: EventEmitter]
        EventEmitter: [Circular],
        usingDomains: false,
        defaultMaxListeners: [Getter/Setter],
        init: [Function],
        listenerCount: [Function] } },
  _createServerHandle: [Function: createServerHandle],
  isIP: [Function: isIP],
  isIPv4: [Function: isIPv4],
  isIPv6: [Function: isIPv6],
  _setSimultaneousAccepts: [Function] }

```

1.2 net.createServer([options],[ connectionListener])
创建一个 TCP 服务器。参数 connectionListener 自动给 'connection' 事件创建监听器。

connection事件会在一个新连接创建后被触发

net.socket对象实的实例现了一个双工流的接口

* 用户创建客户端(使用 connect())时使用,
* 由 Node 创建它们，并通过 connection 服务器事件传递给用户。

1.2.1 net.Socket类是 EventEmitter的实例有以下事件

- data事件，当接收到数据的时候触发该事件，向该事件的监听器传入
- end事件，当socket连接的另一端发出FIN包时被触发，也就是说数据传输完毕的时候触发该事件



### 2 Nodejs.path模块

```javascript
var path = require("path");

// 格式化路径
console.log('normalization : ' + path.normalize('/test/test1//2slashes/1slash/tab/..'));

// 连接路径,用于根据电脑的不同的操作系统连接路径 
console.log('joint path : ' + path.join('/test', 'test1', '2slashes/1slash', 'tab', '..'));

// 转换为绝对路径,会解析文件所在路径的绝对路径,如果是服务器就是相对于服务器根目录所在路径,如果是磁盘就是相对于磁盘的根目录
console.log('resolve : ' + path.resolve('main.js'));

// 路径中文件的后缀名
console.log('ext name : ' + path.extname('main.js'));
```

```java
$ node main.js 执行main.js文件
  
normalization : /test/test1/2slashes/1slash
joint path : /test/test1/2slashes/1slash
resolve : /web/com/1427176256_27423/main.js
ext name : .js
```

