---
title:React中的this解惑
---

### 1.ES6中的this

```javascript
let outerFunc = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    outerFunc = this.handleClick;
  }
}
console.dir(Clock);
const clock = new Clock();
clock.render('new对象调用')//Clock对象

outerFunc();//undefined
```

如何绑定this为Clock实例对象?

第一种方式：赋值为箭头函数

```javascript
let outerFunc = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    outerFunc = () => this.handleClick();
  }
}
console.dir(Clock);
const clock = new Clock();
clock.render('new对象调用')//Clock对象

outerFunc();//Clock实例对象
```

第二种方式：手动绑定this

```javascript
let outerFunc = () => {}
class Clock {
  handleClick(name = 'there') {
    console.log(name,this)
  }
  render(){
    outerFunc = this.handleClick.bind(this);
  }
}
console.dir(Clock);
const clock = new Clock();
clock.render('new对象调用')//Clock对象

outerFunc();
```

第三种方式：使用class

```javascript
let outerFunc = () => {}
class Clock {
  //注意这里的声明方式，这种声明直接赋值给实例对象，注意和以上两种声明方式的区别
  handleClick = (name = 'there') =>  {
    console.log(name,this)
  }
  render(){
    outerFunc = this.handleClick;
  }
}
console.dir(Clock);
const clock = new Clock();
clock.render('new对象调用')//Clock对象

outerFunc();
```

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

```javascript
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
              <p onClick={() => this.handleClick()}>handleClick</p>
              <p onClick={this.handleClick2}>handleClick2</p>
          </div>
      );
  }
}
export default Clock
```

