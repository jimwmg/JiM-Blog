---
title: prototype 浅析 
date: 2016-04-11 12:36:00
categories: javascript
tags: object
comments : true 
updated : 
layout : 
---

### js中 构造函数prototype属性   实例化对象_ _ proto_ _ 属性 以及原型链的总结

### 1 注意区分

* prototype是构造函数的属性，可以直接操作，所有的实例化对象可以共享由其创建的属性或者方法，也就数说，当函数被new调用的时候，实例化的对象上才有原型上的属性，但是不用new，而直接调用的时候，却没有；

* _ _ proto_ _ 是实例化对象的属性，该属性是JS对象上的隐藏属性，这个属性指向的是该对象 对应构造函数的prototype属性；该属性不可实际操作；

* 实例化的对象里面包括   **实例化的属性** +   ** _ _ proto _ _ 属性**  ，

  _ _ proto _ _ 属性里面又包含constructor 属性和 _ _ proto  _ _(原型链终点)

1.1   test.prototype.property = "value";  test.prototype.property =function(){ };直接向原型中添加属性，

```javascript
  function test(){
        this.age = 13 ;
    }
    var obj = new test;
    console.log(obj);
```

![图1](img/test1.jpg)

```javascript
	function test(){
         this.age = 13 ;
    }
    var obj1 = new test;

    obj1.name = "JiM";//点操作符，直接给当前实例化的对象添加属性或者方法,只能给obj1 添加
    test.prototype.name = "Jhon";//构造函数的prototype属性可以直接将属性和方法添加到__proto__:属性里面，所有的由该构造函数实例化的对象都会拥有由prototype声明的属性和方法，

    var obj2  = new test ;
//注意 prototype属于构造函数的属性，而不是实例化对象的属性
    console.log(obj1);
    console.log(obj2);
```


![图2](img/test2.jpg)

```javascript
console.log(obj1.name);//JiM
console.log(obj2.name);//Jhon
//原型链的对象会遵循就近原则进行取值
```

*构造函数首字母一般要大写，这里由于开始的疏忽，暂时用小写* 

1.2 test.prototype = new test2 ( ) ;改变实例对象的__proto__原型指向;

```javascript
	function test(){
        this.age = 13 ;
    }
    function test2(){
        this.email = "gmail";
    }
    //注意 prototype属于构造函数的属性，而不是实例化对象的属性	
    test.prototype = new test2();//
	var obj2  = new test ;
    console.log(obj2);
```

1.3 所有的函数的_ _ proto _ _  指向 构造函数  Function.prototype ;

​      所有实例对象的_ _ proto_ _ 指向 对应构造函数的 prototype属性: arr._ _ proto_ _ === Array.prototype 

​     所有构造函数的prototype属性中有一个constructor属性，指向其构造函数

​      在Javascript中每个函数都有一个prototype属性和_ _ proto _ _　属性，

* 其中所有**函数** 的_ _ proto _ _ 属性指向Function的 prototype属性，
* 所有**实例化对象** 的_ _ proto _ _ 属性指向其**对应** 的构造函数的 prototype 属性；

```html
<script>
    function MyFunc(){}
    console.dir(Function);
    console.dir(Object);
    console.dir(Array);
    console.dir(MyFunc); 
    console.dir(Function.__proto__ === Function.prototype);//true
    console.dir(MyFunc.__proto__ === Function.prototype);//true
    console.dir(Array.__proto__ === Function.prototype);//true
    //所有函数,包括(Object，Array，Date ，MyFunc 这些构造函数)，它们的__proto__属性指向Function构造函数的prototype属性，即 Function.prototype
    var myFunc = new MyFunc ;
    var arr = new Array();
    console.dir(myFunc);
    console.dir(arr);
 	console.log(myFunc.__proto__ === MyFunc.prototype);//true
    console.log(arr.__proto__ === Array.prototype);//true
  //所有实例化的对象，对象，对象的__proto__属性指向其对应的构造函数的prototype属性
</script>
```

1.4 注意区分函数也是对象，但是对象不一定是函数；Function是所有函数的构造函数，包括内置构造函数(内置对象，如果给Function的prototype添加了属性，那么所有通过构造函数new出来的对象都会在__ proto __属性中有该属性)

```html
<script>
    function fn(){	//声明一个函数 
        
    }
    fn.address = "China"; //如果将函数看成一个对象的话，点操作符可以给函数添加属性
    //当把函数当成构造函数使用的 时候，生成的实例化的对象里面的属性，只有通过构造函数原型添加的属性和方法，以及在构造函数内部声明的属性和方法
    fn.prototype.na = "Jhon";
    fn.prototype.age = 15 ;
    Function.prototype.foo = "bar";//通过函数的构造函数Function的prototype添加属性
    console.dir(fn);//查看fn的属性组成
//如果将fn看成对象的话，fn里面有如下属性 address prototype __proto__ 属性等
  	console.log(fn.foo);//bar
    console.log(Array.foo);//bar 
  
    console.log(fn.na);//undefined  //. 操作符只会顺着原型属性__proto__往上去找某个属性
    console.log(fn.__proto__.na);//undefined
    console.log(fn.prototype.na);//Jhon

    console.log(fn.age);//undefined
    console.log(fn.__proto__.age);//undefined
    console.log(fn.prototype.age);//15
 //要区分函数的prototype属性和__proto__属性  
  //函数的__proto__属性指向Function构造函数的prototype属性，即 Function.prototype 
    console.log(fn.address);//China
</script>
```

1.5 有点绕

*  所有的函数都有prototype属性，同时也都有__ proto __ 属性，该属性指向Function构造函数的prototype属性；Function的 proto 属性指向Object构造函数，函数也是对象；
*  所有的对象都有_ _ proto _ _ 属性，指向该对象的构造函数的prototype属性

### 2 原型继承，所谓的继承，其实就是一个构造函数原型指向另外一个构造函数的实例化对象 

2.1 原型继承的所有的属性由 **所有** 的实例化的对象共享，一个改变，其余的都会改变，这是原形继承的一个缺点；

2.2 原型的继承方式：借助构造函数继承、组合继承

2.3 原型继承要注意理解复杂类型传递的是数据在堆内存中的地址；

2.4.1 不使用prototype属性定义的对象方法，是静态方法，只能直接用类名进行调用！另外，此静态方法中无法使用this变量来调用对象其他的属性！　　

 2.4.2 使用prototype属性定义的对象方法，是非静态方法，只有在实例化后才能使用！其方法内部可以this来引用对象自身中的其他属性！