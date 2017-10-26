---
title:  NodeJHTTP
date: 2016-11-20 12:36:00
categories: nodejs
comments : true 
updated : 
---

### 1 HTTP模块

'http'模块提供两种使用方式：

- 作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应。
- 作为客户端使用时，发起一个HTTP客户端请求，获取服务端响应。

基本使用

* 作为服务端

```javascript
http.createServer(function (request, response) {
    var body = [];

    console.log(request.method);
    console.log(request.headers);

    request.on('data', function (chunk) {
        body.push(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
}).listen(80);

```

* 作为客户端

```javascript
var options = {
        hostname: 'www.example.com',
        port: 80,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
//http.request创建了一个客户端；
var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();

```

