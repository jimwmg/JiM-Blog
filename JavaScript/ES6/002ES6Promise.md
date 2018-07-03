---
title:  ES6-Promise
date: 2017-05-20 12:36:00
categories: ES6
tags : promise
comments : true 
updated : 
layout : 
---

### 1 Promise定义

Promise是一种异步编程的解决方案,是一个对象(构造函数),从该对象可以获取异步操作的消息

Promise对象的特点

（1）对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`Pending`（进行中）、`Resolved`（已完成，又称 Fulfilled）和`Rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`Pending`变为`Resolved`和从`Pending`变为`Rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

缺点

(1) 首先，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。

(2) 当新建promise对象的时候,Promise里面必须传入回调函数,否则内部会抛出错误

```javascript
var promise = new Promise()  //报错
```

(3) 当处于Pendding状态的时候,无法确切知道处于哪个阶段的状态

我们可以打印出来看下有什么

```javascript
console.dir(Promise);
//我们可以看到起原型上有 then 和catch等方法
// var promise = new Promise();  Promise是一个构造函数,构造函数中必须传入一个函数作为参数,否则会报错
var promise = new Promise(function(resolve,reject){
  console.log(arguments);//
  // resolve();
  reject();
})
console.log(promise);
```

```
//promise实例上有如下属性 
Promise
[[PromiseStatus]]:"resolved"
[[PromiseValue]]:undefined
```

### 2 基本使用 Promise是一个构造函数,该构造函数接受一个函数作为参数(必须的)

写在前面,promise对象创建的时候立即执行>同步>异步>回调函数

接受的函数中又有两个函数作为参数,

* Promise构造函数中必须有一个函数作为构造函数的参数,作为参数的函数的参数有两个函数
* 一个是resolve函数,在异步操作成功的时候执行该函数,将Pendding状态改变为Resolved
* 一个是reject函数,在异步操作失败的时候执行该函数,将Pendding状态改变为Rejected
* 创建promise对象之后,根据异步操作成功与否,调用resolve或者reject函数,改变状态的结果,then方法会根据改变的状态结果调用响应的回调函数,then方法接受两个函数,
  * 第一个函数在Resolved状态的时候执行
  * 第二个函数在Rejected状态的时候执行

基本的实现思路是

```javascript
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

如下demo所示

```javascript
var promise = new Promise(function(resolve,reject){
            console.log('promise对象创建之后立即执行');
            // resolve();
            // rejecte();
            
        })
       console.log('helloWorld');

        promise.then(function(){
            console.log('this is the status of Resolved');
            
        },function(){
            console.log('this is the status of Rejected');
            
        })
```

* 当打开resolve()的注释的时候,改变了promise实例的状态,触发then函数中的第一个回调函数的执行

```
promise对象创建之后立即执行
helloWorld
this is the status of Resolved
```

* 当打开reject()的注释的时候,改变了promise实例的状态,触发then函数中的第二个回调函数的执行

```
promise对象创建之后立即执行
helloWorld
this is the status of Rejected
```

### 3 实例化一个Promise对象的时候传入Promise构造函数的参数是一个函数,该函数立即执行

内部实现大概是这个样子的,我猜 ; 所以才会有上面的输处顺序

```html
<script>
function foo(f1){
  f1()
}
new foo(function(){
  console.log('f1 is exected');
});
</script>
```

### 4 如果 resolve 或者 reject 函数执行的时候有参数,那么参数会传递给then方法中相应的回调函数

```html
<script>
  var promise = new Promise((resolve,reject)=>{
    var res = 'RES';
    var rej = 'REJ';
    resolve(res); 
    reject(rej);
  })

  promise.then(value => {
    console.log('这是通过resolve函数传递过来的参数',value);

     },value => {console.log('这是通过reject函数传递过来的参数',value);
  })
</script>
```

另外,一般而言reject函数的参数一般是一个ERROR对象的实例,resolve函数的参数也可能是另外一个Promise对象的实例

先看下面一段代码,

* 如果promise对象不是另外一个promise对象的resolve函数的参数,那么promise实例 p1 p2的状态互不影响

```html
 <script>
        var p1 = new Promise(function(resolve,reject){

        })

        var p2 = new Promise(function(resolve,reject){
            resolve() ;
        })

        console.log('p1',p1); //p1 Pendding
        console.log('p2',p2);//p2 Resolved
        
    </script>
