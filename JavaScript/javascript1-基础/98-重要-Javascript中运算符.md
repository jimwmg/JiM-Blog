---
title: javascript中的运算符
date: 2016-04-11 12:36:00
categories: javascript
tags: 运算符
comments : true 
updated : 
layout : 
---

### Javascript中运算符   

### 1 一元运算符以及访问

| . [] ()                             | 字段访问、数组下标、函数调用以及表达式分组  |
| ----------------------------------- | ---------------------- |
| ++ — - + ~ ! delete new typeof void | 一元运算符、返回数据类型、对象创建、未定义值 |

delete可以删除对象的属性值以及方法，将其值为undefined，对于局部变量和方法，以及全局用var声明的变量,delete是没有用的；delete  obj.prop ;

对于一元运算符 `+ - ` ,如果操作数不是一个数值，那么可以对其进行转换，

一元 + 

```javascript
+null : 0
+[ ]  : 0
+{ }  : NaN
+undefined: NaN

```

对于一元 - ，就是将 一元 +的结果前面加一个 负号`-`

如果删除成功，delete x 返回true，否则返回false;

```javascript
 	a = 6 ;
    console.log(a);//6
    console.log(delete a );//true
    console.log(a);//报错
```

```javascript
	var a = 6 ;
    console.log(a);//6
    console.log(delete a );//fasle
    console.log(a);//6
```

```javascript
  (function(){
//        'use strict'    //如果在严格模式下会报错
        var obj = {};
        Object.defineProperty(obj,"name",{
            value:"Jhon",
            weitable:true,
            configable:false,//控制属性是否可以被删除
            enumerable:false
        })
        console.log(delete obj.name); //false
        console.log(obj.name);//Jhon
    })()
```

**一元加法(+)和一元减法(-),对于数字来说，就是简单的加减，对于字符串来说，会将字符串转化为数字，类似于parseInt；**

### 2 关系运算符  >  >=  <  <=  返回一个布尔类型的值

* 对于比较运算，先要明白隐式转换规则，数字 和 布尔类型 属于数字环境，会转化为数字(对于对象，数组，Date类型的对象，会调用 valueOf 或者 toString转化为基本数据类型的值)；

  **数组和对象调用 toString  ；Date类型对象调用 valueOf**

* 如果没有数字 或者布尔类型，有字符串，那么就是字符串环境，会先将另外一个运算数转化为字符串；

* 任何带有 NaN 比较运算返回值都是 false

总结来说：

* 数字环境大于字符串环境(字符串转化为数字的时候调用Number)
* 数组和对象转化为基本数据类型调用 toString. Date对象类型调用 valueOf;
* 对象之间的值比较的时候，比较的是二者的地址；
* 字符串之间的比较比较的是ASCII；

```javascript
Number('') = 0  Number(null) = 0  Number(undefined) = NaN  Number('1.a') = NaN  
Number(true) = 1 Number(false) = 0
Number([]) = 0  Number([1]) = 1 Number([1,2]) = NaN(还是先调用数组的 toString)
```

```javascript
null >= 0 : true // Number(null) = 0
0 > 'a' : false //字符串转化为数字为NaN，所以为false；
2 > '1' : true //字符串转化为 1 
2 > '1.a' : false  //Number('1.a') NaN 任何带有NaN的比较都是返回false;
0 == [] : true // [].toString() = ''  Number('') = 0
[] == false: true 布尔类型转化为数字是 0 这个就是数字环境，[].toString() 转化为 ''，数字环境下，''为0；
0 > {} : fasle : {}转化为数字为NaN 
0 < new Date() :  new Date() 结果会调用valueof转化为时间戳
'a' > [] ; true //[] 调用 toString() ==> ''
'a' > ['b'] // false ['b'].toString() = 'b'
'a' < ['b'] //true
```

**(带有NaN的比较运算，返回的结果都是false)**

2.1 基本数据类型的比较(比较的时候会将对象，数组等转化为原始值 toString) Date对象调用 valueOf

​    2.1.1 **Number类型比较**   直接比较值即可  ,就是常规的算术比较，不做深究，

