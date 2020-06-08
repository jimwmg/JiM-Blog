---
title:express-api-fallback
---

### 1.单页面应用 History 路由模式

```javascript
const express = require('express');

const path = require('path');
const history = require('connect-history-api-fallback')
const app = express();


//在express中使用的时候需要注意一点的是，该中间件必须要放在express.static中间前的前面引入，否则会出现问题。
app.use(history())

app.listen(8000);
```

## 前言

这里使用vue-router来实现的单页应用为例，访问[http://cnode.lsqy.tech](http://cnode.lsqy.tech/)，进入首页，点击下面的tab栏，一切都是很正常的，但当这时候你 `ctrl+command+R` 或 点击浏览器的刷新按钮 或 在地址栏上再敲一下回车，总之就是刷新，发现就会出现404了，比如这样的错误`Cannot GET /message/`,因为默认浏览器会认为你是在请求服务端的路由，服务端那边没有对应的处理，所以自然就会出错了，下面来引入`connect-history-api-fallback`这个中间件，来无痛使用优雅的History路由模式。

## 引入connect-history-api-fallback

首先看它的介绍`Middleware to proxy requests through a specified index page, useful for **Single Page Applications** that utilise the HTML5 History API.`
中文意思就是一个能够代理请求返回一个指定的页面的中间件，对于单页应用中使用HTML5 History API非常有用。

## 用法

经典的npm安装,注意将其作为依赖项，加上`--save`

```
npm install --save connect-history-api-fallback
```

接下来是在express的简单使用

```
var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');
var history = require('connect-history-api-fallback');

var app = express();

app.use(history());
app.use(ecstatic({ root: __dirname + '/dist' }));

http.createServer(app).listen(6565);
```

这样配置完之后，再重新`restart`一下项目,你就会发现现在可以非常顺畅的使用了，不管你是刷新了浏览器还是直接通过`url`从外部访问都不会出现`404`的结果了。
另外，`connect-history-api-fallback`还有一些可配置的`Options`项,这个如果需要详细了解可以仔细看看其API的调用即可

## 总结

其实有时候对于单页面应用，虽然是单页的，但是也会有很多不仅仅是必须从首页进去的情况，比如要分享某个页面，这样我们希望能够直接通过这个简洁的`url`来跳到这个指定的页面，但是如果不做上面的配置的话就会出现`404`这样的错误了，其实这样的话也算是接管了传统的服务端路由，来完全交给前端来处理路由跳转了，这样以后的url就非常简洁优雅了。

> reference: github地址[connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)