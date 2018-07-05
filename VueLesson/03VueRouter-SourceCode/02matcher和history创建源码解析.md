---
title:  matcher和history创建流程
date: 2017-12-22
categories: vue
---

Q: `this.$router.push 会触发watch的$route,this.$router.replace却不会触发watch的$route`?

:不是的，两者都可以触发watch的`$route`对象的函数

Q: 如果父子组件都watch了 `$route` 那么子组件在 `$route` 变化的时候，都会触发子组件自身和父组件上的的watch函数 `$route`函数；

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
  //两个作用，第一：根据配置生成的record会有父子record的关系链
  //第二：将所有的route进行扁平化处理，生成 pathList, pathMap, nameMap这样的映射对象，方便在match函数中取出生成的对应的record对象；
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
 function _createRouote(){
        
 }
 function alias(){
        
 }
 //....
  return {
    match,
    addRoutes
  }
}
```

createRouteMap源码解释

官网中 [**要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。**](https://router.vuejs.org/zh-cn/essentials/nested-routes.html)有这样一句话,normalizePath函数解释了这句话的根源

```javascript
/* @flow */

import Regexp from 'path-to-regexp'
import { cleanPath } from './util/path'
import { assert, warn } from './util/warn'

export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>;
  pathMap: Dictionary<RouteRecord>;
  nameMap: Dictionary<RouteRecord>;
} {
  // the path list is used to control path matching priority
  const pathList: Array<string> = oldPathList || []
  // $flow-disable-line
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // $flow-disable-line
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}

function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, `"path" is required in a route configuration.`)
    assert(
      typeof route.component !== 'string',
      `route config "component" for path: ${String(path || name)} cannot be a ` +
      `string id. Use an actual component instead.`
    )
  }

  const pathToRegexpOptions: PathToRegexpOptions = route.pathToRegexpOptions || {}
  //将 配置中的 path值进行标准化处理：一：如果以 / 开头，则会作为根路由，如果不是以 / k开头，则会拼接上父路由配置中的 path ;下面有normalizePath的实现源码
  const normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  )

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath, // 配置中的path如果是以 / 开头，则会返回原值，如果不是以 / 开头，则会拼接父路由的path 
  //所以我们的根路由必须以 / 开头，这样才能在路由字典中找到对应的匹配路由
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
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

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(child => /^\/?$/.test(child.path))) {
        warn(
          false,
          `Named Route '${route.name}' has a default child route. ` +
          `When navigating to this named route (:to="{name: '${route.name}'"), ` +
          `the default child route will not be rendered. Remove the name from ` +
          `this route and use the name of the default child route for named ` +
          `links instead.`
        )
      }
    }
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias]

    aliases.forEach(alias => {
      const aliasRoute = {
        path: alias,
        children: route.children
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    })
  }
//将生成的路由record放入路由字典中 pathList  pathMap 
  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }
//将生成的路由record放入路由字典中 nameMap
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        `Duplicate named routes definition: ` +
        `{ name: "${name}", path: "${record.path}" }`
      )
    }
  }
}

function compileRouteRegex (path: string, pathToRegexpOptions: PathToRegexpOptions): RouteRegExp {
  const regex = Regexp(path, [], pathToRegexpOptions)
  if (process.env.NODE_ENV !== 'production') {
    const keys: any = Object.create(null)
    regex.keys.forEach(key => {
      warn(!keys[key.name], `Duplicate param keys in route with path: "${path}"`)
      keys[key.name] = true
    })
  }
  return regex
}

function normalizePath (path: string, parent?: RouteRecord, strict?: boolean): string {
  if (!strict) path = path.replace(/\/$/, '') //将path后面的 / 去掉，'/fff/'.replace(/\/$/, '')  ==>  /fff
  if (path[0] === '/') return path  

  if (parent == null) return path 
//如果path 字符串以 / 开头，或者没有父级路由，则以根路径处理该路由，直接返回该path值，作为基准，取得fullath
  return cleanPath(`${parent.path}/${path}`)
  //如果两者都不是，则path不以 / 开头，则会作为子路由，此时其path取值要以父路由path为准进行拼接；
}
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/') //将全局的 // => /
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

const route = this.router.match(location, this.current)
//这里会执行：return this.matcher.match(raw, current, redirectedFrom)
//详情《matcher和history创建源码解析》
```

* 具体看下match的实现,针对push的不同参数，vue-router的具体处理如下：

match的过程分为两个部分：

第一： 根据传入的location对象处理location ,即 normalizeLocation 的过程

第二：根据 normalizeLocation 之后的location ,从路由字典中取出对应的路由record;

第三：找到 record 之后，生成 route对象

```javascript
 function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
        //注意下这个 标准化location函数，该函数的作用主要是
        //一：根据传入的 location中的path或者name,从路由字典中取出对应的路由record
        //二：如果传递了name，那么直接通过name的字典，很容易找到对应的路由record
        //三：但是如果设置了 path,那么，path会根据开头是否是 / 字符串来确定是根路由还是子路由，然后从路由字典中根据标准化后的path值去路由字典中取对应的路由record
    const location = normalizeLocation(raw, currentRoute, false, router)
    //如果包含 name 那就直接返回 next;
    /*如果不包含name ，那么需要对传入的进行处理，
   {
   		_normalized: true,
        path,//截掉hash和query之后的path
        query, //格式化为对象的查询字符串
        hash //字符串hash
    }*/
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

