---
title: Object  API submit
date: 2016-09-22 22:00:00
categories: javascript
comments : true 
updated : 
layout : 
---

## Object内置对象　API  

现明确一点，每一个实例对象的`__protp__`属性指向其构造函数的prototype属性；

1 Object.getPrototypeOf( obj )  ,返回obj对象的构造函数的prototype属性(也就是obj对象的__ proto __ 属性对象)，每个构造函数都有一个prototype属性

```javascript
    function Test (){};
    var test = new Test();
    console.log(Object.getPrototypeOf(test));
    console.log(Object.getPrototypeOf(test) === Test.prototype);//true
//-------------------------------------------------------------------------
	var obj = new Object ();
    console.log(Object.getPrototypeOf(obj));
    console.log(Object.getPrototypeOf(obj) == Object.prototype);//true
```

2 isPrototypeOf( )



3 设置对象的原型属性__ proto __ 

3.1 Object.create( proto , prop )  用来设置对象的__ proto __ 的属性的指向；返回一个创建的对象;prop和Object.defineProperties(obj ,prop) 里面的prop格式一致,如下栗子

```javascript
if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
    if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
      throw TypeError('Argument must be an object, or null');
    }
    var temp = new Object();
    temp.__proto__ = proto;
    if(typeof propertiesObject ==="object")
      Object.defineProperties(temp,propertiesObject);
    return temp;
    //由此可见返回值是一个在空对象上添加__proto__和propertiesObject这两个对象的新对象；
  };
}
```

```javascript
var obj = Object.create({ foo: 1 }, { // foo is on obj's prototype chain.
  bar: {
    value: 2  // bar is a non-enumerable property.默认为enumerable:false,即不可枚举；
  },
  baz: {
    value: 3,
    enumerable: true  // baz is an own enumerable property.
  }
});

var copy = Object.assign({}, obj);//Object.assign(target,source....)
//方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象
console.log(copy); // { baz: 3 }

console.log(obj);
```

obj结构如下

```
Object  baz: 3
	    bar: 2
        __proto__: Object
            foo: 1
            __proto__: Object
```

```javascript
  function Test(){
        this.age = 18;
    }
    var test = new Test();
//    console.dir(Test);
//    console.log(Test.prototype);
    var obj1 = Object.create(Test.prototype,{
        'name':{
            writable:true,
            value:'JiM'
        }
    });
    console.log(obj1);
    console.log(obj1.__proto__ === Test.prototype );

    var obj1 = Object.create(Object.prototype,{
        'name1':{
            writable:true,
            value:'JiM1'
        }
    });
    console.log(obj1);
    console.log(obj1.__proto__ === Object.prototype );

var obj1 = Object.create(Array.prototype,{
    'name2':{
        writable:true,
        value:'JiM2'
    }
});
console.log(obj1);
console.log(obj1.__proto__ === Array.prototype );

var obj1 = Object.create(null,{
    'name3':{
        writable:true,
        value:'JiM3'
    }
});
console.log(obj1);
console.log(obj1.__proto__ === null );//false
console.log(obj1.__proto__ == null );//true

 var o = {foo:"bar"}
    var obj1 = Object.create(o,{
        'name4':{
            writable:true,
            value:'JiM4'
        }
    });
    console.log(obj1);
    console.log(obj1.__proto__ === o );//true

var obj1 = Object.create(Test,{
        'name5':{
            writable:true,
            value:'JiM5'
        }
    });
    console.log(obj1);
    console.log(obj1.__proto__ === Test);

//proto 设置obj1的__proto__ 指向，必须是一个对象或者null否则会抛出异常; prop 设置 obj1 的属性值
```

3.2 Object.setPrototypeOf(obj,prototype)  prototype参数必须是一个对象或者null,否则会抛出异常，用来设置对象的__ proto __ 的属性的指向,返回obj对象

```javascript
var obj = {name:"JHOn"};
console.log(obj);

//    Object.setPrototypeOf(obj,null);
Object.setPrototypeOf(obj,Array.prototype);
```

4 Object.getOwnPropertyNames(obj )该函数可以将对象中**可枚举以及不可枚举**的key值都列举出来,返回一个key组成的数组

The object whose enumerable *and non-enumerable* own properties are to be returned.

An array of strings that correspond to the properties found directly upon the given object.

5 Object.keys(obj)  该方法返回obj对象的所有**可枚举**的属性的键值组成的**数组**，不可枚举的属性键不会返回

```javascript
 var obj = {name:"Jhon",age:12,gender:"man"};
    Object.defineProperty(obj,"email",{
        value:"Gemail",
        enumerable:false  //设置email为false不可枚举，便于检测
    })
    for(var key in obj ){   //遍历对象自身的和继承(__proto__上的属性)的可枚举的属性
        console.log(key); //name age email
    }
//以下两种方法只遍历对象的原生属性,不会遍历对象的原型__proto__上的属性
    var arr = Object.getOwnPropertyNames(obj);
    console.log(arr);  //["name", "age", "gender", "email"] 
	var arr1 = Object.keys(obj);
    console.log(arr1);//["name", "age", "gender"]

```

需要注意的一点,如果数组中有一项为undefined的话,我们需要理解Object.keys()底层的实现,其实是封装了for-in循环,以及判断是否有某个属性Object.prototype.hasOwnProperty() 方法.for-in循环用来获取对象或者数组的键名.

```javascript
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}
```

所以对于没有定义的某一项数组元素,Object.keys() 方法的输出如下,这点需要注意下

```javascript
let Arr = ['a',,'c']
let sparseKeys = Object.keys(Arr)
console.log(sparseKeys) //["0","2"]
```

