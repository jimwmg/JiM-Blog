---
title: javascript异步
date: 2017-07-07
categories: javascript
tags: sync
---

##  1 javascript异步操作的方式

### 1.1 简介

javascript语言是单线程的，所谓“单线程”，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务。

Javascript 语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。“同步模式”就是传统做法，后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的。这往往用于一些简单的、快速的、不涉及 IO 读写的操作。

“异步模式”则完全不同，每一个任务分成两段，第一段代码包含对外部数据的请求，第二段代码被写成一个回调函数，包含了对外部数据的处理。第一段代码执行完，不是立刻执行第二段代码，而是将程序的执行权交给第二个任务。等到外部数据返回了，再由系统通知执行第二段代码。所以，程序的执行顺序与任务的排列顺序是不一致的、异步的。

### 1.2 回调函数

```javascript
//最简单的回调函数如下
function f1(cb){
  //somecode
  cb()
}
f1()
//当f1函数执行完毕之后，最后一行代码执行f2函数，这就是一个最简单的异步操作
```

回调函数的优点就是简单，容易理解和部署；缺点就是代码之间耦合度太高，不易维护，使得程序结构混乱，而且每个人物只能嵌套一个回调函数

### 1.3 事件监听

事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

### 1.4 事件订阅／发布

“事件”完全可以理解成”信号”，如果存在一个”信号中心”，某个任务执行完成，就向信号中心”发布”（publish）一个信号，其他任务可以向信号中心”订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做”[发布/订阅模式](http://en.wikipedia.org/wiki/Publish-subscribe_pattern)“（publish-subscribe pattern），又称”[观察者模式](http://en.wikipedia.org/wiki/Observer_pattern)“（observer pattern）。

## 2 异步执行的方式

### 2.1 串行执行

我们可以编写一个流程控制函数，让它来控制异步任务，一个任务完成以后，再执行另一个。这就叫串行执行。

### 2.2 并行执行

流程控制函数也可以是并行执行，即所有异步任务同时执行，等到全部完成以后，才执行final函数。

### 2.3 并行与串行 的结合

所谓并行与串行的结合，就是设置一个门槛，每次最多只能并行执行n个异步任务。这样就避免了过分占用系统资源

## 3 Promise对象

Promise构造函数接受一个函数作为参数，该函数接受两个参数，第一个参数是resolve函数，第二个参数是reject函数

```javascript
var p = new Promise(function(resolve, reject) {
  // 异步操作的代码

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

```

Promise构造函数的then函数接受也是接受两个函数作为参数,其中

* 第一个参数是reslove函数成功执行后执行的函数
* 第二个参数是reject函数成功执行后执行的函数

```javascript
p.then(function(value) {
  // success
}, function(value) {
  // failure
});
```

## 4 ES6的异步编程

### 4.1 Generator函数

该函数有以下特征：

一是，`function`关键字与函数名之间有一个星 * 号；

二是，函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”），通过return语句定义结束执行。

三是，Generaotr函数的调用方法和普通函数调用方法一样，也是在函数名后面加上一对（），**不同的是调用Generator函数之后，该函数并不执行，返回的也不是函数的运行之后的结果，而是返回一个指向内部状态的指针对象，也就是一个遍历器对象，这个遍历器对象代表着Generator函数的内部指针。**

四是，返回的遍历器对象都有一个next方法，必须调用next方法，才能开始执行Generator函数，这种执行有两种情况：1，第一次执行next函数，将从Generator函数头部开始执行 ，2，以后在执行next函数，将从上次停下来的地方开始执行。直到遇到下一个yield或者return，也就是说Generator函数是分段执行的。3，yield指令用来暂停Generotor函数的执行next方法可以恢复Generator函数的执行。4，如果没有return语句，那么将会一直执行Generator函数找到结束

**当然，generator函数也可以直接通过for-of进行遍历**

**每次执行next方法，返回的结果是一个有着value和done属性的一个对象；value属性值是yield指令后面的表达式的值，done属性是一个布尔值，表示是否遍历结束。**

首先需要理解yeild关键字：它的作用是“命令”。和var不同，不是用来声明，但是和return一样，用来告知程序某种状态，return告诉程序要返回什么值（也意味着结束，结束的时候才会返回值嘛），而yield告诉程序当前的状态值，而且你运行到这里给我暂停一下。

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

```

**yield指令只能用在Generator函数中，用在其他函数中都会报错**

```javascript
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
```

**yield表达式如果放在另外一个表达式里面，——必须放在圆括号里面**

```javascript
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

**yield表达式可以作为函数的参数    ——或者放在赋值表达式的右边——此时不需要加括号（）**

```javascript
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

**yield表达式没有返回值，或者说返回值总是undefined**

走一段代码感受下：

```html
  <script>
    function* gene(){
      yield 'hello';
      yield 'world';
      // return 'returnValue'
    }
    //即该函数有三个状态：hello，world 和 return 语句（结束执行）,yield和return后面的值或作为value值
  console.log(gene)
  let gen = gene()
  console.log(gen)
  console.log(gen.next())  //{value:'hello',done:false}
  console.log(gen.next())  //{value:'world',done:fale}
  console.log(gen.next())  
    //return没有返回值的时候，{value:undefined,done:true}
    //return有返回值的时候， //{value:'returnVaule',done:true}
  console.log(gen.next())  //{value:undefined,done:true}
  </script>
```

当执行到return或者没有return语句，Generator函数执行完毕之后，以后每次执行next函数返回的结果都是和最后一次一样的；当return有返回值的时候，最后一次的value值就是返回的值。

当然了，Generator函数也可以不用yield指令，此时Generator函数就像一般的函数一样，不过，Generator函数+（）并不会之后，只能通过next方法执行。

```javascript
function foo(a,b){
  // yield 'c'  //报错 yield表达式只能在Generator函数中，否则会报错
  console.log(a,b)  //undefined undefined.  yield表达式返回的值是undefined所以传入foo函数的参数也是undefined
}
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
}
let d = demo()
console.log(d.next()) //{value:'a',false}
console.log(d.next()) //{value:'b',false}
//如果没有以下next函数，那么foo函数也不会执行；
console.log(d.next()) //{value:'undefined',false}   let input = yield 遇到yield表达式，没有返回值则返回undefined
console.log(d.next()) //{value:'undefined',true}
console.log(d.next()) //{value:'undefined',true}
```

**next函数的参数：next函数的参数将会作为上一个yield表达式整体的表达式的值，如果没有参数，那么yield表达式的值将是undefined ，yeild表达式后面的值可以理解为是一个异步容器内部的标记，代表执行到某一句停止执行，该表达式执行的时候，本身是没有返回值的，或者说返回值是undefined**

```javascript
function foo(a,b){
  // yield 'c'  //报错 yield表达式只能在Generator函数中，否则会报错
  console.log(a,b)  //2 3  
}
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
let d = demo()
console.log(d.next(1)) //{value:'a',false}  第一次执行next，给next函数传递参数没有实际作用
console.log(d.next(2)) //{value:'b',false}    2 将会作为 yield a 表达式的值传递给函数foo
console.log(d.next(3)) //{value:'undefined',false}   3 将会作为 yield b 表达式的值传递给函数foo
console.log(d.next(4)) //{value:'undefined',true} let input = yield 遇到yield表达式，没有返回值则返回undefined
console.log(d.next(5)) //{value:'undefined',true}
```

再看一个demo

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

Generator函数是一个异步操作的容器，但是仅仅是一容器而已，他的自动执行需要一种机制

```
（1）Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。(then方法执行next函数交回控制权)
（2）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
```

看下Generator函数如何实现异步编程——promise(yield表达式交出Generator函数的控制权，暂停其执行，然后去执行其他函数，next函数将控制权还给Generator函数，可以给next函数传递一个参数，代表上一个yield表达式暂停：异步操作的结果，返回给Generator函数)

```javascript
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);  	//	这个reslut变量接受next函数的参数作为变量值
  console.log(result.bio);
}
```

```javascript
var g = gen();
var result = g.next();//yield后面的表达式执行的结果会给到next函数执行的返回值{value,done}中的value

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data); //next的参数作为上一个yield表达式的返回值，给到result变量
});
```

Generator函数自动执行异步操作——自动执行器——回调函数

```javascript
var fs = require('fs');
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};
var gen = function* (){
  var f1 = yield readFile('fileA');  //yield表达式后面readFile每次执行返回的Promise对象将被赋值给vaule
  var f2 = yield readFile('fileB');
  // ...
  var fn = yield readFile('fileN');
};
//========手动执行
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
})
//=======自动执行
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);//基于thunk函数
    // result.value.then(next);//基于promise对象，promise对象resolve之后才会执行next,然后重新回到generator函数；
  }
  next();
}
run(gen);
	/**
	有了这个执行器，执行 Generator 函数方便多了。不管有多少个异步操作，直接传入 run 函数即可。当然，前提是每一个异步操作，都要是 Thunk 函数，也就是说，跟在 yield 命令后面的必须是 Thunk 函数。
	*/
