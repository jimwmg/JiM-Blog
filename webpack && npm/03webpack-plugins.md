---
title:webpack - plugins
---

### 1 webpack-plugins

[what is webpack-plugins](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/#compiler)

[手写一个webpack-plugin](https://juejin.im/post/5beb8875e51d455e5c4dd83f)

[webpack-loader](https://juejin.im/post/5bc1a73df265da0a8d36b74f)

 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

 [assets-webpack-plugin](https://www.npmjs.com/package/assets-webpack-plugin)

[手写webpack-plugin](https://github.com/jimwmg/html-res-webpack-plugin)

[tapable+webpack-plugin](https://juejin.im/post/5beb8875e51d455e5c4dd83f)

[webpack-文档-编写一个webpack-plugin](https://webpack.docschina.org/contribute/writing-a-plugin/)

[webpack-plugin2.0文档](https://www.html.cn/doc/webpack2/development/how-to-write-a-plugin/)

[webpack-plugin](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/)


Loader处理单独的文件级别并且通常作用于包生成之前或生成的过程中。

Plugins插件则是处理包（bundle）或者chunk级别，且通常是bundle生成的最后阶段。一些插件如[commonschunkplugin](https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin)甚至更直接修改bundle的生成方式。

可以先看下 `html-webpack-plugin`类似的插件是如何写的；

### 2 如何写一个webpack-plugins

```javascript

const HelloWorldPlugin = require('./plugin.js')
module.exports =  = {
    mode: 'development',
    context:path.resolve(__dirname),

    entry:{
        app:path.resolve(__dirname,'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    resolve: {
        extensions: ['.js', '.vue'],
    },

    module: {
        rules: [{
            test:/\.js$/,
            use:[
                {
                    loader:path.resolve(__dirname,'./loader/main.js'), //本地loader路径
                    options:{v1:"v1"} //配置的options可以通过 loaderUtils 获取
                }
            ]
        }],
    },
    plugins:[
        new HelloWorldPlugin({name:'jim',age:18})
    ]
}
```

在`node_modules`中找到`webpack/bin/webpack.js`文件顶部加入一行代码,便于调试

```javascript
#!/usr/bin/env node --inspect-brk
```

### 3 webpack启用plugins

在webpack函数中有如下代码，webpack会自动调用所有plugin的apply方法，每个apply方法接受 compiler对象;

当调用某个`plugin`的时候，`new Plugin()`会先执行这个插件的构造函数；而该插件的apply函数，会在webpack的`run`函数执行的时候，解析完options之后执行每个插件的apply函数；

```javascript
if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
        //这里可以看到每个plugin插件上的apply函数都会接受这个 compiler对象
        plugin.apply(compiler);
    }
}
```

`plugin.js`

```javascript
class HelloWorldPlugin {
  constructor(options){
    console.log('HelloWorldPlugin-options',options)
    this.options = options;
  }
  apply(compiler) {
    debugger;
    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* stats is passed as argument when done hook is tapped.  */
    ) => {
      console.log('Hello World!');
    });
  }
}

module.exports = HelloWorldPlugin;

```

### 4 webpack处理ES6的模块

#### 1 基于babel-loader进行转化；

对babel-laoder的[配置](https://babeljs.io/docs/en/babel-preset-env#targetsbrowsers)

webpack配置

```javascript
module: {
    rules: [
      { test: /\.js$/, 
        exclude: [/node_modules/], 

        loader: "babel-loader",
      }
    ]
  },
```

`babelrc`

```javascript
{
  "presets": [
    ["env",{
      "targets": {
        "browsers": [
          "> 1%",
          "last 2 versions",
          "not ie <= 8"
        ]
      },
      "modules":"commonjs",
    }]
  ],
  "plugins":[
    "transform-async-to-generator"
  ]
}

```

源文件

```javascript
export default  {f:'ss'};
```

经过babel-loader 之后，

```javascript
"'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = { f: 'ss' };"
```

打包后代码

```javascript
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = { f: 'ss' };

/***/ }),
```

#### 2 webpack本身支持ES6模块

```javascript
export default  {f:'ss'};
```

webpack本身会将这个ES6模块处理；

```javascript
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({f:'ss'});

/***/ }),
```

**注意：如果没有走webpack的构建  同时也没有经过babel-loader的处理，那么ES6的模块系统无法在不支持的环境中运行**