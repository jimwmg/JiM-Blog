---
title: webpack基础
date: 2018-01-09
categories: javascript
---

### 1 webpack

它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用

### 2 webpack的使用方式

#### 2.1 直接通过webpack -cli 命令行使用[详见](https://doc.webpack-china.org/api/cli/)

```javascript
webpack entryName outputName
webpack src/index.js dist/bundle.js
webpack --profile
webpack --progress --profile
wepack: 基本打包
wepack -w: 提供watch
wepack -p: 打包后文件压缩
wepack -d 提供SourceMap
wepack --colors: 结果带彩色,用时久的显示红色
wepack --profile: 输出性能数据
wepack --display-modules: 默认node_modules的模块隐藏,加上这个可以显示
webpack --progress --colors --watch监听变化
webpack index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js'
```

比如上面这样的通过命令行的应用，这当然不是我们想要的结果

#### 2.2 通过配置文件[详见](https://doc.webpack-china.org/configuration/)

`webpack命令` ： 默认就会执行 webpack.config.js文件，其实等价于 `webpack --config webpack.config.js`

所以可以通过`webpack --config otherConfig.js` 来执行其他符合webpack配置规范的文件

以上webpack的基本使用方式也就介绍完毕了，接下来详细介绍下如何通过webpack配置文件来打包我们的应用

### 3 webpack配置文件

#### 3.1 webpack配置为对象,就已官网的例子来看

我们的代码会经过loaders==>plugins

```javascript
const path = require('path');

module.exports = {
  //==> 1 入口
  entry: "./app/entry", // string | object | array  对象代表多页面程序
  // 这里应用程序开始执行
  // webpack 开始打包
  //==> 2 输出
  output: {
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）

    filename: "bundle.js", // string
    // 「入口分块(entry chunk)」的文件名模板（出口分块？） 还可以通过[name] /[chunk]/[id]来进行命名

    publicPath: "/assets/", // string
    // 输出解析文件的目录，url 相对于 HTML 页面

    library: "MyLibrary", // string,
    // 导出库(exported library)的名称

    libraryTarget: "umd", // 通用模块定义
    // 导出库(exported library)的类型

    /* 高级输出配置（点击显示） */
  },
  //==> 3 模块
  module: {
    // 关于模块配置

    rules: [ //rules数组中的每一项称为rule对象
      //rule条件包括 test. include exclude or and not 等值
      //rule结果表示对匹配到rule条件的文件所要执行的loader和parser
      // 模块规则（配置 loader、解析器等选项）

      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include

        issuer: { test, include, exclude },
        // issuer 条件（导入源）

        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）

        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 webpack 1 升级指南。

        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },

      {
        test: /\.html$/,
        test: "\.html$"
        //rule.use ,用来替换原来的rule.loaders，对于匹配到的文件应用多个loaders
        //use:['style-loader','css-loader','less-loader'] 从右向左执行loader过滤
        use: [
        'style-loader',
        {
        loader: 'css-loader',
        options: {
        importLoaders: 1
      }
      },
      {
      loader: 'less-loader',
      options: {
      noIeCompat: true
      }
      }
    ]

  },

  { oneOf: [ /* rules */ ] },
  // 只使用这些嵌套规则之一

  { rules: [ /* rules */ ] },
  // 使用所有这些嵌套规则（合并可用条件）

  { resource: { and: [ /* 条件 */ ] } },
  // 仅当所有条件都匹配时才匹配

  { resource: { or: [ /* 条件 */ ] } },
  { resource: [ /* 条件 */ ] },
  // 任意条件匹配时匹配（默认为数组）

  { resource: { not: /* 条件 */ } }
   // 条件不匹配时匹配
   ],

   /* 高级模块配置（点击展示） */
  },
  //==> 4 resolve
  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
//比如import React from 'react' 就会从node_modules里面去找，也就是说从modules中去找；这里可以设置模块查找的优先级，此时需要明确了解node查询你模块的过程
    modules: [//告诉 webpack 解析模块时应该搜索的目录。https://doc.webpack-china.org/concepts/module-resolution/
      "node_modules",
      path.resolve(__dirname, "app")
    ],//搜索模块的时候会先从node_modules中搜索，然后再去path.resolve(__dirname, "app")目录中搜索
      // 用于查找模块的目录，默认值：modules: ["node_modules"]，如果想要优先于node_modules搜索
      //modules: [path.resolve(__dirname, "src"), "node_modules"]
      extensions: [".js", ".json", ".jsx", ".css"],
        // 使用的扩展名 ，可以使得我们引用文件的时候不加后缀，默认值extensions: [".js", ".json"]
      alias: {
          Utilities: path.resolve(__dirname, 'src/utilities/'),
          Templates: path.resolve(__dirname, 'src/templates/'),
          xyz$: path.resolve(__dirname, 'path/to/file.js')
        }
    //启用别名之后，在引入模块的时候就会便捷很多
    //import Utility from '../../utilities/utility';变为
    //import Utility from 'Utilities/utility';
    //	可以在别名后面加 $ 符号，表示精确匹配
    /* 可供选择的别名语法（点击展示） */

    /* 高级解析选项（点击展示） */
  },
 //==4.2 这组选项与上面的 resolve 对象的属性集合相同，但仅用于解析 webpack 的 loader 包。默认
  resolveLoader: { /* 等同于 resolve */ }
/*** 默认值
{
  modules: [ 'node_modules' ],
  extensions: [ '.js', '.json' ],
  mainFields: [ 'loader', 'main' ]
}
mainFields：当从 npm 包中导入模块时（例如，import * as D3 from "d3"），此选项将决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同。

*/
  // 独立解析选项的 loader
//==5 性能
    performance: {
      hints: "warning", // 枚举
        maxAssetSize: 200000, // 整数类型（以字节为单位）
          maxEntrypointSize: 400000, // 整数类型（以字节为单位）
            assetFilter: function(assetFilename) {
              // 提供资源文件名的断言函数
              return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
            }
    },
//==> 6 devtool
      devtool: "source-map", // enum
        // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
        // 牺牲了构建速度的 `source-map' 是最详细的。
