---
title: CMD command 
date: 2016-04-11 12:36:00
categories: window
comments : true 
updated : 
layout : 
---

cmd常用命令行

#### 1 IP地址

所谓IP地址就是给每个连接在互联网上的主机分配的一个32位地址。(就像每部手机能正常通话需要一个号码一样)

查看本机IP地址 ping、ipconfig、ifconfig（linux）

    > ipconfig                       ... 显示信息
    > ipconfig /all                  ... 显示详细信息
    > ipconfig /renew                ... 更新所有适配器
    > ipconfig /renew EL*            ... 更新所有名称以 EL 开头
                                         的连接
    > ipconfig /release *Con*        ... 释放所有匹配的连接，
                                         例如“有线以太网连接 1”或
                                             “有线以太网连接 2”
    > ipconfig /allcompartments      ... 显示有关所有隔离舱的
                                         信息
    > ipconfig /allcompartments /all ... 显示有关所有隔离舱的
                                         详细信息
#### 2、域名

由于IP地址基于数字，不方便记忆，于是便用域名来代替IP地址，域名是一个IP地址的“面具”

查看域名对应的IP地址 ping

#### 3、DNS服务

DNS（Domain Name System）因特网上作为域名和IP地址相互映射的一个分布式数据库， 能够使用户更方便的访问互联网，而不用去记住能够被机器直接读取的IP数串。

简单的说就是记录IP地址和域名之间对应关系的服务。

**查找优先级 本机hosts文件、DNS服务器** 

ipconfig /flushdns 刷新DNS

#### 4、端口

端口号是计算机与外界通讯交流的出口，每个端口对应不同的服务。

*现实生活中，银行不同的窗口办理不同的业务。*

查看端口占用情况 netstat -an

常见端口号 80、8080、3306、21、22