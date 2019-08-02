---

---

### 1 webpack.config.js

Webpack  4.0

```javascript
const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  mode: "production", // enable many optimizations for production builds
  mode: "development", // enabled useful tools for development
  mode: "none", // no defaults
  // Chosen mode tells webpack to use its built-in optimizations accordingly.

  entry: "./app/entry", // string | object | array
  entry: ["./app/entry1", "./app/entry2"],
  entry: {
    a: "./app/entry-a",
    b: ["./app/entry-b1", "./app/entry-b2"]
  },
  // 这里应用程序开始执行
  // webpack 开始打包

  output: {
    // webpack 如何输出结果的相关选项

    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）

    filename: "bundle.js", // string
    filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
    filename: "[chunkhash].js", // 用于长效缓存
    // 「入口分块(entry chunk)」的文件名模板（出口分块？）

    publicPath: "/assets/", // string
    publicPath: "",
    publicPath: "https://cdn.example.com/",
    // 输出解析文件的目录，url 相对于 HTML 页面

    library: "MyLibrary", // string,
    // 导出库(exported library)的名称

    libraryTarget: "umd", // 通用模块定义
        libraryTarget: "umd2", // 通用模块定义
        libraryTarget: "commonjs2", // exported with module.exports
        libraryTarget: "commonjs-module", // 使用 module.exports 导出
        libraryTarget: "commonjs", // 作为 exports 的属性导出
        libraryTarget: "amd", // 使用 AMD 定义方法来定义
        libraryTarget: "this", // 在 this 上设置属性
        libraryTarget: "var", // 变量定义于根作用域下
        libraryTarget: "assign", // 盲分配(blind assignment)
        libraryTarget: "window", // 在 window 对象上设置属性
        libraryTarget: "global", // property set to global object
        libraryTarget: "jsonp", // jsonp wrapper
    // 导出库(exported library)的类型

    /* 高级输出配置（点击显示） */

    pathinfo: true, // boolean
    // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。

    chunkFilename: "[id].js",
    chunkFilename: "[chunkhash].js", // 长效缓存(/guides/caching)
    // 「附加分块(additional chunk)」的文件名模板

    jsonpFunction: "myWebpackJsonp", // string
    // 用于加载分块的 JSONP 函数名

    sourceMapFilename: "[file].map", // string
    sourceMapFilename: "sourcemaps/[file].map", // string
    // 「source map 位置」的文件名模板

    devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
    // 「devtool 中模块」的文件名模板

    devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
    // 「devtool 中模块」的文件名模板（用于冲突）

    umdNamedDefine: true, // boolean
    // 在 UMD 库中使用命名的 AMD 模块

    crossOriginLoading: "use-credentials", // 枚举
    crossOriginLoading: "anonymous",
    crossOriginLoading: false,
    // 指定运行时如何发出跨域请求问题

    /* 专家级输出配置（自行承担风险） */

    devtoolLineToLine: {
      test: /\.jsx$/
    },
    // 为这些模块使用 1:1 映射 SourceMaps（快速）

    hotUpdateMainFilename: "[hash].hot-update.json", // string
    // 「HMR 清单」的文件名模板

    hotUpdateChunkFilename: "[id].[hash].hot-update.js", // string
    // 「HMR 分块」的文件名模板

    sourcePrefix: "\t", // string
    // 包内前置式模块资源具有更好可读性
  },

  module: {
    // 关于模块配置

    rules: [
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

        use: [
          // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
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

    noParse: [
      /special-library\.js$/
    ],
    // 不解析这里的模块

    unknownContextRequest: ".",
    unknownContextRecursive: true,
    unknownContextRegExp: /^\.\/.*$/,
    unknownContextCritical: true,
    exprContextRequest: ".",
    exprContextRegExp: /^\.\/.*$/,
    exprContextRecursive: true,
    exprContextCritical: true,
    wrappedContextRegExp: /.*/,
    wrappedContextRecursive: true,
    wrappedContextCritical: false,
    // specifies default behavior for dynamic requests
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）

    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // 用于查找模块的目录

    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名

    alias: {
      // 模块别名列表

      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"

      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"

      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    /* 可供选择的别名语法（点击展示） */
    alias: [
      {
        name: "module",
        // 旧的请求

        alias: "new-module",
        // 新的请求

        onlyModule: true
        // 如果为 true，只有 "module" 是别名
        // 如果为 false，"module/inner/path" 也是别名
      }
    ],

    /* 高级解析选项（点击展示） */

    symlinks: true,
    // 遵循符号链接(symlinks)到新位置

    descriptionFiles: ["package.json"],
    // 从 package 描述中读取的文件
		
    mainFields: ["main"],
当从 npm 包中导入模块时（例如，import * as D3 from "d3"），此选项将决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同。
当 target 属性设置为 webworker, web 或者没有指定，默认值为：
    mainFields: ["browser", "module", "main"]
  对于其他任意的 target（包括 node），默认值为：
		mainFields: ["module", "main"]

    // 从描述文件中读取的属性
    // 当请求文件夹时

    aliasFields: ["browser"],
    // 从描述文件中读取的属性
    // 以对此 package 的请求起别名

    enforceExtension: false,
    // 如果为 true，请求必不包括扩展名
    // 如果为 false，请求可以包括扩展名

    moduleExtensions: ["-module"],
    enforceModuleExtension: false,
    // 类似 extensions/enforceExtension，但是用模块名替换文件

    unsafeCache: true,
    unsafeCache: {},
    // 为解析的请求启用缓存
    // 这是不安全，因为文件夹结构可能会改动
    // 但是性能改善是很大的

    cachePredicate: (path, request) => true,
    // predicate function which selects requests for caching

    plugins: [
      // ...
    ]
    // 应用于解析器的附加插件
  },

  performance: {
    hints: "warning", // 枚举
    hints: "error", // 性能提示中抛出错误
    hints: false, // 关闭性能提示
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: "source-map", // enum
  devtool: "inline-source-map", // 嵌入到源文件中
  devtool: "eval-source-map", // 将 SourceMap 嵌入到每个模块中
  devtool: "hidden-source-map", // SourceMap 不在源文件中引用
  devtool: "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
  devtool: "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
  devtool: "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。

  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  target: "web", // 枚举
  target: "webworker", // WebWorker
  target: "node", // node.js 通过 require
  target: "async-node", // Node.js 通过 fs and vm
  target: "node-webkit", // nw.js
  target: "electron-main", // electron，主进程(main process)
  target: "electron-renderer", // electron，渲染进程(renderer process)
  target: (compiler) => { /* ... */ }, // 自定义
  // 包(bundle)应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)

  externals: ["react", /^@angular\//],
  externals: "react", // string（精确匹配）
  externals: /^[a-z\-]+($|\/)/, // 正则
  externals: { // 对象
    angular: "this angular", // this["angular"]
    react: { // UMD
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    }
  },
  externals: (request) => { /* ... */ return "commonjs " + request }
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

  stats: "errors-only",
  stats: { //object
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    // ...
  },
  // 精确控制要显示的 bundle 信息

  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },

  plugins: [
    // ...
  ],
  // 附加插件列表


  /* 高级配置（点击展示） */

  resolveLoader: { /* 等同于 resolve */ }
  // 独立解析选项的 loader

  parallelism: 1, // number
  // 限制并行处理模块的数量

  profile: true, // boolean
  // 捕获时机信息

  bail: true, //boolean
  // 在第一个错误出错时抛出，而不是无视错误。

  cache: false, // boolean
  // 禁用/启用缓存

  watch: true, // boolean
  // 启用观察

  watchOptions: {
    aggregateTimeout: 1000, // in ms
    // 将多个更改聚合到单个重构建(rebuild)

    poll: true,
    poll: 500, // 间隔单位 ms
    // 启用轮询观察模式
    // 必须用在不通知更改的文件系统中
    // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
  },

  node: {
    // Polyfills and mocks to run Node.js-
    // environment code in non-Node environments.

    console: false, // boolean | "mock"
    global: true, // boolean | "mock"
    process: true, // boolean
    __filename: "mock", // boolean | "mock"
    __dirname: "mock", // boolean | "mock"
    Buffer: true, // boolean | "mock"
    setImmediate: true // boolean | "mock" | "empty"
  },

  recordsPath: path.resolve(__dirname, "build/records.json"),
  recordsInputPath: path.resolve(__dirname, "build/records.json"),
  recordsOutputPath: path.resolve(__dirname, "build/records.json"),
  // TODO

}
```

### 2 各个配置详解

[mode](https://www.webpackjs.com/concepts/mode/):提供 `mode` 配置选项，告知 webpack 使用相应模式的内置优化。

只在配置中提供 `mode` 选项：

```javascript
module.exports = {
  mode: 'production'
};
```

或者从 [CLI](https://www.webpackjs.com/api/cli/) 参数中传递：

```bash
webpack --mode=production
```

支持以下字符串值：

选项

描述

```
development
```

会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。

```
production
```

会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.

> 记住，只设置 `NODE_ENV`，则不会自动设置 `mode`。