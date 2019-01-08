### 1 babel

基本概念：babel is a javascript compiler，顾名思义，bable可以将javascript代码转化成比较先进的javascript代码；

[babel官网](https://babeljs.io/)

比如

```javascript
let youTurn = 'Type some code here'
```

to

```javascript
var youTurn = 'Type some code here'
```

也就是说，babel可以将一些比较先进的javascript语法（ES6/ES7）转化成 （ES5）之类的比较低版本的javascript,是一个javascript源码 to javasciript 源码级别的转化工具；

### 2 转化方式

#### 2.1 babel-cli 命令行转化

[babel-cli官方文档](https://babeljs.io/docs/en/babel-cli)

[babel-cli教程]

[babel-plugins插件列表](https://babeljs.io/docs/en/plugins)

```
mkdir babel-learn
npm init 
npm install --save-dev @babel/core @babel/cli
```

新建一个文件夹 `src`

```
-babel-learn
 -src
 	-example-cli.js
 -package.json
```

现在假定我们的项目下有一个 `script.js` 文件，内容是：

```js
let fun = () => console.log('hello babel.js')
```

我们试试运行

```bash
$ npx babel src/example-cli.js
let fun = () => console.log('hello babel.js');
```

还是原来的代码，没有任何变化。说好的编译呢？

这个调整则是在 [babel 6](https://babeljs.io/blog/2015/10/29/6.0.0) 里发生的。Babel 6 做了大量模块化的工作，将原来集成一体的各种编译功能分离出去，独立成插件。这意味着，默认情况下，当下版本的 babel 不会编译代码。

`package.json`

```
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"build":"npx babel src/example-cli.js -d lib --plugins @babel/plugin-transform-arrow-functions"
},
```

我们想要转化声明样的语法，就可以从上面的插件列表中 npm install 某个插件，然后通过 `--plugins xxx`进行那个语法的支持转化；

比如要转化 `async  await`

```
npm i @babel/plugin-transform-async-to-generator -D
"npx babel src/example-cli.js -d lib  --plugins @babel/plugin-transform-async-to-generator"
```

#### 2.2  配置文件 `.babelrc`

随着各种插件的加入，我们的命令行会越来越长。此时可以通过新建一个 `.babelrc`文件，把各种命令行参数统一到其中，比如上面通过命令行转化的 箭头函数以及 `async await`

`.babelrc`

```javascript
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}

```

此时再次执行

```
npm i -D @babel/plugin-transform-arrow-functions
npx babel src/example-cli.js -d lib
```

babel会自动读取 `.babelrc`里面的配置并应用到编译中；

当然了，用到某个插件还是需要手动安装这个插件；

如果某个版本的浏览器，比如IE不支持`class语法 async await 箭头函数 let const等等，那么就需要安装并且配置所有的这些插件`

`.babelrc`

```javascript
{
  "presets": [],
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-classes",
    "@babel/plugin-transform-async-to-generator"
  ]
}
```

只是，这样安装插件、配置 `.babelrc` 的过程非常乏味，而且容易出错。通常，我们不会关心到具体的某个 ES2015 特性支持情况这个层面，我们更关心浏览器版本这个层面。

你说，我不想关心 babel 插件的配置，我只希望，给 babel 一个**我想支持 IE 10** 的提示，babel 就帮我编译出能在 IE 10 上正常运行的 JavaScript 代码。

##### plugins/presets排序

也许你会问，或者你没注意到，我帮你问了，plugins和presets编译，也许会有相同的功能，或者有联系的功能，按照怎么的顺序进行编译？答案是会按照一定的顺序。

- 具体而言，plugins优先于presets进行编译。
- plugins按照数组的index增序(从数组第一个到最后一个)进行编译。
- presets按照数组的index倒序(从数组最后一个到第一个)进行编译。因为作者认为大部分会把presets写成`["es2015", "stage-0"]`。具体细节可以看[这个](https://github.com/babel/notes/blob/master/2016-08/august-01.md#potential-api-changes-for-traversal)。

[babel/preset-env](https://babeljs.io/docs/en/babel-preset-env/)

[.babelrc中的preset和plugin](https://excaliburhan.com/post/babel-preset-and-plugins.html)

如果我们不想一个个插件的去配置这些，那么可以使用preset,简单理解plugins是一个个插件支持一个个语法，preset是一个插件的集合，安装这个集合就相当于安装各类babel插件；

Don't want to assemble your own set of plugins? No problem! Presets can act as an array of Babel plugins or even a sharable [`options`](https://babeljs.io/docs/en/options) config.[ ](https://babeljs.io/docs/en/presets#official-presets)

```
$ npm install --save-dev @babel/preset-env
```

修改`.babelrc`

```javascript
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    
  ]
}
```

```
npx babel src/example-cli.js -d lib
```

可以看到一个`@babel/preset-env` 所能达到的效果确实是和多个plugins达到的效果是一致的；

> Without any configuration options, babel-preset-env behaves exactly the same as babel-preset-latest (or babel-preset-es2015, babel-preset-es2016, and babel-preset-es2017 together).

如果我们只想支持某个版本，比如chrom最新版本

```javascript
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 1 Chrome versions"]
      }
    }]
  ]
}
```

```
npx babel src/example-cli.js -d lib
```

最新版本的 Chrome 已经支持箭头函数、`class`、`const`，所以 babel 在编译过程中，不会编译它们。这也是为什么我把 `@babel/preset-env` 称为 JavaScript 的 **Autoprefixer**。

**注意以上 preset和plugins的配置：如果目标浏览器不支持某些语法，比如箭头函数，let const 或者某些API :比如Object.assign  Array.from 等都需要配置对应的plugins进行转码才能在目标浏览器上得到支持**

但是对于很多新的javascript语法，如果不想每个语法都通过plugins进行;可以通过配置 preset 集合；

#### 2.3 polyfill的配置

对于 `.babelrc`如下配置

```javascript
{
  "presets": [
    ["@babel/preset-env",{
     
    }]
  ],
  "plugins":[]
}

```

源文件

```javascript

//语法：比如async await let const 等等
let o1 = {
  name: 'jim'
};
let o2 = {
  age: "12"
};
async function f1(){
  await f2()
}
async function f2(){
  console.log()
}
let fun = () => {}
//API：比如Object.assign  Array.from
Object.assign(o1, o2);
Array.from([1, 2, 3]);
```

会被转化成

```javascript
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//语法：比如async await let const 等等
var o1 = {
  name: 'jim'
};
var o2 = {
  age: "12"
};

function f1() {
  return _f.apply(this, arguments);
}

function _f() {
  _f = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return f2();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _f.apply(this, arguments);
}

function f2() {
  return _f2.apply(this, arguments);
}

function _f2() {
  _f2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log();

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _f2.apply(this, arguments);
}

var fun = function fun() {}; //API：比如Object.assign  Array.from


Object.assign(o1, o2);
Array.from([1, 2, 3]);
```

可以看到babel这个时候只是对 语法进行了转换 （let const async await class等），并不能保证javascript一些新的API,比如`Object.assign Array.from`等的支持；

具体的API见下 [javascript新的API](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/definitions.js),很多低版本的浏览器可能不支持这些；

如果某个版本的浏览器不支持`Object.assign `，那么就需要配置这个 `Object.assign`的polyfill

#### 2.3.1 通过plugins配置 api 的 polyfill

源文件

```javascript
let o1 = {name:'jim'}
let o2 = {age:"12"}
Object.assign(o1,o2);
```

```javascript
{
  "presets": [
    ["@babel/preset-env",{
     
    }]
  ],
  "plugins":[
    "@babel/plugin-transform-object-assign"
  ]
}

```

同样的源文件转换之后，会多了如下 `Object.assign`的polyfill

```javascript
"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

......
```

但是此时 `Array.from`可能还不被某些浏览器支持，一个个插件的去配置，显然太繁琐；

同时每个用到的 API 都会在每次用到的地方重复声明`_extends`这个函数，这个显然不是理想的状态；

`@babel/plugin-transform-runtime`可以将这些重复的声明比如 `_extends`进行分离

这个plugin会重写用户的代码；

```javascript
{
  "presets": [
    ["@babel/preset-env",{
    }]
  ],
  "plugins":[
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ],
    "@babel/plugin-transform-object-assign"
  ]
}

```



```javascript
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var o1 = {
  name: 'jim'
};
var o2 = {
  age: "12"
};
(0, _extends2.default)(o1, o2);
```

**需要注意的是`@babel/plugin-transform-runtime`只能默认用户已经polyfill所有的API,比如手动提供了这个"@babel/plugin-transform-object-assign"插件;**

如果去掉用户手动polyfill的API,可以看到是没有extends的polyfill的

```javascript
{
  "presets": [
    ["@babel/preset-env",{
    }]
  ],
  "plugins":[
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ],
  ]
}


```



```javascript
"use strict";

var o1 = {
  name: 'jim'
};
var o2 = {
  age: "12"
};
Object.assign(o1, o2);
```

如果每个API的polyfill都是由用户手动添加，显然也是很繁琐的，

[@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime)

[corejs的配置](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime#corejs)

The plugin defaults to assuming that all polyfillable APIs will be provided by the user. Otherwise the [`corejs`](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime#corejs)option needs to be specified.

```javascript
{
  "presets": [
    ["@babel/preset-env",{
    }]
  ],
  "plugins":[
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2, //这里配置2
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ],
  ]
}

```

#### 2.3.2 通过 preset 配置 api 的polyfill

#### `useBuiltIns: 'usage'` (experimental)

Adds specific imports for polyfills when they are used in each file. We take advantage of the fact that a bundler will load the same polyfill only once.

这里引入的polyfill文件也是用到了哪些API就引用那些API的polyfill；

```javascript
{
  "presets": [
    ["@babel/preset-env",{
      "useBuiltIns":"usage"
    }]
  ],
  "plugins":[
    
  ]
}

```

同样源文件转化之后

```javascript
"use strict";

require("core-js/modules/es6.object.assign");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from"); //


....

```

#### 2.3.3 全局引入  @babel/polyfill

```
npm install --save @babel/polyfill
import '@babel/polyfill'
```

如前面所说的，babel-polyfill 其实包含 `regenerator runtime`、`core-js`，如果你的代码只需要其中一部分 polyfill，那么你可以考虑直接引入 `core-js` 下的特定 polyfill，不必使用 babel-polyfill 这样的庞然大物。

这正是 babel-polyfill 与 babel-runtime 的一大区别，前者改造目标浏览器，让你的浏览器拥有本来不支持的特性；后者改造你的代码，让你的代码能在所有目标浏览器上运行，但不改造浏览器。