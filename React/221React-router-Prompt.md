---
title:  React-router Prompt
date: 2017-05-17 12:36:00
categories: react
tags : router
comments : true 
updated : 
layout : 
---

## 1 看下官方解释

弹窗出来之后点击确定返回true,点击取消返回false.

Used to prompt the user before navigating away from a page. When your application enters a state that should prevent the user from navigating away (like a form is half-filled out), render a `<Prompt>`.

Prompt组件,当我们想往其他url地址跳转的时候,如果when的属性值是true,则会执行message

```
import { Prompt } from 'react-router'

<Prompt
  when={formIsHalfFilledOut}
  message="Are you sure you want to leave?"
/>
```

### [when: bool](https://reacttraining.com/core/api/Prompt/when-bool)

Instead of conditionally rendering a `<Prompt>` behind a guard, you can always render it but pass `when={true}` or `when={false}` to prevent or allow navigation accordingly.

粗暴点来理解,

* 如果我们传入一个true,那么则会渲染Prompt,接着执行message函数,渲染该函数的返回值,会询问用户是否确定跳转.
* 如果传入一个false,那么就会直接跳转到我们点击的url链接,

### [message: string](https://reacttraining.com/core/api/Prompt/message-string)

The message to prompt the user with when they try to navigate away.

```
<Prompt message="Are you sure you want to leave?"/>

```

### [message: func](https://reacttraining.com/core/api/Prompt/message-func)

Will be called with the next `location` and `action` the user is attempting to navigate to. 

* Return a string to show a prompt to the user   此时如果用户点击确定,则返回true,允许跳转
* **or `true` to allow the transition.**
* 传入message函数的变量是**下一个location**对象

```
<Prompt message={location => (
  `Are you sure you want to go to ${location.pathname}?`
)}/>
```

```
<Prompt
  when={isBlocking}
  message={location => (
  true
  )}
/>
```

## 2 官方demo改动理解

```
 <Prompt
          when={false}
          message={location => {

            console.log({isBlocking})
            return  `Are you sure you want to go to ${location.pathname}`
          }}
        />
```

```
 <Prompt
          when={true}
          message={location => {

            console.log({isBlocking})
            return  `Are you sure you want to go to ${location.pathname}`
          }}
        />
```

```
  <Prompt
          when={true}
          message='are you sure ? dearling'
        />
```

## 3 官方demo如下

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Prompt
} from 'react-router-dom'

const PreventingTransitionsExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Form</Link></li>
        <li><Link to="/one">One</Link></li>
        <li><Link to="/two">Two</Link></li>
      </ul>
      <Route path="/" exact component={Form}/>
      <Route path="/one" render={() => <h3>One</h3>}/>
      <Route path="/two" render={() => <h3>Two</h3>}/>
    </div>
  </Router>
)

class Form extends React.Component {
  state = {
    isBlocking: false
  }

  render() {
    const { isBlocking } = this.state  //对象的结构赋值
//等价于 const isBlocking = this.state.isBlocking
    return (
      <form
        onSubmit={event => {
            console.log('button is pressed');
            
          event.preventDefault()
          event.target.reset()
          this.setState({
            isBlocking: false
          })
        }}
      >
        <Prompt
          when={isBlocking}
          message={location => (
            `Are you sure you want to go to ${location.pathname}`
          )}
        />

        <p>
          Blocking? {isBlocking ? 'Yes, click a link or the back button' : 'Nope'}
        </p>

        <p>
          <input
            size="50"
            placeholder="type something to block transitions"
            onChange={event => {
              this.setState({
                isBlocking: event.target.value.length > 0
              })
            }}
          />
        </p>

        <p>
          <button>Submit to stop blocking</button>
        </p>
      </form>
    )
  }
}

export default PreventingTransitionsExample
```

