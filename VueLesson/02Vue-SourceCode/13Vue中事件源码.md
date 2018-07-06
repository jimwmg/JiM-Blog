---
title:  Vue中事件源码
date: 2018-01-24
categories: vue
---

### 1 源码如下

instance.events.js

```javascript
/* @flow */

import {
  tip,
  toArray,
  hyphenate,
  handleError,
  formatComponentName
} from '../util/index'
import { updateListeners } from '../vdom/helpers/index'

export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target: any

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}

function remove (event, fn) {
  target.$off(event, fn)
}

export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, vm)
  target = undefined
}
//给组件实例对象注册事件 vm._events[type] = [fn1,fn2,...]
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
          //这里对应 vm.$on('hook:beforeDestroy',handler);
          //在
        vm._hasHookEvent = true
      }
    }
    return vm
  }
//给组件注册一个只执行一次的事件：可以看到实际上注册的是 on 函数，而在 on 函数执行的时候，会将on函数先卸载掉，然后在执行真正注册的fn函数
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }
//卸载掉注册的函数fn
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }
//触发注册额函数，如果要触发的事件没有注册，那么不会做任何处理，直接返回vm实例对象
    //通过 toArray将传入 $emit函数的参数进行转化为数组，注册的函数可以接受对应的参数作为值
  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1) // toArray 将 arguments中第一个参数去掉
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)  //这里，args 就是传入$emit 函数除第一个参数外剩下的参数
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
}
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```

### 2 触发钩子函数源码 

```javascript
callHook(vm, 'beforeCreate')
callHook(vm, 'beforeMount')
callHook(vm, 'mounted')
callHook(vm, 'beforeDestroy')
callHook(vm, 'destroyed')
....
```

callHook源码：

```javascript
export function callHook (vm: Component, hook: string) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                handleError(e, vm, `${hook} hook`)
            }
        }
    }
    //如果是通过 vm.$on('hook:beforeDestory',handler) 注册的事件，就会在这里出发这个事件；
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook)
    }
}
```

### 3 优化案例

优化之前：

```javascript
data() {
    return {
		timer:null,        
    }
}
created() {
    this.getNotifyUnreadedCount();
    this.timer = setInterval(() => {
      this.getNotifyUnreadedCount();
    }, 60 * 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
```

优化之后：

```javascript
created() {
    this.getNotifyUnreadedCount();
    const timer = setInterval(() => {
        this.getNotifyUnreadedCount();
    }, 60 * 1000);
    this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
    });
},
```

