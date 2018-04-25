---
title:element.ui 入口文件
---

### 1 使用方式

第一种：

```javascript
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element)
```

第二种

```javascript
import {
  Select,
  Button
  // ...
} from 'element-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```

### 2 对于第一种使用方式 Vue.use(Element) 

element-ui/src/index.vue

```javascript
const components = [
  Pagination,
  Dialog,
    ....
]
const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
//循环将所有组件注册到全局components上
  components.map(component => {
    Vue.component(component.name, component);
  });

  Vue.use(Loading.directive);

  const ELEMENT = {};
  ELEMENT.size = opts.size || '';
//给Vue 原型添加，所以所有的Vue实例都可以访问到 
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

  Vue.prototype.$ELEMENT = ELEMENT;
};

module.exports = {
  version: '2.0.11',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
  Pagination,
    ...
}
```

