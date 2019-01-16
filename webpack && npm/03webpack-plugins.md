---
title:webpack - plugins
---

[what is webpack-plugins](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/#compiler)

[手写一个webpack-plugin](https://juejin.im/post/5beb8875e51d455e5c4dd83f)

[webpack-loader](https://juejin.im/post/5bc1a73df265da0a8d36b74f)

### 1 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

### 2 [assets-webpack-plugin](https://www.npmjs.com/package/assets-webpack-plugin)


Loader处理单独的文件级别并且通常作用于包生成之前或生成的过程中。

Plugins插件则是处理包（bundle）或者chunk级别，且通常是bundle生成的最后阶段。一些插件如[commonschunkplugin](https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin)甚至更直接修改bundle的生成方式。