**如果只有一个运算数是数字，那么会隐式的将另外一个运算数转化为数字，然后进行比较；字符串转化为数字，布尔类型转化为数字，对象转化为数字；**

```javascript
//如果有一个是数字类型的，会尽量将另外一个运算数也转化为数字类型
 	console.log(1 > []);//true   空数组转化为数字是0 ,先将空数组转化为空字符串，然后空字符串转化为 0 
    console.log(1 < []);//false
    console.log(1 < {});//false  对象转化为字符串[object object] 然后转为数字是 NaN 带有NaN的关系运算表达式，返回的结果是false
    console.log(1 < {});//false
    console.log(1 < new Date());//true
    console.log(1 > new Date());//false
```

​    2.1.2  **字符串类型比较**  对于字符串，第一个字符串中每个字符的代码都与会第二个字符串中对应位置的字符的代码进行数值比较。完成这种比较操作后，返回一个 Boolean 值。

*  **大写字母的代码都小于小写字母的代码** ，所以，如果比较的字符有大写和小写，那么需要将字母字符串进行大小写转化
*  如果两个运算数都是字符串，比较的是字符串中每一个字符的对应的字符代码

```javascript
 console.log("Ball"<"alpha");//true
 console.log("Ball".toLocaleLowerCase()<"alpha".toLocaleLowerCase());//true
 console.log('alpha' < "5");//false
 console.log('alpha' > "5");//true
 console.log("23" < "5");//true   对于字符串比较的是字符的编码
//"2" 的字符代码是 50,"3" 的字符代码是 51
    console.log("" > "a");//false   字符串的比较是字符的编码
    console.log("" < "a");//true
    console.log("a" < []);//true
    console.log("a" > []);//fasle
    console.log("a" > {});//true   空对象经过ToPrimitive运算出来的是 '[object Object]' 字符串值，以 'a'.charCodeAt(0) 计算出的值是字符编码是97数字，而 '['.charCodeAt(0) 则是91数字，所以 'a' > ({}) 会是得到true。
    console.log("a" < {});//fasle
	console.log([1,2,3] < [1,2,4]) ;//true 数组的比较按照字典顺序比较
//接下来引出 数字和字符串的比较
 console.log(23 < "5");//false
```

2.1.3 **字符串和数字类型比较** 会将字符串先转化成数字，将字符串转化成数字的时候，Number转化字符串为数字类型；

布尔类型值和数字类型值比较会将布尔类型转化为数字

2.1.4 复杂数据类型的比较

### parseInt()

parseInt() 方法首先查看位置 0 处的字符，判断它是否是个有效数字；如果不是，该方法将返回 NaN，不再继续执行其他操作。但如果该字符是有效数字，该方法将查看位置 1 处的字符，进行同样的测试。这一过程将持续到发现非有效数字的字符为止，此时 parseInt() 将把该字符之前的字符串转换成数字。

例如，如果要把字符串 "12345red" 转换成整数，那么 parseInt() 将返回 12345，因为当它检查到字符 r 时，就会停止检测过程。

字符串中包含的数字字面量会被正确转换为数字，比如 "0xA" 会被正确转换为数字 10。不过，字符串 "22.5" 将被转换成 22，因为对于整数来说，小数点是无效字符。

### parseFloat()

parseFloat() 方法与 parseInt() 方法的处理方式相似，从位置 0 开始查看每个字符，直到找到第一个非有效的字符为止，然后把该字符之前的字符串转换成整数。

不过，对于这个方法来说，第一个出现的小数点是有效字符。如果有两个小数点，第二个小数点将被看作无效的。parseFloat() 会把这个小数点之前的字符转换成数字。这意味着字符串 "11.22.33" 将被解析成 11.22。

```javascript
 //'alpha'转化成数字的时候，会直接返回NaN ，带有NaN的关系运算表达式，返回的结果是false
console.log('alpha' > 5);//false    
console.log('alpha' < 5);//false
console.log("22.5" > 22); //true
```

2.2  ==   ===  !=  !== 比较运算

全等比较 ===  不仅仅比较两个运算数的值，还比较两个运算数的数据类型，这个一般容易进行判断

对于 ==  比较运算，会对运算数进行隐式转化，转化为原始值进行比较

