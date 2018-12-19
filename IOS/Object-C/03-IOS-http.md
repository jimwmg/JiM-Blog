---

---

#### 1. iOS中发送HTTP请求的方案

在iOS中，常见的发送HTTP请求的方案有
 苹果原生（自带）
 **NSURLConnection：用法简单，最古老最经典最直接的一种方案 NSURLSession：功能比NSURLConnection更加强大，苹果目前比较推荐使用这种技术（2013推出，iOS7开始使用的技术）**
 CFNetwork：NSURL*的底层，纯C语言

第三方框架
 **AFNetworking：简单易用，提供了基本够用的常用功能，维护和使用者多**
 ASIHttpRequest：外号“HTTP终结者”，功能极其强大，可惜早已停止更新
 MKNetworkKit：简单易用，产自印度，维护和使用者少

**为了提高开发效率，我们开发用的基本是第三方框架，但是我们同样也需要掌握苹果原生的请求方案**





[参考-IOS网络请求-同步异步](https://www.kancloud.cn/digest/data/106703)