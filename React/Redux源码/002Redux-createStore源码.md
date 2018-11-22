---
title:  Redux createStore源码
date: 2017-05-05 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

### 1 先贴上createStore源码

看了源码我对redux的认识才开始清晰,现在终于明白,不看源码学框架就是没事儿找刺激啊,不知道底层如何实现,学起来就是举步维艰;

```javascript
import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
export const ActionTypes = {
  INIT: '@@redux/INIT'
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
//这里如果存在enhancer函数，则重新执行createStore函数；因为enchancer函数是applyMiddleWare函数的返回值，返回值为一个接受createStore为参数的函数；
    //appliMiddleware源码地址：https://github.com/jimwmg/redux/blob/master/src/applyMiddleware.js
    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false
//确定可否改变 nextListeners;nextListeners和currentListeners指向的是同一块内存地址；
  //辅助方法ensureCanMutateNextListeners()。这是考虑到，在执行某个监听函数的时候，可能会添加新的监听函数，或者取消某个监听函数。为了让这些改变不影响当前的监听函数列表的执行，因此在改变之前，先拷贝一份副本（即nextListeners），然后对该副本进行操作，从而所有的改变会在下一次dispatch(action)的时候生效。 
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      //如果nextListeners和currentListeners指向的是同一块内存地址，
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)
//每次订阅一个函数都会形成一个闭包，该闭包用来清除订阅的函数；
    return function unsubscribe() {
      if (!isSubscribed) {//store没有订阅函数
        return
      }

      isSubscribed = false
//需要再次确认是否可以操作nextListeners,因为如果dispatch过一个action的话，dispatch函数会执行
      //const listeners = currentListeners = nextListeners
      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      //最初始的值是false
      isDispatching = true
      //这里可以看到，reducer必须是纯的函数，接受整个state和action作为参数，返回一个新的state;
      //如果这个currentReducer是一个combineReducer，那么初始化以及以后每次dispatch的时候，都会重复执行
      //不同的是，初始化dispatch的action没有匹配的值，所以生成的state是所有的reducer默认的state组成的大对象；以后每次从你dispatch的时候，还是会流通所有的reducer，但是此时的action变了，会改变某个对应的state，生成不一样的大state对象；
      //初始化的时候，会将state初始化为一个所有reducer中的默认state值；
      //
      currentState = currentReducer(currentState, action)
    } finally {
      //执行完try之后,还是将该值重置为false
      isDispatching = false
    }

    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
//return action 是为了在compose(thunk,logger)(store.dispatch) <==> thunk(logger(store.dispatch))
    return action
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

* var store = createStore(reducer , preLoadState , enhancer) 定义一个store的时候可以传递reducer函数,state初始状态
  * 注意createStore之后,会先默认执行dispatch函数一次,看源码注意下这一点.通过这次默认执行dispatch函数,reducer函数就会执行,可以初始化state状态
  * dispatch函数执行的时候,由于刚创建store并没有通过subscribe绑定listeners,所以listeners在createStore的时候不会执行.
  * 返回值就是最后return的那个对象，注意内存上的消耗，dispatch里面引用这currentReducer,currentReducer引用这reducer,而一般传递进来的reducer都是通过combinReducer处理的reducers的集合，所以combineReducer函数中形成的闭包在整个过程中会一直存在；
* getState( )函数用来获取state下一个状态
* dispatch(action)函数,
  * 用来根据不同的action,调用reducer函数改变state状态
  * 依次执行所有通过subscribe订阅到listeners数组中的函数;
  * 返回一个传入的action对象
* subscribe( listener ) 用来向listeners数组中添加监听器
* replaceReducer( nextReducer ) 替换 reducer 为 nextReducer

````
dispatch不同的action,然后触发reducer函数
定义reducer函数的时候,reducer函数接受两个参数,一个是state,一个是action,
因为reducer函数在执行的时候,是在dispatch函数内部执行,所以reducer函数的action来自于dispatch的参数action,reducer函数的state可以来自于自己,也可以来自于定义store的时候
````

### 2 我们来结合一个小栗子看下createStore在状态管理过程中所扮演的角色

2.1 还是老惯例,看下引入redux之后,文件中对象有什么

```html 
<body>
    <script src='./redux.min.js'></script>
    <script>
        console.log(Redux);
        console.log(Redux.createStore);
        
    </script>
