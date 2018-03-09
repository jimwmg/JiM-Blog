---
title:  NodeJs-ChildProcess全局对象 
date: 2018-03-09 12:36:00
categories: nodejs
comments : true 
updated : 
---

###child_process模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

[childprocess类](http://nodejs.cn/api/child_process.html#child_process_class_childprocess)

### 1 [child_process模块为何？](http://nodejs.cn/api/child_process.html#child_process_child_process_execsync_command_options)

childprocess.js

```javascript
var childProcess = require('child_process');
console.log(childProcess);
```

node childprocess.js 输出如下：

```ajva
{ ChildProcess:
   { [Function: ChildProcess]
     super_:
      { [Function: EventEmitter]
        EventEmitter: [Circular],
        usingDomains: false,
        defaultMaxListeners: [Getter/Setter],
        init: [Function],
        listenerCount: [Function] } },
  fork: [Function],
  _forkChild: [Function],
  exec: [Function],
  execFile: [Function],
  spawn: [Function],
  spawnSync: [Function: spawnSync],
  execFileSync: [Function: execFileSync],
  execSync: [Function: execSync] }
```

### 2 exec.  execSync

`child_process.exec(command[, options][, callback]).` 异步执行 返回值：Childprocess对象

`child_process.execSync(command[, options])` 同步执行  返回值 命令执行后的buffer

**注意两者的返回值**

```javascript
var childProcess = require('child_process');
// console.log(childProcess)
function exec (cmd) {
  return childProcess.exec(cmd).toString()
}
function execSync (cmd) {
  return childProcess.execSync(cmd).toString().trim()
}
console.log(exec('npm --version'))
console.log(execSync('npm --version'))
//[object Object]
//3.10.10
```

### execFile

`child_process.execFile(file[, args][, options][, callback])`

```javascript

```



