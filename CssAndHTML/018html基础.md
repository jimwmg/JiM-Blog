---
title:  html基础
date: 2018-01-30 12:36:00
categories: html
---

###1 HTML属性

 HTML全局属性：以下属性可以用于任何元素；

| [accesskey](http://www.w3school.com.cn/tags/att_standard_accesskey.asp) | 规定激活元素的快捷键。                           |
| ---------------------------------------- | ------------------------------------- |
| [class](http://www.w3school.com.cn/tags/att_standard_class.asp) | 规定元素的一个或多个类名（引用样式表中的类）。               |
| [contenteditable](http://www.w3school.com.cn/tags/att_global_contenteditable.asp) | 规定元素内容是否可编辑。                          |
| [contextmenu](http://www.w3school.com.cn/tags/att_global_contextmenu.asp) | 规定元素的上下文菜单。上下文菜单在用户点击元素时显示。           |
| [data-*](http://www.w3school.com.cn/tags/att_global_data.asp) | 用于存储页面或应用程序的私有定制数据。                   |
| [dir](http://www.w3school.com.cn/tags/att_standard_dir.asp) | 规定元素中内容的文本方向。                         |
| [draggable](http://www.w3school.com.cn/tags/att_global_draggable.asp) | 规定元素是否可拖动。                            |
| [dropzone](http://www.w3school.com.cn/tags/att_global_dropzone.asp) | 规定在拖动被拖动数据时是否进行复制、移动或链接。              |
| [hidden](http://www.w3school.com.cn/tags/att_global_hidden.asp) | 规定元素仍未或不再相关。                          |
| [id](http://www.w3school.com.cn/tags/att_standard_id.asp) | 规定元素的唯一 id。                           |
| [lang](http://www.w3school.com.cn/tags/att_standard_lang.asp) | 规定元素内容的语言。                            |
| [spellcheck](http://www.w3school.com.cn/tags/att_global_spellcheck.asp) | 规定是否对元素进行拼写和语法检查。                     |
| [style](http://www.w3school.com.cn/tags/att_standard_style.asp) | 规定元素的行内 CSS 样式。                       |
| [tabindex](http://www.w3school.com.cn/tags/att_standard_tabindex.asp) | 规定元素的 tab 键次序。                        |
| [title](http://www.w3school.com.cn/tags/att_standard_title.asp) | 规定有关元素的额外信息。通常效果就是鼠标悬浮在该元素上显示title的值； |
| [translate](http://www.w3school.com.cn/tags/att_global_translate.asp) | 规定是否应该翻译元素内容。                         |

### 2 HTML事件

* window事件 常见的如下

| 属性                                                         | 值     | 描述                                             |
| ------------------------------------------------------------ | ------ | ------------------------------------------------ |
| onhaschange                                                  | script | 当文档已改变时运行的脚本。                       |
| [onload](http://www.w3school.com.cn/tags/event_onload.asp)   | script | 页面结束加载之后触发。                           |
| onmessage                                                    | script | 在消息被触发时运行的脚本。                       |
| onoffline                                                    | script | 当文档离线时运行的脚本。                         |
| onpageshow                                                   | script | 当窗口成为可见时运行的脚本。                     |
| [onresize](http://www.w3school.com.cn/tags/event_onresize.asp) | script | 当浏览器窗口被调整大小时触发。                   |
| [onunload](http://www.w3school.com.cn/tags/event_onunload.asp) | script | 一旦页面已下载时触发（或者浏览器窗口已被关闭）。 |

* form 表单事件

| 属性                                                         | 值     | 描述                                                         |
| ------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| [onblur](http://www.w3school.com.cn/tags/event_onblur.asp)   | script | 元素失去焦点时运行的脚本。                                   |
| [onchange](http://www.w3school.com.cn/tags/event_onchange.asp) | script | 在元素值被改变时运行的脚本。                                 |
| oncontextmenu                                                | script | 当上下文菜单被触发时运行的脚本。                             |
| [onfocus](http://www.w3school.com.cn/tags/event_onfocus.asp) | script | 当元素获得焦点时运行的脚本。                                 |
| onformchange                                                 | script | 在表单改变时运行的脚本。                                     |
| onforminput                                                  | script | 当表单获得用户输入时运行的脚本。                             |
| oninput                                                      | script | 当元素获得用户输入时运行的脚本。(设置元素contenteditable可以触发该事件) |
| oninvalid                                                    | script | 当元素无效时运行的脚本。                                     |
| onreset                                                      | script | 当表单中的重置按钮被点击时触发。HTML5 中不支持。             |
| [onselect](http://www.w3school.com.cn/tags/event_onselect.asp) | script | 在元素中文本被选中后触发。                                   |
| [onsubmit](http://www.w3school.com.cn/tags/event_onsubmit.asp) | script | 在提交表单时触发。                                           |

**注意**

1. onchange 在元素值改变时触发。必须满足两个条件：

   第一，text textarea select 属性的value值发生变化，第二，该元素对象失去焦点

   onchange 属性适用于：`<input>、<textarea> 以及 <select> 元素。`

2. oninput 规定只要元素内容发生变化，即可触发该事件（同样不支持脚本改变元素value值触发该事件）

```html
<form action="">
    <input type="text" id='txt' value='请输入'>

</form>
<div id = 'dv' contenteditable="true">afaf</div>
<script>
    var txt = document.getElementById('txt')
    document.getElementById('txt').oninput = function(){
        console.log('txt input',this.value)
        // this.value = 
        console.dir(this)
    }
    document.getElementById('txt').onchange = function(){
        console.log('txt change')
    }
    var dv = document.getElementById('dv')
    console.dir(dv)
    dv.oninput = function(){
        console.log('dvvvv input ')
        txt.value= 'this.value' //脚本改变value值不会触发txt元素的 oninput事件
        txt.focus();
    }
    dv.onchange = function(){ //div元素不能设置
        console.log('dvvvv change')
    }
</script>
```

* 键盘事件（对于可编辑元素，比如input text框，或者设置了contenteditable属性为true的

| 属性                                                         | 值     | 描述                   |
| ------------------------------------------------------------ | ------ | ---------------------- |
| [onkeydown](http://www.w3school.com.cn/tags/event_onkeydown.asp) | script | 在用户按下按键时触发。 |
| [onkeypress](http://www.w3school.com.cn/tags/event_onkeypress.asp) | script | 在用户敲击按钮时触发。 |
| [onkeyup](http://www.w3school.com.cn/tags/event_onkeyup.asp) | script | 当用户释放按键时触发。 |

事件的事件次序：

**onkeydown > onkeypress  > onkeyup**

注释：在任何浏览器中，onkeypress 事件不会被所有按键触发（例如 ALT、CTRL、SHIFT、ESC）。

注释：onkeypress 属性不适用以下元素：`<base>、<bdo>、<br>、<head>、<html>、<iframe>、<meta>、<param>、<script>、<style> 或 <title>。`

* 鼠标事件

| 属性                                                         | 值     | 描述                                           |
| ------------------------------------------------------------ | ------ | ---------------------------------------------- |
| [onclick](http://www.w3school.com.cn/tags/event_onclick.asp) | script | 元素上发生鼠标点击时触发。                     |
| [ondblclick](http://www.w3school.com.cn/tags/event_ondblclick.asp) | script | 元素上发生鼠标双击时触发。                     |
| ondrag                                                       | script | 元素被拖动时运行的脚本。                       |
| ondragend                                                    | script | 在拖动操作末端运行的脚本。                     |
| ondragenter                                                  | script | 当元素元素已被拖动到有效拖放区域时运行的脚本。 |
| ondragleave                                                  | script | 当元素离开有效拖放目标时运行的脚本。           |
| ondragover                                                   | script | 当元素在有效拖放目标上正在被拖动时运行的脚本。 |
| ondragstart                                                  | script | 在拖动操作开端运行的脚本。                     |
| ondrop                                                       | script | 当被拖元素正在被拖放时运行的脚本。             |
| [onmousedown](http://www.w3school.com.cn/tags/event_onmousedown.asp) | script | 当元素上按下鼠标按钮时触发。                   |
| [onmousemove](http://www.w3school.com.cn/tags/event_onmousemove.asp) | script | 当鼠标指针移动到元素上时触发。                 |
| [onmouseout](http://www.w3school.com.cn/tags/event_onmouseout.asp) | script | 当鼠标指针移出元素时触发。                     |
| [onmouseover](http://www.w3school.com.cn/tags/event_onmouseover.asp) | script | 当鼠标指针移动到元素上时触发。                 |
| [onmouseup](http://www.w3school.com.cn/tags/event_onmouseup.asp) | script | 当在元素上释放鼠标按钮时触发。                 |
| onmousewheel                                                 | script | 当鼠标滚轮正在被滚动时运行的脚本。             |
| onscroll                                                     | script | 当元素滚动条被滚动时运行的脚本                 |