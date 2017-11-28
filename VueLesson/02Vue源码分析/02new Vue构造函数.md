---
title:  new Vue构造函数
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
var vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  computed:{
    reverseMessage:function(){
      return this.message.split('').reverse().join("");
    }
  },
});
console.dir(vm) ;//同时看下输出的 Vue实例对象上的属性都有哪些，下面会分析这些属性是如何挂载上去的；
```

github搜VUE可以找到对应的源码

### 2 接下来看下new Vue(option)的时候，Vue内部是如何运作的

[instance/init.js]

```javascript
let uid = 0  //用于记录Vue组件的uid;
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++  //给Vue实例对象添加 _uid属性

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true	//给Vue实例对象添加 _isVue属性
    // merge options
    if (options && options._isComponent) {
      //根据上面的小demo不会进入这个分支
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      //进入这个分支
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
    //组件实例的生命周期中一个函数  beforeCreate执行
    callHook(vm, 'beforeCreate')
    //以下就是Vue组件实例的创建过程
    //我们看到create阶段，基本就是对传入数据的格式化、数据的双向绑定、以及一些属性的初始化。
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    //这里，在组件创建完毕之后，调用组件生命周期函数 created
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

#### 2.1 vm.$options 

```javascript
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

第一个参数：resolveConstructorOptions(vm.constructor) vm.constructor对于上面的小demo来说就是Vue构造函数，resolveConstructorOptions(vm.constructor) 的返回值就是Vue构造函数上的option属性,也就是mergeOptions的第一个参数

```javascript
Vue.options = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup
  },
  directives: {
    model,
    show
  },
  filters: {},
  _base: Vue
}
```

第二个参数 option就是 new Vue(option ) 中传递进来的option

第三个参数就是 vue实例对象本身

在util/options.js中,下面是mergeOptions函数，同时这个文件中声明了starts对象，该对象中包括

```javascript
starts.data  starts.watch. starts.props. starts.methods  starts.computed. starts.provide. starts.components. starts.filters.  starts.directives 
```

starts对象中这些属性都是对应new Vue(options)中的对应的属性，比如data,methods,computed等如何进行合并的函数

```javascript
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  //这里声明一个空对象，用于存放最后返回的数据，最后返回的值给到了  vm.$options
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    //这里，如果有starts中对应属性的合并策略，则start == starts[key] 如果没有，则start == defaultStart
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

```

关于合并策略

#####starts.components. starts.filters.  starts.directives 

```javascript

//它们的合并策略就是，将childVal中对应的属性给到返回值ret
function mergeAssets (
parentVal: ?Object,
 childVal: ?Object,
 vm?: Component,
 key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    //extend的作用就是将childVal对象上的属性合并到res对象上；for-in循环遍历实现
    //在这个例子上，new Vue(option)中没有这三个的声明，所以最终vm.$option 上的这些值为{ }
    return extend(res, childVal)
  } else {
    return res
  }
}
//ASSET_TYPES就是['component','directive','filters']
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
```

##### starts.props.    starts.methods.     starts.inject.     starts.computed

```javascript
//它们的合并策略就是，将childVal和parentVal中对应的属性给到返回值ret
//我们在props. methods  inject.  computed对象中，不能设置相同的属性名，否则会被覆盖掉
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```

##### starts.data 

```javascript
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {//就这个例子 !vm 为false;
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }
//就这个例子来说会执行到这里，返回值就是这个函数执行后的返回值；
//这种情况下返回函数：function mergedInstanceDataFn ()
  return mergeDataOrFn(parentVal, childVal, vm)
}
//主逻辑在这个函数中
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
//
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal
  const keys = Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

```

最后返回的vm.$option 的值如下

```javascript
vm.$option = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup
  },
  directives: {
    model,
    show
  },
  filters: {},
  _base: Vue,
  el: '#app',
  data: function mergedInstanceDataFn(){},
  computed:{reverseMessage:f}
}

```

#### 2.3 initLifycycle(vm)

这个方法主要是给Vue组件实例对象vm上添加一些属性 ，包括$parent $root $children $refs 以及一些生命周期的标识

```javascript
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

#### 2.4 initEvents(vm)

这个方法的主要作用是给Vue组件的实例对象添加一些事件相关的属性 ，比如_events  _hasHookEvent等

```javascript
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

#### 2.5 initRender(vm)

这个方法主要是给Vue实例对象添加了一些DOM相关的属性

```javascript
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```

#### 2.6 callHook(vm, 'beforeCreate')

接下来调用组件实例对象的beforeCreate函数

```javascript
export function callHook (vm: Component, hook: string) {
  //从组件实例对象vm.$options中取到生命周期函数
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
  if (vm._hasHookEvent) { //这个属性在initEvents(vm)中声明了
    vm.$emit('hook:' + hook)
  }
}
```

#### 2.7initInjections(vm).  待研究 

```javascript
export const observerState = {
  shouldConvert: true
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
```

#### 2.8 initState(vm)

这里主要就是操作数据了，`props`、`methods`、`data`、`computed`、`watch`，从这里开始就涉及到了`Observer`、`Dep`和`Watcher`

```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  //操作props
  if (opts.props) initProps(vm, opts.props)
  //将传入vm.$options.methods中的key-value(fn)值给到vm实例对象，同时绑定value(fn)的this为vm
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    //将vm.$options.data给到vm实例属性vm._data (vm.$options.data是经过合并策略处理过的函数)，并侦听data的变化
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

最后看下此时的vm实例对象上是什么

```javascript
// _init
vm._uid = 0
vm._isVue = true
vm.$options = {
    components: {
		KeepAlive,
		Transition,
		TransitionGroup
	},
	directives: {
		model,
		show
	},
	filters: {},
	_base: Vue,
	el: '#app',
	data: function mergedInstanceDataFn(){}
}
vm._renderProxy = vm
vm._self = vm

// initLifecycle
vm.$parent = parent
vm.$root = parent ? parent.$root : vm

vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false

// initEvents	
vm._events = Object.create(null)
vm._hasHookEvent = false

// initRender
vm.$vnode = null
vm._vnode = null
vm._staticTrees = null
vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext)
vm.$scopedSlots = emptyObject

vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)

vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
// 在 initState 中添加的属性
vm._watchers = []
vm._data
vm.message
```

#### 2.9 callHook(vm, 'created')

这个时候就会调用created函数

我们看到`create`阶段，基本就是对传入数据的格式化、数据的双向绑定、以及一些属性的初始化。

至此，创建一个Vue组件的全部过程已经完毕

Q:observe观察者如何实现