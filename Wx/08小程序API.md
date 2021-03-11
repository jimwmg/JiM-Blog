---
title:小程序API
---

### 1.基础

wx.canIUse

wx.base64ToArrayBuffer

wx.arrayBufferToBase64

系统

wx.getSystemInfoSync

wx.getSystemInfoAsync

wx.getSystemInfo

更新

wx.updateWeChatApp

### 2.小程序

#### 生命周期

wx.getLaunchOptionsSync

wx.getEnterOptionsSync

启动参数

| 属性             | 类型           | 说明                                                         |
| :--------------- | :------------- | :----------------------------------------------------------- |
| path             | string         | 启动小程序的路径 (代码包路径)                                |
| scene            | number         | 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) |
| query            | Object         | 启动小程序的 query 参数                                      |
| shareTicket      | string         | shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) |
| referrerInfo     | Object         | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) |
| forwardMaterials | Array.<Object> | 打开的文件信息数组，只有从聊天素材场景打开（scene为1173）才会携带该参数 |

**referrerInfo 的结构**

| 属性      | 类型   | 说明                                           |
| :-------- | :----- | :--------------------------------------------- |
| appId     | string | 来源小程序、公众号或 App 的 appId              |
| extraData | Object | 来源小程序传过来的数据，scene=1037或1038时支持 |

**forwardMaterials 的结构**

| 属性 | 类型   | 说明                             |
| :--- | :----- | :------------------------------- |
| type | string | 文件的mimetype类型               |
| name | string | 文件名                           |
| path | string | 文件路径（如果是webview则是url） |
| size | number | 文件大小                         |

返回有效 referrerInfo 的场景

| 场景值 | 场景                            | appId含义  |
| :----- | :------------------------------ | :--------- |
| 1020   | 公众号 profile 页相关小程序列表 | 来源公众号 |
| 1035   | 公众号自定义菜单                | 来源公众号 |
| 1036   | App 分享消息卡片                | 来源App    |
| 1037   | 小程序打开小程序                | 来源小程序 |
| 1038   | 从另一个小程序返回              | 来源小程序 |
| 1043   | 公众号模板消息                  | 来源公众号 |

#### 应用级事件

wx.onUnhandledRejection(function callback)

> 基础库 2.10.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。

监听未处理的 Promise 拒绝事件。该事件与 `App.onUnhandledRejection` 的回调时机与参数一致。

wx.offUnhandledRejection 

取消监听未处理的 Promise 拒绝事件

wx.onPageNotFound(function callback)

> 基础库 2.1.2 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。

监听小程序要打开的页面不存在事件。该事件与 [`App.onPageNotFound`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onpagenotfoundobject-object) 的回调时机一致。

wx.onError(function callback)

> 基础库 2.1.2 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。

监听小程序错误事件。如脚本错误或 API 调用报错等。该事件与 [`App.onError`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onerrorstring-error) 的回调时机与参数一致。

wx.onAppShow

监听小程序切前台事件。该事件与 [`App.onShow`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onshowobject-object) 的回调参数一致。

wx.onAppHide

监听小程序切后台事件。该事件与 [`App.onHide`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onhide) 的回调时机一致。

### 3.路由

wx.switchTab(Object object)

