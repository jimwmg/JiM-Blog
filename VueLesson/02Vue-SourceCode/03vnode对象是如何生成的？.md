---
title:  vnode对象是如何生成的？
date: 2017-12-01
categories: vue
---

### 1 首先来看下vnode对象主要包括什么

VNode对象：

一个VNode的实例对象包含了以下属性

- `tag`: 当前节点的标签名
- `data`: 当前节点的数据对象，具体包含哪些字段可以参考vue源码`types/vnode.d.ts`中对`VNodeData`的定义
  ![img](https://segmentfault.com/img/bVITKL?w=419&h=458)
- `children`: 数组类型，包含了当前节点的子节点
- `text`: 当前节点的文本，一般文本节点或注释节点会有该属性
- `elm`: 当前虚拟节点对应的真实的dom节点
- `ns`: 节点的namespace
- `context`: 编译作用域
- `functionalContext`: 函数化组件的作用域
- `key`: 节点的key属性，用于作为节点的标识，有利于patch的优化
- `componentOptions`: 创建组件实例时会用到的选项信息
- `child`: 当前节点对应的组件实例
- `parent`: 组件的占位节点
- `raw`: raw html
- `isStatic`: 静态节点的标识
- `isRootInsert`: 是否作为根节点插入，被`<transition>`包裹的节点，该属性的值为`false`
- `isComment`: 当前节点是否是注释节点
- `isCloned`: 当前节点是否为克隆节点
- `isOnce`: 当前节点是否有`v-once`指令

```javascript

export default class VNode {
  constructor (
    tag?: string,//宿主节点或者组件节点 
    data?: VNodeData,  //data存放了该节点的描述对象，包括style attr key ref is on directive等属性
    children?: ?Array<VNode>,//子vnode对象信息
    text?: string,//文本节点
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
     //组件节点的信息，包括Ctor,tag,vnodeData,children(vnode对象)
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
      //children上放了一个vnode对象组成的数组[vnode1,vnode2]
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context  //每一个vnode对应的组件实例对象vm
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key  //每一个标签上的key属性值
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```



VNode分类：(src/core/vdom/vnode.js)

`VNode`可以理解为vue框架的虚拟dom的基类，通过`new`实例化的`VNode`大致可以分为几类

- `EmptyVNode`: 没有内容的注释节点

```javascript
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```

- `TextVNode`: 文本节点

```javascript
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

- `ElementVNode`: 普通元素节点

```javascript
vnode = new VNode()
```

- `ComponentVNode`: 组件节点

```javascript
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }
  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}
```

- `CloneVNode`: 克隆节点，可以是以上任意类型的节点，唯一的区别在于`isCloned`属性为`true`

```javascript
export function cloneVNodes (vnodes: Array<VNode>, deep?: boolean): Array<VNode> {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}
```

### 2 在《new Vue构造函数》 文章中，没有详细解释vnode对象是如何生成的，这里深入来看一下

```html
<div id="app">
  <p>{{message}}</p>
  <my-comp parent='parentData' v-bind:msg="message"></my-comp>
</div>
```

```javascript
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

```javascript
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (const key in vm.$slots) {
        const slot = vm.$slots[key]
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */)
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } catch (e) {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } else {
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```



`vm._render()`在执行的时候，会执行如下这个拼接好的函数，而这个函数就一个作用，返回 vnode，而真正创建vnode的是`vm._c`这个函数；

```javascript
render = function () {
    //这里的with语句使得可以直接通过 _c访问this上的方法 _c;这个在 2.5 initRender中给vm添加了_c方法
	with(this){return _c('div',{attrs:{"id":"app"}},
      [
  //注意这里的理解，在这个数组中，数组中的每个元素都是  _c函数的返回值，也就是说数组中的值都是vnode对象
        _c('p',[_v(_s(message))]),
        _c(myComp,{attrs:{"parent":"parentData","msg":"message"}})
      ])}
	}
//上面的例子，每个 _c函数返回值都是一个vnode对象；
```

```javascript
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
//vm.$creaateElement 这个函数是当组件自己写了render函数的时候会调用,表示会对子元素进行最高级的归一化处理。
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
// render self
let vnode
//这里就执行了那个编译之后的render函数
vnode = render.call(vm._renderProxy, vm.$createElement)
```

src/core/vdom/create-element.js中 _c 就是下面这个createElement函数，生成每一个具体的DOM节点的描述，其中的data对象是经过编译后的如下形式：

