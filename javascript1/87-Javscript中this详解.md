---
title: Javscript中this详解
date: 2016-11-04 21:08:00
categories: javascript
tags: this
comments : true 
updated : 
layout : 
---

## Javscript中this详解

### 一 宿主环境和javascript 引擎

*  宿主环境：一门语言在运行的时候需要一个环境，这个环境就是宿主环境，对于JavaScript来说宿主环境就是我们常说的浏览器，在这个浏览器里面提供了一些借口让javascript引擎可以和宿主环境对接；
*  jacascript引擎才是真正执行代码的地方，常见的javascript引擎包括V8，javascript core,javascript引擎主要做了以下几件事情:一套与宿主环境相互联系的规则，javascript引擎内核，规定了基本javascript语法逻辑和命令，一组内置对象和API
*  javascript不仅可以在浏览器里面运行，还可以在其他宿主环境，比如node.js

### 二 this详解

## 1 global this 

1.1在浏览器里面，全局范围内，this等价于window对象(其实window对象也是Window构造函数的实例)

```javascript
 console.log(this === window);//true  全等号还是返回true  
    this.name = "jhon";
    console.log(window.name);//jhon
    window.age = 13 ;
    console.log(this.age);//13
```

1.2 在浏览器中，在全局范围内，用var声明一个变量和给this  window 设置属性是等价的

```javascript
 var foo = "bar";
    console.log(this.foo);//bar
    console.log(window.foo);//bar
```

1.2.1 预解析对顶级对象window的属性的添加

```javascript
console.log(window.exp); //由于预解析  var exp ;会被提升到最上部，声明的对象未被定义的话，默认为undefined
if (exp in window){  //  返回true;
  //in  操作符，可以用来判断某个对象是否拥有某个属性，可以追溯对象所有的属性，包括原型上的;
        var exp = "example";//会进行预解析，声明exp属性给到window,解析到这一行代码的时候，会进行赋值
    //明确预解析:所谓预解析是浏览器的动作，它会在执行javascript代码之前，全局的检索javascript代码，将变量声明以及函数声明提升到函数的额最顶部，所以，变量声明提升的时候，相当于给window对象添加了一个属性
       console.log(window.exp);//example 
    }
```

1.2.2 用function声明函数和在全局用var 声明变量，或者函数体不用var声明变量，都是在给全局的window添加属性值

```html
<script>
    var amyName;			// window 对象会多一个amyName 属性
    a ;
    function anewBuilder(){  //window对象会多一个anerBuilder属性
        aaa = 1;  //函数执行后 ，window对象又会多一个aaa属性
    }
    anewBuilder()
    console.log(window);
</script>
```

1.2.3 如果没有用var 声明，那么则不会进行变量提升，即使该变量也是隐式全局变量

```javascript
 if (exp in window){	//报错，程序停止运行
       exp = "example";//隐式全局变量，不会进行预解析，声明exp属性给到window
       console.log(exp);
   }
```

1.3 在**函数体内** ，(即使是函数体内的函数嵌套函数),没有var或者let声明的变量或者函数，就是在给全局this  window添加属性；如果使用了var 或者 let声明变量，则不能被全局的this访问到；

```html
<script>
//    var str = "全局的this";
    //在函数体，声明变量的时候，如果没有用var
    var func = function(){
        var str ="这个不能被全局的this访问到";
        console.log(this.str);//undefined  this代表全局的window，在全局范围内，并没有str赋值
      // 如果不是被new调用函数，那么函数体的this都是指代全局范围的this,代表window对象；
        func3 = function(){
            innerV = "这是函数体内的变量";
        };
//      func3();
    }
    func();
    this.func3();//和在函数体内执行效果是一样的，func3也是全局this的属性(方法)
//这两个函数必须被执行，才能正确赋值,以下innerV 才能输出；
    console.log(this.innerV);//"这是函数体内的变量"
    console.log(this.str);//undefined
    //在函数体内，不使用var或者let声明变量，也是在给全局的this和window对象设置属性
</script>
```