如果我们要判断两个运算数是否相等的话，最好使用全等，因为 ==  !=  会进行隐式类型转化；

```javascript
1、如果两个值类型相同，进行 === 比较。 

2、如果两个值类型不同，他们可能相等。根据下面规则进行类型转换再比较： 

   a、如果一个是null、一个是undefined，那么[相等]。 

   b、如果一个是字符串，一个是数值，把字符串转换成数值再进行比较。 

   c、如果任一值是 true，把它转换成 1 再比较；如果任一值是 false，把它转换成 0 再比较。 
	 console.log([] == true);//fasle
     console.log([] == false);//true
   d、如果一个是对象，另一个是数值就把对象转化为数字，另一个是字符串就把对象转化为字符串对象转换成基础类型，利用它的toString或者valueOf方法。js核心内置类，会尝试valueOf先于toString；例外的是Date，Date利用的是toString转换。非js核心的对象

   e、任何其他组合，都[不相等]。 
```

```javascript
console.log([] == ![]);//true  对于对象类型的比较，会发生隐式类型的转化，这里还要注意运算符的优先级 ！比== 的优先级要高，所以 ！[]为false,含有布尔类型的会转化为 false会转化为0 ，[]也会转化为0
console.log(![]);//false
```



### 3  + -  运算符

### 3.1  + 运算符   以下有两种情况(执行代码之前会将运算数转化为原始值)

**+ 性运算符是字符串环境，会将数字，布尔类型，undefined NaN null 转化为字符串进行拼接**

原始值: number  string boolean null  undefined 对象值[object,object]

3.1.1 : 如果**两个** 运算数都是数值类型，直接进行算术运算

3.1.2 :  如果有一个运算是不是数字，或者都不是数字，那么将会进行字符串拼接

* 如果运算数有一个是字符串，那么这个运算环境就是字符串环境，需要将另外一个运算数转化为字符串，然后进行字符串的连接
  * 另外一个是字符串，直接进行拼接
  * 另外一个运算数是  **数字** ， 将数字转化字符串，然后进行字符串拼接
  * 另外一个运算数是 复杂数据类型  **数组**  或者**对象**   javascript会调用这两者的toString()方法，将它们转化为字符串，然后进行拼接
* 如果两个运算数都是 **数组**  或者**对象**  ，那么在  +  性环境中，javascript会将两个运算数都转化成字符串，然后进行拼接；
* 如果一个运算数是数字，为另外一个运算是是布尔类型，会将布尔类型转化为0或者1 ，然后进行数字运算

```javascript
//以下是第二种情况下，转化为字符串	
var arr = [1,2,3]
var arr1 = [1,2,3,4]
var obj1 = {name:"Jhon"}
var obj2 = {name:"JiM"}
var num = 9;
var num1 = 6;
var str = "Jhon";

console.log(arr+num);//1,2,39
console.log(typeof (arr+num));//string
console.log(arr+str);//1,2,3Jhon
console.log(typeof (arr+str));//string
console.log(obj1+num);//[object Object]9
console.log(arr1+arr);//1,2,3,41,2,3
console.log(obj1+obj2);//[object Object][object Object]

console.log("3"+NaN);//3NaN
console.log('str'+undefined);//strundefined
console.log('str'+null);//strnull
//----------
console.log(undefined+NaN);//NaN
console.log(1+NaN);//NaN
console.log(null+NaN);//NaN
//-----如果有一个运算数是对象，那么javascript会调用toString转化为字符串，在和NaN记性字符串的拼接
console.log([]+NaN);    //NaN(这个是字符串NaN)
console.log({}+NaN);//[object Object]NaN
console.log(1 + [] + 1 );//11   string类型的
//-------------------
console.log(true + 1);//2
console.log(true + '3');//true3
```

### 3.2    -  运算符 两种情况  -性运算符的环境是数字环境，会将字符串，布尔类型等转化为数字进行运算

3.2.1 如果两个运算数都是数字，那么进行基本的算术运算；

3.2.2 如果有一个运算数是数字，另外一个运算数是字符串 ，那么会尝试将字符串转化为数字 ，如果转化失败，则返回NaN

