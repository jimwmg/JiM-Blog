---
title：webpack-loader
---

### 1 webpack-loader

[loader-api](https://webpack.js.org/api/loaders/)

[loader-api的详解-掘金](https://juejin.im/post/5accd3aa6fb9a028dd4e91d3)

[webpack-中文文档](https://webpack.docschina.org/api/cli/)

[loader-api-官方文档](https://webpack.js.org/api/loaders/)

[laoder-APi](https://segmentfault.com/a/1190000012718374)

### 2 如何自己写一个loader

```javascript

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
  }
}
```

在`node_modules`中找到`webpack/bin/webpack.js`文件顶部加入一行代码,便于调试

```javascript
#!/usr/bin/env node --inspect-brk
```

`loader/main.js`

```javascript
const loaderUtils = require('loader-utils')
module.exports =  function(content){
  debugger
  console.log('loader',content)
  const options = loaderUtils.getOptions(this);
  console.log(options)
  return `const a = 'this is loader'`
}
module.exports.raw = true //决定传入的content的形式，默认是 utf-8 字符串
```

### 3 loader相关API

#### 3.1 loader接受的内容

```javascript
module.exports.raw = true
```

默认的情况源文件是以 UTF-8 字符串的形式传入给 Loader,设置module.exports.raw = true可使用 buffer 的形式进行处理,例如 file-loader，就需要 Webpack 给 Loader 传入二进制格式的数据。

#### 3.2 loader接受的options选项

通过`loader-utils`这个npm 包进行获取；

```javascript
const options = loaderUtils.getOptions(this);
```

### 3.3 校验传入的options是否符合要求

通过 `schema-utils`这个npm 包去校验

```javascript
const loaderUtils = require('loader-utils');
const validate = require('schema-utils');
let json = {
    "type": "object",
    "properties": {
        "content": {
            "type": "string",
        }
    }
}
module.exports = function (source) {
    const options = loaderUtils.getOptions(this);
    // 第一个参数是校验的json 第二个参数是loader传入的options 第三个参数是当前loader的名称
    validate(json, options, 'first-loader');
    console.log(options.content)
}
```

####  3.4 同步loader

返回一个结果

```javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
```

返回多个结果

```javascript
module.exports = function(content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // always return undefined when calling callback()
};
```

A function that can be called synchronously or asynchronously in order to return multiple results. The expected arguments are:

```javascript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

1. The first argument must be an `Error` or `null`
2. The second argument a `string` or a [`Buffer`](https://nodejs.org/api/buffer.html).
3. Optional: The third argument must be a source map that is parsable by [this module](https://github.com/mozilla/source-map).
4. Optional: The fourth option, ignored by webpack, can be anything (e.g. some meta data).

> It can be useful to pass an abstract syntax tree (AST), like [`ESTree`](https://github.com/estree/estree), as the fourth argument (`meta`) to speed up the build time if you want to share common ASTs between loaders.

In case this function is called, you should return undefined to avoid ambiguous loader results.

#### 4 异步 loader

返回一个结果

```javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
```

返回多个结果

```javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result, sourceMaps, meta) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```

Tells the [loader-runner](https://github.com/webpack/loader-runner) that the loader intends to call back asynchronously. Returns `this.callback`.

#### 5 直接输出一个文件

`this.emitFile(name:string,content:Buffer|String,sourceMap:{....})`

相对于 `output.path`直接输出一个文件；

#### 6 this.addDependency

Adds a file as dependency of the loader result in order to make them watchable. For example, [`html-loader`](https://github.com/webpack-contrib/html-loader) uses this technique as it finds `src` and `src-set` attributes. Then, it sets the url's for those attributes as dependencies of the html file that is parsed.

比如，webpack第一次构建的时候，依赖树图谱中只有 a b 两个文件，那么在watch模式下，a b两个文件变化都会触发webpack重新编译，但是此时改变c文件不会触发重新编译，这是肯定的；

比如下面这样的，webpack入口文件就是这样的一行代码，那么只有`index.js`和`test.js`改变的时候，才会触发webpack重新编译.

`index.js`

```
require('test.js')
```

此时如果通过`this.addDependency`这个API，增加一个文件 `path/to/add.js`，那么 `add.js`的变化也会触发webpack的重新编译；