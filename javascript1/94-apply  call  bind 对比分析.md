---
title: apply bind call
date: 2017-1-15 12:36:00
categories: javascript
tags : [call,apply,bind]
comments : true 
updated : 
layout : 
---

##apply  call  bind 对比分析

## 1 基本语法,第一个参数必须传入一个对象

```javascript
fun.bind(thisArg[, arg1[, arg2[, ...]]])
fun.call(thisArg[, arg1[, arg2[, ...]]])
fun.apply(thisArg[, argsArray])
//bind call  apply可以改变原来的 fn 函数以 thisarg为对象进行执行
//第一个参数是代表fun函数执行的this指向
```

## 2 三者之间的区别

2.1 bind只绑定方法执行的对象，并不执行方法，改变的是函数的this指向；根据bind的这个特性，经常会结合setTimeout执行

2.2 call apply绑定方法的执行对象的同时，也会直接执行方法；

2.2.1  fun.apply(thisArg[, argsArray])

thisArg
在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
argsArray
一个**数组**或者**类数组** 对象，其中的**数组元素将作为单独的参数传给 fun 函数**  。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性请参阅本文底部内容。

同时除了可以传入一个数组，也可以传入arguments,代表当前函数的参数的一个**类数组** 

如果 argsArray 不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。 
如果没有提供 argsArray 和 thisArg 任何一个参数，那么 Global 对象将被用作 thisArg， 并且无法被传递任何参数。

2.2.2 fun.call(thisArg[, arg1[, arg2[, ...]]])

如果thisArg指定为null`和`undefined`的`this值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的`this`会指向该原始值的自动包装对象。

2.3 主要改变函数体执行的时候，函数体内this的指向；

```html
<script>
    var name = "Jhon"
    function getName (){
        console.log(this.name)
    }
    var obj = {
        name:"JiM"
    }
    getName();//Jhon
    getName.apply(obj);//JiM
    getName.call(obj);//JiM
    getName.bind(obj);//不会执行getName函数
    getName.bind(obj)(); //JiM

</script>
```

2.3 call方法传入的参数是参数列表形式的，apply传入的参数**必须是数组** 形式的

*  apply参数数组化的应用场景：求数组最值

```javascript
	var arr= [1,2,3,4,5,777]
//  var max = Math.max.apply(null,arr);//777
    var max = Math.max.call(null,arr);//NaN
 // var max = Math.max(arr) ; //NaN
    console.log(max);
//  这是apply方法的特性，apply方法第二个参数为参数的数组，虽然我们传入的是数组参数apply会将一个数组转化为一个参数接一个参数的传递给方法。但是call并不会
```

*  如何将一个数组追加到另外一个数组呢？

```javascript
var arr1 = [1,2,3];
var arr2 = [4,5,6];
var arr3 = arr1.concat(arr2);
//是的，这种方法可以，但是问题是concat方法并不会改变原来的数组，而是会返回一个新的元素
```

或者你也会这么做

```javascript
var arr1 = [1,2,3];
var arr2 = [4,5,6];
//arr1.push(arr2)//这么做是不行的,push会将arr2整体添加到arr1中
for(var i = 0 ; i < arr2.length;i++){
  	arr1.push(arr2[i]);
}
//这么做也可以，通过循环，但是挺麻烦
```

看看apply参数数组化的优势 apply会将数组拆分，将每个元素传入调用的函数push

```javascript
 var arr1 = [1,2,3];
 var arr2 = [4,5,6];
 arr1.push.apply(arr1,arr2)	//apply起了决定性的作用，将传入的数组或者类数组中的参数一个个的分开
 //    arr1.push(arr2)  //这么做不行，直接将arr2整体添加给了arr1 
console.dir(arr1);
```

* 如何将一个 类数组对象 添加到另外一个  对象 呢？

```javascript
   var arrLike = {
        0:"name",
        1:"age",
        2:"address",
        length:3      
     //如果将类数组作为apply的参数传入(因为apply第二个参数必须是数组)，类数组必须有length属性,如果没有该属性，那么类数组中的值不会被push进去;
    }
    var obj = { };
    Array.prototype.push.apply(obj,arrLike);  //关键还是apply方法会将传入的类数组元素一个个传递给push，然后push方法就可以将所有的元素以单独的形式添加给obj
    console.dir(obj);
```

下面代码可以看下，看下apply的参数对于数组以及类数组的要求

```javascript
 var obj1 = {
        name:"Jhon",
        age:13,
        address:"American",
        1:"JiM",
        other:{
            gender:"man"
        },
//      length:4	
    }
    var obj2 = {};
    Array.prototype.push.apply(obj2,obj1)
    console.dir(obj2);
```

* apply操作DOM元素   NodeList类数组

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<div></div>
<div></div>
<div></div>
<script>
    var divs = document.querySelectorAll("div");
     console.dir(divs);//这是一个类数组
 	console.dir(divs[0]);
    var obj = {};
     Array.prototype.push.apply(obj,divs);//push+obj+apply可以将DOM NodeList转化为对象
     console.dir(obj);
     console.dir(obj[0]);
</script>
</body>
</html>
```

bind

```javascript
function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments);
    }
}
var obj = {
    a: 20,
    getA: function() {
        setTimeout(bind(function() {
            console.log(this.a)
        }, this), 1000)
    }
}
obj.getA();
//---------------------------------
var obj = {
    a: 20,
    getA: function() {
        setTimeout(function() {
            console.log(this.a)
        }.bind(this), 1000)
    }
}
```

## 3  this的指向

```javascript
//1 非严格模式下，this默认指向全局对象，call/apply显式指定this参数时也会强制转换参数为对象（如果不是对象）。其中，null/undefined被替换为全局对象，基础类型被转换为包装对象。
	function nsm() {console.log(this);}
    nsm(); // Window{top: xxxx}
    nsm.call(null/undefined); // Window{top: xxxx}
    nsm.call(1); // Number {[[PrimitiveValue]]: 1}
    nsm.call('str'); // String {0: "s", 1: "t", 2: "r", length: 3, [[PrimitiveValue]]: "str"}
    nsm.call(true); // Boolean {[[PrimitiveValue]]: true}

//----------------------------------------------------------------------------------------

//2 严格模式下，this默认为undefined，且call/apply显式指定this参数时也不会有强制转换
    function sm() {'use strict'; console.log(this);}
    sm(); // undefined
    sm.call(null); // null
    sm.call(undefined); // undefined
    sm.call(1); // 1
    sm.call('str'); // str
    sm.call(true); // true
```









