---
title: Array API  ES6
date: 2016-10-02 12:36:00
categories: ES6
tegs : ES6
comments : true 
updated : 
layout : 
---
## ES5 数组新增API

1 数组的length属性,该属性是可读可写的

```javascript
var arr = ['Jhon',66,"JiM"]；
console.log(arr.length);//3  
arr.length = 4 ;
console.log(arr[4]);//undefined
```

2 Array.isArray(value) 该方法用来判断传递进来的参数是不是数组，如果是则返回true,否则返回false;

Array.from(arrayLike[, mapFn[, thisArg]]) 

### 参数

- arrayLike

  想要转换成真实数组的**类数组对象** (只要该对象有length属性即可)或可遍历对象

- mapFn

  可选参数，如果指定了该参数，则最后生成的数组会经过该函数的加工处理后再返回。

- thisArg

  可选参数，执行 mapFn 函数时 this 的值。

### 返回值

一个新的Array实例

```javascript
Array.from("foo");   //  // ["f", "o", "o"] 
// 使用 map 函数转换数组元素
Array.from([1, 2, 3], x => x + x);      // [2, 4, 6]
```

3 Array.prototype.map (callback,thisArg ) 数组的map方法将向callback函数中传递三个参数，依次是每个数组元素，当前数组元素的**索引**，当前数组，callback执行的**返回值** 会作为数组元素添加到一个**新的数组**中去；

```javascript
Array.prototype.map(callback,thisArg);//thisArg严格模式下指向undefined ，非严格模式指向window
```

```javascript
 	var numberArr = [36,25,9,16];
    var newNum = numberArr.map(Math.sqrt);
    console.log(newNum);//[6,5,3,4]  
    console.log(numberArr);// [36,25,9,16]
//map方法返回一个新的数组，不改变原数组
```

```javascript
//如何利用map方法获取每一个字符串的编码值
 var str = "Learn more for great life";
 var map = Array.prototype.map;
 var strArr = map.call(str,function(s){
   // 'use strict'
  	 console.log(this) ;//注意函数内部的this指向是window,'use strict'严格模式下是undefined;
     return s.charCodeAt(0);//注意必须有返回值，如果没有return ,默认返回undefined,生成的是一个undefined组成的数组
 });
 console.log(strArr);
```

```javascript
//如何利用map方法翻转一个字符串,现将字符串转化为数组，然后将数组翻转，在将数组转化为字符串
var str = "Learn more for great life";
var map = Array.prototype.map;
var strArr = map.call(str,function(s){
     return s;
});
var newStr = strArr.reverse().join("");
console.log(newStr);
```

在网上又看到了一个更好地办法

```javascript
var str = '1234567';
var revStr = str.split("").reverse().join('');
```



```javascript
//猜一猜这个返回的数组是什么？ 
 var arr = [1,2,3,4];
 var newArr = arr.map(parseInt);
 console.log(newArr);
//parseInt函数其实接受的是两个参数 parseInt(s,radix)一个是要转化的字符串，一个是转化的进制基数;
//map函数传递给callback的是三个参数，一个数组元素，一个数组元素的索引值，一个是数组本身;
//其实执行的是以下过程
//parseInt(1,0) parse(2,1) parseInt(3,2)  parseInt(4,3)  对于parseInt如果基数为0 ，按照十进制进行转化
//所以输出结果是 [1 ,NaN,NaN,NaN]
```

3.1 callback 函数只会在有值的索引上被调用；那些数组中**未初始化**的元素或者使用 delete删除的索引则不会被调用

```javascript
var arr1 = new Array(100);
console.log(arr1);
var arr = arr1.map(function(item,index){
  return index;   //未被初始化的数组元素并不会调用callback函数
})
console.log(arr);//空数组
```

4 Array.prototype.forEach( callback , thisArg  )  数组的forEach 方法向callback回调函数中传递3 个参数，依次是每个数组元素，当前数组元素的索引，当前数组,forEach API 不像map API ,forEach每次执行callback并没有接受返回值，也不会返回一个数组，而map会将callback的返回值(如果没有显式的返回，则默认undefined)，形成一个新的数组，然后返回这个新的数组；

```javascript
Array.prorotype.forEach(callback,thisArg) //thisArg严格模式下指向undefined ，非严格模式指向window
```

