### 主要记录自己开始学习Vue的一些源码阅读：基于2.5.8版本

### Vue-SourceCode 介绍了

* Vue构造函数如何来的，以及其上的属性/方法/原型方法/静态方法
* new Vue(options)的过程发生了什么
* vnode对象如何生成
* vnode对象如何挂载到真实的DOM节点
* …..

### VueRouter-SourceCode介绍了

* VueRouter的插入，VueRouter的使用，VueRouter实例的生成
* VueRouter实例对象上的matcher和history对象的创建
* VueRouter中的Vue组件RouterLink和RouterView的源码实现

### Vuex-SourceCode介绍了

* Vuex的插入，Vuex的使用，Vuex.Store的实例生成
* Vuex实例生成：ModuleCollection installModule resetStoreVM等核心创建store实例的时候实现
* Vuex对象中的辅助函数 mapGetters. mapActions等的源码实现
* Vuex.Store生成的实例对象commit(同步)和dispatch(异步)的源码实现与区别

### 对比VueRouter和Vuex

* new VueRouter(options).   new Vuex.Store(options) 中的options都支持route嵌套和module嵌套
* route的嵌套，无论主路由还是子路由，都映射到了matcher对象上
* module的嵌套，无论主模块还是子模块，actions getters mutations都映射到了store对象上，所以后面在任何子组件中都可以通过辅助函数得到modules中的getters actions mutations等
* router-view组件根据matcher匹配到的组件进行渲染对应的组件
* 辅助函数可以在各个组件中获取到store实例对象上的actions. getters. mutations等；
* Vuex和Vue-Router都通过 Vue.mix 混入了 beforeCreate 函数，而该函数会在所有的vue组件中beforeCreate生命周期中的函数数组中的一个函数，并且在每个组件实例化的时候都会执行；

vue构建之后的文件：

| UMD              | CommonJS       | ES Module             |                    |
| ---------------- | -------------- | --------------------- | ------------------ |
| **Full**         | vue.js         | vue.common.js         | vue.esm.js         |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |

表格中的术语解释：

- **Full**：包含编译器和运行时的全部功能。
- **Runtime-only**：仅包含运行时。
- **UMD**：可通过 `<script>` 标签引入直接在浏览器中使用，Vue 会暴露一个全局变量 `window.Vue`。同时适配 `require.js` 这种 AMD 系统的使用。
- **CommonJS**：适配 `const Vue = require('vue')` 这种 node 式的模块系统。
- **ES Module**：适配 `import Vue from 'vue'` 这种 es6 提供的模块系统。

如果render和template都不存在，那么此时就是挂载 DOM 元素的 HTML 会被提取出来用作模板，此时，必须使用 Runtime + Compiler 构建的 Vue 库。 

### 其他优秀vue源码分析文章链接

[大白话Vue源码系列](https://www.cnblogs.com/iovec/category/1133262.html)

[vuejs技术揭秘](https://ustbhuangyi.github.io/vue-analysis/prepare/directory.html#compiler)

[vue技术揭秘](http://hcysun.me/vue-design/art/81vue-lexical-analysis.html)