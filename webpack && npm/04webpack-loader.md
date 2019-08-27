---
title：webpack-loader
---

### 1 webpack-loader

[webpack-loader系列分析：含源码解析-推荐！](https://juejin.im/post/5c6e70f5e51d4572b24b430d)

[loader-api](https://webpack.js.org/api/loaders/)

[loader-api的详解-掘金](https://juejin.im/post/5accd3aa6fb9a028dd4e91d3)

[webpack-中文文档](https://webpack.docschina.org/api/cli/)

[loader-api-官方文档](https://webpack.js.org/api/loaders/)

[laoder-APi](https://segmentfault.com/a/1190000012718374)

[loader的 ！语法](https://webpack.docschina.org/concepts/loaders/#%E4%BD%BF%E7%94%A8-loader)

[loader !!  ! -!语法](https://webpack.js.org/concepts/loaders#resolving-loaders)

[loader-pitching](https://webpack.js.org/api/loaders/#pitching-loader)

[patching函数参数：](https://webpack.js.org/api/loaders#thisrequest)

**使用loader加载顺序**

分了三个级别，preloaders,loaders,postloaders，分别代表前中后，三个处理状态。除此外，webpack还提供require的额外定义。

-  `require("!raw!./script.coffee")` 禁止preloaders生效。
-  `require("!!raw!./script.coffee")` 禁止在配置文件中的所有加载器生效。
-  `require("-!raw!./script.coffee")` 禁止loader和preloader，不禁止postloader

内联的执行也是从右向左；

比如 `style-loader` 是用来加载 `css` 文件的，如果不忽略配置会出现无限递归调用的情况。即 style-loader 里面调用了 `require(‘xxx.css’)` ，这个require又会去调用 style-loader，于是就无限循环了。

It's possible to specify loaders in an `import` statement, or any [equivalent "importing" method](https://webpack.js.org/api/module-methods). Separate loaders from the resource with `!`. Each part is resolved relative to the current directory.

```
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

It's possible to override any loaders, preLoaders and postLoaders from the [configuration](https://webpack.js.org/configuration) by prefixing the inline `import` statement:

- Prefixing with `!` will disable all configured normal loaders

```
import Styles from '!style-loader!css-loader?modules!./styles.css';
```

- Prefixing with `!!` will disable all configured loaders (preLoaders, loaders, postLoaders)

```
import Styles from '!!style-loader!css-loader?modules!./styles.css';
```

- Prefixing with `-!` will disable all configured preLoaders and loaders but not postLoaders

```
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```

Options can be passed with a query parameter, e.g. `?key=value&foo=bar`, or a JSON object, e.g. `?{"key":"value","foo":"bar"}`.

使用 `!` 为整个规则添加前缀，可以覆盖配置中的所有 loader 定义。

**当前目录**：每个部分都会相对于当前目录解析。这个目录指的是当前解析文件的所在目录，比如某个`src/page`中的某个文件，那么当前目录就是该文件所在目录；

**loader查找路径**：相对路径，则是相对于当前文件的解析的目录；绝对路径：那就是绝对路径；模块路径：则根据resolve.modules进行解析

```javascript
module.exports = {
  //...
  resolve: {
    modules: ['node_modules']
  }
};
```

告诉 webpack 解析模块时应该搜索的目录。

绝对路径和相对路径都能使用，但是要知道它们之间有一点差异。

通过查看当前目录以及祖先路径（即 `./node_modules`, `../node_modules` 等等），相对路径将类似于 Node 查找 'node_modules' 的方式进行查找。

使用绝对路径，将只在给定目录中搜索。

[webpack-2-require](https://www.html.cn/doc/webpack2/concepts/loaders/)

```javascript
require('!!style-loader!css-loader!./styles.css');
比如这里的模块路径则会顺着node_modules一直向上查找；./style.css 则是相对于当前目录的要被loader解析的文件；
```

[loader-utils](https://www.npmjs.com/package/loader-utils)

### `stringifyRequest`:Turns a request into a string that can be used inside `require()` or `import` while avoiding absolute paths. Use it instead of `JSON.stringify(...)` if you're generating code inside a loader.

**Why is this necessary?** Since webpack calculates the hash before module paths are translated into module ids, we must avoid absolute paths to ensure consistent hashes across different compilations.

## `Rule.enforce`

可能的值有：`"pre" | "post"`

指定 loader 种类。没有值表示是普通 loader。

还有一个额外的种类"行内 loader"，loader 被应用在 import/require 行内。

所有 loader 通过 `前置, 行内, 普通, 后置` 排序，并按此顺序使用。

所有普通 loader 可以通过在请求中加上 `!` 前缀来忽略（覆盖）。

所有普通和前置 loader 可以通过在请求中加上 `-!` 前缀来忽略（覆盖）。

所有普通，后置和前置 loader 可以通过在请求中加上 `!!` 前缀来忽略（覆盖）。

不应该使用行内 loader 和 `!` 前缀，因为它们是非标准的。它们可在由 loader 生成的代码中使用。

首先是根据模块的路径规则，例如模块的路径是以这些符号开头的 `!` / `-!` / `!!` 来判断这个模块是否只是使用 inline loader，或者剔除掉 preLoader, postLoader 等规则：

如果不是以 这些开头的，那么会使用配置的loader和inline loader;

| 语法 | 忽略                         |      |
| ---- | ---------------------------- | ---- |
| !!   | loader preloader  postloader |      |
| !    | loader                       |      |
| -!   | loader  preloader            |      |

**在loader中生成的 `require('!!style-loader!css-loader!./styles.css');`这样的代码也会经过webpack📱依赖的过程，同时也会生成编译后的assets和chunks,只不过这里面的文件会根据require前面的配置确定文件走哪个loader，而不会用webpack配置文件中的loader**

**也就是说，这个loader配置的options也会以后续的查询字符串为准，会覆盖webpack配置文件中的options**

每个loader通过 `!`进行分割；

[loader-匹配过程](https://juejin.im/post/5c6e6efee51d45012d06907d)

```javascript
// NormalModuleFactory.js

// 是否忽略 preLoader 以及 normalLoader
const noPreAutoLoaders = requestWithoutMatchResource.startsWith("-!");
// 是否忽略 normalLoader
const noAutoLoaders =
  noPreAutoLoaders || requestWithoutMatchResource.startsWith("!");
// 忽略所有的 preLoader / normalLoader / postLoader
const noPrePostAutoLoaders = requestWithoutMatchResource.startsWith("!!");

// 首先解析出所需要的 loader，这种 loader 为内联的 loader
let elements = requestWithoutMatchResource
  .replace(/^-?!+/, "")
  .replace(/!!+/g, "!")
  .split("!");
let resource = elements.pop(); // 获取资源的路径
elements = elements.map(identToLoaderRequest); // 获取每个loader及对应的options配置（将inline loader的写法变更为module.rule的写法）

```

对于内联loader以及配置loader,都遵循 pitch阶段

对于以下配置,loader **总是**从右到左地被调用。有些情况下，loader 只关心 request 后面的**元数据(metadata)**，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先**从左到右**调用 loader 上的 `pitch` 方法。对于以下 [`use`](https://webpack.docschina.org/configuration/module#rule-use) 配置：

```javascript
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'a-loader',
          'b-loader',
          'c-loader'
        ]
      }
    ]
  }
};

```

首先，传递给 `pitch` 方法的 `data`，在执行阶段也会暴露在 `this.data` 之下，并且可以用于在循环时，捕获和共享前面的信息。

```javascript
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution

```

其次，如果某个 loader 在 `pitch` 方法中给出一个结果，那么这个过程会回过身来，并跳过剩下的 loader。在我们上面的例子中，如果 `b-loader` 的 `pitch` 方法返回了一些东西：

```javascript
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution

```

如果在 `a-loader`中返回一个结果，那么同样剩下的loader都不会执行，当然，可以通过在 `a-loader`中通过内联loader的形式继续执行；

```
|- a-loader `pitch`  returns a module
```



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

在源码中,`emitFile`的实现

```javascript
emitFile: (name, content, sourceMap) => {
  this.assets[name] = this.createSourceForAsset(name, content, sourceMap);
},
```



#### 6 this.addDependency

Adds a file as dependency of the loader result in order to make them watchable. For example, [`html-loader`](https://github.com/webpack-contrib/html-loader) uses this technique as it finds `src` and `src-set` attributes. Then, it sets the url's for those attributes as dependencies of the html file that is parsed.

比如，webpack第一次构建的时候，依赖树图谱中只有 a b 两个文件，那么在watch模式下，a b两个文件变化都会触发webpack重新编译，但是此时改变c文件不会触发重新编译，这是肯定的；

比如下面这样的，webpack入口文件就是这样的一行代码，那么只有`index.js`和`test.js`改变的时候，才会触发webpack重新编译.

`index.js`

```
require('test.js')
```

此时如果通过`this.addDependency`这个API，增加一个文件 `path/to/add.js`，那么 `add.js`的变化也会触发webpack的重新编译；

### 7 其他loaderContext对象常用属性值

```
this._module 可以用来访问当前module,这个module就是编译的时候的结果
```

