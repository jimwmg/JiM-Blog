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
  <switch>
    <Route exact path="/" component={Home}/>
    <Route path="/news" component={NewsFeed}/>
  </switch>
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
//最初的match就是一下这个返回的对象；
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

switch.js

```javascript
var Switch = function (_React$Component) {
  _inherits(Switch, _React$Component);

  function Switch() {
    _classCallCheck(this, Switch);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Switch.prototype.render = function render() {
    var route = this.context.router.route;
    var children = this.props.children;
//如果Switch上有location对象，则不会从Router组件中取location对象；
    var location = this.props.location || route.location;
//这个match 变量是否存在就是决定forEach返回那一个子组件；
    var match = void 0,
        child = void 0;
    //forEach接受每一个children作为第一个参数，第二个参数接受一个函数，函数中的参数是每一个children对应的ReactElement对象
    _react2.default.Children.forEach(children, function (element) {
      if (!_react2.default.isValidElement(element)) return;

      var _element$props = element.props,
          //这个就是Route  作为Switch组件的Children的时候，Route组件上的path属性；
          pathProp = _element$props.path,
          exact = _element$props.exact,
          strict = _element$props.strict,
          sensitive = _element$props.sensitive,
          //这个是Redict  作为Switch组件的Children的时候，Redict组件上的from属性
          from = _element$props.from;

      var path = pathProp || from;
		//这里进行Route组件上的path属性是否和location.pathname匹配上的判断；
      if (match == null) {
        //将匹配到的ReactELement给到child,然后 进行clone返回匹配的ReactElement对象；作为Switch组件要渲染的真正组件对象；
        child = element;
        //这里，第一个匹配的时候，match = void 0 ;
        //1  如果path不存在，也就是Route组件没有path属性，那么match = route.match；这个就是Route中的match；其他的Route path不在进行匹配；下面返回cloneElement
        //2 如果path存在，也就是Route组件有path属性，那么 match =  (0, _matchPath2.default)(location.pathname, { path: path, exact: exact, strict: strict, sensitive: sensitive })
        //但是在mathPath函数中，如果匹配不到，返回null ，forEach继续执行，接着寻找对应的child;匹配到了才返回match对象；
        match = path ? (0, _matchPath2.default)(location.pathname, { path: path, exact: exact, strict: strict, sensitive: sensitive }) : route.match;
      }
    });

    return match ? _react2.default.cloneElement(child, { location: location, computedMatch: match }) : null;
  };

  return Switch;
}(_react2.default.Component);

Switch.contextTypes = {
  router: _propTypes2.default.shape({
    route: _propTypes2.default.object.isRequired
  }).isRequired
};
Switch.propTypes = {
  children: _propTypes2.default.node,
  location: _propTypes2.default.object
};
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
  //{path url params isExact}
}

componentWillMount() {
  const { component, render, children } = this.props
}

componentWillReceiveProps(nextProps, nextContext) {
  this.setState({
    //这里如果一个组件中，Route的path值为 '/'，那么对于任何路径，该Route对应的组件都会被渲染；
   //因为location.pathname哈Route组件的path匹配的结果match必然存在，所以Route组件上对应的组件也一定会渲染；
    /*
class Home extends React.Component {
    render() {
        let path = this.props.match.path;
        if (path === "/") path= "";
        return (
            <div>
                <Route path={`${path}/approval`} component={Approval} />
                <Route path={`${path}/billInput`} component={billInput} />
                <Route path={`${path}/main`} component={Main} />
                <Route path={`${path}/mine`} component={Mine} />
                <Route path={`${path}/`} component={HomeNav}/>
            </div>
        )
    }
}
    */
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
//
  return (
    //以下，将props对象传入ReactElement创建函数，这就是为什么所有的ReactElement对象中都有history,location,match对象的源代码；
    //这里如果一个组件中，Route的path值为 '/'，那么对于任何路径，该Route对应的组件都会被渲染；
   //因为location.pathname Route组件的path匹配的结果match必然存在，所以Route组件上对应的组件也一定会渲染；
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

