---
title:  Vue组件实例属性
date: 2018-03-30
categories: vue
---

### `$attrs`

[参考](http://www.jb51.net/article/132371.htm)

[参考](https://juejin.im/post/596c7af1f265da6c251906c0)

* 默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 在子组件设置`inheritAttrs` 到 `false`，这些默认行为将会被去掉。


* 而通过 (同样是 2.4 新增的) 实例属性 `$attrs` 可以让这些特性生效，且可以通过 `v-bind` 显性的绑定到非根元素上。

注意：这个选项**不影响** `class` 和 `style` 绑定。

直白来说，如果父组件中向子组件传递了props，比如 `prop1  prop2  propp3` ,

*  如果在子组件中不通过 props属性接受这些值，那么这些属性将会在 `this.$attrs`上，同时会作为普通的HTML特性应用在子组件的根元素上；
*  如果在子组件中不通过 props属性接受这些值，那么这些属性将会在 `this.$attrs`上，如果 设置了`inheritAttrs`同为false,那么这些属性将不会作为普通的HTML特性应用在子组件的根元素上；
* 如果在子组件中通过 props属性接受了 某一些属性，比如 prop1 ，那么`this.$sttrs`将只会有剩下的未被接受的属性，比如此时就剩下 prop2. prop3