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