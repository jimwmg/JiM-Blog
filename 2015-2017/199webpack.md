---
title: webpack
date: 2017-04-27 12:36:00
categories: webpack
tags : webpack
comments : true 
updated : 
layout : 
---

### 1 WebPack的安装

1. 安装命令

   ```
   $ npm install webpack -g
   ```

2. 使用webpack

   ```
   $ npm init  # 会自动生成一个package.json文件
   $ npm install webpack --save-dev #将webpack增加到package.json文件中
   ```

3. 可以使用不同的版本

   ```
   $ npm install webpack@1.2.x --save-dev
   ```

4. 如果想要安装开发工具

   ```
   $ npm install webpack-dev-server --save-dev
   ```



每个项目下都必须配置有一个 webpack.config.js ，它的作用如同常规的 gulpfile.js/Gruntfile.js ，就是一个配置项，告诉 webpack 它需要做什么。

下面是一个例子

```
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
    //插件项
    plugins: [commonsPlugin],
    //页面入口文件配置
    entry: {
        index : './src/js/page/index.js'
    },
    //入口文件输出配置
    output: {
        path: 'dist/js/page',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        root: 'E:/github/flux-example/src', //绝对路径
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            AppStore : 'js/stores/AppStores.js',
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    }
};
```

1. plugins 是插件项，这里我们使用了一个 CommonsChunkPlugin的插件，它用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用。
2. entry 是页面入口文件配置，output 是对应输出项配置 （即入口文件最终要生成什么名字的文件、存放到哪里）
3. module.loaders 是最关键的一块配置。它告知 webpack 每一种文件都需要使用什么加载器来处理。 **所有加载器需要使用npm来加载**
4. 最后是 resolve 配置，配置查找模块的路径和扩展名和别名（方便书写）

### 2  WebPack开始使用

这里有最基本的使用方法，给大家一个感性的认识

1. 正确安装了WebPack，方法可以参考上面

2. 书写entry.js文件

   ```
   document.write("看看如何让它工作！");
   ```

3. 书写index.html文件

   ```
   <html>
   <head>
   <meta charset="utf-8">
   </head>
   <body>
   <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
   </body>
   </html>
   ```

4. 执行命令，生成bundle.js文件

   ```
   $ webpack ./entry.js bundle.js
   ```

5. 在浏览器中打开index.html文件，可以正常显示出预期

6. 增加一个content.js文件

   ```
   module.exports = "现在的内容是来自于content.js文件！";
   ```

7. 修改entry.js文件

   ```
   document.write(require("./content.js"));
   ```

8. 执行第四步的命令

**进行加载器试验**

1. 增加style.css文件

   ```
   body {
   background: yellow;
   }
   ```

2. 修改entry.js文件

   ```
   require("!style!css!./style.css");
   document.write(require("./content.js"));
   ```

3. 执行命令，安装加载器

   ```
   $ npm install css-loader style-loader   # 安装的时候不使用 -g
   ```

4. 执行webpack命令，运行看效果

5. 可以在命令行中使用loader

   ```
   $ webpack ./entry.js bundle.js --module-bind "css=style!css"
   ```

**使用配置文件**
默认的配置文件为webpack.config.js

1. 增加webpack.config.js文件

   ```
   module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
   };
   ```

2. 执行程序

   ```
   $ webpack
   ```

**发布服务器**

1. 安装服务器

   ```
   $ npm install webpack-dev-server -g
   $ webpack-dev-server --progress --colors
   ```

2. 服务器可以自动生成和刷新，修改代码保存后自动更新画面

   ```
   http://localhost:8080/webpack-dev-server/bundle
   ```

### 3 使用配置文件webpack.config.js 我们只需要执行命令 webpack即可，而如果没有配置文件，我们需要webpack指定要打包的入口文件以及文件生成的路径和文件名