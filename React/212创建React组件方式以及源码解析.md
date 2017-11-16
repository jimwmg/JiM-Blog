---
title:  React创建组件的三种方式
date: 2017-05-09 12:36:00
categories: javascript
tags : React
comments : true 
updated : 
layout : 
---

###	1 React.createClass( ) 

```html
<body>
  <div id="root"></div>

  <script type='text/babel'>
    var HelloWorld = React.createClass({ render : function(){ return
    <h1>hello {this.props.name1}
      <p>hello {this.props.name2}</p>

    </h1>
    } }) ;
    ReactDOM.render(
      <HelloWorld name1='Jhon' name2="JiM" />, 
      document.getElementById('root') 
    )


  </script>
</body>
```

### 2 React.Component

ES6的创建组件，其实根源还是调用了createClass

```html
<div id="root"></div>
<script type='text/babel'>
     class Welcome extends React.Component {
         render(){
             return <h1>hello {this.props.name}</h1>
         }
     }

     const element = <Welcome name = 'JiM'/>
     ReactDOM.render(
         element,
         document.getElementById('root')
     )

   </script>
```

编译之后

```javascript
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Welcome = function (_React$Component) {
    _inherits(Welcome, _React$Component);

    function Welcome() {
        _classCallCheck(this, Welcome);

        return _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).apply(this, arguments));
    }

    _createClass(Welcome, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "h1",
                null,
                "hello ",
                this.props.name
            );
        }
    }]);

    return Welcome;
}(React.Component);
```



### 3 function  

```html
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
const Repo = ()=>(<div>this is Repo</div>)
const Category = (props)=>{
  console.log(props);
  return (<div>this is category</div>)
}
const MyTest =()=>(
  <Router>
    <div>
      <ul>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='./repo'>Repo</Link>
        </li>
      
        <li>
          <Link to='./category'>Category</Link>
        </li>
      </ul>
      <Route exact path='/about' render={(props)=>{console.log(props);return (<div>this is aabout</div>)
      }}></Route>
      <Route exact path='/repo' component={Repo}> </Route>
      <Route exact path='/category' component={Category}> </Route>
    
      <Route children={(props)=>{console.log(props);return (<div>this is a component build througth children</div>)
      }}></Route>
    
    </div>
  
  
  </Router>
)
export default MyTest
```

ES6一般写法

```jsx 
const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)
```

tips:建议用webstorm来进行源码的跟踪链接；

### 4 React.js 

 从源码角度来看创建一个React组件的过程中发生了什么。

