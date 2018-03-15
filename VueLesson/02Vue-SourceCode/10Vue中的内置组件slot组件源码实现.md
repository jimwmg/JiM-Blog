---
title:  Vue中slot插槽的实现
date: 2018-01-08 
categories: vue
---

### 1 内置组件包括：有以下内置的抽象组件

* keep-alive
* transition
* transition-group
* component
* slot

首先从整体上知道插槽的种类

* 匿名插槽
* 具名插槽
* 作用域插槽

### 2 匿名插槽

* 基本使用:匿名插槽中没有内容，其作用就是显示父组件中所有子组件默认slot属性值为default的子元素

situation1 :

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <app-layout>
<!--子元素默认slot属性值为default,所有子元素slot属性值为default的值都会在`<slot></slot>`标签中出现,如果没有则会被丢弃-->
            <div>随便什么内容</div>
        </app-layout>
    </div>
    <script type="text/javascript">
        var AppLayout = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落。</p>'+
                '<div>另一个主要段落。</div>'+
                '</div>'
        })
        var vm = new Vue({
            el: '#app',
            components: {
                AppLayout: AppLayout
            }
        })
    </script>
</body>
```

这里会渲染成

```html
<div>
  <p>主要内容的一个段落。</p>
  <div>另一个主要段落。</div>
</div>
```

situation2 

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <app-layout>
<!--子元素默认slot属性值为default,所有子元素slot属性值为default的值都会在`<slot></slot>`标签中出现,如果没有则会被丢弃-->
            <div>随便什么内容</div>
        </app-layout>
    </div>
    <script type="text/javascript">
        var AppLayout = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落。</p>'+
                '<div>另一个主要段落。</div>'+
                '<slot></slot>'+
                '</div>'
        })
        var vm = new Vue({
            el: '#app',
            components: {
                AppLayout: AppLayout
            }
        })
    </script>
</body>
```

这里会渲染成

```html
<div>
  <p>主要内容的一个段落。</p>
  <div>另一个主要段落。</div>
  <div>随便什么内容</div>
</div>
```

`<app-layout></app-slayout>` 中所有的子元素会被替换掉匿名元素`<slot></slot>` 所在的位置；

```html
<app-layout>
  <div>随便什么内容</div>
</app-layout>
```

situation3:

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <app-layout>
            <div>随便什么内容</div>
            <div>随便什么内容</div>
        </app-layout>
    </div>
    <script type="text/javascript">
        var AppLayout = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落。</p>'+
                '<div>另一个主要段落。</div>'+
                '<slot>app-lout标签下没有子元素的时候，我才显示</slot>'+
                '</div>'
        })
        var vm = new Vue({
            el: '#app',
            components: {
                AppLayout: AppLayout
            }
        })
    </script>
</body>
```

最后被渲染为

```html
<div>
  <p>主要内容的一个段落。</p>
  <div>另一个主要段落。</div>
  <div>随便什么内容</div>
  <div>随便什么内容</div>
</div>
```

situation4:

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <app-layout>
            <div>随便什么内容</div>
            <div>随便什么内容</div>
        </app-layout>
    </div>
    <script type="text/javascript">
        var AppLayout = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落。</p>'+
                '<div>另一个主要段落。</div>'+
                '<slot>app-lout标签下没有子元素的时候，我才显示</slot>'+
                '</div>'
        })
        var vm = new Vue({
            el: '#app',
            components: {
                AppLayout: AppLayout
            }
        })
    </script>
</body>
```

最后被渲染为

```html
<div>
  <p>主要内容的一个段落。</p>
  <div>另一个主要段落。</div>
  "app-lout标签下没有子元素的时候，我才显示" 
</div>
```

根据上面的situation1 2 和situation3 4 可以作证官网以下两个结论：

* 除非子组件模板包含至少一个 `<slot>` 插口，否则父组件的内容将会被**丢弃**。当子组件模板只有一个没有属性的插槽时，父组件传入的整个内容片段将插入到插槽所在的 DOM 位置，并替换掉插槽标签本身。
* 最初在 `<slot>` 标签中的任何内容都被视为**备用内容**。备用内容在子组件的作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示备用内容。

### 3 具名插槽

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id="app">
        <app-layout>
            <h3 slot="header">如果有slot插槽name属性为header的我就显示</h3>

            <p slot="footer">如果有slot插槽name属性为footer的我就显示</p>
            <div>随便什么内容</div>
            <div>随便什么内容</div>
        </app-layout>
    </div>
    <script type="text/javascript">
        var AppLayout = Vue.extend({
            template:'<div>'+
                '<p>主要内容的一个段落。</p>'+
                '<div>另一个主要段落。</div>'+
                '<slot>app-lout标签下没有子元素的时候，我才显示</slot>'+
                '<slot name="header"></slot>'+
                '<slot name="footer"></slot>'+
                '</div>'
            
        })
        var vm = new Vue({
            el: '#app',
            components: {
                AppLayout: AppLayout
            }
        })
    </script>
