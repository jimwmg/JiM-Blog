---
title: reduce函数的作用
date: 2018-01-23
categories: ES6
---

### 1 数组转化为枚举

```javascript
var arr = ['GROUP','USER','COMPONY'];
function enmu(arr){
  //不考虑入参的判断
  return arr.reduce((prev,next)=>{
    prev[next] = next;
    return prev;
  },{})
};
console.log(enmu(arr));
```

### 2 千分位分割符

```javascript
var str = '123456789';
function formatCash(str) {
  //不考虑入参的判断
  return String(str).split('').reverse().reduce((pre, next, index) => {
    return (index % 3) ? (next + "" + pre) : (next + ',' + pre);
  })
}

console.log(formatCash(str));
```

### 3 根据路径查询确定对象

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

