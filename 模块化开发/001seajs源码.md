---
title:  seajs源码分析
date: 2017-11-22 12:36:00
categories: seajs
tags : seajs
comments : true 
---

### 1 献上源码

```javascript
/**
 * Add the capability to load CMD modules in node environment
 * @author lifesinger@gmail.com
 */
//node遵循cmd规范，通过require来引入模块；
var fs = require("fs")
var path = require("path")
var vm = require("vm")
var normalize = require("./winos").normalize

var moduleStack = []
var uriCache = {}
var nativeLoad
//首先运行sea-debug.js
runSeaJS("../dist/sea-debug.js")
hackNative()
attach()
keep()
seajs.config({ cwd: normalize(process.cwd()) + "/" })


function runSeaJS(filepath) {
  var code = fs.readFileSync(path.join(__dirname, filepath), "utf8")
  code = code.replace("})(this);", "})(exports);")

  // Run "sea.js" code in a fake browser environment
  var sandbox = require("./sandbox")
  vm.runInNewContext(code, sandbox, "sea-debug.vm")

  global.seajs = sandbox.exports.seajs
  global.define = sandbox.exports.define
}

function hackNative() {
  var Module = module.constructor
  nativeLoad = Module._load

  Module._load = function(request, parent, isMain) {
    var exports = nativeLoad(request, parent, isMain)

    var _filename = Module._resolveFilename(request, parent)
    var filename = normalize(_filename)

    var mod = seajs.cache[filename]
    if (mod) {
      if (mod.status < seajs.Module.STATUS.EXECUTING) {
        seajs.use(filename)
      }
      exports = Module._cache[_filename] = mod.exports
    }
    

    return exports
  }

  var _compile = Module.prototype._compile

  Module.prototype._compile = function(content, filename) {
    moduleStack.push(this)
    try {
      return _compile.call(this, content, filename)
    }
    finally {
      moduleStack.pop()
    }
  }
}

function attach() {
  seajs.on("request", requestListener)
  seajs.on("define", defineListener)
}

function requestListener(data) {
  var requestUri = pure(data.requestUri)
  var ext = path.extname(requestUri)
  //process.stdout.write("requestUri = " + requestUri + "\n")

  if (ext === ".js") {
    // Use native `require` instead of script-inserted version
    nativeLoad(requestUri)
    data.onRequest()
    data.requested = true
  }
  // Throw error if this function is the last request handler
  else if (seajs.data.events["request"].length === 1) {
    throw new Error("Do NOT support to load this file in node environment: "
        + requestUri)
  }
}

function defineListener(data) {
  if (!data.uri) {
    var derivedUri = normalize(moduleStack[moduleStack.length - 1].id)
    data.uri = uriCache[derivedUri] || derivedUri
  }
}

function keep() {
  var _off = seajs.off
  var events = seajs.data.events

  seajs.off = function(name, callback) {
    // Remove *all* events
    if (!(name || callback)) {
      // For Node.js to work properly
      for (var prop in events) {
        delete events[prop]
      }
    }
    else {
      _off(name, callback)
    }

    attach()
    return seajs
  }
}

function pure(uri) {
  // Remove timestamp etc
  var ret = uri.replace(/\?.*$/, "")

  // Cache it
  if (ret !== uri) {
    uriCache[ret] = uri
  }
  return ret
}


```

### 2 我们引入seajs之后在控制台输出下

```javascript
// console.log(seajs);
Object
Module:function t(a,b)
cache:Object
config:function (a)
data:Object
emit:function (a,b)
off:function (a,b)
on:function (a,b)
request:function o(a,b,c,d)
require:function (a)
resolve:function m(a,b)
use:function (a,b)
version:"2.2.3" 
```

### 3 [seajs源码地址](https://github.com/jimwmg/seajs)