[react.js源码github地址](https://github.com/jimwmg/React-/blob/master/react/lib/React.js)

```javascript
var createReactClass = require('./createClass');
var React = {
  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: createReactClass,
  createFactory: createFactory,
  createMixin: createMixin,

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};
```

看下React其实是个大的对象，对象上挂载了很多方法，当我们创建一个组件的时候，会调用createClass方法。

首先记住一点，无论是createClass还是class创建React组件，本质上都是一个函数，然后向组件（函数）prototype添加属性和方法；；

看下createClass.js源码

```javascript
var _require = require('./ReactBaseClasses'),
    Component = _require.Component;

var _require2 = require('./ReactElement'),
    isValidElement = _require2.isValidElement;

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');
var factory = require('create-react-class/factory');

module.exports = factory(Component, isValidElement, ReactNoopUpdateQueue);
```

[ReactBaseClasses源码地址](https://github.com/jimwmg/React-/blob/master/react/lib/ReactBaseClasses.js):这里解释了组件上为何有forceUpdate,以及setState等接口；

[ReactElement.js源码地址](https://github.com/jimwmg/React-/blob/master/react/lib/ReactElement.js):这里解释了jsx转译之后，React到底是如何创建虚拟DOM对象的；

[factory.js源码地址](https://github.com/jimwmg/React-/blob/master/create-react-class/factory.js)：这里解释了创建React组件（函数）的过程；

###  5 ReactDOM.js

 接下来看下创建一个React组件之后，如何通过ReactDOM.render(element,container)将其加载到指定 的DOM节点的。以下只贴关键源码，其他的都附有源码地址，读者可自行查看；

[ReactDOM.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactDOM.js)

[ReactDefaultInjection源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactDefaultInjection.js)

[源码解读](http://www.cnblogs.com/JhoneLee/p/5886759.html)

```javascript
var ReactDefaultInjection = require('./ReactDefaultInjection');
ReactDefaultInjection.inject();
//上面两行是使ReactHostComponent.createInternalComponent注册方法；
var ReactDOM = {
  findDOMNode: findDOMNode,
  render: ReactMount.render,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  version: ReactVersion,

  /* eslint-disable camelcase */
  unstable_batchedUpdates: ReactUpdates.batchedUpdates,
  unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
  /* eslint-enable camelcase */
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    ComponentTree: {
      getClosestInstanceFromNode: ReactDOMComponentTree.getClosestInstanceFromNode,
      getNodeFromInstance: function (inst) {
        // inst is an internal instance (but could be a composite)
        if (inst._renderedComponent) {
          inst = getHostComponentFromComposite(inst);
        }
        if (inst) {
          return ReactDOMComponentTree.getNodeFromInstance(inst);
        } else {
          return null;
        }
      }
    },
    Mount: ReactMount,
    Reconciler: ReactReconciler
  });
}
```

[ReactMount.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactMount.js)

```javascript
var ReactMount = {
  //nextElement就是ReactELement，jsx语法将组件或者div，span等转化为一个ReactElement对象
  render: function (nextElement, container, callback) {
    //将ReactElement对象和container元素传递给_renderSubtreeIntoContainer函数；
    return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
  },
  _renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback){
    .....//具体源码看上面源码地址
    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)  ._renderedComponent.getPublicInstance();

    return component;
  },
  //下面这个函数实现将ReactElement元素，转化为DOM元素并且插入到对应的Container元素中去；
  _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
    //Flag1 下面会有源码解释；
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

//====================会进入到mountComponentIntoNode函数中
function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(
    /* useCreateElement */
    !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
  transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}
//====================
function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
  var markerName;
  if (ReactFeatureFlags.logTopLevelRenders) {
    var wrappedElement = wrapperInstance._currentElement.props.child;
    var type = wrappedElement.type;
    markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
    console.time(markerName);
  }
  //Flag2 下面会有源码解释
  //markup是经过解析成功的HTML元素，该元素通过_mountImageIntoNode加载到对应的DOM元素上；
  var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
                                             );

  if (markerName) {
    console.timeEnd(markerName);
  }

  wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
  ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
}
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

**至此，从创建React组件，到组件加载到DOM 节点上的大致过程已经理顺；**

下面写的有点乱，不建议看啦；

####接下来解释下Flag1 和Flag2标记处源码

```javascript
//Flag1 下面会有源码解释；
//instantiateReactComponent(nextElement, false)函数返回一个组件的实例
var componentInstance = instantiateReactComponent(nextElement, false);
```

[instantiateReactComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/instantiateReactComponent.js)

```javascript
var ReactCompositeComponent = require('./ReactCompositeComponent');
var ReactEmptyComponent = require('./ReactEmptyComponent');
var ReactHostComponent = require('./ReactHostComponent');

// To avoid a cyclic dependency, we create the final class in this module
var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};

function instantiateReactComponent(node, shouldHaveDebugID) {
  var instance;

  if (node === null || node === false) {
    //situation1:ReactEmptyComponent组件实例
    instance = ReactEmptyComponent.create(instantiateReactComponent);
  } else if (typeof node === 'object') {
    var element = node;//element是ReactElement对象
    var type = element.type;
    if (typeof type !== 'function' && typeof type !== 'string') {
      var info = '';
      if (process.env.NODE_ENV !== 'production') {
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in.";
        }
      }
      info += getDeclarationErrorAddendum(element._owner);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', type == null ? type : typeof type, info) : _prodInvariant('130', type == null ? type : typeof type, info) : void 0;
    }

    // Special case string values
    if (typeof element.type === 'string') {
      //situation2：浏览器宿主实例，比如div,span等
      instance = ReactHostComponent.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // representations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      //situation3：
      instance = new element.type(element);

      // We renamed this. Allow the old name for compat. :(
      if (!instance.getHostNode) {
        
        instance.getHostNode = instance.getNativeNode;
      }
    } else {
      //situation4:React自定义组件，比如通过class等定义的组件；
      //这里其实也就是为什么所有的组件的render函数只能包含一个ReactElement，而不能包含并列的数组；因为element必须是一个ReactElement对象，如果是由多个ReactElement对象组成的数组，React会报错；
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
   // situation5:// 元素是一个string时，对应的比如<span>123</span> 中的123,和situation2是一样的；
    // 本质上它不是一个ReactElement，但为了统一，也按照同样流程处理，称为ReactDOMTextComponent
    instance = ReactHostComponent.createInstanceForText(node);
  } else {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Encountered invalid React node of type %s', typeof node) : _prodInvariant('131', typeof node) : void 0;
  }

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(typeof instance.mountComponent === 'function' && typeof instance.receiveComponent === 'function' && typeof instance.getHostNode === 'function' && typeof instance.unmountComponent === 'function', 'Only React Components can be mounted.') : void 0;
  }

  // These two fields are used by the DOM and ART diffing algorithms
  // respectively. Instead of using expandos on components, we should be
  // storing the state needed by the diffing algorithms elsewhere.
  instance._mountIndex = 0;
  instance._mountImage = null;

  if (process.env.NODE_ENV !== 'production') {
    instance._debugID = shouldHaveDebugID ? getNextDebugID() : 0;
  }

  // Internal instances should fully constructed at this point, so they should
  // not get any new fields added to them at this point.
  if (process.env.NODE_ENV !== 'production') {
    if (Object.preventExtensions) {
      Object.preventExtensions(instance);
    }
  }

  return instance;
}
```

接下来看下这几种实例的创建源码

situation1:instance = ReactEmptyComponent.create(instantiateReactComponent);

```javascript
var emptyComponentFactory;

var ReactEmptyComponentInjection = {
  injectEmptyComponentFactory: function (factory) {
    emptyComponentFactory = factory;
  }
};

var ReactEmptyComponent = {
  create: function (instantiate) {
    return emptyComponentFactory(instantiate);
  }
};

ReactEmptyComponent.injection = ReactEmptyComponentInjection;

ReactInjection.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
  // 前面比较绕，关键就是这句话，创建ReactDOMEmptyComponent对象
  return new ReactDOMEmptyComponent(instantiate);
});

// 各种null，就不分析了
var ReactDOMEmptyComponent = function (instantiate) {
  this._currentElement = null;
  this._nativeNode = null;
  this._nativeParent = null;
  this._nativeContainerInfo = null;
  this._domID = null;
};
//这里的_assign就是Object.assign函数
_assign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent, {
  _instantiateReactComponent: instantiateReactComponent
});

