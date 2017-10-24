---
title:  React-router Foundation
date: 2017-05-09 12:36:00
categories: javascript
tags : React-router
comments : true 
updated : 
layout : 
---

参考此文章,具体的demo以及相关配置都有,大家可以直接看这个即可,我写的只是为了让自己理解深刻

[react-router-tutorial](https://github.com/reactjs/react-router-tutorial/tree/master/lessons)

### 1 React-Router用来配合React来使用,对于不同的组件,根据不同的url地址进行不同的组件的渲染

还是从本质上先大概了解下Router和Route分别是什么 

```javascript
import { Router, Route, hashHistory } from 'react-router'

console.log('Router',Router);
console.log('Route',Route);
```

```
Router function (props, context, updater) {
	      // This constructor is overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production…
Route function (props, context, updater) {
	      // This constructor is overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production…
```

可以看出,它们也是一般的组件创建函数,然后通过类似于下面的方法进行调用即可

```html
 <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path='/about' component={About}/>
    <Route path='/repo' component={Repo}/>
  </Router>
```

最终实现的功能就会根据不同的路由渲染不同的组件

### 2 如上实现根据不同的url地址的实现方案,需要我们在地址栏手动输入相关地址,才可以访问,这个时候Link组件

```html
import {Link} from 'react-router'
console.log('Link',Link);
```

```
Link function (props, context, updater) {
	      // This constructor is overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production…
```

其实我们发现 Router  Route   Link等也都是一些组件而已,实现的功能就是根据不同的url地址进行不同组件的渲染.

```javascript
import React from 'react'

import {Link} from 'react-router'
console.log('Link',Link);

export default React.createClass({
  render() {
    return (
      <div>
        <h1>React Router Tutorial</h1>
        <ul role = 'nav'>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/repo'>Repo</Link></li>
        </ul>
      </div>
    )
  }
})
```

Link组件的作用和我们平常用的`<a>`标签的作用大同小异 .

同样我们也可以封装一个Link ,该link可以有一些样式,以后在这个组件就可以被复用.

```
// modules/NavLink.js
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return <Link {...this.props} activeClassName="active"/>
  }
})
```

### 3 React-router的工作 原理其实 就是根据url地址栏不同的地址,然后可以渲染不同的组件

在路由中 

```
this.props.children 
```

至关重要,理解它就算基本上理解了路由的基本原理

先贴上参考链接吧 [xianyulaodi](https://github.com/xianyulaodi/React-router)

App组件

```
const App=React.createClass({
  render() {
    return (

    	<div className="mp_wrap bui_wrap">
			{/**主屏幕**/}
			<div className="mp_pagebox_home">
				
				{/**这里面的内容会被子路由给代替**/}
				{this.props.children}
				{/**注意这个this.props.children**/}
				{/**公共页脚**/}
				<div className="mp_page_footer">
					 <Footer  />
				</div>
				{/**公共页脚**/}
			</div>
			{/**主屏幕**/}
		</div>
    )
  }
});
```

路由的配置

```
render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />

      <Route path="/type/:typeName" component={Type} />

      <Route path="/mall" component={Mall}>
          <Route path="type/:typeName" component={Type} />
      </Route>

      <Route path="/my" component={My}>
           <IndexRoute component={MyNav} />
           <Route path="userCenter" component={MyUserCenter} />
           <Route path="memberClub" component={MemberClub} />
      </Route>

      <Route path="/circle" component={Circle}>
          <IndexRoute component={CircleType} />
          <Route path="tip/:tipName" component={CircleTip} />
          <Route path="say" component={CircleSay} />
      </Route>

    </Route>
  </Router>
), document.getElementById('index'))
```

```
{/**这里面的内容会被子路由给代替**/}
{this.props.children}
{/**注意这个this.props.children**/}
```

在这里面 this.props.children会更具不同的url地址加载不同的组件

* 默认加载的组件是Index

* 如果url  是  /my   ,那么就会加载  My组件

* ```
  这里是my.js文件,也就是my组件
  var Content= React.createClass({

  	render(){
  		
  		return (
  				<div className = 'myWrap'>	
  					{this.props.children}
  				</div>
  		)
  	}
  })
  ```

* my组件在渲染的时候,默认渲染的是MyNav组件,

  ```
  <Route path="/my" component={My}>
    <IndexRoute component={MyNav} />
    <Route path="userCenter" component={MyUserCenter} />
    <Route path="memberClub" component={MemberClub} />
  </Route>
  ```

  如果url地址栏是/my/userCenter,则会加载MyUserCenter组件

  **所以要理解路由的匹配原理**

 嵌套关系:

  中文网的解释：React Router 使用路由嵌套的概念来让你定义 view 的嵌套集合，当一个给定的 URL 被调用时，整个集合中（命中的部分）都会被渲染。

  嵌套路由被描述成一种树形结构。React Router 会深度优先遍历整个[路由配置](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#routeconfig)来寻找一个与给定的 URL 相匹配的路由。

  什么意思呢。上面的入口文件中，可以看到，其他路由都是最外层那个app（也就是这个 `<Route path="/" component={App}>`）的子路由，其他路由都是嵌套在这里面。

  当url变化是，它里面的{this.props.children}都会替换，也就是所谓的整个集合的命中部分都会被渲染。

 路径语法:

  路由路径是匹配一个（或一部分）URL 的 [一个字符串模式](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#routepattern)。大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号：

-   `:paramName` – 匹配一段位于 `/`、`?` 或 `#` 之后的 URL。 命中的部分将被作为一个[参数](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)
  - `()` – 在它内部的内容被认为是可选的
  - `*` – 匹配任意字符（非贪婪的）直到命中下一个字符或者整个 URL 的末尾，并创建一个 `splat` [参数](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)

  ```
  <Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
  <Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
  <Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg

  ```

  如果一个路由使用了相对`路径`，那么完整的路径将由它的所有祖先节点的`路径`和自身指定的相对`路径`拼接而成。[使用绝对`路径`](http://react-guide.github.io/react-router-cn/docs/guides/basics/RouteConfiguration.html#decoupling-the-ui-from-the-url)可以使路由匹配行为忽略嵌套关系。


### 4 路由中的参数传递

render/app.js中

注意此时的 : 冒号后面的变量就可 以通过 this.props.params

1 通过如下这种方式定义变量

```
 <Route path="/type/:typeName" component={Type} />
```

上面这行route配置 , : typeName是一个变量 , 对于不同的变量值 , 在Type中该变量值可以通过

```
this.props.params 
```

来获取.

Type组件中

```
const { typeName } = this.props.params
<h2>{typeName}</h2>
<Link to="/type/饼干">
    <p className="icon icon1"></p>
    <p className="bui_ta_c bui_tc_gray">饼干</p>
</Link>

```

当我们点击Link标签的时候,h2中既可以获取到此时