[seajs-debug.js源码地址](https://github.com/jimwmg/seajs/blob/master/dist/sea-debug.js)

```javascript
//先来看下runSeaJS执行的过程
function runSeaJS(filepath) {
  var code = fs.readFileSync(path.join(__dirname, filepath), "utf8")
  code = code.replace("})(this);", "})(exports);")

  // Run "sea.js" code in a fake browser environment
  var sandbox = require("./sandbox")
  vm.runInNewContext(code, sandbox, "sea-debug.vm")

  global.seajs = sandbox.exports.seajs
  global.define = sandbox.exports.define
}
//会执行seajs-debug.js
```

接下来一步步分析其执行片段

####3.1 一些函数和变量的声明

```javascript
var seajs = global.seajs = {
  // The current version of Sea.js being used
  version: "3.0.1"
}

var data = seajs.data = {};
var isObject = isType("Object")
var isString = isType("String")
var isArray = Array.isArray || isType("Array")
var isFunction = isType("Function")
var isUndefined = isType("Undefined")
//seajs给每个模块的uri命名后缀；
var _cid = 0
function cid() {
  return _cid++
}
var events = data.events = {};
//所有通过define定义的模块都会放在这个数组里面
var cachedMods = seajs.cache = {}
var anonymousMeta;
//在全局定义define函数；
global.define = Module.define;
//给seajs对象定义Module构造函数；
seajs.Module = Module
data.fetchedList = fetchedList
data.cid = cid；
// The root path to use for id2uri parsing
data.base = loaderDir

// The loader directory
data.dir = loaderDir

// The loader's full path
data.loader = loaderPath

// The current working directory
data.cwd = cwd

// The charset for requesting files
data.charset = "utf-8"
//seajs.config函数的定义，给每个模块定义别名等
// data.alias - An object containing shorthands of module id
// data.paths - An object containing path shorthands in module id
// data.vars - The {xxx} variables in module id
// data.map - An array containing rules to map module uri
// data.debug - Debug mode. The default value is false

seajs.config = function(configData) {

  for (var key in configData) {
    var curr = configData[key]
    var prev = data[key]

    // Merge object config such as alias, vars
    if (prev && isObject(prev)) {
      for (var k in curr) {
        prev[k] = curr[k]
      }
    }
    else {
      // Concat array config such as map
      if (isArray(prev)) {
        curr = prev.concat(curr)
      }
      // Make sure that `data.base` is an absolute path
      else if (key === "base") {
        // Make sure end with "/"
        if (curr.slice(-1) !== "/") {
          curr += "/"
        }
        curr = addBase(curr)
      }

      // Set config
      data[key] = curr
    }
  }

  emit("config", configData)
  return seajs
}
```

#### 3.2 先来看下在seajs中一个模块是如何定义的；

##### 3.2.1 首先看下Module构造函数

```javascript
var STATUS = Module.STATUS = {
  // 1 - The `module.uri` is being fetched
  FETCHING: 1,
  // 2 - The meta data has been saved to cachedMods
  SAVED: 2,
  // 3 - The `module.dependencies` are being loaded
  LOADING: 3,
  // 4 - The module are ready to execute
  LOADED: 4,
  // 5 - The module is being executed
  EXECUTING: 5,
  // 6 - The `module.exports` is available
  EXECUTED: 6,
  // 7 - 404
  ERROR: 7
}


function Module(uri, deps) {
  this.uri = uri
  this.dependencies = deps || []
  this.deps = {} // Ref the dependence modules
  this.status = 0

  this._entry = []
}

// Resolve module.dependencies
Module.prototype.resolve = function() {
  var mod = this
  var ids = mod.dependencies
  var uris = []

  for (var i = 0, len = ids.length; i < len; i++) {
    uris[i] = Module.resolve(ids[i], mod.uri)
  }
  return uris
}

Module.prototype.pass = function() {
  var mod = this

  var len = mod.dependencies.length

  for (var i = 0; i < mod._entry.length; i++) {
    var entry = mod._entry[i]
    var count = 0
    for (var j = 0; j < len; j++) {
      var m = mod.deps[mod.dependencies[j]]
      // If the module is unload and unused in the entry, pass entry to it
      if (m.status < STATUS.LOADED && !entry.history.hasOwnProperty(m.uri)) {
        entry.history[m.uri] = true
        count++
        m._entry.push(entry)
        if(m.status === STATUS.LOADING) {
          m.pass()
        }
      }
    }
    // If has passed the entry to it's dependencies, modify the entry's count and del it in the module
    if (count > 0) {
      entry.remain += count - 1
      mod._entry.shift()
      i--
    }
  }
}

// Load module.dependencies and fire onload when all done
Module.prototype.load = function() {
  var mod = this

  // If the module is being loaded, just wait it onload call
  if (mod.status >= STATUS.LOADING) {
    return
  }

  mod.status = STATUS.LOADING

  // Emit `load` event for plugins such as combo plugin
  var uris = mod.resolve()
  emit("load", uris)

  for (var i = 0, len = uris.length; i < len; i++) {
    mod.deps[mod.dependencies[i]] = Module.get(uris[i])
  }

  // Pass entry to it's dependencies
  mod.pass()

  // If module has entries not be passed, call onload
  if (mod._entry.length) {
    mod.onload()
    return
  }

  // Begin parallel loading
  var requestCache = {}
  var m

  for (i = 0; i < len; i++) {
    m = cachedMods[uris[i]]

    if (m.status < STATUS.FETCHING) {
      m.fetch(requestCache)
    }
    else if (m.status === STATUS.SAVED) {
      m.load()
    }
  }

  // Send all requests at last to avoid cache bug in IE6-9. Issues#808
  for (var requestUri in requestCache) {
    if (requestCache.hasOwnProperty(requestUri)) {
      requestCache[requestUri]()
    }
  }
}


// Call this method when module is 404
Module.prototype.error = function() {
  var mod = this
  mod.onload()
  mod.status = STATUS.ERROR
}



// Fetch a module
Module.prototype.fetch = function(requestCache) {
  var mod = this
  var uri = mod.uri

  mod.status = STATUS.FETCHING

  // Emit `fetch` event for plugins such as combo plugin
  var emitData = { uri: uri }
  emit("fetch", emitData)
  var requestUri = emitData.requestUri || uri

  // Empty uri or a non-CMD module
  if (!requestUri || fetchedList.hasOwnProperty(requestUri)) {
    mod.load()
    return
  }

  if (fetchingList.hasOwnProperty(requestUri)) {
    callbackList[requestUri].push(mod)
    return
  }

  fetchingList[requestUri] = true
  callbackList[requestUri] = [mod]

  // Emit `request` event for plugins such as text plugin
  emit("request", emitData = {
    uri: uri,
    requestUri: requestUri,
    onRequest: onRequest,
    charset: isFunction(data.charset) ? data.charset(requestUri) : data.charset,
    crossorigin: isFunction(data.crossorigin) ? data.crossorigin(requestUri) : data.crossorigin
  })

  if (!emitData.requested) {
    requestCache ?
      requestCache[emitData.requestUri] = sendRequest :
      sendRequest()
  }

  function sendRequest() {
    seajs.request(emitData.requestUri, emitData.onRequest, emitData.charset, emitData.crossorigin)
  }

  function onRequest(error) {
    delete fetchingList[requestUri]
    fetchedList[requestUri] = true

    // Save meta data of anonymous module
    if (anonymousMeta) {
      Module.save(uri, anonymousMeta)
      anonymousMeta = null
    }

    // Call callbacks
    var m, mods = callbackList[requestUri]
    delete callbackList[requestUri]
    while ((m = mods.shift())) {
      // When 404 occurs, the params error will be true
      if(error === true) {
        m.error()
      }
      else {
        m.load()
      }
    }
  }
}

// Resolve id to uri
Module.resolve = function(id, refUri) {
  // Emit `resolve` event for plugins such as text plugin
  var emitData = { id: id, refUri: refUri }
  emit("resolve", emitData)

  return emitData.uri || seajs.resolve(emitData.id, refUri)
}

// Define a module
Module.define = function (id, deps, factory) {
  var argsLen = arguments.length

  // define(factory)
  if (argsLen === 1) {
    factory = id
    id = undefined
  }
  else if (argsLen === 2) {
    factory = deps

    // define(deps, factory)
    if (isArray(id)) {
      deps = id
      id = undefined
    }
    // define(id, factory)
    else {
      deps = undefined
    }
  }
//主要是将自己定义的模块中的依赖全部给到deps数组中；
  // Parse dependencies according to the module factory code
  if (!isArray(deps) && isFunction(factory)) {
    deps = typeof parseDependencies === "undefined" ? [] : parseDependencies(factory.toString())
  }

  var meta = {
    id: id,
    uri: Module.resolve(id),
    deps: deps,
    factory: factory
  }

  // Try to derive uri in IE6-9 for anonymous modules
  if (!isWebWorker && !meta.uri && doc.attachEvent && typeof getCurrentScript !== "undefined") {
    var script = getCurrentScript()

    if (script) {
      meta.uri = script.src
    }

    // NOTE: If the id-deriving methods above is failed, then falls back
    // to use onload event to get the uri
  }

  // Emit `define` event, used in nocache plugin, seajs node version etc
  emit("define", meta)
//这里将define定义的模块通过save==>get 放入cachedMods数组中
  meta.uri ? Module.save(meta.uri, meta) :
    // Save information for "saving" work in the script onload event
    anonymousMeta = meta
}

// Save meta data to cachedMods
Module.save = function(uri, meta) {
  var mod = Module.get(uri)

  // Do NOT override already saved modules
  if (mod.status < STATUS.SAVED) {
    mod.id = meta.id || uri
    mod.dependencies = meta.deps || []
    mod.factory = meta.factory
    mod.status = STATUS.SAVED

    emit("save", mod)
  }
}

// Get an existed module or create a new one
Module.get = function(uri, deps) {
  return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps))
}

// Use function is equal to load a anonymous module
Module.use = function (ids, callback, uri) {
  var mod = Module.get(uri, isArray(ids) ? ids : [ids])

  mod._entry.push(mod)
  mod.history = {}
  mod.remain = 1

  mod.callback = function() {
    var exports = []
    var uris = mod.resolve()

    for (var i = 0, len = uris.length; i < len; i++) {
      //这里返回模块的exports
      exports[i] = cachedMods[uris[i]].exec()
    }

    if (callback) {
      callback.apply(global, exports)
    }

    delete mod.callback
    delete mod.history
    delete mod.remain
    delete mod._entry
  }

  mod.load()
}


// Public API

seajs.use = function(ids, callback) {
  Module.use(ids, callback, data.cwd + "_use_" + cid())
  return seajs
}

Module.define.cmd = {}
global.define = Module.define
```

所以当我们定义seajs的模块的时候，其实调用的是Module的define函数

```javascript
define(funtion(require,exports){
       //your code
       export.init = function(){
  
		}
});
```

回过头来看上面定义的Module.prototype.define函数里面的一些注释；

##### 3.2.2 再来看下seajs.use函数

基本使用

```javascript
seajs.use(['a.js','b.js','c.js'],function(a,b,c){
  //your code
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
      exports[i] = cachedMods[uris[i]].exec()
    }

    if (callback) {
      //这里apply函数会将exports数组一个一个传给callback
      callback.apply(global, exports)
    }

    delete mod.callback
    delete mod.history
    delete mod.remain
    delete mod._entry
  }

  mod.load()
}

```

##### 3.2.3 接下来重点看下Module.prototype.exec函数的实现

```javascript
// Execute a module
Module.prototype.exec = function () {
  var mod = this

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

##### 3.2.4 seajs.require

```javascript
seajs.require = function(id) {
  //如果重复加载同一个模块，如果该模块已经加载过，也就是其define(factory)中的factory已经执行过，那么该模块的状态就会是 STATUS.EXECUTING ;那么该模块不会再次执行，直接从该模块的exports属性上获取factory执行后给到的结果；
  //这里是一个闭包，也就是factory函数中的变量对象，被模块的exports属性引用；
  var mod = Module.get(Module.resolve(id))
  if (mod.status < STATUS.EXECUTING) {
    mod.onload()
    mod.exec()
  }
  return mod.exports
}

// Call this method when module is loaded
Module.prototype.onload = function() {
  var mod = this
  mod.status = STATUS.LOADED

  // When sometimes cached in IE, exec will occur before onload, make sure len is an number
  for (var i = 0, len = (mod._entry || []).length; i < len; i++) {
    var entry = mod._entry[i]
    if (--entry.remain === 0) {
      entry.callback()
    }
  }

  delete mod._entry
}


```

如果再次加载同一个组件，则不会重复执行，执行从模块的exports属性上读取结果即可；

