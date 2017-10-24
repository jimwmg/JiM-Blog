---
title:  web中的path路径浅析
date: 2016-11-28 12:36:00
categories: http
tags : path
comments : true 
updated : 
layout : 
---

之前写过 NodeJs中的path路径浅析 现在简单看下浏览器是如何解析路径的

1 浏览器端解析路径的时候，总是以所解析的文件作为当前页

看下实例demo的目录结构

```
webPath/ 
	js/
	    -app.js
	-index.html
	-ab.html
	-abc.html
```

app.js  以下app文件读取的路径和启动服务器所在目录有着直接的关系，NodeJs中的path路径浅析 已经分析过，不再赘述，这里代码不进行封装了。

```javascript
var http  = require('http');
var fs = require('fs');
var template = require('art-template');
var server = http.createServer();

server.listen(8080,function(){
    console.log("8080running");
});
server.on('request',function(req,res){
    var url = req.url ;
    var method = req.method.toLowerCase();
    console.log(url);
    console.log(method);
    if(method === 'get' && url === '/'){
        fs.readFile('../index.html','utf-8',function(err,data){
            if(err){
                throw err ;
            }
            console.log(data);
            var htmlStr = template.compile(data)({info:{flag:'/'}});
            res.end(htmlStr)
        })

    }else if(method === 'get' && url === '/aaa/bbb'){
        fs.readFile('../ab.html','utf-8',function(err,data) {
            if (err) {
                throw err;
            }
            var htmlStr = template.compile(data)({info: {flag: 'ab'}});
            console.log(htmlStr);
            res.end(htmlStr)
        })
    }else if(method === 'get' && url === '/aaa/bbb/ccc'){
        fs.readFile('../abc.html','utf-8',function(err,data) {
            if (err) {
                throw err;
            }
            var htmlStr = template.compile(data)({info: {flag: 'abc'}});
            res.end(htmlStr)
        })
    }

});
```

index.html

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<a href="../aaa/bbb">地址: ../aaa/bbb</a><br/>
<a href="./aaa/bbb">地址:  ./aaa/bbb</a><br/>
<a href="/aaa/bbb">地址:   /aaa/bbb</a><br/>
<p>以上三个地址对应的资源是一样的，也就是说上面三种路径的写法在浏览器解析的时候是等价的</p>
<a href="/aaa/bbb/ccc">地址:  /aaa/bbb/cc</a><br/>
<a href="/aaa/bbb/./ccc">地址:  /aaa/bbb/./ccc</a><br/>
<a href="/aaa/bbb/../bbb">地址:  /aaa/bbb/../bbb</a><br/>
<p>flag 标记{{info.flag}}</p>
<p>this is / 对应的内容</p>
</body>
</html>
```

ab.html

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<a href="/">back to index</a>
<p>flag 标记 {{info.flag}}</p>
<p>this is /aaa/bbb 对应的内容</p>
</body>
</html>
```

abc.html

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

<a href="/">back to index</a>

<p>flag 标记 {{info.flag}}</p>
<p>this is /aaa/bbb/ccc对应的内容</p>
</body>
</html>
```

2  我们发现 ../   ./  如果放在路径的开头，则会被浏览器“忽略”；在路径内则会按照原来的 ./ 代表当前路径  ../ 代表上级目录进行解析;

其实，从客户端返回的路径对于服务器来说，就是一个“标识符”，还记得标识符吗？当我们学习定义一个变量的时候，要用var  name = "Jhon",其中的name就是标识符，通过name可以直接获取到Jhon，这里的客户端请求的路径对于服务器也是一样的，客户端的请求也就是一个“标识符”，客户端请求一个 /  服务端返回index.html，客户端请求 /aaa/bbb  服务端返回对应的ab.html页面，当然也可以是不同的其他的资源文件。

根本还是根据客户端的标识符，服务器进行响应，然后返回响应的数据，所以我们有可能看到的是‘假路径’，一切都是假的，咯咯。

3 实际情况通过demo的演示会很清楚的显示，大家动手多实践吧。

