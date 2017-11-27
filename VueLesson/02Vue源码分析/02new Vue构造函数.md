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
var app = new Vue({
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
console.dir(app) ;//同时看下输出的 Vue实例对象上的属性都有哪些，下面会分析这些属性是如何挂载上去的；
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

#### vm.$options 

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

