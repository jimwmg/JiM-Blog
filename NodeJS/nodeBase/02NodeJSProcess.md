---
title:  NodeJsProcess全局对象 
date: 2016-11-20 12:36:00
categories: nodejs
comments : true 
updated : 
---
###1 Process对象简介

`process`对象是 Node 的一个全局对象，提供当前 Node 进程的信息。它可以在脚本的任意位置使用，不必通过`require`命令加载。该对象部署了`EventEmitter`接口。

### 2 Process全局对象基本使用

#### 属性

- `process.argv`：返回一个数组，成员是当前进程的所有命令行参数。
- `process.env`：返回一个对象，成员为当前Shell的环境变量，比如`process.env.HOME`。
- `process.installPrefix`：返回一个字符串，表示 Node 安装路径的前缀，比如`/usr/local`。相应地，Node 的执行文件目录为`/usr/local/bin/node`。
- `process.pid`：返回一个数字，表示当前进程的进程号。
- `process.platform`：返回一个字符串，表示当前的操作系统，比如`Linux`。
- `process.title`：返回一个字符串，默认值为`node`，可以自定义该值。
- `process.version`：返回一个字符串，表示当前使用的 Node 版本，比如`v7.10.0`。


```javascript
// print process.argv
//process-args.js文件
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
//然后执行
node process-args.js one two=three four
```

```
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```



#### 方法 

- `process.chdir()`：切换工作目录到指定目录。
- `process.cwd()`：返回运行当前脚本的工作目录的路径。
- `process.exit()`：退出当前进程。
- `process.getgid()`：返回当前进程的组ID（数值）。
- `process.getuid()`：返回当前进程的用户ID（数值）。
- `process.nextTick()`：指定回调函数在当前执行栈的尾部、下一次Event Loop之前执行。
- `process.on()`：监听事件。
- `process.setgid()`：指定当前进程的组，可以使用数字ID，也可以使用字符串ID。
- `process.setuid()`：指定当前进程的用户，可以使用数字ID，也可以使用字符串ID。
-  process.binding(name) :这个方法用于返回指定名称的内置模块。Process对象同样部署了EventEmitter的接口，所以可以调用 Process.on 进行事件绑定等其他事件操作；

#### 事件

- `data`事件：数据输出输入时触发
- `SIGINT`事件：接收到系统信号`SIGINT`时触发，主要是用户按`Ctrl + c`时触发。
- `SIGTERM`事件：系统发出进程终止信号`SIGTERM`时触发
- `exit`事件：进程退出前触发