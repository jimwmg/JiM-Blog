---
title:  Vue双向数据绑定原理
date: 2017-12-04
categories: vue
---

## 前言：在《initState中是如何操作数据的》文章中，没有详细分析Vue是如何实现双向绑定的，这里来进行实际分析下

```html
<body id='mybody'>
  <div id='example'>
    <p>我是静态staticRenderFns</p>
    <p>this is {{message}}</p>
    <p>this is computed {{reverseMessage}}</p>
    <p>this is method {{reverseMessageM()}}</p>
    <p>{{watchMessage}}</p>
  </div>
    
  
</body>
<script>
  //类名如果带有 — 字符，比如 text-danger,那么就必须加上引号，如果没有 - ，那么就不需要加引号；
var vm = new Vue({
  // el:document.getElementById('example'),
  el:"#example",
  // el:document.querySelector('#example'),
  //这是Vue实例的属性
  data:{
    message:"hello Vue",
    watchMessage:"original",
    
  },
  //这是一个计算属性
  computed:{
    reverseMessage:function(){
      return this.message.split('').reverse().join("");
    }
  },
  methods:{
    reverseMessageM:function(){
      return this.message.split('').reverse().join("");
    },
    otherMessageM:function(){
    }
  },
  watch:{
    watcher1:function(newValue){
      this.watchMessage = this.message;
      console.log('message changed')
    },
    watcher2:function(){}
  }
})
console.log(vm);//输出看下vm._watchers vm._watcher

</script>
```

**原理实现：** vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动（set函数执行）时发布消息给订阅者，触发相应的监听回调。

### 首先来看一下整体的实现流程 

**Observe**

* 给每一个data上的属性设置setter 和getter:《new Vue构造函数》中2.8的部分，每一个属性对应一个Observe，每一个`Observer`对应一个`Dep`，;它内部维护一个数组，保存与该`Observer`相关的`Watcher`。
* 一个Vue实例上有多个属性，多个Observe,多个Dep,对应一个Vue组件实例；

```javascript
let data = vm.$options.data
observe(data, true /* asRootData */);//监听某个属性
```

src/core/observe/array.js

```javascript
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
  .forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  //这里覆盖掉原来的数组方法；所以说如果对new Vue(options) 中的data:{list:[1,2,3]}中的list,使用push,pop，shift,unshift,splice,sort,reverse这些改变数组本身的方法，结果也是响应式的；
  //这里也就是解决数组不能通过getter,setter监听删除，增加数组元素同步UI更新的问题；
  //对于对象而言，增加和删除对象的属性，则需要通过Vue.set. Vue.delete方法来解决这样的问题；
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
        case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})

```



src/core/observe/index.js

