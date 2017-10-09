---
title:  Redux combineReducers和bindActionCreators源码
date: 2017-05-05 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

### 1 combineReducers源码如下(核心)

```javascript
function combineReducers(reducers) { //传入combineReducers函数的是一个对象,包括不同的reducer的key -value键值对
  var reducerKeys = Object.keys(reducers);//reducerKeys是一个数组,是我们传入的reducers的keys组成的数组
  var finalReducers = {}//创建一个空对象,用来存放我们传入的reducers的value的值组成的数组
  
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
//以上循环用于过滤传入的reducers,确保最后每个reducer都是一个函数
  var finalReducerKeys = Object.keys(finalReducers)//我们传入的reducers数组确认是一个key -value(function)的对象

  // 返回合成后的 reducer  返回的这个函数就是combineReducers函数的返回值.
  //这个函数负责处理根据不同的action来进行state状态改变
  //每次dispatch不同的action的时候,这个函数会被执行,执行的时候,所有的reducer树上的reducer都会执行,如果action对上了,则会执行响应的操作
  return function combination(state = {}, action) {
    var hasChanged = false
    var nextState = {}
    //以下循环通过不同的reducer对应的不同的key,处理state状态树上的对应的key值所对应的的子state,然后返回一个新的nextState对应的key-value组成的对象;
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i]
      var reducer = finalReducers[key]
      var previousStateForKey = state[key]                       // 获取当前子 state
      //首先,当createStore的时候,就会直接执行这个reducer,将默认的state给到state状态树,然后第一次调用该reducer的时候,传入该reducer的state就是默认的state,然后第一次调用reducer返回新的state更新对应state状态树对应的节点;当第二次调用的时候,传入该reducer的state参数就是上次更新的state状态值,依次类推.
      var nextStateForKey = reducer(previousStateForKey, action) // 执行各子 reducer 中获取子 nextState,每一个子reducer都会返回一个新的state
      nextState[key] = nextStateForKey                           // 将子 nextState 挂载到对应的键名
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```

**通过源码我们可以看出,当将一个合并后的reducers函数传入createStore的时候**

```
const reducers = combineReducers({
  todos,
  visibilityFilter
})

const store = createStore(reducers) 
```

**因为当我们执行createStore函数的时候,会默认执行dispatch函数,而dispatch函数会执行reducers函数,在执行该函数的的过程中,我们可以看到,reducers函数的返回值会赋值给currentState,`**

### 2 state和action运行的流程 

**无论是 `dispatch` 哪个 `action`，都会流通所有的 `reducer`**, 看来，这样子很浪费性能，但 JavaScript 对于这种**纯函数**的调用是很高效率的，因此请尽管放心这也是为何 `reducer` 必须返回其对应的 `state` 的原因。否则整合状态树时，该 `reducer` 对应的键值就是 `undefine`

```
           counterReducer(counter, action) -------------------- counter
                              ↗                                                           ↘
rootReducer(state, action) —→∑  ↗ optTimeReducer(optTime, action) ------ optTime ↘      nextState
                              ↘—→∑                                                 todo  ↗
                                   ↘ todoListReducer(todoList,action) ----- todoList ↗
```

### 3 bindActionCreators源码核心如下

```javascript
/* 为 Action Creator 加装上自动 dispatch 技能 */
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}
/*
转为ES5如下
"use strict";
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}
*/

export default function bindActionCreators(actionCreators, dispatch) {
  // 省去一大坨类型判断
  var keys = Object.keys(actionCreators) //将对象中所有的key值集合到一个数组当中,返回一个数组
  var boundActionCreators = {}
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var actionCreator = actionCreators[key] //actionCreator[key]对应的是一个组件函数
    if (typeof actionCreator === 'function') {
      // 逐个装上自动 dispatch 技能
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch) //该函数返回结果也是一个函数,如果返回的函数再次执行的话,那么返回的将是dispatch函数,进行action分发了
    }
  }
  return boundActionCreators
}
```

```html
<input id="todoInput" type="text" />
<button id="btn">提交</button>

<script>
$('#btn').on('click', function() {
  var content = $('#todoInput').val() // 获取输入框的值
  var action = addTodo(content)       // 执行 Action Creator 获得 action
  store.dispatch(action)              // 手动显式 dispatch 一个 action
})
</script>
```

```html
<input id="todoInput" type="text" />
<button id="btn">提交</button>

<script>
// 全局引入 Redux、jQuery，同时 store 是全局变量
var actionsCreators = Redux.bindActionCreators( //bindActionCreators函数会返回一个boundActionCreators对象,该对象中
  { addTodo: addTodo },
  store.dispatch // 传入 dispatch 函数
)

$('#btn').on('click', function() {
  var content = $('#todoInput').val()
  actionCreators.addTodo(content) // 它会自动 dispatch
})
</script>
```