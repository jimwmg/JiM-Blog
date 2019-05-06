---
title: store实例对象的dispatch和commit函数的源码实现
date: 2018-01-02
categories: vue
---

在《Vuex源码实现》中解释了commit和dispatch函数

```javascript
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
```

### 1 store.commit

* 使用：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。

```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    }
  }
})
store.commit('increment'）
//store.commit('increment', 10)
/*store.commit('increment', {
  amount: 10
})
store.commit({
  type: 'increment',
  amount: 10
})
 return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
       let commit = this.$store.commit
      commit (_type, _payload, _options){
      	//...
      	const mutation = { type, payload }
    		const entry = this._mutations[type]
    		//...
      }
        : commit.apply(this.$store, [val].concat(args))
*/
```

* 源码分析

store实例对象原型上的commit方法先被缓存起来

```javascript
commit (_type, _payload, _options) {
    // check object-style commit
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)

    const mutation = { type, payload }
    /*
    function registerMutation (store, type, handler, local) {
      const entry = store._mutations[type] || (store._mutations[type] = [])
      entry.push(function wrappedMutationHandler (payload) {
        //注册在store对象中options中的mutations中的函数接受的参数如下：local.state   payload
        handler.call(store, local.state, payload)
      })
    }
    */
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }
  /** 利用_withCommit方法执行本次批量触发mutation处理函数，并传入payload参数。如果批量触发store中的mutation，则一个个的处理；
    _withCommit (fn) {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
      }
    }
  **/
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        //这个handler如下：wrappedMutationHandler,对应下面
        handler(payload)
      })
    })
  /**
  function registerMutation (store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler (payload) {
    //这个handler就是我们写的mutation函数
      handler.call(store, local.state, payload)
    })
  }
  
  */
    this._subscribers.forEach(sub => sub(mutation, this.state))

    if (
      process.env.NODE_ENV !== 'production' &&
      options && options.silent
    ) {
      console.warn(
        `[vuex] mutation type: ${type}. Silent option has been removed. ` +
        'Use the filter functionality in the vue-devtools'
      )
    }
  }
//
function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  return { type, payload, options }
}
```

### 2 store.dispatch

* 使用

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment ({ commit }) {
      commit('increment')
    },
    //actions中的handler函数，该函数会发起异步任务，state指的是local.state
    checkout ({ commit, state }, payload) {
      // 把当前购物车的商品备份起来
      const savedCartItems = [...state.cart.added]
      // 发送结帐请求，并愉快地清空购物车
      commit(types.CHECKOUT_REQUEST)
      // 购物 API 接收一个成功回调和一个失败回调
      shop.buyProducts(
        products,
        // 成功操作
        () => commit(types.CHECKOUT_SUCCESS),
        // 失败操作
        () => commit(types.CHECKOUT_FAILURE, savedCartItems)
      )
    }
  }
})
store.dispatch('increment')
/*
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})


**/
/**
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}

**/
```

为什么会出现action ? **因为mutation仅仅支持同步操作，而action支持异步操作**

看下`dispatch(action)`源码中如何实现action支持异步的；

```javascript
dispatch (_type, _payload) {
  // check object-style dispatch
  const {
    type,
    payload
  } = unifyObjectStyle(_type, _payload)

  const action = { type, payload }
  const entry = this._actions[type]
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] unknown action type: ${type}`)
    }
    return
  }

  this._actionSubscribers.forEach(sub => sub(action, this.state))

  return entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
  : entry[0](payload)
}
/**
module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
  //直接执行actions中定义的handler函数，注意这里解释了为什么action函数中的解构赋值的参数来源；
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

*/
```

[Vuex源码参考](https://github.com/DDFE/DDFE-blog/issues/8)

### 3 为什么commit支持同步，而dispatch支持异步？

其实核心都是通过commit来完成的，只不过commit会直接改变state,而dispatch是通过异步的结果来执行成功的commit还是失败的commit的，进而commit继续更新state;

### 4 细枝末节（摘自美团技术文章）

> 最后我们回过来看文章开始提出的5个问题。
>
> 1.  **问**：*使用Vuex只需执行 Vue.use(Vuex)，并在Vue的配置中传入一个store对象的示例，store是如何实现注入的？*
>
> > **答**：`Vue.use(Vuex)` 方法执行的是install方法，它实现了Vue实例对象的init方法封装和注入，使传入的store对象被设置到Vue上下文环境的$store中。因此在Vue Component任意地方都能够通过`this.$store`访问到该store。
>
> 2.  **问**：*state内部支持模块配置和模块嵌套，如何实现的？*
>
> > **答**：在store构造方法中有makeLocalContext方法，所有module都会有一个local context，根据配置时的path进行匹配。所以执行如`dispatch('submitOrder', payload)`这类action时，默认的拿到都是module的local state，如果要访问最外层或者是其他module的state，只能从rootState按照path路径逐步进行访问。
>
> 3.  **问**：*在执行dispatch触发action(commit同理)的时候，只需传入(type, payload)，action执行函数中第一个参数store从哪里获取的？*
>
> > **答**：store初始化时，所有配置的action和mutation以及getters均被封装过。在执行如`dispatch('submitOrder', payload)`的时候，actions中type为submitOrder的所有处理方法都是被封装后的，其第一个参数为当前的store对象，所以能够获取到 `{ dispatch, commit, state, rootState }` 等数据。
>
> 4.  **问**：*Vuex如何区分state是外部直接修改，还是通过mutation方法修改的？*
>
> > **答**：Vuex中修改state的唯一渠道就是执行 `commit('xx', payload)` 方法，其底层通过执行 `this._withCommit(fn)` 设置_committing标志变量为true，然后才能修改state，修改完毕还需要还原_committing变量。外部修改虽然能够直接修改state，但是并没有修改_committing标志位，所以只要watch一下state，state change时判断是否_committing值为true，即可判断修改的合法性。
>
> 5.  **问**：*调试时的"时空穿梭"功能是如何实现的？*
>
> > **答**：devtoolPlugin中提供了此功能。因为dev模式下所有的state change都会被记录下来，'时空穿梭' 功能其实就是将当前的state替换为记录中某个时刻的state状态，利用 `store.replaceState(targetState)`方法将执行`this._vm.state = state` 实现。
>
> 源码中还有一些工具函数类似registerModule、unregisterModule、hotUpdate、watch以及subscribe等，如有兴趣可以打开源码看看，这里不再细述。