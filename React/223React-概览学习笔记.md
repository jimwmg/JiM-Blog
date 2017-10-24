---
title:  React 概览学习笔记
date: 2017-05-12 12:36:00
categories: react
tags : react
comments : true 
updated : 
layout : 
---

这是一些比较碎的知识点整理,不建议大家阅读,仅仅是自己的一些总结而已

1 组件的props属性

* 可以通过扩展运算符展开进行写入组件,这种方式省去了我们要一个个写属性的麻烦
* 属性键值相同的话,后面的会覆盖前面的

```jsx
var props = { foo: 'default',bar:'baz' };
var component = <Component {...props} foo={'override'} />;
console.log(component.props.foo); // 'override'
```

2 组件的ref属性

* 组件的ref属性可以用在DOM元素上,如果用在DOM元素上,那么该属性将会等于一个callback函数,该函数接受此DOM元素作为参数

* When the `ref` attribute is used on a custom component declared as a class, the `ref`callback receives the mounted instance of the component as its argument

  如果组件的ref属性用在class声明的组件上,那么回调函数接受的参数是实例化的组件

* 组件在装载或者卸载之后,ref指向的callback函数会立即执行,可以在组件中通过componentDidMount函数来进行判断

* ​

