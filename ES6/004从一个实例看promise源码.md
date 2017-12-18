---
title:  从一个实例看Promise源码
date: 2017-12-18 
categories: ES6
tags : promise
comments : true 
updated : 
layout : 
---

### 1 最简单一个案例

```javascript
function runAsync(){
  let p = new Promise(function(resolve,reject){
    console.log('exec');
    setTimeout(function(){
      resolve('someData');
    },2000);
  });
  return  p;
}
var promise = runAsync();
promise.then(function(data){
  console.log(data);
});
console.log('同步执行');
console.log(promise);
```

控制台输出

```
exec
同步执行
Promise
//两秒后
someData
```

### 2 Promise内部是如何运行的？

####2.1 执行这行代码的时候：let p = new Promise(f);

```javascript

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

```

可以看到  let p = new Promise(f);

* 第一会先执行  f  函数
* 第二生成一个Promise对象

```javascript
p =>{
  _deferredState:0,//deffer的状态，代表的应该是 _deferreds 的类型，1 是 single，2 是 Array
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds:null  
}
```

####2.2执行这行代码的时候： promise.then(function(data){ console.log(data);}); 

```javascript
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};
//这里生成一个deffer对象，保存then函数中注册的onFulfilled和onRejected回调，以及要返回的新的promise实例对象
function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}
function handle(self, deferred) {
  //不会进入这里
  while (self._state === 3) {
    self = self._value;
  }
  //也不会进入这里
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  //进入这里
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
      //第一次执行到这里即结束；
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  //这个函数只有当 _state的值为 1 2的时候才会执行
  handleResolved(self, deferred);
}
```

此时再来看下p这个promise实例的属性值

```javascript
p =>{
  _deferredState:1,//deffer的状态
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds: new Handler(onFulfilled, onRejected, res)
}
```

####2.3 异步操作完成以后：resolve('someData');

```javascript
//真正调用这个函数的是tryCallTwo中的第二个函数入参；self就是p这个promise实例对象；
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  //对于此时的案例，不会进入这里
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  //也不会进入这里
  if (
    //比如resolve(p1)   p1是一个新的promise对象；
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  //对于简单的返回值，比如后台返回的JSON字符串等，这里就直接进行处理；
  self._state = 1;//fulfilled
  self._value = newValue;//给这个promise对象添加属性值 _value，用来保存异步操作的结果；
  finale(self);//最后处理这个promise对象
}
```

此时的promise实例对象

```javascript
p =>{
  _deferredState:1,//deffer的状态
  _state:1,//每个promise对象的状态维护标识
  _value:'someData',//resolve函数执行的时候，异步得到的结果
  _deferreds: new Handler(onFulfilled, onRejected, res)
}
```

####2.4  finale(self);//最后处理这个promise对象 

```javascript
function finale(self) {
  //进入这个if语句
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}
```

```javascript
function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  //此时不会进入这里因为 _state的值为 1 
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
    //这个函数只有当 _state的值为 1 2的时候才会执行
  handleResolved(self, deferred);
}
```

```javascript
function handleResolved(self, deferred) {
  asap(function() {
    //得到promise.then(function(data){ console.log(data);});注册的函数
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    //执行then中注册回调函数
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
};
function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
```

至此一个简单的promsie的实现流程完毕；

简单总结下上面的流程就是

promise实例对象==> 异步成功 ==> 该实例对象的resolve(data) ==> resolve(self,newValue) ==> resolve函数会对newValue的值进行判断，有以下可能

* 基本数据类型，那么直接执行finale(self)处理这个promise实例对象==>handle(self,deffer) ==>handleResolved处理then中注册的函数；
* 对象或者函数：doResolve(then.bind(newValue), self);

下面用实际的例子来看下：

### 3 对于then的链式调用，Promise内部又是如何运行的呢？

####下一个then中注册的函数会接收到上一个then的返回值作为该then中注册的函数的参数；

####3.1 then注册的函数返回基本数据类型

```javascript
function runAsync(){
  let p = new Promise(function(resolve,reject){
    console.log('exec');
    setTimeout(function(){
      resolve('someData');
    },2000);
  });
  return  p;
}
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return 'someData1'
}).then(function(data){
  console.log(data);
  return 'someData2'
}).then(function(data){
  console.log(data)
})
console.log('同步执行');
console.log(promise);
```

