## 你不知道的 JSBridge（4000 字，理解跨端原理）

[原文链接](https://mp.weixin.qq.com/s/Tm6yxlLVnLJPBcMtDVVyDw)

## JSBridge 的起源

近些年，移动端普及化越来越高，开发过程中选用 Native 还是 H5 一直是热门话题。Native 和 H5 都有着各自的优缺点，为了满足业务的需要，公司实际项目的开发过程中往往会融合两者进行 Hybrid 开发。Native 和 H5 分处两地，看起来无法联系，那么如何才能让双方协同实现功能呢？

这时我们想到了 Codova ，Codova 提供了一组与设备相关的 API，是早期 JS 调用原生代码来实现原生功能的常用方案。不过 JSBridge 真正在国内广泛应用是由于移动互联网的盛行。

JSBridge 是一种 JS 实现的 Bridge，连接着桥两端的 Native 和 H5。它在 APP 内方便地让 Native 调用 JS，JS 调用 Native，是双向通信的通道。JSBridge 主要提供了 JS 调用 Native 代码的能力，实现原生功能如查看本地相册、打开摄像头、指纹支付等。

**H5 与 Native 对比**

|    name     |                        H5                         |                       Native                       |
| :---------: | :-----------------------------------------------: | :------------------------------------------------: |
|   稳定性    |          调用系统浏览器内核，稳定性较差           |               使用原生内核，更加稳定               |
|   灵活性    |               版本迭代快，上线灵活                |      迭代慢，需要应用商店审核，上线速度受限制      |
| 受网速 影响 |                       较大                        |                        较小                        |
|   流畅度    |          有时加载慢，给用户“卡顿”的感觉           |                加载速度快，更加流畅                |
|  用户体验   |          功能受浏览器限制，体验有时较差           |   原生系统 api 丰富，能实现的功能较多，体验较好    |
|  可移植性   | 兼容跨平台跨系统，如 PC 与 移动端，iOS 与 Android | 可移植性较低，对于 iOS 和 Android 需要维护两套代码 |

## JSBridge 的双向通信原理

- #### JS 调用 Native

JS 调用 Native 的实现方式较多，主要有拦截 `URL Scheme` 、重写 prompt 、注入 API 等方法。

##### 拦截 URL Scheme

Android 和 iOS 都可以通过拦截 URL Scheme 并解析 Scheme 来决定是否进行对应的 Native 代码逻辑处理。

Android 的话，`Webview` 提供了 `shouldOverrideUrlLoading` 方法来提供给 Native 拦截 H5 发送的 `URL Scheme` 请求。代码如下：

```
publicclass CustomWebViewClient extends WebViewClient {
  @Override
  public boolean shouldOverrideUrlLoading(WebView view, String url) {
  ......
    // 场景一：拦截请求、接收 scheme
    if (url.equals("xxx")) {

       // handle
       ...
       // callback
       view.loadUrl("javascript:setAllContent(" + json + ");")
       returntrue;
     }
     returnsuper.shouldOverrideUrlLoading(url);
   }
}
```

iOS 的 `WKWebview` 可以根据拦截到的 `URL Scheme` 和对应的参数执行相关的操作。代码如下：

```
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
    if ([navigationAction.request.URL.absoluteString hasPrefix:@"xxx"]) {
        [[UIApplication sharedApplication] openURL:navigationAction.request.URL];
    }
    decisionHandler(WKNavigationActionPolicyAllow);
}
```

这种方法的优点是不存在漏洞问题、使用灵活，可以实现 H5 和 Native 页面的无缝切换。例如在某一页面需要快速上线的情况下，先开发出 H5 页面。某一链接填写的是 H5 链接，在对应的 Native 页面开发完成前先跳转至 H5 页面，待 Native 页面开发完后再进行拦截，跳转至 Native 页面，此时 H5 的链接无需进行修改。但是使用 iframe.src 来发送 `URL Scheme` 需要对 URL 的长度作控制，使用复杂，速度较慢。

##### 重写 prompt 等原生 JS 方法

Android 4.2 之前注入对象的接口是 addJavascriptInterface ，但是由于安全原因慢慢不被使用。一般会通过修改浏览器的部分 Window 对象的方法来完成操作。主要是拦截 alert、confirm、prompt、console.log 四个方法，分别被 `Webview` 的 onJsAlert、onJsConfirm、onConsoleMessage、onJsPrompt 监听。其中 onJsPrompt 监听的代码如下：

```
public boolean onJsPrompt(WebView view, String origin, String message, String defaultValue, final JsPromptResult result) {
  String handledRet = parentEngine.bridge.promptOnJsPrompt(origin, message, defaultValue);
  xxx;
  returntrue;
}
```

iOS 由于安全机制， `WKWebView` 对 alert、confirm、prompt 等方法做了拦截，如果通过此方式进行 Native 与 JS 交互，需要实现 `WKWebView` 的三个 `WKUIDelegate` 代理方法。代码示例如下：

```
-(void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler{

  UIAlertController *alertController = [UIAlertControlleralertControllerWithTitle:nil message:message?:@"" preferredStyle:UIAlertControllerStyleAlert];

  [alertController addAction:([UIAlertAction actionWithTitle:@"确认" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {

      completionHandler();

  }])];

  [self presentViewController:alertController animated:YES completion:nil];

}
```

使用该方式时，可以与 Android 和 iOS 约定好使用传参的格式，这样 H5 可以无需识别客户端，传入不同参数直接调用 Native 即可。剩下的交给客户端自己去拦截相同的方法，识别相同的参数，进行自己的处理逻辑即可实现多端表现一致。如：

```
alert("确定xxx?", "取消", "确定", callback());
```

另外，如果能与 Native 确定好方法名、传参等调用的协议规范，这样其它格式的 prompt 等方法是不会被识别的，能起到隔离的作用。

##### 注入 API

基于 `Webview` 提供的能力，我们可以向 Window 上注入对象或方法。JS 通过这个对象或方法进行调用时，执行对应的逻辑操作，可以直接调用 Native 的方法。使用该方式时，JS 需要等到 Native 执行完对应的逻辑后才能进行回调里面的操作。

Android 的 `Webview` 提供了 addJavascriptInterface 方法，支持 Android 4.2 及以上系统。

```
gpcWebView.addJavascriptInterface(new JavaScriptInterface(), 'nativeApiBridge');
publicclass JavaScriptInterface {
  Context mContext;

  JavaScriptInterface(Context c) {
    mContext = c;
  }

  public void share(String webMessage){
    // Native 逻辑
  }
}
```

JS 调用示例：

```
window.NativeApi.share(xxx);
```

iOS 的 `UIWebview` 提供了 JavaScriptScore 方法，支持 iOS 7.0 及以上系统。`WKWebview` 提供了 window.webkit.messageHandlers 方法，支持 iOS 8.0 及以上系统。`UIWebview` 在几年前常用，目前已不常见。以下为创建  `WKWebViewConfiguration` 和 创建 WKWebView 示例：

```
WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
WKPreferences *preferences = [WKPreferences new];
preferences.javaScriptCanOpenWindowsAutomatically = YES;
preferences.minimumFontSize = 40.0;
configuration.preferences = preferences;
    

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"share"];
  [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"pickImage"];
}
- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self.webView.configuration.userContentController removeScriptMessageHandlerForName:@"share"];
    [self.webView.configuration.userContentController removeScriptMessageHandlerForName:@"pickImage"];
}
```

JS 调用示例：

```
window.webkit.messageHandlers.share.postMessage(xxx);
```

- #### Native 调用 JS

Native 调用 JS 比较简单，只要 H5 将  JS 方法暴露在 Window 上给 Native 调用即可。

Android 中主要有两种方式实现。在 4.4 以前，通过 loadUrl 方法，执行一段 JS 代码来实现。在 4.4 以后，可以使用 evaluateJavascript 方法实现。loadUrl 方法使用起来方便简洁，但是效率低无法获得返回结果且调用的时候会刷新 WebView。evaluateJavascript 方法效率高获取返回值方便，调用时候不刷新WebView，但是只支持 Android 4.4+。相关代码如下：

```
webView.loadUrl("javascript:" + javaScriptString);
webView.evaluateJavascript(javaScriptString, new ValueCallback<String>() {
  @Override
  public void onReceiveValue(String value){
    xxx
  }
});
```

iOS 在 `WKWebview` 中可以通过 evaluateJavaScript:javaScriptString 来实现，支持 iOS 8.0 及以上系统。

```
// swift
func evaluateJavaScript(_ javaScriptString: String,
  completionHandler: ((Any?, Error?) -> Void)? = nil)
// javaScriptString 需要调用的 JS 代码
// completionHandler 执行后的回调
// objective-c
[jsContext evaluateJavaScript:@"ZcyJsBridge(ev, data)"]
```

## JSBridge 的使用

- 如何引用

- - 由 H5 引用

    在我司移动端初期版本时采用的是该方式，采用本地引入 npm 包的方式进行调用。这种方式可以确定 JSBridge 是存在的，可直接调用 Native 方法。但是如果后期 Bridge 的实现方式改变，双方需要做更多的兼容，维护成本高

  - 由 Native 注入

    这是当前我司移动端选用的方式。在考虑到后期业务需要的情况下，进行了重新设计，选用 Native 注入的方式来引用 JSBridge。这样有利于保持 API 与 Native 的一致性，但是缺点是在 Native 注入的方法和时机都受限，JS 调用 Native 之前需要先判断 JSBridge 是否注入成功

- 使用规范

H5 调用 Native 方法的伪代码实例，如：

```
params = {
  api_version: "xxx",// API 版本
  title: "xxx",// 标题
  filename: "xxx",// 文件名称
  image: "xxx",// 图片链接
  url: "xxx",// 网址链接
  success: function (res) {
    xxx;// 调用成功后执行
  },
  fail: function (err) {
    if (err.code == '-2') {
      fail && fail(err);//调用了当前客户端中不存在的 API 版本
    } else {
      const msg = err.msg;//异常信息
      Toast.fail(msg);
    }
  }
};
window.NativeApi.share(params);
```

以下简要列出通用方法的抽象，目前基本遵循以下规范进行双端通信。

```
window.NativeApi.xxx({
  api_version:'',
  name: "xxx",
  path: "xxx",
  id:"xxx",
  success: function (res) {
    console.log(res);
  },
  fail: function (err) {
    console.log(err);
  }
});
```

由于初期版本选择了由 H5 本地引用 JSBridge，后期采用 Native 注入的方式。现有的 H5 需要对各种情况做兼容，逻辑抽象如下：

```
reqNativeBridge(vm, fn) {
  if (!isApp()) {
    // 如果不在 APP 内进行调用
    vm.$dialog.alert({
      message: "此功能需要访问 APP 才能使用",
    });
  } else {
    if (!window.NativeApi) {
      // 针对初期版本
      vm.$dialog.alert({
        message: "请更新到最新 APP 使用该功能",
      });
    } else {
      // 此处只针对“调用了当前客户端中不存在的 API 版本”的报错进行处理
      // 其余种类的错误信息交由具体的业务去处理
      fn && fn((err) => {
        vm.$dialog.alert({
          message: "请更新到最新 APP 使用该功能",
        });
      });
    }
  }
}
```

## 总结

上述内容简要介绍了 JSBridge 的部分原理，希望对从未了解过 JSBridge 的同学能有所帮助。如果需要更深入的了解 JSBridge 的原理和实现，如 JSBridge 接口调用的封装实现，JS 调用 Native 时的回调的唯一性等。大家可以去查阅更多资料，参考更详细的相关文档或他人的整理成文的沉淀。

```
● 前端科普系列（一）：前端发展简史● 你不知道的 Npm（Node.js 进阶必备好文）● 用动画和实战打开 React Hooks（一）：useState 和 useEffect
```



**·END·**

