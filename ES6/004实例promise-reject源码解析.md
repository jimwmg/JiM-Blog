---
title: 实例promise -reject源码解析
date: 2017-12-19
categories: ES6
tags : promise
---

**首先移步：《实例promise-resolve源码解析》**

[实例promise-resolve源码解析](https://github.com/jimwmg/JiM-Blog/tree/master/ES6)

### 1 看下每个deferred对象

```javascript
function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}
```

### 2 看下处理链式promise的流程：

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

链式promise对象：

```javascript
 var p = {
        _deferredState:1,//deffer的状态
        _state:0,//每个promise对象的状态维护标识
        _value:null,//resolve函数执行的时候，异步得到的结果
        _deferreds:{ 
            onFulfilled:onFulfilled,//then中注册了则为注册的函数，没有的话，则为null
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

**对于onFulfilled和onRejected的值，如果then中注册了对应的函数，那么就有该值，否则为null;**

### 3 看下handleResolved函数的实现

```javascript

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      //如果promise链上某个promise对象没有注册onRejected函数，那么就会继续类似于冒泡，找下一个promise对象上的onRejected函数
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
```

### 4 实际案例

```javascript
function runAsync(){
  let p = new Promise(function(resolve,reject){
    console.log('exec');
    setTimeout(function(){
      resolve('someData');
      // reject('someData');
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
      resolve('someData2');
      // reject('error2')
    },2000);
  })
}
```

* 只在最后捕获错误

```javascript
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return runAsync1()
}).then(function(data){
  //这里因为runAsync1中执行的是reject,所以不会执行这个函数，所以也就不会有异步2 的执行；
  console.log(data);
  return runAsync2()
}).then(function(data){
  console.log(data);
  // return 'someData3'
}).catch(function(error){
  console.log('lastCatch',error)
})
console.log('同步执行');
```

控制台输出如下：

```
exec
同步执行
someData
异步1
lastCatch error1
```

**从handleResolved源码中可以看到，如果某个promise中没有注册onRejected函数，那么会进入cb===null分支，类似于冒泡将错误抛出**

* 中途某个promise捕获，则需要在该promise上的then中注册onRejected函数

```javascript
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return runAsync1()
}).then(function(data){
  console.log(data);
  return runAsync2()
},function(data){ //这里then函数中注册了onRejected函数，没有返回值
  console.log('catch1',data)
}).then(function(data){
  console.log(data);
  // return 'someData3'
}).catch(function(error){
  console.log('lastCatch',error)
})
console.log('同步执行');
```

控制台输出如下

```javascript
exec
同步执行
someData
异步1
catch1 error1
undefined //注意这个undefined是如何来的，
```

**从handleResolved源码中可以看到，如果某个promise中注册了onRejected函数，那么该函数的返回值ret传递给下一个promise对象进行resolve(deferred.promise, ret)，**

因为捕获错误的函数，没有函数值，而函数返回值是undefined,所以会将undefined给到resolve(deferred.promise, ret)中的ret,下一个promise对象将会被resolve,同时执行该promise对象上的通过then注册的onFulfilled函数;

**所以在用promise的时候，**

* **一般都是建议在then中只注册一个onFulfilled函数，最后进行catch注册一个捕获错误的函数，防止中途某个promise错误处理之后，后面的promise也将会继续resolve；这样如果中途某个promise被reject,那么后面的promise依然会接着resolve;**；
* **当然，如果想在中途某个promise被reject之后，还想执行该promise被resolve的异步请求，可以直接在该promise的onFulfilled和onRejected中都返回一个异步请求的promise**

```javascript
var promise = runAsync();
promise.then(function(data){
  console.log(data);
  return runAsync1()
}).then(function(data){
  console.log(data);
  return runAsync2()
},function(data){
  console.log('catch1',data);
  return 'erroeInfo'  //这里增加一行代码
}).then(function(data){
  console.log(data);
  // return 'someData3'
}).catch(function(error){
  console.log('lastCatch',error)
})
console.log('同步执行');
```

控制台输出

```
exec
同步执行
someData
异步1
catch1 error1
erroeInfo
```



