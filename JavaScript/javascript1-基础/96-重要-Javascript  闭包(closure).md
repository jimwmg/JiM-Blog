---
title: javascriptClosure  
date: 2016-06-19 12:36:00
categories: javascript
tags: closure
comments : true 
updated : 
layout : 
---

## Javascript  闭包(closure)

理解闭包之前，以下概念必须清楚

- 基础数据类型与引用数据类型
- 内存空间
- 垃圾回收机制
- 执行上下文
- 变量对象与活动对象

1 为什么需要闭包？

我们从变量的作用域来进行考究原因

javascript中变量作用域分为两种，一种是全局作用域，一种是函数作用域(ES6中新增块级作用域)

1.1 函数内部可以访问函数外部的变量，即可以直接读取全局变量

```javascript
var num = 200;
function getNum (){
  console.log(num);//  输出 200 
} 
```

1.2 函数外部却无法直接访问函数内部用var声明的函数内部变量

```javascript
function getNum(){
  var num = 200 ;
}
console.log(num);//Uncaught ReferenceError: num is not defined
```

2.既然有需求，那么就要解决？什么是闭包？

闭包，官方对闭包的解释是：一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数），因而这些变量也是该表达式的一部分。

*  闭包就是一个函数； OK了，
*  再进一步，这个函数可以用来获取另外一个函数内部的变量

2.1闭包的特点：

2.1.1 作为一个函数变量的一个引用，当函数返回时，其处于激活状态。　　

2.1.2 一个闭包就是当一个函数返回时，一个没有释放资源的栈区。简单的说，Javascript允许使用内部函数---即**函数定义**和**函数表达式** 位于另一个函数的函数体内。而且，这些内部函数可以访问它们**所在的外部函数中声明的所有局部变量** 、**参数** 和**声明的其他内部函数** 。当其中一个这样的内部函数在包含它们的外部函数之外被调用时，就会形成闭包。

2.1.3 闭包的作用 : **一个是可以读取函数内部的变量**;(**局部变量**)   ,**另一个就是让这些变量的值始终保持在内存中** 。

2.1.3 闭包形成的条件:

*  在一个函数内部有一个新的函数
*  这个新的函数访问了外部函数内的变量

2.2 闭包栗子

**声明变量有两种方式 var 和 function ,两者声明的变量都会提升**

2.2.1 如下一段代码，getInnerNum 可以访问 getNum 函数内部所有的变量，参数，以及函数的值，getInnerNum被getNum函数包住了

```javascript
  function getNum(){
        var num = 200 ;
        function getInnerNum(){ // 
            console.log(num);
        }
    }
//getInnerNum();直接引用是错误的，getInnerNum是在函数体内声明的，可以理解为是局部变量，外部不能直接调用函数内的嵌套函数
```

2.2.2 那么如果我们想要getNum内部的变量，该如何访问呢？既然getInnerNum可以访问num变量，不如将这个函数作为返回值

```javascript
 function getNum(){
        var num = 200 ;
        function getInnerNum(){
            console.log(num);
        }
        return getInnerNum;//注意返回的是一个引用地址，改地址存放了函数getInnerNum
    }

   // console.log(getNum());//可以判断出getNum 函数执行后返回的是getInnerNum 的函数体
    getNum()(); //200
```

注意区分下面这段代码

```javascript
  var num = 300;
    function getNum(){
        var num = 200 ;
        function getInnerNum(){
            console.log(this.num);//this在执行的时候指向谁？函数的执行上下文
        }
        return getInnerNum;//注意返回的是一个引用地址，改地址存放了函数getInnerNum
    }
    getNum()();// 300 
```

2.2.3 明确垃圾回收机制，函数体执行后，函数内部声明的**变量** ，在函数调用完毕之后，被垃圾回收机制(garbage collection) 回收; 如果

situation 1 : 闭包的作用 **一个是可以读取函数内部的变量**;(**局部变量**)   ,**另一个就是让这些变量的值始终保持在内存中** 

```javascript
    function getNum(){
        var num = 200 ;
        addNum = function(){
            console.log("addNum is completed");
            num++;
        }
        function getInnerNum(){
            console.log(num);
        }
        return getInnerNum;//注意返回的是一个引用地址，改地址存放了函数getInnerNum
    }
        getNum()();//200
        addNum();//addNum is completed
        getNum()();//200
//getNum()每次执行都会重新声明  var num = 200 ;所以输出 200;
//对于垃圾回收机制，函数执行过程中，为函数内部声明的变量分配栈或者堆内存，在函数执行结束之后，释放占据的内存
```

