---
title:  React性能优化
date: 2017-11-30
categories: React
---

2017-11-30. 21:20. 阿里小目标

### 1 从组件的生命周期进行优化

我们知道React组件的渲染分为两种情况，

* 第一种情况就是初次挂载的时候，这个时候执行的生命周期函数

constructor ==> componentWillMount ==> render ==> componentDidMount 

* 第二种情况就是更新渲染的时候，这个时候执行的生命周期函数

componentWillReceiveProps ==> shouldComponentUpdate ==> componentWillUpdate ==>render() ==>生成虚拟DOM，进行Diff算法比较 ==> componentDidMount

当我们只更新一个组件的props的时候，我们希望只更新这一个组件就行了，但是React不是这个样子的，但是react的默认做法是调用所有组件的render，再对生成的虚拟DOM进行对比，如不变则不进行更新。这样的render和虚拟DOM的对比明显是在浪费。

我在React源码setState实现分析穿插着提了更新渲染的时候生命周期，[JiM-Blog](https://github.com/jimwmg/JiM-Blog/) 如果shouldComponentUpdate返回false,那么后续的render函数，以及虚拟DOM的diff算法都不会执行了，这个时候岂不是美哉，妙哉。

**但是需要注意的一点就是我们需要百分百确定这个组件是不需要更新的。**

另外一点，也可以我们在声明组件的时候以PureComponent声明组件，这个时候会调用shallowEqual函数，对该组件的props进行浅层次的比较；博客setState有分析，感兴趣可以看下。

### 2 列表渲染增加key值，改变React更新策略

`key`属性在组件类之外提供了另一种方式的组件标识。通过`key`标识我们可以组件如：顺序改变、不必要的子组件更新等情况下，告诉React 避免不必要的渲染而避免性能的浪费。

如，对于如一个基于排序的组件渲染：

```
var items = sortBy(this.state.sortingAlgorithm, this.props.items);
return items.map(function(item){
  return <img src={item.src} />
});
```

当顺序发生改变时，React 会对元素进行diff操作，并改img的src属性。显示，这样的操作效率是非常低的。这时，我们可以为组件添加一个`key`属性以唯一的标识组件：

```
return <img src={item.src} key={item.id} />
```

添加`key`属性后，React 会在diff算法中改变更新策略：不是更新组的src属性而是移动组件的位置。

### 3 其他一些小的细节

* `{...this.props}` (不要滥用，请只传递component需要的props，传得太多，或者层次传得太深，都会加重shouldComponentUpdate里面的数据比较负担，因此，请慎用spread attributes

* React官方也有Immutable.js这个辅助库

* 没有state的组件称为无状态的组件，有state的组件称为有状态的组件，可以多些无状态的组件；

  ​







