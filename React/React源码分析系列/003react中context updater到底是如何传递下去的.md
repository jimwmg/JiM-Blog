---
title:  react-Context
date: 2017-04-25 12:36:00
categories: react
tags : context
comments : true 
updated : 
layout : 
---

题外话，个人不喜欢有魔法性的代码，比如context到底如何传递的，为嘛Provider可以直接通过context上下文传递

[我的其他React源码分析系列](https://github.com/jimwmg/JiM-Blog/)

[react源码](https://github.com/jimwmg/React-)

[react中使用context](https://reactjs.org/docs/context.html#why-not-to-use-context)

基本要求就是

* 父组件中声明Parent.prototype.getChildContext
* 父组件中声明Parent.childContextType
* 子组件声明 Child.contextType

###1  先看一个组件 

```javascript
class BaseDataSelect extends Component {
    //只在组件重新加载的时候执行一次
    constructor(props) {
        super(props);
      //..
    }
  	//other methods
}
//super其实就是下面这个函数
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
```

```javascript
//自执行函数
var Provider = function (_Component) {
  _inherits(Provider, _Component);
//父组件需要声明
  Provider.prototype.getChildContext = function getChildContext() {
    return { store: this.store };
  };
//这里其实就产生了闭包
  function Provider(props, context) {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
    //这行代码是我加的测试代码,在控制台输出的就是一个Provider对象
    console.log(_this);
    
    _this.store = props.store;
    return _this;
  }

  Provider.prototype.render = function render() {
    return _react.Children.only(this.props.children);
  };
  //父组件需要声明
Provider.childContextTypes = {store:PropTypes.storeShape.isRequired,}
  return Provider;
}(_react.Component);
```

对，就是我们常用的Provider组件；

实际中的运用(App. 是经过connect过的组件)

```jsx
const store = createStore(reducer)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)；
```

### 2 那么传递context的工作是由谁来做的呢？当然是react了；

ReacrDOM.render其实就是ReactMount.render函数；

以下是react如何将ReactElement挂载到实际DOM元素上的step过程；

[ReactMount.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactMount.js)

```javascript
var ReactMount = {
  //nextElement就是ReactELement，jsx语法将组件或者div，span等转化为一个ReactElement对象
  //这里就是Provider组件生成的ReactElement对象；
  //step1 
  render: function (nextElement, container, callback) {
    //将ReactElement对象和container元素传递给_renderSubtreeIntoContainer函数；
    return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
  },
  //step2 
  _renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback){
    .....//具体源码看上面源码地址
    var nextContext;
    if (parentComponent) {
      //parentComponent为null ;
      var parentInst = ReactInstanceMap.get(parentComponent);
      nextContext = parentInst._processChildContext(parentInst._context);
    } else {
      //所以传递下去的nextContext = enmtyObject;
      nextContext = emptyObject;
    }
    //.....
    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)  ._renderedComponent.getPublicInstance();

    return component;
  },
  //step3 
  //下面这个函数实现将ReactElement元素，转化为DOM元素并且插入到对应的Container元素中去；
  _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
    //instantiateReactComponent(nextElement, false)函数返回一个组件的实例，该函数源码下面会解释；
    var componentInstance = instantiateReactComponent(nextElement, false);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    //这个函数是真正的将ReactElement元素插入到DOM元素的，会进入到batchedMountComponentIntoNode函数中；
    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);

    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;

    return componentInstance;	

  }
}
//step 4
//====================会进入到mountComponentIntoNode函数中
function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(
    /* useCreateElement */
    !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
  transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}
//step 5
//====================
function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
  var markerName;
  if (ReactFeatureFlags.logTopLevelRenders) {
    var wrappedElement = wrapperInstance._currentElement.props.child;
    var type = wrappedElement.type;
    markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
    console.time(markerName);
  }
  
  //markup是经过解析成功的HTML元素，该元素通过_mountImageIntoNode加载到对应的DOM元素上；
  //注意经过上面的函数层层调用，最后到这里的context还是emptyObject
  var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
                                             );

  if (markerName) {
    console.timeEnd(markerName);
  }

  wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
  ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
}
//step 6
//_mountImageIntoNode
_mountImageIntoNode: function (markup, container, instance, shouldReuseMarkup, transaction) {
  !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mountComponentIntoNode(...): Target container is not valid.') : _prodInvariant('41') : void 0;

  if (shouldReuseMarkup) {
    var rootElement = getReactRootElementInContainer(container);
    if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
      ReactDOMComponentTree.precacheNode(instance, rootElement);
      return;
    } else {
      var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
      rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

      var rootMarkup = rootElement.outerHTML;
      rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);

      var normalizedMarkup = markup;
      var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
      var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

   
  if (transaction.useCreateElement) {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
    DOMLazyTree.insertTreeBefore(container, markup, null);
  } else {
   // 利用innerHTML将markup插入到container这个DOM元素上
      setInnerHTML(container, markup);
      // 将instance（Virtual DOM）保存到container这个DOM元素的firstChild这个原生节点上
	ReactDOMComponentTree.precacheNode(instance, container.firstChild);

  }

  if (process.env.NODE_ENV !== 'production') {
    var hostNode = ReactDOMComponentTree.getInstanceFromNode(container.firstChild);
    if (hostNode._debugID !== 0) {
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: hostNode._debugID,
        type: 'mount',
        payload: markup.toString()
      });
    }
  }
}
```

### 3 context如何传递的？

step2 - step5中开始出现context进行往下传递；这里传递的一直是emptyObject;

主要看下step5中

```javascript
var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
```

[ReactReconciler.js源码地址. 其实就是执行下面这个函数：

```javascript
mountComponent: function (internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID) // 0 in production and for roots
  {
    //这里传进去的还是emptyObject;
    var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID);
    if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onMountComponent(internalInstance._debugID);
      }
    }
    return markup;
  },
```

对于internalInstance是React组件，而不是宿主DOM元素的情况；

[ReactCompositeComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactCompositeComponent.js)

这里顺便提下React生命周期函数的调用

#### Mounting

These methods are called when an instance of a component is being created and inserted into the DOM:

- [`constructor()`](https://reactjs.org/docs/react-component.html#constructor)
- [`componentWillMount()`](https://reactjs.org/docs/react-component.html#componentwillmount)
- [`render()`](https://reactjs.org/docs/react-component.html#render)
- [`componentDidMount()`](https://reactjs.org/docs/react-component.html#componentdidmount)

注意这里internalInstance.mountComponent其实就是ReactCompositeComponent.js中的mountComponent方法；

```javascript
mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
  var _this = this;
//这里的this指的是internalInstance,也就是经过React处理ReactElement对象之后生成的React组件实例对象；
  this._context = context;
  this._mountOrder = nextMountID++;
  this._hostParent = hostParent;
  this._hostContainerInfo = hostContainerInfo;
//internalInstance._currentElement.props
  var publicProps = this._currentElement.props;
  
  //这里这里是第一次处理context;其实是一个emptyObject;_processContext实现看上面链接，不放了，免得乱；
  var publicContext = this._processContext(context);
//这里Component就是Provider函数；
  var Component = this._currentElement.type;
//注意这里，就是传递给 new 组件的 update ,在本篇文章的update传递中分析
  var updateQueue = transaction.getUpdateQueue();

  // Initialize the public class
  var doConstruct = shouldConstruct(Component);
  //flag1: 注意这里，这里会真的调用Provider函数，生成 new Provider实例对象
  //注意这里执行生命周期函数  constructor
  var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
  var renderedElement;

  // These should be set up in the constructor, but as a convenience for
  // simpler class abstractions, we set them up after the fact.
  inst.props = publicProps;
  inst.context = publicContext;
  inst.refs = emptyObject;
  inst.updater = updateQueue;

  this._instance = inst;

  // Store a reference from the instance back to the internal representation
  ReactInstanceMap.set(inst, this);
 
  var markup;
  if (inst.unstable_handleError) {
    markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
  } else {
    //flag2 : 这里接着处理子组件
    //注意这里执行生命周期函数  componentWillMount 和render函数
    markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
  }
  //注意这里执行生命周期函数 componentDidMount
  if (inst.componentDidMount) {
    if (process.env.NODE_ENV !== 'production') {
      transaction.getReactMountReady().enqueue(function () {
        measureLifeCyclePerf(function () {
          return inst.componentDidMount();
        }, _this._debugID, 'componentDidMount');
      });
    } else {
      transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
    }
  }

  return markup;
},

```

* flag1: 注意这里，这里会真的调用Provider函数，生成 new Provider实例对象

  var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);

```javascript
_constructComponent: function (doConstruct, publicProps, publicContext, updateQueue) {
    if (process.env.NODE_ENV !== 'production' && !doConstruct) {
      ReactCurrentOwner.current = this;
      try {
        return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
      } finally {
        ReactCurrentOwner.current = null;
      }
    } else {
      return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
    }
  },
    //然后
    
  _constructComponentWithoutOwner: function (doConstruct, publicProps, publicContext, updateQueue) {
    var Component = this._currentElement.type;
//注意这里执行生命周期函数  constructor
    if (doConstruct) {
      if (process.env.NODE_ENV !== 'production') {
        return measureLifeCyclePerf(function () {
          //这里其实就是new Provider(props,context) ;这个时候可以对应到Provider源码上看下；但是直到现在还是没有涉及到getChildContext()所返回的对象，是如何在子组件中可以调用的；
          //等下次循环的时候这里就是 new App(props,context) 这里的context就有Provider.prototype.getChilContext返回的对象；
          return new Component(publicProps, publicContext, updateQueue);
        }, this._debugID, 'ctor');
      } else {
        return new Component(publicProps, publicContext, updateQueue);
      }
    }

    // This can still be an instance in case of factory components
    // but we'll count this as time spent rendering as the more common case.
    if (process.env.NODE_ENV !== 'production') {
      return measureLifeCyclePerf(function () {
        return Component(publicProps, publicContext, updateQueue);
      }, this._debugID, 'render');
    } else {
      return Component(publicProps, publicContext, updateQueue);
    }
  },
```

* flag2 : 这里接着处理子组件

​    markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);

```javascript
performInitialMount: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
  //注意传进来的context基本上还是等于emptyObject;
  var inst = this._instance;
//这个inis就是 Provider实例对象；
  var debugID = 0;
  if (process.env.NODE_ENV !== 'production') {
    debugID = this._debugID;
  }
//注意这里执行生命周期函数  componentWillMount
  if (inst.componentWillMount) {
    if (process.env.NODE_ENV !== 'production') {
      measureLifeCyclePerf(function () {
        return inst.componentWillMount();
      }, debugID, 'componentWillMount');
    } else {
      inst.componentWillMount();
    }
    // When mounting, calls to `setState` by `componentWillMount` will set
    // `this._pendingStateQueue` without triggering a re-render.
    if (this._pendingStateQueue) {
      inst.state = this._processPendingState(inst.props, inst.context);
    }
  }
//注意这里执行生命周期函数  render 函数
  // If not a stateless component, we now render
  if (renderedElement === undefined) {
    //这个其实就是Provider的子组件 <App /> 也是一个ReactElement对象；
    //会进入到_renderValidatedComponentWithoutOwnerOrContext函数；
    renderedElement = this._renderValidatedComponent();
  }

  var nodeType = ReactNodeTypes.getType(renderedElement);
  this._renderedNodeType = nodeType;
  var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */);
  this._renderedComponent = child;
//这里又轮回到了ReactReconciler.js中的mountComponent
  //如果child组件还是React组件，而不是宿主DOM元素，那么就会一直递归，直到child是宿主DOM元素；
  //就不会轮回到ReactCompositeComponent.js中的mountComponent;
  //对于还是React组件的情况下，还是会执行ReactCompositeComponent.js中mountComponent
  //注意这个时候传递给该函数的context参数的值是 this._processChildContext(context)
  //此时传入的child就是 App  子组件（connect后的高阶组件） 生成的React组件实例
  //然后生成的高阶组件 App  就会将通过Provider传递过来的store对象上的相关接口传递给被包裹的组件，作为被包裹组件的props;
  //文章开头有链接react其他源码分析，上面有Provider分析文章；
  var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);
//this._processChildContext(context)  此时的this指的是Provider组件经过React处理后生成的instantiateReactComponent(nextElement, false);react实例对象；上面的child也是一样的道理；
  if (process.env.NODE_ENV !== 'production') {
    if (debugID !== 0) {
      var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
      ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
    }
  }

  return markup;
},
_renderValidatedComponentWithoutOwnerOrContext: function () {
    var inst = this._instance;
    var renderedElement;

    if (process.env.NODE_ENV !== 'production') {
      renderedElement = measureLifeCyclePerf(function () {
        return inst.render();
      }, this._debugID, 'render');
    } else {
      renderedElement = inst.render();
    }

    if (process.env.NODE_ENV !== 'production') {
      // We allow auto-mocks to proceed as if they're returning null.
      if (renderedElement === undefined && inst.render._isMockFunction) {
        // This is probably bad practice. Consider warning here and
        // deprecating this convenience.
        renderedElement = null;
      }
    }

    return renderedElement;
  },

```

这里重点看下

```javascript
_processChildContext: function (currentContext) {
    var Component = this._currentElement.type;
  //这个inst就是Provider组件new之后的实例对象
    var inst = this._instance;
    var childContext;

    if (inst.getChildContext) {
      if ("development" !== 'production') {
        ReactInstrumentation.debugTool.onBeginProcessingChildContext();
        try {
          //这里通过Provider.prototype.getChildContext上得到context值
          childContext = inst.getChildContext();
        } finally {
          ReactInstrumentation.debugTool.onEndProcessingChildContext();
        }
      } else {
        childContext = inst.getChildContext();
      }
    }
    if (childContext) {
      return _assign({}, currentContext, childContext);
    }
    return currentContext;
  },
```

以上，react如何将context从祖先组件一层层传递下去的过程基本上分析完毕；

接下来看下updaterQueue如何传递的

看上面[ReactCompositeComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactCompositeComponent.js)中介绍的：

```javascript
//注意这里，就是传递给 new 组件的 update ,在本篇文章的update传递中分析
  var updateQueue = transaction.getUpdateQueue();
```

此时问题又来了，transation是哪里来的？

在step4中第一次出现. transaction

```javascript
function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
  //ReactReconcileTransaction是通过注册进来的；参见React中的注册机制；
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(
  /* useCreateElement */
  !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
  
  transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}
```

ReactReconcileTransaction.js

```javascript
var ReactUpdateQueue = require('./ReactUpdateQueue');
var Mixin = {
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  },

  getReactMountReady: function () {
    return this.reactMountReady;
  },

  getUpdateQueue: function () {
    //这个函数就是得到的updater对象，具体实现如下ReactUpdateQueue.js
    return ReactUpdateQueue;
  },
  checkpoint: function () {
    // reactMountReady is the our only stateful wrapper
    return this.reactMountReady.checkpoint();
  },

  rollback: function (checkpoint) {
    this.reactMountReady.rollback(checkpoint);
  },
  destructor: function () {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

_assign(ReactReconcileTransaction.prototype, Transaction, Mixin);
module.exports = ReactReconcileTransaction;
```

ReactUpdateQueue.js

```javascript
var ReactUpdateQueue = {
 
  isMounted: function (publicInstance) {
    if (process.env.NODE_ENV !== 'production') {
      var owner = ReactCurrentOwner.current;
      if (owner !== null) {
        process.env.NODE_ENV !== 'production' ? warning(owner._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', owner.getName() || 'A component') : void 0;
        owner._warnedAboutRefsInRender = true;
      }
    }
    var internalInstance = ReactInstanceMap.get(publicInstance);
    if (internalInstance) {
      // During componentWillMount and render this will still be null but after
      // that will always render to something. At least for now. So we can use
      // this hack.
      return !!internalInstance._renderedComponent;
    } else {
      return false;
    }
  },


  enqueueCallback: function (publicInstance, callback, callerName) {
    ReactUpdateQueue.validateCallback(callback, callerName);
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);
    if (!internalInstance) {
      return null;
    }

    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
  
    enqueueUpdate(internalInstance);
  },

  enqueueCallbackInternal: function (internalInstance, callback) {
    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
    enqueueUpdate(internalInstance);
  },

  enqueueForceUpdate: function (publicInstance) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'forceUpdate');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingForceUpdate = true;

    enqueueUpdate(internalInstance);
  },


  enqueueReplaceState: function (publicInstance, completeState, callback) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'replaceState');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingStateQueue = [completeState];
    internalInstance._pendingReplaceState = true;

    // Future-proof 15.5
    if (callback !== undefined && callback !== null) {
      ReactUpdateQueue.validateCallback(callback, 'replaceState');
      if (internalInstance._pendingCallbacks) {
        internalInstance._pendingCallbacks.push(callback);
      } else {
        internalInstance._pendingCallbacks = [callback];
      }
    }

    enqueueUpdate(internalInstance);
  },

  enqueueSetState: function (publicInstance, partialState) {
    if (process.env.NODE_ENV !== 'production') {
      ReactInstrumentation.debugTool.onSetState();
      process.env.NODE_ENV !== 'production' ? warning(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().') : void 0;
    }

    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

    if (!internalInstance) {
      return;
    }

    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

    enqueueUpdate(internalInstance);
  },

  enqueueElementInternal: function (internalInstance, nextElement, nextContext) {
    internalInstance._pendingElement = nextElement;
    // TODO: introduce _pendingContext instead of setting it directly.
    internalInstance._context = nextContext;
    enqueueUpdate(internalInstance);
  },

  validateCallback: function (callback, callerName) {
    !(!callback || typeof callback === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.', callerName, formatUnexpectedArgument(callback)) : _prodInvariant('122', callerName, formatUnexpectedArgument(callback)) : void 0;
  }
};

module.exports = ReactUpdateQueue;
```