```javascript
 getNum()();//200
//进行了以下动作
getNum() //声明num addNum函数(全局) getInnerNum函数(局部)
//得到返回的getInnerNum 函数，然后运行该函数
getInnerNum();
```

situation 2 :闭包的作用 **一个是可以读取函数内部的变量**;(**局部变量**)   ,**另一个就是让这些变量的值始终保持在内存中** 

```javascript
	 function getNum(){
        var num = 200 ;
        addNum = function(){
            console.log("addNum is completed");
            num++;
        }
        function getInnerNum(){
            console.log(num);
        }
        return getInnerNum;//注意返回的是一个引用地址，改地址存放了函数getInnerNum
    }
	var result = getNum()
    result();//200
    addNum();//addNum is completed
    result();//201
//getNum() 只执行了一次，所以  var num = 200 也只声明了一次
//因为将内部的函数getInnerNum 赋值给了全局变量result,所以外部函数getNum并不算执行完毕，所以函数内部声明的变量在栈或者堆内存中不会被垃圾回收机制回收
```

此时，我们将getNum()的返回值getInnerNum函数给到变量result，result被执行了两次，第一次输出了 200  第二次输出201；这是为什么呢？

原因就在于 getNum 是 getInnerNum 的父函数，而 getInnerNum 被赋给了一个全局变量result，这导致 getInnerNum 始终在内存中，而 getInnerNum 的存在依赖于 getNum ，因此  getNum 也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。

因为result引用了getInnerNum.而 getInnerNum又是依赖于getNum，所以result间接引用了外部函数，所以getNum会一直在内存中存在，不会被垃圾回收机制回收；那么其所形成的作用域链也会一直存在；

同时，函数在执行的过程中动态为函数内部变量分配的内存也会一直存在；

```javascript
result = null ;
```

我们需要了解垃圾回收机制

* 对于局部变量，只在函数执行的时候存在，函数运行完毕，**局部变量** 就会被垃圾回收机制回收；
* 对于全局变量，垃圾回收机制则很难判断什么时候可回收
* 局部变量只在函数的执行过程中存在，**函数执行过程中** 会为**局部变量**在**栈或堆** 上分配相应的空间，以存储它们的值，然后再函数中使用这些变量，直至函数结束
* 但是在闭包中，由于内部函数getInnerNum 被赋值给了全局变量result,所以getNum函数并不算结束，所以垃圾回收机制不会将变量回收，所以函数中的变量  n 是一直存在于内存中的，并没有被回收
* 函数的执行上下文，在执行完毕之后，生命周期结束，那么该函数的执行上下文就会失去引用。其占用的内存空间很快就会被垃圾回收器释放。可是闭包的存在，会阻止这一过程。

这段代码中另一个值得注意的地方，就是

```javascript
addNum = function(){
     console.log("addNum is completed");
      num++;
  }
```

这一行，首先在addNum前面没有使用var关键字，因此addNum是一个全局变量，而不是局部变量。其次，addNum的值是一个匿名函数（anonymous function），而这个匿名函数本身也是一个闭包，所以addNum相当于是一个setter，可以在函数外部对函数内部的局部变量进行操作。

situation3 : 看下立即执行函数如何利用闭包

```javascript
    (function getNum(){
        var num = 200 ;
        addNum = function(){
            console.log("addNum is completed");
            num++;
        }
        function getInnerNum(){
            console.log(num);
        }
       window.result = getInnerNum ;//注意这行代码，将内部引用赋值给全局变量result，所以该作用域链会一直存在;jQuery底层源码也是这种实现形式
    })()		//立即执行函数

    result();//200
    addNum();//addNum is completed
    result();//201
```

situation 4 数组中的元素引用，形成闭包

```javascript
	var arr = [];

    for(var i = 0 ; i < 3  ; i++){
        arr[i] = outFunc(i); 
      //innerFunc被数组中的每一个元素引用，每次循环都会形成一个闭包，每次传进去的 i 都会作为变量对象
        function outFunc(num){
            function innerFunc(){
                console.log(num);
            }
            return innerFunc ;
        }
    }

    arr[0]();
    arr[1]();
    arr[2]();
```

situation5  setTimeout(fn,time) 定时器函数的执行：按道理来说，既然fn被作为参数传入了setTimeout中，那么fn将会被保存在setTimeout变量对象中，setTimeout执行完毕之后，它的变量对象也就不存在了。可是事实上并不是这样。它仍然是存在的。这正是因为闭包。

