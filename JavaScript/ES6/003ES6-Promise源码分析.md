---
title:  ES6-Promise源码分析
date: 2017-06-15 12:36:00
categories: ES6
tags : promise
comments : true 
updated : 
layout : 
---



现在回顾下Promise的实现过程，其主要使用了设计模式中的观察者模式：

1. 通过Promise.prototype.then和Promise.prototype.catch方法将观察者方法注册到被观察者Promise对象中，同时返回一个新的Promise对象，以便可以链式调用。
2. 被观察者管理内部pending、fulfilled和rejected的状态转变，同时通过构造函数中传递的resolve和reject方法以主动触发状态转变和通知观察者。

[Promise源码](https://github.com/jimwmg/promise/blob/master/src/core.js)