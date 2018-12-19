[原文链接](https://cnbin.github.io/blog/2015/06/18/appdelegate-de-xiang-jie/)

[图文](https://www.jianshu.com/p/da7b2b63036a)

### 1 AppDelegate 生命周期

JUN 18TH, 2015 8:28 AM

iOS 中的 `AppDelegate.m/h` 文件是很重要的，因为它是对 Application 的整个生命周期进行管理的。

先明白，每个 iPhone 应用程序都有一个 UIApplication，UIApplication 是 iPhone 应用程序的开始并且负责初始化并显示 UIWindow，并负责加载应用程序的第一个 UIView 到 UIWindow 窗体中。UIApplication 的另一个任务是帮助管理应用程序的生命周期，而 UIApplication 通过一个名字为 UIApplicationDelegate 的代理类来履行这个任务。尽管 UIApplication 会负责接收事件，而 UIApplicationDelegate 则决定应用程序如何去响应这些事件，UIApplicationDelegate 可以处理的事件包括应用程序的生命周期事件（比如程序启动和关闭）、系统事件（比如来电、记事项警 告），本文会介绍如何加载应用程序的 UIView 到 UIWindow 以及如何利用 UIApplicationDelegate 处理系统事件。   通常对于 UIApplication 读者是没必要修改它的，只需要知道 UIApplication 接收系统事件即可，而如何编写代码来处理这些系统事件则是程序员的工作。处理系统事件需要编写一个继承自 UIApplicationDelegate 接口的类，而 UIApplicationDelegate 接口提供生命周期函数来处理应用程序以及应用程序的系统事件，这些生命周期函数如下表所示：

1、

```
 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 NSLog(@"当程序载入后执行");
}
```

说明：当程序载入后执行，应用程序启动入口。只在应用程序启动时执行一次。也就是说在应用程序启动后，要执行的委托调用。application 参数用来获取应用程序的状态、变量等，值得注意的是字典参数：`(NSDictionary *)launchOptions`，该参数存储程序启动的原因。 若用户直接启动，lauchOptions 内无数据;

若由其他应用程序通过 openURL: 启动，则 UIApplicationLaunchOptionsURLKey 对应的对象为启动 URL（NSURL）,UIApplicationLaunchOptionsSourceApplicationKey 对应启动的源应用程序的 bundle ID (NSString)；

若由本地通知启动，则 UIApplicationLaunchOptionsLocalNotificationKey 对应的是为启动应用程序的的本地通知对象 (UILocalNotification)；

若由远程通知启动，则 UIApplicationLaunchOptionsRemoteNotificationKey 对应的是启动应用程序的的远程通知信息 userInfo（NSDictionary）； 其他 key 还有 UIApplicationLaunchOptionsAnnotationKey,UIApplicationLaunchOptionsLocationKey, UIApplicationLaunchOptionsNewsstandDownloadsKey。

如果要在启动时，做出一些区分，那就需要在下面的代码做处理。比如：应用可以被某个其它应用调起（作为该应用的子应用），要实现单点登录，那就需要在启动代码的地方做出合理的验证，并跳过登录。 例子：

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSURL *url = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];
    if(url)
    {
    }
    NSString *bundleId = [launchOptions objectForKey:UIApplicationLaunchOptionsSourceApplicationKey];
    if(bundleId)
    {
    }
    UILocalNotification * localNotify = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
    if(localNotify)
    {
    }
    NSDictionary * userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if(userInfo)
    {
    }
} 
```

2、

```
-  (void)applicationWillResignActive:(UIApplication *)application
{
NSLog(@"应用程序将要进入非活动状态，即将进入后台");
}
```

在应用程序将要由活动状态切换到非活动状态时候，要执行的委托调用，如按下 home 按钮，返回主屏幕，或全屏之间切换应用程序等。    说明：当应用程序将要进入非活动状态时执行，在此期间，应用程序不接收消息或事件，比如来电话了。

3、

```
- (void)applicationDidEnterBackground:(UIApplication *)application
{
      NSLog(@"如果应用程序支持后台运行，则应用程序已经进入后台运行"); 
}
```

说明：当程序被推送到后台的时候调用。所以要设置后台继续运行，则在这个函数里面设置即可

4、

```
- (void)applicationWillEnterForeground:(UIApplication *)application
{
      NSLog(@"应用程序将要进入活动状态，即将进入前台运行");
}
```

说明：当程序从后台将要重新回到前台时候调用，这个刚好跟上面的那个方法相反。

5、

```
- (void)applicationDidBecomeActive:(UIApplication *)application
{
     NSLog(@"应用程序已进入前台，处于活动状态");
}
```

说明：当应用程序进入活动状态时执行，这个刚好跟上面那个方法相反 。

6、

```
-  (void)applicationWillTerminate:(UIApplication *)application
{
     NSLog(@"应用程序将要退出，通常用于保存数据和一些退出前的清理工作"); 
}
```

说明：当程序将要退出是被调用，通常是用来保存数据和一些退出前的清理工作。这个需要要设置 UIApplicationExitsOnSuspend 的键值。

7、

```
-  (void)applicationDidReceiveMemoryWarning:(UIApplication *)application
{
    NSLog(@"系统内存不足，需要进行清理工作");
}
```

说明：iPhone 设备只有有限的内存，如果为应用程序分配了太多内存操作系统会终止应用程序的运行，在终止前会执行这个方法，通常可以在这里进行内存清理工作防止程序被终止。

8、

```
- (void)applicationSignificantTimeChange:(UIApplication *)application
{
    NSLog(@"当系统时间发生改变时执行");
}
```

说明：当系统时间发生改变时执行

9、

```
 -  (void)application:(UIApplication)application  willChangeStatusBarFrame:(CGRect)newStatusBarFrame
{
   NSLog(@"StatusBar框将要变化");
}   
```

说明：当 StatusBar 框将要变化时执行

10、

```
 -  (void)application:(UIApplication*)application willChangeStatusBarOrientation:
