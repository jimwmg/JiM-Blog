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

