---
title:  React createElement源码解读 
date: 2017-05-15 12:36:00
categories: React
tags : createElement
comments : true 
updated : 
layout : 
---

### 1  先看下大概的源码

```javascript
var ReactElement = function(type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
  // ...
  return element;
};

ReactElement.createElement = function(type, config, children) {
  // ...
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
};


```

可以看出React.createElement函数返回的是一个对象,大概是这个形式

```
{
  type,
  key,
  props: {
    children
  }
}
```

### 2 我们平时进行元素渲染的时候 ,一般都是这么写

```javascript
React.render(
    <div>
        <div>
            <div>content</div>
        </div>
    </div>,
    document.getElementById('example')
);
```

**其实 `<div />`  这样用 尖括号包起来的部分可以看做是jsx的一个语法糖,他其实是封装了React.createElement方法,注意返回值是一个javascript对象**

```javascript
React.render(
    React.createElement('div', null,
        React.createElement('div', null,
            React.createElement('div', null, 'content')
        )
    ),
    document.getElementById('example')
);
```

箭头函数中的运用  如果要返回一个对象,需要用 ( ) 将表达式包起来 

```
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
```

如上代码 ` < >  ` 包起来的jsx代码返回的是一个对象,所以该箭头函数返回的就是一个js对象

### 3 React.createElement函数的参数

```javascript
ReactElement.createElement = function(type, config, children)
```

从源码来看,我们可以看出其接受三个参数,第一个是type类型,也就是我们这个组件是一个HTML元素,还是一个函数组件

```javascript
console.log(<div />); //type是字符串 div 
//-------------------------
function Welcome(props){
  return <h1>hello {props.name}</h1>
}
var element = <Welcome name = 'Jhon'/>
console.log(element);//type 是function
```

React会根据type类型首字母判断是一个HTML元素还是一个组件函数,小写字母会被当成字符串,作为type类型,大写字母会被当成组件函数,进行递归渲染.

```javascript
{
  type: (string | ReactClass),
  props: Object
}
```

### 4 ReactDOM.render函数

简单理解,该函数接受两个参数,一个是要渲染的javascript对象,一个是渲染后的DOM元素要放置的位置





今天上班时候在地铁上看的,来到公司简单总结下.

[参考:前端早读课](http://mp.weixin.qq.com/s/IC3oMQLnz7hvKaN01JS_Zw)