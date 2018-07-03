---
title: HTML5 dataset
date: 2016-06-15 12:36:00
categories: html
comments : true 
tags : HTML5
updated : 
layout : 
---

属性操作  DOM  jQuery   中对比解析：

DOM中操作元素属性的方法：

1 直接在元素内声明：

```
<div id="dv" class="cls" abc = "hello"></div>
```

声明之后可以对元素的属性进行操作

```javascript
console.log(document.getElementById("dv").getAttribute("class"));
console.log(document.getElementById("dv").getAttribute("abc"));
console.log(document.getElementById("dv").abc);
```

输出结果：cls    hello  undefined   (  .  操作符只能操作HTML元素固有的属性，这些个"莫须有"的无法操作)

2 通过setAttribute("属性名","属性值")，可以为元素设置固有属性值或者新的属性

通过 ele.property = "value",可以为元素设置属性值

```javascript
document.getElementById("dv").setAttribute("index","9");
document.getElementById("dv").aaaa = "hello again";	//不起作用
document.getElementById("dv").style.height = "200px";
document.getElementById("dv").title = "我是通过固有属性设置的";
上面这行代码执行完毕之后：
<div id="dv" class="cls" abc = "hello" index="9" style="height:200px;" title = "我是通过固有属性设置的"></div>
然后在执行下这段代码的话：
console.log(document.getElementById("dv").index);
console.log(document.getElementById("dv").title);
输出结果：
undefined  
我是通过固有属性设置的
```

注意细节  ：  " .  " 运算符  可以直接设置固有属性  比如  class  title lang  href  src 等某些元素特有的一些属性，以及样式属性  style;

但是  ". " 运算符不能直接设置新增的属性  ，比如 index   aaa  等新增的，原来并不存在的属性，obj.index  不会报错，但是不会起作用，如果用"[ ]"运算符，obj[index]  会直接报错，[ ] 运算符不能操作不存在的属性，

总结：

1  “ .  ”运算符只能 **设置**  元素的**固有属性**和 以及 **获取**  元素的**固有属性值**，不能**给元素设置新增属性**以及**获取元素的新增属性值**；

2 setAttribute("property","value"),getAttribute("property"),其中property属性名既可以是固有的属性，也可以是新增属性，可以设置元素的属性值或者获取元素的属性值。

3 jquery中操作元素属性的方法：

*  prop("property","value"),可以**设置**jquery对象的固有属性，注意仅仅是固有属性，也就是说W3C里面本来就有的属性，prop("property")，可以**获取**jquery对象属性值；
*  attr("property","value"),可以**设置**jquery对象的固有属性，也就是说W3C里面本来就有的属性，也可以新增一些W3C没有规定的属性，比如index  aaa  等等符合命名规则的新增属性；attr("property")，可以**获取**jquery对象属性值，包括固有属性以及新增属性。


4 HTML全局属性(固有属性)

| 属性                                       | 描述                          |
| ---------------------------------------- | --------------------------- |
| [accesskey](att_standard_accesskey.asp)  | 规定激活元素的快捷键。                 |
| [class](att_standard_class.asp)          | 规定元素的一个或多个类名（引用样式表中的类）。     |
| [contenteditable](att_global_contenteditable.asp) | 规定元素内容是否可编辑。                |
| [contextmenu](att_global_contextmenu.asp) | 规定元素的上下文菜单。上下文菜单在用户点击元素时显示。 |
| [data-*](att_global_data.asp)            | 用于存储页面或应用程序的私有定制数据。         |
| [dir](att_standard_dir.asp)              | 规定元素中内容的文本方向。               |
| [draggable](att_global_draggable.asp)    | 规定元素是否可拖动。                  |
| [dropzone](att_global_dropzone.asp)      | 规定在拖动被拖动数据时是否进行复制、移动或链接。    |
| [hidden](att_global_hidden.asp)          | 规定元素仍未或不再相关。                |
| [id](att_standard_id.asp)                | 规定元素的唯一 id。                 |
| [lang](att_standard_lang.asp)            | 规定元素内容的语言。                  |
| [spellcheck](att_global_spellcheck.asp)  | 规定是否对元素进行拼写和语法检查。           |
| [style](att_standard_style.asp)          | 规定元素的行内 CSS 样式。             |
| [tabindex](att_standard_tabindex.asp)    | 规定元素的 tab 键次序。              |
| [title](att_standard_title.asp)          | 规定有关元素的额外信息。                |
| [translate](att_global_translate.asp)    | 规定是否应该翻译元素内容。               |

5 HTML5 新增API  dataset

5.1.1 **js中** 原生js方法对dataset属性的修改会直接在DOM树上表现出来； 先来看下原来的获取和设置属性的方式是否可以起作用  setAttribute  getAttribute . 操作符；

