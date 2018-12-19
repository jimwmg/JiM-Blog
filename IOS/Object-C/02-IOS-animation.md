---

---

参考资料：

[animation1](https://www.jianshu.com/p/457357a5897a)

[github-demo](https://github.com/ildream/CAAnimationDemo)

[animation-demo汇总](http://code.cocoachina.com/list/33/5?order=downloads)

[IOS开发步骤](https://www.jianshu.com/p/73f4e11524e9)

xcode面板详解：

[xcode官方教程-重要且准确-墙裂推荐-用时 1 小时即可完全掌握xcode用法](https://help.apple.com/xcode/mac/current/)

左侧面板最后一个：[IOS构建日志](http://beyondvincent.com/2013/11/21/2013-11-23-123-build-process/)

[IOS-animation-demo合集](https://segmentfault.com/a/1190000016181681)

[基础动画](https://github.com/manofit/BabyPigAnimation.git)



xcode文档总结

### 1 user interface file

A *user interface file* is a type of macOS file (a file with a `.storyboard` or `.xib` filename extension) that contains the source for the user interface of an app. A storyboard (`.storyboard`) file contains a set of view controllers and their views, and the relationships between the view controllers. A xib file (`.xib`) usually contains one view controller or menu bar. The contents of `.xib` and `.storyboard`files are stored in XML format. At build time, the `.xib` and `.storyboard` files are compiled into binary files called `nibs`. At runtime, nibs are loaded and the objects they contain are instantiated

All projects created from a template contain a `Main.storyboard` file that contains the user interface for your app. For watchOS apps, the file is called `Interface.storyboard`. For iOS apps, there’s also a `LaunchScreen.storyboard` file for the view that is displayed while the app is launching. A storyboard (`.storyboard`) file contains a set of view controllers and their views. To open Interface Builder in a separate window, Control-click the user interface file in the Project navigator, then choose Open in New Window from the pop-up menu.