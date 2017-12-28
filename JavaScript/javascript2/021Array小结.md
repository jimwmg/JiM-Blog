---
title:Array小结
date: 2017-08-28
categories: array
tags: 
---

### 1 数组的length属性，可读同时可写

同时，length属性仅仅记录数组中元素下标是数字的;数组的`length`属性返回值为Number类型，返回一个比该数组最大下标大1的整数，即数组的最大下标 + 1。

JS中数组的 `length` 属性不是只读的，这意味着我们可以设置length属性的值。如果 length 属性被赋了一个比原先值小的数值，则该数组将被截断，所有数组下标等于或者大于新 length 属性值的元素都将丢失。如果为 length 属性赋一个比先前值大的值，则该数组在形式上被扩展，但不创建新元素。此外 length 的赋值必须是一个非负数，否则会引发范围错误`RangeError`

```javascript
function extend(e,c){
  for(var g in c){
    if(!e[g]){
      e[g] = c[g];
    }
  }
  return e 
}
var obj = {name:'Jhon',age:13};
var arr = []
var ret = extend(arr,obj);
console.log(ret);
arr['a'] = 'hello';
//以上操作，数组的length属性为0，此时是将数组作为对象
console.log(arr);

//arr[0] = 'he';
//此时arr的length属性值为1 ；
//arr[1] = 'he';
//此时arr的length属性值为2 ；
console.log(arr);
```

如何判断一个对象确实的obj对象，而不是数组

```javascript
function _isObj = function (a) {
  return (a != null && typeof(a) == "object" && typeof(a.length) == "undefined")
};
```

### 2 常用API 

Array.prototype.some(cb) :对数组中的每个元素应用cb函数，如果某一个元素返回一个真值,那么不再执行后续的数组元素；如果所有的元素执行完毕仍得不到真值，那么返回false;

