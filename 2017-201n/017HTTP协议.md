---
title: HTTP协议
date: 2017-08-23
categories: HTTP
tags: 
---

### 1 HTTP之URL  URI

####二者的定义

HTTP使用统一资源标识符（Uniform Resource Identifiers, URI）来传输数据和建立连接。URL是一种特殊类型的URI，包含了用于查找某个资源的足够的信息 

URL,全称是UniformResourceLocator, 中文叫统一资源定位符,是互联网上用来标识某一处资源的地址。

#### 二者的区别

##### URI，是uniform resource identifier，统一资源标识符，用来唯一的标识一个资源。

Web上可用的每种资源如HTML文档、图像、视频片段、程序等都是一个来URI来定位的
URI一般由三部组成：
①访问资源的命名机制
②存放资源的主机名
③资源自身的名称，由路径表示，着重强调于资源。  

##### URL是uniform resource locator，统一资源定位器，它是一种具体的URI，即URL可以用来标识一个资源，而且还指明了如何locate这个资源。

```
schema://host[:port#]/path/.../[?query-string][#anchor]
```

URL是Internet上用来描述信息资源的字符串，主要用在各种WWW客户程序和服务器程序上，特别是著名的Mosaic。
采用URL可以用一种统一的格式来描述各种信息资源，包括文件、服务器的地址和目录等。URL一般由三部组成：
①协议(或称为服务方式)
②存有该资源的主机IP地址(有时也包括端口号)
③主机资源的具体地址。如目录和文件名等

| scheme               指定低层使用的协议(例如：http, https, ftp) |      |      |
| ---------------------------------------- | ---- | ---- |
| host                   HTTP服务器的IP地址或者域名  |      |      |
| port#                 HTTP服务器的默认端口是80，这种情况下端口号可以省略。如果使用了别的端口，必须指明，例如 http://www.cnblogs.com:8080/ |      |      |
| path                   访问资源的路径           |      |      |
| query-string       发送给http服务器的数据         |      |      |

##### URN，uniform resource name，统一资源命名，是通过名字来标识资源，比如mailto:java-net@java.sun.com。

URI是以一种抽象的，高层次概念定义统一资源标识，而URL和URN则是具体的资源标识的方式。URL和URN都是一种URI。笼统地说，每个 URL 都是 URI，但不一定每个 URI 都是 URL。这是因为 URI 还包括一个子类，即统一资源名称 (URN)，它命名资源但不指定如何定位资源。上面的 mailto、news 和 isbn URI 都是 URN 的示例。  

在Java的URI中，一个URI实例可以代表绝对的，也可以是相对的，只要它符合URI的语法规则。而URL类则不仅符合语义，还包含了定位该资源的信息，因此它不能是相对的。
在Java类库中，URI类不包含任何访问资源的方法，它唯一的作用就是解析。
相反的是，URL类可以打开一个到达资源的流。

如果使用mac上的charls抓包工具，发现并不能抓取到包，可能我们设置了：自动代理配置，[详见](http://www.cnblogs.com/season-huang/p/6269841.html)

### 2 HTTP之Request.    [HTTP](http://tools.jb51.net/table/http_header)

* http协议是无状态的，同一个客户端的这次请求和上次请求是没有对应关系，这就导致即使是请求了相同的资源，浏览器还是会从服务端去拿。对http服务器来说，它并不知道这两个请求来自同一个客户端。 为了解决这个问题， Web程序引入了Cookie机制来维护状态. 通过cookie等机制，浏览器可以告诉服务器
* referer : 表示当前域是从哪一个域跳转过来的，可用于防盗链和站点统计；
* origion : 其具体流程是，当一个链接或者XMLHttpRequest去请求跨域操作，浏览器事实上的确向目标服务器发起了连接请求，并且携带这origin。 
  当服务器返回时，浏览器将检查response中是否包含Access-Control-Allow-Origin字段，当缺少这个字段时，浏览器将abort，abort的意思是不显示，不产生事件，就好像没有请求过，甚至在network区域里面都看不到。 
  当存在这个header时，浏览器将检查当前请求所在域是否在这个access-control-allow-origin所允许的域内，如果是，继续下去，如果不存在，abort！

[HTTP1](http://www.jianshu.com/p/80e25cb1d81a)

[HTTP推荐教程](http://www.cnblogs.com/rayray/p/3729533.html)

