---
title: AngularModule 
date: 2016-09-27 12:36:00
categories:  javascript
comments : true 
tags :  Angular
updated : 
layout : 
---

1 定义:A module is a collection of configuration and run blocks which get applied to the application during the bootstrap process. In its simplest form the module consists of a collection of two kinds of blocks

angular.module('myApp',[ ]) 用来创建一个模块  angular.module('myApp') 用来引用一个模块(该模块必须已经声明)

```html
<body ng-app = 'myApp'>
<script>
    var myApp = angular.module("myApp",[]);
    var myApp2 = angular.module("myApp");
    console.log(myApp);
    console.log(myApp2);
    console.log(myApp === myApp2);//true
</script>
</body>
```

2 AngularJS分两个阶段运行你的应用 – config阶段和run阶段。config阶段是你设置任何的provider的阶段。它也是你设置任何的指令，控制器，过滤器以及其它东西的阶段。在run阶段，AngularJS会编译你的DOM并启动你的应用

2.1 Configuration Blocks 

```javascript
//语法糖，这个是我们平常的写法，很简洁，其实是下一段代码的语法糖
angular.module('myModule', []).
  value('a', 123).
  factory('a', function() { return 123; }).
  directive('directiveName', ...).
  filter('filterName', ...).
  controller('MainController',function($scope){
    
  });
// is same as

angular.module('myModule', []).
  config(function($provide, $compileProvider, $filterProvider) {
    $provide.value('a', 123);
    $provide.factory('a', function() { return 123; });
    $compileProvider.directive('directiveName', ...);
    $filterProvider.register('filterName', ...);
  	$controllerProvider.register('MainController', function($scope) {

 	  });
	});
  });
```

需要注意的一点是:在config阶段，只有provider能被注入（只有两个例外是\$provide和$injector)。



3 Run Blocks

Run blocks are the closest thing in AngularJS to the main method. A run block is the code which needs to run to kickstart the application. It is executed after all of the services have been configured and the injector has been created. Run blocks typically contain code which is hard to unit-test, and for this reason should be declared in isolated modules, so that they can be ignored in the unit-tests.