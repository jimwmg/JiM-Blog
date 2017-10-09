---
title: window
date: 2016-05-13 12:36:00
categories: DOM
tegs : DOM 
comments : true 
updated : 
layout : 
---

### 1 window对象

1.1 Window 对象表示浏览器中打开的窗口。

如果文档包含框架（frame 或 iframe 标签），浏览器会为 HTML 文档创建一个 window 对象，并为每个框架创建一个额外的 window 对象。

1.2 innerHeight  innerWidth 表示浏览器中  **文档显示区**  的高度和宽度，如果F12，调出控制台，那么会影响文档显示区的高度

1.3 outerHeight  outerWidth 

 iframe标签

contentDocument 属性能够以 HTML 对象来返回 iframe 中的文档。

可以通过所有标准的 DOM 方法来处理被返回的对象。

```html
<html>
<head>
<script type="text/javascript">
function getTextNode()
{
var x=document.getElementById("frame1").contentDocument;
alert(x.getElementsByTagName("h2")[0].childNodes[0].nodeValue);
}
</script>
</head>
<body>
<iframe src="frame_a.htm" id="frame1"></iframe>
<br /><br />
<input type="button" onclick="getTextNode()" value="Get text" />
</body>
</html>
```

### 2 window对象的属性

2.1 location属性：window对象的location属性指向Location对象.通过如下方式可以查看所有的locatio对象的属性和方法

```javascript
for (var key in location){
  console.log(key + "-->"+location[key]);
}
```

| [hash](prop_loc_hash.asp)         | 设置或返回从井号 (#) 开始的 URL（锚）。    |
| --------------------------------- | --------------------------- |
| [host](prop_loc_host.asp)         | 设置或返回主机名和当前 URL 的端口号。       |
| [hostname](prop_loc_hostname.asp) | 设置或返回当前 URL 的主机名。           |
| [href](prop_loc_href.asp)         | 设置或返回完整的 URL。               |
| [pathname](prop_loc_pathname.asp) | 设置或返回当前 URL 的路径部分。          |
| [port](prop_loc_port.asp)         | 设置或返回当前 URL 的端口号。           |
| [protocol](prop_loc_protocol.asp) | 设置或返回当前 URL 的协议。            |
| [search](prop_loc_search.asp)     | 设置或返回从问号 (?) 开始的 URL（查询部分）。 |

2.2 history属性: window对象的history属性指向History对象

```html
<input type="button" value="按钮" id="btn"/>
<script>
  //如果HTML以id来为元素命名，并且Window对象没有此名字的属性，Window对象会赋予一个属性，它的名字是id值，指向ＨＴＭＬ　元素；
    console.log(window.btn);//<input type="button" value="按钮" id="btn"/>
</script>
```