```html
 <!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        [data-color] {
            background-color: red;
        }
        [data-width]{
            width: 100px;

        }
        [data-height]{
            height: 100px;
        }
    </style>
</head>
<body>
<input type="button" value="按钮"/>
<div id="dv" class="box" aaa="nothing" data-color="red" data-position="pos" data-address="china" data-width="w" data-height="h"  data-name-first="kobe"  data-nameLast = "james"></div>
<script>
    window.onload = function(){
        document.querySelector("input[type=button]").onclick = function(){
            var box = document.querySelector("#dv");
            console.log(box.className);//box
            console.log(box.id);//dv
            console.log(box.aaa);//undefined  .  操作符只能操作html元素固有的属性
//            console.log(box.data-position);//报错  ，无法操作
            console.log(box.getAttribute("data-position"));//pos
            box.setAttribute("data-position","poschange");//设置data*  的属性值
            console.log(box.getAttribute("data-position"));//poschange 
        };
    };
</script>
</body>
</html>
```

既然原来的方法可以操作data*  属性，那么 dataset这个新的API还有什么作用呢？好的，如果我想获取所有的属性值，那么该怎么操作呢？这个时候，dataset的威力就显示出来了

**5.1.2 dataset是HTML5新增的一个API ,里面存放了所有的使用  data-xx 格式设置的属性集合，是一个对象**;我们仅仅改变script标签里面的代码，html代码不变；

```html
<script>
    window.onload = function(){
        document.querySelector("input[type=button]").onclick = function(){
            var box = document.querySelector("#dv");
            console.log(box.dataset);//可以获取所有的data-xx 属性值，实际工作中便于解析成字符串
          //DOMStringMap {color: "red", position: "pos", address: "china", width: "w", height: "h",nameFirst:"kobe"namelast:"james"}
            console.log(typeof box.dataset);//object
            console.log(box.dataset.color);//red
          	console.log(box.dataset.position);//pos
            box.dataset.position = "poschange" ;//通过dataset设置属性值
            console.log(box.dataset.position);//poschange
          //注意 data-xx-yy  以及data-nameLast  命名的方式细节处理
          //console.log(box.dataset.name-first);//会报错
            console.log(box.dataset.nameFirst);//kobe
            console.log(box.dataset.nameLast);//undefined  获取不到
            console.log(box.dataset.namelast);//james 
        };
    };
</script>
```

**dataset 接口可以直接操作由data-xx  格式设置的所有data属性,即可以获取值，也可以设置值**

* data-name-first 设置的属性，获取的时候 必须以data.nameFirst 
* data-nameLast 设置的属性，获取的时候  必须以 dataset.namelast 

5.2.1 **jQuery**中 attr prop  jquery中dataset属性值的操作不会在DOM树上表现出来；

```html
<script src="jquery-1.12.2.js"></script>
<script>
    $(function(){
        $("input:button").click(function(){
            console.log($("#dv").attr("data-color"));//red
            console.log($("#dv").prop("data-color"));//获取不到 undefined 同样prop也无法设置
            $("#dv").attr("data-color","green");//DOM 树上会显示改变
            console.log($("#dv").attr("data-color"));//green
        });
    });
</script>
```

5.2.2 jquery中  data("key")获取属性值  data("key","value")设置属性值；

```html
<script src="jquery-1.12.2.js"></script>
<script>
    $(function(){
        $("input:button").click(function(){
            console.log($("#dv").data);
            console.log($("#dv").data("color"));//red
            $("#dv").data("color" , "green");//设置属性，不会在DOM树上表现出来
            console.log(document.querySelector("#dv").dataset.color); //js获取还是red  这个需要注意
            console.log($("#dv").data("color"));//green
            console.log($("#dv").data("nameFirst"));//kobe
            console.log($("#dv").data("nameLast"));//undefined
            console.log($("#dv").data("namelast"));//james
        });

    });

</script>
```

jquery中data("key","value" )方法可以获取元素的属性值，也可以设置元素的属性值

- data-name-first 设置的属性，获取的时候 必须以data("nameFirst") 
- data-nameLast 设置的属性，获取的时候  必须以 dataset("namelast")
- 这点和原生js是一致的。 
- 这个新的属性很方便我们在元素上存取数据而不用进行Ajax请求


5.3.1根据以上总结，我们在给data-xxx  属性命名的时候，尽量不应该包含大写字母，以方便查询

5.3.2 data-xx  属性里面可以存储的页面应用或者应用程序的私有的自定义的数据，不进行Ajax请求调用服务器端的数据查询，增加性能；



睡觉!