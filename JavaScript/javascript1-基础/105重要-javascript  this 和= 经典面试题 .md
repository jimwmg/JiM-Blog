---
title: javascript经典面试题理解this  
date: 2016-09-19 12:36:00
categories: javascript
tags: this
comments : true 
updated : 
layout : 
---

## javascript    this  经典面试题 

```javascript
	function Foo(){
        getName = function(){console.log("1");};//这个不属于Foo的属性
        return this ;
  //如果作为构造函数，那么返回的this就是实例化对象，
  //如果作为函数直接执行，那么返回的this就是全局的window对象
    }
    Foo.getName = function(){console.log("2"); };
    Foo.prototype.getName = function(){ console.log("3");};
    var getName =function(){console.log("4");};
    function getName(){console.log("5");};
```

预解析之后

```javascript
	var getName;//只提升变量声明
    function getName(){console.log("5");};//提升函数声明，覆盖变量var声明

    function Foo(){
        getName = function(){console.log("1");};//这个不属于Foo的属性
        return this ;//如果作为构造函数，那么返回的this就是实例化对象，如果作为函数直接执行，那么返回的this就是全局的window对象
    }
    Foo.getName = function(){console.log("2"); };
    Foo.prototype.getName = function(){ console.log("3");};
    getName =function(){console.log("4");};

```

可以在控制台输出看下数据结构

```javascript
 console.dir(Foo);
 var res = Foo.getName();//注意没有返回值，如果将Foo看成对象，
 console.log(res);
```

看下面的求值过程

```javascript
 	Foo.getName();//2
    getName();//4
    Foo().getName();//1
//1 先执行了Foo()  函数，Foo函数第一句，getName没有用var声明，改变了输出4的getName,变为输出1
//2 第二句 返回了this,代表当前指向环境的window;相当于执行了 window.getName();
    getName();//1   直接调用getName ,上面一行代码改变后的结果

//运算符的优先级  ()  > 成员访问 .  > new 操作符
    new Foo.getName();//2     new一个构造函数的时候，构造函数内部的代码会一行一行执行;
//   等价于 new (Foo.getName)();
    new Foo().getName();//3  Foo作为构造哦函数，没有给实例化的对象添加任何属性，只能去原型上找
//  等价于 (new Foo()).getName();
    new new Foo().getName();//3
//  等价于  new (new Foo().getName)();
```

```javascript
// var 和 function 声明提升，变量的提升，函数优先于变量;
var a 
function a() {

}
console.log(a) //f a(){ }
```

```javascript
// var 和 function 声明提升，变量的提升，函数高于变量
var a = 1;
function a() {

}
console.log(a) // 1
// 等价于
var a ;
function a() {
    
}
a = 1;
```

```javascript
var b = 1
function a () {
    b = 10
    function b() { // a 函数中的变量 b会提升到函数的顶部，然后会被 b = 10 重新赋值；
        console.log('dd')
    }
    console.log(b)
}
function c(){
    console.log(b)
}
a(); //10
c(); //1
```

```javascript
var tmp = new Date();
function f() {
    console.log(tmp);//undefined
    if (false) {  //由于是false不会进入，但是变量的声明还是会提升到函数体内，体内，体内的最上面(重三遍)，所以下面在执行的时候会输出 undefined,
        var tmp = "hello world";
        //函数体内的声明会提升到  函数作用域  的最上面
    }
    console.log(tmp);//undefined
}
f();
console.log(tmp);//Tue Feb 28 2017 21:24:05 GMT+0800 (中国标准时间)
console.log(typeof tmp);//object
```



------------------------------------- = 运算符面试题

```javascript
 /*
    面试题
    */
    // 基本类型和引用类型
    // 引用类型变量和对象属性（在内存实际上就是内存地址）
    var a = {n:1};
    var b = a;
    a.x = a = {n:2};//运算符的优先级 .的优先级最高  赋值操作是从右向左运算的
    console.log(a.x);//undefined
    console.log(b.x);//{n:2}
/*
我们可以先尝试交换下连等赋值顺序（a = a.x = {n: 2};），可以发现输出不变，即顺序不影响结果。

那么现在来解释对象连等赋值的问题：按照es5规范，题中连等赋值等价于
a.x = (a = {n: 2});，按优先获取左引用（lref），然后获取右引用（rref）的顺序，a.x和a中的a都指向了{n: 1}。至此，至关重要或者说最迷惑的一步明确。(a = {n: 2})执行完成后，变量a指向{n: 2}，并返回{n: 2};接着执行a.x = {n: 2}，这里的a就是b（指向{n: 1}），所以b.x就指向了{n: 2}。
*/
```



