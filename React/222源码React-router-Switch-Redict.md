---
title:  React-router Switch Redict
date: 2017-05-18 12:36:00
categories: react
tags : router
comments : true 
updated : 
layout : 
---

### 1 Redict重定向组件

```jsx
<Redirect from="/old-match" to="/will-match"/>
```

### 2 Switch组件 

**用来匹配子路由中第一个匹配到的path路由组件,匹配到即停止往下进行路径的匹配**

对比一个例子

官网原demo代码

```jsx
<Switch>
  <Route path="/" exact component={Home}/>
  <Redirect from="/old-match" to="/will-match"/>
  <Route path="/will-match" component={WillMatch}/>
  <Route component={NoMatch}/>
</Switch>
```

```jsx
<Route>
  <div> 
    <Route path="/" exact component={Home}/>
    <Redirect from="/old-match" to="/will-match"/>
    <Route path="/will-match" component={WillMatch}/>
    <Route component={NoMatch}/>
  </div>
</Route>
```

### 3 Router组件 Route组件只能有一个根子元素,而Switch组件可以有多个并列的多子组件,

* Route组件作为Router的子组件时候,如果Route的path属性如果没有,那么该组件始终会匹配
* Route组件作为作为Switch组件的时候,如果前面有匹配到的路径,那么后面的Route的路径就不会再去匹配
* 可以总结来说Switch组件会按顺序进行子组件的path进行判断,匹配到了即进行渲染,终止后续Route组件的路径匹配 ;Router组件会按顺序进行子组件的path判断,会将所有的子Route的path路径进行匹配.

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

const NoMatchExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/old-match">Old Match, to be redirected</Link></li>
        <li><Link to="/will-match">Will Match</Link></li>
        <li><Link to="/will-not-match">Will Not Match</Link></li>
        <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
      </ul>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Redirect from="/old-match" to="/will-match"/>
        <Route path="/will-match" component={WillMatch}/>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
)

const Home = () => (
  <p>
    A <code>&lt;Switch></code> renders the
    first child <code>&lt;Route></code> that
    matches. A <code>&lt;Route></code> with
    no <code>path</code> always matches.
  </p>
)

const WillMatch = () => <h3>Matched!</h3>

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

export default NoMatchExample
```

