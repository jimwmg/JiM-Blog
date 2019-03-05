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

### 2 Vue构造函数的实现,静态属性和原型属性的添加

[platforms/web/entry-runtime.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)

```javascript
/* @flow */

import Vue from './runtime/index'
export default Vue
```

#### 1[plaforms/web/runtime/index.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)中有如下一行代码

```javascript
import Vue from 'core/index'
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

#### 3[instance/index.js源码地址](https://github.com/jimwmg/vue/blob/dev/src/core/instance/index.js)

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
//Vue.prototype._init (也就是上面this._init函数的执行)
initMixin(Vue)
//Vue.prototype.$set  Vue.prototype.$del. Vue.prototype.$watch
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

由以上过程可以看出来，通过instance/index.js ==> core/index.js ==> plaforms/web/runtime/index.js这些文件一层层的对instance/index.js中的Vue构造函数进行加工，不停的增加功能，原型属性和静态属性；

