---
title: jsx in depth 
date: 2017-04-24 12:36:00
categories: react
tags : jsx
comments : true 
updated : 
layout : 
---

### 1 在JSX中我们可以使用 `.`  来引用一个组件

```html
<div id="root"></div>
    <script type='text/babel'>
    function TestOne (props){
        const style = {color : 'red'}
        return (
            <div style = {style}>
                this is red Component {props.flag}
            </div>
        );
    }

    const MyComponent = { TestOne : TestOne }

    function TestTwo (){
        return (
            <MyComponent.TestOne />
        );
    }
    ReactDOM.render(
        <TestTwo />,
        document.getElementById('root')
    )
    </script>
```

### 2 JSX中的props属性详解

2.1 属性值可以是js表达式，也可以是字符串，默认值是true；以下属性可以通过  props.foo   props.message props.autocomplete进行访问；

```
<MyComponent foo={1 + 2 + 3 + 4} />

<MyComponent message="hello world" />
<MyComponent message={'hello world'} />

<MyTextBox autocomplete />
<MyTextBox autocomplete={true} />
```

2.2 Children in JSX 

首先来了解下定义，也就是说，在有开闭标签组件的中的内容就是 props.children对象对应的值

In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children:

2.2.1 字符串 作为props.chidlren

```html
<div id="root"></div>
    <script type='text/babel'>
    function MyComponent (props){
        return (
            <div>
                {props.children}
            </div>
        );
    }
    ReactDOM.render(
        <MyComponent >this is passed by props.children</MyComponent>,
        document.getElementById('root')
    )
    </script>
   
```

2.2.2 js表达式 作为props.children

首先要了解 React会将数组中的内容展开然后渲染到页面

```html
<div id="root"></div>
    <script type='text/babel'>
    function MyComponent(props){
        return (
            <ul>
                {props.children}
            </ul>
        );
    }

    const numbers = [1,2,3,4];
    const listItems = numbers.map((number)=>{return <li>{number}</li>})
    
    ReactDOM.render(
        <MyComponent >{listItems}</MyComponent>,
        document.getElementById('root')
    )
    </script>
```

2.2.3 JSX 表达式也可以作为 props.children 传入

```html
 <div id="root"></div>
    <script type='text/babel'>
    function MyComponent(props){
        return (
            <ul>
                {props.children}
            </ul>
        );
    }

    function MyInnerComponent (){
        return (
            <li>this is innerCmponent</li>       
        );
    }
    ReactDOM.render(
        <MyComponent >
            <MyInnerComponent />    
        </MyComponent>,
        document.getElementById('root')
    )
    </script>
```

2.2.4 函数作为props.children传入

没有被函数操作之前

```html
<div id="root"></div>
    <script type='text/babel'>
    function Repeat(){
        let arr = [];
        for(let i = 0 ; i < 10 ; i++){
            arr.push(i)
        }
        return (
            <div>
                {arr}
            </div>
        );
    }
    ReactDOM.render(
        <Repeat />,
        document.getElementById('root')
    )
    </script>
```

被props.children函数操作之后

```html
<div id="root"></div>
    <script type='text/babel'>
    function Repeat(props){
        let arr = [];
        for(let i = 0 ; i < 10 ; i++){
            arr.push(props.children(i))
        }
        return (
            <div>
                {arr}
            </div>
        );
    }
    ReactDOM.render(
        <Repeat>{(index)=>index*2}</Repeat>,
        document.getElementById('root')
    )
    </script>
```

2.2.5  null   undefined   false  true  都不会被渲染

`false`, `null`, `undefined`, and `true` are valid children. They simply don't render. These JSX expressions will all render to the same thing:

```html
 <div id="root"></div>
    <script type='text/babel'>
    
    ReactDOM.render(
        <div>
            {null }
        </div>,
        document.getElementById('root')
    )
    </script>
```

