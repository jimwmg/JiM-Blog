---
title:  Redux
date: 2017-04-25 12:36:00
categories: redux
tags : 
comments : true 
updated : 
layout : 
---

建议先看这篇GitHub上的基础 [Redux基础]( https://github.com/happypoulp/redux-tutorial  )              [深入浅出Redux3](https://www.w3ctech.com/topic/1561)

### 1   action 创建函数     仅仅是一个函数，作用是用来生成一个action，action本质是一个javascript对象

这个函数会返回一个 Action 对象，这个对象里描述了“页面发生了什么”。随后这个对象会被传入到 Reducer 中。

官方定义:Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch().

**Action** 是把数据从应用（这里之所以不叫 view 是因为这些数据有可能是服务器响应，用户输入或其它非 view 的数据 ）传到 store 的有效载荷。它是 store 数据的**唯一**来源。一般来说你会通过 [`store.dispatch()`](http://cn.redux.js.org/docs/api/Store.html#dispatch) 将 action 传到 store。

描述发生了什么

```javascript
var actionCreator = function() {
    // ...that creates an action (yeah, the name action creator is pretty obvious now) and returns it
    return {
        type: 'AN_ACTION',
        name:'Jhon'
    }
}
```

Redux约定Action内使用一个**字符串类型**的type字段来表示将要执行的动作，比如上栗的 AN_ACTION，除了type之外可以存放其他要操作的数据；

```javascript
import {createStore} from 'redux';
var userReducer = function(state = {},action){
    console.log('userReducer was called with ',state,'and action',action); 
    switch(action.type){
        case 'SET_NAME' :
            return {
                ...state,
                name : action.name 
            }
        default :
            return state ;
    }   
}
var store_0 = createStore(userReducer);
```

传入store_0的可以是一个action对象

```javascript
store_0.dispatch({type:'SET_NAME',name : "Jhon"});
//userReducer was called with  {} and action { type: 'SET_NAME', name: 'Jhon' }
console.log('store_0 state after action',store_0.getState());
////store_0 state after action  { name: 'Jhon' }
```

同样也可以是一个action创建函数，该函数返回action对象

```javascript
function setNameActionCreator(name){
    return {
        type : 'SET_NAME',
        name 
      //这里用到了ES6声明对象的简洁语法
    }
}

store_0.dispatch(setNameActionCreator('JiM'));
//userReducer was called with  { name: 'Jhon' } and action { type: 'SET_NAME', name: 'JiM' }
console.log('store_0 state after action',store_0.getState());
//store_0 state after action  { name: 'JiM' }
```



### 2 reducer 

根据action更新state，reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

官方定义:Actions describe the fact that something happened, but don’t specify how the application’s state changes in response. This is the job of a reducer.

之所以称作 reducer 是因为它将被传递给 [`Array.prototype.reduce(reducer, ?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法。保持 reducer 纯净非常重要。**永远不要**在 reducer 里做这些操作：

- 修改传入参数；
- 执行有副作用的操作，如 API 请求和路由跳转；
- 调用非纯函数，如 `Date.now()` 或 `Math.random()`。

```javascript
(previousState, action) => newState
//How do I handle data modifications?
//     Using reducers (called "stores" in traditional flux).
//     A reducer is a subscriber to actions.
//     A reducer is just a function that receives the current state of your application, the action,
//     and returns a new state modified (or reduced as they call it)
```

```javascript
function todoApp(state = {}, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

**传入state的默认值可以是null  undefined  [ ] 布尔类型 字符串等** ,也就是说，reducer函数可以处理任何数据结构类型，根据需求不同可以传入不同的state默认值；

```javascript
import {createStore} from 'redux';

function myReducer(state = null,action){
    console.log('myReducer was called with state',state,'and action',action);
    switch(action.type){
        case 'SOMETHING' :
            return {
                ...state ,
                message : 'done'
            }
        default : 
            return state
    }
}

var store_0 = createStore(myReducer)
```



如果随着我们的业务越来越复杂，如何让不同的reducer进行合并呢？redux提供了combineReducers函数，该函数接受一个对象，会执行传入的所有的reducer；

`combineReducers` 生成了一个类似于Reducer的函数。为什么是类似于，因为它不是真正的Reducer，它只是一个调用Reducer的函数，只不过它接收的参数与真正的Reducer一模一样~

```javascript
import {createStore,combineReducers} from 'redux';
var userReducer = function(state = {},action){
    console.log('userReducer was called with the state',state,'and action',action);
    switch(action.type){
        case 'SOmething' : 
            return {
                ...state,
                message:action.value
            }

        default :
            return state ;        
    }
}

var itemsReducer = function(state = [],action){
    console.log('itemsReducer was called with the state',state,'and action',action);
    switch(action.type){
        //etc 

        default :
            return state ;
    }

}
var reducer = combineReducers({userReducer,itemsReducer});
//其实等价于 var reducer = combineReducers({userReducer:userReducer,itemsReducer:itemsReducer});
//ES6对象新的语法特性
//这行代码执行之后输出
/*
userReducer was called with the state {} and action { type: '@@redux/INIT' }
userReducer was called with the state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_q.y.p.r.j.q.z.6.7.x.t.b.a.6.j.b.r.z.f.r' }
itemsReducer was called with the state [] and action { type: '@@redux/INIT' }
itemsReducer was called with the state [] and action { type: '@@redux/PROBE_UNKNOWN_ACTION_f.y.3.u.2.q.q.w.d.h.q.c.w.p.g.2.p.g.b.9' }

*/
console.log(combineReducers);//[Function: combineReducers]
console.log(reducer);//[Function: combination]  可以看出combineReducers这个函数调用一系列的reducer然后返回一个新的reducer函数

var store_0 = createStore(reducer);
/**
 * userReducer was called with the state {} and action { type: '@@redux/INIT' }
itemsReducer was called with the state [] and action { type: '@@redux/INIT' }

 */
console.log('store_0 state after initialization',store_0.getState());
//输出如下: store_0 state after initialization { userReducer: {}, itemsReducer: [] }
```

看下combineReducers底层实现

```javascript
function combineReducers(reducers) {

  // 过滤reducers，把非function类型的过滤掉~
  var finalReducers = pick(reducers, (val) => typeof val === 'function');

  // 一开始我一直以为这个没啥用，后来我发现，这个函数太重要了。它在一开始，就已经把你的State改变了。变成了，Reducer的key 和 Reducer返回的initState组合。
  var defaultState = mapValues(finalReducers, () => undefined);

  return function combination(state = defaultState, action) {
    // finalReducers 是 reducers
    var finalState = mapValues(finalReducers, (reducer, key) => {

      // state[key] 是当前Reducer所对应的State，可以理解为当前的State
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);

      return nextStateForKey;      
    });

    // finalState 是 Reducer的key和stat的组合。。
  }
}
```

从上面的源码可以看出，combineReducers 生成一个类似于Reducer的函数`combination`。

当使用combination的时候，combination会把所有子Reducer都执行一遍，子Reducer通过action.type 匹配操作，因为是执行所有子Reducer，所以如果两个子Reducer匹配的action.type是一样的，那么都会成功匹配。

注意:

1. **不要修改 state。** 使用 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 新建了一个副本。不能这样使用 `Object.assign(state, {visibilityFilter: action.filter })`，因为它会改变第一个参数的值。你**必须**把第一个参数设置为空对象。你也可以开启对ES7提案[对象展开运算符](http://cn.redux.js.org/docs/recipes/UsingObjectSpreadOperator.html)的支持, 从而使用 `{ ...state, ...newState }` 达到相同的目的。

   ```
   state = {name:'Jhon',age:18}       {...state,address : 'China'}  
   => { name: 'Jhon', age: 18, address: 'China' }
   ```

2. **在 default 情况下返回旧的 state。**遇到未知的 action 时，一定要返回旧的 `state`。if you don't, you'll end up having your reducer return undefined (and lose your state).

   **我们可以看下源代码为什么必须返回一个state;如下所示，如果reducer函数没有显式返回state,那么 currentReducer()函数执行之后，函数的默认返回值是undefined;这就是为什么我们会失去state的根本原因；**

   在使用combineReducers方法时，它也会检测你的函数写的是否标准。如果不标准，那么会抛出一个大大的错误！！

   ```javascript
   // currentState 是当前的State，currentReducer 是当前的Reducer
   currentState = currentReducer(currentState, action);
   ```

   ​

3. **注意每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据**



### 3 store 

store就是将action和reducers联系到一起的**对象**；注意也就是一个**javascript对象**，这个对象里面有一些方法；

- 维持应用的 state；
- 提供 [`getState()`](http://cn.redux.js.org/docs/api/Store.html#getState) 方法获取 state；
- 提供 [`dispatch(action)`](http://cn.redux.js.org/docs/api/Store.html#dispatch) 唯一一个方法更新 state；action是一个对象，可以直接传入对象，也可以传入定义action
- 通过 [`subscribe(listener)`](http://cn.redux.js.org/docs/api/Store.html#subscribe) 注册监听器，每当state状态改变的时候，注册的函数就会被调用
- 通过 [`replaceReducer(listener)`](http://cn.redux.js.org/docs/api/Store.html#subscribe) 返回的函数注销监听器。用于替换创建store的reducer
- **Redux 应用只有一个单一的 store**。当需要拆分数据处理逻辑时，你应该使用 [reducer 组合](http://cn.redux.js.org/docs/basics/Reducers.html#splitting-reducers) 而不是创建多个 store。

官方定义:In the previous sections, we defined the actions that represent the facts about “what happened” and the reducers that update the state according to those actions.

The Store is the object that brings them together. The store has the following responsibilities:

- Holds application state;
- Allows access to state via getState();
- Allows state to be updated via dispatch(action);
- Registers listeners via subscribe(listener).

如何创建一个store?

```javascript
//创建Store非常简单。createStore 有两个参数，Reducer 和 initialState。
let store = createStore(rootReducers, initialState);
```

**`...`是对象扩展运算符，会将对象展开** , 同时也会将数组展开

```javascript
import { createStore } from 'redux'
var reducer = function (...args) {
    console.log('Reducer was called with args', args)
}

var store_1 = createStore(reducer) ;//
```

```javascript
//创建的store_1打印输出如下,可以看出store_1是一个对象，该对象有如下的方法(函数);
{ dispatch: [Function: dispatch],
  subscribe: [Function: subscribe],
  getState: [Function: getState],
  replaceReducer: [Function: replaceReducer] }
```

当我们创建reduex实例的时候，需要传递一个函数，也就是说createStore( reducer ,optional) 第一个参数需要传入函数处理逻辑；reducer是一个函数，reducer接受两个参数，第一个是state 第二是 action；

 **当执行createStore的时候，传入的第一个函数会被执行**

```javascript
function addItem(text) {
  return {
    type: types.ADD_ITEM,
    text
  }
}

// 新增数据
store.dispatch(addItem('Read the docs'));
```

看下dispatch底层是如何实现的:dispatch 核心源码

```javascript
function dispatch(action) {
  // currentReducer 是当前的Reducer
  currentState = currentReducer(currentState, action);

  listeners.slice().forEach(function (listener) {
    return listener();
  });

  return action;
}
```

可以看到其实就是把当前的Reducer执行了。并且传入State和Action。

**dispatch异步实现**

subscribe(listener) 可以使我们的state状态改变的时候，将数据的变化反映到视图view层

```javascript

import {createStore,combineReducers} from 'Redux';

var itemReducers = function(state = [],action){
    console.log('itemsReducers was called with ',state,'and action',action);

    switch(action.type){
        case 'ADD_ITEM' : 
            return [
                ...state,
                action.item
            ]
        default :
            return state ;   
    }
}

var reducers = combineReducers({items : itemReducers });

var store_0 = createStore(reducers);

console.log(store_0.getState());

store_0.subscribe(function(){
    //这个事件只有在state改变了才会触发，此时不会触发，因为还没有改变state,没有传入action
    console.log('store_0 has been updated,lasted store state ',store_0.getState());
    //update your view 
})

var addItemActionCreator = function(item){
    return {
        type : 'ADD_ITEM',
        item 
    }
}

store_0.dispatch(addItemActionCreator({id:4,description:'anything'}));

//这一行代码执行之后，上面的subscribe函数才会被触发

```