**data对象参数形式（也就是b这个形参对应的实参）**

```javascript
{
  // 和`v-bind:class`一样的 API
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 正常的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意事项：不能对绑定的旧值设值
  // Vue 会为您持续追踪
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Scoped slots in the form of
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef',
  is:''   //动态组件
}

```

```javascript
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

export function createElement (
  context: Component,
  tag: any,//a
  data: any,//b
  children: any,//c
  normalizationType: any,//d
  alwaysNormalize: boolean//false 或者 true
): VNode {
  //兼容不传data的情况
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  //// 如果alwaysNormalize是true
  // 那么normalizationType应该设置为常量ALWAYS_NORMALIZE的值
//这里是针对组件中自己写了render函数的时候，会调用vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  //这里创建虚拟vnode对象，返回vnode对象
  return _createElement(context, tag, data, children, normalizationType)
}
```

接下来看下 _createElement(context, tag, data, children, normalizationType)的返回值。

src/core/vdom/create-element.js

```javascript
export function _createElement (
  context: Component,
   //tag用于标识是原声的DOM还是自定义的Vue组件
  tag?: string | Class<Component> | Function | Object,
   //这里的data就是标签上所有的属性键值对组成的对象集合： 
 //{attrs:{"id":"app"},style:{}}等,详情如上data对象
  data?: VNodeData,
   //children就是标签下面的的子元素
  children?: any,
  normalizationType?: number
): VNode {
  //首先判断data这个对象是否存在，并且是否已经被监听
   /**
   * 如果存在data.__ob__，说明data是被Observer观察的数据
   * 不能用作虚拟节点的data
   * 需要抛出警告，并返回一个空节点
   * 
   * 被监控的data不能被用作vnode渲染的数据的原因是：
   * data在vnode渲染过程中可能会被改变，这样会触发监控，导致不符合预期的操作
   */

  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind  动态组件
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  // 当组件的is属性被设置为一个falsy的值
  // Vue将不会知道要把这个组件渲染成什么
  // 所以渲染一个空节点
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    )
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 根据normalizationType的值，选择不同的处理方法
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  //如果标签名是字符串，
  if (typeof tag === 'string') {
    let Ctor
    //获取标签的命名空间
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    //是否是保留标签，
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      //如果是则创建保留标签的虚拟vnode对象
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
      //如果不是保留标签，那么从vm的components属性上查找是否有这个标签的定义，
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component  如果找到了这个组件的标签定义，那么就创建该组件的vnode对象；
      //无论是全局注册还是局部组件的组件，都会在组件实例对象vm.$options.components数组中存放着；
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    // 当tag不是字符串的时候，我们认为tag是组件的构造类
    // 所以直接创建
    vnode = createComponent(tag, data, context, children)
  }
  if (isDef(vnode)) {
    if (ns) applyNS(vnode, ns)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

结合上面的实例

```javascript
vm.$option.components 中有如下key-value值：
{ 
  myComp:f VueComponent(options),
  my-component:{template: '<div>children component!</div>'}
}
```

**所以传入createComponent函数的Ctor可能是对象，也可能是异步组件函数，也可能是组件`<Componnet>`；**

```javascript
//异步组件函数
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

```javascript
vnode = createComponent(Ctor, data, context, children, tag)
```

最后我们来看下Vue是如何创建组件的虚拟dom vnode对象的：createComponent的具体实现：

**需要重点注意的一点就是对于Vue组件的Vnode对象的创建，会在次将描述这个节点的data对象进行处理，比如增加一些生命周期函数，处理props等，保证组件生成的vnode对象上也有清晰的描述该组件节点的信息，包括生命周期，接受来自父组件的props等**

先整体看下这个文件中有什么内容 src/core/vdom/create-component.js

```javascript
import {
  callHook,
  activeInstance,
  updateChildComponent,
  activateChildComponent,
  deactivateChildComponent
} from '../instance/lifecycle'

// hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
    init:function(){},
    prepatch:function(){},
    insert:function(){},
    destroy:function(){}
}
const hooksToMerge = Object.keys(componentVNodeHooks)
export function createComponent(){};
export function createComponentInstanceForVnode(){}
```

接下来看下具体的实现细节

