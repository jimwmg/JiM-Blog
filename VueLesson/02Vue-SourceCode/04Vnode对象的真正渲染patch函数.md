---
title:  Vnode对象真正渲染到页面
date: 2017-11-29
categories: vue
---

### 1 当生成虚拟DOM对象之后，需要将其渲染成真实DOM

```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      //这里当组件更新的时候，会执行到这里，首先调用beforeUpdate钩子函数
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    //prevVnode指的是旧的vnode，我们第一次创建时，没有旧的vnode，所以!prevVnode返回true，此时的操作就是创建根据vnode直接绘制dom到页面中。

//当数据更新再次调用_update方法时，prevVnode是旧的vnode，此时传入新旧两个虚拟dom对象，__patch__会对它们做diff，并相应修改页面展现。
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
    } else {
      //如果是更新组件，此时传入新旧两个虚拟dom对象，__patch__会对它们做diff，并相应修改页面展现。
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
  }
```

```javascript
// 销毁对象同样是通过__patch__方法。
Vue.prototype.$destroy = function () {
    ...
    vm.__patch__(vm._vnode, null)
    ...
  }
//从上面的代码我们看到销毁vue对象时，通过给__patch__第二个参数传入null，来从页面中删除相应dom。
```

### 2 找到`__patch__`函数

在platforms/web/runtime/patch.js中,这里就解释了src/core/vdom/patch.js中的nodeOps和modules都是哪些内容咯

```javascript
//node-ops主要是封装了操作节点的方法，比如如何创建元素，创建文本，创建注释节点，操作DOM节点（增加和删除等）和设置节点属性
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
//baseModules主要封装了如何处理元素上的directive和refs
import baseModules from 'core/vdom/modules/index'
//platformModules主要封装了如何处理真实DOM元素的属性，类名，和style,事件，以及
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

先看下`__patch__`函数所能接受的参数

`patch`函数接收6个参数：

- `oldVnode`: 旧的虚拟节点或旧的真实dom节点
- `vnode`: 新的虚拟节点
- `hydrating`: 是否要跟真是dom混合
- `removeOnly`: 特殊flag，用于`<transition-group>`组件
- `parentElm`: 父节点
- `refElm`: 新节点将插入到`refElm`之前

1. 如果`vnode`不存在但是`oldVnode`存在，说明意图是要销毁老节点，那么就调用`invokeDestroyHook(oldVnode)`来进行销毁

2. 如果`oldVnode`不存在但是`vnode`存在，说明意图是要创建新节点，那么就调用`createElm`来创建新节点

3. 当`vnode`和`oldVnode`都存在时

   - 如果`oldVnode`和`vnode`是同一个节点，就调用`patchVnode`来进行`patch`
   - 当`vnode`和`oldVnode`不是同一个节点时，如果`oldVnode`是真实dom节点或`hydrating`设置为`true`，需要用`hydrate`函数将虚拟dom和真是dom进行映射，然后将`oldVnode`设置为对应的虚拟dom，找到`oldVnode.elm`的父节点，根据vnode创建一个真实dom节点并插入到该父节点中`oldVnode.elm`的位置

   这里面值得一提的是`patchVnode`函数，因为真正的patch算法是由它来实现的（patchVnode中更新子节点的算法其实是在`updateChildren`函数中实现的，为了便于理解，我统一放到`patchVnode`中来解释）。

src/core/vdom/patch.js

```javascript
const hooks = ['create', 'activate', 'update', 'remove', 'destroy
export function createPatchFunction (backend) {
  //.....
  //注意传入的这个形参 oldVnode，对应的实参是 vm.$el ;
    return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
        let i, j
        const cbs = {}

        const { modules, nodeOps } = backend
//这里将modules数组中对应的hooks钩子函数放在cbs对象中，每一个cbs[hooks[i]]对应的是modules中所有的钩子函数组成的一个数组；
        for (i = 0; i < hooks.length; ++i) {
          cbs[hooks[i]] = []
          for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
              cbs[hooks[i]].push(modules[j][hooks[i]])
            }
          }
        }
    //如果vnode未定义，oldVnode定义，那么就销毁这个DOM元素
      if (isUndef(vnode)) {
        //这个是createPatchFunction中定义的函数；
        //这个函数在执行的时候，会执行该组件以及其子组件中生命周期
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
        return
      }

    let isInitialPatch = false
    const insertedVnodeQueue = []
