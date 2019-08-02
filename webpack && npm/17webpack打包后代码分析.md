---

---

### 1 webpack基本配置如下

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist/')

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js'
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename:'[name].non-entry.js' //非入口chunk的名字，比如异步chunk
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}

```

### 2 打包结果分析

#### 2.1 Commonjs规范

简单来说 依赖 `module.exports   exports   require` 这三个关键字

```javascript
module.exports = {}
```

```javascript
exports.xxx = xxx
```

```javascript
const m = require('./path/to/module.js');
```

为了简单来看结果，这里我们不对 `async  await  箭头函数`等进行语法方面的转化;具体想了解的可以参考[babel进阶]([https://github.com/jimwmg/JiM-Blog/blob/master/JavaScript/babel/02babel-%E8%BF%9B%E9%98%B6.md](https://github.com/jimwmg/JiM-Blog/blob/master/JavaScript/babel/02babel-进阶.md))

##### webpack仅仅打包一个模块

`index.js`

```javascript
const p = 'hello world';
let res = Object.assign({},{name:"jhon"})
const func = async function(){
  await new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve();
    },1000)
  })
  console.log('1s later');
}
func();
module.exports = {f:func};
```

打包后代码整体结构

```javascript
(function(modules){
  var installedModules = {};//用于记录加载了哪些modules，闭包
  function __webpack_require__(moduleId){//这个函数是webpack用来加载所有模块的
    if(installedModules[moduleId]){
			return installedModules[moduleId].exports;
    }
    //每次调用__webpack_require__的时候都重新创建一个模块
    var module = installedModules[moduleId] = {
      i:moduleId, //记录每个模块的id
      l:false,//记录每个模块是否已经加载
      exports:{},//表示每个模块导出的对象
		}
    //执行这个call函数进行模块的加载
    modules[moduleId].call(module.exports,module,module.exports);
    module.l = true;//模块加载完毕之后，将其置为true,表示已经加载过该模块
    return module.exports;//每次加载模块，返回值都是module.exports ,默认值是 {}
	}
  __webpack_require__.m = modules; //加载函数__webpack_require__上挂载一个所有模块的引用
  __webpack_require__.c = installedModules;//加载函数__webpack_require__上挂载一个已经加载的模块的引用
  //webpack从2.0开始原生支持es6 modules，也就是import，export语法，不需要借助babel编译。这会出现一个问题，es6 modules语法的import引入了default的概念，在Commonjs模块里是没有的，那么如果在一个Commonjs模块里引用es6 modules就会出问题，反之亦然。webpack对这种情况做了兼容处理，就是用__webpack_require__.d和__webpack_require__.n来实现的
  __webpack_require__.d = function(exports,name,getter){
    if(!__webpack_require__.o(exports,name){
    	Object.defineProperty(exports,name,{
       	configurable:false,
       	enumerable:true,
       	get:getter,
       })   
    })
  }
  __webpack_require__.n = function(module){}
  __webpack_require__.o = function(object,property){
		return Object.prototype.hasOwnProperty.call(object,property)
  }
  __webpack.require__.p = '' //这里的值在webpack编译的时候会取配置中的 output.publicPath
  //https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific
  return __webpack_require__(__webpack_require__.s = 0);//__webpack_require__(0);执行
})([
  (
  	function(module,exports){ //这里的module和exports就是		    modules[moduleId].call(module.exports,module,module.exports);执行的时候传入的；
     //如果index.js中有require,那么 会有一个 __webpack_require__ 作为第三个参数
      const p = 'hello world';
      let res = Object.assign({}, { name: "jhon" });
      const func = async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        console.log('1s later');
      };
      func();
      module.exports = { f: func };
    }
  )
])
```

##### webpack 打包两个及以上模块

`index.js`中加一行代码

```javascript
const m = require('./module.js')
```

`module.js`

```javascript
console.log('module.js')
module.exports = {
  age:"18"
}
```



```javascript
(function(modules){
  //省略 同上
})([
  //第一个模块
  (
  	function(module,exports,__webpack_require__){ //这里的module和exports就是		    modules[moduleId].call(module.exports,module,module.exports);执行的时候传入的；
     //如果index.js中有require,那么 会有一个 __webpack_require__ 作为第三个参数
      //省略 同上
      const m = __webpack_require__(1);
      module.exports = { f: func };
    }
  ),
  //第二个模块
  (
    function(module,exports){
			console.log("module.js");
      module.exports = {
				age:"18"
      }
    }
  )
])
```

#### 2.2 ES6模块规范

简单来说依赖 `export  import`这两个关键字

使用`import`命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。但是，用户肯定希望快速上手，未必愿意阅读文档，去了解模块有哪些属性和方法；

`export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应`export default`命令。

