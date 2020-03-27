---
title: cookie
date: 2016-08-13 12:36:00
categories: http cookies
tags : cookies
comments : true 
updated : 
layout : 
---

本地存储cookies篇

### 1 HTTP cookie，通常直接叫做cookie，是客户端用来存储数据的一种选项，它既可以在客户端设置也可以在服务器端设置。cookie会跟随任意HTTP请求一起发送。

Cookie 的作用很好理解，就是用来做**状态存储**的，但它也是有诸多致命的缺陷的：

1. 容量缺陷。Cookie 的体积上限只有`4KB`，只能用来存储少量的信息。
2. 性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。
3. 安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在`HttpOnly`为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

### 2.cookie的用途及工作原理

那cookie具体能干什么呢？

cookie 将信息存储于用户硬盘，因此可以作为全局变量，这是它最大的一个优点。它最根本的用途是 Cookie 能够帮助 Web 站点 `保存有关访问者的信息` ，以下列举cookie的几种小用途。

① 保存用户登录信息。这应该是最常用的了。当您访问一个需要登录的界面，例如微博、百度及一些论坛，在登录过后一般都会有类似”下次自动登录”的选项，勾选过后下次就不需要重复验证。这种就可以通过cookie保存用户的id。

② 创建购物车。购物网站通常把已选物品保存在cookie中，这样可以实现 `不同页面` 之间 `数据的同步` (同一个域名下是可以共享cookie的)，同时在提交订单的时候又会把这些cookie传到后台。

我们可以随便打开天猫，进入自己的购物车，然后勾选几项，看下netWork中XHR的请求

③ 跟踪用户行为。例如百度联盟会通过cookie记录用户的偏好信息，然后向用户推荐个性化推广信息，所以浏览其他网页的时候经常会发现旁边的小广告都是自己最近百度搜过的东西。这是可以禁用的，这也是cookie的缺点之一。

那么，cookie是怎么起作用的呢？

