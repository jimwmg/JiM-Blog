---
title:  matcher和history创建流程
date: 2017-12-22
categories: vue
---

### 1 使用

options参数配置

```javascript
base:默认值 '/',
mode:配置路由模式 ：history hash abstract ;默认值: "hash" (浏览器环境) | "abstract" (Node.js 环境)
scrollBehavior:function(){
}
routes==>route:{
  path: string;
  component?: Component;
  name?: string; // 命名路由
  components?: { [name: string]: Component }; // 命名视图组件,如果一个路径要匹配多个组件，那么就需要多个 <router-view name="a"></router-view>对应这里的name值，匹配到了就会进行渲染；
  redirect?: string | Location | Function;
  props?: boolean | string | Function;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>; // 嵌套路由
  beforeEnter?: (to: Route, from: Route, next: Function) => void;//路由独享的守卫
  meta?: any;

  // 2.6.0+
  caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
  pathToRegexpOptions?: Object; // 编译正则的选项
}

```

```javascript
//new VueRouter(options)
const router = new VueRouter({
    mode: 'history',
    routes:[
      { path: '/', component: Home,name:'home' },
      { path: '/foo', component: Foo,name:'foo' },
      { path: '/bar', component: Bar,name:'bar' }
    ]
});
console.log(router)
```

```javascript
matcher:{addRoutes:f addRoutes,match:f match}
```

```javascript
history:{base,pedding,current,ready,router,....}
```

创建一个VueRouter实例的时候，会执行VueRouter的constructor构造方法,主要作用就是创建该router的matcher和history对象

```javascript
this.matcher = createMatcher(options.routes || [], this)
this.history = new HTML5History(this, options.base)
```

### 2 创建matcher对象的流程

具体源码github可以找到

```javascript
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
    //详情自行查看 create-matcher.js文件
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
  //createRouteMap在调用addRouteRecord的时候会进行path和component的断言，也就是说要求routes配置中必须有path选项，component不能是一个字符串；
//createRouteMap处理完routes之后
  /***
  pathList:['/','/foo','/bar'];
  pathMap:{'/',recordHome,'/foo':recordFoo,'/bar':recordBar}
  nameMap:{'home':recordHome,'foo':recordFoo,'bar':recordBar}
  **/
  //闭包
  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

 function match(){ //... 
 }
 //....
  return {
    match,
    addRoutes
  }
}
```

上面的每一个record详细信息

```javascript
const record: RouteRecord = {
  path: normalizedPath,
  regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
  components: route.components || { default: route.component },
  instances: {},
  name,
  parent,    //注意这个parent，这个关联了当前路由的父路由，后面会根据这个找到对应路由的父路由，放到matched数组中
  matchAs,
  redirect: route.redirect,
  beforeEnter: route.beforeEnter,
  meta: route.meta || {},
  props: route.props == null
  ? {}
  : route.components
  ? route.props
  : { default: route.props }
}
```



matcher对象

```javascript
matcher:{match,addRoutes}
```

`router.push(location, onComplete?, onAbort?)`

```javascript
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

* 具体看下match的实现,针对push的不同参数，vue-router的具体处理如下：

```javascript
 function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location
//处理push了 name
    if (name) {
       // createMatcher中处理了我们配置的routes对象之后生成了nameMap pathMap pathList
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
        //如果没有在nameMap中找到，则返回null路由对象
      if (!record) return _createRoute(null, location)
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }
	//	如果找到了路由对象，那么将当前路由的params对象给到匹配到的新路由
      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }
	//
      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`)
        return _createRoute(record, location, redirectedFrom)
      }
        //处理push 了 path
    } else if (location.path) {
      location.params = {} //这一行代码也就解释了官网上如下一段话的描述
        //注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }
```

```javascript
function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }
```

```javascript

export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),//这个就是根据path query hash 动态计算的fullpath
    matched: record ? formatMatch(record) : []  //如果有对应的record,那么就找到该record对应的所有父 record
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}
```

```javascript
//将所有的父 子 record 都放入 matched数组中
function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
```



### 3 创建history对象的流程

history/base.js

```javascript
export class History{ 
  constructor (router: Router, base: ?string) {
      this.router = router
      this.base = normalizeBase(base)//表示应用的基准路径，默认值是 '/'
    //如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
      // start with a route object that stands for "nowhere"
      this.current = START
      this.pending = null
      this.ready = false
      this.readyCbs = []
      this.readyErrorCbs = []
      this.errorCbs = []
    }
  //...
}
```

history对象

```javascript
history：{router,base,current,pending,ready,readyCbs,
  __proto__:go,back,forward,push,replace等原型方法...}
```



