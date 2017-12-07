---
title:  new Vue构造函数
date: 2017-11-27 
categories: vue
---

### 1 Vue的基本使用

```html
<div id="app">
  <p>{{message}}</p>
  <my-comp parent='parentData' v-bind:msg="message"></my-comp>
</div>

```

```javascript
console.dir(Vue) ;//我们可以看下Vue构造函数上的静态属性和原型属性都有哪些值，下面会分析这些属性的来源；
var myComp = Vue.extend({
  props:['parent','msg'],
  template:' <div><p>{{parent}}</p><span>{{msg}}</span></div>'
})
Vue.component('myComp',myComp)
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
      //如果是子组件，会进入这个分支
      //根据上面的小demo不会进入这个分支
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      //进入这个分支
      //2.1
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
    //组件实例的生命周期中一个函数  beforeCreate执行（如果有的话）
    callHook(vm, 'beforeCreate')
    //以下就是Vue组件实例的创建过程
    //我们看到create阶段，基本就是对传入数据的格式化、数据的双向绑定、以及一些属性的初始化。
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    //这里，在组件创建完毕之后，调用组件生命周期函数 created（如果有的话）
    callHook(vm, 'created') //在这里可以进行后台数据的请求，重写vm对象的data数据等

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
//执行到这里，当vm实例对象创建完毕之后，开始将这个对象挂载到DOM上了，这个时候，如果vm实例对象有要挂载的DOM节点，那么就执行 $mount函数
    //2.10
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
  parent: Object,//Vue.option
  child: Object,//new Vue(option)中的option
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }
//注意这些操作child(也就是传入 new Vue(option)中的值option)
  //这里会将  option.props是数组的情况，转化为option.props为一个对象
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

```javascript
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  //这里声明一个空对象
  const res = {}
  let i, val, name
  //这里操作这个对象
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  //这里传入的options.props最终都会被转化为一个对象；
  options.props = res
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
//这个函数在生成虚拟DOM的时候会用到
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

#### 2.10 vm.$mount(vm.$options.el) 

2.1——>2.9创建完vm实例对象之后，并且实现了一些数据的双向绑定等操作之后，就要执行将vm实例对象挂载到对应的DOM节点上了；

如果vm实例对象传入的参数中有el属性，那么该属性就可以查找到被挂载的DOM节点，然后往这个节点上挂载组件，执行   $mount   函数，该函数的主要功能就是

* 生成用于返回VNode的render函数
* 执行Vue.prototype._render()该函数会执行上面生成的render函数，返回VNode对象
* 执行Vue.prototype.update(VNode)将虚拟Vnode对象挂载到真实的DOM节点上

```javascript
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

[platforms/web/entry-runtime-with-compiler.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)

这三种渲染模式(el,template,render)最终都是要得到Render函数。只不过用户自定义的Render函数省去了程序分析的过程，等同于处理过的Render函数，而普通的template或者el只是字符串，需要解析成AST，再将AST转化为Render函数。

```javascript
//缓存住在 runtime/index.js中定义的  $mount. 函数
const mount = Vue.prototype.$mount ;
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  //可以理解为一个查询DOM节点的，类似于document.querySelector
  el = el && query(el)

  /* istanbul ignore if */
  //vue组件不能挂载到body和html上
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    
    return this
  }
