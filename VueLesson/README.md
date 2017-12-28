### 主要记录自己开始学习Vue的一些源码阅读

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