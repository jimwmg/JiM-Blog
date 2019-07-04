---

---

### 1 统一资源标识符的语法 (URI)

https://developer.mozilla.org/zh-CN/docs/Web/HTTP

[Data URI](https://www.jianshu.com/p/ea49397fcd13)

[MIME-types](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)

Data URLs 由四个部分组成：前缀(`data:`)、指示数据类型的MIME类型、如果非文本则为可选的`base64`标记、数据本身：

| 方案        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| data        | [Data URIs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) |
| file        | 指定主机上文件的名称                                         |
| ftp         | [文件传输协议](https://developer.mozilla.org/en-US/docs/Glossary/FTP) |
| http/https  | [超文本传输协议／安全的超文本传输协议](https://developer.mozilla.org/en-US/docs/Glossary/HTTP) |
| mailto      | 电子邮件地址                                                 |
| ssh         | 安全 shell                                                   |
| tel         | 电话                                                         |
| urn         | 统一资源名称                                                 |
| view-source | 资源的源代码                                                 |
| ws/wss      | （加密的） [WebSocket](https://developer.mozilla.org/zh-CN/docs/WebSockets) 连接 |

比如我们常用的 HTTP `http://example.com`

`http://`告诉浏览器使用何种协议。对于大部分 Web 资源，通常使用 HTTP 协议或其安全版本，HTTPS 协议。另外，浏览器也知道如何处理其他协议。例如， `mailto:` 协议指示浏览器打开邮件客户端；`ftp:`协议指示浏览器处理文件传输。常见的浏览器处理文件传输的方式还包括上面表格的列出的；

还比如我们常用的 data URI

```
data:,Hello%2C%20World!
简单的 text/plain 类型数据
data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D
上一条示例的 base64 编码版本
data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E
一个HTML文档源代码 <h1>Hello, World</h1>
data:text/html,<script>alert('hi');</script>
一个会执行 JavaScript alert 的 HTML 文档。注意 script 标签必须封闭。
```

`npm i mime`这个仓库可以判断某个文件的 `mime type`类型

目前 data URI支持的情况如下

```
data:,                            文本数据
data:text/plain,                    文本数据
data:text/html,                  HTML代码
data:text/html;base64,            base64编码的HTML代码
data:text/css,                    CSS代码
data:text/css;base64,              base64编码的CSS代码
data:text/javascript,              Javascript代码
data:text/javascript;base64,        base64编码的Javascript代码
data:image/gif;base64,            base64编码的gif图片数据
data:image/png;base64,            base64编码的png图片数据
data:image/jpeg;base64,          base64编码的jpeg图片数据
data:image/x-icon;base64,          base64编码的icon图片数据
```

Data URI Scheme优缺点

优点

```
1. Data URL形式的图片不会被浏览器缓存，这意味着每次访问这样页面时都被下载一次，
   但可通过在css文件的background-image样式规则使用Data URI Scheme，使其随css文件一同被浏览器缓存起来）。
2. Base64编码的数据体积通常是原数据的体积4/3，
   也就是Data URL形式的图片会比二进制格式的图片体积大1/3。
3. 移动端性能比较低。
```

缺点

```
1. 减少资源请求链接数。
2. 当访问外部资源很麻烦或受限时，可以很好的利用Data URI Scheme
```

base64的解码和编码

```javascript
var encodedData = window.btoa('Hello, world'); // encode a string
var decodedData = window.atob(encodedData); // decode the string
```

[MIME 简介](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)

通用结构: MIME的组成结构非常简单；由类型与子类型两个字符串中间用`'/'`分隔而组成。不允许空格存在。*type* 表示可以被分多个子类的独立类别。*subtype 表示细分后的每个类型。*

```
type/subtype
```

独立类型

```
text/plain
text/html
image/jpeg
image/png
audio/mpeg
audio/ogg
audio/*
video/mp4
application/*
application/json
application/javascript
application/ecmascript
application/octet-stream
```

| 类型          | 描述                                                         | 典型示例                                                     |
| :------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `text`        | 表明文件是普通文本，理论上是人类可读                         | `text/plain`, `text/html`, `text/css, text/javascript`       |
| `image`       | 表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型 | `image/gif`, `image/png`, `image/jpeg`, `image/bmp`, `image/webp`, `image/x-icon`, `image/vnd.microsoft.icon` |
| `audio`       | 表明是某种音频文件                                           | `audio/midi`, `audio/mpeg, audio/webm, audio/ogg, audio/wav` |
| `video`       | 表明是某种视频文件                                           | `video/webm`, `video/ogg`                                    |
| `application` | 表明是某种二进制数据                                         | `application/octet-stream`, `application/pkcs12`, `application/vnd.mspowerpoint`, `application/xhtml+xml`, `application/xml`,  `application/pdf` |

multipart 类型

```
multipart/form-data
multipart/byteranges
```

### 2 HTTP Security

#### 2.1 内容安全策略   ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

设置方式

服务器设置返回HTTP头部： [`Content-Security-Policy`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 

或者通过 `<meta>`元素来配置该策略

```
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

对于可配置的策略[参考 ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri)

#### 2.2 HTTP公钥锁定（HPKP）是一种安全功能，它告诉Web客户端将特定加密公钥与某个Web服务器相关联，以降低使用伪造证书进行MITM攻击的风险。

服务器设置

```html
Public-Key-Pins: pin-sha256="base64=="; max-age=expireTime [; includeSubDomains][; report-uri="reportURI"]
```

#### 2.3 ` **HTTP Strict Transport Security**`（通常简称为[HSTS](https://developer.mozilla.org/en-US/docs/Glossary/HSTS)）是一个安全功能，它告诉浏览器只能通过HTTPS访问当前资源，而不是[HTTP](https://developer.mozilla.org/en/HTTP)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### 2.4 HTTP Cookie（也叫Web Cookie或浏览器Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie使基于[无状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#HTTP_is_stateless_but_not_sessionless)的HTTP协议记录稳定的状态信息成为了可能。

Cookie主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

```
Set-Cookie: <cookie名>=<cookie值>
```

Expires Max-Age : 设置cookies时效 

 Secure : Cookie只应通过被HTTPS协议加密过的请求发送给服务端,不能通过 HTTP发送

 HttpOnly : 不允许javascript脚本访问cookies

Domain  Path : 设置cookies的作用域，即cookies被允许发给哪些URL;

#### 2.5 X-Content-Type-Options

##### MIME嗅探

在缺失 MIME 类型或客户端认为文件设置了错误的 MIME 类型时，浏览器可能会通过查看资源来进行MIME嗅探。每一个浏览器在不同的情况下会执行不同的操作。因为这个操作会有一些安全问题，有的 MIME 类型表示可执行内容而有些是不可执行内容。浏览器可以通过请求头 [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) 来设置 [`X-Content-Type-Options`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options) 以阻止MIME嗅探。

**Content-Type** 实体头部用于指示资源的MIME类型 [media type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) 。

在响应中，Content-Type标头告诉客户端实际返回的内容的内容类型。浏览器会在某些情况下进行MIME查找，并不一定遵循此标题的值; 为了防止这种行为，可以将标题 [`X-Content-Type-Options`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options) 设置为 **nosniff**。

`**X-Content-Type-Options**` 响应首部相当于一个提示标志，被服务器用来提示客户端一定要遵循在 [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) 首部中对  [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 的设定，而不能对其进行修改。这就禁用了客户端的 [MIME 类型嗅探](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#MIME_sniffing)行为，换句话说，也就是意味着网站管理员确定自己的设置没有问题。

```
X-Content-Type-Options: nosniff
```

- `nosniff`

  下面两种情况的请求将被阻止：请求类型是"`style`" 但是 MIME 类型不是 "`text/css`"，请求类型是"`script`" 但是 MIME 类型不是  [JavaScript MIME 类型](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type)。

#### 2.6 X-Frame-Options

X-Frame-Options [HTTP](https://developer.mozilla.org/en/HTTP) 响应头是用来给浏览器指示允许一个页面可否在 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/frame),[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe) 或者 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object) 中展现的标记。网站可以使用此功能，来确保自己网站的内容没有被嵌到别人的网站中去，也从而避免了点击劫持 (clickjacking) 的攻击。

#### 2.7 X-XSS-ProtectionHTTP 

**X-XSS-Protection** 响应头是Internet Explorer，Chrome和Safari的一个功能，当检测到跨站脚本攻击 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS))时，浏览器将停止加载页面。虽然这些保护在现代浏览器中基本上是不必要的，当网站实施一个强大的[`Content-Security-Policy`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)来禁用内联的JavaScript (`'unsafe-inline'`)时, 他们仍然可以为尚不支持 [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP) 的旧版浏览器的用户提供保护

#### 3 跨域资源共享

跨域资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 以外的 HTTP 请求，或者搭配某些 MIME 类型的 [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST) 请求），浏览器必须首先使用 [`OPTIONS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS) 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 [Cookies ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)和 HTTP 认证相关数据）。

### 简单请求[节](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#简单请求)

某些请求不会触发 [CORS 预检请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Preflighted_requests)。本文称这样的请求为“简单请求”，请注意，该术语并不属于 [Fetch](https://fetch.spec.whatwg.org/) （其中定义了 CORS）规范。若请求满足所有下述条件，则该请求可视为“简单请求”：

- 使用下列方法之一：

  - [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)
  - [`HEAD`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD)
  - [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)

- Fetch 规范定义了

  对 CORS 安全的首部字段集合

  ，不得人为设置该集合之外的其他首部字段。该集合为：

  - [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)
  - [`Accept-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language)
  - [`Content-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Language)
  - [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) （需要注意额外的限制）
  - `DPR`
  - `Downlink`
  - `Save-Data`
  - `Viewport-Width`
  - `Width`

- `Content-Type`

   

  的值仅限于下列三者之一：

  - `text/plain`
  - `multipart/form-data`
  - `application/x-www-form-urlencoded`

- 请求中的任意[`XMLHttpRequestUpload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象均没有注册任何事件监听器；[`XMLHttpRequestUpload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象可以使用 [`XMLHttpRequest.upload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 属性访问。

- 请求中没有使用 [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象。

### 4 缓存

私有缓存（浏览器缓存）和共享缓存（代理缓存）

#### 浏览器缓存

```
Catch-Control: no-store   禁止缓存

Catch-Control:no-catch 强制确认缓存，

Catch-Control:public  private
"public" 指令表示该响应可以被任何中间人（译者注：比如中间代理、CDN等）缓存。若指定了"public"，则一些通常不被中间人缓存的页面（译者注：因为默认是private）（比如 带有HTTP验证信息（帐号密码）的页面 或 某些特定状态码的页面），将会被其缓存。

而 "private" 则表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。

Cache-Control: max-age=31536000

Cache-Control: must-revalidate
那就意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用;具体的验证如下：

作为缓存的一种强校验器，ETag 响应头是一个对用户代理(User Agent, 下面简称UA)不透明（译者注：UA 无需理解，只需要按规定使用即可）的值。对于像浏览器这样的HTTP UA，不知道ETag代表什么，不能预测它的值是多少。如果资源请求的响应头里含有ETag, 客户端可以在后续的请求的头中带上 If-None-Match 头来验证缓存。

Last-Modified 响应头可以作为一种弱校验器。说它弱是因为它只能精确到一秒。如果响应头里含有这个信息，客户端可以在后续的请求中带上 If-Modified-Since 来验证缓存。

当向服务端发起缓存校验的请求时，服务端会返回 200 ok表示返回正常的结果或者 304 Not Modified(不返回body)表示浏览器可以使用本地缓存文件。304的响应头也可以同时更新缓存文档的过期时间。

Pragma: no-cache和 Cache-Control: no-cache 效果一致。强制要求缓存服务器在返回缓存的版本之前将请求提交到源头服务器进行验证。
```

#### 共享缓存

当缓存服务器收到一个请求，只有当前的请求和原始（缓存）的请求头跟缓存的响应头里的Vary都匹配，才能使用缓存的响应。

```html
Vary: User-Agent
```

使用vary头有利于内容服务的动态多样性。例如，使用Vary: User-Agent头，缓存服务器需要通过UA判断是否使用缓存的页面。如果需要区分移动端和桌面端的展示内容，利用这种方式就能避免在不同的终端展示错误的布局。

### 5 数据压缩

在实际应用时，web 开发者不需要亲手实现压缩机制，浏览器及服务器都已经将其实现了，不过他们需要确保在服务器端进行了合理的配置。数据压缩会在三个不同的层面发挥作用：

#### 文件格式压缩：首先某些格式的文件会采用特定的优化算法进行压缩，

#### 端到端压缩技术：其次在 HTTP 协议层面会进行通用数据加密，即数据资源会以压缩的形式进行端到端传输

浏览器和服务器之间会使用[主动协商机制](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)。浏览器发送 [`Accept-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding) 首部，其中包含有它所支持的压缩算法，以及各自的优先级，服务器则从中选择一种，使用该算法对响应的消息主体进行压缩，并且发送 [`Content-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding) 首部来告知浏览器它选择了哪一种算法。由于该内容协商过程是基于编码类型来选择资源的展现形式的，在响应中， [`Vary`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary) 首部中至少要包含 [`Accept-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding) ；这样的话，缓存服务器就可以对资源的不同展现形式进行缓存。

#### 逐跳压缩技术最后数据压缩还会发生在网络连接层面，即发生在 HTTP 连接的两个节点之间。

HTTP 协议中采用了与端到端压缩技术所使用的内容协商机制相类似的机制：节点发送请求，使用 [`TE`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/TE) 首部来宣布它的意愿，另外一个节点则从中选择合适的方法，进行应用，然后在 [`Transfer-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding) 首部中指出它所选择的方法。

### 6 内容协商

#### 服务端驱动型内容协商机制

HTTP/1.1 规范指定了一系列的标准消息头用于启动服务端驱动型内容协商 （[`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)、[`Accept-Charset`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Charset)、 [`Accept-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding)、[`Accept-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language)）。尽管严格来说  [`User-Agent`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent) 并不在此列，有时候它还是会被用来确定给客户端发送的所请求资源的特定展现形式，不过这种做法不提倡使用。服务器会使用  [`Vary`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary) 消息头来说明实际上哪些消息头被用作内容协商的参考依据（确切来说是与之相关的响应消息头），这样可以使[缓存](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)的运作更有效。

### 7 协议范围请求

HTTP 协议范围请求允许服务器只发送 HTTP 消息的一部分到客户端。范围请求在传送大的媒体文件，或者与文件下载的断点续传功能搭配使用时非常有用。

首先明确几个头部

`Range`请求头，用于告知服务器返回文件的哪一部分。在一个  `Range` 首部中，可以一次性请求多个部分，服务器会以 multipart 文件的形式将其返回。

```html
Range: <unit>=<range-start>-
Range: <unit>=<range-start>-<range-end>
Range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>
Range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>, <range-start>-<range-end>
Range: bytes=200-1000, 2000-6576, 19000-
```

`Accept-Range` 服务器使用 HTTP 响应头 `**Accept-Range**` 标识自身支持范围请求(partial requests)。字段的具体值用于定义范围请求的单位。

当浏览器发现` Accept-Range `头时，可以尝试*继续*中断了的下载，而不是重新开始。

```
Accept-Ranges: bytes  范围请求的单位是 bytes
Accept-Ranges: none   不支持范围请求
```

`Content-Range`: 响应首部 **Content-Range** 显示的是一个数据片段在整个文件中的位置。

```html
Content-Range: <unit> <range-start>-<range-end>/<size>
Content-Range: <unit> <range-start>-<range-end>/*
Content-Range: <unit> */<size>

Content-Range: bytes 200-1000/67589
```

`Content-Length` 是一个实体消息首部，用来指明发送给接收方的消息主体的大小，即用十进制数字表示的八位元组的数目。

`If-Range`:当（中断之后）重新开始请求更多资源片段的时候，必须确保自从上一个片段被接收之后该资源没有进行过修改。

The [`If-Range`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-Range) 请求首部可以用来生成条件式范围请求：假如条件满足的话，条件请求就会生效，服务器会返回状态码为 [`206`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/206) `Partial `的响应，以及相应的消息主体。假如条件未能得到满足，那么就会返回状态码为 [`200`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/200) `OK` 的响应，同时返回整个资源。该首部可以与  [`Last-Modified`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified) 验证器或者  [`ETag`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/ETag) 一起使用，但是二者不能同时使用

与范围请求相关的有三种状态：

- 在请求成功的情况下，服务器会返回  [`206`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/206) `Partial Content` 状态码。
- 在请求的范围越界的情况下（范围值超过了资源的大小），服务器会返回 [`416`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/416)`Requested Range Not Satisfiable` （请求的范围无法满足） 状态码。
- 在不支持范围请求的情况下，服务器会返回 [`200`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/200) `OK` 状态码。