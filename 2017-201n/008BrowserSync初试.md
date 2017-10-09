---
title: BrowserSync初试 文件上传和下载
date: 2017-07-07
categories: utils
tags: utils

---

###	BrowserSync

优秀的程序员都是比较懒的，但是我。。。。。虽然不优秀，但是懒，嗯，开始正文

### 1 安装nodejs 

BrowserSync是基于Node.js的, 是一个Node模块， 如果您想要快速使用它，也许您需要先安装一下Node.js 

### 2 安装BrowserSync

```
npm install -g browser-sync
```

### 3 启动BrowserSync

* 静态网站

假设我们有如下目录

```
-app
	-index.html
	-css
		style.css		
```

我们在app文件夹下打开终端

```
browser-sync start --server --files "css/*.css"
// --files 路径是相对于运行该命令的项目（目录） 
//如果您需要监听多个类型的文件，您只需要用逗号隔开。例如我们再加入一个.html文件
browser-sync start --server --files "css/*.css, *.html"
// 如果你的文件层级比较深，您可以考虑使用 **（表示任意目录）匹配，任意目录下任意.css 或 .html文件。 
browser-sync start --server --files "**/*.css, **/*.html"
```

* 动态网站

如果您已经有其他本地服务器环境PHP或类似的，您需要使用*代理模式*。 BrowserSync将通过代理URL(localhost:3000)来查看您的网站。

```
// 主机名可以是ip或域名
browser-sync start --proxy "主机名" "css/*.css"
```

在本地创建了一个PHP服务器环境，并通过绑定Browsersync.cn来访问本地服务器，使用以下命令方式，Browsersync将提供一个新的地址localhost:3000来访问Browsersync.cn，并监听其css目录下的所有css文件。

```
browser-sync start --proxy "Browsersync.cn" "css/*.css"
```

### 4 此时终端会出现如下信息

```
[BS] Access URLs:
 --------------------------------------
       Local: http://localhost:3002
    External: http://192.168.0.139:3002
 --------------------------------------
          UI: http://localhost:3003
 UI External: http://192.168.0.139:3003
 --------------------------------------
[BS] Serving files from: ./
[BS] Watching files...
```

local代表电脑终端的地址，External代表同一个局域网内共用的网段

**注意手机和电脑连接同一个wifi即可，此时手机端浏览器输入**http://192.168.0.139:3003，所展示的页面和PC端将会是同步更新的

对于browserSync的命令行的一些用法，总结如下：

* 命令行使用的基本语法

```
$ browser-sync start <options>
```

### [start options](http://www.browsersync.cn/docs/command-line/#command-line-options)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

| --help                 | 输出使用信息                      |
| ---------------------- | --------------------------- |
| --version              | 输出的版本号                      |
| --browser              | 选择哪个浏览器应该是自动打开              |
| --files                | 文件路径看                       |
| --exclude              | 文件模式忽视                      |
| --server               | 运行本地服务器（使用您的CWD作为Web根）      |
| --index                | 指定哪些文件应该被用作索引页              |
| --extensions           | 指定文件扩展名回退                   |
| --startPath            | 指定起始路径，打开浏览器                |
| --https                | 启用SSL地方发展                   |
| --directory            | 显示服务器的目录列表                  |
| --proxy                | 代理现有的服务器                    |
| --xip                  | 使用xip.io域路由                 |
| --tunnel               | 使用公共网址                      |
| --open                 | 选择哪个URL是自动打开（本地，外部或隧道）      |
| --config               | 指定为BS-config.js文件的路径        |
| --host                 | 指定主机名使用                     |
| --logLevel             | 设置记录器输出电平（沉默，信息或调试）         |
| --port                 | 指定要使用的端口                    |
| --reload-delay         | 以毫秒为单位的时间延迟重装事件以下文件的变化      |
| --reload-debounce      | 限制在浏览器中的频率：刷新事件可以被发射到连接的客户机 |
| --ui-port              | 指定端口的UI使用                   |
| --no-notify            | 禁用浏览器的通知元素                  |
| --no-open              | 不要打开一个新的浏览器窗口               |
| --no-online            | 强制离线使用                      |
| --no-ui                | 不要启动用户界面                    |
| --no-ghost-mode        | 禁用幽灵模式                      |
| --no-inject-changes    | 刷新上的每个文件更改                  |
| --no-reload-on-restart | 不要自动重新加载在重新启动所有浏览器          |

