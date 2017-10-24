---
title:  React-router 中的Route组件详解
date: 2017-05-16 12:36:00
categories: react
tags : router
comments : true 
updated : 
layout : 
---

### 1 Route组件

The Route component is perhaps the most important component in React Router to understand and learn to use well. Its most basic responsibility is to render some UI when a [location](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/location.md) matches the route's `path`.

Consider the following code:

```
import { BrowserRouter as Router, Route } from 'react-router-dom'

<Router>
  <div>
    <Route exact path="/" component={Home}/>
    <Route path="/news" component={NewsFeed}/>
  </div>
</Router>
```

If the location of the app is `/` then the UI hierarchy will be something like:

```
<div>
  <Home/>
  <!-- react-empty: 2 -->
</div>
```

And if the location of the app is `/news` then the UI hierarchy will be:

```
<div>
  <!-- react-empty: 1 -->
  <NewsFeed/>
</div>
```

The "react-empty" comments are just implementation details of React's `null` rendering. But for our purposes, it is instructive. A Route is always technically "rendered" even though its rendering `null`. As soon as the app location matches the route's path, your component will be rendered.

####Route render methods

There are 3 ways to render something with a `<Route>`:

* `<Route component />`
* `<Route render />`
* `<Route children />`

Each is useful in different circumstances. You should use only one of these props on a given `<Route>`. See their explanations below to understand why you have 3 options. Most of the time you'll use `component`.

#### Route props

All three [render methods](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#route-render-methods) will be passed the same three route props

- [match](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/match.md)
- [location](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/location.md)
- [history](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/history.md)

#### component

A React component to render only when the location matches. It will be rendered with [route props](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#route-props).

```
<Route path="/user/:username" component={User}/>

const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}
```

When you use `component` (instead of `render` or `children`, below) the router uses [`React.createElement`](https://facebook.github.io/react/docs/react-api.html#createelement) to create a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) from the given component. That means if you provide an inline function to the `component` attribute, you would create a new component every render. This results in the existing component unmounting and the new component mounting instead of just updating the existing component. When using an inline function for inline rendering, use the `render` or the `children` prop (below).

#### render: func

This allows for convenient inline rendering and wrapping without the undesired remounting explained above.

Instead of having a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) created for you using the [`component`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#component-func) prop, you can pass in a function to be called when the location matches. The `render` prop receives all the same [route props](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#route-props) as the `component` render prop.

当路径匹配到了的时候,就会执行render函数

```
// convenient inline rendering
<Route path="/home" render={() => <div>Home</div>}/>

// wrapping/composing
const FadingRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <FadeIn>
      <Component {...props}/>
    </FadeIn>
  )}/>
)

<FadingRoute path="/cool" component={Something}/>
```

**Warning:** `<Route component>` takes precendence over `<Route render>` so don't use both in the same `<Route>`.

#### children: func

Sometimes you need to render whether the path matches the location or not. In these cases, you can use the function `children` prop. It works exactly like `render` except that it gets called whether there is a match or not.

无论path是否匹配到了路径,都会渲染children

The `children` render prop receives all the same [route props](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#route-props) as the `component` and `render` methods, except when a route fails to match the URL, then `match` is `null`. This allows you to dynamically adjust your UI based on whether or not the route matches. Here we're adding an `active` class if the route matches

```
<ul>
  <ListItemLink to="/somewhere"/>
  <ListItemLink to="/somewhere-else"/>
</ul>

const ListItemLink = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest}/>
    </li>
  )}/>
)
```

This could also be useful for animations:

```
<Route children={({ match, ...rest }) => (
  {/* Animate will always render, so you can use lifecycles
      to animate its child in and out */}
  <Animate>
    {match && <Something {...rest}/>}
  </Animate>
)}/>
```

**Warning:** Both `<Route component>` and `<Route render>` take precendence over `<Route children>` so don't use more than one in the same `<Route>`.

#### path: string

Any valid URL path that [`path-to-regexp`](https://www.npmjs.com/package/path-to-regexp) understands.

```
<Route path="/users/:id" component={User}/>
```

**Routes without a `path` *always* match.**

如果一个Route组件没有path属性,那么这个组件将总会被渲染.

**Route组件的path路径如果包含  :  变量,那么匹配到的所有的符合变量路径都会被渲染**,如果想要保证唯一性,可以通过使用Switch组件进行匹配到一个则不进行往下匹配选择性渲染.

#### exact: bool

When `true`, will only match if the path matches the `location.pathname` *exactly*.

```
<Route exact path="/one" component={About}/>
```

| path   | location.pathname | exact   | matches? |
| ------ | ----------------- | ------- | -------- |
| `/one` | `/one/two`        | `true`  | no       |
| `/one` | `/one/two`        | `false` | yes      |

#### strict: bool

When `true`, a `path` that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the `location.pathname`.

```
<Route strict path="/one/" component={About}/>
```

| path    | location.pathname | matches? |
| ------- | ----------------- | -------- |
| `/one/` | `/one`            | no       |
| `/one/` | `/one/`           | yes      |
| `/one/` | `/one/two`        | yes      |

**Warning:** `strict` can be used to enforce that a `location.pathname` has no trailing slash, but in order to do this both `strict`and `exact` must be `true`.

```
<Route exact strict path="/one" component={About}/>
```

| path   | location.pathname | matches? |
| ------ | ----------------- | -------- |
| `/one` | `/one`            | yes      |
| `/one` | `/one/`           | no       |
| `/one` | `/one/two`        | no       |

### 2 Demo案例

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
const Repo = ()=>(<div>this is Repo</div>)
const Category = (props)=>{
  console.log(props);
  return (<div>this is category</div>)
}
const MyTest =()=>(
  <Router>
    <div>
      <ul>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='./repo'>Repo</Link>
        </li>
      
        <li>
          <Link to='./category'>Category</Link>
        </li>
      </ul>
      <Route exact path='/about' render={(props)=>{console.log(props);return (<div>this is aabout</div>)
      }}></Route>
      <Route exact path='/repo' component={Repo}> </Route>
      <Route exact path='/category' component={Category}> </Route>
    
      <Route children={(props)=>{console.log(props);return (<div>this is a component build througth children</div>)
      }}></Route>
    
    </div>
  
  
  </Router>
)
export default MyTest
```

Recursive递归 : match对象的使用,path就是Route组件的path值,params对象存放的是 :id 的key/value对应的值,value值是字符串,url是当前路径的url值.

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
//这个时候的UI视图就是根据数据来呈现的
const PEEPS = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]

const find = (id) => PEEPS.find( p=>p.id == id )


const RecursiveExample = ()=>(

  <Router>
    <Person match={{params:{id:0},url:''}}></Person>
  </Router>
)

const Person = ({match})=>{
  console.log('match',match);
  
  const person = find(match.params.id)
  console.log(person);
  
  return (
    <div>
      <h3>{person.name}'s friends</h3>
      <ul>
        {person.friends.map(id=>(
          <li key={id}>
            <Link to={`${match.url}/${id}`}>
              {find(id).name}
            </Link>
          </li>
        ))}
  
      </ul>
      <Route path={`${match.url}/:id`} component={Person}></Route>
    </div>
  )
  
}

export default RecursiveExample
```



### 3 Route组件会将history  location   match这三个对象传递给component    render    以及children中的props 

- `<Route component />`
- `<Route render />`
- `<Route children />`

这三种方式创建的组件的props属性中.

### 4 Routee组件作为路由根组件需要注意两点

* Router组件只允许有一个子元素,不允许有并行的子元素
* Router组件可以通过history对象进行对url地址的记录.