---
title:  fetch请求(promise的封装)
date: 2017-06-20 12:36:00
categories: ES6
tags : fetch
comments : true 
updated : 
layout : 
---

## 1 一般的fetch用法

```javascript
fetch(url,option).then(response=>{
  //handle HTTP response
}).then(error=>{
  //handle HTTP error
})
```

具体的栗子如下

```javascript
fetch(url, { //option
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "same-origin"
}).then(function(response) {
  response.status     //=> number 100–599
  response.statusText //=> String
  response.headers    //=> Headers
  response.url        //=> String

  return response.text()
}, function(error) {
  error.message //=> String
})
```

## 2 参数解析 

### url 地址: './path'

### option :

- `method` (String) - HTTP request method. Default: `"GET"`
- `body` (String, [body types](https://github.github.io/fetch/#request-body)) - HTTP request body
- `headers` (Object, [Headers](https://github.github.io/fetch/#Headers)) - Default: `{}`
- `credentials` (String) - Authentication credentials mode. Default: `"omit"``"omit"` - don't include authentication credentials (e.g. cookies) in the request`"same-origin"` - include credentials in requests to the same site`"include"` - include credentials in requests to all sites


### Response

Response represents a HTTP response from the server. Typically a Response is not constructed manually, but is available as argument to the resolved promise callback.

#### Properties

- `status` (number) - HTTP response code in the 100–599 range
- `statusText` (String) - Status text as reported by the server, e.g. "Unauthorized"
- `ok` (boolean) - True if `status` is HTTP 2xx
- `headers` ([Headers](https://github.github.io/fetch/#Headers))
- `url` (String)

#### Body methods 注意每个方法返回的都是一个Promise对象,

Each of the methods to access the response body returns a Promise that will be resolved when the associated data type is ready.

- `text()` - yields the response text as String
- `json()` - **yields the result of `JSON.parse(responseText)`**
- `blob()` - yields a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- `arrayBuffer()` - yields an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- `formData()` - yields [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) that can be forwarded to another request

#### Other response methods

- `clone()`
- `Response.error()`
- `Response.redirect()`

### 3 从源码角度理解fetch

首先得知道Promise是对象的使用

[ES6Promise阮一峰](http://es6.ruanyifeng.com/#docs/promise)

[ES6PromiseGIthub源码](https://github.com/jimwmg/promise/blob/master/src/core.js)

```javascript
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
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

module.exports = Promise;

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

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  //注意这里 then方法返回的是一个新的Promise实例对象，并不是原来的哪个；
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  //这里将then中的回调函数注册给promsie对象；
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
//在这里，以及通过then注册的函数，接受从服务端请求回来的数据，作为参数执行；
function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    //这里执行注册的函数，传入的参数就是上一个then注册的函数的返回值；
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
//这里注意  then链式注册第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。原因就在这里
//resolve(promise,newValue)，将newValue给到传递进来的promise._value属性；下面有源码
//handleResolved(self,deferred),cb为通过then注册的回调函数，var ret = tryCallOne(cb, self._value);将promise._value给到cb函数
//resolve(deferred.promise, ret);再次将通过then注册的函数的返回值给到新的promise对象，promis._value
//每个promise上都有上一个then注册的回调函数的结果，将回调函数的结果绑定在新的promise._value属性上；

function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
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
  self._state = 1;
  //这里
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    Promise._onReject(self, newValue);
  }
  finale(self);
}
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

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  //注意这里，以及下面new Promise(function(resolve,rejiect){ });这里的参数其实就是下面tryCallTwo后面两个参数；
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    //如果异步请求成功了，resolve函数执行，该函数接受promise实例对象和异步请求返回的数据；
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
     //如果异步请求失败了，reject函数执行，该函数接受promise实例对象和错误信息；
    reject(promise, reason);
  });
  //*那么在那里判断的异步请求失败或者成功的呢？就是在我们new Promise(function(,rejectresolve){ if(异步成功){resolve(value)}else{reject(value)}})*／
  //下面的例子对比着看下更加直观；
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}
```

对比着下面这个最简单例子以及源码，相信对Promise的使用你已经了如指掌；

```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
//当readyState状态改变的时候，都会执行client.onreadystatechange这个函数，所以下面函数this指向的是client对象，也就是XMLHttpRequest的实例对象；
    function handler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        //这个resolve函数就是上面源码中的tryCallTow函数中第二个参数；
        //this.response 是后台返回的结果
        resolve(this.response);
      } else {
        //这个reject函数就是上面源码中tryCallTwo函数中第三个参数；
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

其实为什么通过then链式注册的函数都会得到执行呢？（在异步请求成功的情况下）

其实Promise源码内部实现了一个闭环，每个promise上通过then注册的函数，都会注册到对应的promise对象上；也就是说：（划重点了）一个promise对象，注册两个个回调函数（成功的`_onHandle`，失败的`_onReject`)，绑定一个回调函数需要接受的参数`_value`；当我们new Promise(funtion(reslove,reject){ }) ;注册了如下闭环执行链

异步成功的时候：

```javascript
new Promise(fn) ==> doResolve(fu,promise) ==> then（func1) ==> then(func2);
完成promise链式注册之后；内部注册流程如下：
resolve(,promise,value) ==> finale(promise) ==> handle(promise, promise.deferred) ==>handleResolved(promise,promise.deferred) ==>resolve(deferred.promise, ret);
```

* value就是异步返回的数据，ret就是上一个then执行的结果；

* 在handleResolved中开始执行通过then注册的回调函数；

* 回调函数以及回调函数的参数都是从每一个不同的promise对象上取的；

* 回调函数是通过handle函数注册一个deferred属性，该属性指向 通过new Handler(onResolve,onReject)生成的对象；

* 参数来自于异步请求的结果或者then注册的函数执行的结果，

  resove(promise,value) resolve(deferred.promise, ret)是在这里注册给每一个promise对象的_value属性的；

接下来看下[fetch源码](https://github.com/jimwmg/fetch-Source-Code/blob/master/node-fetch/index.js)。

对应的地址中还有body.js,解释了response.json();response.text()等API；

```javascript
function Fetch(url, opts) {

	// allow call as function
	if (!(this instanceof Fetch))
		return new Fetch(url, opts);

	// allow custom promise
	if (!Fetch.Promise) {
		throw new Error('native promise missing, set Fetch.Promise to your favorite alternative');
	}

	Body.Promise = Fetch.Promise;

	var self = this;

	// wrap http.request into fetch
	return new Fetch.Promise(function(resolve, reject) { })
  //可以看到Fetch(url,options) 返回的是一个promise对象，而在Fetch.Promise(function(resolve,reject){ })   中进行了Promise接受的参数中进行了异步请求和其他接口的处理，具体的读者可以看上方源码地址；

```

用例

```javascript
Fetch(`${target}` + type, {
  method: "POST",
  mode: "cors",
  credentials: "include",
  headers: {
       "Content-Type":"multipart/form-data;boundary=123"
       "Content-Type":""
  },
  body: data.formData
}).then(
	//	请求成功
).then(
//请求失败
)
```



