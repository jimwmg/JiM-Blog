---
title: Vuex对象中辅助函数源码分析
date: 2017-12-27
categories: vue
---

### 1 先看下Vuex是一个怎样的对象

```javascript
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

### 2 看下辅助函数是如何使用的

主要是在组件中将store中某个属性，映射给每个组件中应用

在不使用辅助函数的时候

```javascript
export default {
  // ...
  computed: {
    doneTodosCount () {
      return this.$store.getters.doneTodosCount
    },
    anotherGetter () {
      return this.$store.getters.anotherGetter
    },
  }
}

```

使用mapGetters

```javascript
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}

```

### 3 源码实现分析

