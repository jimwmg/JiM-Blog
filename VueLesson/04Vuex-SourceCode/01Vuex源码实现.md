---
title: Vuex源码实现
date: 2017-12-26
categories: vue
---

### 1 看下基本的使用

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
//1 注册Vuex
Vue.use(Vuex);
//2 实例化Store对象
const userStore = new Vuex.Store({
  state: {
    userInfo: {}
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    setUserInfo({ commit }, user) {
      commit('setUserInfo', user);
    }
  }
});
console.log(userStore);//可以输出看下结果
//3 将其注册到Vue实例对象上，此时所有的Vue组件上都会共享store实例对象，在每个组件上都有$store这个引用，指向store实例对象
new Vue({
    store
}).$mount('#app');
console.log(vm);
```

### 2 看下Vuex的源码实现

vuex/src/index.js

```javascript
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

可以看到 Vuex 就是上面那样的对象

### 3 使用流程

####3.1 Vue.use(Vuex)

```javascript
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters 将arguments对象转化为数组，方便后面apply调用
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      //这个apply用的真巧妙，install函数中只接受第一个参数Vue构造函数，apply将args数组拆分开传过去也不会用到；
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

两个作用

- 第一：将plugin添加到Vue构造函数 `_installedPlugins` 数组上
- 第二：执行plugin上的install静态方法

执行plugin.install(Vue)

```javascript
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

install.js

```javascript
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue) //mixin.js
}
```

mixin.js

```javascript
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
      : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      //主组件会执行这里
      this.$store = typeof options.store === 'function'
        ? options.store()
      : options.store
      //其余子组件会执行这里
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

执行的作用还是给Vue.options.beforeCreate 数组中添加创建vm实例之前要执行的函数；此时这个vuexInit函数的作用是将store实例对象给到   **所有的组件实例**   添加$store 属性，该属性值指向store实例对象

**NOTE：对比VueRouter中注册beforeCreate函数，可以发现，两个函数都会在所有的子组件中实例对象上注册，但是只有Vuex中注册的这个生命周期才能真正的进入执行，VueRouter中注册的函数由于有isDef(this.$options.router的判断，所以不会进入if语句**

#### 3.2 创建store实例对象

```javascript
const userStore = new Vuex.Store({
  state: {
    userInfo: {}
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    setUserInfo({ commit }, user) {
      commit('setUserInfo', user);
    }
  }
});
console.log(userStore);//可以输出看下结果
```

options对象接受的参数如下

```javascript
state. getters  mutations   actions  modules.  plugins.  stricts. 
```

看下Vuex.Store的源码实现

```javascript

export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    //主要作用是防止使用Vuex.Store的时候还没有给Vue注册Vuex，这里还是类似于Vue.use(Vuex)的作用
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
//检测使用Vuex之前的必要的环境和注册是否完成，并且约束 Vuex.Store只能通过new 来调用
    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `Store must be called with the new operator.`)
    }
//通过ES6的解构赋值，拿到传入 new Vuex.Store(options)中options中的plugins和strict参数，解构赋值也有默认值
    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false  //标志一个提交状态，作用是保证对 Vuex 中 state 的修改只能在 mutation 的回调函数中，而不能在外部随意修改 state。
    this._actions = Object.create(null)//用来存储用户定义的所有的 actions。
    this._actionSubscribers = []//
    this._mutations = Object.create(null)//用来存储用户定义所有的 mutatins。
    this._wrappedGetters = Object.create(null)//用来存储用户定义的所有 getters 。
    this._modules = new ModuleCollection(options)//用来存储所有的运行时的 modules。
    this._modulesNamespaceMap = Object.create(null)//
    this._subscribers = []//用来存储所有对 mutation 变化的订阅者。
    this._watcherVM = new Vue()//主要是利用 Vue 实例方法 $watch 来观测变化的。

    // bind commit and dispatch to self
    const store = this
    //先将store实例对象原型上的dispatch和commit方法缓存起来
    //等价于 const dispatch = store.dispatch  ;const commit = store.commit
    const { dispatch, commit } = this
    //下面会重写store的dispatch和commit方法，实例对象的dispatch和commit将覆盖掉原型上的这两个方法
    //同时将这两个方法的this绑定到实例对象store
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict
//这里可以得到 new Vuex.Store(options) 中的state(如果state是函数则是其执行后返回的对象)
    const state = this._modules.root.state
//以下是store对象初始化的核心
    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    //主要是将每个模块中的action mutation getter state给到每个模块的state _actions _mutations _wrappedGetters等
    installModule(this, state, [], this._modules.root)
    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    //
    resetStoreVM(this, state)
    // apply plugins
    plugins.forEach(plugin => plugin(this))
    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }
  //下面是store实例对象的原型上的方法
  get state () {
    return this._vm._data.$$state
  }
  set state (v) {...}
  commit (_type, _payload, _options) {...}
  dispatch (_type, _payload) {...}
  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }
  subscribeAction (fn) {
    return genericSubscribe(fn, this._actionSubscribers)
  }
  watch (getter, cb, options) {...}
  registerModule (){...}
  unregisterModule (path) {..  }
  hotUpdate (newOptions) {...  }
  _withCommit (fn) {..  }
}

```

实例化store对象的时候，installModule 方法是把我们通过 options 传入的各种属性模块注册和安装；resetStoreVM 方法是初始化 store._vm，观测 state 和 getters 的变化；最后是应用传入的插件。

[《Vuex实例化store对象核心源码》/ 《Vuex实例化对象ModuleCollection实现》](https://github.com/jimwmg/JiM-Blog/tree/master/VueLesson)

最后生成的store实例对象如下

```javascript
store:{
  committing :false  //标志一个提交状态，作用是保证对 Vuex 中 state 的修改只能在 mutation 的回调函数中，而不能在外部随意修改 state。
  actions :Object.create(null)//用来存储用户定义的所有的 actions。
  _actionSubscribers : []//
  _mutations :{...}//用来存储用户定义所有的 mutatins。
  _wrappedGetters : {..}//用来存储用户定义的所有 getters 。
  _modules : new ModuleCollection(options)//用来存储所有的运行时的 modules。
  _modulesNamespaceMap : {..}
  _subscribers : []//用来存储所有对 mutation 变化的订阅者。
  _watcherVM : new Vue()
  __proto__:commit dispatch subscribe subscribeAction watch .....
}
```

### 3.3 启动Vue应用

```javascript
new Vue({
    store
}).$mount('#app');
```

这里，当我们new Vue(options)的时候，会首先执行callHook(vm, 'beforeCreate')生命周期函数数组

由于beforeCreate该函数是Vue构造函数Vue.options.beforeCreate  Vue.options.destroyed上，所以在实例化Vue组件的时候，就会在vm.$options.beforeCreate.   有这两个生命周期函数

在每个Vue组件上都会有这个钩子函数，当组件创建的时候，都会给每个组件实例对象vm上添加$store属性，指向我们创建store;

```javascript
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
      : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      //主组件会执行这里
      this.$store = typeof options.store === 'function'
        ? options.store()
      : options.store
      //其余子组件会执行这里
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}


```

### 4 总结

这里从Vue注册Vuex插件==> 生成store实例对象 ==> 启动Vue应用的时候，给所有的组件实例对象添加$store属性，便于访问到store实例对象

