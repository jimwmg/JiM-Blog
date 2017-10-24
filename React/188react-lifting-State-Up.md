---
title:  react lifting State Up 
date: 2017-04-21 12:36:00
categories: react
tags : [LiftingState]
comments : true 
updated : 
layout : 
---

### 1 In React, sharing state is accomplished by moving it up to the closest common ancestor of the components that need it. This is called "lifting state up". 

props应该是只读的属性，如果我们要改变输出，可以通过state属性改变；

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../build/react.js"></script>
    <script src="../build/react-dom.js"></script>
    <script src="../build/browser.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    
   <script type='text/babel'>

   const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

class TemperatureInput extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

   </script>

  </body>
</html>

```

### 2 props中的children

```html
<body>
    <div id="root"></div>
    
   <script type='text/babel'>
   function FacnyBorder(props){
       console.log(props);
       console.log(props.children);
       return (
           <div className = {'FancyBorder FancyBorder-'+ props.color}>
               {props.children}
           </div>
       )
   }

   function WelecomeDialog(props){
       console.log(props)
        return (
            <FacnyBorder color = 'blue'>
                <h1 className = 'Dialog-title'>welcome</h1>
                <p> className = 'Dialog-message'>thank you for visiting our website</p>
            </FacnyBorder>
        )
   }

   ReactDOM.render(
       <WelecomeDialog />,
       document.getElementById('root')
   )
   </script>
```

WelcomeDialog组件输出的props如下

```
Object {}
key:(...)
ref:(...)
get key:function ()
get ref:function ()
__proto__:Object
```

FacnyBorder输出的props如下

```
Object {color: "blue", children: Array(2)}
children:Array(2)
color:"blue"
key:(...)
ref:(...)
get key:function ()
get ref:function ()
__proto__:Object
```

FacnyBorder输出的 props.children 如下

```
[Object, Object]
0:Object
1:Object
length:2
```

其中 数组中的第一项展开内容如下

```
$$typeof:Symbol(react.element)
key:null
props:Object
	children:"welcome"
	className:"Dialog-title"
	key:(...)
	ref:(...)
	get key:function ()
	get ref:function ()
	__proto__:Object
ref:null
type:"h1"
_owner:ReactCompositeComponentWrapper
_store:Object
_self:null
_source:null
```

其中数组第二项展开如下

```
$$typeof:Symbol(react.element)
key:null
props:Object
	children:"thank you for visiting our website"
	className:"Dialog-message"
	key:(...)
	ref:(...)
	get key:function ()
	get ref:function ()
	__proto__:Object
ref:null
type:"p"
_owner:ReactCompositeComponentWrapper
_store:Object
_self:null
_source:null"
```

同样在React中 

```
React elements like <Contacts /> and <Chat /> are just objects, so you can pass them as props like any other data.
```

还是上面的例子，我们尝试着打印出

```
 console.log(<WelecomeDialog color = 'red'/>)
```

输出结果如下

```
Object {$$typeof: Symbol(react.element), key: null, ref: null, props: Object, type: function…}
$$typeof:Symbol(react.element)
key:null
props:Object
ref:null
type:function WelecomeDialog(props)
_owner:null
_store:Object
_self:null
_source:null
```

**submit**

根据以上的输出我们可以得到结论：

* 组件上通过属性添加的数据，会绑定在props对象中
* 组件上通过子节点，比如文本节点或者元素节点添加在组件上的，会绑定到props.children对象上

```
<WelecomeDialog>hello</WelecomeDialog> 比如中的hello文本节点
```

```
<FacnyBorder color = 'blue'>
  <h1 className = 'Dialog-title'>welcome</h1>
  <p className = 'Dialog-message'>thank you for visiting our website</p>
</FacnyBorder>
中的元素节点 h1和p 
```

* 组件以标签形式显示的时候，其实也就是一个对象
* 如果想要向组件中传递参数，可以通过属性或者子节点进行传递，传递的数据可以在组件定义中的props和props.children中获取到。
* React区分标签是一个**组件**还是一个**HTML标签**是根据标签的首字母大小写来区分的

```
<div />  这个就是代表HTML标签
<Contact /> 这个就代表组件
```

* React中无论是组件还是标签，都必须被正确的闭合 每一个标签或者组件的   /   必不可少 ;

### 3 除了通过children传递data数据，我们其实可以利用props传递组件对象

```html
 <div id="root"></div>
    
   <script type='text/babel'>
   function Contacts(){
       return (
           <div className = 'contacts'>
               this is contacts
           </div>
       )
   }

   function Chat(){
       return (
           <div className = 'chat' >this is chat </div>
            
       )
   }

   function SplitPane(props){
       console.log(props)
       return(
        <div className = 'SplitPane'>
            <div className = 'SplitPane-left'>
                {props.left}
            </div>

            <div className = 'SplitPane-right'>
                {props.right}
            </div>
        </div>
       )
   }

   function App(props){
       return (
        <SplitPane left = {<Contacts/>} right = {<Chat/>} />
       )
   }

   ReactDOM.render(
       <App />,
       document.getElementById('root')
   )
   </script>
```

通过以上用法，我们就可以传递多个不一样的组件，也就是可以对组件进行不一样的拼接。