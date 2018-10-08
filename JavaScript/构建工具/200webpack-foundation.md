---
title: webpack foundation
date: 2017-04-27 12:36:00
categories: webpack
tags : webpack
comments : true 
updated : 
layout : 
---

## webpack.config.js解析

### 0 context

基础目录，绝对路径，默认值是 cwd():当前执行 node 的目录；

用于从webpack.config.js中解析其他项配置的基础目录，比如解析 entry 和 lorder 就是以context 路径为基准进行解析的；

### 1 entry

entry 对象是用于 webpack 查找启动并构建 bundle。其上下文是入口文件所处的目录的绝对路径的字符串。

如果传入一个**字符串或字符串数组**，chunk 会被命名为 `main`。如果传入一个对象，**则每个键(key)会是 chunk 的名称**，该值描述了 chunk 的入口起点。

* 字符串 `entry: '某模块'` 表示一个单一模块作为起点(当然，单一入口也可以用后边两种写)，把这个模块需要的东西打包成一堆
* 数组 `entry: ['模块1', '模块2']`

 模块1与模块2互相之间并没有依赖，但是我们还想把他们打包在一起，此时就用数组值的方式，webpack从左到右把各个模块及他们的依赖打包在一起（[第一堆，第二堆]），然后从左到右首尾相连的拼接成一个文件。最终也是打包成一堆。

* 对象 `entry:{path1,'',path2:''}`
* 动态入口： `() => '/demo'`

```
context: path.resolve(__dirname, "app")
```

```javascript
const config = {
  entry: './path/to/my/entry/file.js'
};

module.exports = config;
```

```javascript
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

### 2 output  `object`  

output对象

```javascript
const config = {
  output: {
    filename: 'bundle.js',
    path: __dirname+'/build/'
  }
};

module.exports = config;
```

注意output.path提供打包后的文件存放的**绝对路径地址** ; output.filename提供了打包后文件的名字;

- `[name]`最简单，就是在entry里边的属性名
- `[hash]` is replaced by the hash of the compilation，代表的是整个构建之后的hash值，
- `[chunkhash]`is replaced by the hash of the chunk，简单来讲代表的是每一个模块（chunk）根据其内容就算出来的hash值，如果模块的内容不变，那么hash值就不会改变，

webpack-dev-server 也会默认从 `publicPath` 为基准，使用它来决定在哪个目录下启用服务，来访问 webpack 输出的文件。

 [参考](http://www.cnblogs.com/ihardcoder/p/5623411.html)

### 3 module

这些选项决定了如何处理项目中的[不同类型的模块](https://doc.webpack-china.org/concepts/modules)。

loader 用于对模块的源代码进行转换。loader 可以使你在 `require()` 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你在 JavaScript 中 `require（）` CSS文件！

```javascript
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

```javascript
//webpackconfig.js
module.exports = {
  module: {
    rules: [
      {test: /\.css$/, use: 'css-loader'},
      {test: /\.ts$/, use: 'ts-loader'}
    ]
  }
};
```

**如何使用loaders**有以下三种方式

- 通过配置
- 在 `require` 语句中显示使用
- 通过 CLI



通过 `webpack.config.js`

[`module.rules`](https://doc.webpack-china.org/configuration/module/#module-rules) 允许你在 webpack 配置中指定几个 loader。 这是展示 loader 的一种简明的方式，并且有助于使代码变得简洁。而且对每个相应的 loader 有一个完整的概述。

**Loaders can be chained by passing multiple loaders, which will be applied from right to left (last to first configured).**

**对于 文件的解析  ，根据lorder的配置顺序进行，从最后一个开始往前一个一个的经过loader;**

```
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }

```

通过 `require`

可以在 `require` 语句（或 `define`, `require.ensure`, 等语句）中指定 loader。使用 `!` 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

```
require('style-loader!css-loader?modules!./styles.css');

```

通过前置所有规则及使用 `!`，可以对应覆盖到配置中的任意 loader。

选项可以传递查询参数，就像在 web 中那样（`?key=value&foo=bar`）。也可以使用 JSON 对象（`?{"key":"value","foo":"bar"}`）。

>  尽可能使用 `module.rules`，因为这样可以在源码中减少引用，并且可以更快调试和定位 loader，避免代码越来越糟。

通过 CLI

可选项，你也可以通过 CLI 使用 loader：

```
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'

```

这会对 `.jade` 文件使用 `jade-loader`，对 `.css` 文件使用 [`style-loader`](https://doc.webpack-china.org/loaders/style-loader) 和 [`css-loader`](https://doc.webpack-china.org/loaders/css-loader)

### 4 plugins

由于 **plugin** 可以携带参数/选项，你必须在 wepback 配置中，向 `plugins` 属性传入 `new` 实例。

根据你如何使用 webpack，这里有多种方式使用插件。

```javascript
//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

### 5 target 

因为服务器和浏览器代码都可以用 JavaScript 编写，所以 webpack 提供了多种*构建目标(target)*，你可以在你的 webpack [配置](https://doc.webpack-china.org/configuration)中设置。

高速webpack这个程序的目标环境是什么

尽管 webpack 不支持向 `target` 传入多个字符串，你可以通过打包两份分离的配置来创建同构的库：

```javascript
//webpack.config.js
var path = require('path');
var serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

var clientConfig = {
  target: 'web', // <=== 默认是 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

`target`描述

`async-node`编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）

~~`atom`~~`electron-main` 的别名

`electron``electron-main` 的别名

`electron-main`编译为 [Electron](http://electron.atom.io/) 渲染进程，使用 `JsonpTemplatePlugin`, `FunctionModulePlugin` 来为浏览器环境提供目标，使用 `NodeTargetPlugin` 和 `ExternalsPlugin` 为 CommonJS 和 Electron 内置模块提供目标。

`node`编译为类 Node.js 环境可用（使用 Node.js `require` 加载 chunk）

`node-webkit`编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 [`nw.gui`](http://docs.nwjs.io/en/latest/) 导入（实验性质）

`web`编译为类浏览器环境里可用**（默认）**

`webworker`编译成一个 WebWorker

例如，当 *target* 设置为 `"electron"`，*webpack* 引入多个 electron 特定的变量。有关使用哪些模板和 externals 的更多信息，你可以[直接参考 webpack 源码](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsApply.js#L70-L185)。

### 6 命令

* 如果存在 `webpack.config.js`，`webpack` 命令将默认选择使用它
* 通过npm配合使用,改变package.json文件

```javascript
  "scripts": {
    "example": "babel-node"
  },
    //可以通过  npm run example   执行   babel-node命令
```

或者

```javascript
 "scripts": {
    "build": "webpack"
  },
    // 可以通过  npm run build  执行 webpack 命令
```