## 2 function this  

### 2.0 对于一个函数，有三种角色，普通函数，直接调用执行；构造函数，通过new调用；函数作为对象； 

2.1  如果不是被new调用函数，

*  普通函数:直接执行函数体，那么函数体的this都是指代全局范围的this,代表window对象；

```html
<script>
    var foo = "bar";   //变量的声明，相当于给window添加了一个 foo 属性，属性值是一个基础数据类型值
    function test (){  //函数的声明，相当于给window添加了一个test属性，属性值是复杂数据类型值
        this.foo = "bar is changed";//当函数不是被new操作符调用的时候，this还是指向window对象
    }
    console.log(this.foo);//bar
    test();//直接执行函数，this代表全局的this
  //等价于window.test()
    console.log(this.foo);//bar is changed 
  //--------------------------------------------------------------------
  	var num = 300;
    function getNum(){
        var num = 200 ;
        function getInnerNum(){
           console.log(this);
           console.log(this.num);//300
           console.log(num);//200
        }
        return getInnerNum;
    }
    var res = getNum();
    res();
</script>
```

* 直接执行函数体的时候，如果使用了apply  call 则代表改变了函数运行时的this指向，原先this默认指向的是其执行的上下文环境；语法  fn.apply(  thisArg[, argsArray]  ) 、 fn.call( thisArg[, arg1[, arg2[, ...]]] ) 执行之后，this指向传入的第一个参数

```html
<script>
    var foo = "bar";
    var obj = {"foo":"objBar"}
    function test (){
        console.log(this.foo);
    }
    test();//bar 函数执行的时候this指向执行的上下文环境
  
    test.apply(obj);// objBar  将test函数执行的时候this的指向指向了obj
    test.call(obj);// objBar  将test函数执行的时候this的指向指向了obj
</script>
```

2.2 函数作为构造函数:如果被new操作符调用函数体,那么函数体的this就变成了一个新的值，和global的this没有任何关系

```html
<script>
    var foo = "bar";
    function test (){
        this.foo = "bar is changed";
    }
    console.log(this.foo);//bar
  //不使用new操作符调用
  //    test();
  //    console.log(this.foo);//bar is changed
  //使用new操作调用   
     new test();//通过new操作符之后，函数体里面的this不再指向全局window，而是指向其新创建的对象
     console.log(this.foo);//bar  
     console.log(new test().foo);//bar is changed
</script>
```

2.3 接下来解释下new 操作符的作用，看下面的代码

```html
<script>
    function test (){
         this.foo = "bar is changed";
  		 this.func = function(){
          	console.log("new的解析");
  		}
    }
    console.log(test);
	//function test(){
    //   this.foo = "bar is changed";
    //   this.func = function(){
    //    console.log("new的解析");
   //   }
   // }
    console.log(typeof test);
//function
    console.log(new test);
//test {foo: "bar is changed",func:()}
    console.log(typeof new test());
//object
</script>
```

2.3.1 解释new的作用，当以 new 操作符调用构造函数的时候，**函数内部** 发生以下变化：

*  函数内部会创建一个空的对象，将该对象的引用指向this；所以后期只能通过this给实例添加属性和方法；

*  属性和方法会被添加到this 引用的对象中；

*  新创建的对象的引用指向了this,最后返回this


2.3.2 new操作符的作用如下:

```javascript
  function test (){
        var obj = new Object();//实例化一个对象
        obj.foo = "bar";
        obj.func = function(){
            console.log("new的解析");
        }
        return obj;
    }
```

2.3.3 从原型的角度理解下 new操作符的作用

```javascript
   function test (){
         this.foo = "bar is changed";
  		this.func = function(){
          	console.log("new的解析");
  		}
    }
var 
//1 方法new的瞬间 得到一个空的对象
var obj = { } ;
obj.__proto__ = test.prototype;
//2 方法的this指向空对象obj
//3 执行构造方法
{ }.foo = "bar is changed";
{ }.func = function(){
  	console.log("new的解析");
}
// 返回该对象
test.call(obj)
```