在上一节中我们知道 cookie 是存在用户硬盘中，用户每次访问站点时，Web应用程序都可以读取 Cookie 包含的信息。当用户再次访问这个站点时，**浏览器就会在本地硬盘上 查找 与该 URL 相关联的 Cookie 。如果该 Cookie 存在，浏览器就将它添加到 request header的Cookie字段中，与 http请求`一起发送到该站点。**

在开发者工具network可以看到，如果有关该URL的cookie会被添加到请求上

要注意的是，添加到 request header 中是 浏览器的行为 ，存储在cookie的数据 每次 都会被浏览器 `自动` 放在http请求中。因此，如果这些数据不是每次都要发给服务器的话，这样做无疑会增加网络流量，这也是cookie的缺点之一。为了避免这点，我们必须考虑什么样的数据才应该放在cookie中，而不是滥用cookie。每次请求都需要携带的信息，最典型的就是 身份验证了，其他的大多信息都不适合放在cookie中。

cookie流程

1. 用户在浏览器输入url,发送请求,服务器接受请求
2. 服务器在响应报文中生成一个Set-Cookie报头,发给客户端
3. 浏览器取出响应中Set-Cookie中内容,以cookie.txt形式保存在客户端
4. 如果浏览器继续发送请求,浏览器会在硬盘中找到cookie文件,产生Cookie报头,与HTTP请求一起发送.
5. 服务器接受含Cookie报头的请求,处理其中的cookie信息,找到对应资源给客户端.
6. 浏览器每一次请求都会包含已有的cookie.

### 3 cookie属性(每一个cookie都有如下属性，如果想要删除某个cookie，只需要设置该cookie expire的值即可)

name、value 是 cookie 的名和值。domian 、Path 、 Expires/max-age 、Size 、Http 、 Secure等均属cookie的属性。

**一个 cookie 开始于一个名称/值对：**

- `<cookie-name>` 可以是除了控制字符 (CTLs)、空格 (spaces) 或制表符 (tab)之外的任何 US-ASCII 字符。同时不能包含以下分隔字符： ( ) < > @ , ; : \ " /  [ ] ? = { }.
- `<cookie-value>` 是可选的，如果存在的话，那么需要包含在双引号里面。支持除了控制字符（CTLs）、空格（whitespace）、双引号（double quotes）、逗号（comma）、分号（semicolon）以及反斜线（backslash）之外的任意 US-ASCII 字符。**关于编码**：许多应用会对 cookie 值按照URL编码（URL encoding）规则进行编码，但是按照 RFC 规范，这不是必须的。不过满足规范中对于 <cookie-value> 所允许使用的字符的要求是有用的。
- **__Secure- 前缀**：以 __Secure- 为前缀的 cookie（其中连接符是前缀的一部分），必须与 secure 属性一同设置，同时必须应用于安全页面（即使用 HTTPS 访问的页面）。
- **__Host- 前缀：** 以 __Host- 为前缀的 cookie，必须与 secure 属性一同设置，必须应用于安全页面（即使用 HTTPS 访问的页面），必须不能设置 domain 属性 （也就不会发送给子域），同时 path 属性的值必须为“/”。

**domain 和 path**

这两个选项共同决定了cookie能被哪些页面共享。

**domain 参数是用来控制 cookie对「哪个域」有效**，**默认为设置** cookie的那个域。这个值可以包含子域，也可以不包含它。如上图的例子，Domain选项中，可以是".google.com.hk`"(不包含子域,表示它对`google.com.hk`的所有子域都有效)，也可以是"`www.google.com.hk"(包含子域)。

如网址为www.jb51.net/test/test.aspx，那么domain默认为www.jb51.net。而跨域访问，如域A为t1.test.com，域B为t2.test.com，那么在域A生产一个令域A和域B都能访问的cookie就要将该cookie的domain设置为.test.com；如果要在域A生产一个令域A不能访问而域B能访问的cookie就要将该cookie的domain设置为t2.test.com

**path**用来控制cookie发送的指定域的「路径」**，默认为"/"，**表示指定域下的所有路径都能访问。**它是在域名的基础下，指定可以访问的路径**。例如cookie设置为"`domain=.google.com.hk; path=/webhp`"，那么只有"`.google.com.hk/webhp`"及"`/webhp`"下的任一子目录如"`/webhp/aaa`"或"`/webhp/bbb`"会发送cookie信息，而"`.google.com.hk`"就不会发送，即使它们来自同一个域。

### expries/max-age失效时间(两者都有的时候 max-age优先级更高)

expries 和 max-age 是用来决定cookie的生命周期的，也就是cookie何时会被删除。

字段为此cookie超时时间。若设置其值为一个时间，那么当到达此时间后，此cookie失效。**不设置的话默认值是Session，意思是cookie会和session一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。**

expries 表示的是失效时间，准确讲是「时刻」，max-age表示的是生效的「时间段」，以「秒」为单位。

若 `max-age` 为正值，则表示 cookie 会在 max-age 秒后失效。如例四中设置"max-age=10800;"，也就是生效时间是3个小时，那么 cookie 将在三小时后失效。

若 `max-age` 为负值，**则cookie将在浏览器会话结束后失效，即 session，max-age的默认值为-1。若 `max-age` 为0，则表示删除cookie。**

### secure

默认情况为空，不指定 secure 选项，即不论是 http 请求还是 https 请求，均会发送cookie。

是 cookie 的安全标志，是cookie中唯一的一个非键值对儿的部分。指定后，cookie只有在使用`SSL`连接（如`HTTPS`请求或其他安全协议请求的）时才会发送到服务器。

### httponly（即http）

`httponly`属性是用来限制客户端脚本对cookie的访问。将 cookie 设置成 httponly 可以减轻xss（[跨站脚本攻击 ](http://baike.baidu.com/view/2633667.htm)Cross Site Scripting）攻击的危害，

防止cookie被窃取，以增强cookie的安全性。（由于cookie中可能存放身份验证信息，放在cookie中容易泄露）

默认情况是不指定 httponly，即可以通过 js 去访问。

如果设置了该字段，那么在客户端，就不能通过document.cookies获取；

Cookie都是通过document对象获取的，我们如果能让cookie在浏览器中不可见就可以了，那HttpOnly就是在设置cookie时接受这样一个参数，一旦被设置，在浏览器的document对象中就看不到cookie了。而浏览器在浏览网页的时候不受任何影响，因为Cookie会被放在浏览器头中发送出去(包括Ajax的时候)，应用程序也一般不会在JS里操作这些敏感Cookie的，对于一些敏感的Cookie我们采用HttpOnly，对于一些需要在应用程序中用JS操作的cookie我们就不予设置，这样就保障了Cookie信息的安全也保证了应用。

#### `SameSite` Cookie允许服务器要求某个cookie在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击

（[CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)）。

[SameSite](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

CSRF:

#### 1. 自动发 GET 请求

黑客网页里面可能有一段这样的代码:

```
<img src="https://xxx.com/info?user=hhh&count=100">
复制代码
```

进入页面后自动发送 get 请求，值得注意的是，这个请求会自动带上关于 xxx.com 的 cookie 信息(这里是假定你已经在 xxx.com 中登录过)。

假如服务器端没有相应的验证机制，它可能认为发请求的是一个正常的用户，因为携带了相应的 cookie，然后进行相应的各种操作，可以是转账汇款以及其他的恶意操作。

#### 2. 自动发 POST 请求

黑客可能自己填了一个表单，写了一段自动提交的脚本。

```html
<form id='hacker-form' action="https://xxx.com/info" method="POST">
  <input type="hidden" name="user" value="hhh" />
  <input type="hidden" name="count" value="100" />
