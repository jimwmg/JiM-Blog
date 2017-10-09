---
title: javascript中的类型比较中的隐式转化是如何进行的？  
date: 2016-04-11 12:36:00
categories: javascript
tags: javascript
comments :  
updated : 
layout : 
---

### javascript中的类型比较中的隐式转化是如何进行的？

我们知道，在进行<  >  ==  等比较运算的时候，总会遇到隐式转化，然后进行比较，有点混乱，这里简单总结下，方便参考:



在JavaScript中  **对象到字符串**   的转换经过如下步骤: 
1) 如果对象具有toString()方法,则调用这个方法。如果返回一个原始值,JavaScript将这个值转换字符串,并返回这个字符串的结果。 
2)如果对象没有toString()方法或者这个方法并不是返回一个原始值,那么JavaScript会调用valueOf()方法。如果存在这个方法,JavaScript调用它。如果返回值是原始值,将这个值转换为字符串,然后返回。 
3)如果无法从toString()和valueOf()获得一个原始值,此时就会抛出一个类型错误。



在   **对象到数字**   的转换过程中,JavaScript做了同样的事情,只是它首先尝试调用valueOf()方法。 
1)如果对象具有valueOf()方法,并返回一个原始值,则JavaScript将这个原始值转换为数字,并返回这个数字。 
2) 否则,对象尝试去调用toString()方法,返回一个原始值,则JavaScript返回这个值。 
3)如果无法从valueOf()和toString()获得一个原始值,此时就会抛出一个类型错误。

对象转换数字的细节解释了为什么空数组会被转换为数字0以及为什么具有单个元素的数组会被转换为一个数字。数组继承了默认的valueOf()方法，这个方法返回一个对象而不是一个原始值,因此数组到数组的转换调用toString()方法。空数组转换成空字符串,空字符串转换为数字0。含有一个元素的数组转换为字符串的结果和这个元素转换字符串的结果一样。如果数组只包含一个数字元素,这个数字转换为字符串,再转换为数字。



JavaScript中的”+”运算符可以进行数学加法和字符串连接操作。如果它的其中一个操作是对象,则JavaScript将使用特殊的方法将对象转换为原始值,而不是使用其它算术运算符的方法执行对象到数字的转换。”==”相等运算符与此类似。如果将对象和一个原始值比较,则转换将会遵照对象到原始值得转换方式进行。 
“+”和”==”应用的对象到原始值得转换包含日期对象的一种特殊情形。日期类是JavaScript语言核心中唯一的预先定义类型,它定义了有意义的向字符串和数字类型的转换。对于所有非日期的对象来说,对象到原始值的转换基本上是对象到数字的转换(首先调用valueOf),日期对象则使用对象到字符串的转换模。然而这里的转换(+ ==)和上文讲述的并不完全一致:通过valueOf和toString 返回的原始值将被直接使用,而不会被强制转换为数字或者字符串。 
和”==”一样,”<”运算符以及其它关系算术运算符也会做到对象到原始值得转换,但要除去日期对象的特殊情形:任何对象都会先尝试调用valueOf,然后调用toString。不管得到的原始值是否直接使用,它都不会进一步被转换为数字或字符串。 

|               |             |      |       |                       |
| ------------- | ----------- | ---- | ----- | --------------------- |
| 值             | 转换为字符串      | 数字   | 布尔值   | 对象                    |
| undefined     | “undefined” | NaN  | false | throws TypeError      |
| null          | “null”      | 0    | false | throws TypeError      |
| true          | “true”      | 1    | true  | new Boolean(true)     |
| false         | “false”     | 0    | false | new Boolean(false)    |
| “”            | “”          | 0    | false | new String(“”)        |
| “1.2”         | “1.2”       | 1.2  | true  | new String(“1.2”)     |
| “zero”        | “zero”      | NaN  | true  | new String(“zero”)    |
| 0             | “0”         | 0    | false | new Number(0)         |
| -0            | “0”         | -0   | false | new Number(-0)        |
| NaN           | “NaN”       |      | false | new Number(NaN)       |
| Infinity      | “Infinity”  |      | true  | new Number(Infinity)  |
| -Infinity     | “-Infinity” |      | true  | new Number(-Infinity) |
| 1(无穷大,非零)     | “1”         |      | true  | new Number(1)         |
| {}(任意对象)      | 对象本身        | 对象本身 | true  | new Object({})        |
| `[]`(数组)      | “”          | 0    | true  | new Array()           |
| `[0]`(数组)     | “0”         | 0    | true  | new Array()           |
| `[0,1,2]`(数组) | “0,1,2”     | NaN  | true  | new Array()           |
| function(){}  | 函数本身        | NaN  | true  |                       |