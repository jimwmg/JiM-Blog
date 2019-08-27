---

---

基于 "webpack": "^3.6.0",

----

### 1 单入口情况下重复引用同一个模块

webpack配置

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist/')

module.exports = {
  target:'web',
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js',
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename:'[name].non-entry.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
}
```

`index.js`

```javascript
console.log('index')
const m1 = require('./module1.js');
const m = require('./module.js');
```

`module.js`

```javascript
console.log('module.js')
const m2 = require('./module2.js')
const m3 = require('./module3.js')

module.exports = {
  id:'module',
}
```

`module1.js`

```javascript
console.log('module1.js')
const m2 = require('./module2.js')
const m3 = require('./module3.js')

module.exports = {
  id:'module1',
}
```

`module.js`和`module1.js`都引用了`module2.js`和`module3.js`; `module2.js 和module3.js`在此测试案例中作为

#### 1.1 单文件

打包后结果如下

```
dist
 -app.js
```

`app.js`

```javascript
 (function(modules) { // webpackBootstrap
//...
 	return __webpack_require__(__webpack_require__.s = 2); //入口是 模块数组中的下标为2 ；
 })
([
   //公用模块
   /* 0 */
 (function(module, exports) {

console.log('module2.js')
module.exports = {
  id:"module2",
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {
 //公用模块
console.log('module3.js')
module.exports = {
  id:'module3',
  name:"jim"
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

console.log('index')
const m1 = __webpack_require__(3);
const m = __webpack_require__(4);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module1.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module1',
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module',
}

/***/ })
/******/ ]);
```

分析以上结果，单入口文件在遇到公用模块的时候，webpack将公用的模块放到模块数组的前面；

**同时，webpack在加载过一个模块之后，如果再次加载该模块，会从缓存中直接读取，而不是在加载该模块执行一次，比如上面打包的结果中 公用模块 0 1 都只会执行一次，`console.log('module3.js') console.log('module4.js')`也只会输出一次**

#### 1.2 分离公用chunk

注意点：

* **name： 如果entry和CommonsChunkPlugin的 name 都有vendor 是把抽离的公共部分合并到vendor这个入口文件中。 如果 entry 中没有vendor, 是把入口文件抽离出来放到 vendor 中。**

- **commonChunk 之后的common.js 还可以继续被抽离，只要重新new CommonsChunkPlugin中name:配置就好就可以实现**

公用chunk的名字以 `filename`的配置为准，如果没有`filename`的配置，那么就以`name`的配置为准

如果觉得一个bundle太大的话，那么可以通过`CommonsChunkPlugin`将公用的`module`提取出来

增加如下配置

```javascript
new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor'],
  minChunks: function(module,count){
    debugger;
    console.log('module-count',module,count)
    // return true;
    return module.resource && (~module.resource.indexOf('module2.js') || ~module.resource.indexOf('module3.js'))
    //这里对每个module进行判断，可以细粒度的控制那些module被打包进 vendor.js这个chunk中
  }
}),
```

打包结果如下

```
dist
	-app.js
	-vendor.js
	-index.html
```

`index.html` 必须在 入口chunk 之前加载生成的这个 公共chunk,因为这个chunk有webpack bootstrap的代码

```html
<script type="text/javascript" src="vendor.js"></script>
<script type="text/javascript" src="app.js"></script></body>
```

`vendor.js`

```javascript
/******/ (function(modules) { // webpackBootstrap
//....
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
  //注意这里没有调用 __webpack_require__()  函数
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

console.log('module2.js')
module.exports = {
  id:"module2",
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

console.log('module3.js')
module.exports = {
  id:'module3',
  name:"jim"
}

/***/ })
/******/ ]);
```



`app.js`

```javascript
webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

console.log('index')
const m1 = __webpack_require__(3);
const m = __webpack_require__(4);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module1.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module1',
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module',
}

