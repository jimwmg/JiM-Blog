---
title: ES6 Iterator 
date: 2017-06-08 12:36:00
categories: ES6 
tags : Iterator 
comments : true 
updated : 
layout : 
---

### 1 原生具备 interator接口的数据如下（这些原生对象自动都部署了`Symbol.iterator`属性，用于 for-of循环遍历)

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

### 2 for - of 循环提供了一个用于统一处理这种 具有 interator数据结构的一种方式

```javascript
var o = [2,3,6];
//var o = 'hello world';
//var 0 = new Set(['3','rr',4]);
// ...
for(let v of o) {
    console.log(v);
}
```

for - of 循环的 value 值 是具有 interator 接口的数据对象的 value 值；

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被`for...of`循环遍历。原因在于，这些数据结构原生部署了`Symbol.iterator`属性（详见下文），另外一些数据结构没有（比如对象）。凡是部署了`Symbol.iterator`属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

### 3 对象这种原生数据结构是没有部署 Symbol.iterator 接口的，导致对象是无法使用 for-of 这种遍历器的

**注意： 对于原生对象这种数据结构，**

* 类数组对象部署 遍历器接口是可以使用 for-of 遍历器的
* 不是类数组对象，即使部署了遍历器接口也是不能使用 for - of 循环的

```javascript
var o = {0:'jhon',1:12,length:2, [Symbol.iterator]: Array.prototype[Symbol.iterator]}
for(let v of o) {
    console.log(v);
}
// 可以
```

```javascript
var o = {1:'fff',name:'jhon',age:12,length:2, [Symbol.iterator]:Array.prototype[Symbol.iterator]}
for(let v of o) {
    console.log(v);
}
// 可以，只是不会遍历属性不是数字的，并且长度之外的
```

### 4 for-of 迭代可迭代的对象的时候，如果可迭代对象动态变化，for-of也会遍历到动态变化的值

```javascript
for(let v of numArr) {
    console.log(v);
    if(v === 2) {
        // numArr.push(9);
        // numArr.shift();
        numArr.splice(1,2);
    }
}
```