</form>
<script>document.getElementById('hacker-form').submit();</script>
复制代码
```

同样也会携带相应的用户 cookie 信息，让服务器误以为是一个正常的用户在操作，让各种恶意的操作变为可能。

#### 3. 诱导点击发送 GET 请求

在黑客的网站上，可能会放上一个链接，驱使你来点击:

```
<a href="https://xxx/info?user=hhh&count=100" taget="_blank">点击进入修仙世界</a>
复制代码
```

点击后，自动发送 get 请求，接下来和`自动发 GET 请求`部分同理。

这就是`CSRF`攻击的原理。和`XSS`攻击对比，CSRF 攻击并不需要将恶意代码注入用户当前页面的`html`文档中，而是跳转到新的页面，利用服务器的**验证漏洞**和**用户之前的登录状态**来模拟用户进行操作。

SameSite可以有下面三种值：

```
**None**
```

浏览器会在同站请求、跨站请求下继续发送cookies，不区分大小写。

**`Strict`**

浏览器将只发送相同站点请求的cookie(即当前网页URL与请求目标URL完全一致)。如果请求来自与当前location的URL不同的URL，则不包括标记为Strict属性的cookie。

这样也就避免了在 黑客的域名的网页下，向被目标域名 请求的时候，会带上呗攻击域名的 cookies;

```
Lax
```

在新版本浏览器中，为默认选项，Same-site cookies 将会为一些跨站子请求保留，如图片加载或者frames的调用，但只有当用户从外部站点导航到URL时才会发送。如link链接

### 4、如何利用以上属性去设置cookie？

**服务器端设置**      [setCookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)

服务器通过发送一个名为 Set-Cookie 的HTTP头来创建一个cookie，作为 Response Headers 的一部分。如下图所示，每个Set-Cookie 表示一个 cookie（**如果有多个cookie,需写多个Set-Cookie**），每个属性也是以名/值对的形式（除了secure），属性间以分号加空格隔开。格式如下：

```javascript
set-cookie: vcsaas_test16_uid=595177f83a5a44138e611ce2; Max-Age=315360000; Expires=Sun, 16-Apr-2028 09:29:29 GMT; Domain=test.com; Path=/; HttpOnly
set-cookie: vcsaas_test16_org_id=5ac34b76909483050c8cd52d; Max-Age=315360000; Expires=Sun, 16-Apr-2028 09:29:29 GMT; Domain=test.com; Path=/; HttpOnly
set-cookie: vcsaas_test16_token=5ad86179cff47e3486c5ed00; Max-Age=315360000; Expires=Sun, 16-Apr-2028 09:29:29 GMT; Domain=test.com; Path=/; HttpOnly
```

**Set-Cookie: name=value[; expires=GMTDate][; domain=domain][; path=path][; secure]**

只有cookie的名字和值是必需的。

* 会话期cookie : 会话期cookie将会在客户端关闭的时候被移除；会话期cookie 不设置 Expires 或 Max-Age指令

```javascript
Set-Cookie: sessionid=38afes7a8; HttpOnly; Path=/
```

* 持久化cookie : 持久化cookie不会再客户端关闭的时候失效，而是在特定日期( Expires ) 或者经过一段特定的时候之后（Max-Age）之后才会失效；

```javascript
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