2.3.4 如果使用构造函数显式的返回**基本数据类型**(number string boolean null undefined)不会影响输出结果 ，返回**引用类型** object 则不会再返回构造函数的实例对象的地址，而是返回该引用的地址；

```html
<script>
    function anotherTest(){
        console.log("this is another test");
    }
    function test (){
        this.foo = "bar";
        this.func = function(){
            console.log("new的解析");
        }
//        返回基本数据类型，不会影响最后的结果
//        return 123;
//        return "str";
//        return null;
//        如果返回的是引用类型，则会改变返回值
//        return {'name':'jhon','age':12};
//        return [1,2,3]
 //       return anotherTest ;
        //如果返回this，那么还是返回的实例化对象;new操作符默认返回实例化对象
        return this;
    }
    var obj = new test();
    console.log(obj);//基本数据类型，仍会返回构造函数的实例化对象，返回引用类型的话，就是返回了引用类型的地址，原来构造函数的实例化的对象指向该引用类型
</script>
```

2.3.5 new操作符每次调用的时候，在**堆**  (heap)内存中开辟一块内存空间，存储**实例化对象的信息**;如果有变量接受该对象的地址，那么 定义变量的时候会在**栈**(stack) 中开辟了一块空间存储**变量名和引用地址** ；**不同的变量**指向**不同的堆内存空间** 

```javascript
  function test (name){
        this.name = name;
    }
    var obj1 = new test('Jhon');
    var obj2 = new test("Jhon");
    console.log(obj1.name);//Jhon
    console.log(obj2.name);//Jhon

    obj1.name = "kobe";
    console.log(obj1.name);//kobe
    console.log(obj2.name);//Jhon
```

2.4 如果函数体是对象的方法，那么此时的函数体里面的this就是指向的**调用** 该函数的对象；注意区分下面这两种情况

```html
<script>
    var foo = "bar";
    console.log(this.foo);//bar
    var obj = {
        foo:"objBar",
        test:function (){	//函数作为对象的方法，被对象调用
            console.log(this.foo);//objBar   此时的this指向调用函数的对象
        }
    }
    obj.test();//对象的方法的执行的上下文是对象，所以this指向对象
</script>
```

```javascript
   var foo = "bar";
    console.log(this.foo);//bar
    var obj = {
        foo:"objBar",
        test:function (){
            return function(){
                console.log(this.foo);//bar   
            }
        }
    }
    obj.test()();//注意区分这两种情况:test()返回的是一个函数，函数直接在Window环境下执行，相当于被window调用
```

2.5 如果函数体是数组中的元素，那么函数作为数组的元素被调用的时候，指向数组,对于伪数组来书也是指向伪数组

```javascript
 function fn1 (){
        console.log("fn1");
        console.log(this);
    }
    function fn2 (){
        console.log("fn2");
        console.log(this[2]);
    }
    var arr = [fn1,fn2,'things'];
    arr[0]();//fn1 [function, function, "things"]
    arr[1]();//fn2 things
```

```javascript
  function fn (){
        console.log(this.length);
    }
    var obj = {
        length : 10 ,
        method : function(f){
            console.log(this.length);//10
            console.log(arguments);
            arguments[0]();//1   this.length代表传入参数的个数
            arguments[0].call(this);//10
        }
    }
    obj.method(fn);
```

this指向被调用的**直接对象** ，被谁调用指向谁

```html
<script>
    var foo = "winBar";
    var out = {
        foo:"outerBar",
        outFunc:function(){
          	console.log(this);//this 代表out对象
            console.log(this.foo);//执行后输出  outerBar
        },

        inner:{
            foo:"innerBar",
            innerFunc:function(){
                console.log(this);//this代表 inner对象
                console.log(this.foo);//执行后输出 innerBar
            }
        }
    }
    out.outFunc();//outFunc 函数被out这个对象调用，所以其内部的this指向out这个对象
    out.inner.innerFunc();//innerFunc函数被inner这个对象调用，所以其内部的this指向inner这个对象
//函数体被谁调用指向谁
</script>
```