第一： 根据传入的location对象处理location ,即 normalizeLocation 的过程

```javascript
export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean,
  router: ?VueRouter
): Location {
  let next: Location = typeof raw === 'string' ? { path: raw } : raw
  // named target
  //如果传入的location 有 name 属性，那么直接返回该 location ,通过name进行路由匹配
  if (next.name || next._normalized) {
    return next
  }
//如果传入的location没有path属性，且有params属性
  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next)
    next._normalized = true
    const params: any = assign(assign({}, current.params), next.params)
    if (current.name) {
      next.name = current.name
      next.params = params
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path
      next.path = fillParams(rawPath, params, `path ${current.path}`)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, `relative params navigation requires a current route.`)
    }
    return next
  }
  //如果传入的location 有path属性
  const parsedPath = parsePath(next.path || '') // { hash , query , path }
  const basePath = (current && current.path) || '/'
  //对于传入的path resolvePath函数会对其进行处理,如果不是 / 开头的就进行处理，如果是直接返回；
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath

  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  )

  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
```

```javascript
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}
```



1. 如果传入的 path 是以 `/  `开头的路径，那么直接根据这个path值（根路由）去路由字典中取值
2. 如果传入的 path 不是以 `/`开头的路径，那么就根据当前路径为基准进行拼接，然后根据这个拼接好的路径，去路由字典中取值
3. 以上都是在 `createRouteMap`创建路由字典的时候，针对 `/ ` 开头的path 和 不是 `/`开头的path都是有对应的处理的；

```javascript
export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}
```

第二：根据 normalizeLocation 之后的location ,从路由字典中取出对应的路由record;

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
  transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const route = this.router.match(location, this.current) // 可能需要current的params
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      onComplete && onComplete(route)
      this.ensureURL()

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => { cb(route) })
      }
    }, err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => { cb(err) })
      }
    })
  }
}
```

####HTML5  pushState

* history/html5.js

 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 `vue-router` 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

**scrollBehavior只在支持 history.pushState中的浏览器中中可以使用；**

```javascript
import { History } from './base' // 这个History就是上面的 base.js中的导出对象
export class HTML5History extends History {
    constructor (router: Router, base: ?string) {
        super(router, base)

        const expectScroll = router.options.scrollBehavior
        const supportsScroll = supportsPushState && expectScroll

        if (supportsScroll) {
            setupScroll()
        }

        const initLocation = getLocation(this.base)
        window.addEventListener('popstate', e => {
            const current = this.current

            // Avoiding first `popstate` event dispatched in some browsers but first
            // history route not updated since async guard at the same time.
            const location = getLocation(this.base)
            if (this.current === START && location === initLocation) {
                return
            }

            this.transitionTo(location, route => {
                if (supportsScroll) {
                    handleScroll(router, route, current, true)
                }
            })
        })
    }

    go (n: number) {
        window.history.go(n)
    }

    push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            pushState(cleanPath(this.base + route.fullPath))
            handleScroll(this.router, route, fromRoute, false)
            onComplete && onComplete(route)
        }, onAbort)
    }

    replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
        const { current: fromRoute } = this
        this.transitionTo(location, route => {
            replaceState(cleanPath(this.base + route.fullPath))
            handleScroll(this.router, route, fromRoute, false)
            onComplete && onComplete(route)
        }, onAbort)
    }

    ensureURL (push?: boolean) {
        if (getLocation(this.base) !== this.current.fullPath) {
            const current = cleanPath(this.base + this.current.fullPath)
            push ? pushState(current) : replaceState(current)
        }
    }

    getCurrentLocation (): string {
        return getLocation(this.base)
    }
}

export function getLocation (base: string): string {
    let path = window.location.pathname
    if (base && path.indexOf(base) === 0) {
        path = path.slice(base.length)
    }
    return (path || '/') + window.location.search + window.location.hash
}
```

history对象

```javascript
history：{router,base,current,pending,ready,readyCbs,
  __proto__:go,back,forward,push,replace等原型方法...}
```

当我们执行 `history.push. history.replace的时候`UI更新的根本原因如下：

==>router.init    history.push     history.replace  都会触发history.transitionTo

==> history.transitionTo:根据当前地址栏更新route对象

==>router.match(location, this.current):根据当前地址栏生成对应的route对象(这里会从createRouteMap生成的字典中去取) 详情参见《matcher和history创建源码解析》

==>confirmTransition :根据生成的route对象确认跳转

==>updateRoute :更新history实例对象的current(当前路由)，并且执行history上通过listene注册的方法

==>history上注册cb函数会修改应用实例`vm._route`这个响应式的属性，将其值改为当前地址对应的route对象

==>响应式属性值的改变，就会触发Vue的更新机制，从而实现了DOM的更新

==> Vue更新的时候，router-view组件就会根据最新的`vm._route.matched`上的匹配到的组件，对应的输出组件；

==>完毕

这里需要注意的一点是：`vue-router` 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 **history 模式**，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。

当你使用 history 模式时，URL 就像正常的 url，例如 `http://yoursite.com/user/id`，也好看！

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 `http://oursite.com/user/id` 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面。

#### 原因： 浏览器解析地址栏的时候，`#`后面的不会发送到服务器，所以hash模式下不会有问题；但在HTML5的模式下，就会产生问题了；