//==> 7 context
       context: __dirname, // string（绝对路径！）
          // webpack 的主目录
          // entry 和 module.rules.loader 选项
          // 相对于此目录解析
//==> 构建目标 ：node. web(默认值) 因为服务器和浏览器代码都可以用 JavaScript 编写，所以 webpack 提供了多种构建目标(target)
        target: "web", // 枚举
            // 包(bundle)应该运行的环境
            // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)
//==>8 外部扩展
        externals: ["react", /^@angular\//],
              // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
//==> 9 统计 ：选项能让你准确地控制显示哪些包的信息。对于 webpack-dev-server ，这个属性要放在 devServer 对象里。
        stats: "errors-only",
                // 精确控制要显示的 bundle 信息
//==>10 
        devServer: {
       //如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
                  proxy: { // proxy URLs to backend development server
                    '/api': 'http://localhost:3000'
                  },
                   contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
                   compress: true, // enable gzip compression
                   historyApiFallback: true, // true for index.html upon 404, object for multiple paths
                   hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
                   host:"192.168.4.150",//自己的ip地址（如果希望服务器外部电脑可以访问，可以指定ip值）默认值是localhost
                   https: false, // true for self-signed, object for cert authority
                   noInfo: true, // only errors & warns on hot reload
                                // ...
                },
//==>11 插件，我们的代码loaders==>plugins
        plugins: [
                    // ...
                  ],
                  
//==>12 node 这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行。

       node: {
              // Polyfills and mocks to run Node.js-
              // environment code in non-Node environments.
				 // prevent webpack from injecting useless setImmediate polyfill because Vue
              // source contains it (although only uses it if it's native).
              setImmediate: false,
              // prevent webpack from injecting mocks to Node native modules
              // that does not make sense for the client
              dgram: 'empty',
              fs: 'empty',
              net: 'empty',
              tls: 'empty',
              child_process: 'empty'
              console: false, // boolean | "mock"
              global: true, // boolean | "mock"
               process: true, // boolean
              __filename: "mock", // boolean | "mock"
              __dirname: "mock", // boolean | "mock"
              Buffer: true, // boolean | "mock"
         },

recordsPath: path.resolve(__dirname, "build/records.json"),
recordsInputPath: path.resolve(__dirname, "build/records.json"),
recordsOutputPath: path.resolve(__dirname, "build/records.json"),
                                      // TODO
 }
```

[node加载模块的过程](http://nodejs.cn/api/modules.html)

node的模块分为：文件模块，目录模块，系统模块（核心模块）

### 4 webpack配置文件不同的支持导出形式，比如导出一个对象，导出一个函数，导出一个数组对象等；

#### 导出一个对象

webpack会执行这个配置

```javascript
module.exports ={
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  entry: './app.js',
  mode: 'production',
}

```

#### 导出一个数组对象

webpack会执行者两个配置

```javascript
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  entry: './app.js',
  mode: 'production',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  entry: './app.js',
  mode: 'production',
}]

```

#### 导出一个函数

对于需要对不同的构建环境进行的不同为webpack的配置，此时可以根据环境对象来进行判断，通过导出一个函数来执行不同的配置；

```javascript
module.exports = function(env, argv) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-maps' : 'eval',
     plugins: [
       new webpack.optimize.UglifyJsPlugin({
        compress: argv['optimize-minimize'] // 只有传入 -p 或 --optimize-minimize
       })
     ]
  };
};

```

#### 导出一个promise

webpack 将运行由配置文件导出的函数，并且等待 Promise 返回。便于需要异步地加载所需的配置变量。

```javascript
module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        entry: './app.js',
        /* ... */
      })
    }, 5000)
  })
}

```