```javascript
export function createComponent (
Ctor: Class<Component> | Function | Object | void,
 data: ?VNodeData,
 context: Component,
 children: ?Array<VNode>,
 tag?: string
): VNode | void {
  if (isUndef(Ctor)) {
    return
  }
//这个其实就是Vue构造函数
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    //对应这个子组件：my-component:{template: '<div>children component!</div>'}
    //如果是一个对象，那么生成Vue子组件：Ctor = Vue.extend(Ctor)
    Ctor = baseCtor.extend(Ctor)
  }
//myComp:f VueComponent(options),这个子组件本来就是Vue.extend(option)操作过的子组件；返回的是一个函数
  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }
//具体查看 《Vue中异步组件的加载源码》
  //https://github.com/jimwmg/JiM-Blog/tree/master/VueLesson/02Vue-SourceCode
  // async component  //这个就是异步组件； () => import('./my-async-component')
  let asyncFactory
  if (isUndef(Ctor.cid)) { //很明显这个import没有定义uid这个参数；
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  //防止Vue.extend(option)返回的函数上没有Vue.option等相关属性
  //关于Vue.extend(option),可以查看《Vue常用的静态方法》
  resolveConstructorOptions(Ctor)
  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }
//这里，如果通过props给子组件传递了值，那么在定义子组件的时候，就会覆盖掉定义子组件的props中的default的值
//将子组件中定义的props和通过属性值传递到子组件的props进行整合，给到vnode.data(描述节点信息的对象)
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component   router-view组件会走这里
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // merge component management hooks onto the placeholder node
  //这里给data一些钩子函数，生成的VNode上会有这些函数；在挂载组件生成真实的DOM的时候会用到；
    //包括init prepatch insert destroy
  mergeHooks(data)
  // return a placeholder vnode
  const name = Ctor.options.name || tag
  //最终生成组件的vnode对象；
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    //componentOptions  这里的Ctor就是Vue.extend(option)返回的Sub,也就是子组件的构造函数
    //区别Vue构造函数和Sub构造函数在《Vue常用静态方法Extend-Component》文章中有分析；
  //componentOptions?: VNodeComponentOptions,vNode构造函数中就是下面这个；
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}
```

首先要注意的一点就是对于自定义组件生成vnode的处理有两种常用的情况，一种是函数式组件，一种不是

```
													/ createFunctionalComponent
createElement==>_createElement ==> createComponent 									==> vnode
  													\ new VNode(options)
```

对于函数式组件在《RouterView和RouterLink》源码中分析

这里还有一点比较重要的就是mergeHooks

```javascript
const componentVNodeHooks = {
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

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
const hooksToMerge = Object.keys(componentVNodeHooks) 
function mergeHooks (data: VNodeData) {
    if (!data.hook) {
      data.hook = {}
    }
    for (let i = 0; i < hooksToMerge.length; i++) {
      const key = hooksToMerge[i]
      const fromParent = data.hook[key]
      const ours = componentVNodeHooks[key]
      data.hook[key] = fromParent ? mergeHook(ours, fromParent) : ours
    }
  }

```

**以上只有组件创建的VNode中data才有data.hook钩子函数数组，这点在patch中可以判断是否是组件的装载；**

```html
<body>
    <div id='demo'></div>
    <div id='dv'>
        <p >{{obj.color}}</p>
      <-- 注意这里，通过props传递了 from-parent msg o 这3 个属性，那么在子组件定义的时候，也必须在props属性中定义这三个属性，才能在子组件中使用-->
        <my-comp from-parent='parentData' v-bind:msg="message" :o ='obj'></my-comp>
    </div>
    <div id='tep'>

    </div>
    <script>
        //  注意注册组件的时候，组件名字不能是尽量 'my-comp' 而不要'myComp' ，因为会解析成 mycomp,如果要这么定义，那么使用的时候需要 'my-comp';
        //这是因为html标签仅支持小写，对于我们写的组件名称包含驼峰的时候，使用的时候需要用连字符 - ；
        var myComp = Vue.extend({
            data(){
                console.log(this);
                return {               
                    parent:"meassage"
                }
            },
          //这个数组中的三个值少了任何一个都会报错；
            props:['fromParent','msg'，'o'],
            template:' <div><p>{{fromParent}}</p><span>{{msg}}</span><input v-model:value="o.color">{{o.color}}</></div>'
        });
        Vue.component('myComp',myComp)
        var vm = new Vue({
            el:"#dv",
            // data:{message:"vueMessage"},
            data:function(){
                return {
                    message:"functionMEssage",
                    obj:{
                        color:"red"
                    }
                }
            },
            props:{'name':'jhon'}
            // components:{'myComp':myComp},
        })
        
    </script>
</body>
```