//如果oldVnode未定义，isInitialPatch置为true，然后调用createElm，我们这个例子是定了vm.$el的；
    if (isUndef(oldVnode)) {
      //如果是子组件的挂载过程，会执行到这里；
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue, parentElm, refElm)
    } else {
      //所以会执行到这里,isRealElement返回值为 true ;但是当组件更新的时候，此时传入的oldVnode不是真实DOM节点
      const isRealElement = isDef(oldVnode.nodeType)
      //!isRealElement 为false
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        //更新组件的时候会执行到治理，进行虚拟DOM的diff算法
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        //所以执行到这里
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          //这里其实就是将 vm.$el这个真实存在的DOM元素转化为oldVnode这个是通过Vnode构造函数处理过的；同时在oldVnode中存在elm这个属性只想vm.$el这个真实的DOM元素；
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        //这里找到vm.$el的父级元素，这里就是body;
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        //将虚拟vnode节点创建完毕，生成真实DOM元素
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }
//移除原先旧的DOM节点
        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }
//将新的DOM节点插入其中
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

以上 `__patch__`函数从操作虚拟vnode节点，生成真实DOM节点，并且插入到根节点中的整个流程算是结束了，接下来看下具体的实现细节

### 3 createElm(node,insertedVnodeQueue,parentElm,refElm,nested)

```javascript
 function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested // for transition enter check
   //createComponent 对于 不是 我们自定义的组件vnode值，该函数执行后返回false;不会进入if语句内，可以继续往下执行；
   //createComponent 如果 是 自定义组件的vnode值，该函数执行后返回true,则会进入if语句，终止往下的执行；
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
//对于不是 我们自定义的组件，这里处理；生成原生DOM元素；
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode)

      /* istanbul ignore if */
      if (__WEEX__) {
       //......
      } else {
        //这里就会递归的创建子元素，主要的一些创建节点，属性，类，等的操作都在modules数组中；
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }
```

**createChildren (vnode, children, insertedVnodeQueue)** 

递归的创建所有的子节点

```javascript
function createChildren (vnode, children, insertedVnodeQueue) {
	if (Array.isArray(children)) {
	  for (let i = 0; i < children.length; ++i) {
        //如此循环，也会处理到自定义的组件，当处理自定义组件的时候
	    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true)
	  }
	} else if (isPrimitive(vnode.text)) {
	  nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text))
	}
}
```

**以上，假如我们的代码中没有自定义组件，那么从生成Vue实例==>vnode==>真实DOM 整个流程已经完毕了**

《new Vue构造函数》 《vnode对象如何生成》 《vnode对象真正的渲染patch函数》

如果Vue实例中有vue的子组件呢？其实就是在将上面的流程重复走一遍，接下来看下具体是如何实现的。

###4 递归处理自定义组件 

当createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested)

处理自定义组件的时候，createComponent返回true,所以会在createComponent里面处理我们自定义的组件逻辑；

patch.js

```javascript
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      //这里就会执行data[hook][init]这个函数，该函数是在patch.js中声明的，通过mergeHook函数给到的data对象；
      i(vnode, false /* hydrating */, parentElm, refElm)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

《vnode对象如何生成的？》文章分析了组件vnode中通过mergeHook给data添加了一些钩子函数，这里会执行其中的init

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
```

```javascript
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
  parentElm?: ?Node,
  refElm?: ?Node
): Component {
  const vnodeComponentOptions = vnode.componentOptions
  const options: InternalComponentOptions = {
    _isComponent: true,
    parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  //vnodeComponentOptions.Ctor 就是Sub构造函数：即子vue组件构造函数
  return new vnodeComponentOptions.Ctor(options)
  /**
  const Sub = function VueComponent (options) {
      this._init(options)
  }
  
  */
}

```

接着又回轮回道new Vue(option)中类似的步骤

不同的是

* 进入if (options && options._isComponent) 语句
* 不进入    if (vm.$options.el) 语句

```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    //===================================================================
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      //这个时候不会进入这里
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    //=====================================================================
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      //同样这个函数也不会进行
      vm.$mount(vm.$options.el)
    }
  }
}
```

```javascript
function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent
  opts.propsData = options.propsData
  opts._parentVnode = options._parentVnode
  opts._parentListeners = options._parentListeners
  opts._renderChildren = options._renderChildren
  opts._componentTag = options._componentTag
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

`$mount`方法会先处理模板，最终还是调用`src/core/instance/lifecycle`中的`Vue.prototype._update`方法渲染组件 ==> createElm 

至此，一个组件装载到DOM上的整个流程算是完毕了



### 5 总结

至此，我们将生成的虚拟DOM:vnode一步步的挂载到真实的DOM节点上的操作算是完成了，主要负责这部分工作的有两个

* modules数组中platformsModules和baseModules中操作各种节点，操作属性，操作类名等的封装以及指令的封装
* node-opts中操作元素，注释，文本，以及属性的原生操作；



### 参考

[patch源码分析](http://www.debugrun.com/a/jJYFZMo.html)