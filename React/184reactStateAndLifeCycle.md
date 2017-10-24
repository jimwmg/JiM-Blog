---
title:  react State 和 lifeCycle 
date: 2017-04-19 12:36:00
categories: react
tags : [reactState]
comments : true 
updated : 
layout : 
---

### 1 先来看下函数定义组件

```html
<div id="root"></div>
    
   <script type='text/babel'>
    function Clock(props){
        return (
            <div>
                <p>hello world</p>
                <p>it is {props.date.toLocaleTimeString()}</p>
            </div>
        );
    }  

    function tick (){
        ReactDOM.render(
            <Clock date = {new Date()}/>,
           document.getElementById('root')
        )
    }
    
    setInterval(tick,1000);
   </script>
```

如何让Clock拥有自动更新UI的能力？就像这个样子实现功能？

```javascript
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

To implement this, we need to add "state" to the `Clock` component.

State is similar to props, but it is private and fully controlled by the component.

We [mentioned before](https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components) that components defined as classes have some additional features. Local state is exactly that: a feature available only to classes.

### 2 将函数定义组件的方式改为类定义组件

```html
class Clock extends React.Component{
        render(){
            return (
                <div>
                    <p>hello world</p>
                    <p>it is {this.props.date.toLocaleTimeString()}</p>
                </div>
            );
        }
    }
```

2.1 如何将当前状态添加进类定义的组件？如何将 date 属性从props 对象迁移至 state对象？

* 添加一个constructor构造函数  将date赋值给this.state 
* 我们需要将this.props.date   改成  this.state.date
* 移除掉组件上的date

```html
class Clock extends React.Component{
        constructor(props) {
            super(props);
            this.state = {date : new Date()}   //第一步
        }


        render(){
            return (
                <div>
                    <p>hello world</p>
                    <p>it is {this.state.date.toLocaleTimeString()}</p>  //第二步
                </div>
            );
        }
    }

    ReactDOM.render(
        <Clock />,   //第三步
        document.getElementById('root')
    )
    
```

2.2 接下来就需要设定定时器，可以是组件Clock设置自己的定时器，并且可以自动更新

Adding Lifecycle Methods to a Class

In applications with many components, it's very important to free up resources taken by the components when they are destroyed.

We want to [set up a timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) whenever the `Clock` is rendered to the DOM for the first time. This is called "mounting" in React.

We also want to [clear that timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) whenever the DOM produced by the `Clock` is removed. This is called "unmounting" in React.

**We can declare special methods on the component class to run some code when a component mounts and unmounts:**

我们可以在组件上定义一些特殊的方法，当组件装配或者装卸的时候，运行某些代码

React有两个内置的方法 componentDidMount()   componentWillUnmount()

These methods are called "lifecycle hooks".

* The `componentDidMount()` hook runs after the component output has been rendered to the DOM. This is a good place to set up a timer:

```javascript
componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

* We will tear down the timer in the `componentWillUnmount()` lifecycle hook:

```javascript
componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

完整代码如下：

```html
<div id="root"></div>
    
   <script type='text/babel'>
    class Clock extends React.Component{
        constructor(props) {
            super(props);
            this.state = {date : new Date()}
        }

        tick(){
            this.setState(
                {date:new Date()}
            );
        }

        componentDidMount(){
            this.timerID = setInterval(()=>this.tick(),1000)
        }

        componentWillUnmount(){
            clearInterval(this.timerID)
        }

        
        render(){
            return (
                <div>
                    <p>hello world</p>
                    <p>it is {this.state.date.toLocaleTimeString()}</p>
                </div>
            );
        }
    }

    ReactDOM.render(
        <Clock />,
        document.getElementById('root')
    )
    
   </script>