</body>
```

```
Object {__esModule: true,
createStore: function, 
combineReducers: function, 
bindActionCreators: function, 
applyMiddleware: function…}
applyMiddleware:function o()
bindActionCreators:function u(t,e)
combineReducers:function i(t)
compose:function n()
createStore:function o(t,e)
__esModule:true
```

2.2 reducer函数的定义为什么总是第一个参数是state,第二个参数是action?

我们定义的reducer函数要返回一个reducer处理之后的state,赋值给currentState,然后通过getState就可以获取当前状态;

源码中有如下两行代码,可以看出

```javascript
var currentReducer = reducer; 
currentState = currentReducer(currentState, action);
```

* 当我们创建一个store的时候,createStore接受两个参数,一个是reducer函数,一个是initialState初始状态,
* 然后 var currentReducer = reducer ;  var currentState = initialState;
* 当我们调用dispatch的时候,dispatch执行的过程中,会调用reducer函数,reducer函数就是我们处理state的方法
* dispatch函数中在调用reducer的时候,会向其中传递两个参数,一个是initialState对象,一个是action对象;dispatch函数执行后返回的是传入的action
* 注意定义reducer的时候,必须要返回一个state状态,防治state状态的丢失.

2.3 初始化state的两种方式,

* 通过createStore(reducer , initialState)
* 通过reducer(state = initialState , action )

```html
<body>
    <script src='./redux.min.js'></script>
    <script>
   
        //action 创建器
        function createActionOne (){
            return {
                type : 'INCREAMENT'
            }
        }

        function createActionTwo(){
            return {
                type : 'DECREASE'
            }
        }
        //reducer处理函数
        function reducer (state = {count : 0 },action){
            // state = state || {count : 0 }
            switch (action.type) {
                case "INCREAMENT" :
                    return {conut : state.count+1};
                case "DECREASE" :
                    return {count : state.count-1};
                default :
                    return state ;
            }
        }

        //store状态管理器的创建
        
        var store = Redux.createStore(reducer);
        console.log( store.getState() );
        store.dispatch(createActionOne());
        console.log( store.getState() );

    </script>
</body>
```

```html
<body>
    <script src='./redux.min.js'></script>
    <script>
     
        //action 创建器
        function createActionOne (){
            return {
                type : 'INCREAMENT'
            }
        }

        function createActionTwo(){
            return {
                type : 'DECREASE'
            }
        }
        //reducer处理函数
        function reducer (state ,action){
            // state = state || {count : 0 }
            switch (action.type) {
                case "INCREAMENT" :
                    return {conut : state.count+1};
                case "DECREASE" :
                    return {count : state.count-1};
                default :
                    return state ;
            }
        }

        //store状态管理器的创建
        var initialState = {count : 10 }
        var store = Redux.createStore(reducer,initialState);
        console.log( store.getState() );
        store.dispatch(createActionOne());
        console.log( store.getState() );
        
    </script>
</body>
```

### 3 ES6语法新特性                   [bable在线编译工具](http://babeljs.io/learn-es2015/) 

ES6

```javascript
function reducer (state = {count : 0 },action){
            // state = state || {count : 0 }
            switch (action.type) {
                case "INCREAMENT" :
                    return {conut : state.count+1};
                case "DECREASE" :
                    return {count : state.count-1};
                default :
                    return state ;
            }
        }
```

经过转化为ES5

```javascript
"use strict";

function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { count: 0 };
    var action = arguments[1];

    // state = state || {count : 0 }
    switch (action.type) {
        case "INCREAMENT":
            return { conut: state.count + 1 };
        case "DECREASE":
            return { count: state.count - 1 };
        default:
            return state;
    }
}
```

### 4 参考

[源码解读](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/redux-advanced-tutorial.md)





