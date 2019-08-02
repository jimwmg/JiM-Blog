---
title: XSS 和 CSRF 
---

【转】[原文链接](https://mp.weixin.qq.com/s/Rf4dag7Z1rFNl4LxbAjyqw)

### 1 在web安全中，XSS 和 CSRF是最常见的攻击方式；

XSS( Cross Site Script) : 跨站脚本攻击，是指攻击者在网站注入恶意的客户端代码，通过恶意脚本对客户端网页进行篡改，从而在用户浏览网页的时候，对用户浏览器进行控制或者获取用户隐私数据的一种攻击方式；

攻击者对客户端注入的恶意脚本一般包括 Javascript,有时候也会包括 HTML和 Flash,有很多种方式进行XSS攻击，但是他们的共同点都是讲一些隐私数据，像 cookies session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者机器上进行一些恶意操作；

CSRF(Cross Site Request Forgery) : 跨站请求伪造，是一种劫持受信任用户向服务器发送非预期请求的攻击方式；

### 2 XSS(Cross Site Script)

#### 2.1 分类： 反射型，存储型，基于DOM;

* 反射型：反射型XSS只是简单的把**用户输入的数据反射给浏览器**，这种攻击方式往往需要攻击者诱惑用户点击一个链接  或者  提交一个表单  ，然后注入脚本进入被攻击者的网站；被注入的脚本可能获取用户的隐私数据（如cookies)

```javascript
const http = require('http');
function handleReequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 这里任意用户访问攻击者的服务器；
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write('<script>alert("反射型 XSS 攻击")</script>');//这里将一段script脚本返回给受害者用户，那么受害者用户的浏览器就会执行这些脚本
    res.end();
}
const server = new http.Server();
server.listen(8001, '127.0.0.1');
server.on('request', handleReequest);
```

* 存储型：存储型XSS会把用户输入的数据存储在服务器，当浏览器请求数据的时候，脚本会从服务器传回并执行，这种XSS具有很强的稳定性; 比较常见的场景是攻击者在社区或者论坛上写下一篇包含恶意Javascript代码的文章或者评论，文章或者评论发表之后，所有访问该文章或者评论的用户，都会在他们的浏览器中执行这段恶意的代码；

```javascript
const http = require('http');
let userInput = '';
function handleReequest(req, res) {
    const method = req.method;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            if (body) {
                userInput = body;
            }
            res.end();
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        res.write(userInput);// 如果用户输入的是 `'<script>alert("存储型 XSS 攻击")</script>'`这样的脚本，那么其他用户访问这条评论的时候，这些恶意脚本就会在其他用户的浏览器执行
        res.end();
    }
}
const server = new http.Server();
server.listen(8001, '127.0.0.1');
server.on('request', handleReequest);
```

* 基于DOM: 基于DOM的XSS攻击指的是通过恶意脚本修改页面的DOM结构，是纯粹发生在客户端的攻击。

#### 2.2 防范：

* HttpOnly防止截取 Cookie: 通过设置这个属性，浏览器将会禁止页面中的Javscript访问带有 HttpOnly的cookie,总的来说，HttpOnly不能阻止XSS攻击，只是当XSS攻击发生之后，可以阻止攻击者获取cookie;
* 输入检查：对于用户的任何输入都要进行检查，过滤，转移，建立可以信任的字符和HTML标签白名单，对于不再白名单之列的字符或者标签进行过滤或者编码；
* 输出检查：服务端输出到页面的变量，也要进行规则的校验和检查；

### 3 CSRF(Cross Site Request Forgery) : 跨站请求伪造，劫持受信任用户向服务器发送非预期请求请求的攻击方式；

通常情况下，CSRF攻击是攻击者借助受害者的Cookie骗取服务器的信任，可以在受害者不知情的情况下以受害者的名义伪造请求发送给受攻击服务器，从而在并未授权的情况下执行在权限保护之下的操作；

#### 3.1 基本案例：

1 论坛发帖：

一般情况下，论坛发帖可以通过get请求发送内容，假设发送的 URL是

```
http://example.com/bbs/create_post.php?title=标题&content=内容
```

