---
title:  Promise上静态方法的分析
date: 2017-12-23 
categories: ES6
tags : promise
---

```javascript
var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._noop);
  p._state = 1;
  p._value = value;
  return p;
}
```

### 1 Promise.resolve

```javascript
Promise.resolve = function (value) {
  //1 如果参数是一个promise实例对象，那么直接返回这个实例对象；
  if (value instanceof Promise) return value;
  //2 如果参数是基本数据类型，那么就返回基本数据类型resolve之后的实例对象；
  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;
  //3 如果参数是一个对象或者一个函数 
  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  //4 其他情况直接返回
  return valuePromise(value);
};
```

看一个小例子

```javascript
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
//为什么不是 two one three 
```

从promise源码中可以看到Promise.resolve() 返回的结果p

```javascript
p =>{
  _deferredState:0,//deffer的状态，代表的应该是 _deferreds 的类型，1 是 single，2 是 Array
  _state:1,//每个promise对象的状态维护标识
  _value:undefined,//resolve函数执行的时候，异步得到的结果
  _deferreds:null  
}
```

接着Promise.resolve().then( function () { } )

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
  //也不会进入这里，因为 p._state === 1 ;
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

注意这里的asap函数，可以理解为它将then中注册的函数放入microtasks中，并不是直接执行，而是由事件循环机制控制执行的；（类比setTimeout)

promise ==> then ==> asap ==> 事件循环机制；在看上面的例子，就应该清楚了很多；

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

### 2 Promise.reject

```javascript
Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};
```

