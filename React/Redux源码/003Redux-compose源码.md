---
title:  Redux compose源码
date: 2017-05-05 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

### 1 先贴上源码

```javascript
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
//   redux/compose.js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

经过bable编译器编译之后

```javascript
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  //compose期望得到的参数都是函数
  //现将传入compose的参数中的函数组成一个数组 funcs,然后对这个数组使用Array.prototype.reduce(cb,initV)方法，该方法接受的参数中的cb，接受四个参数；该函数的返回值将作为下一轮cb调用的第一个参数；

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    //注意这里，当第二次调用reduce的callback的时候，第一次调用callback的返回的函数
      /*a=function () {
      	return a(b.apply(undefined, arguments));
      	}
      	执行了；第二次调用的时候，a就是这个函数；
      */
    //为什么是apply而不是call,因为apply接受this指向和一个数组或者类数组作为参数，然后会将数组中的元素拆开传入b函数中；
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

```

**compose函数所接受的多个函数参数中，仅最后一个函数可以接受多个参数；其余函数都是接受上一个函数的返回值，也就是说其余函数只能接受一个参数；**

理解下arguments对象，MDN上解释，The `arguments` object is a local variable available within all (non-arrow) functions. You can refer to a function's arguments within the function by using the `arguments` object. This object contains an entry for each argument passed to the function, the first entry's index starting at 0. 

* arguments对象是每个函数中的局部变量，只能在对应的函数中单独访问；当调用一个函数的时候，arguments对象会在函数作用域中声明，其元素包含函数接受的所有参数；
* 传递给函数的所有参数都会成为arguments对象的成员，即使在函数定义的时候，形参少于实参
* arguments对象在箭头函数中是不存在的；
* 所以说上面的reduce函数中接受的arguments对象和compose函数接受的arguments对象是完全不相关的；

```javascript
let arrow = ()=>{
  console.log(arguments);//报错，未定义
}
arrow(3);
function f(a){
  console.log(a);
  console.log(arguments)；//包含1，2，3
}
f(1,2,3);
```

compose函数另外一种实现方式，对比着上面更好理解；

```javascript
//underscore.js
function compose (){
  console.log('compose',arguments)
  var args = arguments ; 
  var start = args.length -1 ;//从传入的参数中最后一个开始；
  return function(){ //retFunc(2,3),此时下面的arguments对象中就有2，3	这两个变量；
    console.log('return',arguments)
    var i = start ;
    //第一次调用，使用apply,因为最后一个函数参数可能有多个参数
    var result = args[start].apply(this,arguments);
    while(i--){//先运算，后做减法
      //以后每次调用都是用call,因为其他的函数只能接受一个参数；
      result = args[i].call(this,result);
    }
    return result ;
  }
};
function sum (x,y){
  return x+y;
}
function power(z){
  return z*z;
}
var retFunc = compose(power,sum);
//这里注意理解，compose(power,sum)执行返回一个函数，这里也就形成了闭包，compose的函数的整个作用域连会保存在内存中，即使compose函数执行完毕，该作用域开辟的内存也不会被GC机制回收；所以就可以访问args；
var retValue = retFun(2,3);//25
//这里retFunc执行，也就是compose返回的函数执行(闭包)；
```

对比上面两种实现方式,还是redux/compose.js中的实现更加严谨，即使compose函数不穿参数，也可以运行，但是underscore.js中必须传递参数

```javascript
var zero = compose();
console.log('zero', zero);
console.log(zero(3));//underscore.js会报错；redux/compose.js结果就是3；
```

### 2 简化应用过程 

```javascript
// 由于 reduce / reduceRight 仅仅是方向的不同，因此下面用 reduce 说明即可
var arr = [1, 2, 3, 4, 5]
//封装的compose函数用的是这种reduce函数,没有传入初始值
var re1 = arr.reduce(function(total, i) {
  return total + i
})
console.log(re1) // 15

var re2 = arr.reduce(function(total, i) {
  return total + i
}, 100) // <---------------传入一个初始值
console.log(re2) // 115
```

### 3 reduce函数

Array.prototype.reduce(callback ,[initialValue]) (reduceRight函数和reduce函数类似，只不是从数组的最后反向开始迭代);数组的reduce方法向callback函数传递四个参数，分别是

```javascript
Parameters

callback
Function to execute on each value in the array, taking four arguments:
1 accumulator
The accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied. (See below.)(如果initialValue提供了，那么第一次运行的时候，accumular值为initialValue，如果没有提供initialValue，那么accumular的值为数组中的第一个元素，currentValue为数组中的第二个元素，跳过第一个索引值)
2 currentValue
The current element being processed in the array.
3 currentIndex
The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
4 array
The array reduce was called upon.
5 initialValue
Optional. Value to use as the first argument to the first call of the callback.
Return value
The value that results from the reduction.
```

callback函数每次执行之后的结果作为第一个参数再次传递给callback函数；

If the array is empty and no `initialValue` is provided, [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) will be thrown. If the array has only one element (regardless of position) and no `initialValue` is provided, or if `initialValue` is provided but the array is empty, the solo value will be returned *without calling callback.*

### 4 compose函数执行之后返回值是什么 

```javascript
 return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
```

如上代码返回值是reduce函数执行后的结果

* 如果是一个简单的数组进行reduce函数的运算,那么结果就很简单

```javascript

var ret = [1,2,3].reduce(function(a,b){
  return a+b ;
});
// 假如一个函数没有返回值，那么ret的结果是undefined,因为最后一次执行的时候，传入该函数的参数是NAN和一个数字，函数执行完毕之后，默认返回值还是undefined;
console.log(ret);//6
```

* 如果是一个由函数组成的数组进行reduce函数的运算,那么返回的结果就是一个函数的链式调用

```html
<body>
  <script src='./redux.min.js'></script>
  <script>
    function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
let fn1 = function(ctx){
  ctx.name = "jhon";
  return ctx;
}
let fn2 = function(ctx){
  ctx.age = 15;
  return ctx;
}
let funcs = [fn1,fn2];
let conposedFn = compose(...funcs);
let result = conposedFn({})
console.log('resCompose',result);

//简单理解就是
let resReduce = funcs.reduce((res,func) => {
  return func(res);
},{});
console.log('resReduce',resReduce)
  </script>
```