本质上，`export default`就是输出一个叫做`default`的变量或方法，然后系统允许你为它取任意名字

```javascript
export default xxx
```

```javascript
var m1 = {address1:"xxx街道1"}
var m2 = {addres2:"xxx街道2"}
export {m1,m2}
export default  {f:func};
```

```javascript
import {m1,m2} from './module.js'
import m from './module.js' //默认引入的是export default的值
//等价于
import {default as m } from './module.js'
```

`index.js`

```javascript
const p = 'hello world';
let res = Object.assign({},{name:"jhon"})
const func = async function(){
  await new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve();
    },1000)
  })
  console.log('1s later');
}
func()
import {month,year,default as m} from './module.js'
console.log('module-import',m,month,year)
export default  {f:func};

```

`module.js`

```javascript
// console.log('module.js')
var month = 12
var year = {time:1990}
export {month,year}
export default  {
  age:"0"
}
```

打包后代码

```javascript
(function(modules){
  //省略  同上 重点看下这个 __webpack_require__.d 这个函数 
  __webpack_require__.d = function(exports,name,getter){
    if(!__webpack_require__.o(exports,name){
    	Object.defineProperty(exports,name,{
       	configurable:false,
       	enumerable:true,
       	get:getter,
       })   
    })
  }
})([
  //第一个模块
  (
    function(module,__webpack_exports__,__webpack_require__){
      //这里的module和exports就是		    modules[moduleId].call(module.exports,module,module.exports);执行的时候传入的；
      "use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module_js__ = __webpack_require__(1);
      const p = 'hello world';
      let res = Object.assign({}, { name: "jhon" });
      const func = async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        console.log('1s later');
      };
      func();

      console.log('module-import', __WEBPACK_IMPORTED_MODULE_0__module_js__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0__module_js__["b" /* month */], __WEBPACK_IMPORTED_MODULE_0__module_js__["c" /* year */]);
      /* harmony default export */ __webpack_exports__["default"] = ({ f: func });
    }
  ),
  //第二个模块
  (
    function(module,__webpack_exports__,__webpack_require__){
      "use strict";
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return month; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return year; });
      // console.log('module.js')
      var month = 12;
      var year = { time: 1990 };

      /* harmony default export */ __webpack_exports__["a"] = ({
        age: "0"
      });
    }
  )
])
```

#### 2.3 ES模块引入Commonjs模块

`index.js` 代码不变

```javascript
const p = 'hello world';
let res = Object.assign({},{name:"jhon"})
const func = async function(){
  await new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve();
    },1000)
  })
  console.log('1s later');
}
func()
import {month,year,default as m} from './module.js'
console.log('module-import',m,month,year)
export default  {f:func};
```

`module.js` 改为 CommonJS规范

```javascript
// console.log('module.js')
var month = 12
var year = {time:1990}
module.exports = {
  month,year,default:{age:0}
}
```

打包结果分析

```javascript
(function(modules){
  //省略  同上 重点看下这个 __webpack_require__.d 这个函数 
  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
        function getDefault() { return module['default']; } :
    function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
}
 })([
  //第一个模块
  (
    function(module,__webpack_exports__,__webpack_require__){
      //这里的module和exports就是		    modules[moduleId].call(module.exports,module,module.exports);执行的时候传入的；
      "use strict";
      Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module_js__ = __webpack_require__(1);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__module_js__);
      const p = 'hello world';
      let res = Object.assign({},{name:"jhon"})
      const func = async function(){
        await new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve();
          },1000)
        })
        console.log('1s later');
      }
      func()

      console.log('module-import',__WEBPACK_IMPORTED_MODULE_0__module_js___default.a,__WEBPACK_IMPORTED_MODULE_0__module_js__["month"],__WEBPACK_IMPORTED_MODULE_0__module_js__["year"])
      /* harmony default export */ __webpack_exports__["default"] = ({f:func});
    }
  ),
  //第二个模块
  (
    function(module, exports) {

      // console.log('module.js')
      var month = 12
      var year = {time:1990}
      module.exports = {
        month,year,default:{age:0}
      }


      /***/ }
  )
])
```

