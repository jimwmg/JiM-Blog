---
title:  React中的注册机制
date: 2017-11-16 12:36:00
categories: React
---

### 举一反三：了解React中的注册机制

在[创建React组件方式以及源码解析](https://github.com/jimwmg/JiM-Blog/tree/master/React)文章中，有下面一段代码

[ReactMount.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactMount.js)

```javascript
//下面这个函数实现将ReactElement元素，转化为DOM元素并且插入到对应的Container元素中去；
  _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
    //Flag1 下面会有源码解释；
    //instantiateReactComponent(nextElement, false)函数返回一个组件的实例，该函数源码下面会解释；
    var componentInstance = instantiateReactComponent(nextElement, false);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    // ReactDefaultInjection.inject();
    //这个函数是真正的将ReactElement元素插入到DOM元素的，会进入到batchedMountComponentIntoNode函数中；
    //这里额外分析React中的注册机制的文章链接 https://github.com/jimwmg/JiM-Blog/tree/master/React
    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);
//这里通过webstorm点击batchedUpdates函数跟踪至源码处：
    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;

    return componentInstance;	

  }
```

会跟踪到ReactUpdates.js中

```javascript
var batchingStrategy = null;

function ensureInjected() {
  !(ReactUpdates.ReactReconcileTransaction && batchingStrategy) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must inject a reconcile transaction class and batching strategy') : _prodInvariant('123') : void 0;
}
function batchedUpdates(callback, a, b, c, d, e) {
  ensureInjected();
  return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}
var ReactUpdatesInjection = {
  injectReconcileTransaction: function (ReconcileTransaction) {
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  injectBatchingStrategy: function (_batchingStrategy) {
//.....省略一些代码；
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  ReactReconcileTransaction: null,

  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};

module.exports = ReactUpdates;
```

batchedUpdates函数执行的时候，我们会发现。batchingStrategy 的值是null ; 貌似到这里一切的线索断了，不要着急；

回到ReactDOM.js中,我们看到在最开头有以下一行代码，我们看下它到底做了什么：

```javascript
ReactDefaultInjection.inject();
```

ReactDefaultInjection.js中：

```javascript
var ReactDefaultBatchingStrategy = require('./ReactDefaultBatchingStrategy');
var ReactInjection = require('./ReactInjection');
var alreadyInjected = false;
function inject() {
  if (alreadyInjected) {
    // TODO: This is currently true because these injections are shared between
    // the client and the server package. They should be built independently
    // and not share any injection state. Then this problem will be solved.
    return;
  }
  //.....其余代码不贴了
  alreadyInjected = true;
  //......
  ReactInjection.Updates.injectReconcileTransaction(ReactReconcileTransaction);
  ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);
  //这个injectBatchingStrategy函数其实就是ReactUpdates.js中的injectBatchingStrategy；
  //执行这个函数，使得原来在ReactUpdates.js中batchingStrategy = ReactDefaultBatchingStrategy
  //而ReactDefaultBatchingStrategy是一个对象，具体内容就是下面的对象声明；
}
```

ReactDefaultBatchingStrategy.js中：

```javascript
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  //至此，在_renderNewRootComponent中的batchedUpdates函数，就是下面这个函数咯
  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;
```

ReactInjection.js中：

```javascript
var DOMProperty = require('./DOMProperty');
var EventPluginHub = require('./EventPluginHub');
var EventPluginUtils = require('./EventPluginUtils');
var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactEmptyComponent = require('./ReactEmptyComponent');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactHostComponent = require('./ReactHostComponent');
var ReactUpdates = require('./ReactUpdates');

var ReactInjection = {
  Component: ReactComponentEnvironment.injection,
  DOMProperty: DOMProperty.injection,
  EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventPluginUtils: EventPluginUtils.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  HostComponent: ReactHostComponent.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;
```

至此，React中的注册机制最基本的实现算是分析完毕，其实React中运用了大量的注册；

如果从整个框架设计的角度来考虑,在最开始的调用ReactDOM.js中进行注册，注册之后，其所引用的其他js中就可以使用了；

React中使用的注册机制，可以很好的节约内容，因为每次注入的对象都是同一个，不会因为每次实例化而生成同样的对象而占据过多的内存；