/***/ })
],[2]);
```

#### 1.3 分离公用chunk和manifest (所谓manifest文件就是webpack打包构建流程的chunk)

增加如下配置

```javascript
new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function(module,count){
        debugger;
        console.log('module-count',module,count)
        // return true;
        return module.resource && (~module.resource.indexOf('module2.js') || ~module.resource.indexOf('module3.js'))
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
```

打包结果

```
dist
 -app.js
 -vendor.js
 -manifest.js
 -index.html
 
```

`index.html`

```html
<script type="text/javascript" src="manifest.js"></script>
<script type="text/javascript" src="vendor.js"></script>
<script type="text/javascript" src="app.js"></script></body>
```

`manifest.js`

```javascript
(function(modules){
  //webpack打包代码的辅助函数
  var installedModules = {};
  var installedChunks = {
 		2: 0
	};
 //注意这里没有调用 __webpack_require__()  函数
})(
[]
)
```

`vendor.js`

```javascript
webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports) {

console.log('module2.js')
module.exports = {
  id:"module2",
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

console.log('module3.js')
module.exports = {
  id:'module3',
  name:"jim"
}

/***/ })
]);
```



`app.js`

```javascript
webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

console.log('index')
const m1 = __webpack_require__(3);
const m = __webpack_require__(4);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module1.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module1',
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

console.log('module.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module',
}

/***/ })
],[2]);
```

分析以上代码可以知道，webpack在分离公用chunk以及manifest  chunk的时候，它的打包部分代码都没有执行` __webpack_require__()  函数`;

```html
<script type="text/javascript" src="manifest.js"></script>
<!-- //manifest.js定义了webpack  bootstrap 打包后的代码的全局方法， -->
<script type="text/javascript" src="vendor.js"></script>
<!-- //这个chunk将公用的模块先加载到webpack的模块系统中去； -->
<script type="text/javascript" src="app.js"></script></body>
<!-- 这个可以看到 webpackJsonp(chunkIds, moreModules, executeModules)
这里传入了 executeModules:[2],这个就是项目的入口模块开始加载； -->
```



### 2 多入口情况下重复引用同一个模块

```javascript
entry: {
    app: './src/index.js',
    // vendor:['./src/module2.js','./src/module3.js']
    app2:['./src/module.js'],
    // app3:['./src/module1.js'],

  },
```

对于多入口打包的结果，多个入口共同的chunk会被打包进vendor里面

**当然了 vendor.js里面有哪些module是由`minChunks`配置的值决定的**

```html
<script type="text/javascript" src="manifest.js"></script>
<script type="text/javascript" src="vendor.js"></script>
<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="app2.js"></script>
```

`app2.js`

```javascript
webpackJsonp([2],{

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

console.log('module.js')
const m2 = __webpack_require__(0)
const m3 = __webpack_require__(1)

module.exports = {
  id:'module',
}

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })

},[5]);
```

### 3 动态导入或者多入口代码拆分的一个潜在痛点是它增加了对脚本的请求数量，即使在HTTP/2环境中，也会带来挑战。让我们介绍一些可以提高使用代码拆分的应用程序的加载性能的方法。

[参考](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/)

```javascript
<link rel="preload" as="script" href="super-important.js">
<link rel="preload" as="style" href="critical.css">
```

您可能已经想到除“as”属性以外的大部分语法结构。 该属性允许您告知浏览器您将加载的资源类型，以便浏览器可以正确处理该资源。 除非资源类型设置正确，否则浏览器不会使用预加载的资源。 浏览器将以同样的优先级加载资源，但提前了解了该资源，可以尽早开始下载。

请注意，`<link rel="preload">` 是强制浏览器执行的指令；与我们将探讨的其他资源提示不同，它是浏览器必须执行的指令，而不只是可选提示。 因此，为确保使用该指令时不会偶然重复提取内容或提取不需要的内容，对其进行仔细测试尤其重要。

使用 `<link rel="preload">` 提取的资源如果 3 秒内未被当前页面使用，将在 Chrome 开发者工具的控制台中触发警告，请务必留意这些警告！



[参考资源优先级](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preload)

[code-spliting参考](https://github.com/malchata/code-splitting-example/tree/webpack-dynamic-splitting-precache)



[官方文档]([https://webpack.docschina.org/plugins/commons-chunk-plugin/#%E9%85%8D%E7%BD%AE](https://webpack.docschina.org/plugins/commons-chunk-plugin/#配置))

[manifest配置](https://webpack.docschina.org/plugins/commons-chunk-plugin/#manifest-file)