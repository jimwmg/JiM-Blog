---
title: hexo 命令
date: 2016-01-17 12:36:00
tags: 
categories: hexo
comments : true 
updated : 
layout : 
---

hexo 命令

*  初始化博客

$ mkdir  blog   创建一个名为blog 的文件夹

$ hexo init   将会在目标文件夹下建立博客需要的所有文件

$ npm install  进行依赖包安装

* 配置博客
* 创建博文

$ hexo new  myhello   创建一个makedown文件在drafts目录里面

$ hexo n  myhello  等价

$ hexo publish myhello  将文件从drafts移到post目录

$ hexo server    启动服务器 

$ hexo s  也可以启动服务器

*  如何将博客发布到GitHub上？

$ npm install hexo-deployer-git --save   安装hexo git插件

*  部署

$ hexo clean  清除一些莫名其妙的问题

$ hexo generate    生成静态页面  此时会将/source的.md文件生成到/public中，形成网站的静态文件。

等价于 

$ hexo g 

$ hexo deploy   将生成的博客静态页面上传GitHub上 ；该操作会将hexo生成的静态内容部署到配置的仓库中，请看下面介绍。

部署网站之前需要生成静态文件，即可以用 `$ hexo generate -d` 直接生成并部署。等价于

$ hexo d 

$ hexo clean #   删除 已经生成的静态页面

$ cd your-hexo-site 

$ git clone  + http  地址可以创建主题

然后修改root/config.yml    theme   

