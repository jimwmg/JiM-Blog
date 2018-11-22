---
title: Arrayfrom API  ES6
date: 2016-10-13 12:36:00
categories: javascript  ES6
tegs : ES6
comments : true 
updated : 
layout : 
---

Array.from(arrayLike[, mapFn[, thisArg]])  该方法从一个类似数组或可迭代对象创建一个新的数组实例

* 第一个参数是一个类数组对象，
* 第二个参数作为map函数的callback执行，
* 第三个参数是执行mapFn时候的this指向
* 返回值是一个新的数组实例

关于类数组对象只要该对象中有length属性， 即可认为是类数组对象

1 将类数组转化为数组

先抛出一个问题，这个也是在网上看到的

**如何不使用loop循环，创建一个长度为100的数组，并且每个元素的值等于它的下标？**

以下测试均在chorm浏览器，火狐有的版本会直接初始化为undefined

```javascript
//很多人第一步如下
var arr = Array(100);//但是这个是稀疏数组
console.log(arr) ;//[]
```

如果使用Array.from就很简单了

```javascript
Array.from(arr);//这就成功创建了一个密集数组，所有的值都被初始化未undefined
Array.from({length:100});//这个和上面达成的效果是一致的
//[undefined,undefined,undefined···········]
```

然后通过Object.keys(obj) 该方法返回obj对象的所有可枚举的**属性的键值**组成的 **数组**；

```javascript
Object.keys(Array.from({length:100}))
//[1,2,3,4······100]
```

当然了上面这些是ES6的新特性，如何在ES5中达到类似的效果呢？方法其实也很多

方法1 : 

```javascript
var arrayLike = {length:100};
var arr1 = [];
arr1.push.apply(arr1,arrayLike );
console.log(arr1);////[undefined,undefined,undefined···········]
```

方法2 :

```javascript
var arrayLike = {length:100};
var arr2 = Array.apply(null,arrayLike ); //Array方法也是为了创建一个新的数组
//注意必须用apply，apply会将传入的数组或者类数组对象中的属性一一传入调用apply的函数中
console.log(arr2);////[undefined,undefined,undefined···········]
```

然后同样调用Object.keys(obj)方法即可；

2 将类数组转化的数组实例通过mapFn函数加工，返回一个加工后的数组

```javascript
var arrayLike = {0:11,1:12,2:13,length:3};
var newArr = Array.from(arrayLike,item => item*2);
console.log(newArr);//[22,24,26]
```

3 对于HTMLLIST这样的类数组，不能通过原型访问数组的一些API

```javascript
var divs = document.getElementsByTagName('div');
  Array.prototype.map.call(divs,function(div){
    console.log(div)
  })
```



