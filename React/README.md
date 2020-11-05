## 主要记录了从开始接触React,到项目中使用React,到研究React源码的一些博客

### React源码分析系列 -介绍了

- JSX语法糖对应的createElement方法，其实就是创建一个ReactElement元素对象
- React创建组件的方式以及将ReactElement这个大对象通过ReactDOM.render挂载到真实DOM的过程
- React中context如何传递的源码分析（解释了Provider利用React传递context的思路来传递store的原理）
- React中的注册机制
- React中setState之后到底发生了什么
- 父组件setState之后，父组件会执行自己的更新组件生命周期函数,同样其内部所有的子组件也会执行子组件自身的更新组件的生命周期函数 ，包括comonentWillUpdate,render,componentDidUpdate
- 如果父组件通过shouldComponentUpdate函数返回false,那么父组件以及其所有的子组件都不会执行组件更新的生命周期函数，包括comonentWillUpdate,render,componentDidUpdate

### Redux源码 -介绍了

- Redux中createStore/compose/combineReducers/applyMiddlewares源码实现
- 链接Redux和React的Redux-React中Provider和connect源码实现
- Redux中其他常用生态库：thunk logger源码实现
- Redux中的订阅者模式的实现分析

connect.js(类似实现代码) 返回一个Connect组件《Redux-Provider-Connect》文章有解释

```javascript
componentDidMount() {
  // 改变Component的state
  this.store.subscribe(() = {
    //这里面的箭头函数的this指向Connect组件，每一个组件都会被connect函数包裹一下，返回Connect组件
    this.setState({
      storeState: this.store.getState()
    })
})
}
```

==>通过subscribe给store注册监听事件

==>每次dispatch一个action的时候，会将通过subscribe注册在store中的listeners所有的listener执行，(具体实现看《Redux-createStore源码》)

==>这些所有的listener就是所有的被connect组件包裹之后返回的Connect组件中注册的箭头函数(如上subscribe注册的函数)，

==>每个组件的setState执行，那么每个组件都会更新，从而实现UI的更新

### Router源码 -介绍了

- Router源码和Route源码:这两个组件也是利用了React传递context的方式将封装后的history对象传递给所有的子组件
- history对象封装的源码中也是采用了订阅者模式，当路由改变的时候，会通知订阅者执行订阅的函数
- Router组件中在组件componentWillMount生命周期函数中，给history对象注册了一个listener,该listener会执行React的setState方法
- history对象的封装源码，改写了其push goback等函数，而这些函数最终还是调用了Router.js中注册setState方法

在Router.js中componentWillMount生命周期中

```javascript
componentWillMount() {
  const { children, history } = this.props
  // Do this here so we can setState when a <Redirect> changes the
  // location in componentWillMount. This happens e.g. when doing
  // server rendering using a <StaticRouter>.
  //这里执行history.listen()方法；传入一个函数；箭头函数的this指的是父级的作用域中的this值；
  this.unlisten = history.listen(() => {
      //这里箭头函数的this指的是Router组件实例
    this.setState({
      match: this.computeMatch(history.location.pathname)
    })
  })
}
```

这里可以看到，当路由改变（push,go,goback等）的时候，都会调用这里监听的函数，Router组件会执行setState,那么就相当于整个应用都会重新render，生成ReactElement对象

对比Router和Redux

* Redux ==> store ==> 订阅者模式给**每一个**（所有组件）组件订阅 setState函数 ==> dispatch更新state ==> 执行所有注册的listerer ==> 所有被connect过的组件都会执行他们的setState ==> 组件更新
* Router ==> history ==>订阅者模式给**主组件**（就一个组件）Router订阅setState函数==> push, go,goBack调用主组件中注册的setState函数 ==> 主组件更新 ==> 子组件更新
* store和history都是利用React传递context的方式将其传递下去，方便所有的子孙组件可以共享这两个对象

### React性能优化

* 对比Redux和Router的实现：Redux-React其实是将每个组件注册了一个setState函数，dispatch一个action更新state之后，所有的组件都会重新执行`setState`拿到新的state值，给到wrappedComponent组件；而Router只是给Router组件注册了一个setState函数，其作为根组件进行UI的更新
* 如果你在根节点上调用`setState`,那么整个app都会重新渲染，所有的组件，即使它没有改变也会调用它的render方法。这听起来很低效，但实际中，它工作很好应为我们没有操作实际的DOM
* 所以如果确实遇到了性能上的瓶颈，可以在组件内定义`shouldComponentUpdate`来决定是否更新组件，因为React是默认都会更新组件的（即时组件的数据没有变化，他也会执行这个组件的`componentWillUpdate`,`render`,`componentDidUpdate`）；所以如果我们定义`shouldComponentUpdate`函数返回false,那么这个组件的`componentWillUpdate`,`render`,`componentDidUpdate`这些生命周期函数都不会执行,那么这个组件就不会重新执行`render`函数，如果该组件不重新`render`,那么其所有的子组件也不会重新渲染；也就是说如果某个组件`shouldComponentUpdate`返回了false,那么该组件以及其子组件生成的虚拟DOM就不会发生变化，那么在最后真正执行DOM的挂载的时候，Diff算法的进行也会更快捷；
* 另一个很重要的是，当你写React代码时，不要一出现变化就在根节点上调用setState方法。你应该在接收变化事件的组件或其上面的组件上调用`setState`，你应该极少的在上层中调。根据以上的分析可以看出来，路由的变化，其实是在根组件执行了setState,而状态的变化是对每个组件都执行了setState
* 任何时候只要你在一个组件中调用了`setState`，React将把这个组件标记为dirty（脏），在事件循环结束后，React将找到所有脏的组件并重新渲染它们。
* 所有的操作都是在数据层面的，不管是dispatch(action) 还是router的路由跳转，最终我们改变的仅仅是ReactElement这个大对象，虚拟DOM的diff是在挂载DOM的根据前后的ReactElement这个大对象进行比较的；





推荐资源

[React高频面试题](https://mp.weixin.qq.com/s?__biz=Mzg2NDAzMjE5NQ==&mid=2247484667&idx=1&sn=dcaea6836c604100f9811c8c7f98a147&scene=21#wechat_redirect)

[React-setState原理](https://mp.weixin.qq.com/s/jOTxys4HU-HiZeIMvf8KDg)

