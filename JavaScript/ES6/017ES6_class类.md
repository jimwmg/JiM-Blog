---
title:ES6——class类
---

[ES6系列文章](https://github.com/jimwmg/JiM-Blog/tree/master/JavaScript/ES6)
**首先明确原型链查找属性，如果找不到会去该对象的`__proto__`属性上去查找**

### extends关键字的核心作用

```javascript
class Basic {
    static getBasicDefault(){
        console.log('staticBasic')
    }
    constructor(){
        this.basie = 'basic'
    }
    basic1(){
        console.log('basic1')
    }
}
//一个类的构造函数也是指向该类本身
console.log(Basic.getBasicDefault == Basic.prototype.constructor.getBasicDefault) //true
class Manager extends Basic {
    static getManageDefault(){
        console.log('staticManage');
    }
    manage1(){
        console.log('manage1')
    }
}
//extends关键字作用核心：1 实现原型的继承
console.log(Manager.prototype.__proto__== Basic.prototype) // true 
//extends关键字作用核心：2 实现静态方法继承
console.log(Manager.__proto__.getBasicDefault == Basic.getBasicDefault) //true

console.dir(Basic)
console.dir(Manager)

```
