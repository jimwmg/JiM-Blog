---
title: React实现搜索延迟功能
date: 2017-07-26
categories: javascript
tags: search
---

### 搜索延迟

平常在项目中，经常会遇到搜索请求后台的情况，此时搜索延迟就显得尤为重要，如果没有搜索延迟功能，那么用户页面将会显得特别卡顿

```jsx
import {Component} from 'react'
class Search extends Component{
  constructor(props){
    this.state({delay:0});
    this.onSearch = this.onSearch.bind(this);
  }
  onSearch(){
    this.setState({delay:this.state.delay + 1})
    let _this = this ;
	setTimeout(function(){
      _this.setState({delay:_this.state.delay - 1});
      if(this.state.delay == 0){
       	 //执行后台请求的代码
   		 console.log('请求执行了')
  		}
      }
	},1000)
}
  render(){
    return (
    	<div>
	      	<input onChange={this.onSearch}/>
      </div>
    )
  }
}
export default Search
```

以上就是一个最简单的搜索延迟功能的实现。有误之处还请指出。