```

Let's quickly recap what's going on and the order in which the methods are called:

1) When `<Clock />` is passed to `ReactDOM.render()`, React calls the constructor of the `Clock` component. Since `Clock` needs to display the current time, it initializes `this.state`with an object including the current time. We will later update this state.

2) React then calls the `Clock` component's `render()` method. This is how React learns what should be displayed on the screen. React then updates the DOM to match the `Clock`'s render output.

3) When the `Clock` output is inserted in the DOM, React calls the `componentDidMount()`lifecycle hook. Inside it, the `Clock` component asks the browser to set up a timer to call `tick()` once a second.

4) Every second the browser calls the `tick()` method. Inside it, the `Clock` component schedules a UI update by calling `setState()` with an object containing the current time. Thanks to the `setState()` call, React knows the state has changed, and calls `render()`method again to learn what should be on the screen. This time, `this.state.date` in the `render()` method will be different, and so the render output will include the updated time. React updates the DOM accordingly.

5) If the `Clock` component is ever removed from the DOM, React calls the `componentWillUnmount()` lifecycle hook so the timer is stopped.

### 3 setState( )函数

3.1 接受一个对象作为参数

```javascript
this.setState({comment: 'Hello'});
```

3.2 接受一个函数作为参数,箭头函数返回值还是一个对象,也可以直接接受一个函数，返回一个对象

```javascript
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));

//如果用用箭头函数自定义对象  需要用小括号将花括号包起来，这个时候返回的结果才是一个对象
```

```javascript
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

3.3 注意对于state和props，它们的值可能被异步更新，所以当我们计算它们的下一个状态值的时候，不能依赖它们的当前值，比如如下demo不会更新

```javascript
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

```html
<div id="root"></div>
    <script type='text/babel'>
    class CounterButton extends React.Component{
        constructor(props){
            super(props);
            this.state = {count : 1 }
        }
        render(){
            return (
                <button color = {this.props.color} 
                onClick = {()=>this.setState({count : this.state.count++})}>
                    count : {this.state.count}
                </button>
            );
        }
    }

    ReactDOM.render(
        <CounterButton />,
        document.getElementById('root')
    )
    </script>
```

```javascript
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

```html
<div id="root"></div>
    <script type='text/babel'>
    class CounterButton extends React.Component{
        constructor(props){
            super(props);
            this.state = {count : 1 }
        }
        render(){
            return (
                <button color = {this.props.color} 
                onClick = {() => this.setState(state=>({count:state.count + 1}))}>
                    count : {this.state.count}
                </button>
            );
        }
    }

    ReactDOM.render(
        <CounterButton />,
        document.getElementById('root')
    )
    </script>
```

或者直接传入setState一个函数，该函数显示的返回一个对象

```html
<div id="root"></div>
    <script type='text/babel'>
    class CounterButton extends React.Component {
        constructor(props) {
          super(props);
          this.state = {count: 1};
        }
        render() {
          return (
            <button
              color={this.props.color}
              onClick={() => this.setState(function(state){
                  return {
                      count : state.count + 1 
                  }
              })}>
              Count: {this.state.count}
            </button>
          );
        }
      }

    ReactDOM.render(
        <CounterButton />,
        document.getElementById('root')
    )
    </script>
```

以下贴上一段React中关于setstate的源码，便于理解；

```javascript
ReactComponent.prototype.setState = function(partialState, callback) {
  ("production" !== "development" ? invariant(
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.'
  ) : invariant(typeof partialState === 'object' ||
  typeof partialState === 'function' ||
  partialState == null));
  if ("production" !== "development") {
    ("production" !== "development" ? warning(
      partialState != null,
      'setState(...): You passed an undefined or null state object; ' +
      'instead, use forceUpdate().'
    ) : null);
  }
```

setState会自动调用render函数，触发视图的重新渲染，如果仅仅只是state数据的变化而没有调用setState，并不会触发更新。

### 4 react组件生命周期

对于自定义组件，唯一必须实现的方法就是render()，除此之外，还有一些方法会在组件生命周期中被调用，如下

- constructor: 构造函数，组件被创建时执行；
- componentDidMount: 当组件添加到DOM树之后执行；
- componentWillUnmount: 当组件从DOM树中移除之后执行，在React中可以认为组件被销毁；
- componentDidUpdate: 当组件更新时执行。
- shouldComponentUpdate: 这是一个和性能非常相关的方法，在每一次render方法之前被调用。它提供了一个机会让你决定是否要对组件进行实际的render

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

当此函数返回false时，组件就不会调用render方法从而避免了虚拟DOM的创建和内存中的Diff比较，从而有助于提高性能。当返回true时，则会进行正常的render的逻辑。

[有关更详细的API ]: http://cdn2.infoqstatic.com/statics_s1_20170411-0445/resource/articles/react-jsx-and-component/zh/resources/0702001.png