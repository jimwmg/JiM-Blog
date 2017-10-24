---
title: Angular Js angularModule 
date: 2016-10-17 12:36:00
categories:  javascript 
comments : true 
tags :  [Angular,module]
updated : 
layout : 
---

1 模块的定义

module是angular中重要的模块组织方式，它提供了将一组内聚的业务组件（controller、service、filter、directive…）封装在一起的能力。这样做可以将代码按照业务领域问题分module的封装，然后利用module的依赖注入其关联的模块内容，使得我们能够更好的”分离关注点“，达到更好的”高内聚低耦合“。”高内聚低耦合“是来自面向对象设计原则。内聚是指模块或者对象内部的完整性，一组紧密联系的逻辑应该被封装在同一模块、对象等代码单元中，而不是分散在各处；耦合则指模块、对象等代码单元之间的依赖程度，如果一个模块的修改，会影响到另一个模块，则说明这两模块之间是相互依赖紧耦合的。

同时module也是我们angular代码的入口，首先需要声明module，然后才能定义angular中的其他组件元素，如controller、service、filter、directive、config代码块、run代码块等。

关于module的定义为：angular.module(‘com.ngbook.demo’, [])。关于module函数可以传递3个参数，它们分别为：

1. name：模块定义的名称，它应该是一个唯一的必选参数，它会在后边被其他模块注入或者是在ngAPP指令中声明应用程序主模块；
2. requires：字符串的参数列表；模块的依赖，它是声明本模块需要依赖的其他模块的参数。特别注意：如果在这里没有声明模块的依赖，则我们是无法在模块中使用依赖模块的任何组件的；它是个可选参数。
3. configFn： 模块的启动配置函数，在angular config阶段会调用该函数，对模块中的组件进行实例化对象实例之前的特定配置，如我们常见的对$routeProvider配置应用程序的路由信息。它等同于”module.config“函数，建议用”module.config“函数替换它。这也是个可选参数。

我们可以打印出来angular全局对象和angular.module()这个方法返回的对象来更深入的了解它们之间的关系

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>mudule submit</title>
    <script src="./bower_components/angular/angular.js"></script>
</head>
<body >
<script>
    console.dir(angular);
    console.dir(angular.module("myModule",[]));
</script>
</body>
</html>
```

2 声明module之后，其他组件元素，如controller、service、filter、directive、config代码块、run代码块也就可以在对应的模块上使用了。