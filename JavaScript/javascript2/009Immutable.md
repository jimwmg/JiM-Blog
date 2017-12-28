---

date:2017
---

### 1 Immutable JS

首先我们要明白，react中为什么需要ImmutableJs

假设我们有如下json对象从后台获取到之后，传递给一个组件

```json
result {
  shadow:'someCode'
  data:{
    user1Info:'JiM',
    user2Info:'Jhon',
    //....more
  }
  message:{
    conversion1:'hello',
  	conversion2:'world',
  //.....more
  }
}
```

假如某个组件 `<UserTalk>`

```javascript
import Component from 'react'
class UserTalk extends Component{
  constructor(props){
    super(props)
    let result = this.props.result
    //将result对象赋值给state对象
  	this.state = {result:result}
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick(){
    //someCode. 改变result的操作，或者不改变result
    this.setState(result:result)//只要setState函数执行，就会组件就会重新render,即使state状态值没有变化也会re-render，这样子其实就会特别浪费性能
  }
  render(){
    console.log('re-render')
    return (
    	//some UI
      <button onClick={this._handleClick}>按钮</button>
    )
  }
  
}
<UserTalk result = {result} />
```

1.1 当我们**没有使用Immutable**数据,同时也没有使用pureRender函数的时候，即使我们我们不改变这个state

* 通过setState( ) 方法之后，由于shouldComponentUpdata( ) 函数总是返回true，组件仍然会重新渲染，明明state状态没有改变，组件仍然会重新执行render方法，很是浪费性能

```json
result {
  shadow:'somecode'
  data:{
    user1Info:'Kobe', //仅仅改变了这一点状态值
    user2Info:'Jhon',
    //....more
  }
  message:{
    conversion1:'hello',
  	conversion2:'world',
  //.....more
  }
}
```

此时我们点击，发生setState操作的时候，会发现每次点击都会重新执行render函数，这么样其实很浪费性能，因为我们的state并没有发生变化，render函数还是会再次执行，重新渲染组件。

```javascript
this.setState(result:result)
```

* 此时可以通过pureRender函数重写组件的shouldComponentUpdate函数，不让该shouldComponentUpdate总是返回true

```javascript
import Component from 'react'
import pureRender from 'pure-render-decorator'

@pureRender
class UserTalk extends Component{
  constructor(props){
    super(props)
    let result = this.props.result
    //将result对象赋值给state对象
  	this.state = {result:result}
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick(){
    //someCode. 改变result的操作，或者不改变result
    this.setState(result:result)//只要setState函数执行，就会组件就会重新render,即使state状态值没有变化也会re-render，这样子其实就会特别浪费性能
  }
  render(){
    console.log('re-render')
    return (
    	//some UI
      <button onClick={this._handleClick}>按钮</button>
    )
  }
  
}
```

注释：@pureRender是ES7的新语法，上面这么写就等价于如下

```javascript
import Component from 'react'
import pureRender from 'pure-render-decorator'


class UserTalkOrigin extends Component{
  constructor(props){
    super(props)
    let result = this.props.result
    //将result对象赋值给state对象
  	this.state = {result:result}
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick(){
    //someCode. 改变result的操作，或者不改变result
    this.setState(result:result)//只要setState函数执行，就会组件就会重新render,即使state状态值没有变化也会re-render，这样子其实就会特别浪费性能
  }
  render(){
    console.log('re-render')
    return (
    	//some UI
      <button onClick={this._handleClick}>按钮</button>
    )
  }
  
}
const UserTalk = pureRender(UserTalkOrigin)
```

最新版的react官方文档使用的是PureRenderMixin,使用方式如下

```javascript
import Component from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

@pureRender
class UserTalk extends Component{
  constructor(props){
    super(props)
    let result = this.props.result
    //将result对象赋值给state对象
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  	this.state = {result:result}
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick(){
    //someCode. 改变result的操作，或者不改变result
    this.setState(result:result)//只要setState函数执行，就会组件就会重新render,即使state状态值没有变化也会re-render，这样子其实就会特别浪费性能
  }
  render(){
    console.log('re-render')
    return (
    	//some UI
      <button onClick={this._handleClick}>按钮</button>
    )
  }
  
}
```



pureRender函数的内部实现如下

```javascript
function shallowCompare(instance,nextProps,nextState){
	return !shallowEqual(instance.props,nextProps) || !shallowEqual(instance.state,nextState)
}
//这里需要注意的是shallowCompare仅仅进行比较的是浅比较，所以对于复杂数据类型的变化，会引发一系列的bug.会发生即使复杂数据类型的内部数据发生了变化，而组件并不会重新render,因为经过pureRender之后的组件的shouldComponentUpdate方法会对state和props进行浅比较，如果引用相同的话，返回值还是false,那么组件则不会进行更新
function shouldComponentUpdate(nextProps,nextState){
  return shallowCompare(this,nextProps,nextState)
}
function pureRender(component){
  component.prototype.shouldComponentUpdate = shouleComponentUpdate
}
module.exports = pureRender 
```

这个时候我们在点击按钮，发现组件并不会重新re-render，组件的render方法不会重新执行，这样子就会优化了性能。但是其带来的问题在上面我也说过了，对于复杂数据的state或者props的改变，可能会带来一些bug.因为重写的shouldComponentUpdate函数也仅仅是进行的浅层的比较。

官方解释：

```
Note:

This only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only mix into components which have simple props and state, or use forceUpdate() when you know deep data structures have changed. Or, consider using immutable objects to facilitate fast comparisons of nested data.

Furthermore, shouldComponentUpdate skips updates for the whole component subtree. Make sure all the children components are also "pure".

```

也就是说，对于复杂数据结构，如果使用了PureRenderMixin,在改变了state和props的内部数据结构的时候，shouldComponentUpdate返回的结果可能还是false,此时组件并不会重新渲染，这就可能导致一些问题，为了解决这个问题，有两种方式：

* 如果我们知道了深层的数据机构改变了，可以使用forceUpdate( ) 更新组件
* 或者我们使用immutable数据结构，接下来就试着用immutable数据结构

1.2 如果我们使用Immutable数据呢？







此时react会进行diff算法对数据进行比较，state的result对象的所有的分支都会进行比较，虽然我们仅仅改变了user1Info的属性值，但是react仍然会对所有的result对象所有的分支进行比较，确定完变化的部分之后，进行virtualDOM的更新，