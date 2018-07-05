---
title: toString()和valueof()的区别  
date: 2015-10-28 12:36:00
categories: javascript
tags: javascript
comments : true 
updated : 
layout : 
---

## toString()和valueof()的区别

## 1.存在环境

```
所有的对象都继承了这两个方法，甚至于包装对象Number、String和Boolean。
```


## 2.具体细节

```
对于不同类型的对象，js定义了多个版本的 toString 和 valueOf 方法
toString:
（1）普通对象，返回 "[object Object]";
（2）数组，返回数组元素之间添加逗号合并成的字符串;
（3）函数，返回函数的定义式的字符串;
（4）日期对象，返回一个可读的日期和时间字符串;
（5）正则，返回其字面量表达式构成的字符串;
valueOf:
（1）日期对象，返回自1970年1月1日到现在的毫秒数;
（2）其它均返回对象本身;比如数组，函数，对象等以及number 布尔类型 字符串的valueof()都将返回本身
```

```javascript
Object.prototype.valueOf()
用 MDN 的话来说，valueOf() 方法返回指定对象的原始值。
JavaScript 调用 valueOf() 方法用来把对象转换成原始类型的值（数值、字符串和布尔值）。但是我们很少需要自己调用此函数，valueOf 方法一般都会被 JavaScript 自动调用。
```

```javascript
toString() 方法返回一个表示该对象的字符串。
每个对象都有一个 toString() 方法，当对象被表示为文本值时或者当以期望字符串的方式引用对象时，该方法被自动调用。
```

原始类型

```javascript
Number String Boolean Undefined  Null
在 JavaScript 进行对比或者各种运算的时候会把对象转换成这些类型，从而进行后续的操作
```



## 3.应用场景——类型转换

```
String类型转化    对象到字符串  
（1）执行toString，如果返回了一个原始值，则将其转化为字符串
（2）否则执行valueOf方法，如果返回了一个原始值，则将其转化为字符串
（3）否则抛出类型错误
    如果 toString 方法存在并且返回原始类型，返回 toString 的结果。
    如果 toString 方法不存在或者返回的不是原始类型，调用 valueOf 方法，如果 valueOf 方法存在，并且返回原	始类型数据，返回 valueOf 的结果。
    其他情况，抛出错误。
Number类型转化  对象到数字
（1）执行valueOf，如果返回了一个原始值，如果需要，则将其转化为数字
（2）否则执行toString，如果返回了一个原始值，则将其转化为数字并返回
（3）否则抛出类型错误

	如果 valueOf 存在，且返回原始类型数据，返回 valueOf 的结果。
	如果 toString 存在，且返回原始类型数据，返回 toString 的结果。
	其他情况，抛出错误。
	
以上两种方式转换的情况，我们可以通过重写对象的valueOf()方法和toString()方法来看下javascript是如何选择执行的以及执行的顺序
```

## 4.类型转换与关系操作符(>、<等，不包括===和!==)

```
- 两个都是数值，则比较数值
- 两个都是字符串，则比较字符编码值
- 其中一个是数值，则要把另个转化成数值进行比较
- 如果其中一个是对象，则调用valueOf，若没有返回原始值则调用toString，再进行前面的比较
- 如果有一个是布尔值，则将其转化成数值
```

注：日期对象只调用 valueOf ，不会调用 toString 方法

