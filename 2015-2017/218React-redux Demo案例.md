---
title:  从react到react-redux到react-redux-react-redux
date: 2017-05-11 12:36:00
categories: redux
tags : redux
comments : true 
updated : 
layout : 
---

前言,对于初学者来说,这个demo理解起来相对简单,只需要create-react-app  ,然后 npm install react-redux  npm install redux 即可.(react官方文档和redux官方文档)

本文主要理解redux在react中期的作用,以及react-redux如何将react和redux连接起来

[Provider connect 源码解读](https://jimwmg.github.io/2017/05/11/215Redux-Provider-Connect/)

[createStore源码](https://jimwmg.github.io/2017/05/05/205Redux-createStore%E6%BA%90%E7%A0%81/)

[Provider connect2 源码解读](http://www.cnblogs.com/hhhyaaon/p/5863408.html)

[一个比较好的案例](https://github.com/bailicangdu/react-pxq)

### 1 react    

通过setState改变state状态,触发ReactDOM.render函数,重新刷新UI组件

```javascript
import React ,{Component,PropTypes} from 'react'
import ReactDOM from 'react-dom'

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      count: prevState.count+1
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.count}
      </button>
    );
  }
}


console.dir(Toggle);

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

### 2 react-redux

通过给store注册render函数,每次dispatch的时候,都会触发render函数(dispatch函数执行的时候,会执行传入的reducer和绑定的所有的监听函数 )

```javascript
import React ,{Component,PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'

const increaseAction = {type :'INCREASE'}

function reducer(state = {count: 0},action){
  switch(action.type){
    case 'INCREASE' :
      return {count : state.count+1}
    default : 
      return state 
  }
}
const store = createStore(reducer)
console.log(store);

console.log(store.getState());
//=========================如果没有这段代码,视图将不会更新,但是state状态确实是改变了的
function render(){
    ReactDOM.render(
    <Toggle />,
    document.getElementById('root')
    );
}

store.subscribe(render)
//============================================
class Toggle extends React.Component {

  render() {
    return (
      <button onClick={()=>{store.dispatch(increaseAction);console.log(store.getState().count);
      }}>
        {store.getState().count}
      </button>
    );
  }
}


console.dir(Toggle);

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

### 3 react    redux     react-redux 

通过第二部分代码我们可以看出来,redux确实可以帮助我们管理代码,但是有一点不好的地方就是每次state的状态改变的时候,都需要重新手动刷新视图.

react-redux 提供两个函数,一个是Provider,该组件函数定义的时候,大概实现如下:

```javascript
class Provider extends Component {
  getChildContext() {
    return {
      store : this.props.store
    };
  }
  render() {
    return this.props.children;
    //表示渲染Privider组件的子元素
  }
}

Provider.childContextTypes = {
  store: React.PropTypes.object
}
```

一个是connect函数 const WrapToggle = connect(mapStateToProps,mapDispatchToProps)(Toggle),高阶组件

该函数的作用是通过mapStateToProps和mapDispatchToProps函数,将将一些属性添加到Toggle组件的props上

```jsx
import React ,{Component,PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider,connect} from 'react-redux'

const increaseAction = {type :'INCREASE'}

function reducer(state = {count: 0},action){
  switch(action.type){
    case 'INCREASE' :
      return {count : state.count+1}
    default : 
      return state 
  }
}

const store = createStore(reducer)
console.log(store);

console.log(store.getState());

class Toggle extends React.Component {
  
  render() {
    console.log(this.props);//connect函数中stateProps dispatchProps ownProps 三者融合后的结果传递给UI组件props对象
    //对象的解构赋值
    const {value,onIncreaseClick} = this.props 
    return (
      <button onClick= {onIncreaseClick}>
        {value}
      </button>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  console.log(ownProps);
  //state就是通过Provider传递进来的store.getState()的结果
  //ownProps就是connect返回的新组件,这里是WrapToggle组件上的Props属性对象
  return {
    value: state.count
  }
}

const  mapDispatchToProps = (dispatch, ownProps) => {
  console.log(dispatch);
  console.log(ownProps);
  //dispatch就是 通过Provider传递进来的store.dispatch函数
  //ownProps就是connect返回的新组件,这里是WrapToggle组件上的Props属性对象
  return {
    onIncreaseClick: () => {
      dispatch(increaseAction)
    }
  }
}
const WrapToggle = connect(mapStateToProps,mapDispatchToProps)(Toggle)

console.dir(Toggle);
console.dir(WrapToggle);
//注意 WrapToggle组件添加了一个属性,方便一会输出对比,这些属性就是ownProps对象
ReactDOM.render(
  <Provider store={store}>
  
    <WrapToggle wrapProps='WarpToggleProps'/>
  </Provider>,
  document.getElementById('root')
);
```

### 4 react如何响应store的变化,也就是说何时重新渲染页面

4.1 单纯的react中,通过setState函数,改变state状态树,setState函数每次执行都会重新渲染UI视图

4.2 react搭配redux的时候,通过store链接,react的状态可以通过redux来进行管理,此时redux创建的store中存储了react中的state状态,此时如果想要更新UI视图,需要手动绑定事件,此时唯一改变state的函数是dispatch,通过该函数改变state,从createStore源码中可以看出来

* 先执行reducer,改变state状态
* 然后会执行通过subscribe注册的所有的监听事件

4.3 react搭配redux的时候, 通过react-redux进行react和redux的连接 ;

* Provider函数作用:  
  * 1)在原应用组件上包裹一层，使原来整个应用成为Provider的子组件,而Provider组件定义的时候,render函数返回的是子组件,所以渲染的还是子组件 
  * 2) 接收Redux的store作为props，通过context对象传递给子孙组件上的connect
* 在connect内部,当state树发生变化的时候,最终会触发setState函数,所以会直接触发UI视图的重新渲染
  * 1)将store对象上的整个state状态树上的**某个属性**传递给被包裹的组件,这里组件是Toggle,传递的属性是value
  * 2)将store对象上的触发dispatch函数的onIncreaseClick传递给被包裹组件,这里是Toggle,传递的属性是onIncreaseClick
  * 3)connect函数会将这些属性一起合并到Toggle组件的属性props上

