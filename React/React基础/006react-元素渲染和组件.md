---
title:  react 元素渲染和组件
date: 2017-04-18 12:36:00
categories: react
tags : component
comments : true 
updated : 
layout : 
---

### react特点

- **1.声明式设计** −React采用声明范式，可以轻松描述应用。
- **2.高效** −React通过对DOM的模拟，最大限度地减少与DOM的交互。
- **3.灵活** −React可以与已知的库或框架很好地配合。
- **4.JSX** − JSX 是 JavaScript 语法的扩展。React 开发不一定使用 JSX ，但我们建议使用它。
- **5.组件** − 通过 React 构建组件，使得代码更加容易得到复用，能够很好的应用在大项目的开发中。
- **6.单向响应的数据流** − React 实现了单向响应的数据流，从而减少了重复代码，这也是它为什么比传统数据绑定更简单。

###  React的原理

在Web开发中，我们总需要将变化的数据实时反应到UI上，这时就需要对DOM进行操作。而复杂或频繁的DOM操作通常是性能瓶颈产生的原因（如何进行高性能的复杂DOM操作通常是衡量一个前端开发人员技能的重要指标）。React为此引入了虚拟DOM（Virtual DOM）的机制：在浏览器端用Javascript实现了一套DOM API。基于React进行开发时所有的DOM构造都是通过虚拟DOM进行，每当数据变化时，React都会重新构建整个DOM树，然后React将当前整个DOM树和上一次的DOM树进行对比，得到DOM结构的区别，然后仅仅将需要变化的部分进行实际的浏览器DOM更新。而且React能够批处理虚拟DOM的刷新，在一个事件循环（Event Loop）内的两次数据变化会被合并，例如你连续的先将节点内容从A变成B，然后又从B变成A，React会认为UI不发生任何变化，而如果通过手动控制，这种逻辑通常是极其复杂的。尽管每一次都需要构造完整的虚拟DOM树，但是因为虚拟DOM是内存数据，性能是极高的，而对实际DOM进行操作的仅仅是Diff部分，因而能达到提高性能的目的。这样，在保证性能的同时，开发者将不再需要关注某个数据的变化如何更新到一个或多个具体的DOM元素，而只需要关心在任意一个数据状态下，整个界面是如何Render的。

### 1 HTML 标签 vs. React 组件 

React 可以渲染 HTML 标签 (strings) 或 React 组件 (classes)。

要渲染 HTML 标签，只需在 JSX 里使用小写字母的标签名。

```javascript
var myDivElement = <div className="foo" />;
ReactDOM.render(myDivElement, document.getElementById('example'));
```

要渲染 React 组件，只需创建一个大写字母开头的本地变量。

```javascript
var MyComponent = React.createClass({/*...*/});
var myElement = < MyComponent someProperty={true} />;
ReactDOM.render(myElement, document.getElementById('example'));
```

React 的 JSX 使用大、小写的约定来区分本地组件的类和 HTML 标签。

注意，

* 原生 HTML 元素名以小写字母开头，而自定义的 React 类名以大写字母开头，比如 HelloMessage 不能写成 helloMessage。除此之外还需要注意组件类只能包含一个顶层标签，否则也会报错。
* 在定义一个组件的时候,output的所有的标签必须被正确的闭合，这样子react框架才能正确识别每个标签

```html
render(){
return (
<form onSubmit = {this.handleSubmit}>
  <label for="name">name
    <input type = "text" name="gender" value = {this.state.value} onChange = {this.handleChange}/>
  </label>
  <input type="submit"  value="submit"/>
</form>
)
}
```

**注意每一个input标签里面的 最后的  /  不能缺少** 

[推荐阅读]: http://www.infoq.com/cn/articles/react-dom-diff

**Components must return a single root element.** 

### 2 react 元素的不可变性

2.1 React Only Updates What's Necessary

React DOM compares the element and its children to the previous one, and only applies the DOM updates necessary to bring the DOM to the desired state.

### 3 react组件 

* 组件是React中构建用户界面的基本单位。它们和外界的交互除了状态（state）之外，还有就是属性（props）。事实上，状态更多的是一个组件内部去自己维护，而属性则由外部在初始化这个组件时传递进来（一般是组件需要管理的数据）。React认为属性应该是只读的，一旦赋值过去后就不应该变化。
* 每个组件只需要前端开发者提供一个 render 函数，把 props 和 state 映射成网页元素。
* setState : 组件规范中定义了setState方法，每次调用时都会更新组件的状态，触发render方法。需要注意，render方法是被异步调用的，这可以保证同步的多个setState方法只会触发一次render，有利于提高性能。和props不同，state是组件的内部状态，除了初始化时可能由props来决定，之后就完全由组件自身去维护。在组件的整个生命周期中，React强烈不推荐去修改自身的props，因为这会破坏UI和Model的一致性，props只能够由使用者来决定。
* props :  组件自身定义了一组props作为对外接口，展示一个组件时只需要指定props作为XML节点的属性。组件很少需要对外公开方法，唯一的交互途径就是props。这使得使用组件就像使用函数一样简单，给定一个输入，组件给定一个界面输出。
* this.props.children :  `this.props.children` 的值有三种可能：如果当前组件没有子节点，它就是 `undefined` ;如果有一个子节点，数据类型是 `object` ；如果有多个子节点，数据类型就是 `array` 。所以，处理 `this.props.children` 的时候要小心。

