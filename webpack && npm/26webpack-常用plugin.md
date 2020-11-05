---
title:webpack常用插件
---

### 1 ProgressBarPlugin:显示构建进度

[progress-bar-webpack-plugin](https://www.npmjs.com/package/progress-bar-webpack-plugin)

```javascript
new ProgressBarPlugin({
      format: '📦  '+ chalk.blue('构建进度:') + ' '+ chalk.redBright.bold('[:bar]') + ' ' + chalk.magentaBright.bold(':percent') + ' ' + chalk.magentaBright.bold(':elapsed seconds'),
    }),
```

### 2 SpeedMeasurePlugin 这款插件能将每一个plugin每一个loader的打包时间以及总打包时长统计出来。

[speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
 
const smp = new SpeedMeasurePlugin();
 
const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});
```

### 3 webpack-dashboard 

[webpack-dashboard](https://www.npmjs.com/package/webpack-dashboard)

```javascript
// Import the plugin:
var DashboardPlugin = require("webpack-dashboard/plugin");
 
// If you aren't using express, add it to your webpack configs plugins section:
plugins: [new DashboardPlugin()];
 
// If you are using an express based dev server, add it with compiler.apply
compiler.apply(new DashboardPlugin());
```

### 4  **webpack-bundle-analyzer**

```javascript
// 分析包内容
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  plugins: [
    // 开启 BundleAnalyzerPlugin
    new BundleAnalyzerPlugin(),
  ],
};
```

### 5 webpack-build-notifier 

```javascript
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
 
module.exports = {
  // ... snip ...
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build",
      logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    })
  ],
  // ... snip ...
}

```

### 6 duplicate-package-checker-webpack-plugin

### Webpack 3.x

```
npm install duplicate-package-checker-webpack-plugin@^2.1.0 --save-dev
```

### Webpack 4.x

```
npm install duplicate-package-checker-webpack-plugin
```

[duplicate-package-checker-webpack-plugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin)

It might be possible that a single package gets included multiple times in a Webpack bundle due to different package versions. This situation may happen without any warning, resulting in extra bloat in your bundle and may lead to hard-to-find bugs.

```javascript
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

module.exports = {
  plugins: [new DuplicatePackageCheckerPlugin()]
};
```

### 7 webpack-jarvis

[webpack-jarvis](https://www.npmjs.com/package/webpack-jarvis)

vis是一款基于webapck-dashboard的webpack性能分析插件，性能分析的结果在浏览器显示，比webpack-bundler-anazlyer更美观清晰[GitHub文档地址](https://github.com/zouhir/jarvis)

### 8 webpack-parallel-uglify-plugin

[webpack-parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

### 9.[script-ext-html-webpack-plugin](https://www.npmjs.com/package/script-ext-html-webpack-plugin)

### 10.按需引用插件

### (https://www.npmjs.com/package/babel-plugin-import)

https://github.com/lodash/lodash-webpack-plugin

### 11.[检测是否循环引用插件](https://www.npmjs.com/package/circular-dependency-plugin)

项目中如果有循环引用的模块，可能会出现意想不到的问题，产生隐患，利用此插件可以在构建的时候进行检测，防止循环引用带来的badcase