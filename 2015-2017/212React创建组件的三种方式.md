---
title:  React创建组件的三种方式
date: 2017-05-09 12:36:00
categories: javascript
tags : React
comments : true 
updated : 
layout : 
---

###	1 React.createClass( ) 

```html
<body>
  <div id="root"></div>

  <script type='text/babel'>
    var HelloWorld = React.createClass({ render : function(){ return
    <h1>hello {this.props.name1}
      <p>hello {this.props.name2}</p>

    </h1>
    } }) ;
    ReactDOM.render(
      <HelloWorld name1='Jhon' name2="JiM" />, 
      document.getElementById('root') 
    )


  </script>
</body>
```

### 2 React.Component

```html
<div id="root"></div>
<script type='text/babel'>
     class Welcome extends React.Component {
         render(){
             return <h1>hello {this.props.name}</h1>
         }
     }

     const element = <Welcome name = 'JiM'/>
     ReactDOM.render(
         element,
         document.getElementById('root')
     )

   </script>
```

### 3 function  

```html
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
const Repo = ()=>(<div>this is Repo</div>)
const Category = (props)=>{
  console.log(props);
  return (<div>this is category</div>)
}
const MyTest =()=>(
  <Router>
    <div>
      <ul>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='./repo'>Repo</Link>
        </li>
      
        <li>
          <Link to='./category'>Category</Link>
        </li>
      </ul>
      <Route exact path='/about' render={(props)=>{console.log(props);return (<div>this is aabout</div>)
      }}></Route>
      <Route exact path='/repo' component={Repo}> </Route>
      <Route exact path='/category' component={Category}> </Route>
    
      <Route children={(props)=>{console.log(props);return (<div>this is a component build througth children</div>)
      }}></Route>
    
    </div>
  
  
  </Router>
)
export default MyTest
```

ES6一般写法

```jsx 
const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)
```

[react如何将ReactElement加载到DOM](http://developer.51cto.com/art/201610/519981.htm)