```

situation2:instance = ReactHostComponent.createInternalComponent(element);这个其实就是创建宿主元素实例

situation5:instance = ReactHostComponent.createInstanceForText(node);

在宿主元素实例上也有mountComponent方法；在生成markup的时候，对于函数，class组件实例，会递归生成新的实例，直到宿主DOM元素；

[ReactDOMComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactDOMComponent.js)

[ReactDOMTextComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactDOMTextComponent.js)

[ReactMultiChild.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactMultiChild.js)

```javascript
//ReactDOMComponent.js
this._createInitialChildren(transaction, props, context, lazyTree);
_createInitialChildren: function (transaction, props, context, lazyTree) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        DOMLazyTree.queueHTML(lazyTree, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      // TODO: Validate that text is allowed as a child of this node
      if (contentToUse != null) {
        // Avoid setting textContent when the text is empty. In IE11 setting
        // textContent on a text area will cause the placeholder to not
        // show within the textarea until it has been focused and blurred again.
        // https://github.com/facebook/react/issues/6731#issuecomment-254874553
        if (contentToUse !== '') {
          if (process.env.NODE_ENV !== 'production') {
            setAndValidateContentChildDev.call(this, contentToUse);
          }
          DOMLazyTree.queueText(lazyTree, contentToUse);
        }
      } else if (childrenToUse != null) {
        //这里就是对    根ReactElement对象的props上的子ReactElement对象进行解析；如此循环递归的创建所有的DOM元素,生成markup字符串;
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        for (var i = 0; i < mountImages.length; i++) {
          DOMLazyTree.queueChild(lazyTree, mountImages[i]);
        }
      }
    }
  },
