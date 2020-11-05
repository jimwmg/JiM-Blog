---
 title:react状态管理中的坑
date: 2017-06-21 12:36:00
categories: react
tags : react
comments : true 
updated : 
layout : 
---

### 废话不多说了,直接总结了

### 1明确我们的UI=f(state) 

* 状态管理中,如果一个**父组件**频繁的改变状态,并且UI视图是通过这个状态去展示的,那么所有UI的展示一律通过props(redux中mapStateToProps传递过来的state)展示的,那么需要注意,如果我们将props中的属性j(假如说是data)赋值给某个**子组件**的state,并且子组件是根据其自身的state(data)渲染子组件的UI的,那么此时如果改变父组件的props中的data属性,那么子组件并不会更新,因为子组件渲染的时候是根据赋值到state上的data进行渲染的.
* 如果子组件UI是根据state渲染的,那么子组件UI更新则需要通过setState方法手动更新.

### 2 明确组件的生命周期

* 初始化阶段

  * constructor函数将会执行,在这里可以初始化state状态

* 装载阶段:在组件即将插入DOM节点之前的阶段

  * componentWillMount() 这个方法在初始化  render()方法执行之前进行调用
  * componentDIdMount() 这个方法在初始化render() 方法之后调用,这个时候可以操作DOM元素了

* 更新阶段

  * 当组件的属性props更新的时候:

    * componentWillReceiveProps()
    * shouldComponentUpdate()
    * componentWillUpdate()
    * render()   创建一个虚拟DOM对象,表示组件的输出
    * componentDidUpdate()

  * 当组件通过setState()更新的时候

    * shouldComponentUpdate()
    * componentWillUpdate()
    * render()
    * componentDidUpdate()

  * 注意禁止在shouldComponentUpdate()和componentWillUpdate()中调用setState方法,会造成循环调用

    因为每次执行setState方法的时候,上面这两个函数都会重新执行,每次执行的时候,又会执行setState,所以造成死循环.

### 3  对于请求后台数据给到组件状态 

3.1 componentDidMount里面发起ajax请求，然后在请求成功后用setState