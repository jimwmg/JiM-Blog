---
title:  Redux Provider Connect
date: 2017-05-11 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

我是一个不信邪的人,所以无论如何我也要把这个搞明白

先来看下直接在React中使用Redux

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

```javascript
var Provider = function (_Component) {
  _inherits(Provider, _Component);

  Provider.prototype.getChildContext = function getChildContext() {
    return { store: this.store };
  };

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

```javascript
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

```javascript
export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
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
          this.store.subscribe(() = {
            this.setState({
              storeState: this.store.getState()
            })
          })
        }
        render() {
          // 生成包裹组件Connect
          return (
            <WrappedComponent {...this.nextState} />
          )
        }
      }
      Connect.contextTypes = {
        store: storeShape
      }
      return Connect;
    }
  }
```



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



源码暂时没有告破





[参考](http://taobaofed.org/blog/2016/08/18/react-redux-connect/)