3.2.3 如果一个运算数是布尔类型，一个运算数是数字，会将布尔类型转化为数字

```javascript
console.log(num - num1);//3
//只要有一个不是数字，运算结果就返回NaN
console.log(num - arr);//NaN
console.log(num - str);//NaN
console.log(arr1-arr);//NaN
console.log(obj1-obj2);//NaN
//---------------------------------------
console.log(true - 3);//-2
console.log(true - '3');//-2
console.log('2'-'1');//1
console.log('str'-'1');//NaN
```



### 4 逻辑运算符　　！　 &&　　｜｜   根本要明白布尔类型转化的规则，这个逻辑运算也就清楚了 　　

```javascript
//-------------------! 运算符  以下结果全部返回true
  	console.log(!undefined);
    console.log(!null);
    console.log(!NaN);
    console.log(!0);
    console.log(!"");
// ！ 运算返回的一定是布尔类型的
```

```javascript
//----------------|| 或运算符   返回布尔类型或者其他数据类型
console.log(''|| null);//null  空字符串 和null都是false 返回第二个运算数
console.log(2||1);//2    2转化为布尔类型是true，直接返回，不在及逆行第二个运算数的运算
console.log(2||null);//2  
//简单来说，或运算就是找true的运算，找到true则马上返回该运算数；
//1 对于运算数已经声明的情况
// 如果第一个运算数是true,那么就返回第一个运算数，不再进行第二个运算数的判断
// 如果第一个运算数是false,那么就直接返回第二个运算数，无论第二个运算数是true还是false;
//2 对于运算数没有声明的情况,如果第一个运算数没有声明，则直接报错，如果第二个运算数没有声明，在第一个运算数为true的情况下不会报错，如果第一个运算数为false,会报错
```

```javascript
//----------------&& 与运算符
console.log('' && null); //如果第一个运算数为false,则直接返回第一个运算数
console.log(2 && 1 ); //如果第一个运算数为true,则直接返回第二个运算数
console.log(2 && null );
//简单来说 ，与运算就是找false的运算，找到false则马上返回该运算数；
//1 对于已经声明的变量，
// 如果第一个运算数是false,则直接返回第一个运算数，不再进行第二个运算数的判断，
//如果第一个运算数是true,则直接返回第二个运算数，无论第二个运算数是true还是false;
//2 对于运算数没有声明的情况，如果第一个运算数没有声明，那么直接报错，如果第二个运算数没有声明，在第一个运算数为false的情况下不会报错，当第一个运算数为true的时候，会报错
```

```javascript
console.log(notDefined || true );//对于没有定义的直接报错是这样的情况，不再一一举证
console.log("cant be excuted");
```

### 5 类型转换

5.1 转化为布尔类型为 false 的值如下；这个是逻辑运算的核心支撑 

```javascript
// 0  null  undefined NaN "" (空字符串)  返回false	
	console.log(Boolean(null));
    console.log(Boolean(undefined));
    console.log(Boolean(0));
    console.log(Boolean(""));
    console.log(Boolean(NaN));
    console.log(Boolean(false));
//对于非空字符串 数字 数组 对象 返回true 
	console.log(Boolean("str"));
    console.log(Boolean(9));
    console.log(Boolean(new Object));
//if( ) 会进行隐式类型转化  if判断会对flag进行隐式类型转化，转化为布尔类型的值
document.getElementById(id)如果能够获取某个元素，那么返回该元素对象，如果获取不到，返回undefined
获取到的话，返回一个对象，对象的布尔类型值是 true
```
### 



### 7 条件运算符  variable = boolean expression ? true value : false value ;

在进行条件运算符运算的时候，会对boolean expression进行转化为布尔类型，需要熟悉了解布尔类型转化的规则；

8 赋值运算符，返回 = 右边的运算数，从右向左进行运算；

```javascript
    var x = 5 ;
    console.log(x = 7);//7
    var y = "str";
    console.log(x = y );//str
//"链式"赋值运算符----------------------------------
    var arr, num1,num2 ;
    arr = [num1,num2] = [1,2,3,4];
    console.log(arr);// [1,2,3,4]
    console.log(num1);//1
    console.log(num2);//2
```





