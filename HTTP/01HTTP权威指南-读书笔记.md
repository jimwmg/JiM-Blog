---
title：HTTP结构
---

### 1 Web服务器

#### 实际的web服务器会做些什么

* 建立连接 (TCP/IP 连接)
* 接受请求 (解析请求行，查找请求方法，指定的资源标识符以及版本号 ：get  /index.html HTTP/1.0 )
* 处理请求 (根据请求的方法，资源位置，首部等对请求进行处理)
* 访问资源 ( /index.html 将URI 映射为指定的资源地址)
* 构建响应 (构建响应报文：在这里可以进行负载均衡的处理)
* 发送响应 (将构建的响应发送到客户端)
* 记录事务处理过程

###2 HTTP 代理：表示代表客户端完成 HTTP事务处理的中间人； 

​	客户端 < == > HTTP 代理.... < == > web服务器

代理服务器的作用

* 儿童过滤器
* 文档访问控制
* 安全防火墙
* web缓存
* 反向代理
* 内容路由器（根据因特网流量状况以及内容类型将请求导向特定的web服务器）
* 转码器
* 匿名者

### 3 缓存

web缓存是可以自动保存常见文档副本的 HTTP 设备，当web请求抵达缓存的时候，如果本地有已缓存的副本，就可以从本地存储设备中提取这个文档，

优点如下

* 减少了冗余的数据传输
* 缓解了网络的瓶颈问题
* 降低了对原始服务器的要求（瞬间拥塞）
* 降低了距离时延

####3.1 强制缓存和协商缓存

对于强制缓存来说，响应header中会有两个字段来标明失效规则（Expires/Cache-Control）使用chrome的开发者工具，可以很明显的看到对于强制缓存生效时，网络请求的情况。

#### Expires

Expires的值为服务端返回的到期时间，即下一次请求时，请求时间小于服务端返回的到期时间，直接使用缓存数据。

不过Expires 是HTTP 1.0的东西，现在默认浏览器均默认使用HTTP 1.1，所以它的作用基本忽略。

另一个问题是，到期时间是由服务端生成的，但是客户端时间可能跟服务端时间有误差，这就会导致缓存命中的误差。

所以HTTP 1.1 的版本，使用Cache-Control替代。

#### Cache-Control

Cache-Control 是最重要的规则。常见的取值有private、public、no-cache、max-age，no-store，默认为private。

```
private:  客户端可以缓存
public:  客户端和代理服务器都可缓存（前端的同学，可以认为public和private是一样的）
max-age=xxx:   缓存的内容将在 xxx 秒后失效
no-cache:需要使用对比缓存来验证缓存数据（后面介绍）
no-store:所有内容都不会缓存，强制缓存，对比缓存都不会触发
```

（对于前端开发来说，缓存越多越好，so…基本上和它说886）

#### 3.2 协商缓存

对于对比缓存来说，缓存标识的传递是我们着重需要理解的，它在请求header和响应header间进行传递，一共分为两种标识传递，接下来，我们分开介绍。

#### Last-Modified / If-Modified-Since

Last-Modified：服务器在响应请求时，告诉浏览器资源的最后修改时间。

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

If-Modified-Since：

再次请求服务器时，通过此字段通知服务器上次请求时，服务器返回的资源最后修改时间。

服务器收到请求后发现有头If-Modified-Since 则与被请求资源的最后修改时间进行比对。

若资源的最后修改时间大于If-Modified-Since，说明资源又被改动过，则响应整片资源内容，返回状态码200；若资源的最后修改时间小于或等于If-Modified-Since，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache。

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

#### Etag / If-None-Match（优先级高于Last-Modified / If-Modified-Since）

Etag: w/"v2.7".  If-None-Match : w/"v2.7"

第一次客户端访问资源的时候，服务端返回资源内容的同时返回了ETag：1234，告诉客户端：这个文件的标签是1234，我如果修改了我这边的资源的话，这个标签就会不一样了。

第二次客户端访问资源的时候，由于缓存中已经有了Etag为1234的资源，客户端要去服务端查询的是这个资源有木有过期呢？所以带上了If-None-Match: 1234。告诉服务端：如果你那边的资源还是1234标签的资源，你就返回304告诉我，不需要返回资源内容了。如果不是的话，你再返回资源内容给我就行了。服务端就比较下Etag来看是返回304还是200。

### 4 集成点：网关，隧道以及中继

### 







