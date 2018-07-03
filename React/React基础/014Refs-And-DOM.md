---
title: Refs And DOM 
date: 2017-04-24 12:36:00
categories: react
tags : refs
comments : true 
updated : 
layout : 
---

### 1  ref 属性是一个函数的时候 

 当一个组件被加载完成之后，ref指向的函数会被执行。 

React supports a special attribute that you can attach to any component. The `ref` attribute takes a callback function, and the callback will be executed immediately after the component is mounted or unmounted.

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts.

When the `ref` attribute is used on an HTML element, the `ref` callback receives the underlying DOM element as its argument

```html
<div id="root"></div>
    <script type='text/babel'>
    
   class CustomTextInput extends React.Component{
    constructor(props){
        super(props);
        this.focus = this.focus.bind(this);
    }    

    focus(){
        this.textInput.focus();
        console.log(this.textInput);
        console.log(this);
    }

    render(){
        return(
            <div>
                <input type="text" ref = {(input)=>this.textInput = input}/>
                <input type="button"  value="Focus on this" onClick = {this.focus}/>
            </div>
        );
    }
     
   }

   ReactDOM.render(
       <CustomTextInput />,
       document.getElementById('root')
   )
    </script> 
```

When the `ref` attribute is used on a custom component declared as a class, the `ref`callback receives the mounted instance of the component as its argument.

```jsx
 <script type='text/babel'>
    class App extends React.Component{
      constructor(props){
        super(props)
      }
      render(){
        return(
         <Counter ref={(el)=>{
           console.log(el);
           el.sayHello();
           }}></Counter>
          )
      }
    }
    
    class Counter extends React.Component{
      constructor(props){
        super(props)
      }
//组件加载完毕之后，可以获取到ref指向的react组件；
      componentDidMount(){
        console.log('mounted');  
      }

      sayHello(){
        console.log('hello JiM ');
        
      }
      render(){
        return(
          <div>
            Counter
          </div>
        )
      }
    }

    console.log(<App />);
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    )       
   </script>
```



### 2  当ref属性是一个字符串的时候

注意：官方文档已经不建议使用字符串作用ref属性的值

[官方文档]: http://facebook.github.io/react/docs/refs-and-the-dom.html

```html
 <div id="root"></div>
    <script type='text/babel'>
    
   class CustomTextInput extends React.Component{
    constructor(props){
        super(props);
        this.focus = this.focus.bind(this);
    }    

    focus(){
       console.log(this);
       console.log(this.refs);//object {myFocus:input}
       this.refs.myFocus.focus();
       
    }

    render(){
        return(
            <div>
                <input type="text" ref = 'myFocus' />
                <input type="button"  value="Focus on this" onClick = {this.focus}/>
            </div>
        );
    }
     
   }

   ReactDOM.render(
       <CustomTextInput />,
       document.getElementById('root')
   )
    </script>
```

如果 `ref` 是设置在原生 HTML 元素上，它拿到的就是 DOM 元素，如果设置在自定义组件上，它拿到的就是组件实例，这时候就需要通过 `findDOMNode` 来拿到组件的 DOM 元素。

- 你可以使用 ref 到的组件定义的任何公共方法，比如 `this.refs.myTypeahead.reset()`
- Refs 是访问到组件内部 DOM 节点唯一**可靠**的方法
- Refs 会自动销毁对子组件的引用（当子组件删除时）

ref属性可以实现父组件访问子组件这样的通信流

### 3 Uncontrolled Components 

In most cases, we recommend using [controlled components](http://facebook.github.io/react/docs/forms.html) to implement forms. In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself.

To write an uncontrolled component, instead of writing an event handler for every state update, you can [use a ref](http://facebook.github.io/react/docs/refs-and-the-dom.html) to get form values from the DOM.

```html
<div id="root"></div>
    <script type='text/babel'>
    class NameForm extends React.Component{
        constructor(props){
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(e){
            console.log(this.input);
            
            console.log(this.input.value);
            e.preventDefault();
        }

        render(){
            return(
                <form onSubmit = {this.handleSubmit}>
                    <input type="text"  ref = {(input)=>{console.log(input);console.log(this);
                    this.input = input ;
                    }}/>

                    <input type="submit" value="click to submit"  ref = {(input)=>{console.log(input);this.input = input ;
                    }}/>
                </form>
            );
        }
    }

    ReactDOM.render(
        <NameForm />,
        document.getElementById("root")
    )
       
    
    </script>
```

以上代码案例可以解释箭头函数中的内部this指向

- 箭头函数内部的this指向class类
- this.input = input  决定 当前类的 input指向哪个  input标签，后面的会覆盖掉前面的

### 4 React 中的 value属性值   defaultValue 

In the React rendering lifecycle, the `value` attribute on form elements will override the value in the DOM. With an uncontrolled component, you often want React to specify the initial value, but leave subsequent updates uncontrolled. To handle this case, you can specify a `defaultValue` attribute instead of `value`.

如果我们添加value = 'this can not be changed'给input标签，那么该标签是无法重新写入内容的

```html
<form onSubmit = {this.handleSubmit}>
                    <input type="text" value = 'this can not be changed' ref = {(input)=>{console.log(input);console.log(this);
                    this.input = input ;
                    }}/>

                    <input type="submit" value="click to submit"  ref = {(input)=>{console.log(input);this.input = input ;
                    }}/>
                </form>
```

改成defaultValue可以重新写入  defaultValue = 'this can not be changed'

除了input之外  Likewise, `<input type="checkbox">` and `<input type="radio">` support `defaultChecked`, and `<select>` and `<textarea>` supports `defaultValue`.也是一样的道理