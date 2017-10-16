---
title:reactRouter源码解析
date: 2017-10-13 12:36:00
categories: router
tags : react
comments : true 
updated : 
layout : 
---

### 1 基本知识储备

[React中的context](https://reactjs.org/docs/context.html)

[React-router源码](https://github.com/jimwmg/react-router)

[babel转译工具，就问你贴心不](http://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=MYGwhgzhAEBKD2BXALgUwE4G8BQ0LLDWgF5oAiAC1SrOwF8g&debug=false&circleciRepo=&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&targets=&version=6.26.0)

### 2 Router和Route过的组件属性props上为何会多了location, history,match这些属性值？

如果您接触过React肯定知道，在react-redux中，凡是经过connect过的组件，该组件上就会有通过mapStateToProps，mapDispatchToProps等函数(这些函数返回的对象将被添加到组件的props属性上)传递到组件上的对应的一些属性值；

同样，在您读完[React中的context](https://reactjs.org/docs/context.html)之后，肯定对通过context传递一些属性有所了解，那么在react-router中是如何实现奖这些属性location, history,match添加到组件上的呢？

```jsx
<Router history={history}>
  <div>
    <Route exact path="/" component={Home}/>
    <Route path="/news" component={NewsFeed}/>
  </div>
</Router>
```

Router.js

```javascript
import warning from 'warning'
import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  }

static contextTypes = {
  router: PropTypes.object
}

static childContextTypes = {
  router: PropTypes.object.isRequired
}
//看下React官方的解释,上下两段代码的作用；
//By adding childContextTypes and getChildContext to MessageList (the context provider), React passes the information down automatically and any component in the subtree (in this case, Button) can access it by defining contextTypes.
//If contextTypes is not defined, then context will be an empty object.
getChildContext() {
  //这是要传递给子组件的对象
  return {
    router: {
      ...this.context.router,
      history: this.props.history,
      route: {
      location: this.props.history.location,
      match: this.state.match
    }
  }
}
}

state = {
  match: this.computeMatch(this.props.history.location.pathname)
}

computeMatch(pathname) {
  return {
    path: '/',
    url: '/',
    params: {},
    isExact: pathname === '/'
  }
}

componentWillMount() {
  const { children, history } = this.props

  invariant(
    children == null || React.Children.count(children) === 1,
    'A <Router> may have only one child element'
  )

  // Do this here so we can setState when a <Redirect> changes the
  // location in componentWillMount. This happens e.g. when doing
  // server rendering using a <StaticRouter>.
  this.unlisten = history.listen(() => {
    this.setState({
      match: this.computeMatch(history.location.pathname)
    })
  })
}

componentWillReceiveProps(nextProps) {
  warning(
    this.props.history === nextProps.history,
    'You cannot change <Router history>'
  )
}

componentWillUnmount() {
  this.unlisten()
}

render() {
  const { children } = this.props
  return children ? React.Children.only(children) : null
}
}

export default Router
```

Route.js

```javascript
import warning from 'warning'
import React from 'react'
import PropTypes from 'prop-types'
import matchPath from './matchPath'

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  static propTypes = {
    computedMatch: PropTypes.object, // private, from <Switch>
    path: PropTypes.string,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    location: PropTypes.object
  }
//声明之后，便可以通过this.context访问通过祖先组件传递下来的context；
static contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  })
}

static childContextTypes = {
  router: PropTypes.object.isRequired
}
//这里解释了为何Route可以嵌套，并且嵌套传递history,match,location,和Router.js中的作用一样；
getChildContext() {
  return {
    router: {
      ...this.context.router,
      route: {
      location: this.props.location || this.context.router.route.location,
      match: this.state.match
    }
  }
}
}

state = {
  match: this.computeMatch(this.props, this.context.router)
}
//当一个Route组件上有path属性的时候，computeMatch函数会返回matchPath(pathname, { path, strict, exact })的结果；
computeMatch({ computedMatch, location, path, strict, exact }, { route }) {
  if (computedMatch)
    return computedMatch // <Switch> already computed the match for us

  const pathname = (location || route.location).pathname

  return path ? matchPath(pathname, { path, strict, exact }) : route.match
}

componentWillMount() {
  const { component, render, children } = this.props

  warning(
    !(component && render),
    'You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored'   
  )

  warning(
    !(component && children),
    'You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored'   
  )

  warning(
    !(render && children),
    'You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored'    
  )
}

componentWillReceiveProps(nextProps, nextContext) {
  warning(
    !(nextProps.location && !this.props.location),
    '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
  )

  warning(
    !(!nextProps.location && this.props.location),
    '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
  )

  this.setState({
    match: this.computeMatch(nextProps, nextContext.router)
  })
}

render() {
  const { match } = this.state
  const { children, component, render } = this.props
  //这里接受来自context传递过来的history,route,而在Router.js中，我们可以看到，route属性上有location对象，match对象；所以去看下面的matchPath.js
  const { history, route, staticContext } = this.context.router
  const location = this.props.location || route.location
  //这里将match,location,history,staticContext写为props对象
  const props = { match, location, history, staticContext }

  return (
   //以下，将props对象传入ReactElement创建函数，这就是为什么所有的ReactElement对象中都有history,location,match对象的源代码；
    component ? ( // component prop gets first priority, only called if there's a match
      match ? React.createElement(component, props) : null
    ) : render ? ( // render prop is next, only called if there's a match
      match ? render(props) : null
    ) : children ? ( // children come last, always called
      typeof children === 'function' ? (
        children(props)
      ) : !Array.isArray(children) || children.length ? ( // Preact defaults to empty children array
        React.Children.only(children)
      ) : (
        null
      )
    ) : (
      null
    )
  )
}
}

export default Route
```

### 3 当通过history对象改变url地址栏的链接之后，为什么会渲染对应的组件？

matchPath.js

```javascript
import pathToRegexp from 'path-to-regexp'

const patternCache = {}
const cacheLimit = 10000
let cacheCount = 0

const compilePath = (pattern, options) => {
  const cacheKey = `${options.end}${options.strict}`
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern])
    return cache[pattern]

  const keys = []
  const re = pathToRegexp(pattern, keys, options)
  const compiledPattern = { re, keys }

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern
    cacheCount++
  }

  return compiledPattern
}

/**
 * Public API for matching a URL pathname to a path pattern.
 */
//通过这个函数可以看到，如果当前浏览器地址栏的pathname和Route组件的path属性值可以匹配上，那么下面函数中的match对象就存在，如果匹配不上则返回null;注意，此时如果匹配不上返回null，看下Route.js中的render,如果match匹配不上，那么该Route组件返回的值就是null,此时ReactElement中则不会渲染；如果匹配上了，则返回对应的ReactElement元素，执行渲染；
const matchPath = (pathname, options = {}) => {
  if (typeof options === 'string')
    options = { path: options }

  const { path = '/', exact = false, strict = false } = options
  const { re, keys } = compilePath(path, { end: exact, strict })
  const match = re.exec(pathname)

  if (!match)
    return null

  const [ url, ...values ] = match
  const isExact = pathname === url

  if (exact && !isExact)
    return null

  return {
    path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index]
      return memo
    }, {})
  }
}

export default matchPath
```

