---
title: the difference between null and undefined 
date: 2016-11-29 12:36:00
categories: javascript
comments : true 
updated : 
layout : 
---

### 1 typeof的使用;这是一个运算符，不是方法

1.1检测数据类型，返回的结果是一个字符串类型。有六种可能：number boolean string  object function undefined

注意typeof(null) 返回的是 : object 

 typeof 运算符来判断一个值是否在某种类型的范围内。可以用这种运算符判断一个值是否表示一种原始类型：如果它是原始类型，还可以判断它表示哪种原始类型。ECMAScript 有 5 种原始类型（primitive type），即 Undefined、Null、Boolean、Number 和 String

1.1.1 在ES6 之前，typeof可以随心所欲的时候，基本上不会报错

```javascript
console.log(typeof a);//undefined   即使 a 在之前为进行任何的声明 
```

```javascript
console.log( a);//a is not defined  报错 
```

1.1.2 但是在ES6 之后引入了let和const之后 typeof 就需要掂量一下自己咯,let声明的变量，在所声明的作用域中，**必须在使用之前进行声明**  ，其实这是一个好的趋势，可以形成严谨良好的编程习惯；

```javascript
	console.log(typeof a);//Uncaught ReferenceError: a is not defined
    let a;				
```

```javascript
 	let a;				
    console.log(typeof a);//undefined
```

1.2  typeof 可以用于**被声明** 或者**未被声明** 的变量；但是**未被声明** 的变量不能用其他运算符运算，之外的其他运算符的话，会引起错误，因为其他运算符只能用于已声明的变量上。

```html
<script>
    var exp1 ;
    console.log(typeof exp1);//undefined
    console.log(typeof exp2);//undefined
    console.log(exp1 == undefined);//true   
    console.log(exp2 == undefined);//报错
    console.log(typeof exp1 == 'undefined');//true
    console.log(typeof exp2 == 'undefined');//true  typeof运算符可以用于未被声明的变量
</script>
```

1.3 对于基本数据类型(Number Boolean String null  undefined) 以及引用类型 object的typeof值 

1.3.1类 : Object Function Array String Boolean Number Date ；这些未初始化为实例的类的typeof类型为function

```javascript
    function test (){       }
    console.log(Object);//function Object() { [native code] }
    console.log(typeof Object);//function
    console.log(Array);//function Array() { [native code] }
    console.log(typeof Array);//function
    console.log(Function);//function Function() { [native code] }
    console.log(typeof Function);//function
    console.log(String);//function String() { [native code] }
    console.log(typeof String);//function
    console.log(test);//function test(){   }
    console.log(typeof test);//function
```

1.3.2 对象的创建方式是用关键字 new 后面跟上实例化的类的名字，当将一个函数通过new实例化之后，那么就创建了一个对象

```javascript
	function test (){       }  
	var obj = new test();
    console.log(obj.constructor);//function test(){}
    console.log(obj);//test｛｝
    console.log(typeof obj);//Object

    var obj1 = new Array();
    console.log(obj1.constructor);//function Array() { [native code] }
    console.log(obj1);//[]
    console.log(typeof obj1);//Object

    var obj2 = new Function();
    console.log(obj2.constructor);//function Function() { [native code] }
    console.log(obj2);//function anonymous() {}
    console.log(typeof obj2);//function

    var obj3 = new String();
    console.log(obj3.constructor);//function String() { [native code] }
    console.log(obj3);//String {length: 0, [[PrimitiveValue]]: ""}
    console.log(typeof obj3);//object

    var obj4 = new Object();
    console.log(obj4.constructor);//function Object() { [native code] }
    console.log(obj4);//Object {}
    console.log(typeof obj4);//object

	var obj5 = new Date();
    console.log(obj5.constructor);//function Date() { [native code] }
    console.log(obj5);//Tue Feb 28 2017 21:13:36 GMT+0800 (中国标准时间) //当前的时间 
    console.log(typeof obj5);//object
```

1.3.3 基本数据类型的typeof的值

```html
<script>
    var func = function(){
        console.log("你好");
    }
    var obj = {"name":"john"};  		
    console.log(typeof 5);			//number
    console.log(typeof 'name');		//string
    console.log(typeof false);		//boolean
    console.log(typeof null);		// object
    console.log(typeof undefined);	// undefined
    console.log(typeof func);		// object
    console.log(typeof obj);		// object
//所有的返回值的类型都会 字符串  类型，注意都是小写字母；但是有一点缺陷就是函数和对象以及DOM对象返回的值都是object,所以typeof用来监测数据类型的时候，如果监测基本数据类型还比较可靠，但是监测对象的时候却无太大作用。
</script>
```

1.3.5 通过上面分析我们发现typeof可以判断基本数据类型，但是对于复杂数据类型，返回都是object，那么如何检测object的"类"呢？也就是说，如何检测一个对象是由哪个构造函数创建的呢？

这个时候就要用到 instanceof 了；语法: obj instanceof Type ,会沿着对象的原型链一层层的找，如果找到由Type类型的构造函数,则返回true，否则返回false；

```javascript
	function test (){       }
    var obj = new test();
    console.log(obj.constructor);//function test(){}
    console.log(obj);//test｛｝
    console.log(typeof obj);//Object
    console.log(obj instanceof test);//true 
//表示obj对象是test这个构造函数产生的 obj.__proto__ = test.prototype ;
//obj的原型上__proto__ 指向test.prototype
	console.log(obj instanceof Object);//true 
```

