---
title： 深入理解 setTimeout
---

### 1 基础概念

* JS单线程: 
* Web APIs： setTimeout setInterval
* event-loop ： JS执行队列

###2 setTimeout 

意思是在定义的事件将要执行的代码推入 JS 执行队列中，而不是执行，是否执行要看Event-Loop如何执行以及JS线程是否空闲；

**这个重点理解，WebAPI 这个定时器是定时将要执行的代码放入 JS事件队列中，放入队列的时机就是定时的定时的时间，即使是 0，浏览器也会有一个 4ms的延迟（大概）**

### 3 案例

```javascript
setTimeout(function(){ //1000ms后将要执行的函数推入事件队列中
    console.log(3);
},1000)
setTimeout(function(){ //1000ms后将要执行的代码推入到事件队列中
    console.log(6);
},1000)
console.log(5);
setTimeout(function(){ // 0ms(4ms)将要执行的代码推入到事件队列中
    console.log(1)
},0)
/**
5
1
一秒后（3，6 几乎同时打印出来）
3
6
*/
```

分析以上代码：

Web APIs有三个定时任务，这三个定时任务是在特定的事件将要执行的函数放入 JS事件队列中，通过 JS的eventLoop区执行；

**注意放入JS事件队列中的顺序如下：[1, 3, 6 ] **(3,6 几乎同时放入事件队列中)

```javascript
setTimeout(function(){
    setTimeout(function(){
        console.log(3);
    },1000)
    setTimeout(function(){
        console.log(6);
    },1000)
    console.log(5);
    setTimeout(function(){
        console.log(1)
    },0)
},0)
setTimeout(function(){
    console.log(4);
},1000)
console.log(2)
/**
2
5
1
一秒后（4，3，6 几乎同时打印出来，但是 4 依旧优先）
4
3
6
*/
```

**还是重点理解定时器是在特定的时间点会将要执行的函数推入 JS 的事件队列，等待被Event-loop循环**

```javascript
for(var i=0;i<5;i++){
    setTimeout(function(){
        console.log(new Date().getTime(),i);
    },1000);
}
console.log(new Date().getTime(),i);
/**
5
一秒后
5
5
5
5
5
*/
```

```javascript
for(let i=0;i<5;i++){
    setTimeout(function(){
        console.log(new Date().getTime(),i);
    },1000);
}
console.log(new Date().getTime(),i);
/**
先报错  i is not defined(let的块级作用域)
一秒后
0
1
2
3
4
*/
```

```javascript
for(var i=0;i<5;i++){
    (function (i){
        setTimeout(function(){
            console.log(new Date().getTime(),i);
        },1000);
    })(i)
}
console.log(new Date().getTime(),i);
/***
5 
一秒后
0
1
2
3
4
/
```

等价于

```javascript
 function output(i) {
    setTimeout(function(){
      console.log(new Date().getTime(),i)
    },1000)
  }
  for(var i=0;i<5;i++){
    output(i);
  }
```

```javascript
 for(var i=0;i<5;i++){
    (function (i){
      setTimeout(function(){
        console.log(new Date().getTime(),i);
      },1000*(i+1));
    })(i)
  }
  console.log(new Date().getTime(),i);
/**
5
接下来，每隔一秒输出一个
0
1
2
3
4
**/
```

其他要求： 要求每隔一秒输出  0 1  2 3 4 5 

解法1:暴力setTImeout

```javascript
 for(var i=0;i<5;i++){
    (function (i){
      setTimeout(function(){
        console.log(new Date().getTime(),i);
      },1000*(i+1));
    })(i)
  }
  setTimeout(function(){
    console.log(new Date().getTime(),i);
  },1000*(i+1))
/** 每隔一秒
0
1
2
3
4
5
*/
```

解法2

```javascript
(async function(){
    for(var i = 0 ; i < 5 ;i++) {
        console.log(new Date().getTime(),i)
        await new Promise((resolve,reject) => {
            setTimeout(resolve,1000);
        });
    }
    console.log(new Date().getTime(),i)
})()
```

另外看下 setTimeout形成的闭包

```javascript
var num = 999;
for(var i = 0 ;i < 5 ;i++){
    (function(num){
        setTimeout(function fn(){
            console.log(this.num);
            var num = 5;
            console.log(num)
        },i*1000);
    })(i)
}
```