很显然，这是在函数的内部实现中，setTimeout通过特殊的方式，保留了fn的引用，让setTimeout的变量对象，并没有在其执行完毕后被垃圾收集器回收。因此setTimeout执行结束后经过time时间后，会自动执行fn函数。

```javascript
 for(var i = 0 ; i < 5 ; i++){
        setTimeout( function fn() {
            console.log(i);
        }, i*1000 )
  }
//由于javascript执行代码单线程，遇到setTimeout会将setTimeout放到事件队列当中
//这个循环创建了5个setTimeout函数，将执行函数fn添加到事件队列中
//作用域链  全局作用域-->setTimeout作用域(也是全局作用域，因为setTimeout内部的this指向的是window)
```

如何输出1,2,3,4,5呢？

```javascript
    for(var i = 0 ;i < 5 ;i++){
        function res (num){
           var timer = setTimeout(function fn(){
                console.log(num)
            },i*1000);
        }
        res(i)
    }
//因为res函数执行的时候，创建了res函数作用域，传入的num作为res当前执行上下文中的变量对象中的一员，fn函数执行的时候,会先在fn作用域内找num ,找不到则往上一层一层找；
//作用域链如下:全局作用域--->res函数作用域--->setTimeout---> fn函数作用域(fn在setTimeout内部实现了闭包，所以fn执行的时候，可以获取到当前作用域链上的变量)
//---------------------------------------------
//这两种方法都是可以的，推荐第二种立即执行;
    for (var i=1; i<=5; i++) {
        (function (i) {setTimeout( function fn() {
            console.log(i);
        }, i*1000 )})(i);
    }

```

```javascript
	var num = 999;
    for(var i = 0 ;i < 5 ;i++){
        (function(num){
            setTimeout(function fn(){
                console.log(this);
                console.log(this.num);
                var num = 5;
                console.log(num)
            },i*1000);
        })(i)
    }
//通过这个案例的验证，可以发现setTimeout内部实现了闭包，fn执行的时候上下文不会被垃圾回收机制回收;
```

注意：函数定义的时候，相当于给其父级作用域对象添加了一个属性，函数执行的时候，相当于再次创建了一个新的作用域。也就是说，函数只在执行的时候才会创建一个新的作用域对象。

3 如何避免闭包？

**闭包的作用:一个是可以读取函数内部的变量**;(**局部变量**)   ,**另一个就是让这些变量的值始终保持在内存中**

第一个作用使我们想要的，但是第二个会使闭包一直占据内存，这个是我们应该尽力去避免的；由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。

4 看下面这行代码的输出: this改变了函数执行的上下文

```javascript
 		var num = 300;
        function getNum(){
            var num = 200 ;
            addNum = function(){
                console.log("addNum is completed---"+num);
                num++;
                console.log("addNum is completed---"+num);
            }
            function getInnerNum(){
                console.log(this.num);//函数执行的时候，this指向其运行的时候所在的对象
            }
            return getInnerNum;//注意返回的是一个引用地址，改地址存放了函数getInnerNum
        }
        var result = getNum()
        result();
	    addNum();
        result();
//控制台输出
		300
		addNum is completed---200
	    addNum is completed---201
        300 
```

5 此时回过头来理解下文章开始的一些基础的定义，以及重新回忆下链式作用域，变量的取值(就近原则)，全局作用域，局部作用域

### 完结    

2017-8-28更新（七夕福利），最近在地铁上看的一些文章，觉得特别好，加上。

以下三篇文章特别好，专门找来链接加上。

[闭包链接好文1](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651551349&idx=1&sn=1b149911b0ee2b9421a453f256f0c6f9&chksm=8025a1b4b75228a250b5617f29aeb20f21466e8f2691c62980acd2be8228db03d5f52d12eb29&mpshare=1&scene=24&srcid=0827s8bbeErq8ggtqyWyEKp1&key=9fd1521432b7ed0ab53aeaa9333bdd27be4d6b0c66979bcefa9a23603eecb0e02f1d349c0ecb981757b2ed6ac26a5658ddb8831d21a4278a0afedbc8823a36d6a0a756e23d7333f21464acbc44bee6ee&ascene=0&uin=MjIzMzEwNzk0MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.6+build(16G29)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=3DR85DpkdQomoEgq2Klza2%2BwvGGb%2FsDvBP6vIdKmeKbcenxxGVUArTZiCns2W0Cw)

