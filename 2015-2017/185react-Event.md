---
title:  react Event 
date: 2017-04-19 12:36:00
categories: react
tags : [Event]
comments : true 
updated : 
layout : 
---

### 1 Handling events with React elements is very similar to handling events on DOM elements. There are some syntactic differences:

- React events are named using camelCase, rather than lowercase.
- With JSX you pass a function as the event handler, rather than a string.
- 函数的this指向null,而原先的HTML绑定时间this指向的是绑定事件的元素
- react并不会真正的绑定事件到每一个具体的元素上，而是采用事件代理的模式：在根节点document上为每种事件添加唯一的Listener，然后通过事件对象的event.target找到真实的触发元素。这样从触发元素到顶层节点之间的所有节点如果有绑定这个事件，React都会触发对应的事件处理函数。这就是所谓的React模拟事件系统。

建议先了解下箭头函数，我也有些过关于[箭头函数](https://jimwmg.github.io/2016/12/07/117-ES6%E6%96%B0%E7%89%B9%E6%80%A7%20%20%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0/)的博文

```html
<body>
    <a href="http://www.baidu.com" onclick="console.log('The link was clicked.'); console.log(this);return false">
  Click me  
</a>

    <a href="http://www.baidu.com" onclick="console.log('The link was clicked.');">
  Click me
</a>
</body>
```

以上：这里面的this代表的是a标签  ；可以通过return false阻止默认事件   ；事件绑定命名用小写字母

```html
<div id="root"></div>
    
   <script type='text/babel'>
    function ActionLink(props){
        function HandlerClick(e){
            e.preventDefault();
            console.log(this)
            
        }
        return (
            <a href="http://www.baidu.com" onClick = {HandlerClick}>click me react</a>
        )
    }
    
    ReactDOM.render(
        <ActionLink />,
        document.getElementById('root')
    )
   </script>
```

以上：这里面的this代表的是null  ；不可以通过return false阻止默认事件 ，只能用e.preventDefalut()  ；事件绑定命名用驼峰命名的方式

以上函数声明组件等价于以下class类声明组件，重点注意this指向null,而不是元素标签,为了使handle函数内部的this不是指向null或者undefined，需要我们手动绑定这些函数执行的时候this的指向

```html
 <div id="root"></div>
    
   <script type='text/babel'>
    class ActionLink  extends React.Component{
        HandlerClick(e){
            e.preventDefault();
            console.log(this);
        }

        render(){
            return (
                <a href="http://www.baidu.com" onClick = {this.HandlerClick}>click me react</a>
            )
        }
    }

    ReactDOM.render(
        <ActionLink />,
        document.getElementById('root')
    )
   </script>
```

那么如何使得HandlerClick函数内部的this指向改变？

```html
 <div id="root"></div>
    
   <script type='text/babel'>
    class ActionLink  extends React.Component{
        constructor(props){
            super(props);
            this.HandlerClick = this.HandlerClick.bind(this);
        }

        HandlerClick(e){
            e.preventDefault();
            console.log(this);
        }

        render(){
            return (
                <a href="http://www.baidu.com" onClick = {this.HandlerClick}>click me bind</a>
            )
        }
    }

    ReactDOM.render(
        <ActionLink />,
        document.getElementById('root')
    )
   </script>

```

这个时候可以发现控制台输出的this指向的是

```
ActionLink {props: Object, context: Object, refs: Object, updater: Object, HandlerClick: function…}
```

### 2 接下来走一个改变this指向应用的实例

```html
<div id="root"></div>
    
   <script type='text/babel'>
   class Toggle extends React.Component{
       constructor(props){
           super(props);
           this.state = {isToggleOn : true};
           this.handlerClick = this.handlerClick.bind(this);
       }

       handlerClick(){
           console.log(this);
           this.setState((prevState)=>({isToggleOn : !prevState.isToggleOn}));
       }

       render(){
           return (
               <button onClick = {this.handlerClick}>
                   {this.state.isToggleOn?'on':'off'}
               </button>
           );
       }
   }

   ReactDOM.render(
       <Toggle />,
       document.getElementById('root')
   )
   </script>
```

同样使用箭头函数也可以达到类似的效果，改变render函数，一定要明确箭头函数的特性，同时()不要忘记加；

```html
render(){
           return (
               <button onClick = {()=>this.handlerClick()}>
                   {this.state.isToggleOn?'on':'off'}
               </button>
           );
       }
```

看一下这段代码,也是通过箭头函数指定的this指向.

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Counter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
  }

  incrementIfOdd = () => {
    if (this.props.value % 2 !== 0) {
      this.props.onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props
    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={onIncrement}>
          +
        </button>
        {' '}
        <button onClick={onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

export default Counter

```



理解箭头函数

```html
<body>
    <input id='btn' value = 'button'  type="button" >
    <script>
        function arrow(){
            console.log('this is arrow func');
            
        }

        document.getElementById('btn').onclick = ()=>arrow()
        //等价于
        document.getElementById('btn').onclick = function()(
        	arrow() ;
        )
        //当点击按钮的时候 onclick的事件监听函数执行,该函数执行的过程中,内部代码 arrow()会执行函数arrow，所以这就是()不要忘记加的原因
    </script>
</body>
```



控制台输出的this都是

```
Toggle {props: Object, handlerClick:function (),context: Object, refs: Object, updater: Object, state: Object…}
```

### 3 使用箭头函数注意细节

但是如果使用以下写法就不会绑定this到Togglel了

