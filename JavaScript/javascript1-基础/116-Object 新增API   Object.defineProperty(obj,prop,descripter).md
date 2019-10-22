---
title: Object.defineProperty(obj,prop,descriptor)
date: 2016-08-09 22:00:00
categories: javascript object
comments : true 
tags : object
updated : 
layout : 
---

**Object 新增API   Object.defineProperty(obj,prop,descripter)**

### 1 Object.defineProperty(obj,prop,descriptor)  

 接受三个参数，第一是要设置属性的对象，第二个是要设置的属性名，第三个是要设置的属性的相关信息descriptor对象，该对象有如下属性：value writable configurable enumerable get 和set；返回值是传递给defineProperty的对象，也就是obj，作为返回值

### 2 对于descriptor有如下可配置的信息：

Both data and accessor descriptors are  **objects**. They share the following required keys:

- configurable

  `true` if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.**Defaults to false.**

- enumerable

  `true` if and only if this property shows up during enumeration of the properties on the corresponding object.**Defaults to false.**

**第一种方式**  : A data descriptor also has the following optional keys:

- value

  The value associated with the property. Can be any valid JavaScript value (number, object, function, etc).**Defaults to undefined.**

- writable

  `true` if and only if the value associated with the property may be changed with an [assignment operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators).**Defaults to false.**

  ```javascript
  var obj={};
      Object.defineProperty(obj,"name",{
          get:function(){
              return 10;
          }
      });
      obj.name=20;
      console.log(obj.name);//10  默认不可修改 writable false
  ```

  **第二种方式** An accessor descriptor also has the following optional keys:


- get

  A function which serves as a getter for the property, or [`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) if there is no getter. The function return will be used as the value of property.**Defaults to undefined.**

- set

  A function which serves as a setter for the property, or [`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) if there is no setter. The function will receive as only argument the new value being assigned to the property.**Defaults to undefined.**

### 3 先来看下默认值的影响

```javascript
var obj = {};
Object.defineProperty(obj,"name",{
 
});	
//等价于如下:
var obj = {};
Object.defineProperty(obj,"name",{
    value : undefined,
	writable : false ,
	configurable : false ,
	enumerable : false
});	
console.log(obj.name);//undefined
obj.name = "JiM";
console.log(obj.name);//undefined
```

### 4 descriptor对象分为data descriptor 和 accessor descriptor，两者只能存在一个，两者共存会报错；

```javascript
var obj= {};
    Object.defineProperty(obj,"name",{
      //------------------可在两者中存在
        configurable:true,
        enumerable : false,
  //----------------------------data descriptor  
        value:"Jhon",
        writable:true,
   //--------------------------accessor descriptor      
        get : function(){
           return "JiM";
        }
        set:function(){
            
        }
    //------data descriptor中的 value 或者 writable 任何一个不能和 accessor descriptor中的get set任何一个共同存在 descriptor对象中；
    });
```

### 5 descriptor对象的属性

5.1 value 属性:用来设置obj对象的属性值，writable属性用来控制obj对象的属性值是否可以修改

```javascript
	var obj= {};
    Object.defineProperty(obj,"name",{
        configurable:true,
        enumerable : false,

        value:"Jhon",
        writable:false,//当设置为true的时候，obj的name属性可以被修改为 JiM333 ;
    });
    obj.name = 'JiM333';
    console.log(obj.name);//Jhon
```

5.2 set 方法:用来设置属性的值obj.property = "value"的时候调用set方法，get方法用来获取属性的值 ，obj.property的时候调用get方法；

```javascript
var obj= {};
  Object.defineProperty(obj,"name",{
      configurable:true,
      enumerable : false,

      get : function(){
          return " I always return this string, whatever you have assigned";

      },
      set:function(){
          obj.newName = "JiM2";
      }
  });
  obj.name = 'JiM333'; // 这个表达式相当于调用了descriptor的set方法
  console.log(obj.name);//  I always return this string, whatever you have assigned
  console.log(obj.newName); //JiM2 
//obj.name 相当于调用descriptor的get方法
```

```javascript
//接下来看一个最大调用栈溢出的问题	
var obj= {};
    Object.defineProperty(obj,"name",{
        configurable:true,
        enumerable : false,
        get : function(){
           return " I always return this string, whatever you have assigned";
        },
        set:function(){
            obj.name = "JiM2";//一直在重复的调用set函数，注意这个还是在给name属性赋值，而上一个案例是给一个newName属性赋值;
        }
    });

    console.log(obj.name);

    obj.name = 'JiM333';//调用set函数；
```

5.3 configurable属性，用来设置descriptor对象的属性(value  writable get set enumerable )是否可以修改;如果设置了false，那么这些属性都不可以修改，即使设置的值和原来一样；如果设置了true,那么就可以重新更改；

The `configurable` attribute controls at the same time whether the property can be deleted from the object and whether its attributes (other than `writable`) can be changed.

```javascript
var o = {};
Object.defineProperty(o, 'a', {
  get: function() { return 1; },
  configurable: false
});

Object.defineProperty(o, 'a', {
  configurable: true
}); // throws a TypeError
Object.defineProperty(o, 'a', {
  enumerable: true
}); // throws a TypeError
Object.defineProperty(o, 'a', {
  set: function() {}
}); // throws a TypeError (set was undefined previously)
Object.defineProperty(o, 'a', {
  get: function() { return 1; }
}); // throws a TypeError
// (even though the new get does exactly the same thing)
Object.defineProperty(o, 'a', {
  value: 12
}); // throws a TypeError
Object.defineProperty(o, 'a', {
  writable:true
}); // throws a TypeError
console.log(o.a); // logs 1
delete o.a; // Nothing happens
console.log(o.a); // logs 1
```

5.4 enumerable 属性 

The `enumerable` property attribute defines whether the property shows up in a [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) loop and [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) or not.

```javascript
var o = {};
Object.defineProperty(o, 'a', {
  value: 1,
  enumerable: true
});
Object.defineProperty(o, 'b', {
 value: 2,
 enumerable: false
});
Object.defineProperty(o, 'c', {
  value: 3
}); // enumerable defaults to false (当通过属性描述的时候，默认为false，不可枚举)
o.d = 4; // enumerable defaults to true ;when creating a property by setting it

for (var i in o) {
  console.log(i);
}
// logs 'a' and 'd' (in undefined order)

Object.keys(o); // ['a', 'd']

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
```

### 6 Object.defineProperties(obj ,prop)  method defines new or modifies existing properties directly on an object, returning the object.

```javascript

var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  }
  // etc. etc.
});
//注意prop的格式 
{
  'property1' : {  }
  'property2' : {  }
  'property3' : {  }
  //etc	
}
```

### 7 Object.getOwnPropertyDescriptor(obj,'property') ; 获取obj对象的指定属性的descriptor,返回时描述该属性的详细信息的对象；

Object.getOwnPropertyDescriptors(obj);  获取obj对象的所有属性descriptor详细信息的对象，该对象包含了每个属性的descriptor对象；





