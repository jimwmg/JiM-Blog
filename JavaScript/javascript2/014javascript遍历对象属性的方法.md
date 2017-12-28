---
title: javascript遍历对象属性方法总结
date: 2017-08-17
categories: javascript
tags: 
---

### 1 平常项目中，可能需要遍历对象的所有属性，首先对对象的属性进行下分类

* 对象自身属性（不包括继承或者原型上的属性）
* 原型属性
* 可枚举属性
* 不可枚举属性

接下来我们创建一个有这四种属性的对象

### 2 创建一个满足条件的对象

```javascript
function Person(name,age){
  //定义自身属性
  this.name = name ;
  this.age = age;
}
//定义原型属性
Person.prototype.jump = function(){};
Person.prototype.yell = function(){};
var person = new Person("JiM",23);
//Object.defineProperty 直接给一个对象定义一个自身属性值
//给person对象定义一个可以枚举的属性gender
Object.defineProperty(person,'gender',{value:'male',enumerable:true});
//给person对象定义一个不可以枚举的属性weight 
Object.defineProperty(person,'weight',{value:'200kg',enumerable:false});
```

```javascript
Object.defineProperty(obj, prop, descriptor)
descriptor的默认值:{configurable:false,enumerable:false,value:undefined,writable:false,get:undefined,set:undefined}
```

### 3 遍历自身属性

* 自身属性--可枚举属性

```javascript
//Object.keys(o) 只能遍历   自身的   可枚举的属性
var keys = Object.keys(person);
console.log(keys)
```

* 自身属性--可枚举属性和不可枚举属性

```javascript
//Object.getOwnPropertyNames(o)  可以遍历 自身的 所有属性，包括可枚举以及不可枚举的属性
var getOwnProps = Object.getOwnPropertyNames(person);
console.log(getOwnProps);
```

### 4 遍历自身属性和原型属性

* 自身属性，原型属性 — 可枚举属性


```javascript
//for-in 可以遍历包括自身和原型链上的可枚举属性
function getForIn(obj){
  var props = [];
  for (prop in obj){
    props.push(prop);
  }
  return props;
}
var forIn = getForIn(person);
console.log(forIn);
//利用这个特性，如何判断一个对象是否为空对象==首先要判断传入的值是一个对象，然后要判断该对象为空{ };这里要用的一个for-in的特点事遍历空对象的时候不会进入语句执行
function isEmptyObj (value) {
    var flag = true;
  //首先保证传入的事对象
    if (Object.prototype.toString.call(value) != "[object Object]") {
        return false;
    }
  //如果是空对象，则不会执行for-in内部代码块
    for (var k in value) {
        flag = false;
    }
    return flag;
};
```

* 自身属性，原型属性 --包括可枚举属性和不可枚举属性

```javascript
function getAllPropertyNames(obj) {
  var props = [];
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));
  return props;
}
var allProps = getAllPropertyNames(person);
console.log(allProps)
```

### 5 小知识

赋值运算符返回的结果是赋值运算符右边的数据

```javascript
var o1 = {name:"JiM"};
var o2 = {name:"Jhon"}
console.log(o1=o2);
console.log(Boolean(o1=o2));//true
console.log(Boolean(o1=0));//false
```

以上，do-while循环中，在重新给obj赋值之后，判断其成立与否的条件就是Object.getPrototypeOf(obj) 是否到了原型链的终点null