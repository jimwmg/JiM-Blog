---
titile:webpack编译速度和构建包体积优化汇总
---

### 0 基础工具升级



### 1 thread-loader（webpack4 官方推荐）

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 创建一个 js worker 池
        use: [ 
          'thread-loader',
          'babel-loader'
        ] 
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        // 创建一个 css worker 池
        use: [
          'style-loader',
          'thread-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
      // ...
    ]
    // ...
  }
  // ...
}

```

### 2 [memory-fs](https://github.com/webpack/memory-fs)

* 避免在生产中使用 `inline-***` 和 `eval-***`，因为它们可以增加 bundle 大小，并降低整体性能。(https://webpack.docschina.org/guides/production/#npm-scripts)
* Dev-tool(https://webpack.docschina.org/configuration/devtool)
* 其中一些值适用于开发环境，一些适用于生产环境。对于开发环境，通常希望更快速的 source map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 source map，需要从 bundle 中分离并独立存在。
* 

### 3  cache-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

比如在 `babel-loader` 中，可以通过设置`cacheDirectory` 来开启缓存

我们也有方法,我们可以通过`cache-loader` ，它所做的事情很简单，就是 `babel-loader` 开启 `cache `后做的事情，将 `loader` 的编译结果写入硬盘缓存。再次构建会先比较一下，如果文件较之前的没有发生变化则会直接使用缓存。使用方法如官方 demo 所示，在一些性能开销较大的 loader 之前添加此 loader即可

### 4 HardSourceWebpackPlugin

```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const clientWebpackConfig = {
  // ...
  plugins: [
    new HardSourceWebpackPlugin({
      // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中
      // 'node_modules/.cache/hard-source/[confighash]'
      cacheDirectory: path.join(__dirname, './lib/.cache/hard-source/[confighash]'),
      // configHash在启动webpack实例时转换webpack配置，
      // 并用于cacheDirectory为不同的webpack配置构建不同的缓存
      configHash: function(webpackConfig) {
        // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({sort: false}).hash(webpackConfig);
      },
      // 当加载器、插件、其他构建时脚本或其他动态依赖项发生更改时，
      // hard-source需要替换缓存以确保输出正确。
      // environmentHash被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
      // An object. 控制来源
      info: {
        // 'none' or 'test'.
        mode: 'none',
        // 'debug', 'log', 'info', 'warn', or 'error'.
        level: 'debug',
      },
      // Clean up large, old caches automatically.
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 50 * 1024 * 1024
      },
    }),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        test: /.*\.DS_Store/
      }
    ]),
  ]
}

```

### 5 优化基本配置、缩小打包查找作用域

- 优化loader的配置，使用 Loader 时可以通过 `test` 、 `include` 、 `exclude` 三个配置项来命中 Loader 要应用规则的文件

- 优化resolve查找规则的配置

```
resolve.modules   resolve.alias  resolve.extensions  resolve.mainFields  module.noParse 
```

- watch选项 ignore node_modules

```javascript
watchOptions: {
  ignored: /node_modules/,
  aggregateTimeout: 300,
  poll: 1000
}

```

- IgnorePlugin (完全排除模块)
- 合理使用alias

### 6 webpack-parallel-uglify-plugin

```javascript
module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      // Optional regex, or array of regex to match file against. Only matching files get minified.
      // Defaults to /.js$/, any file ending in .js.
      test,
      include, // Optional regex, or array of regex to include in minification. Only matching files get minified.
      exclude, // Optional regex, or array of regex to exclude from minification. Matching files are not minified.
      cacheDir, // Optional absolute path to use as a cache. If not provided, caching will not be used.
      workerCount, // Optional int. Number of workers to run uglify. Defaults to num of cpus - 1 or asset count (whichever is smaller)
      sourceMap, // Optional Boolean. This slows down the compilation. Defaults to false.
      uglifyJS: {
        // These pass straight through to uglify-js@3.
        // Cannot be used with uglifyES.
        // Defaults to {} if not neither uglifyJS or uglifyES are provided.
        // You should use this option if you need to ensure es5 support. uglify-js will produce an error message
        // if it comes across any es6 code that it can't parse.
      },
      uglifyES: {
        // These pass straight through to uglify-es.
        // Cannot be used with uglifyJS.
        // uglify-es is a version of uglify that understands newer es6 syntax. You should use this option if the
        // files that you're minifying do not need to run in older browsers/versions of node.
      }
    }),
  ],
};
```

### 7 purgecss-webpack-plugin

### [purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin)

```javascript
const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
 
const PATHS = {
  src: path.join(__dirname, 'src')
}
 
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ]
}
```



[webpack优化汇总](https://mp.weixin.qq.com/s/4WD98dwNqjzs7h0FqwSl7g)