1.3.6 或者可以直接调用Object.prototype.toString.call(obj) 来判断obj到底是哪个类型的内置对象

```javascript
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(1,2)); //[object Number]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call("str"));//[object String]

console.log(Object.prototype.toString.call([1,2,3]));//[object Array]
console.log(Object.prototype.toString.call({name:"Jhon"}));//[object Object]
console.log(Object.prototype.toString.call(new Date()));//[object Date]
```

### 2 null  undefined  这两个原始数据类型没有属性和方法

2.1 null是一个表示"无"的对象(null 则用于表示尚未存在的对象)，转化为数值的时候值为0；典型的用法是：

* 用来初始化一个变量，该变量将来可能会被赋值成一个对象
* 用来和一个已经初始化的对象进行比较，这个变量可以是一个对象，也可以不是一个对象
* 当函数的参数期望是对象时，被用作参数传入
* 当函数返回值期望是对象时，被当做返回值输出(比如调用API 获取页面元素)
* 调用API获取页面中的元素，获取不到的时候，返回undefined;
* 删除事件绑定,事件本身是一个 null ,是一个空的对象，可以添加
* 作为对象原型链的终点
* 正则exec()方法如果未找到匹配，则返回值为 null。
* 字符串 str.match(value) 方法匹配字符串，如果匹配不到，返回null

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<input type="button" value="按钮"/>
<script>
    console.log(document.querySelector("input").onclick);//null
    document.querySelector("input").onclick = function(){
        console.log("被定义");
    };
    console.log(document.querySelector("input").onclick);//function(){  console.log("被定义"); }
</script>
</body>
</html>
```

2.2 undefined 是一个表示"无"的原始值，转化为数值的时候值为0 ；为布尔类型的时候使false ; 典型用法是：

*  变量被声明了，但是没有赋值，那么该变量的值就是undefined
*  调用一个函数的时候，如果应该提供的参数没有提供，那么该参数默认是undefined
*  如果一个对象的属性没有赋值，那么该属性值为undefined
*  获取某个对象的属性，该对象本身就没有该属性，返回undefined(数组也是对象)
*  函数没有返回值的时候，默认返回undefined;
*  函数的实参少于形参个数，未被赋值的形参默认值为undefined
*  使用shift pop 删除数组中的第一个和最后一个元素的时候，如果数组为空，那么返回值是undefined

```javascript
 function foo(){
        this.age=10;
    }
    var p1=foo.call(null); //函数执行结果没有返回值，默认返回undefined,
    console.log(p1.age);//undefined没有属性和方法，所以会报错
```



2.3 乱入一个空字符串作为返回值以及NaN作为返回值的情况总结吧

*  str.chatAt(index)  如果index不再0和str.length那么返回一个空字符；
*  如果期望转化的结果为数字的时候，转化失败的时候，返回NaN

2.4如何区分二者？

*  ==  运算符只比较值，不进行类型的比较，比较之前会进行隐式转化，null==undefined  返回true.
*  === 区分两者，不仅仅比较内容，还比较数据类型  null===undefined  false

如何判断一个变量是null还是undefined?

* 如何确定一个变量是undefined;

```javascript
var exp = undefined ;//var exp ;如果不进行赋值的话，结果也是undefined
//这种方法是错误的，因为null==undefined 返回true;
if(exp == undefined){
  console.log("exp变量是undefined");
}
//这种方法才是正确的，注意undefined加"" ,因为typeof返回的值是一个字符串类型的
if(typeof(exp) == 'undefined'){
  console.log("exp变量是undefined");
}
```

以下附上   ==  运算符的W3C解释，方便读者回忆基础

```html
执行类型转化遵循的规则:
如果一个运算数是 Boolean 值，在检查相等性之前，把它转换成数字值。false 转换成 0，true 为 1。 
如果一个运算数是字符串，另一个是数字，在检查相等性之前，要尝试把字符串转换成数字。 
如果一个运算数是对象，另一个是字符串，在检查相等性之前，要尝试把对象转换成字符串。 
如果一个运算数是对象，另一个是数字，在检查相等性之前，要尝试把对象转换成数字。
还遵循以下转化规则:
值 null 和 undefined 相等。 
在检查相等性时，不能把 null 和 undefined 转换成其他值。 
如果某个运算数是 NaN，等号将返回 false，非等号将返回 true。 
如果两个运算数都是对象，那么比较的是它们的引用值。如果两个运算数指向同一对象，那么等号返回 true，否则两个运算数不等。
```

我觉得可以进行再简化，来进行解释这个比较过程:

```html
如果其中一个是布尔类型则先将布尔类型转化 为0 或者 1 ;
如果一个是对象，和字符串、 数字 或者 布尔类型 进行比较的时候则将对象转化为原始值，对象通过toString  valueOf 查看原始值，然后在与字符串 数字 布尔类型进行比较
```




*  如何确定一个变量是null

```javascript
var exp = null;
//以下两种是不正确的
if(!exp){   //0 或者undefined同样可以进入if语句
  console.log("该变量是null");
}
if(exp == null ){ //undefined == null 返回true 
  console.log("该变量是null")
}
//下面这种才是正确判断null 类型的
if(typeof(exp) == 'object' && exp == null){ //同时进行类型和内容的判断
  console.log("该变量是null");
}
```