```java
import Dep from './dep'
export const observerState = {
  shouldConvert: true
}
//引用数组重写方法
import { arrayMethods } from './array'
/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
  /**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

//对于对象和数组的监听情况，在《Vue双向数据绑定实现原理2》中有案例解释；
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
      //给value值定义 __ob__ 属性，表示该对象已经处于被观察的状态
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
//env.js   export const hasProto = '__proto__' in {}
      const augment = hasProto
        ? protoAugment
        : copyAugment
       //如果是数组，首先重写数组原型上的这些方法，
      augment(value, arrayMethods, arrayKeys)
       //如果传入的value是一个数组，则对数组中的每一个元素进行监听
      this.observeArray(value)
    } else {
       //如果传入的value是一个对象，则对对象中的每一个元素进行监听；
      this.walk(value)
    }
  }
//最后都会执行到defineReactive这个函数中去
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
  //observe用于观察一个对象，返回一个与被观察对象相关的对象
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    //如果传入observe的不是对象，则直接返回，不会进行监听，也就是说，如果data:{items:[1,2,3]}
    //那么 this.items[0] = 1000 ;不会触发更新；
    return
  }
  let ob: Observer | void
    //如果该对象已经被观察，则返回 new Observe(value)对象
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    //如果该对象没有被观察，则创建一个观察该value对象的对象；
    //在new Observe(value)执行的过程中，会执行defineReactive对每一个对象中的每一个key对应的值创建一个dep，如果用户为这个值传入getter和setter，则暂时保存。observe方法稍后介绍。之后通过Object.defineProperty，重新添加装饰器。在getter中，dep.depend其实做了两件事，一是向Dep.target内部的deps添加dep，二是将Dep.target添加到dep内部的subs，也就是建立它们之间的联系。在setter中，如果新旧值相同，直接返回，不同则调用dep.notify来更新与之相关的watcher。customSetter在开发过程中输出错误用。
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
//这里主要实现对data中的每个属性，以及data深层次的属性的监听（props computed等的监听也是类似的实现）
//比如 data:{deepName:{name:'deepJhon'}} 
//这里会对deepName，name 属性都会进行监听
//比如 this.deepName 变化会触发视图更新，this.deepName.name的变化也会触发视图的更新；
//但是对于属性的删除或者增加，Vue是无法感知的，比如通过 delete vm.$data.deepName.name. 执行之后，UI视图是不会发生变化的
//但是在控制台输出 vm.$data.deepName.name确实是 undefined
export function defineReactive (obj,key,val) {
  //对于每一个被观察的属性，都有一个dep对象，用来维护Observe和Watcher的关系；
  //对于监听到数据的变化的时候，那么监听到变化之后就是怎么通知订阅者？很简单，维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法；这里的dep就是这样的一个数组；
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
//....
    //这里对对象的嵌套对象属性进行监听；
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    //这里，当组件render的时候，会调用这里get函数，添加订阅者
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
//vm._watcher = new Watcher(vm, updateComponent, noop) 这个是核心，当vue组件第一次挂载的时候，会执行get函数，该函数负责向dep依赖中添加 Watcher 对象的函数，也就是 updateComponent，这也是为什么给组件属性重新赋值会更新 UI 的根本原因；
      if (Dep.target) {
        //dep.depend()会执行实例Watcher类的addDep()函数，而该函数，又会执行dep实例的dep.addSub,会在subs数组中放入一个Watcher实例对象；
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    //这里监听到每个数据的变化
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      //这里，每次给vm.$option.data中的属性等进行赋新值操作的时候，发布一个通知，告诉所有的依赖更新model层面的数据；
      childOb = !shallow && observe(newVal)
        //这里当改变监听的数据的值的时候，会触发new Watcher传入的函数
      dep.notify()
    }
  })
}
```

**Watcher**：作为订阅者，只需要通过获取一下被监听的属性值，就可以添加订阅者；

* 设置完observer（getter,setter）之后,添加watcher:《new Vue构造函数》2.10.2

如果没有computed和watcher属性，那么可能所有的data属性也就只有这一个Watcher实例

**这里是最核心的实现双向绑定的源代码：所有的组件都会有`_watcher`，中绑定了updateComponent**

* new watcher() 会执行updateComponent函数，这个函数会执行所有data对象中每个属性的getter,会将updateComponent这个函数放入每个data对象的属性dep依赖中
* 所以当给data属性重新赋值的值，会执行这个属性的setter函数，这个setter函数就会触发dep依赖中的Watcher实例中updateComponent函数，从而实现了双向数据绑定的效果；

```javascript
vm._watcher = new Watcher(vm, updateComponent, noop)
```

src/core/observer/watcher.js

```javascript
constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
 //注意这里，这里是对watch中的 vm.$watch(keyOrFn, handler, options)，传入的keyOrFn为字符串的情况
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
  //会先执行Watcher对象的get方法；
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () {
    /**
    export function pushTarget (_target: Watcher) {
      if (Dep.target) targetStack.push(Dep.target)
      Dep.target = _target；//当前的Watcher对象
    }
    给Dep全局函数添加静态属性，添加的是一个Watcher;
    */
    pushTarget(this)
    let value
    const vm = this.vm
    if (this.user) {
      try {
        value = this.getter.call(vm, vm)
      } catch (e) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      }
    } else {
      /*
      updateComponent = () => {
        vm._update(vm._render(), hydrating)
      }
      执行这个函数的时候，会触发每个被监听的属性get函数，从而实现添加订阅者；
      **/
      value = this.getter.call(vm, vm)
    }

    if (this.deep) {
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
    return value
  }
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        //这个this指的是每一个Watcher实例对象
        dep.addSub(this)
      }
    }
  }
	/**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
/**简化实现
export default function Watcher (vm, expOrFn, cb) {
  this.cb = cb
  this.vm = vm
  this.expOrFn = expOrFn
  this.value = this.get()
}

Watcher.prototype.get = function () {
  Dep.target = this
  const value = this.vm._data[this.expOrFn]
  // 此时 target 有值，此时执行到了上面的 defineReactive 函数中 get 函数。就添加订阅者
  Dep.target = null
  // 为了不重复添加 就设置为 null
  return value
}
*/
```

