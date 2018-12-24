---

---

### 0 目录结构

```
-src
	-index.js
	-another-module.js
	-style.css
-index.html
-webpack.config.js
-package.json
```

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app">
    hello world
  </div>
</html>
```

`index.js`

```javascript
import './style.css';

console.log('this is index');
```

`another-module.js`

```javascript
import './style.css'
console.log('another-module is here')
```

`style.css`

```css
#app{
  color:red;
}
```

### 1 增加入口起点

#### 1.1 代码分离-入口起点

```javascript
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



module.exports = {
  mode:'development',
  entry:{
    app:path.resolve(__dirname,'src/index.js'),
    anothermodule:path.resolve(__dirname,'src/another-module.js')
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
  },
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
    new BundleAnalyzerPlugin(),
  ],
  
  devServer:{
    contentBase:path.join(__dirname,'dist'),
    port:8000,
  },
  
}
```

```
Hash: 9dcb60ae5fda1203cdfd
Version: webpack 4.20.2
Time: 706ms
Built at: 2018-12-24 11:29:09
           Asset       Size         Chunks             Chunk Names
anothermodule.js   23.6 KiB  anothermodule  [emitted]  anothermodule
          app.js   23.5 KiB            app  [emitted]  app
      index.html  400 bytes                 [emitted]
Entrypoint app = app.js
Entrypoint anothermodule = anothermodule.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} {anothermodule} [built]
[./src/another-module.js] 58 bytes {anothermodule} [built]
[./src/index.js] 52 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} {anothermodule} [built]
    + 3 hidden modules
```

可以看到，通过手动增加入口起点，配置webpack的时候，

* 入口的chunks中如果引用了重复的模块，那么这些重复的模块会被引入到各个bundle中
* 这种方法不够灵活，并且不能将核心的应用程序逻辑进行动态拆分代码；

#### 1.2 代码分离-防止重复

上面可以看到 `import './style.css'`会被重复的引入，这个增加了每个bundle的体积，可以通过增加以下配置，将原来只生成两个`anothermodule.js  app.js`的打包结果，可以生成三个`anothermodule.js app.js  verdors~anothermodule-app.js` 三个打包结果，其中`verdors~anothermodule-app.js`中是`app.js anothermodule.js`的公用代码的抽离；

增加以下配置

```javascript
optimization:{
    splitChunks:{
      chunks:'all'
    }
  },
```



```
Hash: f3c49ab127f60cb77149
Version: webpack 4.20.2
Time: 869ms
Built at: 2018-12-24 11:29:36
                       Asset       Size                     Chunks             Chunk Names
            anothermodule.js   8.38 KiB              anothermodule  [emitted]  anothermodule
                      app.js   8.31 KiB                        app  [emitted]  app
vendors~anothermodule~app.js     18 KiB  vendors~anothermodule~app  [emitted]  vendors~anothermodule~app
                  index.html  475 bytes                             [emitted]
Entrypoint app = vendors~anothermodule~app.js app.js
Entrypoint anothermodule = vendors~anothermodule~app.js anothermodule.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} {anothermodule} [built]
[./src/another-module.js] 58 bytes {anothermodule} [built]
[./src/index.js] 52 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} {anothermodule} [built]
    + 3 hidden modules
```

### 2 不增加入口起点

这个在我们打包一个bundle体积特别大的情况下，可以通过以下配置进行公用代码在多生成一个chunk；用以减少只生成一个bundle的情况下的文件体积；

```
optimization:{
    splitChunks:{
      chunks:'all'
    }
  },
```

修改部分文件内容

`index.js`

```javascript
import './style.css';
import './another-module.js';
console.log('this is index');
```

`another-module.js`

```javascript
import './style.css'
console.log('another-module is here')
```

```javascript
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  mode:'development',
  entry:{
    app:path.resolve(__dirname,'src/index.js'),
    // anothermodule:path.resolve(__dirname,'src/another-module.js')
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
  },
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
    new BundleAnalyzerPlugin(),
  ],
  devServer:{
    contentBase:path.join(__dirname,'dist'),
    port:8000,
  },
  
}
```

```
Hash: 35461369c85700036155
Version: webpack 4.20.2
Time: 732ms
Built at: 2018-12-24 12:01:26
     Asset       Size  Chunks             Chunk Names
    app.js   24.5 KiB     app  [emitted]  app
