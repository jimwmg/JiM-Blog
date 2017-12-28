---
title:  seajs模块加载
date: 2017-12-15 
categories: seajs
tags : seajs
---

### 1 代码如下：

```javascript
seajs.use(ids,callback);
define(factory);
```

客户端代码

index.html

```html
<body>
    <script>
    seajs.use(['./a.js','./b.js'],function(a,b){
        console.log('index1');
    })    
        
    </script>
</body>
```

服务端

a.js

```javascript
console.log('a1');
define(function(require,exports,module){
    console.log('inner a1');
    require('./c.js')
});
console.log('a2')
```

b.js

```javascript
console.log('b1');
define(function(require,exports,module){
    console.log('inner b1');
});
console.log('b2')
```

c.js

```javascript
console.log('c1');
define(function(require,exports,module){
    console.log('inner c1');
});
console.log('c2')
```

以上文件（模块）本质其实就是

```javascript
console.log();
define(factory);
console.log();
```

其中define函数执行的时候，会通过将factory.toString() 解析出来该模块的依赖，然后在该模块的onload函数中再去加载该模块的依赖；

控制台输出

```
a1
a2
b1
b2
c1
c2
inner a1
inner c1 
inner b1
index
```

**注意对于执行factory.toString()分析依赖的时候，require进来的文件会提前并行加载，而通过require.async的文件不会提前并行加载，而是会在执行factory的时候异步加载**

也就是说define函数在分析依赖的时候，不会将require.async中的依赖提前加载

修改下a.js

```javascript
console.log('a1');
define(function(require,exports,module){
    console.log('inner a1');
    require.async('./c.js')
});
console.log('a2')
```

控制台输出如下

```
a1
a2
b1
b2
inner a1
inner b1
index
c1
c2
inner c1
```

如果在改下index.html

```javascript
seajs.use(['./a.js','./b.js'],function(a,b){
  console.log('index1');
  setTimeout(function(){
    console.log('index2')
  },2000)
})   
```

输出如下

```javascript
a1
a2
b1
b2
inner a1
inner b1
index
c1
c2
inner c1
index2
```

看下require.async源码,其实就是重新执行了一下Module.use函数，和seajs.use执行的流程是一样的；

```javascript
  require.async = function(ids, callback) {
    Module.use(ids, callback, uri + "_async_" + cid())
    return require
  }
```



### 2 加载过程（script  async 即该文件下载完毕就直接，没有先后顺序）

客户端执行,开始 

==>seajs.use(ids,callback)

==>Module.use(ids,callback,uri)

==>Module.get(ids,uri)

==>得到主模块mod

==>mod.load()

==>循环加载(创建script) ids (经过解析的路径)对应的模块

==>模块加载完毕就会执行所加载的内容(这里就是对应a.js. b.js c.js中的内容) 

==>自上而下一行行执行加载的文件

==> 加载完毕之后执行该模块的onload函数 

==>该函数又会接着循环加载(创建script) 该模块依赖的文件（通过define函数解析出来该模块的依赖）

==>重复上面的过程 

==>当所有依赖的模块全部加载完毕(根据所有模块的状态判断是否加载完毕)

 ==>执行每一个模块中定义的factory

==>导出作为seajs.use中的callback回调函数的参数

==>完毕

### 3 看下主模块的代码

```javascript
seajs.use(ids,callback);
```

```javascript
seajs.use(['./a.js','./b.js'],function(a,b){
  console.log('index1');
})  
```

```javascript
seajs.use = function(ids, callback) {
  //这里data.cwd在变量声明中赋值过了；
  Module.use(ids, callback, data.cwd + "_use_" + cid())
  return seajs
}
```

```javascript
Module.use = function (ids, callback, uri) {
  //如果在cachedMods数组中有uri这个模块，就直接返回该模块，如果没有则创建新的模块
  var mod = Module.get(uri, isArray(ids) ? ids : [ids])
  //mod就是下面这个构造函数new之后的返回值；
  /*
 mod = {uri:uri,dependencies:['a.js','b.js','c.js'],deps:{},status:0,_entry:[]}
  **/
/*
function Module(uri, deps) {
  this.uri = uri
  this.dependencies = deps || [];//[ids]=>['a.js','b.js','c.js']
  this.deps = {} // Ref the dependence modules
  this.status = 0

  this._entry = []
}
**/
  mod._entry.push(mod)
  mod.history = {}
  mod.remain = 1

  mod.callback = function() {
    var exports = []
    var uris = mod.resolve()
//这里给exports数组赋值为从cachedMods数组中每个模块执行后的结果
    for (var i = 0, len = uris.length; i < len; i++) {
      //每个模块的exec执行的返回值有两种可能
      //第一，如果define传入的不是一个函数，那么该模块exec的返回值就是传入define的值，可以是对象，也可以是其他数据类型
      //第二，如果define传入的是一个函数，那么该模块exec的返回值就是传入define函数中给exports添加的对象；
      exports[i] = cachedMods[uris[i]].exec();
      //这里才是真正的执行define(factory)中的factory;
    }

    if (callback) {
      //这里apply函数会将exports数组一个一个传给callback
      callback.apply(global, exports)
    }
/**又对这个对象进行了操作
 mod = {uri:uri,dependencies:['a.js','b.js','c.js'],deps:{},status:0,_entry:[mod],history:{},remain:1,callback:f }

*/
    delete mod.callback
    delete mod.history
    delete mod.remain
    delete mod._entry
  }
//最后执行这个入口模块的load函数
  mod.load()
}
```

