---
title:  enhancer—Store实现
date: 2017-12-14 
categories: redux
---

**温故而知新**

###1 实际项目中最直接使用如下：

```javascript
const store = createStore(
    reducer,
    applyMiddleware(thunk, logger)
);

export default store;
```

### 2 createStore部分源码如下

```javascript
//createStore
function createStore(reducer,preloadState,enhancer){
  if(typeof preloadState =='function' && typeof enhancer == 'undefined'){
    enhancer = preloadState ;
    preloadState = undefined;
  };
  if(typeof enhancer !== 'undefined'){
    if(typeof enhancer !== 'function'){
      throw new Erroe('Expected enhancer to be a function');
    };
    return enhancer(createStore)(reducer,preloadState);
  }
  if(typeof reducer !== 'function'){
    throw new Error('Expected reducer to be a function')
  }
} ;
```

### 3 applyMiddle部分源码如下

```javascript
//applyMiddleWare
function applyMiddleWare(...middleWares){
  //这里返回的就是createStore中的enhancer函数
  return function(createStore){
    return function(reducer,preloadState,enhancer){
      const store = createStore(reducer,preloadState,enhancer);
      let dispatch = store.dispatch;
      let chain = [];
      let middleWareAPI = {
        getState:store.getState,
        dispatch:(action)=>dispatch(action)
      };
      chain = middleWares.map(function(middleWare){
        return middleWare(middleWareAPI);
      });
      //chain =[f1,f2,f3] 
      //compose(chain) : f1(f2(f3))()
      dispatch = compose(chain)(store.dispatch)   ;
      return {
        ...store,
        dispatch
      }     
    }
  }
}   ;
```

### 4 thunk和logger基本实现如下

```javascript
//logger
function createLogger(middleWareAPI){
  //返回的这个函数就是logger;
  return function(next){
    return function(action){
      console.log('分发动作前：',middleWareAPI.getState());
      var returnValue = next(action);
      console.log('分发动作后：',middleWareAPI.getState());
      return returnValue;
    }
  }
}
//thunk
function createThunk(middleWareAPI){
  //返回的这个函数就是thunk;
  return function(next){
    return function(action){
      if(typeof action == 'function'){
        return action(dispatch,getState);
      };
      return next(action);
    }
  }
}
```