(UIInterfaceOrientation)newStatusBarOrientation duration:(NSTimeInterval)duration
{
}
```

说明：当 StatusBar 框方向将要变化时执行

11、

```
- (BOOL)application:(UIApplication*)application handleOpenURL:(NSURL*)url
{
}
```

说明：当通过 url 执行

12、

```
 -  (void)application:(UIApplication*)application  didChangeStatusBarOrientation:(UIInterfaceOrientation)oldStatusBarOrientation
{
}
```

说明：当 StatusBar 框方向变化完成后执行

13、

```
-  (void)application:(UIApplication*)application didChangeSetStatusBarFrame:(CGRect)oldStatusBarFrame
{
}
```

说明：当 StatusBar 框变化完成后执行

另外还有一些协议方法需要知道：

Handling Remote Notifications  （处理远程消息）

```
-(void) application:(UIApplication *) applicationdidReceiveRemoteNotification:(NSDictonary *) userinfo
```

说明：当一个运行着的应用程序收到一个远程的通知发送到委托去…

```
-(void) application：(UIApplication *) applicationdidRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken
```

说明：当一个应用程序成功的注册一个推送服务（APS） 发送到委托去…

```
-(void) application:(UIApplication *) applicationdidFailToRegisterForRemoteNotificationsWithError:(NSError *) error
```

说明：当 APS无法成功的完成向 程序进程推送时 发送到委托去…

Handling Local Notification （处理本地消息）

```
-(void) application:(UIApplication *) applicationdidReceiveLocalNotification:(UILocalNotification *)notification
```

说明：当一个运行着的应用程序收到一个本地的通知 发送到委托去…

Responding to Content Protections Changes（响应受保护内容的改变）

```
-applicationProtectedDataWillBecomeUnavailable:
```

说明：通知委托，受保护的文件当前变为不可用的

```
-applicationProtectedDataWillBecomeAvailable:
```

说明：通知委托  受保护的文件当前变为可用



###  2 UIViewController生命周期

方法执行顺序为：init -> viewDidLoad -> viewWillAppear -> viewDidAppear

viewDidLoad是当程序第一次加载view时调用，以后都不会用到，而viewDidAppear是每当切换到view时就调用。

viewDidLoad

Called after the view has been loaded. For view controllers created in code, this is after -loadView. For view controllers unarchived from a nib, this is after the view is set.
 在视图加载后被调用，如果是在代码中创建的视图加载器，他将会在loadView方法后被调用，如果是从nib视图页面输出，他将会在视图设置好后后被调用。

viewWillAppear

Called when the view is about to made visible. Default does nothing
 视图即将可见时调用。默认情况下不执行任何操作

更新准备显示的视图的信息。调用时，视图可能还没有被加载。

viewDidAppear

Called when the view has been fully transitioned onto the screen. Default does nothing
 视图已完全过渡到屏幕上时调用

来触发视图完全显示在屏幕上之后的行为，例如任何动画。

备注：

（1）按下Home键之后不会调用viewWillDisappear和viewDidDisappear
 因为在ios4后引入了后台的概念，当按下Home键之后，程序被挂起了，但是该View依然是原来的View，并不是新的。所以只有内存不够的时候或程序被终止的时候，才会调用viewWillDisappear和viewDidDisappear。

视图控制对象通过alloc和init来创建，但是视图控制对象不会在创建的那一刻就马上创建相应的视图，而是等到需要使用的时候才通过调用loadView来创建，这样的做法能提高内存的使用率。比如，当某个标签有很多UIViewController对象，那么对于任何一个UIViewController对象的视图，只有相应的标签被选中时才会被创建出来。

init－初始化程序

viewDidLoad－加载视图

viewWillAppear－UIViewController对象的视图即将加入窗口时调用；

viewDidApper－UIViewController对象的视图已经加入到窗口时调用；

viewWillDisappear－UIViewController对象的视图即将消失、被覆盖或是隐藏时调用；

viewDidDisappear－UIViewController对象的视图已经消失、被覆盖或是隐藏时调用；

viewVillUnload－当内存过低时，需要释放一些不需要使用的视图时，即将释放时调用；

viewDidUnload－当内存过低，释放一些不需要的视图时调用。

### 3 addSubview

[addSubView](https://www.jianshu.com/p/3defc4030543)

###### addSubview 一层一层往上加 （按顺序来）

###### insertSubView 控制它的添加到哪一层 （可插队）