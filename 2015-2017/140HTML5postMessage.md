---
title: HTML5 postMessage
date: 2016-07-15 12:36:00
categories: html HTML5 http
comments : true 
tags : HTML5
updated : 
layout : 
---

1 HTML5新的API允许跨域访问其他页面，postMessage ;语法如下

发送消息的窗口，通过postMessage API发送消息

```javascript
targetWindow.postMessage(mes,targetOrigin)

targetWindow  指目标窗口，也就是给哪个window发消息，是 window.frames 属性的成员或者由 window.open 方法创建的窗口 
mes : 是要发送的信息
targetOrigin : 是  限定  消息接受的域范围，如果不限定可以使用* 字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。
```

接受消息的窗口，通过message事件为该窗口注册事件

```javascript
window.addEventListener('message',function(e){
  console.log(e.data);//传递过来的消息
  console.log(e.source);//发送消息的窗口对象
  console.log(e.origin);//发送消息窗口的源（协议+主机+端口号）
})
```

2 栗子分析 www.myvirtual1.com   www.myvirtual2.com  是我的两个虚拟主机

假如在http://www.myvirtual1.com/post1.html  文件内容如下

```html

<!DOCTYPE html>
<html>
<head>
    <title>Post Message</title>
</head>
<body>

<iframe id="child" src="http://www.myvirtual2.com/post2.html"></iframe>

<input type="button" id="btn" value="click to send message"/>
<input type="text" id="send" placeholder='please input what you want to send anotherwindow'/>
<script type="text/javascript">
document.getElementById('btn').onclick = sendMessage();
function sendMessage(){
    var str = document.querySelector('#send').value;
    var frame = window.frames[0];
    frame.postMessage(str,'http://www.myvirtual2.com');
    console.log("message is sended");
}
</script>
</body>
</html>
```

http://www.myvirtual2.com/post2.html  文件内容如下

```html
<!doctype html>
<html>
<head>
    <style type="text/css">
        html,body{
            height:100%;
            margin:0px;
        }
    </style>
</head>
<body>

<input type="text" value="this will be changed when you click the button "/>
<script type="text/javascript">
    function receiveMessage(){
        window.addEventListener('message',function(e){  //这个事件在当post1页面发送消息的时候才会触发
            console.log(e.data);//传递过来的消息
            console.log(e.source);//发送消息的窗口对象
            console.log(e.origin);//发送消息窗口的源（协议+主机+端口号）
            document.querySelector('input').value = e.data;
        })
    }
    window.onload = function(){
        receiveMessage();
    }
</script>
</body>
</html>
```

3 跨域的时候，正常来说由于受同源策略的影响，不同域之间的页面不允许通信，postMessage方法可以跨域发送信息，然后在另外一个页面可以被处理。