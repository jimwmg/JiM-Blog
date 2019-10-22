---
title:  NodeJs-ChildProcess全局对象 
date: 2018-03-09 12:36:00
categories: nodejs
comments : true 
updated : 
---

### 1 child_process模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

```javascript
var child_process = require('child_process');

```

默认情况下，Node.js 的父进程与衍生的子进程之间会建立 `stdin`、`stdout` 和 `stderr` 的管道。

* [`child_process.spawn()`](http://nodejs.cn/s/CKoDGf) 会异步地衍生子进程，且不会阻塞 Node.js 事件循环。 [`child_process.spawnSync()`](http://nodejs.cn/s/bmkUrE) 则同步地衍生子进程，但会阻塞事件循环直到衍生的子进程退出或被终止。

`child_process` 模块还提供了其他一些同步和异步的方法。 每个方法都是基于 `child_process.spawn()` 或 `child_process.spawnSync()` 实现的。

- [`child_process.exec()`](http://nodejs.cn/s/pkpJMy): 衍生一个 shell 并在 shell 上运行命令，当完成时传入 `stdout` 和 `stderr` 到回调函数。
- [`child_process.execFile()`](http://nodejs.cn/s/N6uK8q): 类似 `child_process.exec()`，但直接衍生命令且无需先衍生 shell。
- [`child_process.fork()`](http://nodejs.cn/s/VDCJMa): 衍生一个新的 Node.js 进程，并通过 IPC 通讯通道来调用指定的模块，该通道允许父进程与子进程之间相互发送信息。
- [`child_process.execSync()`](http://nodejs.cn/s/i6KxMV): `child_process.exec()` 的同步版本，会阻塞 Node.js 事件循环。
- [`child_process.execFileSync()`](http://nodejs.cn/s/ed75fU): `child_process.execFile()` 的同步版本，会阻塞 Node.js 事件循环。

对于某些用例，比如自动化的 shell 脚本，[同步的方法](http://nodejs.cn/s/Kexyms)更方便。 但大多数情况下，同步的方法会明显影响性能，因为它会拖延事件循环直到衍生进程完成。

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

### [spawn](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options) [spawnSync](http://nodejs.cn/api/child_process.html#child_process_child_process_spawnsync_command_args_options)

```javascript
const  {spawnSync} = require('child_process')
const crnaProjectCreationResponse = spawnSync(
    'create-react-native-app',
    ['react-native-demo'],
    { stdio: "inherit", shell: true }
  );
const crnaProjectCreationResponse = spawnSync(
    'npm',
    ['install','vue-native-core','vue-native-helper','--save'],
    { shell: true }
  );
```

### exec.  execSync

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
child_process.exec(`open ${__dirname}`);
//mac 下打开执行文件的目录；
```

### execFile

`child_process.execFile(file[, args][, options][, callback])`

```javascript
const {execFile, execFileSync} = require('child_process');
const path = require('path')
//3 execFile(file,args<string[]>,options<object>,callback) execFileSync
//file 是要运行的可执行文件的名称或者路径
const execFileRet = execFile('node',['--version'],{encoding:'utf-8'},(error,stdout,stderr) => {
  console.log('execFileRet-stdout',stdout)
  console.log('execFileRet-stderr',stderr)
})
const execFileSyncRet = execFileSync('node',['--version'],{encoding:'utf-8'}) 
debugger;
```

### 



