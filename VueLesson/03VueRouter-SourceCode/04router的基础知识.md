---
title: router的基础知识
---

### 1 Location对象

| 属性                                                         | 描述                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| [hash](http://www.w3school.com.cn/jsref/prop_loc_hash.asp)   | 设置或返回从井号 (#) 开始的 URL（锚）。              |
| [host](http://www.w3school.com.cn/jsref/prop_loc_host.asp)   | 设置或返回主机名和当前 URL 的端口号。                |
| [hostname](http://www.w3school.com.cn/jsref/prop_loc_hostname.asp) | 设置或返回当前 URL 的主机名。                        |
| [href](http://www.w3school.com.cn/jsref/prop_loc_href.asp)   | 设置或返回完整的 URL。(包括search和hash)             |
| [pathname](http://www.w3school.com.cn/jsref/prop_loc_pathname.asp) | 设置或返回当前 URL 的路径部分。（不包括search和hash) |
| [port](http://www.w3school.com.cn/jsref/prop_loc_port.asp)   | 设置或返回当前 URL 的端口号。                        |
| [protocol](http://www.w3school.com.cn/jsref/prop_loc_protocol.asp) | 设置或返回当前 URL 的协议。                          |
| [search](http://www.w3school.com.cn/jsref/prop_loc_search.asp) | 设置或返回从问号 (?) 开始的 URL（查询部分）。        |



History对象

| 属性                                                         | 描述                              |
| ------------------------------------------------------------ | --------------------------------- |
| [length](http://www.w3school.com.cn/jsref/prop_his_length.asp) | 返回浏览器历史列表中的 URL 数量。 |

| [back()](http://www.w3school.com.cn/jsref/met_his_back.asp)  | 加载 history 列表中的前一个 URL。   |
| ------------------------------------------------------------ | ----------------------------------- |
| [forward()](http://www.w3school.com.cn/jsref/met_his_forward.asp) | 加载 history 列表中的下一个 URL。   |
| [go()](http://www.w3school.com.cn/jsref/met_his_go.asp)      | 加载 history 列表中的某个具体页面。 |
| pushState                                                    | pushState(state, title,url)。       |
| replaceState                                                 | replace(state, title,url)           |



**通过 history.length 可以查看 浏览器记录的历史；**

### 2 改变 hash 值的方式

1）直接更改浏览器地址，在最后面增加或改变#hash；  2）通过改变location.href或location.hash的值；  3）通过触发点击带锚点的链接；  4）浏览器前进后退可能导致hash的变化，前提是两个网页地址中的hash值不同。

**每次hash的值的变化都会在浏览器历史记录中添加一个历史记录，当点击浏览器的后推或者前进按钮，如果同时注册了hashchange事件，那么就会触发该事件，进而可以在该事件中处理一些逻辑**

也就是说上面的情况都会触发该事件；

```javascript
//就是hash改变时触发的事件,
window.addEventListener('hashchange',function(e) {
    console.log(e) //hashchange 事件对象参数；
    const {oldURL ,newURL,type} = e;
    //oldURL newURL 指的是路由地址，type 是 hashchange
    let url = location.hash;
    console.log('hashPush',url);
})
```

### 3 改变history历史记录的方式（这些只会改变地址栏的地址，而不会刷新页面）

1）`history.pushState(state, title, url)` : 会向历史记录中增加一条记录

2） `history.replace(state,title, url)`: 会替换历史记录中的那条记录

假如我们在 `https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method`

这个网址，打开开发者工具 console 一栏,输入

```javascript
window.history.pushState({name:'1'},'','bar.html')
```

退回一次，再次输入：

地址栏变为 `https://developer.mozilla.org/en-US/docs/Web/API/bar.html`

```javascript
window.history.pushState({name:'1'},'','/bar.html')
```

地址栏变为 `https://developer.mozilla.org/bar.html`

注意看下 MDN 官网的解释

`pushState()` takes three parameters: a state object, a title (which is currently ignored), and (optionally) a URL. Let's examine each of these three parameters in more detail:

- **state object** — The state object is a JavaScript object which is associated with the new history entry created by `pushState()`. Whenever the user navigates to the new state, a `popstate` event is fired, and the `state` property of the event contains a copy of the history entry's state object.

  The state object can be anything that can be serialized. Because Firefox saves state objects to the user's disk so they can be restored after the user restarts the browser, we impose a size limit of 640k characters on the serialized representation of a state object. If you pass a state object whose serialized representation is larger than this to `pushState()`, the method will throw an exception. If you need more space than this, you're encouraged to use `sessionStorage` and/or `localStorage`.

- **title** — Firefox currently ignores this parameter, although it may use it in the future. Passing the empty string here should be safe against future changes to the method. Alternatively, you could pass a short title for the state to which you're moving.

- **URL** — The new history entry's URL is given by this parameter. Note that the browser won't attempt to load this URL after a call to `pushState()`, but it might attempt to load the URL later, for instance after the user restarts the browser. The new URL does not need to be absolute; if it's relative, it's resolved relative to the current URL. The new URL must be of the same origin as the current URL; otherwise, `pushState()` will throw an exception. This parameter is optional; if it isn't specified, it's set to the document's current URL.

也就是对于 url 这个参数，需要注意下 相对地址和 绝对地址 的区别；上面的案例说明的传入 url 不同的情况；

**注意 history.pushState 和 history.replace 不会触发 popstate事件**

```javascript
//触发 popstate事件的 机制：1 浏览器的前进和后退按钮 2 history.go() history.back() history.forward()
window.addEventListener('popstate',function(e){
    console.log('popstate',e);
    const {state,type} = e ;
    //state 就是我们pushStaet的第一个参数，如果该页面没有对应的值，则是null;type是 popstate;
})
```

### 4 前端路由

所谓的前端路由，其实就是通过 History pushState 这个api改变地址栏的显示而已；

