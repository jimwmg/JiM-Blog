---
title: Object assign 
date: 2016-10-13 12:36:00
categories: javascript
tags : [object,assign]
comments : true 
updated : 
layout : 
---

1 先来看下字符串，数字和布尔类型转化为对象包装类

```javascript
console.log(Object('abc'));
console.log(typeof Object('abc'));
console.log(Object(1));
console.log(typeof  Object(1));
console.log(Object(true));
console.log(typeof Object(true));
```

2 Object.assign(target,source1,source2,······)；该方法会将source1,2对象的 **可枚举的**属性复制到target对象上，然后返回target对象

2.1  如果只传了一个参数，那么直接返回该参数，(如果传的是基本数据类型null和undefined会报错)，基本数据类型转化为包装对象，复杂数据类型直接返回

```javascript
Object.assign(undefined) // 报错
Object.assign(null) // 报错
typeof Object.assign(2) // "object"
var obj = {a: 1};
Object.assign(obj) === obj // true
```

2.2 如果传递了多个参数，那么进行赋值拷贝，注意assign方法执行的是**浅拷贝**，也就是说如果键值的值是复杂数据类型，那么复制的是地址,如果source有包装类型字符串可以进行赋值，null undefined 数字以及布尔类型会跳过

```javascript
var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2
```

2.3 如果对象target的属性和source的属性名有重复的，那么会进行合并覆盖

```javascript
var target = { a: { b: 'c', d: 'e' } }
var source = { a: { b: 'hello' } }
Object.assign(target, source)
// { a: { b: 'hello' } }
```

2.4 **原型上的属性**以及**不可枚举**的属性不会被复制

```javascript
var obj = Object.create({ foo: 1 }, { // foo is on obj's prototype chain.
  bar: {
    value: 2  // bar is a non-enumerable property.默认emunerable属性值是false
  },
  baz: {
    value: 3,
    enumerable: true  // baz is an own enumerable property.
  }
});

var copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```

3 assign经常的用法,以下代码都是有联系的

```javascript
let x = 'jhon';
let y = 'jim'
console.log(Object.assign({},{x,y}));//ES6对象的属性简写，如果x y未定义会报错
```

3.1 为对象添加属性

```javascript
 //第一用法添加对象的属性
    class test {
        constructor(){
            Object.assign(this,{x,y});//这里是对象的简写
        }
    }
```

3.2 为对象添加方法

```javascript
  //第二个用法，添加对象的方法
    Object.assign(test.prototype,{
        method1(){
            console.log("this is method one");
        },
        method2(){
            console.log("this is method two");
        }
    })

    var t = new test();
    console.log(t);
```

3.3 克隆对象

```javascript
  function clone(origin){
        return Object.assign({},origin);
    };
    //如果想要克隆原型上的属性
    function perfectClone(origin){
        let originPrototype = Object.getPrototypeOf(origin);
        return Object.assign(originPrototype,origin);
    }
    var c = clone(t);
    console.log(c);
    var pc = perfectClone(t);
    console.log(pc);
```

3.4 合并多个对象

```javascript
const merge = (target,source1,source2) => Object.assign(target,source1,source2);
var M = merge(t,c,pc);
console.log(M);
```

3.5 为属性指定默认值

```javascript
const DEFAULTS = {name:"Jhon",psw:"123456"};
let loginIn = (option) => {option = Object.assign({},DEFAULTS,option)};
```

