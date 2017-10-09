---
title:  XMIHttpRequestLevel2FormData
date: 2016-09-22 
categories: ajax
tags : Http
comments : true 
updated : 
layout : 
---

1 首先来看下声明是FormData (查看MDN官方文档)

XMLHttpRequest Level 2添加了一个新的接口FormData.利用FormData对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,我们还可以使用XMLHttpRequest的[send()方法来异步的提交这个"表单".比起普通的ajax,使用FormData的最大优点就是我们可以异步上传一个二进制文件.

2 看下之前上传文件的限制

3 用这个新特性上传文件的优势