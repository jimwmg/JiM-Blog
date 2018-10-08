---
 title: vue-AST的转化过程
---

### 1 区分runtime 和 runtime-with-compiler

【./runtime/index】 

```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

【platforms/entry-runtime.js】

```javascript
/* @flow */

import Vue from './runtime/index'

export default Vue

```

【platforms/entry-runtime-with-compiler.js】

```javascript
import Vue from './runtime/index'
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) { //如果没有传递render函数，那么就解析模板字符串；否则直接挂载
      //这里需要注意一点，如果组件是经过vue-template-loader处理过的，那么就是已经将template模板编译过了的；
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
      //除了传递了render函数这个过程之外，其他的都是通过 innerHTML或者 outerHTML进行解析的；
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
//重点注意这里，这里是被parse解析的模板的来源；
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)  //执行entry.runtime.js的挂载过程；
}
```

这段代码首先缓存了原型上的 `$mount` 方法，再重新定义该方法，我们先来分析这段代码。首先，它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上。接下来的是很关键的逻辑 —— 如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的，编译过程我们之后会介绍。最后，调用原先原型上的 `$mount` 方法挂载

注意上述两者的核心区别就是如下这段代码

```javascript
const { render, staticRenderFns } = compileToFunctions(template, {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
}, this)
options.render = render
options.staticRenderFns = staticRenderFns
```

`platforms/entry-runtime-with-compiler.js`会首先编译下我们的模板，将其解析为AST语法树，然后进行挂载；

`platforms/entry-runtime.js` 则会直接进行挂载，没有编译这个过程；

- Runtime Only

我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

- Runtime + Compiler

我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

```javascript
// 需要编译器的版本
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

因为在 Vue.js 2.0 中，最终渲染都是通过 `render` 函数，如果写 `template` 属性，则需要编译成 `render` 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。

当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

**预编译模板最简单的方式就是使用[单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。**

如果render和template都不存在，那么此时就是挂载 DOM 元素的 HTML 会被提取出来用作模板，此时，必须使用 Runtime + Compiler 构建的 Vue 库。

### 2 接下来看下两者的差别处：编译过程主要做了什么工作；

【platforms/web/compiler/index.js】

【src/compiler/index.js】

```javascript
/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

`src/compiler/create-compiler.js`这里是真正执行编译的地方，这里的options进行了增加了用户自定义的一些值；

```javascript
/* @flow */

import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

```

可以看到 ast是由 parse 这个函数生成的；

* 如果想要看vue解析成ast语法树的过程，可以看上面代码的具体实现；
* 如果想要看vue解析成ast语法树的结果，可以执行如下操作

```javascript
npm init -y
npm install vue-template-compiler html-webpack-plugin  clean-webpack-plugin
```

`package.json`

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server",
    "build": "webpack"
  },
```

`webpack.config.js`

```javascript
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ip = require('ip');

module.exports = {
  mode:'production',
  entry:{
    app:path.resolve(__dirname,'src/index.js')
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
  },
  resolve:{
    extensions: [ '.js','.vue'],
  },
  
  plugins:[
    new HtmlWebpackPlugin({
      title:'webpack-base-learn',
      filename:'index.html',
      template:'./index.html',

    }),
    new CleanWebpackPlugin(path.resolve(__dirname,'dist')),
  ],
  devServer:{
    contentBase:path.join(__dirname,'dist'),
    port:9000,
  }
}
```

`index.js`

```javascript
const compiler = require('vue-template-compiler');

// let content = fs.readFileSync('./entry.vue');
// console.log(contnent)
let str = '<template><div class="line"></div></template>  <script src="./time">console.log("sss")</script><style>.line{color:"red"}</style>'\
//这个是直接解析成ast语法树；
export const ret = compiler.compile(str, {
    directives: {
        test (node, directiveMeta) {
            // transform node based on directiveMeta
        }
    }
})
//这个的作用：其实就是可以将 template  script style里面的东西传给下一个处理器进行处理；
export const retCom = compiler.parseComponent(str, { pad: 'line' })
export const retCom1 = compiler.parseComponent(str, { pad: 'space' })
```

`pad` is useful when you are piping the extracted content into other pre-processors, as you will get correct line numbers or character indices if there are any syntax errors.

 



