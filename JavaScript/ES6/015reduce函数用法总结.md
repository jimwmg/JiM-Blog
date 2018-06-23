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
//[9,8,7,6,5,4,3,2,1]
function formatCash(str) {
  //不考虑入参的判断
  return String(str).split('').reverse().reduce((pre, next, index) => {
    return (index % 3) ? (next + "" + pre) : (next + ',' + pre);
  })
}

console.log(formatCash(str));
```

另外一种优化算法，因为字符串在 js 每次变化都会重新开辟内存，所有转化为数组会更加便捷；

```javascript
function f(str) {
    const ret = Array.from(str).reverse().reduce((result,next,i,arr) => {
        if((i+1)%3 === 0 && (i+1) !== arr.length) {
            result.push(next,',')
            return result;
        }
        result.push(next);
        return result;
        // return (index % 3) ? (next + "" + pre) : (next + ',' + pre);
    },[])
    return ret.reverse().join('');
}
```

网友评论的一些‘蒂花之秀’

[toLocalString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)

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