### 总结:函数直接执行相当于被window调用，所以函数中的this指向window

2.5 javascript 中经常用的也就是事件的绑定，对应的事件处理函数中如果出现了this,那么这个this代表的所绑定的元素

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
    document.querySelector("input").onclick = function(){
        console.log(this.value);//按钮     这个this指向input标签
    }
</script>
</body>
</html>
```

2.6 setInterval(fn,time)   setTimeout(fn,time)  中的this指向window;为什么呢？大家还记得 setInterval   setTimeont都是window对象的属性吗？setInterval(fn,time)  等价于  window.setInterval(fn,time)其实是window调用了setInterval方法，所以其指向window ;

```html
<script>
    var foo = "bar";
    var setTime = setInterval(function(){
        var foo = "changedBar";
        console.log(this.foo);//bar
    },1000)
    console.log(setTime);//setInterval函数返回以个ID值，代表当前定时器，用于后期可以清除该计时器用
</script>
```

## 3 prototype this

原型里面的this指向，包括实例化的方法中的this指向:可以这么理解，它指向实例化的那个对象，但是,在找相应的属性的时候，它会顺着原型链一级级向上找，直到找到那个属性，如果没有找到，那么返回undefined;

**这个其实也是函数独立调用还是被对象调用的情况**

```html
<script>
    function Test(){
        this.foo= "bar";
        this.logFoo = function(){
            console.log(this.foo);//this代表实例化之后的对象
        };
    }
    var test1 = new Test();
    console.log(test1);
  //Test{foo: "bar" ,logFoo: (),__proto__: Objectconstructor: Test(),__proto__: Object}
//关于new出来的对象可以暂时这么理解，然后该对象的地址赋值给test1;
    console.log(test1.foo);//bar
    test1.logFoo();//bar
</script>
```

通过原型添加属性和方法：this会顺着对象的原型链一直往下找，直到找到该属性为止，如果找不到的话，那么返回undefined;原型里的this也是指向实例化的对象，this.foo就是顺着原型链一直找；

```html
<script>
    function Test(){

    }
    Test.prototype.foo = "changedBar";
    Test.prototype.logFoo = function(){
        console.log(this.foo);
    };
    var test1 = new Test();
    console.log(test1);
 // Test{__proto__: Object,constructor: Test(),foo: "changedBar",logFoo: (),__proto__: Object
    console.log(test1.foo);//changedBar
    test1.logFoo();//changedBar
</script>
```

4 



## 三 this总结 

1 this永远指向函数运行的时候所在的对象，而不是被创建的时候所在的对象；

2 匿名函数或不处于任何对象中的函数指向window

3 如果是call apply with   指定的this是谁，就是谁，如果是普通的函数调用，函数被谁调用，this就指向谁

4 如果不是被new调用函数，那么函数体的this都是指代全局范围的this,代表window对象；

5 函数独立运行的时候，那么this指向其所在运行的环境；函数作为对象的方法被调用的时候，this指向调用该函数的对象

6 **如果调用者函数，被某一个对象所拥有，那么该函数在调用时，内部的this指向该对象。**

**如果函数独立调用，那么该函数内部的this，则指向undefined**;但是在非严格模式中，当this指向undefined时，它会被自动指向全局对象。

严格模式下this指向

```javascript
 function fn() {
        'use strict';
        console.log(this);
    }

    fn(); //undefined //        fn是调用者，独立调用 
    window.fn();  //window  //  fn是调用者，被window所拥有
```

```javascript
	'use strict';
    var a = 20 ;
    function fn(){
        console.log(this.a);
    }
    fn();//报错
```





[友情链接](https://github.com/hangyangws/article/blob/master/javascript.md)