声明组件有两种方式，一种是直接函数function声明 一种是直接class类声明

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

函数声明组件

```html
<div id="root"></div>

<script type='text/babel'>
     function Welcome(props){
        return <h1>hello {props.name}</h1>
     }
   const element = <Welcome name = "Jhon"/>
   ReactDOM.render(
       element,
       document.getElementById('root')

   )

</script>
```

类声明组件 super调用了父类的constructor创造了父类的实例对象this，然后用子类的构造函数进行修改

```html
<div id="root"></div>

<script type='text/babel'>
     class Welcome extends React.Component {
         render(){
             return <h1>hello {this.props.name}</h1>
         }
     }

     const element = <Welcome name = 'Jhon'/>
     ReactDOM.render(
         element,
         document.getElementById('root')
     )
</script>
```

当我们使用组件`<Welcome />`时，其实是对Main类的实例化——new Welcome，只不过react对这个过程进行了封装，让它看起来更像是一个标签。类和模块内部默认使用严格模式，所以不需要用use strict指定运行模式。

`React.Component` is an abstract base class, so it rarely makes sense to refer to `React.Component` directly. Instead, you will typically subclass it, and define at least a [`render()`](https://facebook.github.io/react/docs/react-component.html#render) method.

组件的 

Let's recap what happens in this example:

1. We call `ReactDOM.render()` with the `<Welcome name="Jhon" />` element.
2. React calls the `Welcome` component with `{name: 'Jhon'}` as the props.
3. Our `Welcome` component returns a `<h1>Hello, Jhon</h1>` element as the result.
4. React DOM efficiently updates the DOM to match `<h1>Hello,Jhon</h1>`.

我们可以通过 this.props对象向组件传递参数

```html
<div id="root"></div>
   <script type='text/babel'>
      var HelloWorld = React.createClass({
        render : function(){
          return <h1>hello {this.props.name1}
                    <p>hello {this.props.name2}</p>          
                </h1>        
        }
      }) 
   ReactDOM.render(
      <HelloWorld name1 = 'Jhon' name2 = "JiM"/>,
      document.getElementById('root')
   )   
   </script>
```

复合组件

```html
 <div id="root"></div>
    
   <script type='text/babel'>
    function Welcome(props){
        return <h1>hello {props.name}</h1>
    }
    function App(){
        return (
            <div>
                <Welcome name = 'Jhon'/>
                 <Welcome name = 'JiM'/>
                  <Welcome name = 'Kobe'/>
            </div>
        )
    }

    const element = <App />

    ReactDOM.render(
        element ,
        document.getElementById('root')
    )
   </script>
```

**注意组件实例化的时候传入的属性是js表达式的时候，要用`{}` 括起来 **, javascritpExpression必须要用`{ }` 括起来

```html
<div id="root"></div>
    
   <script type='text/babel'>
   function formateDate(date){
        return date.toLocaleDateString();
   }
   function Comment(props){
       console.log(props)
       return (
           <div className = "Comment">
               <div className = 'UserInfo'>
                   <img className = 'avatar' src={props.author.avatarUrl} alt={props.author.name}/>
                   <div className = 'UserInfo-name'>
                       {props.author.name}
                   </div>
               </div>

               <div className = 'Comment-text'>
                   {props.text}
               </div>

               <div className = 'Comment-data'>
                   {formateDate(props.date)}
               </div>
           </div>
       );
   }

   const comment = {
       date : new Date(),
       text : 'Thank you for give me the chance',
       author : {
           name : 'Jhon',
           avatarUrl : 'http://placekitten.com/g/64/64'
       }
   }
 

 const element = <Comment author = {comment.author} text = {comment.text} date = {comment.date} />
  ReactDOM.render(
    element,
    document.getElementById('root')
  )
   </script>
```

对于组合组件要进行抽取出来，即使功能在小，要充分利用react的组件化思想,以上代码通过组件化思想进行抽取之后

```html
 <div id="root"></div>
   <script type='text/babel'>
   function formateDate(date){
        return date.toLocaleDateString();
   }

   function UserInfo(props){
       return (
           <div className = 'UserInfo'>
               <img calssName = 'avatar' src = {props.author.avatarUrl} alt = {props.author.name}/>
               <div className = 'UserInfo-name'>
                   {props.author.name}
               </div>
           </div>
       )
   }

   function CommentText(props){
       return (
           <div className = 'Comment-text'>
                   {props.text}
           </div>
       )
            
       
   }

   function CommentData (props){
       return (
            <div className = 'Comment-data'>
                   {formateDate(props.date)}
            </div>
       )
   }

   function Comment(props){
       console.log(props)
       return (
           <div className = "Comment">
               <UserInfo author =  {props.author} />
               <CommentText text = {props.text}/>
               <CommentData date = {props.date}/>   
           </div>
       );
   }

   const comment = {
       date : new Date(),
       text : 'Thank you for give me the chance',
       author : {
           name : 'Jhon',
           avatarUrl : 'http://placekitten.com/g/64/64'
       }
   }
 const element = <Comment author = {comment.author} text = {comment.text} date = {comment.date} />
  ReactDOM.render(
    element,
    document.getElementById('root')
  )
   </script>
```



```html
 <div id="root"></div>
    
   <script type='text/babel'>
     var WebSite = React.createClass({
         render : function(){
             return (
                <div>
                    <Name name = {this.props.name}/>
                    <Link link = {this.props.link}/>
                </div>
             );
         }
     })
   
   var Name = React.createClass({
       render : function(){
           return (
               <p>hello {this.props.name}</p>
           );
       }
   })

   var Link = React.createClass({
       render : function(){
           return (
               <a href = {this.props.link}> {this.props.link}</a>
           );
       }
   }
)

   ReactDOM.render(
       <WebSite name = 'Jhon' link = 'www.baidu.com'/>,
       document.getElementById('root')
   )
   </script>
```

### 4 组件的属性

我们声明一个组件，然后看下组件到底是什么

```html
<script type='text/babel'>
    class ListItem extends React.Component{
        render(){
            return (
                <li>{this.props.name}</li>
            )
        }
    }
      
      var element = <ListItem name = 'Jhon'/> ;
       console.log(element);
       ReactDOM.render(
           element,
           document.getElementById('root')
       )
   </script>
```

控制台输出如下

```
Object {$$typeof: Symbol(react.element), key: null, ref: null, props: Object, type: function…}
```

```html
 <div id="root"></div>
    
   <script type='text/babel'>
    class Clock extends React.Component{
        constructor(props) {
            super(props);
            console.log(this);
        }


        render(){
            return (
                <div>
                    <p>hello world</p>
                   
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

console.log(this)输出如下

```
Clock {props: Object, context: undefined, refs: Object, updater: Object}
```

console.log(`<Clock />`) 输出如下

```
Object {$$typeof: Symbol(react.element), key: null, ref: null, props: Object, type: function…}
```

刚开始学习React,总是有点模糊 props和state的区别，可以看出在打印this的时候，props就是存在的，而state需要定义之后才会显示

改变constructor函数，可以看出输出了state对象

**state必须被设置为一个对象，否则React编译会报错，大家可以自行尝试下**

```
constructor(props) {
            super(props);
            this.state = {color : 'red'}
            console.log(this);
            console.log(this.setState);
            console.log(this.props);
        }
```

```
Clock {props: Object, context: undefined, refs: Object, updater: Object, state: Object}
```

以上consturctor函数中，我们也打印了  console.log(this.setState);  其实在React源码中，setState是存在于 React.Component上的原型上的

```
ReactComponent.prototype.setState = function (partialState, callback) { sonmeCode } ;
```

### 5 组件的render函数

The `render()` method is required.

When called, it should examine `this.props` and `this.state` and return a single React element. This element can be either a representation of a native DOM component, such as `<div />`, or another composite component that you've defined yourself.

You can also return `null` or `false` to indicate that you don't want anything rendered. When returning `null` or `false`, `ReactDOM.findDOMNode(this)` will return `null`.

The `render()` function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not directly interact with the browser. If you need to interact with the browser, perform your work in `componentDidMount()`or the other lifecycle methods instead. Keeping `render()` pure makes components easier to think about.

需要注意的是:

`render()` will not be invoked if [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) returns false.

### 6 PropTypes

该属性用来规范组件的props属性的类型

```
React.PropTypes.array           // 陣列

React.PropTypes.bool.isRequired // Boolean 且必要。

React.PropTypes.func            // 函式

React.PropTypes.number          // 數字

React.PropTypes.object          // 物件

React.PropTypes.string          // 字串

React.PropTypes.node            // 任何類型的: numbers, strings, elements 或者任何這種類型的陣列

React.PropTypes.element         // React 元素

React.PropTypes.instanceOf(XXX) // 某種XXX類別的實體

React.PropTypes.oneOf(['foo', 'bar']) // 其中一個字串

React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]) // 其中一種格式類型

React.PropTypes.arrayOf(React.PropTypes.string)  // 某種類型的陣列(字串類型)

React.PropTypes.objectOf(React.PropTypes.string) // 具有某種屬性類型的物件(字串類型)

React.PropTypes.shape({                          // 是否符合指定格式的物件

  color: React.PropTypes.string,
  fontSize: React.PropTypes.number
});
React.PropTypes.any.isRequired  // 可以是任何格式，且必要。

```