</body>
```

最后被渲染为

```html
<div>
<p>主要内容的一个段落。</p>
<div>另一个主要段落。</div>
<div>随便什么内容</div>
<div>随便什么内容</div>
<h3 slot="header">如果有slot插槽name属性为header的我就显示</h3>
<p slot="footer">如果有slot插槽name属性为footer的我就显示</p>
</div>
```

* `<slot>` 元素可以用一个特殊的特性 `name` 来进一步配置如何分发内容。多个插槽可以有不同的名字。具名插槽将匹配内容片段中有对应 `slot` 特性的元素。
* 仍然可以有一个匿名插槽，它是**默认插槽**，作为找不到匹配的内容片段的备用插槽。如果没有默认插槽，这些找不到匹配的内容片段将被抛弃。

总结来说就是在解析app-loyout组件的时候，该组件下面标签没有slot属性的，默认slot属性为default,所有没有slot属性的标签都会在app-loyout的模版中`<slot></slot>`标签中显示；

**对于app-loyut组件内，子元素的标签上有slot = 'anyName'的属性的，那么该子元素就会在`<slot name='anyName'></slot>`中显示；**

**可以通过输出`vm.$children[0].$slots`来深刻理解下，下面就是对$slot的挂载的解释**

###4 作用域插槽

在父级中，具有特殊特性 `slot-scope` 的 `<template>` 元素必须存在，表示它是作用域插槽的模板。`slot-scope` 的值将被用作一个临时变量名，此变量接收从子组件传递过来的 prop 对象：

child.vue 组件，**单个插槽；**

```vue
<div class="child">
  <slot text="hello from child"></slot>  //这里的props属性，就是在父组件中slot-scope对应的变量接受
</div>
```

parent.vue 组件

```vue
<div class="parent">
  <child>
    <template slot-scope="props">  //props可以为一个变量 a. b.  c 都可以，
      <span>hello from parent</span>
      <span>{{ props.text }}</span>  //这里对应的也需要通过 a.text.  b.text来接受
    </template>
  </child>
</div>
```

最后渲染的结果

```vue
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```



### 5 源码分析 

但是为什么会出现这样的效果呢？

首先我们要知道在 《new Vue构造函数》中解释了，new Vue(options)中会对所有的子组件执行类似new Vue的操作，生成VNode对象；

对于AppLayout组件,也会执行到这一步；在创建新对象时会把`app-layout`的子元素，传递给构造函数。在`initRender`时，把子内容处理后添加给`vm.$slots`。

```javascript
export function initRender (vm: Component) {
  ...
  const parentVnode = vm.$options._parentVnode
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext)
  ...
}

```

```javascript	
export function resolveSlots (
	  children: ?Array<VNode>,
	  context: ?Component
	): { [key: string]: Array<VNode> } {
	  const slots = {}
	  if (!children) {
	    return slots
	  }
	  const defaultSlot = []
	  let name, child
	  for (let i = 0, l = children.length; i < l; i++) {
	    child = children[i]
	    // named slots should only be respected if the vnode was rendered in the
	    // same context.
	    if ((child.context === context || child.functionalContext === context) &&
	        child.data && (name = child.data.slot)) {
	      const slot = (slots[name] || (slots[name] = []))
	      if (child.tag === 'template') {
	        slot.push.apply(slot, child.children)
	      } else {
	        slot.push(child)
	      }
	    } else {
	      defaultSlot.push(child)
	    }
	  }
	  // ignore whitespace
	  if (!defaultSlot.every(isWhitespace)) {
	    slots.default = defaultSlot
	  }
	  return slots
	}

	function isWhitespace (node: VNode): boolean {
	  return node.isComment || node.text === ' '
	}
```

最后生成的 $slots对象类似于

```javascript
{
	default: [vNode,vNode,...,_rendered:true],
	header: [vNode,_rendered:true], 
	footer: [vNode,_rendered:true] 
}

```

所以最后真正渲染AppLayout组件的，在解析起template模版的时候，

* slot匿名标签，就会去取所有的匿名标签（default）所代表的vNode进行渲染;
* slot具名标签，就会去取所有的具名标签（footer\header）所代表的vNode进行渲染；