```

```javascript
//ReactMultiChild.js
mountChildren: function (nestedChildren, transaction, context) {
  var children = this._reconcilerInstantiateChildren(nestedChildren, transaction, context);
  this._renderedChildren = children;

  var mountImages = [];
  var index = 0;
  for (var name in children) {
    if (children.hasOwnProperty(name)) {
      var child = children[name];
      var selfDebugID = 0;
      if (process.env.NODE_ENV !== 'production') {
        selfDebugID = getDebugID(this);
      }
      var mountImage = ReactReconciler.mountComponent(child, transaction, this, this._hostContainerInfo, context, selfDebugID);
      child._mountIndex = index++;
      mountImages.push(mountImage);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    setChildrenForInstrumentation.call(this, children);
  }
```



从源码可以看到，instance上都有mountComponent函数，和ReactCompositeComponent.js中的mountComponent函数一样，对于不同的ReactElement对象执行不同的mountComponent函数；

区别在于ReactCompositeComponent.js中的mountComponent会递归的生成instance直到ReactElement的type类型为string，然后执行ReactDOMComponent.js或者ReactDOMTextComponent.js的mountComponent函数，生成最终的DOM元素，挂载到节点上；

重点来看下

situation4:React自定义组件。

```javascript
instance = new ReactCompositeComponentWrapper(element);
//组件实例上有了constructor函数执行之后的所有属性以及ReactCompositeComponent对象上的所有方法，其中包括mountComponent方法，注意上文Flag2处的
var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 )；
```

在instantiateReactComponent.js的源码中，如下是ReactCompositeComponentWrapper函数的定义，该函数接受ReactElement对象作为参数

```javascript
var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};
```

然后执行 new ReactCompositeComponentWrapper(element)的时候，会执行this.constructor(element);那么constructor是哪里来的呢？

```javascript
//Object.assign
_assign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent, {
  _instantiateReactComponent: instantiateReactComponent
});
//这就使得instance = new ReactCompositeComponentWrapper(element);会执行下面的constructor方法；instance实例上有ReactCompositeComponent这个对象上的所有属性和方法，其中React组件实例上会有constructor和mountComponent函数
//注意这里并没有实例化class组件(函数)，真正new class组件(函数)是在mountComponent中进行的；这里只是让instance上可以访问到ReactElement对象（type,props.....)：this._currentElement = element;
```

[ReactCompositeComponent.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactCompositeComponent.js)

这里暂时只分析class类创建的组件渲染底层实现的代码，其余代码不贴；

```javascript
var ReactCompositeComponent = {
  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function (element) {
    this._currentElement = element;
    this._rootNodeID = 0;
    this._compositeType = null;
    this._instance = null;
    this._hostParent = null;
    this._hostContainerInfo = null;

    // See ReactUpdateQueue
    this._updateBatchNumber = null;
    this._pendingElement = null;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    this._renderedNodeType = null;
    this._renderedComponent = null;
    this._context = null;
    this._mountOrder = 0;
    this._topLevelWrapper = null;

    // See ReactUpdates and ReactUpdateQueue.
    this._pendingCallbacks = null;

    // ComponentWillUnmount shall only be called once
    this._calledComponentWillUnmount = false;

    if (process.env.NODE_ENV !== 'production') {
      this._warnedAboutRefsInRender = false;
    }
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} hostParent
   * @param {?object} hostContainerInfo
   * @param {?object} context
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    var _this = this;

    this._context = context;
    this._mountOrder = nextMountID++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;
//ReactElement对象中的props,context,type等的声明；props上有children
    var publicProps = this._currentElement.props;
    var publicContext = this._processContext(context);

    var Component = this._currentElement.type;//class声明的React组件(函数)_constructComponentWithoutOwner函数中初始化为实例对象；

    var updateQueue = transaction.getUpdateQueue();

    // Initialize the public class
    var doConstruct = shouldConstruct(Component);
    //这里的inst就是new class组件生成的实例对象；_constructComponent下面有贴上源码；
    var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
    var renderedElement;
    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    //将ReactElement对象上的props,context,refs给到React组件的实例对象；
    //这就是为什么在组件中通过this.props可以访问到对应的属性值的原因；
    /**
    class Welcome extends React.Component {
         render(){
             return <h1>hello {this.props.name}</h1>
         }
     }

     const element = <Welcome name = 'JiM'/>
    通过JSX生成ReactElement对象，生成这个对象，会成为instance = new ReactCompositeComponentWrapper(element);对象的一个属性，_currentElement；同时instance上有mountComponent方法；当Flag2处生成markup的时候，会调用这个方法，在这个方法中会new class组件，生成实例对象；
    */
    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject;
    inst.updater = updateQueue;

    this._instance = inst;

    // Store a reference from the instance back to the internal representation
    ReactInstanceMap.set(inst, this);


    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.state: must be set to an object or null', this.getName() || 'ReactCompositeComponent') : _prodInvariant('106', this.getName() || 'ReactCompositeComponent') : void 0;

    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    var markup;
    //对于class创建的React组件来说，renderedElement = inst.render();下面的函数内部会调用组件实例的render方法；这里不在深入研究；
    if (inst.unstable_handleError) {
      markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } else {
      //这里进行递归的生成组件实例，直到renderElement是宿主DOM元素的时候；下面有源码；
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }

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
  performInitialMount: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
    var inst = this._instance;

    var debugID = 0;
    if (process.env.NODE_ENV !== 'production') {
      debugID = this._debugID;
    }

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

    // If not a stateless component, we now render
    if (renderedElement === undefined) {
      renderedElement = this._renderValidatedComponent();
    }

    var nodeType = ReactNodeTypes.getType(renderedElement);
    this._renderedNodeType = nodeType;
    //如果是child是class生成的ReactElement对象，即type类型为函数，此时child上的mountComponent引用的是而ReactCompositeComponent.js中的mountComponent，则继续递归生成markup,直到child是宿主ReactElement对象，即type类型为字符串，此时child上mountComponent引用的是，ReactDOMComponent.js中的mountComponent,则最终生成DOM元素，插入到节点中；
    var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */
    );
    this._renderedComponent = child;
    //ReactReconciler.mountComponent会调用组件实例的mountComponent函数，这里对于函数组件；会调用ReactCompositeComponent.js中的mountComponent
