---
title: XML base  
date: 2015-11-09 
categories: javascript
tags: xml
comments : true 
updated : 
layout : 
---

XML

1 XML声明以及基础语法

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>   
<!--第一行是 XML 声明。它定义 XML 的版本 (1.0) 和所使用的编码 (ISO-8859-1 = Latin-1/西欧字符集)。
下一行描述文档的根元素-->
<note>										
<to>George</to>
<from>John</from>
<heading>Reminder</heading>
<body>Don't forget the meeting!</body>
</note>
<root>
  <child id="brother">
    <subchild>.....</subchild>
  </child>
</root>
```

注意:xml如何形成良好的语法习惯

- 1)XML 文档必须有根元素             2) XML 文档必须有关闭标签        3)XML 标签对大小写敏感     
- 4)XML 元素必须被正确的嵌套      5)XML 属性必须加引号 

| &lt;   | <    | 小于   |
| ------ | ---- | ---- |
| &gt;   | >    | 大于   |
| &amp;  | &    | 和号   |
| &apos; | '    | 单引号  |
| &quot; | "    | 引号   |

2 xml命名规则:可使用任何名称，没有保留的字词。

- 1)名称可以含字母、数字以及其他的字符     			  2)名称不能以数字或者标点符号开始 
- 3)名称不能以字符 “xml”（或者 XML、Xml）开始             4)名称不能包含空格 

3 xml元素和属性:元数据（有关数据的数据）应当存储为属性，比如id 用来查找元素的，可以存储为属性；而数据本身应当存储为元素。

因使用属性而引起的一些问题,请尽量使用元素来描述数据。而仅仅使用属性来提供与数据无关的信息

- 1)属性无法包含多重的值（元素可以）       2)属性无法描述树结构（元素可以） 
- 3)属性不易扩展（为未来的变化）              4)属性难以阅读和维护 


4 xmlDOM   XMLHttpRequest对象:XMLHttpRequest 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。XMLHttpRequest 可以同步或异步地返回 Web 服务器的响应，并且能够以文本或者一个 DOM 文档的形式返回内容。尽管名为 XMLHttpRequest，它并不限于和 XML 文档一起使用：它可以接收任何形式的文本文档。