```javascript
//thisArg可以用来改变forEach的callback函数执行时候this指向  
function Counter(){
        this.sum = 0;
        this.count = 0 ;
    }

    Counter.prototype.add = function(array){
        array.forEach(function(item){
            
            this.sum += item ;
            ++this.count;

            console.log(this);//看下这个时候的this指向
        },this);
    }

    var arr = [9,6,2];
    var counter = new Counter();
    counter.add(arr);
    console.log(counter.sum);
    console.log(counter.count);
```

4.1 forEach 没有办法中止或者跳出 forEach 循环，除了抛出一个异常

```javascript
var arr = [1,2,3,4]
arr.forEach(function(item){
  console.log(item);//1,2,3,4
})
```

```javascript
var arr = [1,2,3,4]
arr.forEach(function(item){
  console.log(item);
  break;//抛出异常
})
```

4.2 如果在遍历的过程中，某个元素被删除了，那么会直接跳过该元素

```javascript
var arr = [0,1,2,3,4,5,6,7]
arr.forEach(function(item,index,arr){
  console.log("item"+item);
  console.log("index"+index);
  console.log(arr);
//index 会从索引0一直递增，如果期间删除了某一项，会使后面的元素所在索引位置发生变化
  if(item === 2){
    arr.shift();
    console.log(arr);
  }
})
```

4.3 forEach函数的返回值是undefined,所以它不能像map或者reduce函数那样，可以链式调用数组的方法，因为map函数会将callback每次的返回值存在一个数组中整体返回

```javascript
var str = "Learn more for great life";
var foreach = Array.prototype.forEach;
var res = foreach.call(str,function(s){
  return s;
});
console.log(res);//undefined
```

4.4 forEach 方法按升序为数组中含有效值的每一项执行一次callback 函数，那些已删除（使用delete方法等情况）或者**未初始化**的项将被跳过（但不包括那些值为 undefined 的项）

```javascript
var arr1 = new Array(100);//创建一个未被初始化的数组，数组的长度为100 
console.log(arr1);
arr1.forEach(function(item){
  console.log(item);//并不会输出任何值
})
```

5 Array.prototype.every( callback , thisArg  )  数组的every方法向callback回调函数中传递3 个参数，依次是每个数组元素，当前数组元素的索引，当前数组,返回值是布尔类型；当执行某个元素返回值是false的时候，终止every函数的执行，返回false;只有当每个元素执行结果为true，最终才能返回true;

而 Array.prototype.some(callback ,thisArg) 和every基本上一样，只要有一个数组元素执行callback结果是true，那么就返回true，停止当前循环，不再进行后面的循环遍历操作；

```javascript
Parameters

callback
Function to test for each element, taking three arguments:
currentValue (required)
The current element being processed in the array.
index (optional)
The index of the current element being processed in the array.
array (optional)
The array every was called upon.
thisArg
Optional. Value to use as this when executing callback.
Return value
true if the callback function returns a truthy value for every array element; otherwise, false.

Description
The every method executes the provided callback function once for each element present in the array until it finds one where callback returns a falsy value. If such an element is found, the every method immediately returns false. Otherwise, if callback returns a truthy value for all elements, every returns true. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.
```

```javascript
function isBigEnough(element, index, array) { 
  return element >= 10; 
} 

[12, 5, 8, 130, 44].every(isBigEnough);   // false 
[12, 54, 18, 130, 44].every(isBigEnough); // true
```

6 Array.prototype.reduce(callback ,[initialValue]) (reduceRight函数和reduce函数类似，只不是从数组的最后反向开始迭代);数组的reduce方法向callback函数传递四个参数，分别是

```javascript
Parameters

callback
Function to execute on each value in the array, taking four arguments:
1 accumulator
The accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied. (See below.)(如果initialValue提供了，那么第一次运行的时候，accumular值为initialValue，如果没有提供initialValue，那么accumular的值为数组中的第一个元素，currentValue为数组中的第二个元素，跳过第一个索引值)
2 currentValue
The current element being processed in the array.
3 currentIndex
The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
4 array
The array reduce was called upon.
5 initialValue
Optional. Value to use as the first argument to the first call of the callback.
Return value
The value that results from the reduction.
```

reduce如何工作？

```
[0, 1, 2, 3, 4].reduce(
  function (
    accumulator,
    currentValue,
    currentIndex,
    array
  ) {
    return accumulator + currentValue;
  }
);
```

