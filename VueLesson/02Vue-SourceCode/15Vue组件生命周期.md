---
title:  Vue组件生命周期
date: 2018-02-08
categories: vue
---

## 前提

《new Vue构造函数》《vnode对象是如何生成的》《vnode对象的真正渲染》

**组件生命周期**(路由的生命周期暂时不考虑)

```
beforeCreate. created  beforeMounted mounted  beforeUpdate updated. beforeDestroy destroyed  activated deactivated 
```

### 1 [demo代码地址](https://github.com/jimwmg/vue-lifecycle)

index.html

```html
<div id="app">
    <router-view></router-view>
</div>
```

main.js

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
const VueRouter = new VueRouter({
    routes:{
        path:'/',
        component:APP,
        children:[
            {
               	path:'/home',
            	component:HOME
            },
            {
                path:'/msite',
                component:MISTE,
                meta: { keepAlive: true },//这个组件会被缓存
            }
        ]
    }
});
new Vue(VueRouter).$mount('#app')
```

App.vue

```vue
<template>
    <transition name="router-fade" mode="out-in">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
</template>
<script>
  	export default {
    	
		beforeCreate(){
			console.log('APP.Vue BeforeCreate')
		},
		created(){
			console.log('APP.Vue Created')
		},
		beforeMount(){
			console.log('APP.vue beforeMounted')
		},
		mounted(){
			console.log('APP.vue mounted')
		},
		activated(){
			console.log('APP.vue actived')
		},
		deactivated(){
			console.log('APP.vue deactived')
		},
        updated(){
        	console.log('APP.vue updated')
    	},
		beforeDestroy(){
			console.log('APP.vue beforeDestroy')
		},
		beforeDestroy(){
			console.log('APP.vue beforeDestroy')
		},
		destroyed(){
			console.log('App.vue destroyed')
		}
  	}

</script>
```

Home.vue

```vue
<template>
	<div>
        home
    </div>
</template>
<script>
export default {
    beforeCreate(){
        console.log('HOME.Vue BeforeCreate')
    },
    created(){
        console.log('HOME.Vue Created')
    },
    beforeMount(){
        console.log('HOME.vue beforeMounted')
    },
    mounted(){
        console.log('HOME.vue mounted')
    },
    activated(){
        console.log('HOME.vue actived')
    },
    deactivated(){
        console.log('HOME.vue deactived')
    },
    beforeUpdate(){
        console.log('HOME.vue beforeupdate')
    },
    updated(){
        console.log('HOME.vue update')
    },
    beforeDestroy(){
        console.log('HOME.vue beforeDestroy')
    },
    destroyed(){
        console.log('HOme.vue destroyed')
    }
}
</script>
```

Miste.vue

```vue
<template>
<div>
    miste
    </div>
</template>
<script>
    export default {
        beforeCreate(){
            console.log('msite.Vue BeforeCreate')
        },
        created(){
            console.log('msite.Vue Created')
        },
        beforeMount(){
            console.log('msite.vue beforeMounted')
        },
        mounted(){
            console.log('miste.vue mounted')
        },
        activated(){
            console.log('msite.vue actived')
        },
        deactivated(){
            console.log('msite.vue deactived')
        },
        beforeUpdate(){
            console.log('miste.vue beforeupdate')
        },
        updated(){
            console.log('miste.vue update')
        },
        beforeDestroy(){
            console.log('miste.vue beforeDestroy')
        },
        destroyed(){
            console.log('miste.vue destroyed')
        },
    }
