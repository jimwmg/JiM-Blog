---

---

### 0 MVC

Model
Model定义了你的应用是什么(What)。Model通常是纯粹的NSObject子类（Swift中可以是Struct/Class），仅仅用来表示数据模型。

Controller
Controller定义了Model如何显示给用户(How)，并且View接收到的事件反馈到最后Model的变化。Controller层作为MVC的枢纽，往往要承担许多Model与View同步的工作。

View
View是Model的最终呈现，也就是用户看到的界面。

首先系统会在我们应用目录下（MainBundle）的 Info.plist 文件中查找`UIMainStoryBoardFile`的值，如果找到了，则会在`_loadMainInterfaceFile`中调用`_loadMainStoryboardFileNamed:bundle:`使用 Storyboard 文件初始化主视图。和`NSMainNibFile`，没找到则会继续查找`NSMainNibFile`，找到后在`_loadMainInterfaceFile`中调用`_loadMainNibFileNamed:bundle:`使用 Nib 文件初始化主视图。初始化完成后的主视图会自动赋值给当前应用的 UIWindow 的`rootViewController`属性。

如果两个都没找到，我们还可以在`UIApplicationDelegate`类的`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;`方法中手动创建 UIWindow 和 RootViewController（创建 UIViewController 后将其赋值给 UIWindow 的 rootViewController 属性）。当然，如果我们之前在 Info.plist 文件中正确设置了`UIMainStoryBoardFile`或`NSMainNibFile`，这里创建的 RootViewController 则会将其取代掉。手动创建 UIWindow 和 RootViewController 的方法会在后面给出。

那么，如果我们在`didFinishLaunching`方法中也没创建，那么这个 iOS 应用就没有 UI 了，启动后会显示黑屏，并且`window`也会为`nil`。

1. UIApplicationDelegate

每个 iPhone 应用程序都有一个 UIApplication，UIApplication 是 iPhone 应用程序的开始并且负责初始化并显示 UIWindow，并负责加载应用程序的第一个 UIView 到 UIWindow 窗体中。UIApplication 的另一个任务是帮助管理应用程序的生命周期，而 UIApplication 通过一个名字为 UIApplicationDelegate 的代理类来履行这个任务。尽管 UIApplication 会负责接收事件，而 UIApplicationDelegate 则决定应用程序如何去响应这些事件，UIApplicationDelegate 可以处理的事件包括应用程序的生命周期事件（比如程序启动和关闭）、系统事件（比如来电、记事项警 告），本文会介绍如何加载应用程序的 UIView 到 UIWindow 以及如何利用 UIApplicationDelegate 处理系统事件。

### 1 Controller

UIViewController的生命周期
​    ViewController生命周期会经历初始化、加载视图、销毁视图、生命结束等过程。

1）init方法

      初始化ViewController本身。

2）loadView方法

      当view需要被展示而它却是nil时，viewController会调用该方法，如果代码构建View的话需要重写此方法。

3）viewDidLoad方法

      执行完loadView后继续执行viewDidLoad，loadView时还没有view，而viewDidLoad时view已经创建好了。

4）viewDidUnload方法

     当系统内存吃紧的时候会调用该方法。

5）dealloc

      释放其他资源或内存
