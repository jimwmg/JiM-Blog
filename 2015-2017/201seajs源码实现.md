---
title:  seajs源码实现
date: 2017-04-28 12:36:00
categories: seajs
tags : seajs
comments : true 
updated : 
layout : 
---

### 1 seajs核心实现包括以下几个函数

use(id,callback)  入口函数

define(id?dep?factory)  模块定义函数

require(id)  模块加载函数

getModuleExports(module)  取得模块接口函数 

### 2 代码实现 

**2.1. use(ids, callback)**
use为程序启动的入口，主要干两件事：加载指定的模块待模块加载完成后，调用回调函数

```javascript
function use(ids, callback) {

     if (!Array.isArray(ids)) ids = [ids];

     Promise.all(ids.map(function (id) {

         return load(myLoader.config.root + id);

     })).then(function (list) {

         callback.apply(global, list);// 加载完成， 调用回调函数

     }, function (error) {

         throw error;

     });

 }
```

use会调用load函数，这个函数的作用是根据模块的id，加载模块，并返回一个Promise对象

```javascript
function load(id) {

       return new Promise(function (resolve, reject) {

           var module = myLoader.modules[id] || Module.create(id); // 取得模块或者新建模块 此时模块正在加载或者已经加载完成

           module.on("complete", function () {

               var exports = getModuleExports(module);

               resolve(exports);// 加载完成-> 通知调用者

           })

           module.on("error", reject);

       })

   }

```

**2.2 define函数的实现**

```javascript
var factory = function(require, exports, module){
    // some code
}
define(factory);
```

 一个模块文件被浏览器下载下来后，并不会直接运行我们的模块定义代码，而是会首先执行一个`define`函数，这个函数会取得模块定义的源代码（通过函数的`toString()`函数来取得源代码），然后利用正则匹配找到依赖的模块（匹配`require("dep.js")`这样的字符串)，然后加载依赖的模块，最后发射一个自定义事件`complete`，通知**当前模块**， 模块已经加载完成，此时，**当前模块**的就会调用与`complete`事件绑定的回调函数，完成与这个模块相关的任务，比如`resolve`与这个模块加载绑定的`Promise`。
具体实现为：

```javascript
function define(factory) {
  var id = getCurrentScript();
  id = id.replace(location.origin, "");
  var module = myLoader.modules[id];
  module.factory = factory;
  var dependences = getDependcencs(factory);
  if (dependences) {
      Promise.all(dependences.map(function (dep) {
          return load(myLoader.config.root + dep);
      })).then(function () {
          module.fire("complete"); // 依赖加载完成，通知模块。
      }, function () {
          module.fire("error");
      });
  } else {
      module.fire("complete");//没有依赖，通知模块加载完成
  }
}
```

**2.3 require函数的实现**

```javascript
function require(id) {
       var module = myLoader.modules[myLoader.config.root + id];
       if (!module) throw "can not load find module by id:" + id;
       else {
           return getModuleExports(module); // 返回模块的对外接口。
       }
   }

function getModuleExports(module) {
    if (!module.exports) {
        module.exports = {};
        module.factory(require, module.exports, module);
    }
    return module.exports;
}
```



[参考](http://natumsol.github.io/2015/12/21/a-mirco-cmd-loader/#模块定义函数-define-factory)