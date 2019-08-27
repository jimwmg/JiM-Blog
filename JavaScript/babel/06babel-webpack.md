---

---

### 1 babel-webpack配合使用

```json
"babel-core": "^6.22.1",
"babel-loader": "^7.1.1",
"webpack": "^3.6.0",
```

基本目录结构

```
- project
	- src
		- .babelrc
		- index.js
	- webpack.config,js
	- .babelrc
```

项目`package.json` 依赖

```json
"babel-core": "^6.22.1",
"babel-loader": "^7.1.1",
"babel-plugin-transform-react-jsx": "^6.24.1",
"babel-plugin-transform-runtime": "^6.22.0",
"babel-preset-env": "^1.6.1",
"babel-preset-es2015": "^6.24.1",
"babel-preset-es2016": "^6.24.1",
"babel-preset-stage-2": "^6.22.0",
"webpack": "^3.6.0",
"webpack-bundle-analyzer": "^2.9.0",
"webpack-dev-server": "^2.9.1",
"webpack-merge": "^4.1.0"
```

webpack基本配置

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist/')

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js',
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename:'[name].non-entry.js'
    // publicPath:'http://www.test/images/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [resolve('src')],
        use:{
          loader: 'babel-loader',
          options:{
            // "babelrc": false,
            "presets":[],
            "plugins":[]
          }
        }
        
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}

```

有一个问题，当`babel-loader`转换js文件的时候，以哪个options配置为准呢？

[.babelrc配置](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

### babel-loader的取值

#### 1 在不配置 babel-loader options选项的时候，默认以当前文件为基准向上找 `.babelrc`文件

Babel will look for a .babelrc in the current directory of the file being transpiled. 
If one does not exist, it will travel up the directory tree until it finds either a .babelrc,
or a package.json with a "babel": {} hash within.

就是说当需要用到babel转换代码的时候，是会优先查找当前文件夹有没有.babelrc文件，或者其它的写法，比如说package.json的babel字段等，有就停止往上查找，没有就一直向上直到有为止。。。

对于`webpack`中`babel-loader`来说，如果没有配置，那么也是去找 `.babelrc`,如果有配置那么就是以配置的options为准；

举例来说 如果webpack这么配置，那么就会从要处理的文件的目录一直往上来寻找 `.babelrc`的配置，作为babel-loader的配置；

```javascript
test: /\.jsx?$/,
include: [resolve('src')],
use:{
  loader: 'babel-loader',
  options:{
  }
}
```

如果配置了 `filename`表示可以改变寻找`.babelrc`文件的目录,那么就不以 当前文件为目录进行寻找`.babelrc`

```
options:{
	filename:'path-to-dir/.babelrc'
}
```

注意

**1 必须声明到对应的目录下的具体的文件；**

**2 此时presets  plugins里面的npm包就会从这里开始找**

****

#### 2 如果配置了options,那么就以这个配置传入 babel-loader

如果这么配置

```javascript
test: /\.jsx?$/,
include: [resolve('src')],
use:{
  loader: 'babel-loader',
  options:{
    "presets":[],
    "plugins":[]
  }
} 
```

如果只配置了options     "babelrc": false, 表示禁用`.babelrc`文件

#### 特殊情况

如果通过 `inline-loader`改变了 [参考](https://webpack.js.org/concepts/loaders/)

```javascript
var __cml__script = require("!!babel-loader?{\"filename\":\someoptions\"}!./test.js");"
```

那么此时loader会以inline-loader的配置为主；

[.babelrc和options配置的优先级](https://imweb.io/topic/595bcf77d6ca6b4f0ac71f16)

