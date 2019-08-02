---

---

### 1 webpack配置

webpack版本 `"webpack": "^3.6.0",`

**externals是决定的是以哪种模式去加载所引入的额外的模块，这里的模块可以是npm包，也可以是其他任何模块，路径了等等**

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist/')

module.exports = {
  target:'node',
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js',
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename:'[name].non-entry.js'
    // publicPath:'http://www.test/images/'
  },
  externals:[
    {
      './module.js':'M', //默认全局
      './module1.js':'commonjs M1',//用户(consumer)应用程序可能使用 CommonJS 模块系统，因此外部 library 应该使用 CommonJS 模块系统，并且应该是一个 CommonJS 模块
      './module2.js':'this M2',//M2 会放在this上
      './module3.js':'var M3',
      'jQ':'global Q', //将Q放在global变量上
      'lerna-tool1':"someglobal.LT", //这里可以配置某些其他的变量下面
      'somePkg':'require("somePkg-replace")',//其实后面的还是一个字符串,可以理解为 和'./module.js':'M',等价的配置
    },
    /testReg$/,
    function(context,request,callback){
      console.log('request',request)
      if(/^func$/.test(request)){
        //request ==> func
        return callback(null,'commonjs'+request);
      }
      callback()
    },
    'estar', 
    ['testModule1','testModule2']   
  ],
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}

```

### 2 `index.js`代码

```javascript
const m = require('./module.js')
const m1 = require('./module1.js')
const m2 = require('./module2.js');
const m3 = require('./module3.js');
const $ = require("jQ")
const l = require('lerna-tool1')
const somePkg = require('somePkg')
const sub = require('testReg');
const f = require('func');
const e = require('estar')
const t1 = require('testModule1')
const t2 = require('testModule2')
```

按照官方文档的解释，如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals。这个功能主要是用在创建一个库的时候用的，但是也可以在我们项目开发中充分使用。

假设：我们开发了一个自己的库，里面引用了lodash这个包，经过webpack打包的时候，发现如果把这个lodash包打入进去，打包文件就会非常大。那么我们就可以externals的方式引入。也就是说，自己的库本身不打包这个lodash，需要用户环境提供。

### 3 打包后代码

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


const m = __webpack_require__(1)
const m1 = __webpack_require__(2)
const m2 = __webpack_require__(3);
const m3 = __webpack_require__(4);
const $ = __webpack_require__(5)
const l = __webpack_require__(6)
const somePkg = __webpack_require__(7)
const sub = __webpack_require__(8);
const f = __webpack_require__(9);
const e = __webpack_require__(10)
const t1 = __webpack_require__(11)
const t2 = __webpack_require__(12)


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = M;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("M1");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

(function() { module.exports = this["M2"]; }());

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = M3;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

(function() { module.exports = global["Q"]; }());

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = someglobal.LT;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("somePkg-replace");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = testReg;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = commonjsfunc;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = estar;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = testModule1;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = testModule2;

/***/ })
/******/ ]);
```

可以对应webpack配置和打包结果进行分析；

总结以上代码

#### 对于对象的情况

require的值是和对象的key强匹配的，也就是说

### 4 external的使用

```javascript
externals:[
    {
      'lerna-tool1':"someglobal.LT", //这里可以配置某些其他的变量下面
    },
  ],
```

#### 4.1 

`index.js` 如果这么引

```javascript
const l = require('lerna-tool1/index.js')
```

或者多入口

```javascript
entry: {
    app: './src/index.js',
    // common:['lerna-tool1/index.js']
  },
```

那么这个包的内容还是会被打包打进去的；

```javascript
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  test2:"lerna-module2",
  update1:"update2"
}

/***/ })
```

除非配置 

```javascript
externals:[
    {
      'lerna-tool1/index.js':"someglobal.LT", //这样对于引入的  lerna-tool1/index.js 则不会打包进去
    },
  ],
```



#### 4.2 

`index.js` 如果这么引

```javascript
const l = require('lerna-tool1')
```

或者 多入口

```javascript
entry: {
    app: './src/index.js',
    // common:['lerna-tool1']
  },
```

那么这个包的内容才不会被打包进去，这是和配置的强关联的

```javascript
/* 1 */
/***/ (function(module, exports) {

module.exports = someglobal.LT;

/***/ })
/******/ ]);
```

也就是说无论是项目代码或者入口中引用的包，只有匹配了externals的值，才不会被打包进去，否则，都会打包进去；