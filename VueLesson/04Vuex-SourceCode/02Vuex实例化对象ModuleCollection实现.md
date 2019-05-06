---
title: Vuex实例化store对象ModuleCollection源码
date: 2017-12-27
categories: vue
---

### 1 使用
```javascript
// new Vuex.Store(options)
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
  },
  /**
  cart 和 products也是类似于这个结构
  modules: {
    cart,
    products
  },
  */
});
console.log(userStore);//可以输出看下结果
```

###  2 源码实现

Store.js 中store构造函数

```javascript
export class Store {
  constructor (options = {}) {
    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
      //本文主要解释  ModuleCollection的实现
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))

    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }

// .......
}
```



###  this._modules = new ModuleCollection(options)

module-collection.js

```javascript
export default class ModuleCollection {

  constructor (rawRootModule) {
    //new Vuex.Store(options)中的options就是这个rawRootModule
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }
  get (path) {
      //如果提供了初始值initialValue，且数组为空，那么不会执行回调函数，此唯一值initialValue会被返回
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)  //返回的就是 this.root : 也就是new Module(rawModule,runtime) 
  }
  //path:[]  rawModule:options  runtime:false
  register (path, rawModule, runtime = true) {
    if (process.env.NODE_ENV !== 'production') {
      //主要对传入的options对象中的 getters actions  mutations进行断言，判断传入的值是否符合要求
      assertRawModule(path, rawModule)
    }
	//rawModule :options  runtime :false
    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) {
      //给store对象注册主模块newModule
      this.root = newModule
    } else {
      //如果options存在modules属性，在递归注册子模块的时候，会走这里
      //这里也是通过reduce实现的查找，过程真的太优雅，reduce函数的强大之处
       //['cart'].slice(0,-1) ==> [ ]
      const parent = this.get(path.slice(0, -1))  // parent ==> 主模块 newModule
      //将子模块注册到父模块的 _children 对象中
      parent.addChild(path[path.length - 1], newModule) // 参数为 'cart' newModule
    }
	//给store对象递归注册子模块
    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
      //这里一点儿小的细节，对于path:[]，数组的concat方法不会改变原来的数组，会返回一个拼接后的新的数组
        //这里每次循环的时候，path就是[]或者上次的拼接后的数组，也就是register函数中传进来的path值
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
}

//
const assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
}
function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(key => {
    //这里对getters. mutations. actions 进行处理，如果没有传对应的属性值，则不进行处理
    if (!rawModule[key]) return

    const assertOptions = assertTypes[key]
//value:options.getters.getUserInfo   type:getUserInfo
    forEachValue(rawModule[key], (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      )
    })
  })
}
```

util.js

```javascript
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
```

下图展示 ： `store._modules`

![store上模块的注册](../img/vuexModules.png)

module.js

返回值就是给到了 `store._modules.root`

```javascript
export default class Module {
  //rawModule:options ; runtime:false
  constructor (rawModule, runtime) {
    this.runtime = runtime  //false
    this._children = Object.create(null) //用于存放 addChild添加进来的子模块
    this._rawModule = rawModule //传入的new Vuex.Store(options)中的options
    const rawState = rawModule.state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
    //这里访问this.namespaced的时候，会执行这个get函数
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }
    //以下在installModule中会使用
  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
```

### 3 主要作用：就像函数名表示的一样，其实就是循环地对所有的模块进行收集，然后给到`_modules`属性

**该属性主要是存放了所有模块 `new Module(options)`之后的信息**

```javascript
 this._modules = new ModuleCollection(options) //主要是看下这行代码的作用
```

```
															  runtime
store实例对象												    state
                                                              _children(new Module(opt))                            store._modules => store._modules.root => new Module(options)  _rawModle (options)			
                                                              
_children 中存放着父模块中所有modules选项对应的子模块											          _rawModule 中存放着当前模块对应的options
```



