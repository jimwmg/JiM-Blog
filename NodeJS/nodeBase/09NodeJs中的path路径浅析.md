---
title:  NodeJs中的path路径浅析
date: 2017-01-17 12:36:00
categories: nodejs
tags : path
comments : true 
updated : 
layout : 
---

### 1  node 服务器端 文件路径的相关问题

首先来看下基础概念

node提供了两个全局变量 _ _filename (表示当前文件的绝对根路径) 和 _ _dirname  (表示当前文件所在目录的绝对根路径)

先来看下测试代码的目录结构

```
F : 
	-workspace 
    	-app
    		-hero-admin
    			-common.js
    		-path
    			-a.js
```

common.js	

```javascript
console.log('this is some data from hero-admin')
```

a.js

```javascript
var path = require('path');

console.log('path__dirname=='+ __dirname);
console.log('path.process==' + __filename);
console.log('process.cwd=='+process.cwd());
console.log('path.resolve=='+path.resolve('./'));
```

第一种情况，在path目录下  执行命令    node a.js     在node 终端输出结果如下

```javascript
//path__dirname==F:\workspace\app\path
//path.process==F:\workspace\app\path\a.js
//process.cwd==F:\workspace\app\path
//path.resolve==F:\workspace\app\path
```

第二种情况，在 app 目录下  执行命令   node  path/a.js

```javascript
//path__dirname==F:\workspace\app\path
//path.process==F:\workspace\app\path\a.js
//process.cwd==F:\workspace\app
//path.resolve==F:\workspace\app
```

**通过上面的代码演示，我们可以发现，_ _ dirname 和  _ _ filename 的值是 和node命令执行的时候所在的目录没有关系的，无论我们在哪个目录执行  a.js   文件  _ _ dirnam 和 _ _ filename的值 永远都是返回  a.js 该文件所属目录的绝对路径(相对于根目录)**，这个特性记住，下面会有应用。

### 2 对于一般文件的引用的路径，会受到启动nodejs终端不同路径的影响 

接下来我们改变下a.js文件的内容

```javascript
var fs = require('fs');

fs.readFile('../hero-admin/common.js','utf-8',function(err,data){
    if(err) return console.log(err);
    console.log(data);

})
```

2.1 此时我们在path目录下运行  node a.js

可以得到common.js里面的内容 

2.2 如果我们改在 app  目录下运行   node path/a.js

此时会抛出错误，找不到文件路径

```javascript
{ Error: ENOENT: no such file or directory, open 'F:\workspace\hero-admin\common.js'
    at Error (native)
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'F:\\workspace\\hero-admin\\common.js' 
  //可以看到此时请求的路径  ../hero-admin/common.js  是相对于 app 目录而言的
}
```

如果我们改下readFile的请求路径 

还在app 目录下运行   node path/a.js

```javascript
var fs = require('fs');
//相对于app当前目录，此时就可以得打文件的内容
fs.readFile('./hero-admin/common.js','utf-8',function(err,data){
    if(err) return console.log(err);
    console.log(data);
})
```

根据以上，我们可以得出结论

**./     和    ../     或者 文件名 （比如app.json）是相对于**启动服务器所在路径**为基准的，而不是被启动的文件所在的路径为基准 **

这个是我们需要注意的一点，node中的文件的路径都是相对于启动node终端的那个目录为基准的，重要事情说两遍

同样包括如果我们引入的模块中也有相对路径的引用，此时，引用的模块中的路径还是相对于启动node终端的那个目录为基准的，重要事情说三遍

**同样，nodejs进程的工作目录也是可以变更的，通过 `process.chdir()`方法变更Node.js进程的当前工作目录，如果变更目录失败会抛出异常(例如，如果指定的目录不存在)。**

**当然以上仅仅指的是文件的路径引用，会受到node启用终端的位置不同而受到影响，但是定义的模块不会受node终端启用的影响，这个稍后会有demo解释**

2.3  /  代表服务器所在磁盘的根目录

修改readFile请求的路径

还在app 目录下运行   node path/a.js

```javascript
var fs = require('fs');
fs.readFile('/hero-admin/common.js','utf-8',function(err,data){
    if(err) return console.log(err);
    console.log(data);
})
```

```javascript
{ Error: ENOENT: no such file or directory, open 'F:\hero-admin\common.js'
    at Error (native)
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'F:\\hero-admin\\common.js' 
  //可以看到服务器去F盘根目录去寻找这个文件了
}

```

2.4  但是我们在实际开发中总是避免不了对文件的路径的改变和移动，使得我们的项目结构更加清晰，或者说启动服务器位置不同，这个时候对于文件的相对路径问题如何解决？

还是以上目录结构  a.js 文件如下

```javascript
var path = require('path');
console.log(__dirname);
console.log(path.join(__dirname,'../02hero-admin/common.js'));

var fs = require('fs');
fs.readFile(path.join(__dirname,'../02hero-admin/common.js'),'utf-8',function(err,data){
    if(err) return console.log(err);
    console.log(data);
})
```

我们在path目录下执行 node a.js   和我们在app目录下执行  node path/a.js

输出的结果都是一样的

```html
F:\workspace\app\path
F:\workspace\app\hero-admin\common.js
console.log('this is some data from lib')

```

由此可见，我们可以利用 __dirname不受启动服务其所在路径的影响的这个特性，使用绝对路径来动态读取文件内容,

**这个时候无论我们在任何位置启用a.js文件，路径问题就不在有了**

### 3 对于模块的的引用的路径，不会受到启动nodejs终端的不同路径影响

我们队目录结构稍微做一下修改

```
F : 
	-workspace 
    	-app
    		-hero-admin
    			-common.js
    			-myModule.js
    		-path
    			-a.js
```

myModule.js   我们就简单的返回一个对象

```javascript
module.exports = {name:"Jhon",age:14};
```

a.js

```javascript
var ret = require('../02hero-admin/myModule');
console.log(ret);
```

这个时候，无论我们是在任何目录启动node终端执行 a.js  都可以引用到myModule.js这个模块

**也就是说模块的引用永远都是相对于a.js文件的，而文件的引用却是相对于启用node终端的路径**

path目录下执行  node a.js   以及  app目录下执行   node path/a.js  终端输出如下

```
{ name: 'Jhon', age: 14 }
```

平常我们在部署项目的时候，路径的引用问题是一个令人头疼的问题，不过最基本的原理搞明白了，问题还是可以迎刃而解的。

### 4 API

#### `path.resolve()` : 将路径或者路径片段处理成 **绝对路径**

- 如果处理完所有 `path` 片段后还未生成绝对路径，则使用当前工作目录。

- 生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径是根目录。

- 长度为零的 `path` 片段会被忽略。

- 如果没有传入 `path` 片段，则返回当前工作目录的绝对路径。



