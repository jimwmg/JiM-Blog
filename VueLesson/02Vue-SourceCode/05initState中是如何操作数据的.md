---
title:  initState中是如何操作数据的
date: 2017-11-30
categories: vue
---

###1 在new Vue构造函数博文中，2.8处有如下解读：

2.8 initState(vm)

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
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  //对于根组件 isRoot ==> true 
  //对于其他组件 isRoot ==> false
  const isRoot = !vm.$parent
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  //这里propsOptions就是通过 Vue.extend(option)传入的option中的porps,但是是经过normalizeProps处理后的，也就是说如果options.props是数组，会被处理为一个对象；
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
   //.....我简化了代码
      //这里进行数据和视图的双向绑定：后期在详细分析
      //主要作用就是给 vm._props 通过Object.defineProperty(obj,key,{});
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
```

#### 2.2 initMethods(vm, opts.methods)

主要作用就是将options中methods属性的值(对象)，给到vm实例，并且绑定其中的方法执行上下文为该组件的实例对象

```javascript
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
 //主要作用在这里实现
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
  observe(data, true /* asRootData */)
}

//Check if a string starts with $ or _
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}
```

#### 2.5 initComputed(vm, opts.computed) 

主要作用是

```javascript
function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    //如果computed对象key对应的value值是函数，那么getter就去改value值
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

#### 2.6 initWatch(vm, opts.watch)

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

Q:以上源码中发现都会有一个observe函数去监听对应的属性值然后响应到UI中，另外会有文章分析如何实现的；