```

* 但是如果promise实例是另外一个promise对象的resolve的参数的话,那么promise实例将会和resolve参数的promise对象的状态保持一致

```html
<script>
        var p1 = new Promise(function(resolve,reject){
			//此时p1对象的状态是Pendding
        })

        var p2 = new Promise(function(resolve,reject){
            resolve(p1) ; //将p1对象作为resolve函数的参数
        })

        console.log('p1',p1);//p1 Pendding
        console.log('p2',p2);//p2 Pendding
        
    </script>
```

改变p1对象的状态

```html
<script>
        var p1 = new Promise(function(resolve,reject){
            resolve();//此时p1对象的状态是Resolved
        })

        var p2 = new Promise(function(resolve,reject){
            resolve(p1) ;
        })

        console.log('p1',p1);//p1 Resolved
        console.log('p2',p2);//p2 Resolved
        
    </script>
```

```html
 <script>
        var p1 = new Promise(function(resolve,reject){
            // resolve();
            reject();
        })

        var p2 = new Promise(function(resolve,reject){
            resolve(p1) ;
        })

        console.log('p1',p1);
        console.log('p2',p2);
        
    </script>
```

### 5 Promise.prototype.then     Promise.prototype.catch

* then方法是定义在Prototype构造函数原型上的一个方法
* 该方法接受两个函数作为参数
  * 第一个参数函数在promise实例状态变为Resolved的时候会执行
  * 第二个参数函数在promise实例状态变为Rejected的时候会执行
* 该方法返回值是 另外一个promise对象
* catch方法:当一个Promise实例的状态变为Rejected的时候会调用catch方法里面的回调函数

```html
<script>
        var p = new Promise(function(resolve,reject){
            resolve()
        })

        var ret = p.then(function(){
            console.log('this is the status of Resolved');  
        })

        console.log(ret);//Promise对象  pendding
        
    </script>
```

```html
    <script>
        var p = new Promise((resolve,reject)=>{
            reject();
        })

        p.catch(function(){
            console.log('REJECTED');    
        })
    </script>
```

基本使用暂时到此,后期其他方法会有时间更新  ===========  2017/5/11    21:21

then链式调用的时候,then函数的返回值,会作为第下一个then函数中第一个参数函数的参数，如果没有返回值，那么默认返回值是undefined;

```javascript
var p = new Promise(function(resolve,reject){
  resolve()
})

var ret = p.then(function(){
  console.log('this is the status of Resolved');
  return 2  // false 或者不返回值,此时val的值将是undefined
},function(){
  console.log('resolve')
}).then(function(val){
  console.log('inner Resolved');
  console.log(val) //2 false  undefined  ;//如果没有返回值，那么默认返回值是undefined;
})
```

```javascript
 var test ={
	func1:function(){
		var data = new Promise(function(resolve){
			setTimeout(function(){
				resolve("ajax结果111")
			},200)
		})
		return data;
	},
	func2:function(){
		var data = new Promise(function(resolve){
			setTimeout(function(){
				resolve("ajax结果222")
			},100)
		})
		return data;
	},
	func3:function(){
		var data = new Promise(function(resolve){
			setTimeout(function(){
				resolve("ajax结果333")
			},500)
		})
		return data;
	}
}
//resolve函数的参数将会作为then函数中第一个函数的参数
test.func1().then(function(value){
	console.log(value)
	//do something...
})
//then的链式调用前奏
test.func1().then(function(value){
	console.log(value) //ajax结果111
	test.func2().then(function(value){
		console.log(value) //ajax结果2
		test.func3().then(function(value){
			console.log(value) //ajax结果333
			//do something...
		})
	})
})
```

使用return可以更加方便的进行链式调用

```javascript
test.func1().then(function(value){
	console.log(value)
	//do something...
	return test.func2();
}).then(function(value){
	console.log(value)
	return test.func3();
}).then(function(value){
	console.log(value)
})
```



===2017/6/14更新

## 6 fetch方法

6.1 目前在做react项目，用到了fetch发送异步请求，此时的fetch其实就是封装了一分Promise对象。

先来看下如何封装Ajax

```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

```javascript
fetch(url).then(function(response) {  //then方法返回一个新的Promise对象，
  return response.json();
}).then(function(data) {  //这个data就是通过
  console.log(data);
}).catch(function(e) {
  console.log("Oops, error");
});
```

