---
title: eel-emitter
---

### 1 使用

```javascript
this.dispatch('ElCheckboxGroup', 'input', [val]);
this.broadcast('ElCheckboxGroup', 'input', [val]);
```

### 2 源码

```javascript
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
      // 子组件中调用，是可以出发父组件中指定组件名字的对应的事件
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
      // 父组件中调用，是可以向子组件广播一个事件，触发子组件中对应的事件
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```

### 3 数据结构层面的分析

 3.1 dispatch: 子组件向父组件通知一个事件，利用vue组件之间的父子组件之间的链接，通过组件某个具体的标记，找到对应的父组件，然后触发要分发的事件；

 3.2 broadcast：父组件向所有的子组件进行广播某个事件，找到子组件对应的某个具体的标记，然后触发该子组件对应的事件

3.3 数据结构

dispatch:

```javascript
root <-- children <-- children1 <-- ..... 每一个节点中有一个parent属性指向其父节点
```

broadcast:

```javascript
{
    componentName:'root',
    children: [
      {componentName:'children1',children:[ ]},
      {componentName:'children2',children:[ ]},
     ]
}
```

