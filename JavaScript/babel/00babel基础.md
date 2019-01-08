---
tile:babel 基础
---

## 调研结果

### 1 chanmeleon支持 react 调研；

* react使用的是 jsx ,**编译的时候**，将html模板当做 js 进行编译解析；可以直接在组件的内部使用 this;
* vue使用的单文件组件，模板，js ,style 分离，**编译的时候**，vue内部会将模板进行单独的编译成 render 函数，然后通过 with 指定vue组件的this;



#### javascript转化为ast语法树相关学习链接

[babylon与抽象语法树](https://github.com/Pines-Cheng/blog/issues/53)

`parse()` parses the provided `code` as an entire ECMAScript program, while `parseExpression()` tries to parse a single Expression with performance in mind. When in doubt, use[ `.parse()`](https://babeljs.io/docs/en/next/babel-parser.html#options)

[babylon](https://www.npmjs.com/package/babylon)  也就是  [@babel/parser](https://babeljs.io/docs/en/babel-parser)   [@babel/traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)   [@babel/generator](https://babeljs.io/docs/en/babel-generator)  [以上使用汇总](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-traverse)

[plugin-jsx](https://facebook.github.io/jsx/)

[babel-官方网站](https://babeljs.io/docs/en/)

[estree-spec](https://github.com/estree/estree)    [ast-spec](https://github.com/babel/babylon/blob/master/ast/spec.md)

[babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)

[esprima](http://esprima.org/demo/parse.html#)  [estraverse](https://github.com/estools/estraverse)   [escodegen](https://github.com/estools/escodegen)

#### ast语法树转化为javascript相关学习链接

[vue2any](https://github.com/surmon-china/vue2any)

[parse5-专门用于html模板解析成ast](https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/index.md)

[.babelrc配置](https://excaliburhan.com/post/babel-preset-and-plugins.html)  [.babelrc配置](https://www.jianshu.com/p/41d3f7768095) [babel处理纯html](https://www.zhihu.com/question/54535948/answer/144429709)

[jsx-ast结构](https://github.com/facebook/jsx/blob/master/AST.md)

#### 掘金系列文章

[ast相关合集](https://juejin.im/collection/5bae34b5f265da5bdbaa95a6)

[理解AST构建Babel插件](https://juejin.im/post/5b03caea518825428630d407)

[如何学习babel](https://www.zhihu.com/question/268622554/answer/385120355)

[ast-增删改查-重要](https://summerrouxin.github.io/2018/05/29/ast-practise/ast-practise/)

[开发babel插件](https://www.zybuluo.com/bornkiller/note/833447)

### webpack-loader开发

[如何开发webpack-loader](https://fengmiaosen.github.io/2017/01/07/write-webpack-loader/)

#### 阻碍

[jsx解析](https://jasonformat.com/wtf-is-jsx/)

[jsx-结构列表](https://github.com/facebook/jsx)

[what is source map]( https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)

[source-map的配置](https://segmentfault.com/a/1190000008315937)

[如何编写babel插件](https://juejin.im/post/5b14257ef265da6e5546b14b)

[如何编写babel插件](https://www.h5jun.com/post/babel-for-es6-and-beyond.html)

[AST-explorer](https://astexplorer.net/)

babel-polyfill Babel 有一个 polyfill ，它包括 a custom regenerator runtime 和 core-js. babel-polyfill会完整的模拟ES2015+的环境，目标是用于应用中而不是库或工具中。使用babel-node时，它会自动的加载。 这意味你能使用内置的函数如Promise或WeakMap，静态方法如Array.from 或 Object.assign，实例方法如Array.prototype.includes，以及generator函数。为了实现这些方法，它被添加到全局，也被添加到原生的原型上。

