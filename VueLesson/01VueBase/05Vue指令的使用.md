---
title:  Vue指令的使用
date: 2018-02-01
categories: vue
---

### v-bind





### v-on

- **缩写**：`@`
- **预期**：`Function | Inline Statement | Object`
- **参数**：`event`

```vue
<!-- 自定义事件绑定在元素上 -->
<!-- 内联语句 -->
<button v-on:click="doThat('hello', $event)"></button>
<button @click="msg=111"></button>  //接受表达式 Inline Statement
<!-- 函数语法 -->
<button v-on:click="doThis"></button>

<!-- 对象语法 (2.4.0+) -->
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
<!-- 自定义事件绑定在组件上 -->
<my-component @my-event="handleThis"></my-component>

<!-- 内联语句 -->
<my-component @my-event="handleThis(123, $event)"></my-component>

<!-- 组件中的原生事件 -->
<my-component @click.native="onClick"></my-component>


```

### v-if

`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

也就是说在 `v-if ` 可以执行组件的整个生命周期，`true`的时候 create ,`false` 的时候destroy