---
title: What is webpack
date: 2017-08-24
categories: webpack
tags: 
---

### 1 What is webpack?

归根到底，webpack其实就是一个对象，这个对象提供了一系列的方法，帮助我们处理js,css,img文件，变量作用域，前端模块化等等问题;安装node之后

```javascript
mkdir [文件夹]  
npm i webpack
```

demo.js

```javascript
let webpack = require('webpack');
console.log(webpack)
```

执行node demo.js,终端输出如下：

```javascript
{ [Function: webpack]
  WebpackOptionsDefaulter: [Function: WebpackOptionsDefaulter],
  WebpackOptionsApply: [Function: WebpackOptionsApply],
  Compiler: { [Function: Compiler] Watching: [Function: Watching] },
  MultiCompiler: [Function: MultiCompiler],
  NodeEnvironmentPlugin: [Function: NodeEnvironmentPlugin],
  validate: [Function: bound validateSchema],
  validateSchema: [Function: validateSchema],
  WebpackOptionsValidationError: [Function: WebpackOptionsValidationError],
  DefinePlugin: [Getter],
  .....省略
  ModuleFilenameHelpers: [Getter],
  optimize:
   { AggressiveMergingPlugin: [Getter],
     AggressiveSplittingPlugin: [Getter],
     CommonsChunkPlugin: [Getter],
     ChunkModuleIdRangePlugin: [Getter],
     DedupePlugin: [Getter],
     LimitChunkCountPlugin: [Getter],
     MinChunkSizePlugin: [Getter],
     ModuleConcatenationPlugin: [Getter],
     OccurrenceOrderPlugin: [Getter],
     UglifyJsPlugin: [Getter] } }
```

可以看到webpack本身是一个对象，webpack自带的插件就是这个对象上的属性

[webpack自带插件列表](https://doc.webpack-china.org/plugins/)

###2 前端工程化发展历程