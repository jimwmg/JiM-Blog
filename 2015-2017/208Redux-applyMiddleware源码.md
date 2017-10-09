---
title:  Redux applyMiddleware源码
date: 2017-05-05 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

今天是周日,昨天玩了一天,嗯,该放松还是得放松嘛,今天来学习下.

### 1 还是先贴上源码

```javascript
import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)
/*
 // 例如，chain 为 [M3, M2, M1]，而 compose 是从右到左进行“包裹”的
      // 那么，M1 的 dispatch 参数为 store.dispatch（见【降低逼格写法】的【锚点-2】）
      // 往后，M2 的 dispatch 参数为 M1 的中间件处理逻辑哥（见【降低逼格写法】的【锚点-3】）
      // 同样，M3 的 dispatch 参数为 M2 的中间件处理逻辑哥
      // 最后，我们得到串联后的中间件链：M3(M2(M1(store.dispatch)))
      */
    return {
      ...store,
      dispatch
    }
  }
}
```

由于目前对这个源码理解还是不够透彻,索性拿别人的作为记录得了,后期自己深入研究在自己写demo.

下面这个就是一个简单的中间件

```javascript

const printStateMiddleware = ({ getState }) => next => action => {
  console.log('state before dispatch', getState())
  
  let returnValue = next(action)

  console.log('state after dispatch', getState())

  return returnValue
}

-------------------------------------------------


function printStateMiddleware(middlewareAPI) { // 记为【锚点-1】，中间件内可用的 API
  return function (dispatch) {                 // 记为【锚点-2】，传入上级中间件处理逻辑（若无则为原 store.dispatch）

    // 下面记为【锚点-3】，整个函数将会被传到下级中间件（如果有的话）作为它的 dispatch 参数
    return function (action) { // <---------------------------------------------- 这货就叫做【中间件处理逻辑哥】吧
      console.log('state before dispatch', middlewareAPI.getState())
  
      var returnValue = dispatch(action) // 还记得吗，dispatch 的返回值其实还是 action
  
      console.log('state after dispatch', middlewareAPI.getState())

      return returnValue // 继续传给下一个中间件作为参数 action
    }
  }
}
```



如果觉得代码有点晦涩难懂,可以进行下babel转化为ES5 如下:

```javascript
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = applyMiddleware;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(undefined, _toConsumableArray(chain))(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
```

先从整体上把控下Redux所谓的API都有什么 : 

```
Redux 有五个 API，分别是：

      createStore(reducer, [initialState])
      combineReducers(reducers)
      applyMiddleware(...middlewares)
      bindActionCreators(actionCreators, dispatch)
      compose(...functions)

createStore 生成的 store 有四个 API，分别是：

    getState()
    dispatch(action)
    subscribe(listener)
    replaceReducer(nextReducer)
```

### 2 通过源码分析下applyMiddleware这个函数做了什么工作:

**其实就是在dispatch一个action和执行reducer之前,增加了一些异步的操作**

2.1 返回一个新的store创建器

首先返回一个函数,该函数接受Redux.createStore这个API作为参数,也就是说

```javascript
applyMiddleware(...middleWares) = function (createStore){ }
```

```javascript
var enhancedCreateStore = Redux.applyMiddleware(...Middlewares)(Redux.createStore);
```

上面这行代码返回的结果也是一个函数,而这个函数被赋值给enhancedCreateStore

正常的创建store的函数

```javascript
var store = Redux.createStore(reducer, preloadedState, enhancer);
```

增强createStore之后的创建store函数

```javascript
var store = enhancedCreateStore(reducer, preloadedState, enhancer);
```

2.2 新的store创建器返回的结果增加了原来的dispatch函数功能,从源码中可以看出返回的值和最基础的createStore一样返回的是一个下面的对象:

```javascript
return {
  dispatch,
  subscribe,
  getState,
  replaceReducer,
  [$$observable]: observable
}
```

只不过dispatch函数增加了一些功能而已.

```javascript
return {
  ...store,
  dispatch
}
```

以上分析就是applyMiddleware函数所做的一些工作.

```
原 createStore ————
                  │
                  ↓
return enhancer1(createStore)(reducer, preloadedState, enhancer2)
   |
   ├———————→ createStore 增强版 1
                    │
                    ↓
return enhancer2(createStore1)(reducer, preloadedState, enhancer3)
   |
   ├———————————→ createStore 增强版 1+2
                        │
                        ↓
return enhancer3(createStore1+2)(reducer, preloadedState, applyMiddleware(m1,m2,m3))
   |
   ├————————————————————→ createStore 增强版 1+2+3
                                     │
                                     ↓
return appleMiddleware(m1,m2,m3)(createStore1+2+3)(reducer, preloadedState)
   |
   ├——————————————————————————————————→ 生成最终增强版 store
```

### 3 走一个小的功能看下具体的效果

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./redux.min.js"></script>
</head>
<body>
<script>
/** Action Creators */
function inc() {
  return { type: 'INCREMENT' };
}
function dec() {
  return { type: 'DECREMENT' };
}

function reducer(state, action) {
  state = state || { counter: 0 };

  switch (action.type) {
    case 'INCREMENT':
      return { counter: state.counter + 1 };
    case 'DECREMENT':
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}

function printStateMiddleware(middlewareAPI) {
  return function (dispatch) {
    return function (action) {
      console.log('dispatch 前：', middlewareAPI.getState());
      var returnValue = dispatch(action);
      console.log('dispatch 后：', middlewareAPI.getState(), '\n');
      return returnValue;
    };
  };
}

var enhancedCreateStore = Redux.applyMiddleware(printStateMiddleware)(Redux.createStore);
var store = enhancedCreateStore(reducer);

store.dispatch(inc());
store.dispatch(inc());
store.dispatch(dec());
</script>
</body>
</html>
控制台输出：

dispatch 前：{ counter: 0 }
dispatch 后：{ counter: 1 }

dispatch 前：{ counter: 1 }
dispatch 后：{ counter: 2 }

dispatch 前：{ counter: 2 }
dispatch 后：{ counter: 1 }
```

### 4 自己实现一个最简单的中间件

```javascript
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
//
dispatchAndLog(store, addTodo('Use Redux'))
```

```javascript
function logger(store) {
  let next = store.dispatch

  // 我们之前的做法:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```





### [参考](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/redux-advanced-tutorial.md)

非常感谢作者能从源码的角度剖析文章.