---
title:  VueRouter源码解析
date: 2017-12-21 
categories: vue
---

### 1 看下基本的使用

```javascript
import Vue from 'vue';
import $ from 'webpack-zepto';
import routes from './routers';
//1 注册VueRouter中相关插件
Vue.use(VueRouter);
//2 创建router实例对象
const router = new VueRouter({
    mode: 'history',
    routes:[
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
});
//3 启动应用，将router注入到应用当中,注意这里的属性名必须是router
new Vue({
    router,
}).$mount('#app');

```

### 2 看下VueRouter的源码实现

vue-router.src/index.js

```javascript
export default class VueRouter {
  static install: () => void;
  static version: string;
  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options  //这里就是传入 new VueRouter(routes)中的routers,这个是是固定不变的
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)
    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
  init();
  beforeEach();
  match();
  afterEach();
  go();
  forward();
//.....
	
}
VueRouter.install = install
VueRouter.version = '__VERSION__'

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}

```

### 3 使用流程

#### 3.1 Vue.use(VueRouter);

```javascript
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters 将arguments对象转化为数组，方便后面apply调用
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      //这个apply用的真巧妙，install函数中只接受第一个参数Vue构造函数，apply将args数组拆分开传过去也不会用到；
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

两个作用

* 第一：将plugin添加到Vue构造函数 `_installedPlugins` 数组上
* 第二：执行plugin上的install静态方法

执行plugin.install(Vue)

```javascript
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

install.js

```javascript
export function install (Vue) {
  //防止重复安装
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  //全局Vue.options对象中增加键值对
//将Vue.mixn(options)中的key-value值给到Vue.options,这里就是使得Vue.options.beforeCreate.  Vue.options.destroyed
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router  //这个router就是 new VueRouter(routes)的返回值
        this._router.init(this)
        //这里 会启动对页面地址变更的监听，从而在变更时更新 vm 的数据（$route），进而触发视图的更新。
        //这样对 vm._route 的赋值会被 Vue 拦截到，并且触发 Vue 组件的更新渲染流程。
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  //将_router 和 _route 对象给到Vue.prototype 这样所有的Vue组件都可以访问到路由对象；

  Object.defineProperty(Vue.prototype, '$router', {  //$router其实就是vueRouter实例对象
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route } //history.current
  })
  //$router 是不变的，但是 $route是随着地址栏变化而变化的；
//给Vue构造函数注册组件，Vue.options.components上就有了RouterView 和 RouterLink组件
  //这是全局注册组件的方式，所以所有Vue的组件都可以使用通过全局注册的组件；
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

###3.2 创建router实例对象

```javascript
const router = new VueRouter({
    mode: 'history',
    routes:[
      { path: '/', component: Home },
      { path: '/foo', component: Foo },
      { path: '/bar', component: Bar }
    ]
});

```

创建router实例对象的时候，会执行VueRouter的构造函数，其中有两行重要的代码

实例化VueRouter的时候，其实主要就是创建该VueRouter实例的matcher和history对象

```javascript
this.matcher = createMatcher(options.routes || [], this)
this.history = new HTML5History(this, options.base)
```

具体查看《matcher和history创建源码解析》[解析](https://github.com/open-source/jimwmg)

router实例对象

```javascript
router:{
	app = null
    apps = []
    options = options //传入 new VueRouter(options)中的options对象
    beforeHooks = []
    resolveHooks = []
    afterHooks = []
    matcher = matcher
    history = history
    mmode = mode
    __proto__:init,match,replace,push,go,back,forward 等原型链上的方法
}
```

### 3.3 启动Vue应用

```javascript
//启动应用，将router注入到应用当中,注意这里的属性名必须是router
let vm = new Vue({
    router,//VueRouter实例对象
}).$mount('#app');
```

这里，当我们new Vue(options)的时候，会首先执行callHook(vm, 'beforeCreate')生命周期函数数组

由于beforeCreate该函数是Vue构造函数Vue.options.beforeCreate  Vue.options.destroyed上，所以在实例化Vue组件的时候，就会在vm.$options.beforeCreate.    vm.$options.destroy有这两个生命周期函数

由于子组件中没有router这个属性，所以即时子组件上有这个beforeCreate钩子函数，也不会在此对router这个对象执行init函数；

```javascript
Vue.mixin({
    beforeCreate () {
      //如果启动Vue应用中的options中传入router对象，那么就初始化该router对象
      //这里只有主组件上有router属性，其他子组件中并没有，因为只有主组件上new Vue(options)中有router选项
      if (isDef(this.$options.router)) {
        this._routerRoot = this //在vm实例对象上保存 _routerRoot 指向vm实例本身
        this._router = this.$options.router //在vm实例对象上保存 _router 指向options.router,这也是为什么传入new Vue(options)中必须是 'router' 字段的原因的原因
        this._router.init(this) //执行new VueRouter().init
        //_route 里面放的是当前路径匹配的路由对象
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
```

看下它们的执行

```javascript
this._router = this.$options.router  //vm._router = router
this._router.init(this) 
```

vue-router/src/index.js

```javascript
init (app: any /* Vue component instance */) {
    this.apps.push(app) //app 就是vm实例对象

    // main app already initialized.
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      //这里history.transotionTo进行路由的跳转==>updateRoute==>执行this.cb ==> app._route改变
      //Vue.util.defineReactive(this, '_route', this._router.history.current)
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }
/**
  listen (cb: Function) {
    this.cb = cb
  }
*/
    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }

```

总结下上面的更新流程：

==>Vue.util.defineReactive(`this`, `'_route'`, `this._router.history.current`) ：给应用实例注册了响应式属性，当该属性值更新的时候，就会触发应用的更新机制

==>router.init  history.push     history.replace 都会触发history.transitionTo

==> history.transitionTo:根据当前地址栏更新route对象

==>router.match:根据当前地址栏生成对应的route对象

==>confirmTransition :根据生成的route对象确认跳转

==>updataRoute :更新history实例对象的current(当前路由)，并且执行history上通过listene注册的方法

==>history上注册cb函数会修改应用实例`vm._route`这个响应式的属性，将其值改为当前地址对应的route对象

==>响应式属性值的改变，就会触发Vue的更新机制，从而实现了DOM的更新

**以上基本流程基本完毕，下面稍微详细分析下各个函数大致的实现**

###4 细节总结

```javascript
 transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
   //this.router.match==>this.matcher.match==>_createRoute()创建匹配之后的route:如果匹配不到创建null
    const route = this.router.match(location, this.current)
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

```

```javascript
  updateRoute (route: Route) {
    const prev = this.current
    this.current = route
    this.cb && this.cb(route)
    this.router.afterHooks.forEach(hook => {
      hook && hook(route, prev)
    })
  }
}
```

