---
title:  new Vue(option)
date: 2017-11-27 
categories: vue
---

### 1 new Vue(option)中的option可以属性值的取值

基本使用

```html
<div id="app">
  {{ message }}
</div>
```

```javascript
console.dir(Vue) ;//我们可以看下Vue构造函数上的静态属性和原型属性都有哪些值，下面会分析这些属性的来源；
var vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  computed:{
    reverseMessage:function(){
      return this.message.split('').reverse().join("");
    }
  },
});
console.dir(vm) ;//同时看下输出的 Vue实例对象上的属性都有哪些，下面会分析这些属性是如何挂载上去的；
```

github搜VUE可以找到对应的源码

el 和 template 同时存在的时候，template会替换掉el对应的节点；

### 2 从源码的角度来看各个属性的取值是如何限制的

#### 2.1 el属性

当我们的vm实例对象生成之后，就要执行 $mount 方法，该方法第一步就是要获取  el. 属性所代表的DOM节点

```javascript
el = el && query(el)
//
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
```

所以new Vue(option)中对el的接受   String |  Element作为参数；但是最终查询的结果不能是body或者html

```javascript
  el:document.getElementById('example'),
  el:"#example",
  el:document.querySelector('#example'),
    //下面这两个都会报错
  el：document.body
  el:document.html
```

在 [https://github.com/jimwmg/JiM-Blog/tree/master/VueLesson]中 new Vue构造函数博文中，可以看到在

```javascript
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

#### 2.2 data属性 provide属性

会执行到合并策略，starts.data   start.provide这些合并策略支持data属性可以是函数，返回一个对象，或者是一个纯对象

#### 2.3 computed属性,methods属性，inject属性，props属性

会执行合并策略，starts.computed  starts.methods   starts.inject   starts.props 这些合并策略支持以上属性是一个纯对象

#### 2.4 components属性  filters属性  directives属性

会执行到合并策略，starts.components. starts.filters.  starts.directives 这些合并策略支持以上属性是一个纯对象