index.html  337 bytes          [emitted]
Entrypoint app = app.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} [built]
[./src/another-module.js] 122 bytes {app} [built]
[./src/index.js] 112 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} [built]
```

增加以下配置

```
optimization:{
    splitChunks:{
      chunks:'all'
    }
  },
```

```
Hash: fe9ec66e8f6ff3299b85
Version: webpack 4.20.2
Time: 673ms
Built at: 2018-12-24 12:05:16
         Asset       Size       Chunks             Chunk Names
        app.js   9.22 KiB          app  [emitted]  app
vendors~app.js   17.9 KiB  vendors~app  [emitted]  vendors~app
    index.html  398 bytes               [emitted]
Entrypoint app = vendors~app.js app.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} [built]
[./src/another-module.js] 122 bytes {app} [built]
[./src/index.js] 112 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} [built]
    + 3 hidden modules
```

然后在修改

`index.js`

```javascript
import './style.css';
import './another-module.js';
import lodash from 'lodash';
console.log('this is index');
```

`another-module.js`

```javascript
import './style.css';
import lodash from 'lodash';
console.log('another-module is here')
```

```
Hash: dc895ae85c61ffd25c49
Version: webpack 4.20.2
Time: 884ms
Built at: 2018-12-24 12:05:56
         Asset       Size       Chunks             Chunk Names
        app.js   9.75 KiB          app  [emitted]  app
vendors~app.js    565 KiB  vendors~app  [emitted]  vendors~app
    index.html  398 bytes               [emitted]
Entrypoint app = vendors~app.js app.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 509 bytes {vendors~app} [built]
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 519 bytes {vendors~app} [built]
[./src/another-module.js] 119 bytes {app} [built]
[./src/index.js] 140 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} [built]
```

对比以上两个打包的结果，可以发现

```
vendors~app.js   17.9 KiB  vendors~app  [emitted]  vendors~app

vendors~app.js    565 KiB  vendors~app  [emitted]  vendors~app
```

原来的公用bundle只有`style.css`,后来 又加了 `lodash`；

### 3 动态加载

`import()  require.ensure()`  

```
import('path/to/module') -> Promise
```

动态地加载模块。调用 `import()` 之处，被作为分离的模块起点，意思是，被请求的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。

修改 `index.js`增加动态导入，webpack配置文件可以稍微增加一点修改

```javascript
output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
    chunkFilename:'[name].non-entry.js',//chunkFilename这个配置选项决定了非入口文件的打包文件名称,包括通过split分离的公用代码的chunk也会按照这个为基准进行重命名；

  },
```

重点理解一点，webpack中所谓的chunk有三个来源

##### 1 入口的配置，配置几个入口就会有几个chunk

##### 2 splitChunks的配置，公用代码生成的一个chunk

##### 3 动态导入的代码会单独生成一个chunk；



`index.js`

```javascript
import './style.css';
setTimeout(function() {
  // require.ensure([], function() {
  //   let d = require("./another-module.js")
  // });
  import('./another-module.js')
}, 1000);

console.log('this is index');
```

```javascript
Hash: af5289682dd0f410335e
Version: webpack 4.20.2
Time: 738ms
Built at: 2018-12-24 14:52:57
              Asset       Size  Chunks             Chunk Names
             app.js   11.3 KiB     app  [emitted]  app
     0.non-entry.js  832 bytes       0  [emitted]
common.non-entry.js   17.9 KiB  common  [emitted]  common
         index.html  403 bytes          [emitted]
Entrypoint app = common.non-entry.js app.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} [built]
[./src/another-module.js] 122 bytes {0} [built]
[./src/index.js] 274 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} [built]
    + 3 hidden modules
```

`index.js`:这里动态导入两个则会生成两个chunk;

```javascript
import './style.css';

