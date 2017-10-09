---
title:  less
date: 2016-06-08 12:36:00
categories: less
tags : less
comments : true 
updated : 
layout : 
---

## less程序化编译CSS

### 1 语法:定义变量，LESS 允许开发者自定义变量，变量可以在全局样式中使用，变量使得样式修改起来更加简单。

```less
/*语法：@变量名: 值*/
@mainColor : red ;
div {
   color:@mainColor ;
}
```

### 2 Mixin 混入:功能对用开发者来说并不陌生，很多动态语言都支持 Mixin（混入）特性，它是多重继承的一种实现，在 LESS 中，混入是指在一个 CLASS 中引入另外一个已经定义的 CLASS，就像在当前 CLASS 中增加一个属性一样。

*  样式混入

```less
.red {
  	color : red ;
}
.border {
  	border:2px solid #000 ;
}
.mixin-class {
  	.red();
  	.border();
}
```

*  函数混入(变量必须要有默认值:如果后面的代码用到了该变量，否则会提示undefined)

```less
.red(@color:red){
  	color : @color ;
}
.border(@color:#ccc,@width:3px){
  	border : @width solid @color ;
}
.mixin-func {
  	.red(skyblue);
  	.border(#666,10px);
}
```

### 3 嵌套:在我们书写标准 CSS 的时候，遇到多层的元素嵌套这种情况时，我们要么采用从外到内的选择器嵌套定义，要么采用给特定元素加 CLASS 或 ID 的方式"

比如以下这段html的嵌套书写

```html
<div class="container">
    <div class="row">
        <div class="column">
            <h3></h3>
            <a href=""><img src="" alt=""/></a>
      	</div>
        <div class="column">
            <h3></h3>
            <a href=""><img src="" alt=""/></a>
      	</div>
        <div class="column">
            <h3></h3>
            <a href=""><img src="" alt=""/></a>
      	</div>
    </div>
</div>
```

css样式如下:

```css
.container{
  	width:1000px;
  	height:80px;
  	position:relative;
}
.container>.row {
  	width:100%;
  	height:100%;
}
.container>.row>.column {
  	width:33.333%;
  	height:100%;
  	border:2px solid #000;
}
/*后代选择器*/
.container>.row>.column h3 {
  	margin:0;
}
.container>.row>.column a {
  	dispaly:block;
  	width:100%;
  	height:100%;
  	text-decoration:none;
}
.container>.row>.column a : hover {
  	color:#dddddd;
  	background-color:#ccc;
}
```

less编译如下(注意伪类需要加  &:伪类 )

```less
.container {
  	width:1000px;
  	height:80px;
  	position:relative;
  	.row {
      	width:100%;
  		height:100%;
    	.column {
             width:33.333%;
  			height:100%;
  			border:2px solid #000;
      		h3 {
              	margin:0;
  			}
      		a {
              	 dispaly:block;
  				width:100%;
  				height:100%;
  				text-decoration:none;
      		}
      /*&:伪类*/
      		&:hover {
              	 color:#dddddd;
  				background-color:#ccc;
      		}
  		}
  	}			
}
```

注意伪类选择符：E:hover  E : link  E :first-child 

### 4 Import导入:可以使我们的样式编译模块化,这个思想很重呀，模块化的编程会使我们的维护特别简单。

```less
@import "lessFileName";
```

### 5 Less  cmd命令符

```html
lessc -v :查看less文件的版本;
```

### 6 在less文件中，/**/  注释同样可以在css中出现，而 //  注释只会在less中出现，不会再编译的css中出现。

