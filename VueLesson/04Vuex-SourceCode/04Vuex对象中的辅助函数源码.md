---
title: Vuex对象中辅助函数源码分析
date: 2017-12-27
categories: vue
---

### 1 先看下Vuex是一个怎样的对象

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

```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    anotherGetter:(state, getters) => {
		//...
    },
  }
})

```



### 2 看下辅助函数是如何使用的

主要是在组件中将store中某个属性，映射给每个组件中应用，下面是某一个Vue组件的部分代码

在不使用辅助函数的时候

count.vue

```javascript
export default {
  // ...
  computed: {
    doneTodosCount () {
      return this.$store.getters.doneTodosCount
    },
    anotherGetter () {
      return this.$store.getters.anotherGetter
    },
  }
}

```

使用mapGetters

```javascript
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ]),
    ...mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  },
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
         
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      del:(commit,type,payload){
				//可以在这里执行 commit 其他type的mutation
        commit(type,payload)
      }
    })
}

```

### 3 源码实现分析

src/helpers.js

```javascript
//统一参数,这里解释了为什么mapGetters等函数可以接受数组或者对象
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
//统一参数
function normalizeNamespace (fn) {
  //注意这里fancied函数就是mapGetters mapMutations,  mapState,  mapActions 这些函数的实现
 //使用的时候，就是mapGetters( )   mapMutations( ),  mapState( ),  mapActions( )这种方式，如上使用
     
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    //就上面的例子来讲
    //namespace:''  map:[ 'doneTodosCount','anotherGetter'...]
    return fn(namespace, map)
  }
}
/**
不使用 namespaced:true;
...mapState(['statename1','statename2'])
使用 namespaced：true
...mapState('moduleName', ['statename1','statename2']),

*/
// mapMutations,  mapState,  mapActions,都是类似的实现
export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {}
  normalizeMap(getters).forEach(({ key, val }) => {
    val = namespace + val
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`)
        return
      }
 //《03Vuex实例化store对象的核心源码》 中解释了为什么实例对象store上，getters中有所有模块，包括子模块上的getters
      return this.$store.getters[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})
```

也就是说getters经过mapGetters处理后

```javascript
export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
//处理后
export default {
  // ...res = {key:mappedGetter,....}
  /* _wrapedGetters ==> getters  ==> 
  fn(local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters)
  */
  computed: {
		doneTodosCount:mappedGetter, //==>store.getters.doneTodosCount  
    anotherGetter:mappedGetter  //==>store.getters.anotherGetter
  }
}
```

mapGetters , mapMutations,  mapState,  mapActions其实主要作用就是将store实例对象上getters, actions，mutions等映射到Vue组件实例的对象上，方便调用；

全部源码

```javascript
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})
//最后实现的效果还是  store.commit(type,payload)
/*
  function registerMutation (store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler (payload) {
    //这个handler就是我们写的mutation函数
      handler.call(store, local.state, payload)
    })
  }
*/
export const mapMutations = normalizeNamespace((namespace, mutations) => {
  const res = {}
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation (...args) { //这个函数就会被注入到 vue实例对象的 methods中
      let commit = this.$store.commit
      if (namespace) {
        //得到每一个模块
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace)
        if (!module) {
          return
        }
        //取到该模块上的commit函数
        commit = module.context.commit
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
      /* let commit = this.$store.commit
      commit (_type, _payload, _options){
      	//...
      	const mutation = { type, payload }
    		const entry = this._mutations[type]
    		//...
      }
      */
        : commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
})

export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {}
  normalizeMap(getters).forEach(({ key, val }) => {
    val = namespace + val
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`)
        return
      }
      return this.$store.getters[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

export const mapActions = normalizeNamespace((namespace, actions) => {
  const res = {}
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction (...args) {
      let dispatch = this.$store.dispatch
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapActions', namespace)
        if (!module) {
          return
        }
        dispatch = module.context.dispatch
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
})

export const createNamespacedHelpers = (namespace) => ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
})

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
  }
  return module
}

```