setTimeout(function() {
  // require.ensure([], function() {
  //   let d = require("./another-module.js")
  // });
  import('./another-module.js')
}, 1000);
setTimeout(function() {
  // require.ensure([], function() {
  //   let d = require("./another-module.js")
  // });
  import('./another-module1.js')
}, 1000);
console.log('this is index');
```

```
Hash: 9291ebefb3788506c168
Version: webpack 4.20.2
Time: 733ms
Built at: 2018-12-24 14:55:29
              Asset       Size  Chunks             Chunk Names
             app.js   11.6 KiB     app  [emitted]  app
     0.non-entry.js  832 bytes       0  [emitted]
     1.non-entry.js  803 bytes       1  [emitted]
common.non-entry.js   17.9 KiB  common  [emitted]  common
         index.html  403 bytes          [emitted]
Entrypoint app = common.non-entry.js app.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 161 bytes {app} [built]
[./src/another-module.js] 122 bytes {0} [built]
[./src/another-module1.js] 89 bytes {1} [built]
[./src/index.js] 433 bytes {app} [built]
[./src/style.css] 1.06 KiB {app} [built]
    + 3 hidden modules
```

打开浏览器，可以看到间隔 1s  2s会加载 `another-module.js 和 another-module1.js`这两个文件；

### 4 外部扩展

`externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法。相反，所创建的 bundle 依赖于那些存在于用户环境(consumer's environment)中的依赖。此功能通常对 **library 开发人员**来说是最有用的，然而也会有各种各样的应用程序用到它。

也就是说当前bundle不会将 `externals`中配置的打包在chunk内；

`index.js`

```javascript
import './style.css';
import lodash from 'lodash'
setTimeout(function() {
  // require.ensure([], function() {
  //   let d = require("./another-module.js")
  // });
  import('./another-module.js')
}, 1000);
setTimeout(function() {
  // require.ensure([], function() {
  //   let d = require("./another-module.js")
  // });
  import('./another-module1.js')
}, 1000);
console.log('this is index');
```

`webpack.config.js`

```javascript
module.exports = {
  mode:'development',
  entry:{
    app:path.resolve(__dirname,'src/index.js'),
    // anothermodule:path.resolve(__dirname,'src/another-module.js')
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
    chunkFilename:'[name].non-entry.js',//chunkFilename这个配置选项决定了非入口文件的打包文件名称,包括通过split分离的公用代码的chunk也会按照这个为基准进行重命名；

  },
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
  // externals : {
  //   lodash : {
  //     commonjs: 'lodash',
  //     amd: 'lodash',
  //     root: '_' // 指向全局变量
  //   }
  // },


  devServer:{
    contentBase:path.join(__dirname,'dist'),
    port:8000,
  },
  
}
```



```javascript
Hash: 26ef13310c2b90e11b1f
Version: webpack 4.20.2
Time: 890ms
Built at: 2018-12-24 15:15:16
              Asset       Size  Chunks             Chunk Names
             app.js   11.9 KiB     app  [emitted]  app
     0.non-entry.js   1.06 KiB       0  [emitted]
     1.non-entry.js  804 bytes       1  [emitted]
common.non-entry.js    565 KiB  common  [emitted]  common  //注意这里包括了lodash,common.non-entry.js 这个chunk大小是 565kb；
         index.html  403 bytes          [emitted]
Entrypoint app = common.non-entry.js app.js
```

打开  externals 这个配置项

```javascript
Hash: bb37a3fc3bf404690785
Version: webpack 4.20.2
Time: 774ms
Built at: 2018-12-24 15:21:23
              Asset       Size  Chunks             Chunk Names
             app.js   12.3 KiB     app  [emitted]  app
     0.non-entry.js  832 bytes       0  [emitted]
     1.non-entry.js  804 bytes       1  [emitted]
common.non-entry.js   17.9 KiB  common  [emitted]  common //主要这里已经将lodash移除出了common.non-entry.js 这个chunk,现在大小是 17.9kb
         index.html  403 bytes          [emitted]
Entrypoint app = common.non-entry.js app.js
```