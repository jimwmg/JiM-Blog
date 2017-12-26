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
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
//createRouteMap处理完routes之后
  /***
  pathList:['/','/foo','/bar'];
  pathMap:{'/',recordHome,'/foo':recordFoo,'/bar':recordBar}
  nameMap:{'home':recordHome,'foo':recordFoo,'bar':recordBar}
  **/
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
```



matcher对象

```javascript
matcher:{match,addRoutes}
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



