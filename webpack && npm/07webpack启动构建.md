---

---

### 1 通过webpack命令行执行构建

- 导出一个对象

```javascript
module.exports = {
  mode:'development',
  entry:{
    app:path.resolve(__dirname,'src/index.js'),
    // anothermodule:path.resolve(__dirname,'src/another-module.js')
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].[hash:8].js',
    chunkFilename:'[name].[hash:8].non-entry.js',//chunkFilename这个配置选项决定了非入口文件的打包文件名称,包括通过split分离的公用代码的chunk也会按照这个为基准进行重命名；
    sourceMapFilename:'[file].map',//默认值就是[file].map 此选项会向硬盘写入一个输出文件，只在 devtool 启用了 SourceMap 选项时才使用。

  },
  devtool:'source-map',
  // devtool:'eval',
  resolve:{
    extensions: [ '.js','.vue'],
  },
  module:{
    rules:[{
      test:/\.css$/,
      use:[
        'style-loader',
        'css-loader'
      ]
    }],
  },
  plugins:[
    new HtmlWebpackPlugin({
      title:'webpack-base-learn',
      filename:'index.html',
      template:'./index.html',
      inject: true

    }),
    new CleanWebpackPlugin(path.resolve(__dirname,'dist')),
    
  ],
  optimization:{
    splitChunks:{
      chunks:'all',
      name:'common',
    }
  },
  externals : {
    lodash : {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // 指向全局变量
    }
  },


  devServer:{
    contentBase:path.join(__dirname,'dist'),
    port:8000,
  },
  
}
```

* 导出一个函数

```javascript
module.exports = function(env,argv){
  if(argv.analyze){
    webpackCommon.plugins.push(new BundleAnalyzerPlugin())
  }
  return webpackCommon;
}
```

* 导出一个promsie: webpack will run the function exported by the configuration file and wait for a Promise to be returned. Handy when you need to asynchronously load configuration variables.

```javascript
module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        entry: './app.js',
        /* ... */
      });
    }, 5000);
  });
};
```

* 导出多个配置:Instead of exporting a single configuration object/function, you may export multiple configurations (multiple functions are supported since webpack 3.1.0). When running webpack, all configurations are built. For instance, this is useful for [bundling a library](https://webpack.js.org/guides/author-libraries) for multiple [targets](https://webpack.js.org/configuration/output#output-librarytarget) such as AMD and CommonJS:

```javascript
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  name: 'amd',
  entry: './app.js',
  mode: 'production',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  name: 'commonjs',
  entry: './app.js',
  mode: 'production',
}];
```

执行 `webpack --webpack.config.js`

### 2 [通过node-API执行构建](https://webpack.js.org/api/node/#src/components/Sidebar/Sidebar.jsx)

```javascript
//1.传入webpack配置对象，同时传入回调函数就会执行webpack compiler(打包构建)
const webpack = require('webpack');
const compiler = webpack(config,(err,stats) => {
  if(err || stats.hasErrors()){
    console.log('构建出错');
  }
  console.log('构建成功')
});


```

- .run
- .watch

```javascript
//2.如果你不向 webpack 执行函数传入回调函数，就会得到一个 webpack Compiler 实例。
//你可以通过它手动触发 webpack 执行器，或者是让它执行构建
const webpack = require('webpack')
const compiler = webpack(config)
compiler.plugin('done', function() {
  console.log('插件加载完成了')
});
compiler.run((err,stats) => {
    
})
```

```javascript
const webpack = require('webpack')
const compiler = webpack(config)
const watching = compiler.watch({
  // Example watchOptions
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  // Print watch/build result here...
  console.log(stats);
});
//The watch method returns a Watching instance that exposes .close(callback) method. Calling this method will end watching:

watching.close(() => {
  console.log('Watching Ended.');
});
```

