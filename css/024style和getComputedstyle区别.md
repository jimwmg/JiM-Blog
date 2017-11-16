---
title:css Style
date: 2017-9-14
categories: css
tags: css
---

### 1 一个元素的样式层叠来源包括三种情况：

1. **内嵌样式（inline Style）** ：是写在 HTML 标签里面的，内嵌样式只对该标签有效。

2. **内部样式（internal Style Sheet）**：是写在 HTML 的 标签里面的，内部样式只对所在的网页有效。

3. **外部样式表（External Style Sheet）**：如果很多网页需要用到同样的样式(Styles)，将样式(Styles)写在一个以 .CSS 为后缀的 CSS 文件里，然后在每个需要用到这些样式(Styles)的网页里引用这个 CSS 文件

4. 浏览器自带样式

   注意层叠样式标的样式优先级，`1>2>3>4`;

### 2 getComputedStyle 和 style的区别 

  1.getComputedStyle可以获取到元素的所有的样式，包括 浏览器自带的样式，和以上三种添加的样式；

  2.style只能获取到内嵌样式；以及通过 el.style.cssText 设置的属性（cssText其实就是改变的内嵌的style的字符串的值）

  3.el.style.property = value ; 相当于直接给内嵌样式style追加字符串；而el.style.cssText = value;则是直接替换内嵌样式的style的字符串；(具体差别可以根据以下demo的注释掉的代码进行查看)

### 3 demo解释

cssText.css

```css
.dv1 {
    color:red;
    height:10px;
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="cssText.css">
</head>
<style>
    #dv{
        height: 50px;
        background-color:green;
    }
</style>
<body>
    <button id='btn'>按钮</button>
    <div id='dv' style="padding:21px;height:100px;" class='dv1'>hello</div>
    <!-- <div id='dv'></div> -->
    <script>
        document.getElementById('btn').onclick = function(){
            var dv = document.getElementById('dv');
            // dv.style.cssText = "margin-top:30px"
	       //   dv.style.height = '200px'
console.log('=====style')
            console.log(dv.style);
            console.log(dv.style.length);
            console.log(dv.style.padding);
            console.log(dv.style.height);
            console.log(dv.style.color);
            console.log(dv.style.marginTop);
          
            console.log(dv.style.cssText);
console.log('=====getComputedStyle')
            console.log(window.getComputedStyle(dv,null).length)
            console.log(window.getComputedStyle(dv,null).padding)
            console.log(window.getComputedStyle(dv,null).height)
            console.log(window.getComputedStyle(dv,null).color)
            console.log(window.getComputedStyle(dv,null).marginTop)
        }
        </script>
</body>
</html>
```

控制台输出（输出的style对象中可以看到cssText属性值，就是内嵌样式style字符串的值

```
====style
5（内嵌样式中四个padding+一个height)
21px
100px


====getComputedStyle
282(不同浏览器结果有席位不同)
21px
100px
rgb(255,0,0)
0px
```

以上可以得到样式表优先级的情况两者的区别

* el.style 是可读可写的，既可以获取属性值（仅仅限于内嵌样式或者cssText增加的样式），也可以增加属性值
* getComputedStyle则是可以获取到一个元素的所有的样式，但是仅仅是只读的；

### 4 优化性能

如果我们通过el.style.property = value 操作多次，每次操作总是会进行浏览器的reflow，增加浏览器的消耗，所以可以通过cssText一次性增加样式，减少reflow；

```javascript
element.style.fontWeight = 'bold' ;
element.style.marginLeft= '30px' ;
element.style.marginRight = '30px' ;
//理论上会触发多次reflow;
可以通过设置元素的className或者通过cssText进行优化；
```



[张鑫旭](http://www.zhangxinxu.com/wordpress/2012/05/getcomputedstyle-js-getpropertyvalue-currentstyle/)

[这篇总结的也不错](https://xdlrt.github.io/2017/01/30/2017-01-30/)