| `callback`  | `accumulator` | `currentValue` | `currentIndex` | `array`           | return value |
| ----------- | ------------- | -------------- | -------------- | ----------------- | ------------ |
| first call  | `0`           | `1`            | `1`            | `[0, 1, 2, 3, 4]` | `1`          |
| second call | `1`           | `2`            | `2`            | `[0, 1, 2, 3, 4]` | `3`          |
| third call  | `3`           | `3`            | `3`            | `[0, 1, 2, 3, 4]` | `6`          |
| fourth call | `6`           | `4`            | `4`            | `[0, 1, 2, 3, 4]` | `10`         |

```
[0, 1, 2, 3, 4].reduce(
  (accumulator, currentValue, currentIndex, array) => {
    return accumulator + currentValue;
  },
  10
);
```

| `callback`  | `accumulator` | `currentValue` | `currentIndex` | `array`           | return value |
| ----------- | ------------- | -------------- | -------------- | ----------------- | ------------ |
| first call  | `10`          | `0`            | `0`            | `[0, 1, 2, 3, 4]` | `10`         |
| second call | `10`          | `1`            | `1`            | `[0, 1, 2, 3, 4]` | `11`         |
| third call  | `11`          | `2`            | `2`            | `[0, 1, 2, 3, 4]` | `13`         |
| fourth call | `13`          | `3`            | `3`            | `[0, 1, 2, 3, 4]` | `16`         |
| fifth call  | `16`          | `4`            | `4`            | `[0, 1, 2, 3, 4]` | `20`         |

reduce将callback函数的返回值作为accumulator传递给callback重复执行；

ruduce函数经常用来扁平化数组

```javascript
var Flatten = [[1,2],[4,6],[7,9]]
var newFaltten = Flatten.reduce(function(a,b){
  return a.concat(b);
},[])

console.log(Flatten);
console.log(newFaltten);
```

7 Array.prototype.filter( callback ,thisArg )  filter向callback传递参数  依次是每个数组元素，当前数组元素的索引，当前数组。该方法返回一个新的数组，不改变原数组; filter函数对每个数组元素进行判断，满足条件的会保存下来，返回到新的数组当中，不满足条件的话进行下一个数组元素的判断(其实本质是如果callback函数返回true,那么保留当前数组元素，如果callback函数返回false,不保留该数组元素，那么进行对下一个数组元素的判断)

```javascript
    var arr = [2,3,4,5,6,7,8];
    var newArr = arr.filter(function(item){
        return item >　4 ;
    });
    console.log(arr);	//[2,3,4,5,6,7,8];
    console.log(newArr);//[5,6,7,8]
//-----------------------------------------------
	var arr = [2,3,4,5,6,7,8];
    var newArr = arr.filter(function(item){
        return true ;
    });
    console.log(arr);		//[2,3,4,5,6,7,8]
    console.log(newArr);	//[2,3,4,5,6,7,8]
//如果是return false ;那么newArr = [] ;如果没有返回值，callback默认返回undefined,filter对undefined转化为false ,最后newArr还是空数组;
//如果return 数字 字符串 等等 返回结果都是原来的数组，因为filter会对callback函数的返回值进行转化为布尔类型的值进行判断，如果转化结果为true ,那么则保留当前数组元素，如果转化结果为false,则不保留当前数组元素
```

8 Array.prototype.keys( ) 返回的结果是一个Array迭代器

```javascript
var arr = ['ma','jje','fff']
let iterator = arr.keys()
console.log(iterator)
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
/**
          Array Iterator {}
          Object {value: 0, done: false}
          Object {value: 1, done: false}
          Object {value: 2, done: false}
          Object {value: undefined, done: true}

        */       
let Arr = ['a',,'c']
let sparseKeys = Object.keys(Arr)
let denseKeys = [...Arr.keys()] 
console.log(sparseKeys) //["0","2"]
console.log(denseKeys)  //[0,1,2]

//需要注意的一点就是Object.keys() 返回的是一个由字符串索引组成的数组
```

9 Array.prototype.indexOf()

`indexOf` 使用[strict equality](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Using_the_Equality_Operators) (无论是 ===, 还是 triple-equals操作符都基于同样的方法)进行判断 `searchElement与`数组中包含的元素之间的关系。

注意比较下面的情况,对于复杂数据类型,比较的是引用地址是否指向同一个地址,如果是则能找到,返回其对应的索引值,如果不是,则找不到,返回-1 

```javascript
var arr = [{text:"JHon"},{text:"Jim"}]
var ret = arr.indexOf({text:"JHon"})   
console.log(ret)  //-1
```

```javascript
var obj = {text:"JHon"}
var arr = [obj,{text:"Jim"}]
var ret = arr.indexOf(obj)   
console.log(ret)  //0
```

