---
title:React中的this解惑
---

### 1.ES6中的this

```javascript
let onClick = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    onClick = this.handleClick;
  }
}
const clock = new Clock();
clock.render('new对象调用')//Clock对象

onClick();//undefined
```

如何绑定this为Clock实例对象?

以下三种方式 onClick 函数的调用都可以指向 Clock 实例对象

第一种方式：赋值为箭头函数

```javascript
let onClick = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    onClick = () => this.handleClick();
  }
}
const clock = new Clock();
clock.render('new对象调用')//Clock对象

onClick();//Clock实例对象
```

第二种方式：手动绑定this

```javascript
let onClick = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    onClick = this.handleClick.bind(this);
  }
}
const clock = new Clock();
clock.render('new对象调用')//Clock对象

onClick();///Clock对象
```

第三种方式：内部以class 公有字段形式展现

https://babeljs.io/docs/en/babel-plugin-proposal-class-properties

https://2ality.com/2019/07/public-class-fields.html

```javascript
let onClick = () => {}
class Clock {
  //注意这里的声明方式，这种声明直接赋值给实例对象，注意和以上两种声明方式的区别
  handleClick = (name = 'there') =>  {  
    console.log(name,this)
  }
  render(){
    onClick = this.handleClick;
  }
}
const clock = new Clock();
clock.render('new对象调用')//Clock对象

onClick();///Clock对象
```

可以将 onClick 这个函数对比为下面的 点击触发

### 2.React中的组件声明方式

jsx的语法其实最终会被解析为普通的js

比如这样的 jsx

```javascript
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}
```

其实等价于

```javascript
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}
```

### 3.综上所述，React事件系统中事件绑定this的使用方式对应如下

以下四个简单的案例分别对应下面四种情况，按顺序如下

```jsx
import React from 'react';
//class组件
class Clock extends React.Component{
  constructor(props) {
  }

  handleClick(){
      console.log(this)
  }
  handleClick2 = () => {
    console.log(this)
  }

  render(){
      console.log('render',this);
      return (
          <div>
             <p onClick={this.handleClick}>handleClick</p> 
              {/* undefined */}
              <p onClick={() => this.handleClick()}>handleClick</p>
               {/* Clock实力对象 */}
              <p onClick={this.handleClick.bind(this)}>handleClick.bind</p>
               {/* Clock实力对象 */}
              <p onClick={this.handleClick2}>handleClick2</p>
               {/* Clock实力对象 */}
          </div>
      );
  }
}
export default Clock
```

