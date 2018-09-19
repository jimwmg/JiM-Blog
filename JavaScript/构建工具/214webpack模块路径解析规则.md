---
title:  webpack模块路径解析规则
date: 2017-05-11 12:36:00
categories: javascript
tags : webpack
comments : true 
updated : 
layout : 
---

# 模块解析

##1 首先来看下webpack支持的模块类型

###模块(Modules)

[EDIT DOCUMENT**](https://github.com/webpack/webpack.js.org/edit/master/content/concepts/modules.md)

在[模块化编程](https://en.wikipedia.org/wiki/Modular_programming)中，开发者将程序分解成离散功能块(discrete chunks of functionality)，并称之为*模块*。

每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。 精心编写的*模块*提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

Node.js 从最一开始就支持模块化编程。然而，在 web，*模块化*的支持正缓慢到来。在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。webpack 基于从这些系统获得的经验教训，并将*模块*的概念应用于项目中的任何文件。

### 什么是 webpack 模块

对比 [Node.js 模块](https://nodejs.org/api/modules.html)，webpack *模块*能够以各种方式表达它们的依赖关系，几个例子如下：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()` 语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define` 和 `require` 语句
- css/sass/less 文件中的 [`@import` 语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- 样式(`url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接(image url)

>  webpack 1 需要特定的 loader 来转换 ES 2015 `import`，然而通过 webpack 2 可以开箱即用。

### 支持的模块类型

webpack 通过 *loader* 可以支持各种语言和预处理器编写模块。*loader* 描述了 webpack **如何**处理 非 JavaScript(non-JavaScript) *模块*，并且在*bundle*中引入这些*依赖*。 webpack 社区已经为各种流行语言和语言处理器构建了 *loader*，包括：

- [CoffeeScript](http://coffeescript.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESNext (Babel)](https://babeljs.io/)
- [Sass](http://sass-lang.com/)
- [Less](http://lesscss.org/)
- [Stylus](http://stylus-lang.com/)

总的来说，webpack 提供了可定制的、强大和丰富的 API，允许**任何技术栈**使用 webpack，保持了在你的开发、测试和生成流程中**无侵入性(non-opinionated)**。

## 2 webpack可以解析的文件路径

`(import`语句会执行所加载的模块，可以有下面的写法)

### 绝对路径

```javascript
import "/home/me/file";
import "C:\\Users\\me\\file";
```

由于我们已经取得文件的绝对路径，因此不需要进一步再做解析。

**也就是说不需要webpack进行路径的解析.**

### 相对路径

```javascript
import "../src/file1";
import "./file2";
```

在这种情况下，使用 `import` 或 `require` 的资源文件(resource file)所在的目录被认为是上下文目录(context directory)。在 `import/require` 中给定的相对路径，会添加此上下文路径(context path)，以产生模块的绝对路径(absolute path)。

**也就是说webpack解析该文件的时候,会以资源文件所在目录为基准进行解析;**

### 模块路径

```javascript
import "module";
import "module/lib/file";
```

* 模块将在 [`resolve.modules`](https://doc.webpack-china.org/configuration/resolve/#resolve-modules) 中指定的所有目录内搜索。 **也就是说对于模块路径,解析的时候会在node_modules目录下进行解析**

告诉 webpack 解析模块时应该搜索的目录。

绝对路径和相对路径都能使用，但是要知道它们之间有一点差异。

通过查看当前目录以及祖先路径（即 `./node_modules`, `../node_modules` 等等），相对路径将类似于 Node 查找 'node_modules' 的方式进行查找。

使用绝对路径，将只在给定目录中搜索。

`resolve.modules` defaults to:

```
modules: ["node_modules"]

```

如果你想要添加一个目录到模块搜索目录，此目录优先于 `node_modules/` 搜索：

```
modules: [path.resolve(__dirname, "src"), "node_modules"]
```

* 你可以替换初始模块路径，此替换路径通过使用 [`resolve.alias`](https://doc.webpack-china.org/configuration/resolve/#resolve-alias) 配置选项来创建一个别名。 **此时在解析模块路径的时候,就不会再去node_modules里面查找对应的模块,而是通过我们配置的路径进行查找**

比如App.js中 

```javascript
import store, { history } from 'STORE'
import routes from 'ROUTE'
```

**from后面就是要解析的路径,此处的路径是模块路径;**

webpack.config.js中

```javascript
var path = require('path'),
  webpack = require('webpack'),
  NyanProgressPlugin = require('nyan-progress-webpack-plugin');

var rootPath = path.resolve(__dirname, '..'), // 项目根目录,__diename永远获取的是当前文件相对于磁盘根目录  react-demo/  目录下
  src = path.join(rootPath, 'src'), // 开发源码目录
  env = process.env.NODE_ENV.trim(); // 当前环境
var commonPath = {
  rootPath: rootPath,
  dist: path.join(rootPath, 'dist'), // build 后输出目录
  indexHTML: path.join(src, 'index.html'), // 入口基页
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};

module.exports = {
  commonPath: commonPath,
  entry: {
    app: path.join(src, 'app.js'),

    // ================================
    // 框架 / 类库 分离打包
    // ================================
    vendor: [
      'history',
      'lodash',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk'
    ]
  },
  output: {
    path: path.join(commonPath.dist, 'static'),
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      // ================================
      // 自定义路径别名
      // ================================
      STORE: path.join(src, 'redux/store'),
      ROUTE: path.join(src, 'routes'),//对应src/routers文件夹  
    }
  }, 
};

 resolveLoader: {
    root: path.join(rootPath, 'node_modules')
  },

```

## 3一旦根据上述规则解析路径之后,解析器将检查路径是否指向文件或者目录 

* 文件 : 如果以上提到的路径(相对路径,模块路径,绝对路径),指向的是一个文件 

  * 如果文件具有文件扩展名,则将文件直接打包
  * 否则将使用[resolve.extensions]作为文件扩展名来解析,此选项告诉解析器在解析的时候能够接受那些扩展名

* 文件夹 : 如果路径指向的是一个文件夹

  - 如果文件夹中包含 `package.json` 文件，则按照顺序查找 [`resolve.mainFields`](https://doc.webpack-china.org/configuration/resolve/#resolve-mainfields) 配置选项中指定的字段。并且 `package.json` 中的第一个这样的字段确定文件路径。

  - If there is no `package.json` or if the main fields do not return a valid path, file names specified in the [`resolve.mainFiles`](https://doc.webpack-china.org/configuration/resolve/#resolve-mainfiles) configuration option are looked for in order, to see if a matching filename exists in the imported/required directory .

    如果目录中没有package.json文件,那么将会根据reslove(解析对象)中的默认配置resolve.mainFiles中的配置文件名去该目录中解析配置的文件名,默认配置如下 .

    ```
    mainFiles: ["index"]
    ```

    也就是说会import  index文件,该文件的导出的对象.

  - The file extension is then resolved in a similar way using the `resolve.extensions` option.

### 4 loaders的解析规则 

loader解析遵循与文件解析器指定的规则相同.

**但是resolveloader配置选项可以用来为Loader提供独立的解析规则**

```javascript
resolveloader : {
    modules: ["node_modules"],
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"]
}
```

### 5 从缓存中解析模块

Every filesystem access is cached, so that multiple parallel or serial requests to the same file occur faster. In [watch mode](https://webpack.js.org/configuration/watch/#watch), only modified files are evicted from the cache. If watch mode is off, then the cache gets purged before every compilation.

每一个文件都会被缓存,所以对于同一文件的并行的请求将可以更快的请求到模块,在观察者模式下,只用改变了的文件将会从缓存中抽出,如果观察者模式关闭,那么每次编译之前都会清理缓存.