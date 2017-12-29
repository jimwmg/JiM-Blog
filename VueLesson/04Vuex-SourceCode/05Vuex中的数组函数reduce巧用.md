---
title: Vuex中数组函数reduce函数的巧用
date: 2017-12-27
categories: vue
---

### 1 MDN介绍

```javascript
arr.reduce(callback[, initialValue])
```

`reduce`为数组中的每一个元素依次执行`callback`函数，不包括数组中被删除或从未被赋值的元素，callback接受四个参数：

- `accumulator `
- `currentValue `
- `currentIndex `
- `array`

回调函数第一次执行时，`accumulator` 和`currentValue`的取值有两种情况：调用`reduce`时提供`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；没有提供 `initialValue`，`accumulator`取数组中的第一个值，`currentValue`取数组中的第二个值。

**注意：**如果没有提供`initialValue`，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供`initialValue`，从索引0开始。

如果数组为空且没有提供`initialValue`，会抛出[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 。如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

### 2 如果知道一个对象中的路径，那么可以根据路径去查找对应的属性

```javascript
var state = {
  a:{name:'Jhon'},
  b:{
    c:{age:12},
    d:{gender:'male'}
  },
  e:{
    f:{age:12},
    g:{
      gender:'male',
      h:{address:'china'}
    }
  }
} 
var mapPath = {
  root :[],
  a:['a'],
  bd:['b','d']
}   
var ret = mapPath.root.reduce(function(state,key){
  return state[key]
},state);
var retA = mapPath.a.reduce(function(state,key){
  return state[key]
},state)
console.log(mapPath.bd)
var retBD = mapPath.bd.reduce(function(state,key){
  return state[key]
},state)
console.log(ret,retA,retBD);
```