* 首先用户登录这个贴吧，同时攻击者也知道这个贴吧的发帖链接是上述的格式；
* 只要用户点击了 url 是上述 url的链接，都会将用户的 cookie 验证信息发送给服务器，服务器验证通过了，那么就可以发帖；

伪造的方式就是假如攻击者在论坛发布了一个帖子，链接是

```
http://example.com/bbs/create_post.php?title=我是脑残&content=攻击内容
```

只要用户点击了这个链接，那么用户的账户就会发布这个帖子；

2 支付漏洞

首先假设某支付工具，存在CSRF漏洞，假如用户的某支付工具的账号是 'Jim' ,攻击者的支付宝账号是 "attack";

然后某支付工具的转账请求方式是

```
http://example.com/withdraw?account=jim&amount=10000&for=attack
```

可以将用户jim的账户中的 amount = 10000 价值转给用户attack;

- 首先用户登录这个某支付工具，同时攻击者也知道这个支付工具的转账方式是上述的格式；
- 只要用户点击了 url 是上述 url的链接，都会将用户的 cookie 验证信息发送给服务器，服务器验证通过了，那么就可以转账；

可以看到攻击者并不能通过 CSRF攻击来直接获取用户的账户控制权，也不能直接窃取用户的任何信息，它们能做的只是欺骗用户浏览器，让其以用户的名义执行某些操作而已；

#### 3.2 防范

* **验证码**

验证码被认为是对抗 CSRF 攻击最简洁而有效的防御方法。

从上述示例中可以看出，CSRF 攻击往往是在用户不知情的情况下构造了网络请求。而验证码会强制用户必须与应用进行交互，才能完成最终请求。因为通常情况下，验证码能够很好地遏制 CSRF 攻击。

但验证码并不是万能的，因为出于用户考虑，不能给网站所有的操作都加上验证码。因此，验证码只能作为防御 CSRF 的一种辅助手段，而不能作为最主要的解决方案

* Referer Check 

根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。通过 Referer Check，可以检查请求是否来自合法的”源”。

  比如，如果用户要删除自己的帖子，那么先要登录 www.c.com，然后找到对应的页面，发起删除帖子的请求。此时，Referer 的值是 http://www.c.com；当请求是从 www.a.com 发起时，Referer 的值是 http://www.a.com 了。因此，要防御 CSRF 攻击，只需要对于每一个删帖请求验证其 Referer 值，如果是以 www.c.com 开头的域名，则说明该请求是来自网站自己的请求，是合法的。如果 Referer 是其他网站的话，则有可能是 CSRF 攻击，可以拒绝该请求。



HTTP头中有一个Referer字段，这个字段用以标明请求来源于哪个地址。在处理敏感数据请求时，通常来说，Referer字段应和请求的地址位于同一域名下。以上文银行操作为例，Referer字段地址通常应该是转账按钮所在的网页地址，应该也位于www.examplebank.com之下。而如果是CSRF攻击传来的请求，Referer字段会是包含恶意网址的地址，不会位于www.examplebank.com之下，这时候服务器就能识别出恶意的访问。

这种办法简单易行，工作量低，仅需要在关键访问处增加一步校验。但这种办法也有其局限性，因其完全依赖浏览器发送正确的Referer字段。虽然http协议对此字段的内容有明确的规定，但并无法保证来访的浏览器的具体实现，亦无法保证浏览器没有安全漏洞影响到此字段。并且也存在攻击者攻击某些浏览器，篡改其Referer字段的可能。

* **添加 token 验证**

CSRF 攻击之所以能够成功，是因为攻击者可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 Cookie 中，因此攻击者可以在不知道这些验证信息的情况下直接利用用户自己的 Cookie 来通过安全验证。要抵御 CSRF，关键在于在请求中放入攻击者所不能伪造的信息，并且该信息不存在于 Cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。

### 4 总结

1. 防御 XSS 攻击

2. 1. HttpOnly 防止劫取 Cookie
   2. 用户的输入检查
   3. 服务端的输出检查

3. 防御 CSRF 攻击

4. 1. 验证码
   2. Referer Check
   3. Token 验证