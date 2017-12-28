---
title: 操作属性节点
date: 2016-06-22 20:36:00
tags: css
categories: css
comments : true 
updated : 
layout : 
---

### 1 DOM里面操作元素的属性节点：

```html
ele.removeAttribute("属性名")，删除属性节点；
ele.setAttribute("属性名"，"属性值") ，设置属性节点；
ele.getAttribute("属性名")，获得属性节点的值；
设置属性里面的style属性的值:
ele.style.property = "value"，设置样式属性值；ele.property = "value"设置元素属性值；
ele.className = "value" ，可以用来修改  类名；也可以用来获取类名
HTML5中新增了classListAPI 可以操作类名
ele.classList.remove("类名");可以用来移除类名  必须有参数
ele.classList.add("类名") ;可以用来增加类名  必须有参数
ele.classList.toggle("类名") ;判断该元素是否有此类名，有的话则加上，没有的话则删除；
ele.classList.length  ;可以返回该元素拥有的类名的的个数；
ele.classList.contains("类名") ;返回布尔类型的值，如果包含该类名则返回true，不包含的话，则返回false；
```


### 2 jquery中操作元素的属性节点：

```html
$("selector").css('property'),$("selector").css('property','value'),可以用来*获取*或者*设置*样式(style)属性里面的样式属性值；注意只能获取style样式属性里面的属性值；其底层运作就应用了getComputedStyle以及getPropertyValue方法。
$("selector").attr("property"),$("selector").attr("property","value"),可以*获取*或者*设置*固有属性以及新增属性 ; 新增属性会在DOM树结构中显示。
$("selector").removeAttr("property")  可以移除固有属性以及由attr设置的新增属性，会将属性直接从DOM树上移除;attr设置属性会在DOM树上显示;不能移除由prop设置的属性;
$("selector").prop("property"),$("selector").prop("property","value")，可以*获取*和*设置*固有属性以及新增属性，但是新增属性不会再DOM树上显示
$("selector").removeProp("property") 可以移除固有属性以及由prop设置的属性，但是仅仅是删除属性值值变为undefined;不能移除由attr设置的属性;
$("selector").addClass("class1 class2")  为每一个匹配的元素添加类名，如果添加多个类，则需要用空格分开;
$("selector").removeClass("class1 class2") 为每一匹配的元素删除类名，如果移除多个类名，则需要用空格分开
$("selector").toggleClass("class") 为每一匹配的元素添加或者删除类名，存在则删除，不存在则移除;
```

### 3  " . "操作符只能获取内嵌式的属性值，不能获取内联(style标签里面)式和外联式的属性;通过"."也可以直接设置属性值，但是只能是固有属性的值，不能新增属性

```html
ele.property   获取属性值(固有属性)
ele.property = "value"   设置固有属性值，不能设置新增属性给元素,如果设置了新增属性，并不能在DOM树上显示；
可以这么理解，DOM元素是一个对象，"."操作符可以为对象添加属性，无论是否是固有属性，都会为这个新增的属性开辟存储空间，只不过固有属性会在DOM树上显示，而新增属性不会再DOM树上显示，但是其设置的值还是存在的。
```

### 4 "." 操作符 和 setAttribute("property","value")设置属性的区别

* "." 设置固有属性  ele.property = "value" ;可以**使其在DOM元素中出现** ；
* "." 设置新增属性 ele.property = "value" ;可以设置一个属性，但是**并不会在DOM元素中出现** ；
* setAttribute 无论设置新增属性还是固有属性，**都会在DOM元素中出现** ；

### 5 注意用什么方式设置属性，就要用什么方式获取属性，

​	a 比如 "." 操作符设置的属性无法用getAttribute("property")获取到;"." 获取的未被设置的属性值是 undefined;

​	b 比如setAttribute("property","value")设置的属性值无法用  "."  操作符来获取；获取未被设置的属性值是null;

​	c "."操作符设置属性要通过"."操作符获取；setAttribute设置的属性值只能通过getAttribute来获取；

### 6 所有的属性节点里面，最常用的就是style属性节点，如何操作style属性节点，要理清元素属性和元素样式属性的关系，元素属性包括样式属性；

注意:**元素的属性-->包括style 属性，id属性  class属性 title属性等--->style属性里面又包含了一些样式属性**-->字体，文本，文本装饰，布局，尺寸，定位，颜色，变换(transform)，过渡(transition)，背景，外补白，内补白等都是属性;

**a) JAVAScript( DOM ) 中操作☞ 获取  style的属性值:** 

```html
ele.style.getPropertyValue('property');//只能获取内嵌式  style  属性中的CSS属性
window.getComputedStyle("ele","null").getPropertyValue("property");//可以获取包括style属性里面的CSS样式属性以及<style></style>标签里面的CSS样式属性，或者外联式的CSS样式属性；
```

*  获取元素内嵌式style属性的值: ele.style.property   等价于  ele.style.getPropertyValue('property') 来获取style样式属性的属性值，注意**获取的属性值结果是一个字符串类型** ； **只能获取内嵌式style 的属性值**   ； **如果是内联式或者外联式的属性值则获取不到，返回的结果是一个空字符串** 

   总结来说就是，
   *  只能获取内嵌式style的样式属性值，返回该属性的字符串值；
   *  如果获取的属性内嵌式style里面没有该属性，那么返回空字符串；
   *  这两种获取style样式属性总会返回一个字符串的结果，要么有值，要么是一个空字符串；

* 获取元素内联style标签里面或者外联式的元素的style样式某个属性值 :

```html
ele.currentStyle['property'] //在旧的IE支持该方法
window.getComputedStyle("元素":"伪类").property    
window.getComputedStyle("元素"，"伪类)"[property]
window.getComputedStyle("元素"，"伪类").getPropertyValue("直接属性名");
```

