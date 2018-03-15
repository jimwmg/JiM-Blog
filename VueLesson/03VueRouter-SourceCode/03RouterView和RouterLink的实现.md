---
title: RouterView和RouterLink源码解析
date: 2017-12-25
categories: vue
---

### 1 基本使用

```html
<div id="app" v-cloak>
  <router-view></router-view>
  <router-view name='a'></router-view>
  <router-view name='b'></router-view>
  
</div>
```

```javascript
const router = new VueRouter({
  mode: 'history',
  routes:[
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    {path: '/other',
     components: {
       default: Home,
       a: Bar,
       b: Foo
     }
    }
  ]
});
new Vue({
  router,
}).$mount('#app');
```

在《VueRouter源码实现》中可以看到给Vue注册了全局组件RouterView 和RouterLink

```javascript
Vue.component('RouterView', View)
Vue.component('RouterLink', Link)
```

###2 具体实现

RouterView

```javascript
export default {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
    //注意这里的parent就是 router-view组件实例对象的 父组件实例对象
  render (_, { props, children, parent, data }) {
    data.routerView = true

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    const h = parent.$createElement
    const name = props.name
    //获取到主组件的vm.$route==>vm._route地址一样
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0
    let inactive = false
    //depth决定当前router-view出口从route.matched数组中选择哪一个route对象进行渲染
    //在《matcher和history创建源码》中createRoute 生成route对象的时候，matched数组会根据我们的配置，找到对应的路由；这里的 depth 和 formatMatch 生成 matched是对应的
    //如果parent组件实例对象 _routerRoot 不是指向 parent组件实例自身，那么就代表parent组件是一个子组件
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }
    //得到匹配的路由组件
    const matched = route.matched[depth] //
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null
      return h()
    }
    //得到要渲染的组件
    const component = cache[name] = matched.components[name]

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = (vm, val) => {
      // val could be undefined for unregistration
      const current = matched.instances[name]
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = (_, vnode) => {
      matched.instances[name] = vnode.componentInstance
    }

    // resolve props
    let propsToPass = data.props = resolveProps(route, matched.props && matched.props[name])
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass)
      // pass non-declared props as attrs
      const attrs = data.attrs = data.attrs || {}
      for (const key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key]
          delete propsToPass[key]
        }
      }
    }
    //调用createElement 函数 渲染匹配的组件,
    return h(component, data, children)
  }
}
```

```javascript
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
//vm.$createElement 这个函数是当组件自己写了render函数的时候会调用,表示会对子元素进行最高级的归一化处理。
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
// render self
let vnode
//这里就执行了那个编译之后的render函数
vnode = render.call(vm._renderProxy, vm.$createElement)
```

详情参见Vue-sourceCode ==>《vnode对象是如何渲染的》

对于每一个匹配到的路由对象（matched)

```javascript
const record: RouteRecord = {
  path: normalizedPath,
  regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
  components: route.components || { default: route.component },//这里可以看到对于RouterView没有name属性的默认为default
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

### 3 看下生成RouterView对应的vnode的对象的过程是怎么样的

```
													/ createFunctionalComponent
createElement==>_createElement ==> createComponent 									==> vnode
  													\ new VNode(options)
```

```javascript
export function createFunctionalComponent (
  Ctor: Class<Component>,
  propsData: ?Object,
  data: VNodeData,
  contextVm: Component,
  children: ?Array<VNode>
): VNode | void {
  const options = Ctor.options
  const props = {}
  const propOptions = options.props
  if (isDef(propOptions)) {
    for (const key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject)
    }
  } else {
    if (isDef(data.attrs)) mergeProps(props, data.attrs)
    if (isDef(data.props)) mergeProps(props, data.props)
  }

  const renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  )
//调用RuterView的render函数，生成vnode对象,render函数又会调用createElement，最后又执行new VNode
  const vnode = options.render.call(null, renderContext._c, renderContext)

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm
    vnode.fnOptions = options
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot
    }
  }

  return vnode
}
```

函数式组件的创建流程

```
	--------------------------------------------------------------  ------------- -|			|																		       |
    | 																			   |
	|																			   |
   \|/												/ createFunctionalComponent —— |
createElement==>_createElement ==> createComponent 									==> vnode
  													\ new VNode(options)
```

### 4 RouterLink

```javascript
// ...
import { createRoute, isSameRoute, isIncludedRoute } from '../util/route'
// ...
export default {
  name: 'router-link',
  props: {
    // 传入的组件属性们
    to: { // 目标路由的链接
      type: toTypes,
      required: true
    },
    // 创建的html标签
    tag: {
      type: String,
      default: 'a'
    },
    // 完整模式，如果为 true 那么也就意味着
    // 绝对相等的路由才会增加 activeClass
    // 否则是包含关系
    exact: Boolean,
    // 在当前（相对）路径附加路径
    append: Boolean,
    // 如果为 true 则调用 router.replace() 做替换历史操作
    replace: Boolean,
    // 链接激活时使用的 CSS 类名
    activeClass: String
  },
  render (h: Function) {
    // 得到 router 实例以及当前激活的 route 对象
    const router = this.$router
    const current = this.$route
    const to = normalizeLocation(this.to, current, this.append)
    // 根据当前目标链接和当前激活的 route匹配结果
    const resolved = router.match(to, current)
    const fullPath = resolved.redirectedFrom || resolved.fullPath
    const base = router.history.base
    // 创建的 href
    const href = createHref(base, fullPath, router.mode)
    const classes = {}
    // 激活class 优先当前组件上获取 要么就是 router 配置的 linkActiveClass
    // 默认 router-link-active
    const activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    // 相比较目标
    // 因为有命名路由 所有不一定有path
    const compareTarget = to.path ? createRoute(null, to) : resolved
    // 如果严格模式的话 就判断是否是相同路由（path query params hash）
    // 否则就走包含逻辑（path包含，query包含 hash为空或者相同）
    classes[activeClass] = this.exact
      ? isSameRoute(current, compareTarget)
      : isIncludedRoute(current, compareTarget)

    // 事件绑定
    const on = {
      click: (e) => {
        // 忽略带有功能键的点击
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        // 已阻止的返回
        if (e.defaultPrevented) return
        // 右击
        if (e.button !== 0) return
        // `target="_blank"` 忽略
        const target = e.target.getAttribute('target')
        if (/\b_blank\b/i.test(target)) return
        // 阻止默认行为 防止跳转
        e.preventDefault()
        if (this.replace) {
          // replace 逻辑
          router.replace(to)
        } else {
          // push 逻辑
          router.push(to)
        }
      }
    }
    // 创建元素需要附加的数据们
    const data: any = {
      class: classes
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = { href }
    } else {
      // 找到第一个 <a> 给予这个元素事件绑定和href属性
      const a = findAnchor(this.$slots.default)
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false
        const extend = _Vue.util.extend
        const aData = a.data = extend({}, a.data)
        aData.on = on
        const aAttrs = a.data.attrs = extend({}, a.data.attrs)
        aAttrs.href = href
      } else {
        // 没有 <a> 的话就给当前元素自身绑定时间
        data.on = on
      }
    }
    // 创建元素
    return h(this.tag, data, this.$slots.default)
  }
}

function findAnchor (children) {
  if (children) {
    let child
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '/#' + fullPath : fullPath
  return base ? cleanPath(base + path) : path
}

```

可以看出 `router-link` 组件就是在其点击的时候根据设置的 `to` 的值去调用 `router` 的 `push` 或者 `replace` 来更新路由的，同时呢，会检查自身是否和当前路由匹配（严格匹配和包含匹配）来决定自身的 `activeClass` 是否添加。