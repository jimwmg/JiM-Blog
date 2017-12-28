---
title: 从chorm开发者工具看return 以及闭包的执行 
date: 2016-06-13 12:36:00
categories: javascript
tags: closure
comments : true 
updated : 
layout : 
---

### 从chorm开发者工具看return 以及闭包的执行

1 函数在执行过程中，如果遇到return，则直接结束当前函数{  } 代码块的执行;

2 闭包的形成，

*  一个函数(假如是out)内部有一函数(inner)
*  inner函数访问out函数作用域的变量
*  inner函数赋值给out函数作用域外的变量；

3 开发者工具 --->source---> scope local 等可以查看到程序执行的顺序以及闭包的形成;

4 通过开发者工具，我们可以清晰的看到代码执行的过程，然后需要思考这个过程发生了什么:

*  在函数的执行上下文创建阶段:变量对象被创建
*  在函数的执行上下文执行阶段:变量对象变为活动对象的过程
*  函数的this指向是在函数执行的过程中才被确定，并不是其生声明的时候被确认
*  执行上下文的入栈和出栈
*  函数执行的返回值
*  return会终止当前函数代码块的执行，直接跳出当前执行函数体
*  ​函数的实参传递，是给当前作用域增加了变量

```javascript
//这个闭包只有foo
function foo() {
    var a = 2;

    return function bar() {
        var b = 9;

        return function fn() {
            console.log(a);
        }
    }
}

var bar = foo();
var fn = bar();
fn();
//    ---------------------------------------------------
//这个闭包有bar和foo
function foo() {
    var a = 2;

    return function bar() { //return之后下面的代码不再执行，当前函数执行完毕，当前上下文出栈
        var b = 9;

        return function fn() {
            console.log(a, b);
        }
    }
}

var bar = foo();
var fn = bar();
fn();
```

```javascript
//函数立即执行的形式的闭包
(function() {

    var a = 10;
    var b = 20;

    var test = {
        m: 20,
        add: function(x) {
            return a + x;
        },
        sum: function() {
            return a + b + this.m;
        },
        mark: function(k, j) {
            return k + j;
        }
    }

    window.winTest = test;//将函数的内部变量test赋值给window中的属性

})();

winTest.add(100);
winTest.sum();
winTest.mark();

var _mark = test.mark();
console.log(_mark);

//上面的所有调用，最少都访问了自执行函数中的test变量，因此都能形成闭包。即使mark方法没有访问私有变量a，b。
```

```javascript
function b (){
    function a (){
        console.log("func");
    }
    var a = 5 ;
    console.log(a);
}
b();
//变量声明提升，函数function的优先级大于变量var ，在开发者工具可以看下a直接就是函数
```



