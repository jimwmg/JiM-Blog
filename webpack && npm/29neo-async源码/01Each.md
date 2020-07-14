



webpack 核心源码依赖 neo-async
---

### 模块内全局变量
```javascript
var noop = function noop() {};
var throwError = function throwError() {
  throw new Error('Callback was already called.');
};
var obj = 'object';
var func = 'function';
var isArray = Array.isArray;
var nativeKeys = Object.keys;
var nativePush = Array.prototype.push;
var iteratorSymbol = typeof Symbol === func && Symbol.iterator;
```
### each ：async.each(array, iterator, callback);

可迭代属性【都会】被遍历器迭代，done【第一个参数不为空】或者【所有可迭代属性迭代完毕】或者【第二个参数为false】的时候会执行 callback；

```javascript

async.each(array,function(num, done) {
  setTimeout(function() {
    // done(null, num*10);
    order.push(num);
    console.log(num)
    done({},num);
  }, num * 2000);
} , function(err, res) {
  console.log('each',err,res); // undefined;
  console.log(order); // [1, 2, 3]
});
/*
a
each {} undefined
[ 'a' ]
b
c
*/
```

理解`once `和 `onceOnly`

```javascript
function noop(){console.log('noop')}
function once(func){
  return function(err,res){
    var fn = func;
    func = noop;
    fn(err,res)
  }
}
let callback = once(function(){
  console.log('test')
});
callback();//test
callback();//noop
```

```javascript
var each = createEach(arrayEach, baseEach, symbolEach);
//once 每次执行都会生成新的作用域链，传入的 func 参数只会执行一次，再次执行的时候 fn 就是 noop了
function once(func) {
  //核心在这个 func 闭包变量这里
  return function(err, res) {
    var fn = func;
    func = noop;//当这个函数第二次被执行的时候
    fn(err, res);//这个函数就已经被指向 noop 函数了，不会再执行 callback 
  };
}
//onlyOnce
function onlyOnce(func) {
  //核心在这个 func 闭包变量这里
  return function(err, res) {
    var fn = func;
    func = throwError;
    fn(err, res);
  };
}

function arrayEach(array, iterator, callback) {
  var index = -1;
  var size = array.length;
 //具名函数 length  属性表示该函数的形参数量
 //iterator 中的异步操作
  if (iterator.length === 3) {
    while (++index < size) {
      iterator(array[index], index, onlyOnce(callback));
    }
  } else {
    while (++index < size) {
      iterator(array[index], onlyOnce(callback));
    }
  }
}

/**
 * @private
 */
function baseEach(object, iterator, callback, keys) {
  var key;
  var index = -1;
  var size = keys.length;

  if (iterator.length === 3) {
    while (++index < size) {
      key = keys[index];
      iterator(object[key], key, onlyOnce(callback));
    }
  } else {
    while (++index < size) {
      iterator(object[keys[index]], onlyOnce(callback));
    }
  }
}

/**
 * @private
 可迭代对象 迭代器 每次调用 next 会返回 { value: "a", done: false } done属性表示是否遍历完毕
 */
function symbolEach(collection, iterator, callback) {
  var iter = collection[iteratorSymbol]();
  var index = 0;
  var item;
  if (iterator.length === 3) {
    while ((item = iter.next()).done === false) {
      iterator(item.value, index++, onlyOnce(callback));
    }
  } else {
    while ((item = iter.next()).done === false) {
      index++;
      iterator(item.value, onlyOnce(callback));
    }
  }
  return index;
}
function createEach(arrayEach, baseEach, symbolEach) {
    return function each(collection, iterator, callback) {
      callback = once(callback || noop);
      var size, keys;
      var completed = 0;
      if (isArray(collection)) {
        size = collection.length;
        arrayEach(collection, iterator, done);
      } else if (!collection) {
      } else if (iteratorSymbol && collection[iteratorSymbol]) {
        size = symbolEach(collection, iterator, done);
        size && size === completed && callback(null);
      } else if (typeof collection === obj) {
        keys = nativeKeys(collection);
        size = keys.length;
        baseEach(collection, iterator, done, keys);
      }
      if (!size) {
        callback(null);
      }
 // 可迭代对象中的所有 key-value 还是会照样经过迭代器执行，
      function done(err, bool) {
        if (err) {
          callback = once(callback);//如果出错，这里callback 还是会缓存原来的函数，原来的函数中可以执行到传入的原始的callbcak
          callback(err);
        } else if (++completed === size) {
          callback(null);
        } else if (bool === false) {
          callback = once(callback);
          callback(null);
        }
      }
    };
  }
```