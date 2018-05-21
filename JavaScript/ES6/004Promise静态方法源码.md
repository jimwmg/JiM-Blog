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

### 1 Promise.resolve( )

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

### 2 Promise.reject( )

```javascript
Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};
```

`Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数

```javascript
var error = {error:'two'}
setTimeout(function () {
  console.log('three');
}, 0);

Promise.reject(error).catch(function (data) {
  console.log(data);
  console.log(data == error)/true
});
console.log('one');
//one 
//{error:two}
//true
//data
```

###3 Promise.done( ). 总是处于回调链的尾端

Promise 对象的回调链，不管以`then`方法或`catch`方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。因此，我们可以提供一个`done`方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

```javascript
Promise.prototype.done = function (onFulfilled, onRejected) {
  console.log('done',this);//为了便于观察，添加测试代码
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      console.log('readyToThrow',err)//为了便于观察，添加测试代码
      throw err;
    }, 0);
  });
}
```

```javascript
function runAsync() {
  let p = new Promise(function (resolve, reject) {
    console.log('exec');
    setTimeout(function () {
      reject('someData');
      // reject('someData');
    }, 2000);
  });
  return p;
};
```

* done不接受参数,相当于增加了一层回调链

```javascript
runAsync().then(function () { }, function (data) {
  console.log(data);
  console.log(UNDEFINED);
}).done();
/**
exec
done Promise {<pending>}
someData
readyToThrow ReferenceError: UNDEFINED is not defined
Uncaught ReferenceError: UNDEFINED is not defined(抛出错误)
**/
```

* done接受参数,这个相当于增加了两层回调链

```javascript
runAsync().then(function () { }, function (data) {
  console.log(data);
  console.log(UNDEFINED);
}).done(function(data){
  console.log('resolveDone',data)
},function(data){
  console.log('rejectDone',data);
})
/***
exec
done Promise {<pending>}
someData
rejectDone ReferenceError: UNDEFINED is not defined
*/
```

即使done中的回调函数发生了错误也会被抛出

```javascript
runAsync().then(function () { }, function (data) {
  console.log(data);
  console.log(UNDEFINED);
}).done(function(data){
  console.log('resolveDone',data)
},function(data){
  console.log('rejectDone',data);
  console.log(SOMEERROR)
})
/***
exec
done Promise {<pending>}
someData
rejectDone ReferenceError: UNDEFINED is not defined
readyToThrow ReferenceError: reject is not defined
ReferenceError: SOMEERROR is not defined
*/
```

### 4 Promise.finally( )

相当于增加了一层Promsie回调链，返回一个新的promise对象实例

```javascript
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function (data) {
      console.log(data)//增加测试代码
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      console.log('readyToThrow')
      throw err;
    });
  });
};
```

```javascript
function runAsync() {
  let p = new Promise(function (resolve, reject) {
    console.log('exec');
    setTimeout(function () {
      resolve('someData')
    }, 2000);
  });
  return p;
};
runAsync().then(function (data) { console.log(data) })
		  .finally(function () {
            console.log('finally');
            return 'retFinally'
          });
/***
exec 
someData
finally 
retFinally

*/
```

### 5 Promise.all( )
主要是根据对传入的每个参数进行处理，根据 remaining 的值判断是否处理完所有的promsies值，来进行判断是否resolve  Promsie.all 返回的promsie实例对象的状态；
```javascript
Promise.all = function (arr) {
  //1 得到传进来的参数，转化为数组
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    //2 remaining用来标识是否所有的请求都成功了
    var remaining = args.length;
    for (var i = 0; i < args.length; i++) {
      //3 对所有的promsies数组中每个元素执行res方法
      res(i, args[i]);
    };
    //res方法执行两个作用
    //1 给每个promise注册onFulfilled和onRejected函数
    //2 注意传进去的onRejected函数，这就解释了为什么当某一个promise reject的时候Promise.all(promises)注册的onRejected函数会执行
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._state === 3) {
            val = val._value;
          }
          if (val._state === 1) return res(i, val._value);
          if (val._state === 2) reject(val._value);
          //Promise.all(promsies)执行的时候
          val.then(function (val) {
            res(i, val);
          }, reject);
          //第一轮给每个promises数组中的元素注册函数执行到此结束；
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      //这里当promises数组中每一个promsie状态变为resolved的时候，会执行res(i,val)==>res(i,val._value)==>args[i] = val 此时将异步请求成功的结果放入args数组中
      // 这里处理当传入Promise.all(['a','b','c']) 不是promise的时候
      args[i] = val;
      //只有所有的promises数组中的每一个promise都异步成功了，才会进入这个if语句，进而resolve这个Promise.all(promsies)返回的promsie实例对象
      //只要有一个promsies数组中的promsie没有异步成功，就会reject这个Promise.all(promises)返回的promsie实例对象
      if (--remaining === 0) {
        resolve(args);
      }
    }
  });
};
```

```javascript
const p = Promise.all([p1, p2, p3]);
```

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。

（1）只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

（2）只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

```javascript
var idList = [1, 2, 3, 4, 5];
function getAllIdList(idList) {
  return Promise.all(idList.map((id)=>runAsync(id)))
    .then(function(data){
    console.log('data:',data) // data是所有异步的结果组成的数组
  }).catch(function(reason){
    console.log('reason:',reason)
  })
}
getAllIdList(idList)
```

* 1 有一个promise异步失败

```javascript
function runAsync(id) {
  return new Promise(function (resolve, reject) {

    //异步请求失败
    if (id == 3) {
      //根据id进行的异步请求
      setTimeout(() => {
        //这个reject的执行会触发这个promsie上注册的onRejected函数，也就是Promise.all源码里这里注册的，从而直接改变Promsie.all(promsies)返回的promise对象的状态
        /*val.then(function (val) {
            res(i, val);
          }, reject);**/
        reject('errorData');
      }, 2000);
    }
    //异步请求成功
    if (id !== 3) {
      //根据id进行的异步请求
      setTimeout(() => {
        resolve('someData');
      }, 2000);
    }

  });
};
```

这里会执行`Promise.all(idList.map((id)=>runAsync(id)))`中注册的onRejected函数；

控制台输出如下

```
reason:errorData
```

* 2 所有的promise都成功

```javascript
function runAsync(id) {
  return new Promise(function (resolve, reject) {
    //异步请求成功
    if (id !== 6) {
      //根据id进行的异步请求
      setTimeout(() => {
        resolve('someData');
      }, 2000);
    }

  });
};
```

控制台输出如下

```
data: ["someData", "someData", "someData", "someData", "someData"]
```

### 6 Promise.race( )

```javascript
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

```javascript
Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};
```

```javascript
function setTime(n){
  return Math.floor(1000*Math.random()*n)
}
var idList = [1, 2, 3, 4, 5];
function runAsync(id) {
  return new Promise(function (resolve, reject) {
    //异步请求失败
    if (id == 3) {
      //根据id进行的异步请求
      setTimeout(() => {
        reject('errorData'+id);
      },setTime(id) );
    }
    //异步请求成功
    if (id !== 3) {
      //根据id进行的异步请求
      setTimeout(() => {
        resolve('someData'+id);
      },setTime(id) );
    }

  });
};
function getAllIdList(idList) {
  return Promise.race(idList.map((id)=>runAsync(id)))
    .then(function(data){
    console.log('data',data)
  }).catch(function(reason){
    console.log('reason',reason)
  })
}
getAllIdList(idList)
```

