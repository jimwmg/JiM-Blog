---
title：识别 安全与认证
---

### 1 客户端识别与cookie机制

#### 1.1 HTTP首部：承载用户身份信息

| 首部名称        | 首部类型 | 描述                        |
| --------------- | -------- | --------------------------- |
| From            | 请求     | 用户的Email地址             |
| User-Agent      | 请求     | 用户的浏览器软件            |
| Referer         | 请求     | 用户是从这个URL中跳转过来的 |
| Authorization   | 请求     | 用户名和密码                |
| Client-IP       | 扩展请求 | 客户端IP地址                |
| X-FOrwarded-For | 扩展请求 | 客户端地址                  |
| Cookie          | 扩展请求 | 服务器产生的ID标签          |
|                 |          |                             |

*  cookie属性

name、value 是 cookie 的名和值。domian 、Path 、 Expires/max-age 、Size 、Http 、 Secure等均属cookie的属性。

**domain 和 path**

这两个选项共同决定了cookie能被哪些页面共享。

**domain 参数是用来控制 cookie对「哪个域」有效**，**默认为设置** cookie的那个域。这个值可以包含子域，也可以不包含它。如上图的例子，Domain选项中，可以是".google.com.hk`"(不包含子域,表示它对`google.com.hk`的所有子域都有效)，也可以是"`www.google.com.hk"(包含子域)。

如网址为www.jb51.net/test/test.aspx，那么domain默认为www.jb51.net。而跨域访问，如域A为t1.test.com，域B为t2.test.com，那么在域A生产一个令域A和域B都能访问的cookie就要将该cookie的domain设置为.test.com；如果要在域A生产一个令域A不能访问而域B能访问的cookie就要将该cookie的domain设置为t2.test.com

path用来控制cookie发送的指定域的「路径」，默认为"/"，表示指定域下的所有路径都能访问。**它是在域名的基础下，指定可以访问的路径**。例如cookie设置为"`domain=.google.com.hk; path=/webhp`"，那么只有"`.google.com.hk/webhp`"及"`/webhp`"下的任一子目录如"`/webhp/aaa`"或"`/webhp/bbb`"会发送cookie信息，而"`.google.com.hk`"就不会发送，即使它们来自同一个域。

### expries/max-age失效时间

expries 和 max-age 是用来决定cookie的生命周期的，也就是cookie何时会被删除。

字段为此cookie超时时间。若设置其值为一个时间，那么当到达此时间后，此cookie失效。不设置的话默认值是Session，意思是cookie会和session一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。

expries 表示的是失效时间，准确讲是「时刻」，max-age表示的是生效的「时间段」，以「秒」为单位。

若 `max-age` 为正值，则表示 cookie 会在 max-age 秒后失效。如例四中设置"max-age=10800;"，也就是生效时间是3个小时，那么 cookie 将在三小时后失效。

若 `max-age` 为负值，则cookie将在浏览器会话结束后失效，即 session，max-age的默认值为-1。若 `max-age` 为0，则表示删除cookie。

### secure

默认情况为空，不指定 secure 选项，即不论是 http 请求还是 https 请求，均会发送cookie。

是 cookie 的安全标志，是cookie中唯一的一个非键值对儿的部分。指定后，cookie只有在使用`SSL`连接（如`HTTPS`请求或其他安全协议请求的）时才会发送到服务器。

### httponly（即http）

`httponly`属性是用来限制客户端脚本对cookie的访问。将 cookie 设置成 httponly 可以减轻xss（[跨站脚本攻击 ](http://baike.baidu.com/view/2633667.htm)Cross Site Scripting）攻击的危害，

防止cookie被窃取，以增强cookie的安全性。（由于cookie中可能存放身份验证信息，放在cookie中容易泄露）

默认情况是不指定 httponly，即可以通过 js 去访问。

如果设置了该字段，那么在客户端，就不能通过document.cookies获取；

Cookie都是通过document对象获取的，我们如果能让cookie在浏览器中不可见就可以了，那HttpOnly就是在设置cookie时接受这样一个参数，一旦被设置，在浏览器的document对象中就看不到cookie了。而浏览器在浏览网页的时候不受任何影响，因为Cookie会被放在浏览器头中发送出去(包括Ajax的时候)，应用程序也一般不会在JS里操作这些敏感Cookie的，对于一些敏感的Cookie我们采用HttpOnly，对于一些需要在应用程序中用JS操作的cookie我们就不予设置，这样就保障了Cookie信息的安全也保证了应用。

### 2 基本认证机制

HTTP官方定义了两个认证协议：基本认证和摘要认证

认证的四个步骤

| 步骤 | 首部                | 描述                                                         | 方法/状态        |
| ---- | ------------------- | ------------------------------------------------------------ | ---------------- |
| 请求 |                     | 第一条没有认证的请求信息                                     | GET              |
| 质询 | www-Authenticate    | 服务器用401状态拒绝了请求，说明需要提供用户名和密码，这个首部中同时也指定了认证算法 | 401 Unauthorized |
| 授权 | Authorization       | 客户端重新发出请求，这次会附加一个Authorization首部，用来说明认证算法，用户名和密码 | GET              |
| 成功 | Authentication-Info | 如果授权证书是正确的，服务器就会将文档返回                   | 200 OK           |
|      |                     |                                                              |                  |