控制台输出

```
exec
同步执行
Promise
//两秒后
someData
someData1
someData2
```

接着上面代码继续分析

```javascript
function handleResolved(self, deferred) {
  asap(function() {
    //得到promise.then(function(data){ console.log(data);});注册的函数
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    //执行then中注册回调函数
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
};
```

这里的deferred对象如下

```javascript
var res = new Promise(noop);
handle(this, new Handler(onFulfilled, onRejected, res));
//这里生成一个deffer对象，保存then函数中注册的onFulfilled和onRejected回调，以及要返回的新的promise实例对象
function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}
```

```javascript
deferred:{
  onFulfilled:onFulfilled,
  onRejected:onRejected,
  promise:res  //注意这个promise生成的时候，并没有执行  doResolve(fn, this);
}
res:{
  _deferredState:0,//deffer的状态
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds:null  
}
```

```javascript
//执行then中注册回调函数
var ret = tryCallOne(cb, self._value);//对于上面这个案例，ret的值分别是 'someData1' 'someData2'
if (ret === IS_ERROR) {
  reject(deferred.promise, LAST_ERROR);
} else {
  //最后执行到这里,又对这个新的promise对象进行处理，处理流程在上面已经解释过，
  resolve(deferred.promise, ret);
}
```

#### 3.2 then注册的函数返回一个新的promise

```javascript
function runAsync(){
  let p = new Promise(function(resolve,reject){
    console.log('exec');
    setTimeout(function(){
      resolve('someData');
    },2000);
  });
  return  p;
};
function runAsync1(){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve('someData1');
    },2000);
  })
};
function runAsync2(){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve('someData2');
    },2000);
  })
};
//以下的异步操作会按照顺序进行执行；
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return runAsync1()
}).then(function(data){
  console.log(data);
  return runAsync2()
}).then(function(data){
  console.log(data);
  // return 'someData3'
})
console.log('同步执行');
console.log(promise);
```

控制台输出

```
exec
同步执行
Promise
//两秒后
someData
//两秒后
someData1
//两秒后
someData2
```

```javascript
//执行then中注册回调函数
var ret = tryCallOne(cb, self._value);//对于上面这个案例，ret的值分别是 'someData1' 'someData2'
if (ret === IS_ERROR) {
  reject(deferred.promise, LAST_ERROR);
} else {
  //最后执行到这里,又对这个新的promise对象进行处理，处理流程在上面已经解释过，
  resolve(deferred.promise, ret);
}
```

```javascript

//真正调用这个函数的是tryCallTwo中的第二个函数入参；self就是p这个promise实例对象；
function resolve(self, newValue) {
  //此时的newValue是then中注册函数的返回的Promise实例对象
  //self是deferred.promise
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  //对于此时的案例，不会进入这里
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  //注意，对于then中注册的函数返回值是一个新的promise对象的时候，此时会进入这里
  if (
    //比如resolve(p1)   p1是一个新的promise对象；
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      //两个Promise对象原型链上都是引用的then这个函数地址
      then === self.then &&
      newValue instanceof Promise
    ) {
      //执行到这里
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  //对于简单的返回值，比如后台返回的JSON字符串等，这里就直接进行处理；
  self._state = 1;//fulfilled
  self._value = newValue;//给这个promise对象添加属性值 _value，用来保存异步操作的结果；
  finale(self);//最后处理这个promise对象
}
```

```javascript
function finale(self) {
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}
```

```javascript
function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}
```

### 4 综合练习

对于注释的代码可以来回切换，看下结果。

```javascript
function runAsync(){
  let p = new Promise(function(resolve,reject){
    console.log('exec');
    setTimeout(function(){
      resolve('someData');
    },2000);
  });
  return  p;
};
function runAsync1(){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      console.log('异步1')
      // resolve('someData1');
      reject('error1')
    },2000);
  })
};
function runAsync2(){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      console.log('异步2')
      // resolve('someData2');
      reject('error2')
    },2000);
  })
}
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return runAsync1()
}).then(function(data){
  console.log(data);
  return runAsync2()
}).then(function(data){
  console.log(data);
  // return 'someData3'
}).catch(function(error){
  console.log(error)
})
console.log('同步执行');
console.log(promise);
```

