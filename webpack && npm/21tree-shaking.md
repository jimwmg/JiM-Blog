---

---

基于 "webpack": "^3.6.0",

----

### 1 tree shaking 

*tree shaking* 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的 [静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure) 特性，例如 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)。

### 2 webpack配置

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
    // publicPath:'http://www.test/images/'
  },
  // module:{
  //   rules:[
  //     {
  //       test: /\.jsx?$/,
  //       loader: 'babel-loader',
  //       include: [resolve('src')]
  //     }
  //   ]
  // },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new webpack.NamedModulesPlugin(),
    new UglifyJsPlugin({})
  ]
}

```

`.babelrc` 中的module配置 如果让js代码经过babel-loader，那么经过压缩的代码默认是不会进行tree-shaking的，因为babel-loader将ES6的模块化语法转化了，如果需要进行tree-shaking,那么需要将`module`设置为 `false`;

### `modules`

`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`, defaults to `"auto"`.

Enable transformation of ES6 module syntax to another module type.

Setting this to `false` will not transform modules.

Also note that `cjs` is just an alias for `commonjs`.

```javascript
{
  "presets": [
    ["env",{
      "targets": {
        "browsers": [
          "> 1%",
          "last 2 versions",
          "not ie <= 8"
        ]
      },
      "modules":false, 
    }]
  ],
  "plugins":[
  ]
}
```

`index.js`

```javascript
console.log('index')
import {get,post} from './module5.es.js'
get()
```

`module5.es.js`

```javascript
export function get(){
  console.log('get')
}
export function post(){
  console.log('post');
}
```

想要使用 *tree shaking* 必须注意以下……

- 使用 ES2015 模块语法（即 `import` 和 `export`）。
- 确保没有 compiler 将 ES2015 模块语法转换为 CommonJS 模块（这也是流行的 Babel preset 中 @babel/preset-env 的默认行为 - 更多详细信息请查看 [文档](https://babel.docschina.org/docs/en/babel-preset-env#modules)）。
- 启用 minification(代码压缩) 和 tree shaking。（`new UglifyJsPlugin({})`）

### 3 打包结果

注释掉 `UglifyJsPlugin`

```javascript
// new UglifyJsPlugin({})
```

```javascript
(function(modules){
  //省略代码
})({

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module5_es_js__ = __webpack_require__("./src/module5.es.js");
console.log('index');

Object(__WEBPACK_IMPORTED_MODULE_0__module5_es_js__["a" /* get */])();

/***/ }),

/***/ "./src/module5.es.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = get;
/* unused harmony export post */ //这里在压缩的时候会删除掉
function get() {
  console.log('get');
}
function post() {
  console.log('post');
}

/***/ })

/******/ })
```

打开 `UglifyJsPlugin`

```javascript
new UglifyJsPlugin({})
```

```javascript
!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s="./src/index.js")}({"./src/index.js":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("./src/module5.es.js");console.log("index"),Object(r.a)()},"./src/module5.es.js":function(e,n,t){"use strict";n.a=function(){console.log("get")}}});
```

分析以上打包结果，可以看到，虽然引用了 `post`,但是没有用到 `post`这个方法，所以在压缩的时候，会将其去掉；