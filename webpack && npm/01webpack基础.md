---
title:webpack基础

---

### 1 [webpack CLI](https://doc.webpack-china.org/api/cli) （Command Line Interface） 

#### 常用配置

```
webpack --help (webpack -h)  列出命令行所有可用的配置选项
webpack --config example.config.js
webpack 命令默认执行  webpack.config.js
```

#### 环境变量. [nodeProcess.env](http://javascript.ruanyifeng.com/nodejs/process.html#toc5)

```
webpack --env.production    # 设置 env.production == true
webpack --env.platform=web  # 设置 env.platform == "web"
webpack --env.NODE_ENV=local --env.production --progress
如果设置 env 变量，却没有赋值，--env.production 默认将 --env.production 设置为 true
```
#### [其他配置](https://doc.webpack-china.org/api/cli#%E8%BE%93%E5%87%BA%E9%85%8D%E7%BD%AE)

[配置文件多种配置类型-对象，函数](https://doc.webpack-china.org/configuration/configuration-types/)



### 2管理资源

* `mode`:提供mode配置选项，告知webpack使用相应模式的内置优化

用法

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

>

- `entry` 一个可执行模块或库的入口文件。
- `chunk` 多个文件组成的一个代码块，例如把一个可执行模块和它所有依赖的模块组合和一个 `chunk` 这体现了webpack的打包机制。
- `loader` 文件转换器，例如把es6转换为es5，scss转换为css。
- `plugin` 插件，用于扩展webpack的功能，在webpack构建生命周期的节点上加入扩展hook为webpack加入功能。

```javascript
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

这种配置方式会使你的代码更具备可移植性，因为现有的统一放置的方式会造成所有资源紧密耦合在一起。假如你想在另一个项目中使用 `/my-component`，只需将其复制或移动到 `/components` 目录下。

### 3 webpack 缓存管理[链接](https://doc.webpack-china.org/guides/output-management/#manifest)

### 4 代码分离

**重点：**

**1 bundle 分析(bundle analysis)** 先学会如何利用这个插件来了解webpack的打包情况；

**2 以ele提供模版[参考element-starter](https://github.com/ElementUI/element-starter)**

[参考官网](https://doc.webpack-china.org/guides/code-splitting/)

- 入口起点：使用 [`entry`](https://doc.webpack-china.org/configuration/entry-context) 配置手动地分离代码。

- 防止重复：使用 [`CommonsChunkPlugin`](https://doc.webpack-china.org/plugins/commons-chunk-plugin) 去重和分离 chunk。

- 动态导入：通过模块的内联函数调用来分离代码。


```bash
npm run dev
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>element-starter</title>
</head>

<body>
  <div id="app"></div>
<script type="text/javascript" src="/assets/index.js"></script>
<script type="text/javascript" src="/assets/vendor.js"></script></body>

</html>

```

* 启动项目之后，在控制台查看network分析
* 入口文件生成的不同的bundle都被动态的添加到index.html中，加载index.html之后，通过script进行加载


性能优化：

* entry有几个入口起点，就会在index.html中动态插入几个bundle，可以通过拆分bundle,减少bundle的大小
* 假如a.js.  b.js 都引入了 `import lodash from 'lodash'`

注意：`HtmlWebpackPlugin`插件会先将 **多个入口的公用库**  在通过` CommonsChunkPlugin`插件提取公共bundle的时候，优先导入`index.html`文件

#### 4.1 入口起点（没有设置CommonsChunkPlugin插件的时候）

**注意：**

* **如果传入一个字符串或字符串数组，chunk 会被命名为 `main`。**

```javascript
entry:'./src/main.js',
```

```html
<script type="text/javascript" src="vendorddd.js?1e2bb5c4a74e8d3950a2"></script><script type="text/javascript" src="main.js?363487fd4d1508087ee4"></script>
```

* **如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。**

```javascript
entry: {
    index: './src/main.js',
    vendor: './src/vendor'  
},
    //or
entry: {
    vendor: './src/vendor',
    index: './src/main.js',
},
```

以上根据`HtmlWebpackPlugin`插件生成的都是如下：

```html
<script type="text/javascript" src="index.js?0404cb6d254c943fe5f4"></script><script type="text/javascript" src="vendor.js?de6b638d85297a1b138b"></script></body>

```

如果使用 [CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk)插件 ,那么webpack生成的chunk中会有 manifest 和 runtime 这两个chunk

```javascript
new webpack.optimize.CommonsChunkPlugin({
    names:  ['vendor','manifest','runtime']
}),
```

#### 4.2 入口起点设置[CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk)插件

接受配置如下：

```javascript
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,//如果filename 是带有路径的，那么也会以context,默认__dirname拼接成路径
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) -> boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。


  children: boolean,
  // 如果设置为 `true`，所有  公共chunk 的子模块都会被选择

  deepChildren: boolean,
  // If `true` all descendants of the commons chunk are selected

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}

```

##### 4.2.1 提取多入口公共部分,会额外生成一个 chunk(每个入口都会生成一个chunk)

```javascript
entry: {
    app: './src/app',
    index: './src/main.js',
},
new webpack.optimize.CommonsChunkPlugin({
    name:'commons'
}),
```

```html
<script type="text/javascript" src="commons.js?72cc5aafa56e436c4610"></script><script type="text/javascript" src="index.js?db019f512b2790009263"></script><script type="text/javascript" src="app.js?34b940d4b77ffe921124"></script></body>
```

以上会将`app.js`和`index.js`的公用部分提取出来；

#####  4.2.2 设置公用库

```javascript
entry: {
    vendor: ['lodash','vue'],
    index: './src/main.js',
},
new webpack.optimize.CommonsChunkPlugin({
    name:'vendor'
}),
```

可以发现通过 CommonsChunkPlugin 明确第三方库 chunk，并且会优先加载

```html
<script type="text/javascript" src="vendor.js?2f90511bd9c96a3ace4b"></script><script type="text/javascript" src="index.js?db019f512b2790009263"></script></body>
```

##### 4.2.3 公用库的bundle缓存配置 [官方链接](https://doc.webpack-china.org/guides/caching)

```javascript
 entry: {
    vendor: ['lodash','vue'],
    index: './src/main.js',
  },
```

```javascript
new webpack.NamedModulesPlugin(),    
    new webpack.optimize.CommonsChunkPlugin({
    names:  'vendor'
}),
    new webpack.optimize.CommonsChunkPlugin({
    names:  'manifest'
}),
```





webpack.config.js

```javascript
const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const publicPath = ''

module.exports = (options = {}) => ({
  // entry:'./src/main.js',
  entry: {
    vendor: ['lodash','vue'],
    
    index: './src/main.js',
    
  },
  output: {
    path: resolve(__dirname, 'dist'),
    //entry 入口文件导出的文件名会以这个为准
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    //非入口文件导入的文件，比如动态导入的文件，会以这个为准
    chunkFilename: '[name].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),    
    new webpack.optimize.CommonsChunkPlugin({
      names:  'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names:  'manifest'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    },
    extensions: [".js", ".json",".vue"]

  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})

```



