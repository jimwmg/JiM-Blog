---
title:  babel的作用
date: 2018-01-10
categories: babel
---

### 1 为了使我们的ES6. ES7的代码可以兼容到上古浏览器，需要通过babel转化为上古浏览器可以识别的代码，比如import. export class等

先来看下基本实现：[转化网址](https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=JYWwDg9gTgLgBAWQJ4IgEwK4BsCmcBmUEIcARCCutjqQFBA&debug=false&circleciRepo=&evaluate=false&fileSize=false&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=6.26.0)

```javascript
import MyModule from "myModule"
//转化后
"use strict";

var _myModule = require("myModule");//加载该模块，其实就是加载该模块的exports属性

var _myModule2 = _interopRequireDefault(_myModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
```

```javascript
export default MyModule
//转化后
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MyModule;
```

```javascript
export var firstName = 'K';
//转化后
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var firstName = exports.firstName = 'K';
```

以上的转化就是ES6   ES7的语法转化为es2015的语法，但是还无法兼容IE8,原因如下

* 转化后的代码对象属性值含有default关键字，IE8不支持
* 转化后的代码使用了Object.defineProperty方法，IE8根本没有实现,并且不让别人访问或修改

###2 解决方案

* [es3ify](https://www.npmjs.com/package/es3ify):Browserify transform to convert quote reserved words in property keys for compatibility with ES3 JavaScript engines like IE8. In addition, trailing commas in array and object literals are removed.

  打包过程中将一些保留字，比如class,default等转化为es3可以接受的形式,也就是说将关键字作为属性值的时候，通过es3ify处理之后，可以变成双引号包裹的形式；

例子：

例如class,default等关键字如果单独声明出来,比较常见的是babel转化import时会出现这句话

babel处理之后：

```javascript
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
```

所以在将代码经过babel处理之后，还需要经过es3ify在此进行处理

```javascript
npm i es3ify-loader --save

//在webpack中
{
         test: /\.js$/,
         loaders: ['es3ify','babel'] //es3ify必须放在babel前
},
//或者
{
    postLoaders: [ //postLoaders表明在loader之后
      { test: /\.js$/, loader: 'es3ify' }
    ]
}
```

es3ify处理之后：

```javascript
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

```

```javascript
// In 
var x = {class: 2,};
x.class = [3, 4,];
 
// Out: 
var x = {"class": 2};
x["class"] = [3, 4];
```

以上功能也可以通过以下两个babel插件实现

1. <http://babeljs.io/docs/plugins/transform-es3-member-expression-literals/>
2. <http://babeljs.io/docs/plugins/transform-es3-property-literals/>

* [babel-plugin-transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs)

```babelrc
{
  "plugins": [
    ["transform-es2015-modules-commonjs", {
      "loose": true
    }]
  ]
}

```

```javascript
export default MyModule
//转化后
"use strict";
exports.default = MyModule;
exports.__esModule = true;
```

###3 总结下以上两个解决方案解决的问题，发现还是没有解决IE8不支持的Object.defineProperty

解决方案：

* [es5-shim](https://www.npmjs.com/package/es5-shim):`es5-shim.js` and `es5-shim.min.js` monkey-patch a JavaScript context to contain all EcmaScript 5 methods that can be faithfully emulated with a legacy JavaScript engine. **Note:** As `es5-shim.js` is designed to patch the native Javascript engine, it should be the library that is loaded first.

  ​

  `es5-sham.js` and `es5-sham.min.js` monkey-patch other ES5 methods as closely as possible. For these methods, as closely as possible to ES5 is not very close. Many of these shams are intended only to allow code to be written to ES5 without causing run-time errors in older engines. In many cases, this means that these shams cause many ES5 methods to silently fail. Decide carefully whether this is what you want. **Note:** `es5-sham.js` requires `es5-shim.js` to be able to work properly.

例子：

```javascript
/**
 * CANNOT use `import` to import `es5-shim`,
 * because `import` will be transformed to `Object.defineProperty` by babel,
 * `Object.defineProperty` doesn't exists in IE8,
 * (but will be polyfilled(仿造) after `require('es5-shim')` executed).
 */

require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

/**
 * CANNOT use `import` to import `react` or `react-dom`,
 * because `import` will run `react` before `require('es5-shim')`.
 */
// import React from 'react';
// import ReactDOM from 'react-dom';

const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('app')
);

```

[详见](https://github.com/xcatliu/react-ie8)