* 非法域

```javascript
Set-Cookie: qwerty=219ffwef9w0f; Domain=somecompany.co.uk; Path=/; Expires=Wed, 30 Aug 2019 00:00:00 GMT
```



　　**客户端设置**(在服务器没有设置httpOnly的情况下)

客户端设置cookie的格式和Set-Cookie头中使用的格式一样。如下：

**document.cookie = "name=value[; expires=GMTDate][; domain=domain][; path=path][; secure]"

```javascript
document.cookie="age=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
```

若想要添加多个cookie，只能重复执行 document.cookie（如上）。这可能和平时写的 js 不太一样，一般重复赋值是会覆盖的，

但对于cookie，重复执行 document.cookie 并「不覆盖」，而是「添加」（针对「不同名」的）。

#### 修改和删除

* 修改 cookie

要想修改一个`cookie`，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，`path/domain`这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。

* 删除 cookie

删除一个`cookie` 也挺简单，也是重新赋值，只要将这个新cookie的`expires` 选项设置为一个过去的时间点就行了。但同样要注意，`path/domain/`这几个选项一定要旧cookie 保持一样

### 5、cookie的缺点

安全性：由于cookie在http中是明文传递的，其中包含的数据都可以被他人访问，可能会被篡改、盗用。

大小限制：cookie的大小限制在4kb左右，不适合大量存储。

增加流量：cookie每次请求都会被自动添加到Request Header中，无形中增加了流量。cookie信息越大，对服务器请求的时间越长。

由于写在主域名下的cookie，如 xxx.com下的 cookie 比较大的情况下，若图片之类的 pic.xxx.com 图片去服务器取数据的时候，都需要发送本地的头，就会带上cookie，这样就会造成send数据过多，导致速度变慢像 js、style 等都会有这些问题。通常使用一个其他域名，这样这个域名下就没有cookie 了。
按照普通设计，当网站cookie信息有1KB、网站首页共150个资源时，用户在请求过程中需要发送150KB的cookie信息，在512Kbps的常见带宽下，需要长达3秒左右才能全部发送完毕。 尽管这个过程可以和页面下载不同资源的时间并发，但毕竟对速度造成了影响。 而且这些信息在js/css/images/flash等静态资源上，几乎是没有任何必要的。 解决方案是启用和主站不同的域名来放置静态资源，也就是cookie free。

### 6 跨域不会发送cookies等用户凭证，如何解决？

```j
本地模拟www.zawaliang.com向www.xxx.com发送带cookie的认证请求，我们需求做以下几步工作：
默认情况下widthCredentials为false，我们需要设置widthCredentials为true：
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.xxx.com/api');
xhr.withCredentials = true;
xhr.onload = onLoadHandler;
xhr.send();
请求头，注意此时已经带上了cookie：
GET http://www.xxx.com/api HTTP/1.1
Host: www.xxx.com
User-Agent: Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip, deflate
DNT: 1
Referer: http://www.zawaliang.com/index.html
Origin: http://www.zawaliang.com
Connection: keep-alive
Cookie: guid=1
设置服务端响应头：
Access-Control-Allow-Credentials: true
如果服务端不设置响应头，响应会被忽略不可用；同时，服务端需指定一个域名（Access-Control-Allow-Origin:www.zawaliang.com），而不能使用泛型（Access-Control-Allow-Origin: *）
响应头：
HTTP/1.1 200 OK
Date: Wed, 06 Feb 2013 03:33:50 GMT
Server: Apache/2
X-Powered-By: PHP/5.2.6-1+lenny16
Access-Control-Allow-Origin: http://www.zawaliang.com
Access-Control-Allow-Credentials: true
Set-Cookie: guid=2; expires=Thu, 07-Feb-2013 03:33:50 GMT
Content-Length: 38
Content-Type: text/plain; charset=UTF-8
X-Cache-Lookup: MISS from proxy:8080
有一点需要注意，设置了widthCredentials为true的请求中会包含远程域的所有cookie，但这些cookie仍然遵循同源策略，所以你是访问不了这些cookie的。
```