//这里进行递归调用ReactCompositeComponent.js中的mountComponent函数，而ReactCompositeComponent.js中的mountComponent中又调用performInitialMount形成递归；
    //直到组件是宿主DOM对象的时候，生成markup的时候，会调用
    //Flag3: 重点注意下这里 ，这里就是react内部实现的通过context跨组件传递的核心；下面在解释；
    var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);

    if (process.env.NODE_ENV !== 'production') {
      if (debugID !== 0) {
        var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
        ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
      }
    }

    return markup;
  },

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

  _constructComponentWithoutOwner: function (doConstruct, publicProps, publicContext, updateQueue) {
    var Component = this._currentElement.type;

    if (doConstruct) {
      if (process.env.NODE_ENV !== 'production') {
        return measureLifeCyclePerf(function () {
          //这里的Component就是ReactElement中的type，new该type的时候，如果是class声明的，会直接执行class类中的constructor函数；返回一个组件实例对象；
          //这里就是将jsx语法生成的ReactElement，<Welcome greet = "hello" /> 中的props,传递给组件，然后组件new的时候，会执行其constructor函数；
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


}
```

#### 接下来看下Flag2的解释

```javascript
var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 )
```

[ReactReconciler.js源码地址](https://github.com/jimwmg/React-/blob/master/react-dom/lib/ReactReconciler.js)

```javascript
var ReactReconciler = {
  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} the containing host component instance
   * @param {?object} info about the host container
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function (internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID) // 0 in production and for roots
  {
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onBeforeMountComponent(internalInstance._debugID, internalInstance._currentElement, parentDebugID);
      }
    }
    //注意这里internalInstance.mountComponent其实就是ReactCompositeComponent.js中的mountComponent方法；
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
  ........
  //其他方法.......
}
```

### 6 总结

* React.js负责创建一个虚拟DOM对象，这个对象以一个大的ReactElement对象的形式存在；

* ReactDOM.js负责将虚拟DOM对象挂在到真正的DOM 根节点上，
  * 对于class组件，会调用其render函数的返回值作为renderedElement的值，进行递归挂载
  * 对于宿主DOM对象，则直接将其挂载

* ReactElement对象是一个类似于DOM对象的树状结构，ReactDOM.render(ReactElement,container,callback);中的ReactElement只能是一个对象，而不能是一个ReactElement组成的数组，这也是为什么React组件并列返回多个jsx对象是不合法的；在将React组件生成React实例的时候，这也解释了为什么只能又一个jsx对象

  instance = new ReactCompositeComponentWrapper(element);

* 一个ReactElement对象上的props.children什么时候进行实例化呢？
  在ReactDOMComponent.js中,如下就是实例化props.children，此时就会递归的执行生成DOM结构的字符串markup;

```javascript
  var mountImages = this.mountChildren(childrenToUse, transaction, context);
```







[react如何将ReactElement加载到DOM](http://developer.51cto.com/art/201610/519981.htm)

[ReactCreateClass源码解析](http://www.cnblogs.com/danceonbeat/p/6837439.html)

[ReactDOM.render源码解析](http://blog.csdn.net/u012937029/article/details/76696489)

[ReactCompositeComponent的源码实现](http://www.jianshu.com/p/2a6fe61d918c)

[babel转译网站](http://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=MYGwhgzhAEDCAWYB2BzApgGWSgrmd0aAHgC5pIAmMASmmMCQHSwD2AtgA4tLkkDeAKGjDowbhBIAnHAxaSAFB0ksOEAJSCRW6BBwc0CpSvUBuIduEl4ASwiMJYMtAC80TRe3hUedKwpoALmgQFmAwEABlEjl8NABVEmsQRnQSeQByL1xY9LVoAB986HSAL3gAWlgAOXTzCwBfMw9oK1tGbgRsNBcWmzsOxFQ0RgAja0p5VtM67Sn7MAA3TGwfbtc5iEXl71jR8YpJvrUmkXqZga75BfCcNA0ZrQ20EijHNHl3ZuEs1b9A65Atwep2OM0aM02SywO3Q8nuzX8IxwKHQkhOFjmRlU8yhK1ihzaDjIajBEPgLBwIAorE43F4cQ4FDe8h4pAACspVHlPloAPS86CI5Go9HaawAM2gBLsWJgAEJXKySBzjNAAGRq6BKlXY3TAYBoKDc4EWEJhSLRSSxBJJezPeQAIh-sQdABpeoSSG9GM7fCx_KCviJMZy7H1LQBPFIsABC9AA1nDRVozs1JM8cJIkC1pGhRWcZunKAY4TytGIkBJBY4wD0ANom7R8X1oP4BUoVarpV3gEZoEABB2AWjlAOGmDvqrsbWmbeL9_nbZXKAFEaj2wH2Bw7AI9BY4nU5EM5hrf9gQ75QAUmzu73-4PAKemu8bAF1kyJ0yRM0h5PvhAAeCjWAsAB8P7aL-AASdD-JI0DWBWGBoOKJDOHwTqISQ44tNYJAgGgzgOoAWJqALfRgAAUQ6sHwehsAgHB8YoXCLhASGxiMOGchRigsYJnCqZBnxwhwdw1DWCg8AkKwSBkJJKF1nwkgiWJElSSQg6ALvygAa2m68mieJNHAPGAQbFs0LZOg9RPvUvIgfxWi_hgtgkKI4BQFUYBsHhDpsOMaAAPo0RIDrWTZFh8EyXqMGwYAcPI8jWGozhBcFzS_tQYAASwACSZBsNA8ZoBGKHWD6s7Hv49SiPAaD6WgFAoRsXpkMVR5_C4ziuEVLZ_LxSUeBcQz0fFQF8HMfWwh1JV_Go9T1EN40bvUv68ql6VZWgbCJT10BTaBtm8vZEgbclvIAcBjYkimAj1EAA&debug=false&circleciRepo=&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&targets=&version=6.26.0)





