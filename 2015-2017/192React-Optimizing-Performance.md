---
title: React Optimizing Performance	
date: 2017-04-24 12:36:00
categories: react
tags : performance
comments : true 
updated : 
layout : 
---

### 1 首先理解shouldComponentUpdate  作用

shouldComponentUpdate: 这是一个和性能非常相关的方法，在每一次render方法之前被调用。它提供了一个机会让你决定是否要对组件进行实际的render

它是react性能优化非常重要的一环。组件接受新的state或者props时调用，我们可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候。不过调用this.forceUpdate会跳过此步骤。

In some cases, your component can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns `true`, leaving React to perform the update:

```html
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

If you know that in some situations your component doesn't need to update, you can return `false` from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

也就是说，如果shouldComponentUpdate返回true,那么React会调用render方法重新渲染页面，如果返回false,则React不会调用render方法。该方法接受两个参数，一个是下一个状态，一个是下一个props.可以和原来的props和state做对比;

```html
<div id="root"></div>
    <script type='text/babel'>
    class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1 }))}>
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

当我们改动一下代码，当count值改变之后，比较前后两者的值，如果不相等，返回false；此时不会更新视图,也就是说React没有再次调用render函数去重新渲染视图。

```javascript
if (this.state.count !== nextState.count) {
      return false;
    }
```

### 2 React.PureComponent

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color`or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

React同样提供了简单的方法，可以不让我们每次都要写shouldComponnetUpdate判断props和state的状态

```html
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

