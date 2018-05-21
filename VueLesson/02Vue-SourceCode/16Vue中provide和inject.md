---
title:  Vue中provide和inject
date: 2018-05-11
categories: vue
---

### 1 使用

父组件通过provide,返回一个要提供给子组件的对象，子组件可以通过inject对应的属性值

子组件通过inject，可以注册到子组件中对应的provide对象

[官方案例](https://cn.vuejs.org/v2/guide/components-edge-cases.html)

父组件 : provide 选项允许我们指定我们想要**提供**给后代组件的数据/方法

```
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

子组件 ： inject 选项来接收指定的我们想要添加在这个实例上的属性：

```
inject: ['getMap']
```

```javascript
const Child = {
  inject: {
    foo: {
      from: 'bar',
      default: () => [1, 2, 3]
    }
  }
}
```

### 2 源码分析

2.1 第一步当一个vue组件初始化的时候，还是会走一遍初始化的流程

```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

2.2 重点看下 provide和inject的处理

```javascript
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
```

```javascript
/* @flow */

import { warn } from '../util/index'
import { hasSymbol } from 'core/util/env'
import { defineReactive, observerState } from '../observer/index'
// 将provide 选项返回的对象给到组件实例对象 vm._provide,方便子组件可以通过 vm._provide取到该对象
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    observerState.shouldConvert = false
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    observerState.shouldConvert = true
  }
}

export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    const keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(key => {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // 如果存在from,并且父组件存在对应额度源，那么就将父组件对应的源映射到子组件；然后break,
      // result[key] = source._provided[provideKey]
      // result['foo'] 会取值父组件提供的 bar 某个源属性对应的值
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey]
          break
        }
          // 这里就是递归循环父组件，找到对应的provide的对应在子组件要inject的选项
        source = source.$parent
      }
      if (!source) {
          // 如果在父组件中没有找到对应的源，那么直到根父组件的时候，result[key] 会取默认值
          // result['foo'] = [1,2,3]  default选项对应的值;
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}

```