[闭包链接好文2](https://mp.weixin.qq.com/s?__biz=MzAxOTc0NzExNg==&mid=2665513789&idx=1&sn=e2e39002a915291fa06050c8116c2f96&chksm=80d67b7eb7a1f2681267fa53c624add554c47ed1c39dc8d44b98b0a414c80a646e52ad399173&mpshare=1&scene=2&srcid=0728PT5bjloTiY4u0pJqZTfM&from=timeline&key=a9f0cd582f409b4eb2a223e131488bbf12c95bcd829a5ad7926c9c3c5f6da643c6a8b0510f44d64515f3d849bf92ebad8f1891a0fbb88024d368c8b6438b7e99553d18b9df45e2b36e6bbaccb2c9b951&ascene=0&uin=MjIzMzEwNzk0MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.6+build(16G29)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=3DR85DpkdQomoEgq2Klza2%2BwvGGb%2FsDvBP6vIdKmeKbcenxxGVUArTZiCns2W0Cw)

[闭包链接好文3](https://mp.weixin.qq.com/s?__biz=MzI5MjUxNjA4Mw==&mid=2247484013&idx=1&sn=8f30fe854083510b3c15f01c375e56d6&chksm=ec017bf1db76f2e72895f242b6a332795a7b992c08887f75a123eb0e4719f775c6fad4e4b806&mpshare=1&scene=24&srcid=0826wxDuccnuj3kRwExehKZr&key=9fd1521432b7ed0a13d3d0950b70af6abbe7ab74ec6c36ef437d91832f12985d6d370d2053a6df9b7ed5dd877aedec2cbebd57d6611ef02f870dccf42ddc594d664687dcaeda81d1b96f089c6f029ce0&ascene=0&uin=MjIzMzEwNzk0MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.6+build(16G29)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=3DR85DpkdQomoEgq2Klza2%2BwvGGb%2FsDvBP6vIdKmeKbcenxxGVUArTZiCns2W0Cw)

2017-8-30更新:看的项目上的代码，可以看下闭包和this的理解，包括最基本的运算

```javascript
var obj ;
(function(obj){
  var designer ;
  (function(_designer){
    var name = 'Jhon';
    var region = (function (){
      var v = 'something';
      function region(){//这个函数作为返回值
        this.conf = {age:14};
        console.log(this);//this 的指向和函数的调用方式
        console.log(v);//可以访问外围函数的变量
      }
      console.log(this);//函数直接执行，指向window；函数内部的函数，没有明确的父级执行对象
      return region ;

    })();
    _designer.region = region;
  })(designer= obj.designer|| (obj.designer ={}))

})(obj || (obj = {}));//赋值运算返回赋值运算符右边的值.逻辑非运算从右到左进行运算;赋值运算符基本上优先级最低
console.log('obj',obj);
console.log('designer',obj.desiger);
// console.log(new obj.designer.region());
```

2017-9-14更新 ：闭包vs  this 以及结合元素的事件绑定中的使用情景

```html
<button id='btn'>按钮</button>
<script>
  var B ;
  (function(B){
    var p = (function(){
      function Person(name,age){
        this.name = name;
        this.age = age;
      }
      Person.prototype.sayHello = function(){

        console.log('hello my name is '+this.name+'nice to meet you ')
      }
      Person.prototype.bindEvent = function(){
        var _this  = this ;
        document.getElementById('btn').onclick = function(){
          console.log('this',this);
          console.log('_this',_this);
          _this.sayHello();
        }
      }
      return Person;
    })()
    B.p = p ;
  }(  B||(B={})  ))
  var Jhon = new B.p('Jhon',28);
  Jhon.sayHello();
  Jhon.bindEvent();
</script>
```

这段代码也不要被其迷惑，抛开其他的来看，闭包的产生仅仅是 bindEvent这个函数，在这个函数中document.getElementById('btn').onclick所触发的函数，引用了	` _this`  这个变量而已（可以将`_this` 命名为任何变量名，便于理解，其实就类似于上面的变量num）

2017-9-28 国庆节前更新[闭包博文](http://www.cnblogs.com/TomXu/archive/2012/01/31/2330252.html)

[闭包变量对象](http://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html)

javascript采用的是静态作用域，即作用域链是在变量和函数创建的时候确定的，而不是在执行的时候确定的；

```javascript
var x = 10;
function foo() {
  alert(x);
}
(function (funArg) {
  var x = 20;
  // 变量"x"在(lexical)上下文中静态保存的，在该函数创建的时候就保存了
  funArg(); // 10, 而不是20
})(foo);
```

以下通过闭包缓存作用域

```javascript
var y = 10;
var foo = (function () {
  var y = 20;
  return function () {
    console.log(y);
  };
})();
foo(); // 20
```









