---
title:  Redux thunk源码
date: 2017-05-24 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

### 1 redux-thunk源码

```javascript
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
```

什么是thunk

```
// Meet thunks.
// A thunk is a function that returns a function.
// This is a thunk.
```







[redux-thunk](https://github.com/gaearon/redux-thunk)