在cachedMods中会有所有模块的信息，每一个文件(模块)在seajs模块系统中就是一个对象

```javascript
{
  deps:deps,
  uri:uri,
  factory:factory,
  ......
}
```

当所有的依赖加载完毕之后，就会执行主模块的上的callback

```javascript
Module.use = function (ids, callback, uri) {
//  .......
  //执行这个函数，最后会执行传入seajs.use中的callback,并且给其传参为其依赖的模块的导出对象；
  mod.callback = function() {
    var exports = []
    var uris = mod.resolve()
    //这里给exports数组赋值为从cachedMods数组中每个模块执行后的结果
    for (var i = 0, len = uris.length; i < len; i++) {
      //每个模块的exec执行的返回值有两种可能
      //第一，如果define传入的不是一个函数，那么该模块exec的返回值就是传入define的值，可以是对象，也可以是其他数据类型
      //第二，如果define传入的是一个函数，那么该模块exec的返回值就是传入define函数中给exports添加的对象；
      exports[i] = cachedMods[uris[i]].exec();
      //这里才是真正的执行define(factory)中的factory;
    }

    if (callback) {
      //这里apply函数会将exports数组一个一个传给callback
      callback.apply(global, exports)
    }
  }
```

上面说到执行某个模块的exec方法的时候，就会执行定义该模块define(factory)中的factory函数，接下来深入看下exec函数的实现

```javascript
// Execute a module
Module.prototype.exec = function () {
  var mod = this
  //[modulea,moduleb,modulec]
  // When module is executed, DO NOT execute it again. When module
  // is being executed, just return `module.exports` too, for avoiding
  // circularly calling
  if (mod.status >= STATUS.EXECUTING) {
    return mod.exports
  }

  mod.status = STATUS.EXECUTING

  if (mod._entry && !mod._entry.length) {
    delete mod._entry
  }

  //non-cmd module has no property factory and exports
  if (!mod.hasOwnProperty('factory')) {
    mod.non = true
    return
  }

  // Create require
  var uri = mod.uri
  //定义define函数中的作为参数的factory的参数define(function(require,exports){})中的require函数；
  function require(id) {
    var m = mod.deps[id] || Module.get(require.resolve(id))
    if (m.status == STATUS.ERROR) {
      throw new Error('module was broken: ' + m.uri)
    }
    return m.exec()
  }

  require.resolve = function(id) {
    return Module.resolve(id, uri)
  }

  require.async = function(ids, callback) {
    Module.use(ids, callback, uri + "_async_" + cid())
    return require
  }

  // Exec factory  这个函数就是define中传入的函数；
  var factory = mod.factory
  //这里得到define函数中传入的函数的执行之后的返回值；
  //如果传入的不是函数，那么直接返回传入的值；
  //将这些返回值所谓模块的exports属性的值；
  var exports = isFunction(factory) ?
      //先给mod.exports = {} 
      factory.call(mod.exports = {}, require, mod.exports, mod) :
  factory
  //如上所示，define函数中的传入的函数没有返回值，所以exports为undefined;此时在将其赋值为mod.exports；
  //如果define函数中传入一个对象或者其他数据类型，那么该这些数据就是直接的返回值；
  if (exports === undefined) {
    exports = mod.exports
  }

  // Reduce memory leak
  delete mod.factory

  mod.exports = exports
  mod.status = STATUS.EXECUTED

  // Emit `exec` event
  emit("exec", mod)

  return mod.exports
}
```

先看这行代码：就是在这里执行了模块define(factory)中的factory,我们可以看到其中的参数都是在exec函数中定义的，比如require,mod.exports

如果在define(factory)中factory函数中执行了require(''),如上 a.js

```javascript
console.log('a1');
define(function(require,exports,module){
    console.log('inner a1');
    require('./c.js');//看上面require函数的实现，执行这行代码的时候，就会执行c模块的exec函数，也就是说此时执行c模块的define(factory)中的factory函数；
});
console.log('a2')
```

```javascript
//这里执行factory
var exports = isFunction(factory) ?
      //先给mod.exports = {} 
      factory.call(mod.exports = {}, require, mod.exports, mod) :
  factory
```

### 4 require和require.async的区别

在一个模块中

```javascript
define(function(require,exports,module){
  require('somepath');
});
define(function(require,exports,module){
  require.async('somepath');
})
```

* 加载阶段不同：require的模块会提前加载；而requre.async的模块会在seajs.use(ids,callback)中的callback执行的时候才会加载；

原因分析：define函数在将factory.toString()之后，分析factory的时候会将require的模块作为依赖提前加载；而不会提前加载require.async的模块；

而在主模块的callback执行的时候，会执行每个依赖模块中的define(factory)中的factory函数，执行该函数的时候，那么就是执行到require.async();

* 执行结果不同

当执行主模块的mod.callback函数的时候，会执行各个模块的define(factory)中的factory函数，

对于require('c.js')其结果是执行了模块c的exec函数，也就是最终会执行模块c中的define(factory)中的factory函数

对于require.async('c.js')其结果是重新走了一遍Module.use('c.js')