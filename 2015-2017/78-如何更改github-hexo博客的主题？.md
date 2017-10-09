---
title: how to change the theme of hexo   
date: 2015-08-09 12:36:00
categories: hexo
tags: hexo
comments : true 
updated : 
layout : 
---

### 如何更改github-hexo博客的主题？

目前使用的主题是：[yilia](https://github.com/litten/hexo-theme-yilia)

##### 在博客的**根目录**下（即上一篇文章[使用Hexo框架自由搭建博客](http://sjunxiao.github.io/2016/06/03/%E4%BD%BF%E7%94%A8Hexo%E6%A1%86%E6%9E%B6%E8%87%AA%E7%94%B1%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/)中提到的 Blog 文件夹下） 克隆主题

```
$ git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
```

##### 执行：

```
$ vim _config.yml
```

##### 将 theme 对应的值进行修改

```
theme: yilia
```

##### 接着就自动部署一下：

```
$ npm install hexo-deployer-git --save
```

##### 最后发布：

```
$ hexo clean && hexo g && hexo d
```

稍等片刻看一下自己的博客主页，你想要的效果就出现了。也可以点击 [更多](https://github.com/hexojs/hexo/wiki/Themes)，挑选自己喜欢的主题进行修改，只要你快乐就好。

### 二、主题配置

现在主题是更改过来了，但还有许多细节需要处理，比如说你需要修改头像等等。

##### 首先进入到根目录下的 themes\yilia 文件夹，执行

```
$ vim _config.yml
```

##### 就能看到这样信息，我是这样配置的：

```
# Header
menu:
 主页: /
 所有文章: /archives
 # 随笔: /tags/随笔

 # SubNav
subnav:
      github: "https://github.com/Sjunxiao"  //github地址
      #weibo: "#"   //微博地址
      rss: "http://www.jianshu.com/users/fb696dcbd06b/latest_articles"  //订阅地址,我填的是自己的简书主页地址。
      #zhihu: "#"    // 下面这些前面带#的,就不显示在主页上,如果有账号,就可以打开
      #douban: "#"
      #mail: "#"
      #facebook: "#"
      #google: "#"
       #twitter: "#"
      #linkedin: "#"

rss: /atom.xml 

# Content
excerpt_link: more
fancybox: true
mathjax: true

# 是否开启动画效果
animate: true

# 是否在新窗口打开链接
open_in_new: false

# Miscellaneous
google_analytics: ''
favicon: /favicon.png

#你的头像url
avatar: "https://avatars2.githubusercontent.com/u/19587420?v=3&s=460"  //设置头像图片，可以直接拷贝Github头像链接
#是否开启分享
share_jia: true
share_addthis: false
#是否开启多说评论，填写你在多说申请的项目名称 duoshuo: duoshuo-key
#若使用disqus，请在博客config文件中填写disqus_shortname，并关闭多说评论
duoshuo: true     //使用'多说'评论
#是否开启云标签
tagcloud: false

#是否开启友情链接
#不开启——
#friends: ture
#开启——
friends:     //下面可以设置自定义友情链接

#是否开启“关于我”。
#不开启——
#aboutme: false
#开启——
aboutme: 像少年啦飞驰   //介绍
```

##### 配置完成以后，回到 **根目录**（即上一篇文章[使用Hexo框架自由搭建博客](http://sjunxiao.github.io/2016/06/03/%E4%BD%BF%E7%94%A8Hexo%E6%A1%86%E6%9E%B6%E8%87%AA%E7%94%B1%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/)中提到的 Blog 文件夹），**按顺序执行命令**就OK啦。

```
$ npm install hexo-deployer-git --save    
$ hexo clean && hexo g && hexo d
```

<转载>

那么如何使用 **Hexo** 建立一个属于自己的网站呢？

### 一、 注册GitHub

首先我们需要做的是去 [GitHub](https://github.com/) 注册一个帐号，并创建一个Repository仓库。这里需要注意的是仓库的名称必须是 `用户名.github.io` ，才能使用 **Github Pages** .

### 二、配置SSH

下载并安装 [Git](https://git-scm.com/) 。

#### 1. 设置user name和email：

```
$ git config --global user.name "你的GitHub用户名"
$ git config --global user.email "你的GitHub注册邮箱"

```

#### 2. 生成ssh密钥:

输入下面命令

```
$ ssh-keygen -t rsa -C "你的GitHub注册邮箱"

```

一般情况下是不需要密码的，所以，接下来直接回车就好。

此时，在用户文件夹下就会有一个新的文件夹 `.ssh` ，里面有刚刚创建的ssh密钥文件 `id_rsa`和 `id_rsa.pub` 。

注：id_rsa文件是私钥，要妥善保管，id_rsa.pub是公钥文件。

#### 3. 添加公钥到github：

点击用户头像，进入Settings(设置)选项。在用户设置栏，点击SSH and GPG keys选项，然后点击New SSH key(新建SSH)按钮；

将id_rsa.pub中的内容复制到 Key 文本框中，然后点击Add SSH key(添加SSH)按钮。

#### 4. 测试SSH：

```
$ ssh -T git@github.com

```

接下来会出来下面的确认信息：

```
The authenticity of host 'github.com (207.97.227.239)' can't be established. 
RSA key fingerprint is 17:24:ac:a5:76:28:24:36:62:1b:36:4d:eb:df:a6:45.
Are you sure you want to continue connecting (yes/no)?

```

输入 `yes` 后回车。

然后显示如下信息则OK(其中的SeayXu是用户名)。

```
Hi longluo! You've successfully authenticated, 
but GitHub does not provide shell access.

```

以上是准备工作。

### 三、创建本地仓库

#### 1. 新建仓库文件夹

这里就取名为blog。

```
$ mkdir blog   在打开bash的地方新建一个文件夹
```

#### 2. 初始化仓库

### 安装hexo 

```
$ npm install -g hexo-cli
$ npm install -g hexo-server
```

进入到blog文件夹，执行初始化命令。

```
$ cd blog # 切换到blog目录  可以从父目录到子目录
$ git init # 初始化git仓库  在这个目录下初始化仓库
```

注：初始化要在Hexo安装之后执行，因为在hexo初始化的时候会从github上克隆代码，会创建.git文件夹。

如果在此之前初始化仓库会将原有的仓库信息覆盖掉，最后也会删除。

### 四、Hexo初始化之前必须先安装hexo客户端

#### 1. 安装Hexo

Hexo是基于 [NodeJS](https://nodejs.org/) ，所以需要先安装NodeJS。

```
$ npm install -g hexo-cli

```

#### 2. 初始化框架

```
$ hexo init <yourFolder>   这个代表初始化哪个文件夹，如果直接在该文件夹下hexoinit则不需要folder
$ cd <yourFolder>
```

#### 3. 安装依赖

```
$ npm install

```

#### 4. 初始化完成大概的目录：

```
.
├── _config.yml //网站的`配置`信息，您可以在此配置大部分的参数。
├── package.json
├── db.json // json格式的静态常量数据库    
├── node_modules // Hexo的功能JavaScript文件
├── public // 生成静态网页文件
├── scaffolds   //模版文件夹。当您新建文章时，Hexo会根据scaffold来建立文件。
├── source     //资源文件夹是存放用户资源的地方。
|   ├── _drafts // 草稿文件夹
|   └── _posts // 文章文件夹
└── themes     //主题文件夹。Hexo会根据主题来生成静态页面。

```

#### 5. 新建文章（创建一个Hello World）

```
$ hexo new <title> for example: "Hello World"

```

在/source/_post里添加hello-world.md文件，之后新建的文章都将存放在此目录下。

如果要删除，直接在此文件夹下删除对应的文件即可。

#### 6. 生成网站

```
$ hexo generate

```

此时会将/source的.md文件生成到/public中，形成网站的静态文件。

#### 7. 服务器

```
$ hexo server -p 3000

```

输入 [http://localhost:3000即可查看网站。](http://www.longluo.me/blog/2016/03/08/the-manual-of-hexo/http://localhost:3000%E5%8D%B3%E5%8F%AF%E6%9F%A5%E7%9C%8B%E7%BD%91%E7%AB%99%E3%80%82)

#### 8. 部署网站

```
$ hexo deploy

```

该操作会将hexo生成的静态内容部署到配置的仓库中，请看下面介绍。

部署网站之前需要生成静态文件，即可以用 `$ hexo generate -d` 直接生成并部署。

此时需要在 **_config.yml** 中配置你所要部署的站点：

```
## Docs: http://hexo.io/docs/deployment.html
deploy:
    type: git
    repo: git@github.com:YourRepository.git
    branch: master

```

如果没有意外，部署就成功了，可以打开 `http://<用户名>.github.io` 查看。

#### 常用Hexo命令

清除生成内容

```
$ hexo c == hexo clean

```

执行此操作会删除 public 文件夹中的内容。

```
$ hexo g == hexo generate
$ hexo s == hexo server

```

### 五、使用Next主题让站点更酷炫

#### 1. 使用NexT Theme

```
$ cd your-hexo-site
$ git clone https://github.com/iissnan/hexo-theme-next themes/next

```

从Next的Gihub仓库中获取最新版本。

#### 2. Hexo NexT主题的文档结构

```
/languages   #用来配置国际化语言版本，里边包含各种个配置像的文本翻译。
/layout      #以swig文件来定义各种含有配置信息调用的布局
/scripts     #一些JS脚本
/source    
    /css      #用来修改自定义样式，需要掌握一定的css语法。
    /fonts    #定义字体文件，可以修改博客字体
    /images   #一些svg图片
    /js       #一些js脚本
    /vendors  
/404.html #自定义的公益404页面
/test        #用于测试

```

#### 3. 启用NexT主题

需要修改/root/_config.yml配置项theme：

```
# Extensions
## Plugins: http://hexo.io/plugins/
## Themes: http://hexo.io/themes/
theme: next

```

#### 4. 验证是否启用

```
$ hexo s --debug

```

访问 [http://localhost:4000，确保站点正确运行。（此命令可以做平时预览用）](http://www.longluo.me/blog/2016/03/08/the-manual-of-hexo/http://localhost:4000%EF%BC%8C%E7%A1%AE%E4%BF%9D%E7%AB%99%E7%82%B9%E6%AD%A3%E7%A1%AE%E8%BF%90%E8%A1%8C%E3%80%82%EF%BC%88%E6%AD%A4%E5%91%BD%E4%BB%A4%E5%8F%AF%E4%BB%A5%E5%81%9A%E5%B9%B3%E6%97%B6%E9%A2%84%E8%A7%88%E7%94%A8%EF%BC%89)

### 六、总结

通过以上步骤，我们就成功的实现了在Github上建立了一个高逼格的Hexo个人博客站点。

下面的事情就是不断的去写，去思考，去实践！

*Complete By Long Luo @2016-3-08 23:12:01 at Shenzhen, China.*