**Dep**

* Dep是将Observe和Watcher联系起来的，每一个属性对应一个Observe,每一个`Observer`对应一个`Dep`，它内部维护一个数组，保存与该`Observer`相关的`Watcher`

```javascript
/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    //sub就是Watcher实例对象
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      //这里执行Watcher类的addDep，Dep.target就是Watcher实例对象，
      //this指的是dep实例对象
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

```

我们先来看看`Watcher`的两种主要用途：一种是更新模板，另一种就是监听某个值的变化。

首先从整体上来了解，new Watcher（vm,expOrFn,cb,options)的时候，会执行传入的expOrFn

* 模板更新 

```
 vm._watcher = new Watcher(vm, updateComponent, noop)
```

这是因为创建`Watcher`会调用`this.get`，也就是这里的`updateComponent`。在`render`的过程中，会调用`data`的`getter`方法，以此来建立数据的双向绑定，给每个属性添加dep依赖添加watcher实例对象；当数据改变的时候，会通知watcher实例对象，该实例对象负责重新触发`updateComponent`。

**注意这里的Watcher实例对象的this.get方法返回值是updateComponent函数的返回值，也就是undefined,所以此时仅仅用来作为数据的渲染**

* 监听数据 （这里new Watcher）

```javascript
//watch选项
const watcher = new Watcher(vm, expOrFn, cb, options)
//computed选项
function initComputed (vm: Component, computed: Object) {
    const watchers = vm._computedWatchers = Object.create(null)
    // computed properties are just getters during SSR
    const isSSR = isServerRendering()

    for (const key in computed) {
        const userDef = computed[key]
        //如果computed对象key对应的value值是函数，那么getter就去改value值,如果是一个对象，那么就去取设置的get
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (process.env.NODE_ENV !== 'production' && getter == null) {
            warn(
                `Getter is missing for computed property "${key}".`,
                vm
            )
        }
        //如果不是服务端渲染，那么创建监听
        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions
            )
        }

```

另一个用途就是我们的`computed`、`watch`等，即监听数据的变化来执行响应的操作。

此时`this.get`返回的是要监听数据的值。初始化过程中，调用`this.get`会拿到初始值保存为`this.value`，监听的数据改变后，会再次调用`this.get`并拿到修改之后的值，将旧值和新值传给`cb`并执行响应的回调。

接下来我们谈谈`queueWatcher`，从函数名我们大致可以猜出，它是把当前的`watcher`添加到一个队列中。我们知道，`Vue`中页面的更新是异步的，所以一系列数据的变化，会在之后的某一时刻统一更新。我们来看看该方法的代码。

```javascript
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

我们的`watcher`有从小到大的唯一`id`，在页面更新时，会按照一定的顺序依次更新，这里做了一个判断，如果`watcher`列表正在更新，则把新的`watcher`添加到对应的位置，并更新。否则，在下一个`nextTick`中执行`flushSchedulerQueue`。

```javascript
function flushSchedulerQueue () {
  flushing = true
  let watcher, id, vm

  queue.sort((a, b) => a.id - b.id)

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()

  }

  const oldQueue = queue.slice()
  resetSchedulerState()  // 重置队列

  index = oldQueue.length
  while (index--) {
    watcher = oldQueue[index]
    vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }

}

```

该方法首先按照从小到大将`watcher`排序，并依次执行它的`run`方法。`vm._watcher`保存的是渲染模板时创建的`watcher`，所以如果队列中有该`watcher`，则说明模板有变化，随之调用'updated'钩子函数。





参考

[既简单实现](https://github.com/DMQ/mvvm)

[Vue中的响应式源码实现](https://github.com/Ma63d/vue-analysis/issues/1)