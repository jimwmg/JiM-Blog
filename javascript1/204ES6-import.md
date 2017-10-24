---
title: ES6 import
date: 2017-05-05 12:36:00
categories: ES6
tags: import
comments : true 
updated : 
layout : 
---

### 1 了解ES6 模块加载和Common.js模块加载的区别

1.1 Common.js语法中的模块加载加载得是引用的模块暴露出来的module.exports 整体

1.2 ES6的模块加载可以'静态加载,也就是说加载部分接口,而不是加载整个对象'

```javascript
// CommonJS模块
let { stat, exists, readFile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面代码的实质是整体加载`fs`模块（即加载`fs`的所有方法），生成一个对象（`_fs`），然后再从这个对象上面读取3个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

```javascript
// ES6模块
import { stat, exists, readFile } from 'fs';
```

ES6 模块不是对象，而是通过`export`命令显式指定输出的代码，再通过`import`命令输入。

上面代码的实质是从`fs`模块加载3个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

注意: ES6 模块之中，顶层的`this`指向`undefined`，即不应该在顶层代码使用`this`。

### 2 ES6模块的命令组成

主要有export和import两个命令组成;export用于规定模块对外的接口;import用于输入其他模块提供的功能接口

2.1 export

profile.js文件

```javascript
//第一种写法
export var name = 'JiM';

export function f(){
    console.log('this is a func');
    
}

//-----------------------------------------------
//第二种写法
var name1 = 'Jhon' ;

function f1 (){
    console.log('this is a func1');
    
}

export { name1,f1 } ;//注意暴露出去的写法必须用{}包起来
```

main.js

```javascript
import {name ,name1 ,f,f1} from './profile.js';
```

最后，`export`命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的`import`命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6模块的设计初衷。

**export default ** 用来指定模块默认输出的接口,此时**import该模块的就不需要`{ }`** 括起来了,如下:

**但是一定要注意,如果不是export default接口,那么导入该接口的时候,必须通过import `{ } `的方式**(这个小坑踩了好几次)

```javascript
// 第一组
export default function crc32() { // 输出
  // ...
}

import crc32 from 'crc32'; // 输入

// 第二组
export function crc32() { // 输出
  // ...
};

import {crc32} from 'crc32'; // 输入
```

**export default ** 也可以默认导出任何数据类型

```javascript
export default {userData : null , msg : "login"}
```

`export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。所以，`import`命令后面才不用加大括号，因为只可能对应一个方法。

正是因为`export default`命令其实只是输出一个叫做`default`的变量，所以它后面不能跟变量声明语句。

2.2 import 

import命令接受一堆大括号,用于引出模块中的接口,from后面接的是模块的路径,可以是相对路径,也可以是绝对路径,如果是模块标识,需要进行配置,告诉浏览器引擎如何加载该模块中的接口;

* import命令具有声明提升功能,会提升到整个模块的头部
* import命令是静态执行的,不能使用变量和表达式

```javascript
foo();

import { foo } from 'my_module';
```

上面的代码不会报错，因为`import`的执行早于`foo`的调用。这种行为的本质是，`import`命令是编译阶段执行的，在代码运行之前。

```javascript
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

由于`import`是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。