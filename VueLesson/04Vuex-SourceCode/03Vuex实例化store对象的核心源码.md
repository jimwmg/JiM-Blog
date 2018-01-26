---
title: Vuex实例化store对象的核心源码
date: 2017-12-27
categories: vue
---

### 1   installModule(this, state, [], this._modules.root)

installModule 方法是把我们通过 options 传入的各种属性模块注册和安装；

```javascript
//store：store实例对象；rootState:options.state;path:[],module:store._modules.root
//详见《Vuex实例化对象ModuleCollection源码实现》
function installModule (store, rootState, path, module, hot) {
  //表示 new Vuex.Store(options)中调用 是否为根元素
  const isRoot = !path.length  //true
  //获取我们传入options中的namespace 获取命名空间
  const namespace = store._modules.getNamespace(path)
	/**
	getNamespace (path) {
    	let module = this.root
    	return path.reduce((namespace, key) => {
      	module = module.getChild(key)
      		return namespace + (module.namespaced ? key + '/' : '')
    	}, '')
  	}
  	//这里可以看到如果我们设置了module.namespaced:true,那么它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。所以在commit的变化如下：commit('mutationName') ==>commit('moduleName/mutationName')
	**/
  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  //  
  //对于主模块 !isRoot:false. !hot:true. 无法进入该循环
  //对于子模块 !isRoot:true !hot:true. 可以进入循环
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    //将模块的state添加到state链中，是的可以按照 state.moduleName 访问
    store._withCommit(() => {
      //确保属性被创建后也是响应式的
      Vue.set(parentState, moduleName, module.state)
    })
  }
  /**
  make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
  模块上下文*/
  //module:store._modules.root.context = local ==> {dispatch,commit,getters,state}
  const local = module.context = makeLocalContext(store, namespace, path)
//module:store._modules.root = new Module(rawModule, runtime)
  // 注册对应模块的mutation，供state修改使用  store._mutations
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })
// 注册对应模块的action，供数据操作、提交mutation等异步操作使用  store._actions
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
 // 注册对应模块的getters，供state读取使用   store._wrappedGetters

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
  //store._mutation[type]   store._action[type]  store._wrappedGetters[type]都是数组，里面存放着要调用的函数
//这里对子模块进行同样的操作
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
//以上操作之后，store._mutation  store._action  store._wrappedGetters  store.getters上就有了主模块以及所有子模块里面的 getters  mutations  actions  
function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      //个体local对象注册state属性，local.state可以通过该get函数取到模块的state
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    //注册在store对象中options中的mutations中的函数接受的参数如下：local.state   payload
    handler.call(store, local.state, payload)
  })
}

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function registerGetter (store, type, rawGetter, local) {
  // getters只允许存在一个处理函数，若重复需要报错
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    //rawGetter就是每一个getter对应的函数，该函数其实是接受四个参数，如下local表示每一个模块的，store表示全局唯一个store
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

**最重要的一点：以上操作之后，`store._mutation  store._action  store._wrappedGetters  store.getters`上就有了主模块以及所有子模块里面的 getters  mutations  actions  ，这里为为什么在任何子组件中可以通过辅助函数，拿到store中不同模块中的getters  mutations  actions埋下了伏笔**

![store上模块的注册](../img/vuexModules.png)

### 2     resetStoreVM(this, state)

```javascript
//const state = this._modules.root.state
function resetStoreVM (store, state) {
  const oldVm = store._vm // 缓存前vm组件
 
  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
 
  // 循环所有处理过的getters，并新建computed对象进行存储，通过Object.defineProperty方法为getters对象建立属性，使得我们通过this.$store.getters.xxxgetter能够访问到该getters
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })
 
  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
 
  // 暂时将Vue设为静默模式，避免报出用户加载的某些插件触发的警告
  Vue.config.silent = true   
  // 设置新的storeVm，将当前初始化的state以及getters作为computed属性（刚刚遍历生成的）
  store._vm = new Vue({
    data: { state },
    computed
  })
 
  // 恢复Vue的模式
  Vue.config.silent = silent
 
  // enable strict mode for new vm
  if (store.strict) {
    // 该方法对state执行$watch以禁止从mutation外部修改state
    enableStrictMode(store)
  }
 
  // 若不是初始化过程执行的该方法，将旧的组件state设置为null，强制更新所有监听者(watchers)，待更新生效，DOM更新完成后，执行vm组件的destroy方法进行销毁，减少内存的占用
  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._withCommit(() => {
      oldVm.state = null
    })
    Vue.nextTick(() => oldVm.$destroy())
  }
}

```