//引用了vm.$options
  const options = this.$options
  // resolve template/el and convert to render function
  //如果没有render函数，则获取template，template可以是#id、模板字符串、dom元素，
  //如果没有template，则获取el以及其子内容作为模板。
  //从这里也就可以看到，如果对于一个子组件，传入的option对象一般没有el属性，但是都会有template属性，对于根组件一般有el属性，却没有template属性；
  if (!options.render) {//如果没有写render函数，那么Vue会解析成ast生成render函数；
    let template = options.template
    if (template) {
      //提供了template属性
      if (typeof template === 'string') {
        //template传值可以是字符串或者id
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
        //也可以是一个node节点
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
      //如果没有template属性，有el,则去el的outerHTML
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      //这里会解析template
//这里可以看到给vm.$options添加了 render和staticRenderFns
     //编译render函数,下面有讲解如何生成编译函数render的；
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      // staticRenderFns是为了优化，提取那些后期不用去更新的节点
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

#####2.10.1 最后的vm实例对象上有了render和staticRenderFns属性

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
  render:ƒ anonymous(),
  staticRenderFns:[],
  filters: {},
  _base: Vue,
  el: '#app',
  data: function mergedInstanceDataFn(){},
  computed:{reverseMessage:f}
}


```

* with语句，with语句可以理解为给with语句后面的表达式expression添加了一个作用域，作用域就是with语句中的实例,expression中的语句在查找变量的时候会直接在这个对象上查找
* new Function(str) :将字符串作为一个函数的内容，最终返回这个函数（对于字符串的内容没有限制）

```javascript
var obj = {name:"jhon"}
//with(instance Object){expression}
var str = "with(obj){console.log(this,name,'hhh')}"
var ret = new Function(str);
console.log(ret());//window jhon  hhh
var ret2 = new Function('console.log("sss")');
ret2();//sss
//ret2 : function(){console.log("sss")}
```

最终生成的render函数类似于这样的：过程就是解析template

```javascript
render = function () {
	with(this){return _c('div',{attrs:{"id":"app"}},[_c('p',[_v(_s(message))])])}
}
```

render函数的生成流程大致如下

先说一下render函数的编译的主要几个步骤，这可以帮助我们从整体上把握它：

1. 给编译options添加web平台特性
2. 将template字符串解析成ast
3. 优化：将那些不会被改变的节点（statics）打上标记
4. 生成render函数字符串，并用with包裹（最新版本有改为buble）
5. 通过new Function的方式生成render函数并缓存

```javascript
const { render, staticRenderFns } = compileToFunctions(template, {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
  delimiters: options.delimiters,
  comments: options.comments
}, this)
```

```javascript
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
export function createCompileToFunctionFn (compile: Function): Function {
  //用来缓存render和staticRenderFns的对象
  const cache: {
    [key: string]: CompiledFunctionResult;
  } = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    //这里传入的options参数就是上面调用的时候传入参数中template后面的那个对象；
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn
    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }
    // compile  第 1 2 3 4 步骤都在这个函数中
    const compiled = compile(template, options)
    // turn code into functions
    //第 5 步：生成render函数并缓存
    const res = {}
    const fnGenErrors = []
    //注意这里是从const compiled = compile(template, options)中compiled中拿到的render函数字符串的
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })
    //....
    return (cache[key] = res)
  }
}
```

第 1 2 3 4步是如何运行的呢？

那么我们就去看下compile函数

```javascript
// 这是web平台特性下需要给compile添加的options
export const baseOptions: CompilerOptions = {
  isIE,
  expectHTML: true,
  modules, // web平台才有的module， 这个用于virtual dom
  staticKeys: genStaticKeys(modules),
  directives,  // web平台才有的指令
  isReservedTag, // 保留节点
  isUnaryTag, // 自闭和节点
  mustUseProp, // 必须用固有属性来做绑定
  getTagNamespace, // tag的命名空间
  isPreTag
}
export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
       //这个options就是最初调用compileToFunctions函数的时候传入的options;
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
            Object.create(baseOptions.directives),
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
//最后执行baseCompile函数  第 1 步：
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

baseCompile

