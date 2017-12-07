---
title:  Redux Provider Connect
date: 2017-05-11 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

先看下react中如何使用context

[react中使用context](https://reactjs.org/docs/context.html#why-not-to-use-context)

接着看下直接在React中使用Redux

[Redux源码地址](https://github.com/jimwmg/redux/tree/master/src)

```javascript
var store = createStore(reducer)

class App extends Component{

  componentWillMount(){
    store.subscribe((state)=>this.setState(state))
  }
//以下在React组件中直接通过store使用Redux提供的状态管理
  render(){
    return <Comp state={this.state}
                 onIncrease={()=>store.dispatch(actions.increase())}
                 onDecrease={()=>store.dispatch(actions.decrease())}
    />
  }
}
```

那么为什么还要使用react-redux呢?

React推崇的是单向数据流，自上而下进行数据的传递，但是由下而上或者不在一条数据流上的组件之间的通信就会变的复杂。解决通信问题的方法很多，如果只是父子级关系，父级可以将一个回调函数当作属性传递给子级，子级可以直接调用函数从而和父级通信。

组件层级嵌套到比较深，**可以使用上下文getChildContext来传递信息，这样在不需要将函数一层层往下传，任何一层的子级都可以通过this.context直接访问。**

兄弟关系的组件之间无法直接通信，它们只能利用同一层的上级作为中转站。而如果兄弟组件都是最高层的组件，为了能够让它们进行通信，必须在它们外层再套一层组件，这个外层的组件起着保存数据，传递信息的作用，这其实就是redux所做的事情。

组件之间的信息还可以通过全局事件来传递。不同页面可以通过参数传递数据，下个页面可以用location.param来获取。其实react本身很简单，难的在于如何优雅高效的实现组件之间数据的交流。

###1Provider核心源码 

**Provider**是一个组件，它接受store作为props，然后通过context往下传，这样react中任何组件都可以通过context获取store。也就意味着我们可以在任何一个组件里利用dispatch(action)来触发reducer改变state，并用subscribe监听state的变化，然后用getState获取变化后的值。但是并不推荐这样做，它会让数据流变的混乱，过度的耦合也会影响组件的复用，维护起来也更麻烦。

[Provider.js源码地址](https://github.com/jimwmg/react-redux/blob/master/src/components/Provider.js)

```javascript
//自执行函数
var Provider = function (_Component) {
  _inherits(Provider, _Component);

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
Provider.childContextTypes = {store:PropTypes.storeShape.isRequired,}
  return Provider;
}(_react.Component);
```

```
Provider {props: Object, context: Object, refs: Object, updater: Object}
context:Object
props:Object
children:Object
$$typeof:Symbol(react.element)
key:null
props:Object
ref:null
type:function App()
_owner:null
_store:Object
_self:null
_source:Object
__proto__:Object
store:Object
__proto__:Object
refs:Object
state:null
store:Object
updater:Object
_reactInternalIns
```

render方法中，渲染了其子级元素，使整个应用成为Provider的子组件。
1、`this.props.children`是react内置在`this.props`上的对象，用于获取当前组件的所有子组件
2、`Children`为react内部定义的顶级对象，该对象上封装了一些方便操作子组件的方法。`Children.only`用于获取仅有的一个子组件，没有或超过一个均会报错。**故需要注意：确保Provider组件的直接子级为单个封闭元素，切勿多个组件平行放置。**

使用如下:provider的主要作用就是将store作为props对象中的一个属性传递给Provider实例化的之后的对象

```jsx
const store = createStore(reducer)

const App = () => {
  return (
    <Provider store={store}>
      <FilterLink />
    </Provider>
  )
};
```

此时store是Provider对象的props中的一个属性之一.

=========

after four hours  我有点信邪了  , 毕竟我是才学这个的小白.

`Provider` 内的任何一个组件（比如这里的 `FilterLink`），如果需要使用 `store` 中的数据，就必须是「被 connect 过的」组件——使用 `connect` 方法对「你编写的组件（`Link`）」进行包装后的产物。

```
const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
```

### 2  connect函数   connect(mapStateToProps, mapDispatchToProps, mergeProps)

首先需要了解一下[高阶组件](https://github.com/jimwmg/JiM-Blog/blob/master/2017-201n/010%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6.md)

[connect源码地址](https://github.com/jimwmg/React-/tree/master/react-redux/lib/connect)

源码中connect函数真正是在connectAdvanced.js文件中

[官方文档解释](https://github.com/jimwmg/react-redux/blob/master/docs/api.md)

Connects a React component to a Redux store.

It does not modify the component class passed to it. Instead, it returns a new, connected component class, for you to use.

connect函数的主要作用是将React组件和Redux的store联系起来

**往根本去说其实是将redux的store对象中的 state  dispatch 这些属性添加(映射)到 react组件的props属性上**

```javascript
function Welcome(props){
        console.log(props)

        return <h1>hello {props.name}</h1>
    }
 <Welcome name = 'Jhon'/> 
   //一般情况下我们组件中传递props参数的时候,是通过这种方式传递的 
```

而connect函数的作用就是向props组件中添加属性，同时给store注册监听事件，每次dispatch一个action的时候，都会执行setState函数，从而实现UI的同步更新；

Connect高阶组件其实实现的是组件的props侵入；

```javascript
export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  //这里就是简单理解：mapStateToProps, mapDispatchToProps, mergeProps, options = {}生成props给到被侵入的组件作为其属性
  //其实下面这些代码在connectAdvanced.js中，并不在connect.js中
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        //Connect组件一定得继承到了Provider组件的getChildContext方法，才能获取到Provider中props属性的store;这部分工作应该是react做的；
        // 从祖先Component处获得store
        this.store = props.store || context.store
        this.stateProps = computeStateProps(this.store, props)
        this.dispatchProps = computeDispatchProps(this.store, props)
        this.state = { storeState: null }
        // 对stateProps、dispatchProps、parentProps进行合并
        this.updateState()
      }
      shouldComponentUpdate(nextProps, nextState) {
        // 进行判断，当数据发生改变时，Component重新渲染
        if (propsChanged || mapStateProducedChange || dispatchPropsChanged) {
          this.updateState(nextProps)
            return true
          }
        }
       componentDidMount() {
          // 改变Component的state
         //通过subscribe给store注册监听事件，每次dispatch一个action的时候，setState都会执行，从而实现UI的更新
         //所有的组件都会注册在store对象中的listeners,每次state的更新，都会遍历数组触发所有的每个组件的setState,也就是说，只要有state的更新，所有组件的UI都会检查是否进行更新；这也是connect函数的作用；
          this.store.subscribe(() = {
            this.setState({
              storeState: this.store.getState()
            })
          })
        }
        render() {
          // 生成包裹组件Connect
          return (
            //这里的props就是mapStateToProps, mapDispatchToProps, mergeProps融合后的最后的大对象；
            <WrappedComponent {...Props} />
          )
        }
      }
      Connect.contextTypes = {
        store: storeShape
      }
      return Connect;
    }
  }
  //从高阶组件的角度来理解，其实就是，wrapWithConnect将Provider通过context传递下来的store，进行分析解释，然后传递给WrappedComponent组件作为props;
```

最后真正返回的其实是：hoist-non-react-statics文件中index.js中处理后的Connect组件和WrappedComponent组件的结果；[源码地址](https://github.com/jimwmg/React-/blob/master/hoist-non-react-statics/index.js)

```javascript
return (0, _hoistNonReactStatics2.default)(Connect, WrappedComponent);
```

```javascript
//以下源码的作用其实是将WrappedComponent上的所有属性，包括上面的静态属性descriptor，prototype上的全部属性descriptor全部给到Connect组件上作为Connect组件的属性；
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);
      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }
//Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
        //Object.getOwnPropertyDescriptor() 方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
        try { // Avoid failures from read-only properties
          //Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }

    return targetComponent;
  }

  return targetComponent;
};
```

在connectAdvanced.js中，有如下代码

```javascript
Connect.prototype.initSelector = function initSelector() {
  //selectorFactory该函数的作用是接受原来的store上的dispatch,返回一个函数给到sourceSelector；
  //sourceSelector接受store上的state,返回mergeProps对象，该对象上就有dispatch state 以及自己的props。{dispatch:store.dispatch,state:store.state,ownProps}
  var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
  this.selector = makeSelectorStateful(sourceSelector, this.store);
  this.selector.run(this.props);
};
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

```

再来看下Connect组件真正的render函数

```javascript
Connect.prototype.render = function render() {
  var selector = this.selector;
  selector.shouldComponentUpdate = false;
  if (selector.error) {
    throw selector.error;
  } else {
    //这里this.addExtraProps(selector.props)，返回的结果就是我们mapStateToProps，mapDispatchToProps，mergeStateToprops中返回的对象的合并之后的结果，作为props对象传递给WrappedComponent组件；所以我们在组件中可以通过props访问到store对象的state和dispatch等接口的原理；
    return (0, _react.createElement)(WrappedComponent, this.addExtraProps(selector.props));
  }
};
```

总结一下Provider的实现原理：（阿里）

#####1 首先，通过React自身可以通过context传递数据的特性，将store通过getChildContext传递给子组件，所有的子组件在通过connect之后，所有的子组件内就可以获取到该store;

#####2 在connect函数中利用闭包的特性mapStateToProps(store.state), mapDispatchToProps(store.dispatch), mergeProps, options = {} 将上述这些函数返回的对象合并成一个props,传入我们实际要被侵入的组件 

#####3 然后就可以在我们的组件上使用store对象上的state和dispatch等方法；

#####4 主要还是利用了闭包和高阶组件入侵props来实现。同时利用了React提供的通过context传递数据的特性；

#### 2.1 看一个组件的声明

Link.js  组件

```javascript
import React from 'react'
import PropTypes from 'prop-types'
//这里面的{active,children,onClick} 其实就是props,只不过是以对象的直接形式出现的,
//另外直接进行了解构赋值操作
const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href="#"
       onClick={e => {
         e.preventDefault()
         onClick()
       }}
    >
      {children}
    </a>
  )
}
//限定组件属性的数据类型
Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

console.log('link组件',<Link/>);

export default Link
```

为了方便大家看懂bable转码如下

```javascript
"use strict";

var Link = function Link(_ref) {
  var active = _ref.active,
      children = _ref.children,
      _onClick = _ref.onClick;

  if (active) {
    return React.createElement(
      "span",
      null,
      children
    );
  }

  return React.createElement(
    "a",
    { href: "#",
      onClick: function onClick(e) {
        e.preventDefault();
        _onClick();
      }
    },
    children
  );
};
```

#### 2.2 这个时候我们需要注意下{ active, children, onClick }来自何方?

FilterLink.js(container容器)

```javascript
import React from 'react'
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter))
  }
})

console.log('Link',<Link/>);


const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
//这里执行了两次函数，一个是connect() ,一个是connect()() ;执行之后返回的是一个组件，赋值给容器组件，然后通过JSX语法，转化为一个对象；
console.log('FilterLink',<FilterLink/>);

export default FilterLink
```

* mapStateToProps(state,ownProps) 这个函数的作用就是将store对象中的state状态赋值给组件的props属性
* mapDispatchToProps(dispatch, ownProps)这个函数的作用就是将store对象中dispatch方法给到props属性









[参考](http://taobaofed.org/blog/2016/08/18/react-redux-connect/)