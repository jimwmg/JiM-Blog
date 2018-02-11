---
title:  Vue中内置组件源码实现
date: 2018-01-08 
categories: vue
---

### 1 内置组件包括：有以下内置的抽象组件

* keep-alive
* transition
* transition-group
* component
* slot

### 2 `keep-alive`的作用，是包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们

[keep-alive](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8Akeep-alive%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8%E5%8F%8A%E5%85%B6%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.MarkDown)

如果app-layout下面还有子组件，那么子组件的生命周期也会只是 activated和deactivated

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <keep-alive>
                <app-layout1 v-if='showOrNot'></app-layout1>
                <app-layout2 v-else></app-layout2>
        </keep-alive>
        
    </div>
    <script type="text/javascript">
        var AppLayout1 = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落1。</p>'+
                '<div>另一个主要段落1。</div>'+
                '<input type="text" v-model:value="app1Word"/>'+
                '</div>',
            data(){
                return {app1Word:'app1'}
            },
            beforeDestroy(){
                console.log('app1 beforeDestroyed')
            },
            destroyed(){
                console.log('app1 destroyed')
            }
            
        });
        var AppLayout2 = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落2。</p>'+
                '<div>另一个主要段落2。</div>'+
                '<input type="text" v-model:value="app2Word"/>'+
                '</div>',
            data(){
                return {app2Word:'app2'}
            },
            beforeDestroy(){
                console.log('app2 beforeDestroyed')
            },
            destroyed(){
                console.log('app2 destroyed')
            }
            
        })
        var vm = new Vue({
            el: '#app',
            data:{
                showOrNot:true,
            },
            components: {
                AppLayout1: AppLayout1,
                AppLayout2: AppLayout2
            }
        });
    </script>
</body>
```

测试方法：

* 可以打开控制台输入vm.showOrNot = true；
* 中间可以修改input框中的值，可以看下有keep-alive和没有keep-alive组件的区别

### 3 结合vue-router的使用

routes.js  配置

```javascript
export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true // 需要被缓存
    }
  }, {
    path: '/:id',
    name: 'edit',
    component: Edit,
    meta: {
      keepAlive: false // 不需要被缓存
    }
  }
]

```

```vue
<div>
  <transition name="router-fade" mode="out-in">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      </router-view>
    </keep-alive>
  </transition>
  <transition name="router-fade" mode="out-in">
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    </router-view>
  </transition>
  <svg-icon></svg-icon>	
</div>
```

### 4 源码实现（需要注意keep-alive也就是一个Vue组件而已）

src/core/component/keep-alive.js

```javascript
/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };

function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
cache: VNodeCache,
 key: string,
 keys: Array<string>,
 current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    //同时销毁该组件缓存的组件
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    //	keep-alive组件实例在创建的时候，在该组件实例对象上添加一个cache对象，用来存放改组件的子组件生成的vnode值
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    //keep-alive组件销毁的时候，同时销毁该组件缓存的组件。
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  watch: {
    include (val: string | RegExp | Array<string>) {
      pruneCache(this, name => matches(val, name))
    },
    exclude (val: string | RegExp | Array<string>) {
      pruneCache(this, name => !matches(val, name))
    }
  },

  render () {
    //得到keep-alive组件的$slots.default
    const slot = this.$slots.default
    //首先，调用getFirstComponentChild方法，来获取this.$slots.default中的第一个元素。
    const vnode: VNode = getFirstComponentChild(slot)
    /** 这里会过滤掉非自定义的标签，然后获取第一个自定义标签所对应的vnode。所以，如果keep-alive里面包裹的是html标签，是不会渲染的。
    export function getFirstComponentChild (children: ?Array<VNode>): ?VNode {
  		return children && children.filter((c: VNode) => c && c.componentOptions)[0]
  		//0表示第一个自定义标签
	}
    */
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      /** 获取自定义组件名
      function getComponentName (opts: ?VNodeComponentOptions): ?string {
 	 	return opts && (opts.Ctor.options.name || opts.tag)
	 } 
      */
      const { include, exclude } = this //获取通过props传递进来的include, exclude的值
  //然后判断该组件是否合法，如果include不匹配或exclude匹配，则说明该组件不需要缓存，此时直接返回该vnode。
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode  //返回的vnode就是keep-alive组件的子元素；自定义的组件包括router自定义的组件或者我们自己自定义的组件
      }
	//否则，vnode.key不存在则生成一个，存在则就用vnode.key作为key。然后把该vnode添加到this.cache中，并设置vnode.data.keepAlive = true。最终返回该vnode
      const { cache, keys } = this  //获取在created keep-alive组件的时候创建的cache和key地址
      const key: ?string = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
      : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true  //给被keep-alive组件包裹的子组件设置keep-alive属性值，通过该属性值来决定在keep-alive组件被销毁的时候，其缓存的子组件是否也被销毁
    }
    return vnode || (slot && slot[0])
  }
}

```

`keep-alive`本身也是一个组件，在`render`函数调用生成`vnode`后，同样会走`__patch__`。在创建和`diff`的过程中，也会调用`init`、`prepatch`、`insert`和`destroy`钩子函数。不过，每个钩子函数中所做的处理，和普通组件有所不同。

```
 init (
    vnode: VNodeWithData,
    hydrating: boolean,
    parentElm: ?Node,
    refElm: ?Node
  ): ?boolean {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    }
  },
```

在`keep-alive`组件内调用`__patch__`时，如果`render`返回的`vnode`是第一次使用，则走正常的创建流程，如果之前创建过且添加了`vnode.data.keepAlive`，则直接调用`prepatch`方法，且传入的新旧`vnode`相同。

```
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },
```

`prepatch`的作用：简单的总结，就是依据新`vnode`中的数据，更新组件内容。

```
  insert (vnode: MountedComponentVNode) {
    if (!vnode.componentInstance._isMounted) {
      vnode.componentInstance._isMounted = true
      callHook(vnode.componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      activateChildComponent(vnode.componentInstance, true /* direct */)
    }
  },
```

在组件插入到页面后，如果是`vnode.data.keepAlive`则会调用`activateChildComponent`，这里面主要是调用子组件的`activated`钩子函数，并设置`vm._inactive`的标识状态。

```
  destroy (vnode: MountedComponentVNode) {
    if (!vnode.componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        vnode.componentInstance.$destroy()
      } else {
        deactivateChildComponent(vnode.componentInstance, true /* direct */)
      }
    }
  }
```

在组件销毁时，如果是`vnode.data.keepAlive`返回`true`，则只调用`deactivateChildComponent`，这里面主要是调用子组件的`deactivated`钩子函数，并设置`vm._directInactive`的标识状态。因为`vnode.data.keepAlive`为`true`的组件，是会被`keep-alive`缓存起来的，所以不会直接调用它的`$destroy()`方法，上面我们也提到了，当`keep-alive`组件被销毁时，会触发它缓存中所有组件的`$destroy()`。所以这里通过`vnode.data.keepAlive`返回`true`，仅仅执行`deactivateChildComponent` 而不是直接销毁子组件；

因为`keep-alive`包裹的组件状态变化，还会触发其子组件的`activated`或`deactivated`钩子函数，`activateChildComponent`和`deactivateChildComponent`也会做一些这方面的处理，细节大家可以自行查看。