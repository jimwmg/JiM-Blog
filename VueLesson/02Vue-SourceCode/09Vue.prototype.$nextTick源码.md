---
title:  Vue.prototype原型上的方法总结
date: 2017-12-22 
categories: vue
---

### 1 Vue.prototype.$nextTick

instance/render.js中

```javascript
Vue.prototype.$nextTick = function (fn: Function) {
  //这里通过组件实例调用nextTick函数的时候，绑定了fn函数执行的this值为组件实例
  return nextTick(fn, this)
}
```

```javascript
//定义nextTick存放的函数
const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    //将flushCallbacks函数放入异步队列中，等待执行；
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  /**
macrotasks: script ,setTimeout, setInterval, setImmediate, I/O, UI rendering
microtasks: process.nextTick, Promise, MutationObserver
  **/
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

```

### 2 官网定义：

将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 `Vue.nextTick` 一样，不同的是回调的 `this` 自动绑定到调用它的实例上。

总结以上源码：

* 首先定义：callbacks. pending. microTimerFunc.  macroTimerFunc useMacroTask(false)，默认使用microTimerFunc将nextTick中的函数 fn 放入异步队列
*  在下一次事件循环中，会执行这个fn

[重点参考](https://github.com/jimwmg/JiM-Blog/blob/master/JavaScript/ES6/014V8%E5%BC%95%E6%93%8E%E5%A4%84%E7%90%86%E4%BA%8B%E4%BB%B6%E9%98%9F%E5%88%97%E7%9A%84%E6%9C%BA%E5%88%B6.md)

### 3 基本使用

```html
<div id='app'>
  <div id='dv'>{{message}}</div>
  <button @click ='changeMessage'>按钮</button>
</div>

<script>
  //类名如果带有 — 字符，比如 text-danger,那么就必须加上引号，如果没有 - ，那么就不需要加引号；
  var app = new Vue({
    el:"#app",
    data:{
      message:'hello World'
    },
    methods:{
      changeMessage:function(){
        this.message = 'World HELLO';
        this.getText(); //hello World
        //将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        this.$nextTick(function () {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          this.getText();//World HELLO
        })
      },
      getText:function(){
        var text = document.getElementById('dv').innerText;
        console.log(text);
      }
    }
  })

</script>
```

### 4 项目中实际运用案例

* ​