*  [文件实例](http://www.browsersync.cn/docs/command-line/#files-example)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

   这个就比如上面写过的app文件夹，下面有一些静态页面，可以代理，然后手机端和PC端都可以访问

```
# 单个文件 
$ browser-sync start --files "css/core.css"

# 单模式
$ browser-sync start --files "css/*.css"

# 多个文件 
$ browser-sync start --files "css/core.css, css/ie.css"

# 多模式 
$ browser-sync start --files "css/*.css, *.html"
```

*  [服务器实例](http://www.browsersync.cn/docs/command-line/#server-example)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

   这个是如果我们在本地启用了服务器，可以使用这个

```
# 使用当前目录为根＃静态服务器
$ browser-sync start --server

# 使用“应用程序”目录的根目录＃静态服务器
$ browser-sync start --server app

# 使用当前目录与目录列表根＃静态服务器 
$ browser-sync start --server --directory
```

*  [代理实例](http://www.browsersync.cn/docs/command-line/#proxy-example)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

   这个就是假如我们有一个react或者vue项目，我们首先启动项目，然后直接代理我们启动的项目所在接口即可。

```
# 使用local.dev虚拟主机
$ browser-sync start --proxy

# 使用local.dev虚拟主机与港口 
$ browser-sync start --proxy local.dev:3000

# 使用本地主机地址 
$ browser-sync start --proxy localhost:3000

# 在子迪尔使用本地主机地址 
$ browser-sync start --proxy localhost:8080/site1
```

*  [看文件+服务器](http://www.browsersync.cn/docs/command-line/#watching-files-example)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

```
# 观看所有的CSS文件与静态服务 器修改 
$ browser-sync start --files "app/css/*.css" --server

# 观看所有的CSS文件与静态服务 器的更改
# 使用“应用程序”作为基本目录
$ browser-sync start --files "app/css/*.css" --server "app"
```

*  [重载选项](http://www.browsersync.cn/docs/command-line/#command-line-options)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

| --files | 文件路径重载                  |
| ------- | ----------------------- |
| --port  | 通过目标端口号的运行实例            |
| --url   | 提供完整的URL运行Browsersync实例 |

*  [重载 HTTP协议](http://www.browsersync.cn/docs/command-line/#command-line-options)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

```
$ browser-sync reload

```

* [重载带端口的HTTP协议](http://www.browsersync.cn/docs/command-line/#command-line-options)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

```
$ browser-sync reload --port 4000 --files="*.css"

```

* [重载全URL http协议](http://www.browsersync.cn/docs/command-line/#command-line-options)[^ TOP](http://www.browsersync.cn/docs/command-line/#page-top)

```
$ browser-sync reload --url https://localhost:3000 --files="*.css"
```



### 5 最近在调试HTML5移动端上传文件的功能，利用这个可以很方便的查看input. type='file'其他属性所调用的手机资源的情况

以上app文件夹下：index.htmls

```html
<body>
   <h1>browsersync.cn</h1>
   <form action="#">
    <label for="file"><input type="file" id='file' name='myFile' capture='camera'>上传文件</label>
    <label for="btn"><input type="submit" id='btn' name='myBtn'>进行提交</label>
    <div>test</div>

  </form>
   谢谢

   <a href="https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg" target="_self" download="">下载</a>
    <div id="container"></div>
    <script>
    var blob = new Blob(["Hello World"]);

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "hello-world.txt";
    a.textContent = "Download Hello World!";
    a.innerHTML = "xiazai"
    document.getElementById('container').appendChild(a);
    </script>
</body>
```

### 6 input  file='type'. 的capture属性以及accept属性

以下经过测试

* IOS系统

  对于IOS系统，点击input type='file' 标签，弹出的选择页面永远都是一致的

* android系统

  但是对于android系统，点击input type='file'标签，弹出的选择页面却千差万别，深深伤了我的心。

capture属性

html5对`input:file`作了扩展，使用户可以通过`input:file`来调用设备（主要是移动设备：手机/平板）的照相机/相册、摄像机、录音机功能

此扩展方案首先是给`input:file`加了一个属性：`capture`，这是一个boolean类型的属性，也就是只要有出现就为true，没出现就是false，这跟网上的一些资料有所冲突：

```javascript
<input type="file" accept="image/*" capture="camera" /> 
<input type="file" accept="video/*" capture="camcorder" />
<input type="file" accept="audio/*" capture="microphone" />
capture表示，可以捕获到系统默认的设备，比如：camera--照相机；camcorder--摄像机；microphone--录音。
事实上，capture并不需要有值，直接用 <input type="file" accept="image/*" capture /> 即可。
```

multiple 属性，用来决定是否可以上传多个文件，如果使用了该属性，那么capture属性将不再有效

accept属性，表示接受的上传的文件的类型









[W3C官方文档](https://www.w3.org/TR/html-media-capture/)

[BrowserSync中文网](http://www.browsersync.cn/#install)

[图片HTML5 input标签处理](http://blog.mingsixue.com/note/note-html-image-upload.html)

