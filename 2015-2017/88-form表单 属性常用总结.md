---
title: form   
date: 2016-04-11 12:36:00
categories: javascript
tags: form
comments : true 
updated : 
layout : 
---

### form表单属性常用总结

1 enctype 设置或返回表单用来编码内容的 MIME 类型；规定在发送表单数据之前如何对其进行编码。 

* enctype 属性可设置或返回用于  **编码表单内容** 的 MIME 类型。如果表单没有 enctype 属性，那么当提交文本时的默认值是 "application/x-www-form-urlencoded"。
* 当 input type 是 "file" 时，必须设置是 "multipart/form-data"。
* 注意enctype属性是   用来设置如何对提交的内容进行编码的 属性


| 值                                 | 描述                                       |
| --------------------------------- | ---------------------------------------- |
| application/x-www-form-urlencoded | (默认) 在发送到服务器之前，所有字符都会进行编码（空格转换为 "+" 加号，特殊符号转换为 ASCII HEX 值）。 |
| multipart/form-data               | 不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。           |
| text/plain                        | 空格转换为 "+" 加号，但不对特殊字符编码。**如果设置该属性,这不会对上传数据进行编码** |

2 method 属性,规定表单以何种方式向服务器发送数据

​	2.1 get方式发送数据 这时浏览器会与表单处理服务器建立连接，然后直接在一个传输步骤中发送所有的表单数据：浏览器会将数据直接附在表单的 action URL 之后。这两者之间用问号进行分隔。

**如果不指定method属性值，默认以get方式发送数据** 

```html
<form action="35-form.php" method="get">
    <input type="text" name="username" value="txt"/>
    <input type="password" name="psw" value="password"/>
    <input type="submit" value="提交"/>
</form>
地址栏显示:http://127.0.0.1/03-ajxa/mycode/35-form.php?username=txt&psw=password
```

​	2.2 post 方式发送数据 浏览器将会按照下面两步来发送数据。首先，浏览器将与 action 属性中指定的表单处理服务器建立联系，一旦建立连接之后，浏览器就会按分段传输的方法将数据发送给服务器。在服务器端，一旦 POST 样式的应用程序开始执行时，就应该从一个标志位置读取参数，而一旦读到参数，在应用程序能够使用这些表单值以前，必须对这些参数进行解码。用户特定的服务器会明确指定应用程序应该如何接受这些参数
```html
<form action="35-form.php" method="post">
    <input type="text" name="username" value="txt"/>
    <input type="password" name="psw" value="password"/>
    <input type="submit" value="提交"/>
</form>
地址栏显示:http://127.0.0.1/03-ajxa/mycode/35-form.php
```