```javascript
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
   //这里的options就是上面的finalOptions,也就是baseOptions
  options: CompilerOptions
): CompiledResult {
  //第 2 步 ：ast解析:abstract syntax tree，是将template解析成一颗树状结构。这个树就是所谓的virtual dom,每个节点被命名为ASTElement，借助flow,还是很容易知道这个element具体有些什么的。
  const ast = parse(template.trim(), options)
//第 3 步 ：优化
  optimize(ast, options)
//第 4 步 ：拼接render函数字符串
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

最后的ast类似于这样的

```javascript
{
  type: 1,
  tag: 'div',
  plain: false,
  parent: undefined,
  attrs: [{name:'id', value: '"app"'}],
  attrsList: [{name:'id', value: 'app'}],
  attrsMap: {id: 'app'},
  static: false,
  staticRoot: false,
  children: [{
    type: 1,
    tag: 'p',
    plain: true,
    parent: ast,
    attrs: [],
    attrsList: [],
    attrsMap: {},
    static: false,
    staticRoot: false,
    children: [{
      expression: "_s(message)",
      text: "{{message}}",
      type: 2,
      static: false
    }]
  }
```

最后生成的code.render: const code = generate(ast, options)

```javascript
render = function () {
	with(this){return _c('div',{attrs:{"id":"app"}},[_c('p',[_v(_s(message))]),_c(myComp,{attrs:{"parent":"parentData","msg":message}})])}
}
//这个with语句时重点，这里直接使得其函数内可以直接访问Vue实例上声明的所有属性的值，比如这里的message,同样也可以直接将父组件的值传递给子组件，还是比如这个message,需要注意的一点是如果message的值是一个引用类型的值，那么传递给子组件的就是这个引用，此时子组件中如果修改了message,那么父组件也会变化；                                                             
```

#####2.10.2 当把Vue实例对象和DOM节点关联起来之后，也就是说render函数拼接完毕之后，并且给到vm实例对象的vm.$options.render，接下来就执行真正的

```javascript
return mount.call(this, el, hydrating)
```

runtime/index.js

```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

src/core/instance/ifecycle.js

```javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  //执行定义的生命周期函数 beforeMount
  callHook(vm, 'beforeMount')

  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    //这里定义了updateComponent函数
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  /* istanbul ignore if */
  vm._watcher = new Watcher(vm, updateComponent, noop)
  //给hydrating 赋值为false
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

* 调用了`beforeMount`钩子函数，
* 新建了一个`Watcher`对象，绑定在`vm._watcher`上，
* 之后就是判断如果`vm.$vnode == null`，则设置`vm._isMounted = true`并调用`mounted`钩子函数
* 最后返回`vm`对象。

在new Watcher的时候会执行Watcher类的构造函数，而该构造函数会执行传入的updateComponent函数；

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
    ...
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
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
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () {
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
      value = this.getter.call(vm, vm)
    }

    if (this.deep) {
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
    return value
  }
```

以下执行的updateComponent函数

```javascript
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

* 首先执行vm._render()函数,生成虚拟vnode对象

src/core/instance/render.js

```javascript
Vue.prototype._render = function (): VNode {
    const vm: Component = this
  //这里获取到 vm.$options上的render,staticRenderFns，parentNode,这里的render函数就是compileToFunctions中生成的编译render函数
  /**
  诺，就是这个
  render = function () {
  //这里的with语句使得可以直接通过 _c访问this上的方法 _c;
	with(this){return _c('div',{attrs:{"id":"app"}},[_c('p',[_v(_s(message))])])}
}
  **/
    const {
      render,
      staticRenderFns,
      _parentVnode
    } = vm.$options
 
 	...
    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = []
    }

    vm.$vnode = _parentVnode
    // render self
    let vnode
      //这里就执行了那个编译之后的render函数，如果我们传入的optionh中写入render，那么就不会生成ast解析之后的render函数，而是直接直接我们传入的render函数；注意执行我们传入的render函数的时候，vm.$createElement最后一个参数为true;
    vnode = render.call(vm._renderProxy, vm.$createElement)
   	...

    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
//详细参考《vnode对象是如何生成的？》
```


所以，从上面可以看出，`render`函数返回的是一个`VNode`对象，也就是我们的虚拟dom对象。它的返回值，将作为`vm._update`的第一个参数。

* 接下来执行vm._update()函数

```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
  }
//详细参考《VNode对象的真正渲染patch函数》
```

从`mountComponent`中我们知道创建`Watcher`对象先于`vm._isMounted = true`。所以这里的`vm._isMounted`还是`false`，不会调用`beforeUpdate`钩子函数。

下面会调用`vm.__patch__`，在这一步之前，页面的dom还没有真正渲染。该方法包括真实dom的创建、虚拟dom的diff修改、dom的销毁等，具体细节且等之后在分析。

至此，一个`Vue`对象的创建到显示到页面上的流程基本介绍完了






参考：

[Vue中render源码实现](http://blog.cgsdream.org/2016/11/23/vue-source-analysis-3/)

[createElement源码解析](http://www.debugrun.com/a/jJYFZMo.html)

Q:observe观察者如何实现