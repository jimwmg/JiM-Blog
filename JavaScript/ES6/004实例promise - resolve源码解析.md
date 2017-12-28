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
function noop() {}
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
  //注意这里，如果fn传入的是noop这个函数，那么不会执行doResolve
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

可以看到  let p = new Promise( f );在 传入的  f. 函数不是noop的时候，

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
  if (this.constructor !== Promise) {//这些比较的都是引用地址；
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  //注意这里 then的链式调用，每次then函数执行完毕之后，返回值都是一个新的Promise实例对象，
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
  //进入这里,注意这里，如果通过then的链式调用，那么每次then返回的对象都是一个新的类似于下面 p 实例对象；
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

同理，Promsie.prototype.catch

```javascript
Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};
```

此时再来看下p这个promise实例的属性值

```javascript
p =>{
  _deferredState:1,//deffer的状态
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds: new Handler(onFulfilled, onRejected, res)//存放通过then注册的函数以及返回的❤️Promise实例对象的一个Handler对象；
}
res:{
  _deferredState:0,//deffereds的状态,
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds:null  
}
```

如果返回的res在执行then方法，那么

```javascript
p =>{
  _deferredState:1,//deffer的状态
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds: new Handler(onFulfilled, onRejected, res)//存放通过then注册的函数以及返回的❤️Promise实例对象的一个Handler对象；
}
res:{
  _deferredState:1,//deffereds的状态,
  _state:0,//每个promise对象的状态维护标识
  _value:null,//resolve函数执行的时候，异步得到的结果
  _deferreds:new Handler(onFulfilled, onRejected, res)//存放通过then注册的函数以及返回的❤️Promise实例对象的一个Handler对象； 
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

此时的promise实例对象，关注对比p这个实例对象的变化，可以看到resolve之后，相当于将异步的结果给到了p这个Promise实例对象的`_value`属性值，同时改变这个p的状态`_state`为1  ==> fulfilled

```javascript
p =>{
  _deferredState:1,//deffer的状态
  _state:1,//每个promise对象的状态维护标识
  _value:'someData',//resolve函数执行的时候，异步得到的结果
  _deferreds: new Handler(onFulfilled, onRejected, res)
}
```

####2.4  finale(self);//最后处理这个promise对象 

这里可以看到，当处理最后一个promsie的时候，最后一个promsie对象由于没有then注册函数，所以该promise对象_deferredState值为0，处理它的时候，不会有任何操作

```javascript
function finale(self) {
  //进入这个if语句
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    //每处理一个promise实例对象，该对象上的包含 onFulfilled  onRejected res的deferreds数组都会置空；
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
    //这个函数只有当 _state的值为 1 fulfilled. 2  rejected 的时候才会执行
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

**resolve(deferred.promise, ret);中的ret值就是then中注册函数的返回值，这里就是一些简单的字符串'someData1' 'someData2'**

```javascript
promise实例对象==> 异步成功 ==> 该实例对象的resolve(data) ==> 
//newValue为异步得到的数据，第一次是'someData'这个字符串，下一次就是then中注册函数的返回值ret,还是字符串'someData1' 'someData2' 
resolve(self,newValue)     ==>		    <== == == == ==  == ==  ||
																^
==>handle(self,deffer) 											||
																^	
==>handleResolved处理then中注册的函数；							  ||
																^
==>接着处理下一个promis==>resolve(deferred.promise, ret);    ===> ||

```

```javascript
 var p = {
        _deferredState:1,//deffer的状态
        _state:0,//每个promise对象的状态维护标识
        _value:null,//resolve函数执行的时候，异步得到的结果
        _deferreds:{ 
            onFulfilled:onFulfilled,
            onRejected:onRejected,
            promise:{//这里是  new Promise(noop)
                _deferredState:1,
                _state:0,
                _value:null,
                _deferreds:{//通过then注册的执行对象
                    onFulfilled:onFulfilled,
                    onRejected:onRejected,
                    promise:{//这里是  new Promise(noop)
                        _deferredState:1,
                        _state:0,
                        _value:null,
                        _deferreds:{//通过then注册的执行对象
                            onFulfilled:onFulfilled,
                            onRejected:onRejected,
                            promise:{//这里是  new Promise(noop)
                                _deferredState:1
                                _state:0,
                                _value:null,
                                _deferreds:null
                            },
                        }
                    }
                }
            }
        }
    };
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
promise实例对象 ==> 异步成功 ==> 该实例对象的resolve(data) ==> 
//newValue为异步得到的数据，这里第一次是 'someData'这个字符串，下一次就是then中注册函数的返回值,这里就是runAsync返回的promise对象
resolve(self,newValue)    ==>		    <== == == == ==  == ==  ||
																^
==>handle(self,deffer) 											||
																^
==>handleResolved处理then中注册的函数；							  ||
																^
==>接着处理下一个promise==>resolve(deferred.promise, ret);    ===> ||
```

整个promise链如下

```javascript
 var p = {
        _deferredState:1,//deffer的状态
        _state:0,//每个promise对象的状态维护标识
        _value:null,//resolve函数执行的时候，异步得到的结果
        _deferreds:{ 
            onFulfilled:onFulfilled,
            onRejected:onRejected,
            promise:{ //通过引用的地址改变，这里是runAsync返回的promise
                _deferredState:1,
                _state:0,
                _value:null,
                _deferreds:{//由于runAsync中没有执行then注册，这里将new Promise(noop) 通过then注册的对象引用拿到；
                    onFulfilled:onFulfilled,
                    onRejected:onRejected,
                    promise:{//通过引用的地址改变，这里是runAsync返回的promise
                        _deferredState:1,
                        _state:0,
                        _value:null,
                        _deferreds:{
                            onFulfilled:onFulfilled,
                            onRejected:onRejected,
                            promise:{//通过引用的地址改变，这里是runAsync返回的promise
                                _deferredState:1,
                                _state:0,
                                _value:null,
                                _deferreds:null
                            },
                        }
                    }
                }
            }
        }
    }
```

#### 3.3 以上两者有何差异？

* 相同点：每个then返回的新的promise对象是一样的，都是通过then函数中的定义的返回值：var res = new Promise(noop);
* 不同点：在handleResolved中，resolve(deferred.promise, ret);中的ret的值不同，ret就是每个then中注册的函数的返回值，对比以上两种情况，一个返回基本数据类型，一个返回Promise对象，接下来重点看下then中注册的函数返回promise对象的情况**（注意这个和then链式调用的promise对象不是一个）**

```javascript
 // resolve(deferred.promise, ret);注意这个self，传入的是deferred这个对象中promise这个引用地址；
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
      self._state = 3;
      self._value = newValue;
      finale(self);
      //执行到这里,结束；
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
//对于then中注册的函数返回一个promise对象的情况，下面就不会执行
  self._state = 1;
  self._value = newValue;
  finale(self);
}
```

self ==> deferred.promise

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

**注意在这里通过对promise链进行引用的改变，从而使异步的执行看起来和同步是一样的；**

handle函数有两个作用，

* 第一：改变promise链的引用，将原本返回的 new Promsie(noop) 改为ret(then中注册函数返回的promise)
* 第二：将原本new Promsie(noop) 上面通过then注册deferred对象，给到ret响应的属性

```javascript
function handle(self, deferred) {
  while (self._state === 3) {
    //这里一直循环直到取到我们返回的promsie对象，也就是上面的ret,即每个runAsync函数的返回值；
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  //将runAsync的返回的promise对象中_deferredState设置为 1；
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      //执行到这里结束
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

