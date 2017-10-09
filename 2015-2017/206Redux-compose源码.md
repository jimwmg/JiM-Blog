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

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
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

callback函数每次执行之后的结果作为第一个参数再次传递给callback函数

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

console.log(ret);//6
```

* 如果是一个由函数组成的数组进行reduce函数的运算,那么返回的结果就是一个函数的链式调用

```html
<body>
  <script src='./redux.min.js'></script>
  <script>
    function func1(num){
      console.log('func1获取参数',num);
      return num + 1 ;
    }

    function func2(num){
      console.log('func2获取参数',num);
      return num + 1 ;
    }

    function func3(num){
      console.log('func1获取参数',num);
      return num + 3 ;
    }

    var ret = Redux.compose(func1,func2,func3);
    console.dir(ret);//可以看出结果是一个函数  function anonymous(t)
    
    

    var ret1 = Redux.compose(func1,func2,func3)(3) ;
    console.log(ret1);

    var ret2 = func1(func2(func3(3))); //这个就是compose函数最终返回的最简单的函数形态
    console.log(ret2)
  </script>
```

