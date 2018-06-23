---
title:  initState中是如何操作数据的
date: 2017-11-30
categories: vue
---

###1 在new Vue构造函数博文中，2.8处有如下解读：

2.8 initState(vm)

这里主要就是操作数据了，`props`、`methods`、`data`、`computed`、`watch`，从这里开始就涉及到了`Observer`、`Dep`和`Watcher`

**首先需要有个概念，instate中的处理props data computed method的顺序，要注意，**

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

### 2 接下来就在深入源码中看下Vue中到底是如何操作的

####看如下例子

```html
    <div id='dv'>
        <my-comp parent='parentData' v-bind:msg="message"></my-comp>
        <p>this is {{message}}</p>
    	<p>this is computed {{reverseMessage}}</p>
    	<p>this is method {{reverseMessageM()}}</p>
    </div>
    <div id='tep'>

    </div>
    <script>
        //  注意注册组件的时候，组件名字不能是尽量 'my-comp' 而不要'myComp' ，因为会解析成 mycomp,如果要这么定义，那么使用的时候需要 'my-comp';
        //这是因为html标签仅支持小写，对于我们写的组件名称包含驼峰的时候，使用的时候需要用连字符 - ；
        var myComp = Vue.extend({
            props:['parent','msg'],
            template:' <div><p>{{parent}}</p><span>{{msg}}</span></div>'
        })
        Vue.component('myComp',myComp)
        var vm = new Vue({
            el:"#dv",
            data:{message:"vueMessage"},
            // components:{'myComp':myComp},
          methods:{
            reverseMessageM:function(){
              return this.message.split('').reverse().join("");
            }
          },
          computed:{
            reverseMessage:function(){
              return this.message.split('').reverse().join("");
            }
          },
        }
        console.log(vm);//从这里可以看到children中的$options中props
    </script>
```

observer/index.js

```javascript
export const observerState = {
  shouldConvert: true
}
```

instance/state.js中

#### 2.1 initProps(vm, opts.props)

主要作用就是将props数据和视图进行双向绑定；

```javascript
function initProps (vm: Component, propsOptions: Object) {
  //初始化 vm.$options.propsData
  const propsData = vm.$options.propsData || {}
  //初始化vm._props 
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  //初始化 vm.$options._propKeys
  const keys = vm.$options._propKeys = []
  //对于根组件 isRoot ==> true 
  //对于其他组件 isRoot ==> false
  const isRoot = !vm.$parent
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  //这里propsOptions就是通过 Vue.extend(option)传入的option中的porps,但是是经过normalizeProps处理后的，也就是说如果options.props是数组，会被处理为一个对象；
  for (const key in propsOptions) {
    //将vm.$options._propKeys 数组中添加key值
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
   //.....我简化了代码
      //这里进行数据和视图的双向绑定：后期在详细分析
      //主要作用就是给 vm._props 通过Object.defineProperty(vm._props,key,{});
      defineReactive(props, key, value)
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    //这里将上面给到 vm._props的属性，在遍历给到vm实例本身
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
//observe/index.js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
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
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

#### 2.2 initMethods(vm, opts.methods)

主要作用就是将options中methods属性的值(对象)，给到vm实例，并且绑定其中的方法执行上下文为该组件的实例对象

```javascript
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
 //主要作用在这里实现，给methods中的函数绑定this值为vm实例对象，同时将绑定后的函数给到vm实例对象
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
```

####2.4 initData(vm)

主要作用是将data属性进行双向绑定同时将其给到vm对象

```javascript
function getData (data: Function, vm: Component): any {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  }
}
function initData (vm: Component) {
  let data = vm.$options.data
  //options中的data属性可以是一个对象也可以是一个，无论是在根组件还是在子组件，函数和对象都是可以的
  //但是一般子组件中要以函数的形式作为data属性的值，因为子组件可能被调用多次，通过函数的方式可以返回不同的对象；
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      //检测data中的属性是否和methods中的属性有重复
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    //检测data中的属性是否和props中的属性有重复
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
      //只代理data中属性不是以 _.  $. 开头的属性
    } else if (!isReserved(key)) {
      //将data中的属性给到vm实例对象
      proxy(vm, `_data`, key)
    }
  }
  // observe data  实现双向绑定
  //详细实现原理参见《Vue双向数据绑定原理》
  observe(data, true /* asRootData */)
}