> 本接口从基础库版本 [2.3.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

在小程序插件中使用时，只能在当前插件的页面中调用

wx.reLaunch(Object object)

> 基础库 1.1.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。

> 本接口从基础库版本 [2.3.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

关闭所有页面，打开到应用内的某个页面

在小程序插件中使用时，只能在当前插件的页面中调用

wx.redirectTo(Object object)

> 本接口从基础库版本 [2.2.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

关闭当前页面，跳转到应用内的某个页面。**但是不允许跳转到 tabbar 页面**

在小程序插件中使用时，只能在当前插件的页面中调用

以上三个接口的参数

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| url      | string   |        | 是   | 需要跳转的 tabBar 页面的路径 (代码包路径)（需在 app.json 的 [tabBar](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabbar) 字段定义的页面），路径后不能带参数。 |
| success  | function |        | 否   | 接口调用成功的回调函数                                       |
| fail     | function |        | 否   | 接口调用失败的回调函数                                       |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

wx.navigateTo(Object object)

> 本接口从基础库版本 [2.2.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 [wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html) 可以返回到原页面。小程序中页面栈最多十层。

在小程序插件中使用时，只能在当前插件的页面中调用

如果一个页面由另一个页面通过 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html) 打开，这两个页面间将建立一条数据通道：

- 被打开的页面可以通过 `this.getOpenerEventChannel()` 方法来获得一个 `EventChannel` 对象；
- `wx.navigateTo` 的 `success` 回调中也包含一个 `EventChannel` 对象。

这两个 `EventChannel` 对象间可以使用 `emit` 和 `on` 方法相互发送、监听事件。

```javascript
//pages/index
const app = getApp()

Page({
  jump: function () {
    wx.navigateTo({
      url: './test',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log('index/index',data)
        },
      },
      success: function (res) {
        //page/test 页面加载成功 onload 中可以通过 eventChannel 和 page/index页面同行
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'send from opener-index page' })
      }
    })
  },
})
```

```javascript
//pages/test
Page({
  onLoad: function (option) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: 'send from opened-test page' });
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('index/test',data)
    })
  }
})
```



wx.navigateBack(Object object)

> 本接口从基础库版本 [2.1.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

关闭当前页面，返回上一页面或多级页面。可通过 [getCurrentPages](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html) 获取当前的页面栈，决定需要返回几层。

在小程序插件中使用时，只能在当前插件的页面中调用

| 属性     | 类型     | 默认值 | 必填 | 说明                                                    |
| :------- | :------- | :----- | :--- | :------------------------------------------------------ |
| delta    | number   | 1      | 否   | 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 |
| success  | function |        | 否   | 接口调用成功的回调函数                                  |
| fail     | function |        | 否   | 接口调用失败的回调函数                                  |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）        |

### 4.界面

交互：toast/modal/loading/Actionsheet

导航栏：

showNavigationBarLoading  ：顶部导航栏loading效果,在当前页面显示导航条加载动画在小程序插件中使用时，只能在当前插件的页面中调用

hideNavigationBarLoading: 在当前页面隐藏导航条加载动画

在小程序插件中使用时，只能在当前插件的页面中调用

setNavigationBarTitle：顶部导航栏title设置

setNavigationBarColor: 顶部导航栏的渐变效果

```javascript
//支持顶部导航栏颜色渐变
load(){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#4B0082',
      animation: {
        duration: 2000,
        timingFunc: 'easeIn'
      }
    })
  },
  load2(){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF1493',
      animation: {
        duration: 2000,
        timingFunc: 'easeIn'
      }
    })
  }
```

hideHomeButton: 隐藏返回首页按钮。微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮，开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏

#### 下拉刷新

wx.startPullDownRefresh

#### 滚动

wx.pageScrollTo

#### 导航栏菜单部分（右上角）

Object wx.getMenuButtonBoundingClientRect()

> 基础库 2.1.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。

> 本接口从基础库版本 [2.15.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。

### 5.网络

发起请求：[RequestTask](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.html) wx.request(Object object)

> 本接口从基础库版本 [1.9.6](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

发起 HTTPS 网络请求。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

下载：[DownloadTask](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.html) wx.downloadFile(Object object)

> 本接口从基础库版本 [1.9.6](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径 (本地路径)，单次下载允许的最大文件为 200MB。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

注意：请在服务端响应的 header 中指定合理的 `Content-Type` 字段，以保证客户端正确处理文件类型。

上传：[UploadTask](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/UploadTask.html) wx.uploadFile(Object object)

> 本接口从基础库版本 [1.9.6](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 起支持在小程序插件中使用

将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data`。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

### 6.数据缓存

每个微信小程序都可以有自己的本地缓存，可以通过 [wx.setStorage](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)/[wx.setStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)、[wx.getStorage](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html)/[wx.getStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html)、[wx.clearStorage](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html)/[wx.clearStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html)，[wx.removeStorage](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html)/[wx.removeStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html) 对本地缓存进行读写和清理。

隔离策略

同一个微信用户，同一个小程序 storage 上限为 10MB。storage 以用户维度隔离，同一台设备上，A 用户无法读取到 B 用户的数据；不同小程序之间也无法互相读写数据。

**插件隔离策略**

1. 同一小程序使用不同插件：不同插件之间，插件与小程序之间 storage 不互通。
2. 不同小程序使用同一插件：同一插件 storage 不互通。

清理策略

本地缓存的清理时机跟代码包一样，只有在代码包被清理的时候本地缓存才会被清理。

### 7.媒体

地图、视频、音频

### 8.其他

文件、画布、位置

转发

wx.onCopyUrl 

监听用户点击右上角菜单的「复制链接」按钮时触发的事件。本接口为 Beta 版本，暂只在 Android 平台支持。

参数

### function callback

用户点击右上角菜单的「复制链接」按钮时触发的事件的回调函数

#### 参数

##### Object res

| 属性  | 类型   | 说明                                                         |
| :---- | :----- | :----------------------------------------------------------- |
| query | string | 用短链打开小程序时当前页面携带的查询字符串。小程序中使用时，应在进入页面时调用 `wx.onCopyUrl` 自定义 `query`，退出页面时调用 `wx.offCopyUrl`，防止影响其它页面。 |

## 

### 9.开放接口

登录：wx.login   wx.checkSession

小程序跳转：

* wx.navigateToMiniProgram 打开另一个小程序

* wx.navigateBackMiniProgram 返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功

  注意：**微信客户端 iOS 6.5.9，Android 6.5.10 及以上版本支持**

账号信息：wx.getAccountInfoSync

用户信息：wx.getUserInfo

支付：wx.requestPayment

授权：wx.authorizeForMiniProgram

wx.authorize

提前向用户发起授权请求。**【调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功】**。更多用法详见 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)。 > 小程序插件可以使用 [wx.authorizeForMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorizeForMiniProgram.html)

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| scope    | string   |        | 是   | 需要获取权限的 scope，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-列表) |
| success  | function |        | 否   | 接口调用成功的回调函数                                       |
| fail     | function |        | 否   | 接口调用失败的回调函数                                       |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

如何准确的理解**【调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功】**

```js
// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.record']) { //1.当用户没有授权 scope.record 的时候
      wx.authorize({       //2.调用这个方法会出现弹窗，但是并不直接对应接口，只是会弹窗询问用户，当用户同意之后
        scope: 'scope.record',
        success () {       //3.才会执行这里的方法，这里是微信提供的一些原生方法，可以直接弹出对应的页面或者浮层之类的
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          wx.startRecord()
        }
      })
    }
  }
})
```

**获取用户授权设置**

 [wx.getSetting](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html)  开发者可以使用 [wx.getSetting](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html) 获取用户当前的授权状态。

打开设置界面

用户可以在小程序设置界面（「右上角」 - 「关于」 - 「右上角」 - 「设置」）中控制对该小程序的授权状态。

[wx.openSetting](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html)  开发者可以调用 此接口打开设置界面，引导用户开启授权。该页面是微信提供的页面

调起客户端小程序设置界面，返回用户设置的操作结果。**设置界面只会出现【小程序已经向用户请求过的】[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。

提前发起授权请求

开发者可以使用 [wx.authorize](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html) 在调用需授权 API 之前，提前向用户发起授权请求。

### scope 列表

| scope                        | 对应接口                                                     | 描述                                         |
| :--------------------------- | :----------------------------------------------------------- | :------------------------------------------- |
| scope.userInfo               | [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) | 用户信息                                     |
| scope.userLocation           | [wx.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) | 地理位置                                     |
| scope.userLocationBackground | [wx.startLocationUpdateBackground](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.startLocationUpdateBackground.html) | 后台定位                                     |
| scope.address                | [wx.chooseAddress](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html) | 通讯地址（已取消授权，可以直接调用对应接口） |
| scope.invoiceTitle           | [wx.chooseInvoiceTitle](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html) | 发票抬头（已取消授权，可以直接调用对应接口） |
| scope.invoice                | [wx.chooseInvoice](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html) | 获取发票（已取消授权，可以直接调用对应接口） |
| scope.werun                  | [wx.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) | 微信运动步数                                 |
| scope.record                 | [wx.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) | 录音功能                                     |
| scope.writePhotosAlbum       | [wx.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [wx.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) | 保存到相册                                   |
| scope.camera                 | [camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 | 摄像头                                       |

授权有效期

一旦用户明确同意或拒绝过授权，其授权关系会记录在后台，直到用户主动删除小程序。

最佳实践

在真正需要使用授权接口时，才向用户发起授权申请，并在授权申请中说明清楚要使用该功能的理由。

注意事项

1. `wx.authorize({scope: "scope.userInfo"})`，不会弹出授权窗口，请使用 [``](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)
2. 需要授权 `scope.userLocation`、`scope.userLocationBackground` 时必须[配置地理位置用途说明](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission)。

后台定位

与其它类型授权不同的是，scope.userLocationBackground 不会弹窗提醒用户。需要用户在设置页中，主动将“位置信息”选项设置为“使用小程序期间和离开小程序后”。开发者可以通过调用[wx.openSetting](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html)，打开设置页。

收货地址

**wx.chooseAddress**

获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。

发票

wx.chooseInvoiceTitle  

选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了[微信认证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1496554031_RD4xe)的，才能调用 chooseInvoiceTitle。

wx.chooseInvoice

选择用户已有的发票。