</script>
```

我们可以在地址栏： 改变路径看下对应的输出情况，我们会发现

```javascript
'/'
'/home'   //在此地址刷新页面
'/miste'  //在此地址刷新页面
```

‘/home’： 强制刷新页面，输出如下，其余的可以自行尝试

```
APP.Vue BeforeCreate
APP.Vue Created
APP.vue beforeMounted
HOME.Vue BeforeCreate
HOME.Vue Created
HOME.vue beforeMounted
HOME.vue mounted
APP.vue mounted
```

* 对于组件，每次重新F5刷新页面的时候，会执行该组件的生命周期函数，也就是相当于组件会重新挂载，无论是否为keep-alive组件
* 但是当我们点击前进或者退回按钮的时候，对于keep-alive组件，则只会执行 activated(切换回来) deactivated（切换出去）  两个生命周期
* 对于没有被keep-alive包裹的组件，则会执行beforeDestroy destoryed,在此切换回来的时候，还会重新create

### 2 从源码的角度来理解组件的生命周期

在《new Vue构造函数》中，会有如下一步：

执行  `_init`函数

```javascript
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate') //app组件的beforeCreate 
//....
callHook(vm, 'created') //app组件的created
if (vm.$options.el) {
    vm.$mount(vm.$options.el)
}
```

####2.1 挂载阶段 beforeMount.  mounted

`vm.$mount`中会执行到下面这个函数

```javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  //执行定义的生命周期函数 beforeMount
  callHook(vm, 'beforeMount')  //这里相当于执行app组件的beforeMouted’

  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    //这里定义了updateComponent函数
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  /* istanbul ignore if */
  vm._watcher = new Watcher(vm, updateComponent, noop) //会执行updateComponent，进而调用__patch__进行vnode到DOM的渲染
  //给hydrating 赋值为false
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    //此时生命周期mounted函数可以操作DOM，因为真实DOM已经挂载完成；
    callHook(vm, 'mounted')
  }
  return vm
}
```

上面在`beforeMount`和`mounted`中间的代码有两个部分很重要

```
vm._render()  用于生成vnode对象 《vnode对象是如何生成的》
```

```
vm._update()  用于将vnode对象挂载，而如果vnode对象还是一个组件，那么就会执行这个组件的生命周期，等这个组件挂载完毕之后，最后在执行最外层组件的mounted生命周期函数 《vnode对象的真正渲染》
```

中间的代码部分会对子组件进行同样的挂载

#### 2.2 更新阶段 beforUpdate  updated

当我们对某个组件的data或者props进行更改的时候，会触发该组件上的 updateComponent，他的触发流程是下面这样的

* 首先触发该属性依赖dep数组中的Watcher实例对象的update函数；将该属性依赖的的所有Watcher实例对象放入queueWatcher

```java 
notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
}  
update () {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()
    } else {
        queueWatcher(this)
    }
}

```

```javascript
export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

```javascript
function flushSchedulerQueue () {
  flushing = true
  let watcher, id
  queue.sort((a, b) => a.id - b.id)
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()  //这里就是执行 updateComponent ，也就是执行Vue.prototype._update
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

```javascript
 Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
     //这里的意思是 updated生命周期函数会在scheduler中执行
  }
```

#### 2.3 对于更新的过程中遇到keep-alive组件的情况和上面一样

在《vnode对象的真正渲染》中详细讲解了`Vue.prototype._update`的过程

vdom/create-component.js中

```javascript
//第一个参数是组件的vnode对象，第二个参数是false,第三个参数是parentElm(vm.$el的parentNode),第四个参数是refElm(vm.$el的nextSilibing);
init (
    vnode: VNodeWithData,
    hydrating: boolean,
    parentElm: ?Node,
    refElm: ?Node
): ?boolean {
    //对于keep-alive组件，我们暂且不管。如果vnode.componentInstance不存在或已经销毁，则通过createComponentInstanceForVnode方法来创建新的Vue实例。
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
        //这里执行 new Sub(options),所以会接着执行Vue.prototype._init函数 ==>beforeCreate==> 生成Vue组件实例对象==>created
        const child = vnode.componentInstance = createComponentInstanceForVnode(
            vnode,
            activeInstance,
            parentElm,
            refElm
        )
        //在这里执行挂载方法；child就是子组件的vm实例对象
        child.$mount(hydrating ? vnode.elm : undefined, hydrating)
        //又会重复执行  ==> 编译该子组件的render函数 ==> beforeMount ==> 执行编译之后的render函数生成vnode对象 ==> createElm(vnode,...) ==> 生成真实的DOM ==> monted 
    } else if (vnode.data.keepAlive) {
        // kept-alive components, treat as a patch
        const mountedNode: any = vnode // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode)
    }
},
    prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
        const options = vnode.componentOptions
        const child = vnode.componentInstance = oldVnode.componentInstance
        updateChildComponent(   //$forceUpdate
            child,
            options.propsData, // updated props
            options.listeners, // updated listeners
            vnode, // new parent vnode
            options.children // new children
        )
    },

```

```javascript

```