```

根据以上总结

* `*` 生成generator函数，该函数内部通过yeild控制该函数内部的执行流程；
* 先执行generator函数，生成一个控制异步操作的容器g，然后执行next，就会执行generator函数中的代码，next函数的返回值就是yeild表达式的返回值给到value,done表示异步操作的容器是否遍历完毕；
* 执行的时候遇到yeild,则将函数的控制权交给yeild后面的表达式，并且停止执行generator函数体的代码
* 只有在此执行g容器的next函数，才可以在此回到generator的函数体去执行；

### 4.2 async函数

async函数其实就是Generator，只不过是Generator函数的语法糖，async函数包括了自动执行Generator函数的机制，而不需要我们在为其添加自动执行机制

async关键字声明的async函数执行后的返回值是一个Promise对象,async函数也有多种声明方式，[参考](http://es6.ruanyifeng.com/?search=yeild&x=0&y=0#docs/async)

`async`函数返回的 Promise 对象，必须等到内部所有`await`命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数

```javascript
var asyncFun = async function(){
}
console.log(asyncFun) //async函数
console.log(asyncFun()) //一个resolve的promise对象
```

* async关键字，其声明的函数表示函数内部有异步操作
  * return 关键字，用来返回async函数执行后，传递给生成的promise对象的then方法回调函数接受
    * async函数执行后生成的对象then方法中的参数来源可以理解为两个：
    * 一是async函数执行过程中await函数返回的promise对象抛出异常或者其状态变为reject;
    * 二是，遇到return语句，其后的值作为then函数的参数，return后面可以直接返回原始数据类型，也可以返回一个Promise对象，如果返回原始数据类型，那么then方法的参数就是这个原始数据，如果返回一个Promise对象，那么then方法的参数就是resolve的值。

```javascript
function timeout(ms) {
  return new Promise((resolve,reject) => {
    setTimeout(function(){reject('ddd')}, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms); //此时没有return语句，await语句后面的Promise变为reject之后，也会被catch函数捕获加上return，效果是一样的
  //return await timeout(ms)  这两行代码等价
  //
}

asyncPrint('hello world', 4000)
.then((ret)=>{console.log('resolve',ret)})
.catch((ret)=>{console.log('reject',ret)})
//reject ddd
```

```javascript
async function asyncPrint(value, ms) {
  var innerret = await timeout(ms); //此时没有return语句，await语句后面的Promise变为reject之后，也会被catch函数捕获加上return，效果是一样的
  //return await timeout(ms)  这两行代码等价
  //
  console.log('innerret',innerret)
}

asyncPrint('hello world', 1000)
.then((ret)=>{console.log('resolve',ret)})
.catch((ret)=>{console.log('reject',ret)})
//innerret ddd
//resolve undefined
```

```javascript

function foo(){
  console.log('foo函数执行')
}
async function asyncPrint(value, ms) {
  await foo();  //如果await后面是原始数据类型，那么会直接转化为resolve的Promise对象，但此时必须要有return 才能有返回值被then函数的回调函数调用
  console.log('回到async');
  return "resolveit"
}
asyncPrint('hello world', 4000)
  .then((ret) => { console.log('resolve', ret) })
  .catch((ret) => { console.log('reject', ret) })
//foo函数执行
//回到async
//resolve resolveit 
```

```javascript
async function asyncPrint(value, ms) {
  await 123 ;  //如果await后面是原始数据类型，那么会直接转化为resolve的Promise对象，但此时必须要有return 才能有返回值被then函数的回调函数调用
}
asyncPrint('hello world', 4000)
.then((ret)=>{console.log('resolve',ret)})
.catch((ret)=>{console.log('reject',ret)})
//resolve undefined   
```

```javascript
async function asyncPrint(value, ms) {
  return  await 123 ;
  //可以向Promise函数的链式调用理解，文末promise源码链接可以看下
  //then函数中return的promise对象resolve后的参数作为下一个then函数的回调函数的参数，道理有点类似
}
asyncPrint('hello world', 4000)
.then((ret)=>{console.log('resolve',ret)})
.catch((ret)=>{console.log('reject',ret)})
//resolve 123 
```

```javascript
async function asyncPrint(value, ms) {
  return  'hello world '
}
asyncPrint('hello world', 4000)
.then((ret)=>{console.log('resolve',ret)})
.catch((ret)=>{console.log('reject',ret)})
//resolve hello world 
```

* async声明的函数返回的Promise对象的状态的变化
  * 从上面的demo可以看出来，如果await返回的promise对象抛出异常或者变成reject状态，那么async函数生成的Promise对象也会直接变成reject状态，然后会执行后面的catch方法
  * 如果await命令返回的promise对象变成resolve状态，那么async函数会接着执行，直到执行完所有的代码，或者遇到了return语句，此时async函数生成的Promise对象会变成resolve对象，然后会执行后面的then方法。
* await命令，其实就是then方法的语法糖，当async函数执行的时候，如果遇到了await命令，那么将会执行其后面的函数
  * await命令后面可以跟原始数据类型（此时就和同步代码一样，async函数执行的时候，不会发生延迟等待的情况，会立刻转化为一个resolve的Promise对象,所以可以直接执行await后续的代码；（应该是类似于Promise.resolve() ;）
  * await命令后面正常情况下是一个Promise对象，
    * 如果await后面的Promise对象状态变为reject，那么会立刻中断async函数的执行，后面的代码不会执行
    * 如果await后面的Promise对象状态变为resolve，那么会接着执行后面的代码。
    * 执行async函数的时候，如果遇到了await命令，那么函数将会等待其后面的异步执行完毕，再去向下执行
    * await命令只能在async函数中，在其他函数中会报错


以上可以参考promise中then注册函数返回一个新的promise的解释；[《实例promise - resolve源码解析》](https://github.com/jimwmg/JiM-Blog/tree/master/JavaScript/ES6)

```html
<script>
    function timeout (){
    return new Promise((resolve,reject)=>{
        console.log('timeout')
    })
}
async function f(){
    //1 
    console.log('sss')
    //2 
    // return 'fff'
    //3 
    // await timeout()
    //4 
    timeout()
    //5 
    setTimeout(function(){
     console.log('异步操作')
   },1000)
}
console.log(f)
var ret = f();//返回一个resolve的promise对象
ret.then((data)=>{
    console.log('this is ',data)
})
console.log(ret)

</script>
```

async函数的返回值是一个promise对象，先给给对象命名为 prosmieASYNC; 该对象的状态可以理解为仅受以下因素影响

* 一：async函数内的await语句的返回值，如果该返回值不是一个promise对象，那么 prosmieASYNC，就会直接变成一个resolve的对象
* 二：如果async函数内的await语句的返回值是一个prosmie对象，那么prosmieASYNC的状态就会由await语句返回的promsie对象来决定
* 三：如果async函数内部有多个await语句，会顺序的往下执行
  * 如果某个await 返回的 promise一直pendding,那么程序就会停滞
  * 如果某个await 返回的promise reject 了,那么会直接将 prosmieASYNC 状态置为rejected,后续的语句都不会执行




参考

[javascript标准教程](http://javascript.ruanyifeng.com/advanced/promise.html)

[ES6Promise源码解析](https://jimwmg.github.io/2017/06/15/229ES6-Promise%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/)

[yield小坑](http://www.tangshuang.net/2862.html)

[promise源码](http://es6.ruanyifeng.com/?search=yeild&x=0&y=0#docs/async)