4. 4 connect函数参数解析 connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(component)

   1)**mapStateToProps(state, [ownProps])：**函数: 每次state状态更新的时候都会调用该函数

   - 该函数在每次store中的state状态树更新的时候都会**调用该函数,**通过本案例点击按钮看到控制台输出可以深化理解
   - 该函数返回的对象必须是plain object
   - **默认为空,不会将state状态添加到component组件中**

   ```
   function mapStateToProps(state) {
      return { todos: state.todos };
   }
   ```

   2)**mapDispatchToProps(dispatch, [ownProps])：**函数:

   默认会将dispatch函数添加到component组件中props属性上.

   ```javascript
   function mapDispatchToProps(dispatch) {
      return {
         todoActions: bindActionCreators(todoActionCreators, dispatch),
         counterActions: bindActionCreators(counterActionCreators, dispatch)
      };
   }
   //这里面mapDispatchToProps函数接受的参数其实就是store.dispatch函数,bindActionCreators函数接受两个参数,一个是actionCreator,一个是dispatch函数
   ```

   3)**mergeProps(stateProps, dispatchProps, ownProps)：**

   将mapStateToProps() 与 mapDispatchToProps()返回的对象和**容器组件**自身的props(本案例就是WrapToggle组件的props:  wrapProps='WarpToggleProps)合并成新的props并传入被包裹的组件(Toggle)。默认返回 Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。

   **这里也就解释了为什么Toggle组件中props属性中有**stateProps, dispatchProps, ownProps 这些对象的组合结果了.