可以发现 `index.js`中多了一行代码

```
var __WEBPACK_IMPORTED_MODULE_0__m___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__m__);
```

这段代码作用是什么呢，重点看一下`__webpack_require__.n`的定义就知道了

#### 2.4 异步引用模块

可以减少你的主 bundle的大小，在某个时机，比如按钮点击的时候，再去加载某个模块；

`require.ensure`

```javascript
require.ensure(
  dependencies: String[],//callback函数中可能会依赖的其他模块，需要提前引用
  callback: function(require),
  errorCallback: function(error),
  chunkName: String
)
```

首先看下`script的defer和async`

[参考](https://juejin.im/entry/5a7ad55ef265da4e81238da9)

##### `defer`

这个属性的用途是表明脚本在执行时不会影响页面的构造。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。因此，在`<script>`元素中设置`defer`属性，相当于告诉浏览器立即下载，但延迟执行。

HTML5规范要求脚本按照它们出现的先后顺序执行，因此第一个延迟脚本会先于第二个延迟脚本执行，而这两个脚本会先于`DOMContentLoaded`事件执行。**在现实当中**，延迟脚本并不一定会按照顺序执行，也不一定会在`DOMContentLoad`时间触发前执行，因此最好只包含一个延迟脚本。

##### `async`

这个属性与`defer`类似，都用于改变处理脚本的行为。同样与`defer`类似，`async`只适用于外部脚本文件，并告诉浏览器立即下载文件。但与`defer`不同的是，标记为`async`的脚本并不保证按照它们的先后顺序执行。

第二个脚本文件可能会在第一个脚本文件之前执行。因此确保两者之间互不依赖非常重要。指定`async`属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。

**script标签的onload事件都是在外部js文件被加载完成并执行完成后才被触发的**

`index.js`

```javascript
const app = document.getElementById('app');
const m = require('./module.js')
app.addEventListener('click',function(){
  console.log('click');
  require.ensure(['./module3.js','./module2.js'],function(require,...args){
    require('./module1.js')
    console.log('module1',args)
  });
})
console.log('this is index');

```

`dist`中生成的目录结构

```
dist
 -0.non-entry.js
 -app.js
 index.html
```

理解下 `chunk`和`module`

**所谓的chunk就是打包后的js文件，比如上面的 `app.js  0.non-entry.js`都是chunk**

**所谓module就是每个chunk中的单个模块，比如下面的`modules`**

```javascript
(function(modules){
  //....
})(
[
  //这里的都是modules
]

)
```

打包后的代码

```javascript
(function(modules){
  var parentJsonpFunction = window['webpackJsonp'];//undefined
  window['webpackJsonp'] = function webpackJsonpCallback(chunkIds,moreModules,executeModules){
    var moduleId,chunkId,i=0,resolves=[],result;
    for(;i < chunksId.length;i++){
      chunkId = chunkIs[i];
      if(installedChunks[chunkId]){
        resolves.push(installedChunks[chunkId][0]);//这里是在 __webpack_require__.e函数中赋值的
        //installedChunk [resolve,reject,promise];
      }
      installedChunks[chunkId] = 0 ;//标记异步加载的chunk已经加载，下次如果在异步加载同样的模块，那么__webpack_require__.e中在执行的时候会根据这个值直接resolve,进入回调；
    }
    for(moduleId in moreModules){ //for-in 遍历以任意顺序遍历一个对象自有的、继承的、可枚举的、非Symbol的属性名
      if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){
        modules[moduleId] = moreModules[moduleId];//注意这里 moduleId的取值是从2 开始的，具体看 0.non_entry.js中的代码
      }
    }
    if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
    while(resolves.length){
      resolves.shift()();//执行 //installedChunk [resolve,reject,promise];里面的resolve函数，改变__webpack_require__.e返回值的 promise 状态
    }
  }
  var installedModules = {} //对module做缓存
  /*         Asset       Size  Chunks             Chunk Names
0.non-entry.js  406 bytes       0  [emitted]      //  output.chunkFilename
        app.js    6.29 kB       1  [emitted]  app
    index.html  342 bytes          [emitted]  */
  var installedChunks = { 
    1:0
  }
  //这里表示chunkId 为 1 的已经加载好了 这个就是 dist/app.js,假如有两个require.ensure,那么这里的值就为{2:0},表示chunkId为2 的已经加载好了，其实还是 dist/app.js ,或者entry有多个入口，都会影响这个值；
  __webpack_require__ = function(){
    //省略
  }
  //用来记载异步chunk的函数
  __webpack_require__.e = function(chunkId){
    var installedChunkData = installedChunks[chunkId];
    if(installedChunkData === 0){
      return new Promsie(function(resolve){resolve()}) ;//如果是加载过的某个异步chunk那个直接返货resolve的promsie;结合上面看
    }
    if(installedChunkData){
      return installedChunkData[2] 
    }
    //接下来是开始创建加载chunk的代码
    var head = document.getElementByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    if(__webpack_require__.nc){
      script.setAttribute('nonce',__webpack_require__.nc)
    }
    script.src = __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".non-entry.js";
    
    var timeout = setTimeout(onScriptComplete,12000); //output.chunkLoadTimeout ,chunk请求到期的毫秒数；
    script.onerror = script.onload = onScriptComplete
    function onScriptComplete(){
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var chunk = installedChunks[chunkId];
      if(chunk !== 0){
        if(chunk){
          chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
        }
        installedChunks[chunkId] = undefined;
      }
    }
    head.appendChild(script);
    return promise;
  }
  //省略其他代码
  __webpack_require__.oe = function(err) { console.error(err); throw err; };
})([
  //第一个模块(入口模块)
  (function(module,exports,__webpack_require__){
    const app = document.getElementById('app');
    const m = __webpack_require__(1);
    app.addEventListener('click',function(){
      console.log('click');
      __webpack_require__.e/* require.ensure */(0).then((function(require,...args){
        __webpack_require__(4)
        console.log('module1',args)
      }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
      //这里通过bind函数传入 __webpack_require__ 函数；
    })

    console.log('this is index');
  }),
  //第二个模块(const m = require('./module.js'))
  (function(module,exports,__webpack_require__){
    console.log('module.js')
    module.exports = {
      id:'module',
    }
  })
])
```

`0.non-entry.js`

```javascript
for(moduleId in moreModules){ //for-in 遍历以任意顺序遍历一个对象自有的、继承的、可枚举的、非Symbol的属性名
  if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){
    modules[moduleId] = moreModules[moduleId];//注意这里 moduleId的取值是从2 开始的，具体看 0.non_entry.js中的代码
  }
}
```

```javascript
webpackJsonp([0],[
/* 0 */, //这里就是已经加载的模块占位bundle
/* 1 */, //这里是 const m = require('./module.js')这个模块
/* 2 */
/***/ (function(module, exports) {

console.log('module3.js')
module.exports = {
  id:'module3',
  name:"jim"
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

console.log('module2.js')
module.exports = {
  id:"module2",
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

console.log('module1.js')
module.exports = {
  id:'module1',
}

/***/ })
]);
```

### 3 从打包后的代码中分析output选项

```javascript
output: {
    path: dist,//文件打包后的路径
    filename: '[name].js',//入口文件打包后的每个chunk名字
    chunkFilename:'[name].non-entry.js',//非入口文件，比如异步加载的chunk  import('./module.js')
    chunkLoadTimeout:1000,//var timeout = setTimeout(onScriptComplete,12000);打包后代吗这里用
    
    jsonpFunction:'webpackJsonp' + Date.now(),
      // jsonpFunction:'myWebpackJsonp',//如果某个项目中有多个webpack构建的bundle，那么如果两个bundle中都有异步加载的话，全局的window['webpackJsonp']就会重名，jsonpFunction用来给webpack构建的这个取名
    crossOriginLoading: 'use-credentials',
      //标记是否禁用跨域加载脚本
    // publicPath:'http://www.test/images/' //动态加载的chunk请求的路径
      library:"string",//Object
      libraryTarget:"commonjs", //var assign | this window global | commonjs2 commonjs amd umd
      libraryExport:"default",//mymodule  等等
      pathinfo:true,
  },
```

#### 3.1 script标签的crossorigin属性

script标签请求 script标签不受同源策略的限制 **script 的src获取javascript;link的src获取 css； img的src获取图片资源； iframe 的src获取页面标** 是允许跨域的，这些标签不受跨域的限制；

所以不设置 `crossOriginLoading`或者设置其值为 `false`的时候，是可以跨域加载脚本的；

`crossOriginLoading: false` - 禁用跨域加载（默认）

`crossOriginLoading: "anonymous"` - **不带凭据(credential)**启用跨域加载

`crossOriginLoading: "use-credentials"` - **带凭据(credential)**启用跨域加载 **with credentials**

[参考](https://github.com/rainjay/blog/issues/1)

crossorigin的属性值可以是`anonymous`、`use-credentials`，如果没有属性值或者非法属性值，会被浏览器默认做`anonymous`。crossorigin的作用有三个：

1. crossorigin会让浏览器启用CORS访问检查，检查http相应头的Access-Control-Allow-Origin
2. 对于传统script需要跨域获取的js资源，控制暴露出其报错的详细信息
3. 对于`module script`，控制用于跨域请求的[凭据模式](https://fetch.spec.whatwg.org/#concept-request-credentials-mode)

我们在收集错误日志的时候，通常会在window上注册一个方法来监测所有代码抛出的异常：

```
window.addEventListener('error', function(msg, url, lineno, colno, error) {
  var string = msg.toLowerCase()
  var substring = "script error"
  if (string.indexOf(substring) > -1){
    alert('Script Error: See Browser Console for Detail')
  } else {
    var message = {
      Message: msg,
      URL:  url,
      Line: lineNo,
      Column: columnNo,
      'Error object': JSON.stringify(error)
    }
    // send error log to server
    record(message)
  }
  return false
})
```

但是对于跨域js来说，只会给出很少的报错信息：'error: script error'，通过使用`crossorigin`属性可以使跨域js暴露出跟同域js同样的报错信息。但是，资源服务器必须返回一个Access-Control-Allow-Origin的header，否则资源无法访问。

#### 3.2 library  libraryTarget  libraryExport

`output.library` 的值的作用，取决于[`output.libraryTarget`](https://www.webpackjs.com/configuration/output/#output-librarytarget) 选项的值；完整的详细信息请查阅该章节。注意，`output.libraryTarget` 的默认选项是 `var`，所以如果使用以下配置选项

```javascript
entry: {
   app: './src/index.js',
},
output:{
  library:"MyLib",
  libraryTarget:'global',//var assign | this window global | commonjs2 commonjs amd umd
}
```

打包后的bundle  `app.js`如下：

##### var assign 

```javascript
//var
var MyLib = (function(modules){...}([]))
//assign
MyLib = (function(modules){...}([]))
```

##### this window global

```javascript
this["MyLib"] = (function(modules){...}([]))
global["MyLib"] = (function(modules){...}([]))
window["MyLib"] = (function(modules){...}([]))
```

##### amd umd commonjs  commonjs2

```javascript
//amd
define("MyLib", [], function() { return (function(modules) { // webpackBootstrap
//....
 })
 ([

 ])});;

```

`umd`

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MyLib"] = factory();
	else
		root["MyLib"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return (function(modules){...}([]))
}
```

`commonjs`:**入口起点的返回值**将使用 `output.library` 中定义的值，分配给 exports 对象

```javascript
exports["MyLib"] = (function(modules){...}([]))
```

`commonjs2`: **入口起点的返回值**将分配给 `module.exports` 对象,所以此时是否配置 `library`已然没有太大意义

```javascript
module.exports = (function(modules){...}([]))
```

如果在配置

```javascript
libraryExport:'keyName'
```

那么最后导出的结果就是:

```
(function(modules){...}([])).['keyName']
```

#### 3.3 pathinfo

```java
/* 2 */
```

设置`pathinfo:true`之后

```javascript
/* 2 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! dynamic exports provided */
/*! all exports used */
```

### 4 注意

