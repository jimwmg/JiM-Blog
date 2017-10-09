---
title: 封装函数   innerText   textContent  innerHTML
date: 2016-03-22 12:36:00
tags: 
categories: css
comments : true 
updated : 
layout : 
---

封装函数   innerText   textContent  innerHTML 

1 如何改变元素文本内容？innerText   和 textContent 的区别

* obj.innerHTML  可以获取元素内所有的内容，obj.innerHTML="   "可以修改元素内容，里面也可以添加其他元素标签；谷歌，火狐，IE都支持；
* obj.innerText  只能获取内容，不能获取标签；obj.innerText="  "也只能设置文本内容；谷歌火狐支持，IE不支持，所以需要兼容性封装；
* obj.textContent 只能获取内容，不能获取标签；obj.textContent="  "也只能设置文本内容；谷歌火狐支持，IE也支持；
* obj.textContent  和  obj.innerText  可以修改对象内部整体的内容，包括元素、属性、文本.

栗子：

```html

<div id="dv">
   <p>通过innerText和innerHTMl获取内容的不同</p>
</div>
document.getElementById("dv").innerText = "<p>innerText 不能显示标签</p>";
document.getElementById("dv").inerHTML = "<p>innerHTML可以显示文本和标签</p>"

两种不同的执行结果：
innerText:注意此时的 <p>是以文本的形式在页面中存在的；
<div id="dv">
  <p>innerText 不能显示标签</p>
</div>
innerHTML:此时的<p>标签是以元素的形式在页面中存在的；
<div id="dv">
   <p>innerHTML可以显示文本和标签</p>
</div> 
```

2 如何获取元素内容？innerText  和 innerHTML 的区别

*  obj.innerHTML 不仅可以获取对象的文本节点，只要是元素内的节点，包括元素节点，文本节点，都会被获取到。
*  obj.innerText  只能获取对象的文本节点，不能获取元素的子元素节点

栗子：

```html
<div id="dv">
   <p>通过innerText和innerHTMl获取内容的不同</p>
</div>
var result1 = document.getElementById("dv").innerText;
var result2 = document.getElementById("dv").innerHTML;
console.log(result1);
console.log(result2);

输出结果：
result1:通过innerText和innerHTMl获取内容的不同
result2:<p>通过innerText和innerHTMl获取内容的不同</p>
```

3 封装函数原因：因为谷歌和火狐 都支持innerText   和 textContent  但是，IE只支持textContent，所以需要封装函数，无论哪个浏览器都可以设置文本内容或者获取文本内容。 

```javascript

function setInnerText (element,content){
  if (element.innerText == undefined){
    element.textContent = content 
  }else {
    element.innerText = content 
  }
}

function getInnerText (element,content){
  if (element.innerText == undefined){
    return element.textContent
  }else {
    return element.innerText 
  }
}
```

这些API联系document.write(  )

4 在jquery中对应的是html()  和  text (),jqueryObj.html()   jqueryObj.text()，如果没有参数可以获取jquery对象的内容，如果设置了内容则可以为其设置文本内容。

和DOM中一样  ，html()不仅可以获取文本节点，还可以获取元素节点，而text()只能获取文本节点的内容；同样。html("<p>innerHTML可以显示文本和标签</p>"),可以设置元素节点以及文本节点，但是text("<p>innerHTML可以显示文本和标签</p>"),只能设置文本节点，及时添加了标签，标签也会以文本的形式显示，不会形成元素节点。