//Check if a string starts with $ or _
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}
```

#### 2.5 initComputed(vm, opts.computed) 

**重点注意下下面两种computed属性的声明方式，结合源码看下，属性时对象和函数的时候，vue内部是如何处理的**

```javascript
var vm = new Vue({
  data: { a: 1 },
  computed: {
// 仅读取
// 这里不能给计算属性设置值，因为VUE内部默认的set函数会有警告；
    aDouble: function () {
      return this.a * 2
    },
// 读取和设置，这里的应用场景就是某个计算属性被读取的时候会通过用户定义的 get 函数执行获取结果；
// 设置计算属性的值的时候，会执行 set 函数
//这里的get和set会通过 sharedPropertyDefinition 通过Object.defineProperty(obj,key,despictor) 进行赋值；
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // => 2
vm.aPlus = 3
vm.a       // => 2
vm.aDouble // => 4
```

```javascript
const computedWatcherOptions = { lazy: true }
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

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      //这里将computed中对应的key-value（经过处理的key-value）给到vm实例作为其属性
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      //computed中的属性值不能和data和props中的属性值重复
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

注意这一段代码，和《Vue双向数据绑定的原理》的

```javascript
vm._watcher = new Watcher(vm, updateComponent, noop)
```

注意这里的流程，如上案例，这里又会执行getter函数，而这个getter函数就是每个computed属性对应的那个函数，执行该函数的时候，又会重新获取data的每个数据的值，从而又会重新触发data属性的getter函数，又会走和下面这行代码一行的流程；

```javascript
vm._watcher = new Watcher(vm, updateComponent, noop)
```

**这里是最核心的实现双向绑定的源代码（data，props）：**

- new watcher() 会执行updateComponent函数，这个函数会执行所有 data 和 props 对象中每个属性的getter,会将updateComponent这个函数放入每个data 对象以及props对象的属性dep依赖中；
- 所以当给data ，props 这两个对象的属性重新赋值的值，会执行这个属性的setter函数，这个setter函数就会触发dep依赖中的Watcher实例中updateComponent函数，从而实现了双向数据绑定的效果；

```javascript
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

**这里是最核心的实现双向绑定的源代码（computed）：**

- new watcher() 会执行getter函数（每个computed属性对应的函数），这个函数执行的时候，可以看到，又会触发其依赖的data属性的getter，从而将每个computed属性对应的函数放入每个data对象的属性dep依赖中；
- 所以当给data属性重新赋值的值，会执行这个属性的setter函数，这个setter函数就会触发dep依赖中的Watcher实例中updateComponent，computed属性对应的函数，从而实现了双向数据绑定的效果以及data属性更新，computed同样会重新计算的效果；

#### 2.6 initWatch(vm, opts.watch)

```javascript
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: function (val, oldVal) { /* ... */ },
      immediate: true
    },
    e: [
      function handle1 (val, oldVal) { /* ... */ },
      function handle2 (val, oldVal) { /* ... */ }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1

```

```javascript
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher (
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(keyOrFn, handler, options)
}
```

```javascript
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    //这里传入的Watcher构造函数的expOrFn为字符串，参见《Vue双向数据绑定原理》，会将这个cb函数添加到keyOrFn这个字符串对应的data，props属性的依赖dep中，当对应的某个属性值变化的时候，这个函数也会执行，进而实现了watch的监控；
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

### 3 最后看下当重新给监听的数据赋值，触发data或者props的setter的时候，此时会触发其dep对象的notify函数

observe/dep.js

==> 给data或者props重新赋值，触发其setter函数，进而执行notify,触发这个属性的依赖数组中的所有Watcher实例对象的update函数

```javascript
notify () {
  // stabilize the subscriber list first
  const subs = this.subs.slice()
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()  //执行每一个Watcher实例对象的update函数
  }
}
```

==> 执行notify的时候，会执行该属性(data或者props)中所有依赖的Watcher的update函数，进而会执行 比如 updateComponent 或者computed 对应的函数

observe/watcher.js

```javascript
update () {
    /* istanbul ignore else */
    if (this.lazy) {
      //这个this.lazy对于computed对应的Wather实例来水就是惰性求值，
      this.dirty = true
      //如果这个watcher是同步的话，那么就执行执行run,如果不是，那么就
    } else if (this.sync) {
      this.run()
    } else {
      //否则将这个Watcher实例放入queueWatcher函数中
      queueWatcher(this)
    }
  }
```

==>执行每个Watcher实例对象的update的时候，会将每个Watcher实例对象放入queue中

observer/scheduler.js

```javascript
const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
//这里将所有数据的更新先放入queue中
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) { //在没有执行下一次nextTick的代码的时候，flushing的值一直是false，所以会将所有的Watcher实例对象放入queue数组中
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    //这里将flushSchedulerQueue函数放入异步队列，等这里代码执行完毕之后，在执行flushSchedulerQueue函数
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

==> 以上，假如某个data属性的值改变了

* 首先将该属性dep依赖中的所有的Watcher实例对象放入queue数组
* 然后将flushSchedulerQueue函数放入异步队列，等待所有的Watcher实例对象放入queue数组以及这次的代码执行完毕之后，异步执行；

==> 这里开始执行flushSchedulerQueue函数，也就是将会执行上一步中的queue数组中的Watcher实例对象中的run函数

observer/scheduler.js

```javascript
function flushSchedulerQueue () {
  flushing = true  //注意这个标记
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```

==> 这里就执行每个Watcher实例对象中对应的函数 run 函数

observe/watcher.js  

```javascript
 run () {
    if (this.active) {
      const value = this.get()  
 //注意这里：对于watch选项的产生的Watcher实例对象，该实例对象的get函数返回的是要观察的data或者props属性的值；
 // 
      if (
        //undefined !== undefined （false ) 所以对于updateComponent函数没有返回值，对应的Watcher实例对象不会进入这里
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {  //watch选项对应的Watcher实例对象的user属性为true
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```





Q:以上源码中发现都会有一个observe函数去监听对应的属性值然后响应到UI中，另外会有文章分析如何实现的；