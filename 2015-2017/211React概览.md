---
title:  React概览
date: 2017-05-09 12:36:00
categories: javascript
tags : React
comments : true 
updated : 
layout : 
---

### 1 React中有什么顶层API 

```html
<body>
    <script src='../build/react-0.13.4.js'></script>
    <script>
        console.log(React);    
    </script>
</body>
```

控制台输出就是如下React对象

```javascript
var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    only: onlyChild
  },
  Component: ReactComponent,
  DOM: ReactDOM,
  PropTypes: ReactPropTypes,
  initializeTouchEvents: function(shouldUseTouch) {
    EventPluginUtils.useTouchEvents = shouldUseTouch;
  },
  createClass: ReactClass.createClass,
  createElement: createElement,
  cloneElement: cloneElement,
  createFactory: createFactory,
  createMixin: function(mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },
  constructAndRenderComponent: ReactMount.constructAndRenderComponent,
  constructAndRenderComponentByID: ReactMount.constructAndRenderComponentByID,
  findDOMNode: findDOMNode,
  render: render,
  renderToString: ReactServerRendering.renderToString,
  renderToStaticMarkup: ReactServerRendering.renderToStaticMarkup,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  isValidElement: ReactElement.isValidElement,
  withContext: ReactContext.withContext,

  // Hook for JSX spread, don't use this for anything else.
  __spread: assign
};
```

###  顶层API的一般用法

#### createElement( )

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

平常我们用 jsx 写的`<Hello />` 其实就是对CreateElement函数的封装

```javascript
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

等价于

```javascript
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

#### React.Component( ) 

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 2 ReactDOM

#### ReactDOM.render()

```javascript
ReactDOM.render(
  element,
  container,
  [callback]
)
```

* 该方法将在我们提供的container中渲染一个React元素
* 如果可选择的callback被提供了,那么在组件渲染完毕之后,就可以执行callback函数
* React将会替换我们提供的container中的所有元素为ReactElement(如果原来的容器有子元素的话)

####  unmountComponentAtNode( )

```
ReactDOM.unmountComponentAtNode(container)
```

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

#### findDOMNode( )

```
ReactDOM.findDOMNode(component)
```

If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using findDOMNode at all.** When `render` returns `null` or `false`, `findDOMNode` returns `null`.