* window.getComputedStyle("元素"，”伪类)可以获取该元素的**所有**的**最终** 使用的CSS属性值

ele.style  也是可以获取该元素的所有的最终使用的CSS属性

* 二者区别是 第一: window.getComputedStyle("ele","伪类")是一个只读的属性，而ele.style 是一个可读可写的属性；
  第二:`getComputedStyle`方法获取的是最终应用在元素上的所有CSS属性对象（即使没有CSS代码，也会把默认的祖宗八代都显示出来）；而`element.style`只能获取元素`style`属性中(注意：内嵌式)的CSS样式。因此对于一个光秃秃的元素``，`getComputedStyle`方法返回对象中`length`属性值（如果有）就是`190+`(据我测试FF:192, IE9:195, Chrome:253, 不同环境结果可能有差异), 而`element.style`就是`0`。

```html
         <div style='width: 100px ;background-color: #000000  ;margin: 0 auto;'></div>  的ele.style.length = 6 ,分别是width  background-color 和4个margin值
         <div style='width: 100px ;background-color: #000000  ;'></div> 而这个div的ele.style.length = 2 ,分别是width 和 background-color;
```

封装兼容低版本的获取元素属性值的代码:注意一点就是获取的结果是一个字符串类型的属性值，比如18px  red等字符串

```html
function getComputedStyle(ele,attr){
  	return window.getComputedStyle ? window.getComputedStyle(ele,null)[attr] : ele.currentStyle(attr)
}
```

**b) JAVAScript(DOM)中操作☞ 设置 style的属性值:** 

*  设置style属性的值 ele.style.property = "value"  等价于 ele.style.setProperty('property','value')来设置元素的style样式属性值

### 7 对于不是元素的样式属性，比如offsetWidth  offsetHeight  clientWidth clientHeight scrollWidth scrollHeight 等，不能通过获取样式属性的方法获取这些值。

*  js中

```html
  ele.offsetWidth(包括border)  ele.scrollWidth  ele.clientWidth(包括padding)
  ele.offsetHeight(包括border) ele.scrollHeight ele.clientWidth(包括padding)
  ele.offsetLeft ele.offsetTop  ele.scrollLeft ele.scrollTop ele.clientLeft ele.clientTop 
```

*  jquery中

```html
  $("selector").width() $("selector").innerWidth()[包括padding] $("selector").outerWidth()[包括border,设置为诶true时，包括margin];返回值是一个整形数值类型;如果里面设置数值,可以设置被选中元素的宽度
  $("selector").height() $("selector").innerHeight()[包括padding] $("selector").outerHeight()[包括border，设置为true时，包括margin];返回值是一个整形数值类型;如果里面设置数值,可以设置被选中元素的高度
  $("selector").offset() 返回当前元素相对视口的**偏移** ;返回值包括两个整形数值的属性，一个代表left一个代表top,始终是相对于视口的距离
  $("selector").position() 返回当前元素相对于父元素的**偏移**;返回包括两个整形数值的属性;
  $("selector").scrollLeft()返回值是相对于滚动条左部的距离
  $("selector").scrollTop() 返回的是相对于滚动条顶部的距离
```
###8 代码解释:(嗯，乱一点点，不好意思)
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        div{
            height: 150px;
            padding: 10px;
        }
    </style>
</head>
<body>
<input type="button" id='btn1' value='1' style="width: 20px;height: 20px;background-color: #003C78;"/>
<input type="button" id='btn2' value='2' style="width: 20px;height: 20px;background-color: #003C78;"/>

<div style='width: 100px ;background-color: #000000  ;'></div>
<script>
    console.log('先讲解如何获取内嵌style样式属性值');
    document.querySelector('#btn1').onclick = function(){
        var dv = document.querySelector('div');
//   "."操作符的情况
        dv.style.width = "200px";//可以通过"."操作设置元素的style属性值
        console.log(dv.style.width);// 200px  可以获取内嵌式style样式属性值
        console.log(dv.style.padding);//不可以获取外联式style样式属性值，只能获取到一个空字符串
        console.log(typeof dv.style.height);//string
//  通过style的方法API
        dv.style.setProperty ("height","200px");//可以通过setProperty设置style 属性的值
        console.log(dv.style.getPropertyValue('height'));//200px 可以获取内嵌样式的属性值
        console.log(dv.style.getPropertyValue('width'));//200px 可以获取内嵌样式的属性值
        console.log(dv.style.getPropertyValue('padding'));//空字符串，不能获取外联style样式表里面的属性值
        console.log(typeof dv.style.getPropertyValue('padding'));//string
//        两者一样，
//      1 都是可以获取内嵌的style的属性值，如果获取内联式或者外联式的样式属性值，则获取不到，获取结果为一个空的字符串
//      2 同时可以设置style的样式属性值；
    }
    console.log('以下讲解如何获取内联或者外联的style样式属性值');
    document.querySelector("#btn2").onclick = function(){
        var dv = document.querySelector("div");
//        console.log(dv.currentStyle['height']);
//        console.log(dv.currentStyle['width']);
        console.log(window.getComputedStyle(dv,null)['width']);//100px
        console.log(window.getComputedStyle(dv,null).width);//100px
        console.log(window.getComputedStyle(dv,null)['height']);//150px
        console.log(window.getComputedStyle(dv,null).height);//150px
        console.log(window.getComputedStyle(dv,null));//获取当前元素的所有的最终使用的CSS属性值，包括内嵌，内联，外联
      	console.log(dv.style);//建议读者看下控制台的输出结果，代表style属性里面的样式属性值(内嵌)
    }
</script>
</body>
</html>
```



