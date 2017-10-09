---
title:  React-router
date: 2017-05-16 12:36:00
categories: react
tags : router
comments : true 
updated : 
layout : 
---

以下是我结合官方文档的学习笔记,文末有官方文档的链接.

### 1 react-router中一个属性`exact` 的使用,默认是true,详见API文档解析

```javascript
const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)
```

如上,当 URL is `/about` `/`  `/about`两者都会render 

如下所示,当url是 `/repo` 的时候  Repo 和RepoTest两者也是都会渲染.当然也可以通过设置exact属性进行精确匹配.

```
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
          <Link to='./repo/test'>RepoTest</Link>
        </li>
      </ul>
      <Route exact path='/' render={()=>(<div>Welcome</div>)}></Route>
      <Route path='/repo' component={Repo}> </Route>
      <Route path='/repo/test' component={RepoTest}></Route>
    
    </div>
  </Router>
```



### 2 match对象

其中path属性值就是Route组件的path属性值,url是根据地址栏动态解析的,params是解析URL地址的时候params对象

match对象是实时生成的,当url地址不同 的时候,match对象也会跟着变化,大家可以多点击几次,看下math对象所有的属性是什么值.

当url地址栏匹配到Route对应的路径的时候,组件中的match对象才存在,否则为null 

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const CustomLinkExample = () => (
  <Router>
    <div>
      <OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home"/>
      <OldSchoolMenuLink to="/about" label="About"/>
      <hr/>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
    </div>
  </Router>
)

const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => {
    console.log(match);//对于官网的demo做了如下改动,当url路径为 / 的时候,第一个OldSchoolMenuLink组件返回的Route对象children函数中match对象存在,而第二个OldSchoolMenuLink组件返回的Route组件中的children函数中却没有match对象,为null 
    return (<div className={match ? 'active' : ''}>
      {match ? '> ' : ''}<Link to={to}>{label}</Link>
    </div>)
  }
    
  }/>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

export default CustomLinkExample
```



A `match` object contains information about how a `<Route path>` matched the URL. `match` objects contain the following properties:

- `params` - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
  - key值是  `:id` 之类的变量名  value 是即时匹配到的路径**字符串**
- `isExact` - (boolean) `true` if the entire URL was matched (no trailing characters)
- `path` - (string) The path pattern used to match. Useful for building nested `<Route>`s
- `url` - (string) The matched portion of the URL. Useful for building nested `<Link>`s

You'll have access `match` objects in various places:

- [Route component](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#component) as `this.props.match`
- [Route render](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#render-func) as `({ match }) => ()`
- [Route children](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#children-func) as `({ match }) => ()`
- [withRouter](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md) as `this.props.match`
- [matchPath](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/matchPath.md) as the return value

If a Route does not have a `path`, and therefore always matches, you'll get the closest parent match. Same goes for `withRouter`.

`Route `组件要渲染的组件component,通过Router可以向该组件传递match对象;对于官网的demo我做了一些改动,方便理解

通过点击不同的链接,观察地址栏和控制台的输出,应该可以有一个基础的认识.

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

console.log(Route);
console.log(<Route/>);

const Home = ()=>(
  <div>
    <h2>this is my Home</h2>
  </div>
)

const About = ()=>(
  <div>
    <h2>this is about handsome me</h2>
  </div>
)

// const Topics = ()=>(
//   <div>
//     <h2>this is all Topics</h2>
  
//   </div>
// )

const Topic = ({ match }) => {
  console.log('Topic',match);//改动1 
  return (
    <div>
     <h3>{match.params.topicId}</h3>
    </div>
  )
}


const Topics = ({match})=>{
  console.log('Topics',match);//改动2 
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li >
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/porps`}>props</Link>
        </li>
      </ul>
      <Route path={`${match.url}/:topicId`} component={Topic}></Route>
      <Route exact path={match.url} render={()=>(<h3>please select a topic</h3>)}></Route>
    </div>
  )
}
const BasicExample = ()=>(
 <Router>
   <div> 
    <ul>
      <li>
        <Link to='/'>Home</Link>
      </li>
      <li>
        <Link to='/about'>About</Link>
      </li>
      <li>
        <Link to='/topics'>Topics</Link>
      </li>

      <hr/>

      <Route path='/' component={Home}/>
      <Route path='/about' component={About}/>
      <Route path='/topics' component={Topics}/>
    </ul>
  
  </div>
 
 </Router>
)

export default BasicExample
```

### 3 Router中的组件的props对象

一般情况下,我们的组件的props属性直接通过定义可以取到,如下所示,可以通过props获取name属性的值

```jsx
function Welcome(props){
  console.log(props)

  return <h1>hello {props.name}</h1>
}
<Welcome name = 'Jhon'/>
```

当一个组件作为Route的component属性的值的时候,此时组件中的属性会多了location  history match这三个对象

```jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const ParamsExample = () => (
  <Router>
    <div>
      <h2>Accounts</h2>
      <ul>
        <li><Link to="/netflix">Netflix</Link></li>
        <li><Link to="/zillow-group">Zillow Group</Link></li>
        <li><Link to="/yahoo">Yahoo</Link></li>
        <li><Link to="/modus-create">Modus Create</Link></li>
      </ul>

      <Route path="/:id" component={Child}/>
    </div>
  </Router>
)
//改动官网的demo,便于理解
const Child = (props) => {
  console.log(props);//此时props对象包括 {location ,match,history}
  return (
    <div>
      <h3>ID: {props.match.params.id}</h3>
     </div>
  )
  
}
export default ParamsExample
```

```jsx
//官方源代码如下,两者达到的效果是一样的
const Child = ({ match }) => (
  <div>
    <h3>ID: {match.params.id}</h3>
  </div>
)
//这里用到了ES6中对象的解构赋值
```

### 3 withRouter Redict 

对象的解构赋值,前面仅仅是一个标记,后面才是变量

```html
<script>
  var name = 'Jhon'
  const {com:COM} = {com:name} ;
  console.log(COM);//Jhon
</script>
```

源码如下

```javascript
var withRouter = function withRouter(Component) {
  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
        remainingProps = _objectWithoutProperties(props, ['wrappedComponentRef']);

    return _react2.default.createElement(_Route2.default, { render: function render(routeComponentProps) {
        return _react2.default.createElement(Component, _extends({}, remainingProps, routeComponentProps, { ref: wrappedComponentRef }));
      } });
  };

  C.displayName = 'withRouter(' + (Component.displayName || Component.name) + ')';
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: _propTypes2.default.func
  };

  return (0, _hoistNonReactStatics2.default)(C, Component);
};

exports.default = withRouter;
```













学习了这么几天,我算是明白了.自己还是原来的自己,这么多年来一直没变.遇到问题总是刚正面,有时候确实很浪费时间和精力,其实有时候多看一些,多了解一些再去正面硬刚这些源码和问题,可能效率会更高.

[react-routerAPI文档解析](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md)

[官方文档](https://reacttraining.com/react-router/web/example/basic)

