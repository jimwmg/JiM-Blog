---
title: weex 开发注意点汇总
---

## 1 学习weex

[官方文档](https://weex.apache.org/cn/guide/)

## 2 开发注意点

* 文本只能放在 `<text>` 标签里，否则将被忽略。

* 

* 


**样式注意**

## 3 样式

**Weex 目前只支持单个类选择器，并且只支持 CSS 规则的子集**

### 3.1 [weex通用样式](https://weex.apache.org/cn/wiki/common-styles.html)

* Weex 对于长度值目前只支持*像素*值，不支持相对单位（`em`、`rem`）。
* 设定边框，`border` 目前不支持类似这样 `border: 1 solid #ff0000;` 的组合写法。
* 布局 flex： 默认flex-direction的值是 column（从上到下排列，所以此时的主轴默认就是垂直方向）；
* Weex 目前不支持 `z-index` 设置元素层级关系，但靠后的元素层级更高，因此，对于层级高的元素，可将其排列在后面。
* 如果定位元素超过容器边界，在 Android 下，超出部分将**不可见**，原因在于 Android 端元素 `overflow` 默认值为 `hidden`，但目前 Android 暂不支持设置 `overflow: visible`。
* Weex 支持四种伪类：`active`, `focus`, `disabled`, `enabled`
* 所有组件都支持 `active`, 但只有 `input` 组件和 `textarea` 组件支持 `focus`, `enabled`, `disabled`。
* 目前暂不支持 `radial-gradient`（径向渐变）。
* 不要使用 `background` 简写.
* `background-image` 优先级高于 `background-color`，这意味着同时设置 `background-image` 和 `background-color`，`background-color` 被覆盖。
* box-shadow仅仅支持iOS
* Weex 盒模型的 `box-sizing` 默认为 `border-box`，即盒子的宽高包含内容、内边距和边框的宽度，不包含外边距的宽度。
* border-radius：不支持简写，应该写成 border-top-left-radius: length;
* Weex 支持四种伪类：`active`, `focus`, `disabled`, `enabled`，不支持其他的比如 first-child等伪类的实现；
* Flexbox 是默认且唯一的布局模型，所以你不需要手动为元素添加 `display: flex;` 属性。
* Flex-direction默认值是 column;
### 3.2 css单位


* color单位：不支持 `hsl()`, `hsla()`, `currentColor`, 8个字符的十六进制颜色；`rgb(a,b,c)` 或 `rgba(a,b,c,d)` 的性能比其他颜色格式差很多，请选择合适的颜色格式。
* length单位：不支持类似 `em`，`rem`，`pt` 这样的 CSS 标准中的其他长度单位。只支持px;
* percentage单位：目前weex暂时不支持；表示百分比值，如“50％”，“66.7％”等。

## 4 事件

**通过  @ 去绑定事件**

### 4.1 通用事件

* `<input>` 和 `<switch>` 组件目前不支持 `click` 事件，请使用 `change` 或 `input` 事件来代替。

* 目前在 Weex 里不支持事件冒泡和捕获，因此 Weex 原生组件不支持[事件修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)，例如`.prevent`，`.capture`，`.stop`，`.self` 。此外，[按键修饰符](https://cn.vuejs.org/v2/guide/events.html#%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)以及[系统修饰键](https://cn.vuejs.org/v2/guide/events.html#%E7%B3%BB%E7%BB%9F%E4%BF%AE%E9%A5%B0%E9%94%AE) 例如 `.enter`，`.tab`，`.ctrl`，`.shift` 在移动端基本没有意义，在 Weex 中也不支持。

   

## 5 和web平台的差

与 Web 平台的主要差异是: 上下文、DOM、样式和事件。

* weex中没有DOM,DOM（Document Object Model），即文档对象模型，是 HTML 和 XML 文档的编程接口，是 Web 中的概念。Weex 的运行环境以原生应用为主，在 Android 和 iOS 环境中渲染出来的是原生的组件，不是 DOM Element。

* 不支持DOM操作：既然原生环境中不支持 Web API，没有 `Element` 、`Event` 、`File` 等对象，详细列表可以参考 [Web APIs on MDN](https://developer.mozilla.org/en-US/docs/Web/API)。不支持选中元素，如 `document.getElementById` 、 `document.querySelector` 等；当然也不支持基于 DOM API 的程序库（如 jQuery）

* weex中没有BOM ,BOM（Browser Object Model），即浏览器对象模型，是浏览器环境为 javascript 提供的接口。Weex 在原生端没有并不基于浏览器运行，不支持浏览器提供的 BOM 接口。所以就没有 location history等的接口

* 没有 `window` 、`screen` 对象 ；Weex 中并未提供浏览器中的 `window` 和 `screen` 对象，不支持使用全局变量。如果是想要获取设备的屏幕或环境信息，可以使用 `WXEnvironment` 变量。

* 没有 `document history location navigator`对象

* weex中可以使用 vue-router的原因是因为weex中可以设置 mode : abstract; 

    

   ## 6 组件

* div组件： 在native中不能滚动，即使显示的给div容器设置 height:3000px也不会滚动；

* a组件：**注意：** `click` 事件的回调函数和 `href` 跳转的执行顺序**未被定义**。**不要**使用 `click`来进行 `href` 跳转前的逻辑处理。

* image组件：**必须指定样式中的宽度和高度**，否则无法工作；您可以指定一个相对 bundle URL 的相对路径，相对路径将被重写为绝对资源路径(本地或远程)。参见: [资源路径](https://weex.apache.org/cn/guide/advanced/path.html)；

  在使用 `<image>` 之前，请在 native 侧先接入相应的 adapter 或者 handler。

  `<image>` 必须指定样式中的宽度和高度。

  `<image>` 不支持内嵌子组件。

* indicator组件：`<indicator>` 组件通常用于显示轮播图指示器效果，必须充当 [`slider`](https://weex.apache.org/cn/references/components/slider.html) 组件的子组件使用。该组件有一些私有样式，包括 item-color (未被选中的颜色) item-selected-color(选中额颜色)  item-size(指示点的半径)；

  不支持子组件，任何在 indicator 里面的子组件都会被忽略；indicator的位置不依赖top bottom等定位； 

* input 组件： 此组件不支持 `click` 事件。请监听 `input` 或 `change` 来代替 `click` 事件。不支持子组件；

* list组件：可以根据子组件的不同提供更高级的功能，header组件，用于吸附于顶部；

### 7 其他

* 从三种模式的介绍中也可以看出来，Weex 环境中只支持使用 abstract 模式。不过，vue-router 自身会对环境做校验，**如果发现没有浏览器的 API，vue-router 会自动强制进入 abstract 模式**，所以在使用时只要不写 `mode` 配置即可。默认 vue-router 会在浏览器环境中使用 hash 模式，在移动端原生环境中使用 abstract 模式。

* vue-router 中使用 `<router-link>` 创建导航链接，不过在其中使用了基于 DOM 事件的一些特性，在 Weex 原生环境中并不能很好的工作。在 Weex 中，你必须使用[编程式导航](https://router.vuejs.org/zh-cn/essentials/navigation.html)来编写页面跳转逻辑。

*  vue-router 是以 Vue.js 插件的形式存在的，使用前必须要引入 Vue.js。**因为 WeexSDK （>= 0.9.5）中已经包含了 Vue.js Runtime，所以不需要再引入一遍 Vue.js ，只需引入 vue-router 并注册即可：**

*  **在 Weex 中，你必须使用编程式导航来编写页面跳转逻辑。** 

* 

   

​    

 

 