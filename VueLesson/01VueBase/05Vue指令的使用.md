---
title:  Vue指令的使用
date: 2018-02-01
categories: vue
---

### v-bind

* 缩写  `:`

* 预期   any (with argument) | Object (without argument)

* 修饰符 

  1）.prop` - 被用于绑定 DOM 属性 (property)。

  2）.camel` - (2.1.0+) 将 kebab-case 特性名转换为 camelCase. (从 2.1.0 开始支持)`

  3）.sync` (2.3.0+) 语法糖，会扩展成一个更新父组件绑定值的 `v-on` 侦听器。

注意预期值的情况,对于预期值类型为 Object,可以是`{ } || [ ]`,其中数组中的值是一系列对象；

**如果数组中的对象中的属性值有相同的，那么后面的会覆盖前面的**

```vue
<my-component v-bind:name="name"></my-component>
<my-component :name="name"></my-component>
<my-component v-bind={name:'jhon',age:13}></my-component>
<my-component v-bind=[obj1,obj2]></my-component>
```

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

### v-model

**model 绑定的值会作为一个属性prop传入组件中**

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等类型的输入控件可能会将 `value` 特性用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突