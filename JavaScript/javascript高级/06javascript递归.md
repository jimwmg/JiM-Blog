---
title: javascript递归
date: 2018-01-17
categories: javascript
---



```javascript
const basic = [
  {
    path: 'index',
    name: 'app',
    meta: {
      name: '/index',
      type: 'group',
      desc: '首页',
      resourceId: 'getIndex',
    },
    component: () => import('view/index/index.vue'),
  },
  {
    path: 'index',
    name: 'app',
    meta: {
      name: '/index',
      type: 'group',
      desc: '首页',
      resourceId: 'getIndex',
    },
    component: () => import('view/index/index.vue'),
    children:[....]
  },
]

class Route {
  static create(parent, options, deleteKeys) {
    const r = [];
    options.forEach((option, i) => {
      r.push(new Route(parent, _.merge({}, {
        meta: {
          showIndex: i,
          selectIndex: i,
        },
      }, option), deleteKeys));
    });
    if (parent) parent.children = r;
    r.forEach((item, i) => {
      const option = options[i];
      if (option.children) Route.create(item, option.children, deleteKeys);
    });
    return r;
  }

  constructor(parent, option, deleteKeys) {
    const defaultOption = {
      path: '',
      name: '',
      meta: {
        type: 'group',
        resourceId: fullPath,
        alwaysReach: false,
        selectIndex: 0,
        showIndex: 0,
        visible: true,
        fullPath,
        parentPath,
      },
      children: [],
    };
    _.merge(this, defaultOption, option);
    const { meta: { type } } = this;
    if (type === 'group') {
      this.meta.defaultOpen = true;
    }
    if (deleteKeys) {
      deleteKeys.forEach(key => {
        delete this[key];
      });
    }
  }
}
```

