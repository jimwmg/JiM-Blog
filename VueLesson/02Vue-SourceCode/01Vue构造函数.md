---
title:  Vue构造函数
date: 2017-11-27 
categories: vue
---

### 1 Vue的基本使用

```html
<div id="app">
  {{ message }}
</div>
```

```javascript
console.dir(Vue) ;//我们可以看下Vue构造函数上的静态属性和原型属性都有哪些值，下面会分析这些属性的来源；
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

github搜VUE可以找到对应的源码

### 2 Vue构造函数的实现,静态属性和原型属性的添加

#### web平台上

[platforms/web/entry-runtime-with-compiler.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)

```javascript
/* @flow */

import Vue from './runtime/index'
//Vue.compile 
Vue.compile = compileToFunctions;
//先保存 /runtime/index.js中定义的 $mount方法；
const mount = Vue.prototype.$mount
//然后重写该方法；
Vue.prototype.$mount = function (){
  //...
}
 
export default Vue
```

#### 1[plaforms/web/runtime/index.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)中有如下一行代码

```javascript
import Vue from 'core/index'
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement
//Vue.options.directives.model  Vue.options.directives.model.show
extend(Vue.options.directives, platformDirectives)
//Vue.options.components.Transition. Vue.options.components.TransitionGroup
extend(Vue.options.components, platformComponents)

// install platform patch function
//Vue.prototype.__pathch__
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
//Vue.prototype.$mount
//注意这里向 Vue.prototype对象上添加了新的方法 $mount,在platforms/web/entry-runtime-with-compiler.js中会重写这个方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
Vue.nextTick(() => {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue)
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      )
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      `You are running Vue in development mode.\n` +
      `Make sure to turn on production mode when deploying for production.\n` +
      `See more tips at https://vuejs.org/guide/deployment.html`
    )
  }
}, 0)
```

#### 2[core/index.js]()

```javascript
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
//首先调用initGlobalAPI函数
initGlobalAPI(Vue)
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})
Vue.version = '__VERSION__'
export default Vue
```

```javascript
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  //Vue构造函数上的静态属性；
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null) //刚开始赋值Vue.options = {} 空对象（没有原型链）
  //Vue.options.components  Vue.options.directives  Vue.options.filters  ==> { }
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
//Vue.options.components.keepAlive (在keep-alive.js文件中)
  extend(Vue.options.components, builtInComponents)
//Vue.use
  initUse(Vue)
  //Vue.mixin
  initMixin(Vue)
  //Vue.extend  返回一个Sub函数，该函数其实基本上克隆了Vue构造函数的所有属性；Vue.component(option)后面也是调用了extend函数，返回了一个Vue实例对象；
  //可以类比React中extends Component
  initExtend(Vue)
  //Vue.component   Vue.directive    Vue.filter ==> function(id,defination){ }
  initAssetRegisters(Vue)
}

```

#### 3 [instance/index.js源码地址](https://github.com/jimwmg/vue/blob/dev/src/core/instance/index.js)

```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
      !(this instanceof Vue)
     ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
//添加Vue的一些静态属性  
//Vue.prototype._init (也就是上面this._init函数的执行的函数)
initMixin(Vue)
//Vue.prototype.$set  Vue.prototype.$del. Vue.prototype.$watch  Vue.prototype.$data  Vue.prototype.$props
stateMixin(Vue)
//Vue.prototype.$on  Vue.prototype.$off   Vue.prototype.$once  Vue.prototype.$emit
eventsMixin(Vue)
//Vue.prorotype._update  Vue.prototype.$forceUpdate. Vue.prototype.$destory 
lifecycleMixin(Vue)
//Vue.prototype._render. Vue.prototype.$nextTick 
renderMixin(Vue)    			//  installRenderHelpers(Vue.prototype) _o. _l. _s等
export default Vue
```

由以上过程可以看出来，通过instance/index.js ==> core/index.js ==> plaforms/web/runtime/index.js这些文件一层层的对instance/index.js中的Vue构造函数进行加工，不停的增加功能，原型属性和静态属性；

### 4 最后Vue构造函数上的静态属性和动态属性

* 静态属性

```javascript
// src/core/index.js
Vue.version = '__VERSION__'

// src/entries/web-runtime-with-compiler.js
Vue.compile = compileToFunctions    // 把模板template转换为render函数

// src/core/global-api 在目录结构中，我们指出，Vue的静态方法大多都是在该文件夹中定义的
// src/core/global-api/index.js
Vue.config //不过以直接替换整个config对象
Vue.util //几个工具方法，但是官方不建议使用
Vue.set
Vue.delete
Vue.nextTick
Vue.options = {
  components: {KeepAlive: KeepAlive}
  directives: {},
  filters: {},
  _base: Vue
}

// src/core/global-api/use.js
Vue.use

// src/core/global-api/mixin.js
Vue.mixin

// src/core/global-api/extend.js
Vue.extend

// src/core/global-api/assets.js
Vue.component
Vue.directive
Vue.filter
```

* 原型属性

```javascript
Vue.prototype.$on 
Vue.prototype.$off
Vue.prototype.$delete
Vue.prototype.$destroy
Vue.prototype.$emit
Vue.prototype.$once
Vue.prototype.$forceUpdate
Vue.prototype.$mount
Vue.prototype.$set
Vue.prototype.$watch
Vue.prototype.$nextTick
Vue.prototype._init
Vue.prototype._render
Vue.prototype._update
Vue.prototype.__patch__
//以下还有不可枚举和不可配置的一些属性
Vue.prototype.$props
Vue.prototype.$data
Vue.prototype.$ssrContext
Vue.prototype.$isServer
//创建节点属性
Vue.prototype._o
Vue.prototype._s
.....
```

