---
title: from disk cache 和 from memory cache 却别
---

## 1.from disk cache 和 from memory cache

在chrome浏览器中的控制台Network中size栏通常会有三种状态

1.from memory cache

2.from disk cache

3.资源本身的大小(如：1.5k)

那么问题来了

1.三种区别在哪里；2.浏览器采取不同措施的原则是什么；3.其他浏览器的策略

下面分别讲述以上三个问题

**1.三种区别在哪**

**from memory cache**：字面理解是从内存中，其实也是字面的含义，这个资源是直接从内存中拿到的，**不会请求服务器**一般已经加载过该资源且缓存在了内存当中，当关闭该页面时，此资源就被内存释放掉了，再次重新打开相同页面时不会出现from memory cache的情况

**from disk cache**：同上类似，此资源是从磁盘当中取出的，也是在已经在之前的某个时间加载过该资源，**不会请求服务器**但是此资源不会随着该页面的关闭而释放掉，因为是存在硬盘当中的，下次打开仍会from disk cache

**资源本身大小数值**：当http状态为200是实实在在从浏览器获取的资源，当http状态为304时该数字是与服务端通信报文的大小，并不是该资源本身的大小，该资源是从本地获取的

**2.chrome采取措施的准则**

什么时候是from memory cache 什么时候是from disk cache 呢？

即哪些资源会放在内存当中，哪些资源浏览器会放在磁盘上呢，结果如下下表所示

 

| **状态** | **类型**              | **说明**                                                     |
| -------- | --------------------- | ------------------------------------------------------------ |
| 200      | **form memory cache** | **不请求网络资源，资源在内存当中，一般\**脚本、字体、图片\**会存在内存当中** |
| 200      | **form disk ceche**   | **不请求网络资源，在磁盘当中，一般非脚本会存在内存当中，如\**css\**等** |
| 200      | 资源大小数值          | **从服务器下载最新资源**                                     |
| 304      | 报文大小              | **请求服务端发现资源没有更新，使用本地资源**                 |

以上是chrome在请求资源是最常见的两种http状态码

由此可见样式表一般在磁盘中，不会缓存到内存中去，因为css样式加载一次即可渲染出网页

但是脚本却可能随时会执行，如果脚本在磁盘当中，在执行该脚本需要从磁盘中取到内存当中来

这样的IO开销是比较大的，有可能会导致浏览器失去响应

**3.不同浏览器策略是否一致**

以上的数据及统计都是在chrome浏览器下进行的

在Firefox下并没有from memory cache以及from disk cache的状态展现

相同的资源在chrome下是from disk/memory cache，但是Firefox统统是304状态码

即Firefox下会缓存资源，但是每次都会请求服务器对比当前缓存是否更改，chrome不请求服务器，直接拿过来用

这也是为啥chrome比较快的原因之一吧，

当然以上是粗略的研究chrome资源的获取策略，至于chrome如何保证资源的更新，

即什么时候200，什么时候304还需要更深入的研究

## 2.X-cache-status 响应头

X-Cache-Lookup:Hit From MemCache 表示命中CDN节点的内存
X-Cache-Lookup:Hit From Disktank 表示命中CDN节点的磁盘
X-Cache-Lookup:Hit From Upstream 表示没有命中CDN



根据[阿里云官网](https://help.aliyun.com/document_detail/27266.html)解释：
若：X-Cache:HIT TCP_MEM_HIT 表示命中缓存
若：X-Cache:MISS TCP_MISS 则表示未命中缓存



## 3. APP webview 静态资源缓存 

