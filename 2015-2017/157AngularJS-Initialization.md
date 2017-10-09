---
title: AngularJsInitialization 
date: 2016-11-10 12:36:00
categories:  javascript
comments : true 
tags :  Angular
updated : 
layout : 
---

1 angularJs初始化应用模块有两种方式

1.1、绑定初始化，自动加载

通过绑定来进行angular的初始化，会把js代码侵入到html中。

ng-app是angular的一个指令，代表一个angular应用（也叫模块）。使用ng-app或ng-app=""来标记一个DOM结点，让框架会自动加载。也就是说，ng-app是可以带属性值的。如果没有ng-app指令将会报错；

自动初始化流程如下

**ng-app** 指令定义了 AngularJS 应用程序的 **根元素**

AngularJS 在 HTML DOMContentLoaded 事件后会**自动引导**（自动初始化）应用程序。如果找到 ng-app 指令 ， AngularJS 载入**指令中的模块**，然后创建应用的**注入器**，并将 ng-app 作为应用的根**进行编译**。同时，启动应用的时候，会在其子元素范围内构成一个$scope;

应用的根可以是整个页面，或者页面的一小部分，如果是一小部分会更快编译和执行。

AngularJS initializes automatically upon `DOMContentLoaded` event or when the `angular.js` script is evaluated if at that time `document.readyState` is set to `'complete'`. At this point AngularJS looks for the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive which designates your application root. If the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive is found then AngularJS will:

- load the module associated with the directive.
- create the application injector
- compile the DOM treating the ngApp directive as the root of the compilation. This allows you to tell it to treat only a portion of the DOM as an AngularJS application.

```html
通过控制体controller进行数据绑定
<body ng-app = 'Demo'> 
<div ng-controller = 'DemoCtrl'>
    `{{a}}+{{b}} = {{a+b}}`
</div>
<script>
  //如果要对angular应用添加控制器，那么必须关联Demo到module模块，如果不关联那么则会提示没有
  //The controller with the name 'xxx' is not registered.
    angular.module('Demo',[]).controller('DemoCtrl',['$scope',function($scope){
        $scope.a = 1 ;
        $scope.b = 2 ;
    }]);
</script>
</body>
```

```html
通过run方法进行数据绑定，这个只能提供全局的变量
<body ng-app = 'Demo'>
<div >
    `{{a}}+{{b}} = {{a+b}}`
</div>
<script>
    var myapp =   angular.module('Demo',[]);
    console.log(myapp);
    myapp.run(function($rootScope){
        $rootScope.a = 1 ;
        $rootScope.b = 2 ;
    })
</script>
</body>
```

```html
通过ng-init初始化数据
<div ng-app ng-init='name = "Jhon"'>
    <div ng-bind="name"></div>
</div>
```

ng-app指令作用如下

There are a few things to keep in mind when using `ngApp`:

- only one AngularJS application can be auto-bootstrapped per HTML document. The first `ngApp` found in the document will be used to define the root element to auto-bootstrap as an application. To run multiple applications in an HTML document you must manually bootstrap them using [`angular.bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) instead.
- AngularJS applications cannot be nested within each other.
- Do not use a directive that uses [transclusion](https://docs.angularjs.org/api/ng/service/$compile#transclusion) on the same element as `ngApp`. This includes directives such as [`ngIf`](https://docs.angularjs.org/api/ng/directive/ngIf), [`ngInclude`](https://docs.angularjs.org/api/ng/directive/ngInclude)and [`ngView`](https://docs.angularjs.org/api/ngRoute/directive/ngView). Doing this misplaces the app [`$rootElement`](https://docs.angularjs.org/api/ng/service/$rootElement) and the app's [injector](https://docs.angularjs.org/api/auto/service/$injector), causing animations to stop working and making the injector inaccessible from outside the app.

You can specify an **AngularJS module** to be used as the root module for the application. This module will be loaded into the [`$injector`](https://docs.angularjs.org/api/auto/service/$injector)when the application is bootstrapped. It should contain the application code needed or have dependencies on other modules that will contain the code. See [`angular.module`](https://docs.angularjs.org/api/ng/function/angular.module) for more information.

1.2 当同一个页面中包含多个app的时候(不能嵌套)，这个时候angular就不能自动启动应用，需要我们用bootstrp手动启动应用

手动初始化一个angular应用模块,可以使用angular.bootstrap()，该方法可以初始化一个angularjs应用，注意该方法不会创建模块，我们在将模块作为参数传递之前必须先创建了一个模块或者已经先加载了一个模块

```
angular.bootstrap(element, [modules], [config]);
```

其中第一个参数element:是绑定ng-app的dom元素；
modules：绑定的模块名字
config：附加的配置

```html
<body >
<div ng-controller = 'DemoCtrl'>
   ` {{a}}+{{b}} = {{a+b}} `
</div>
<script>
    angular.module('Demo',[]).controller('DemoCtrl',['$scope',function($scope){
        $scope.a = 1 ;
        $scope.b = 2 ;

    }]);
  //页面加载完毕之后在进行初始化模块
    angular.element(document).ready(function(){
        angular.bootstrap(document,['Demo']);
      	//angular.bootstrap(document.body,['Demo'])
     //上面两行代码绑定同一个模块会报错，只能存在一个
    })
</script>
</body>
```

```html
<html>

<head>
    <script src="angular.js"></script>
    <script>

        // 创建moudle1
        var rootMoudle = angular.module('moudle1', []);
        rootMoudle.controller("controller1",function($scope){$scope.name="aty"});

        // 创建moudle2
        var m2 = angular.module('moudle2', []);
        m2.controller("controller2",function($scope){$scope.name="aty"});
        // 页面加载完成后,再加载模块
        angular.element(document).ready(function() {
            angular.bootstrap(document.getElementById("div1"),["moudle1"]);
            angular.bootstrap(document.getElementById("div2"),["moudle2"]);
          //绑定不同的模块是可以的
        });
    </script>
<head>
<body>
<div id="div1"  ng-controller="controller1">div1:`{{name}}`</div>
<div id="div2"  ng-controller="controller2">div2:`{{name}}`</div>
</body>
</html>
```

1.3 一个ng-app所在的标签就是一个angular应用，该标签下的所有子标签会被angular编译，不是其子标签的话不会被angular编译

```html
<body>

<div ng-app = 'app' ng-controller = 'myCtrl'>
    <div>`{{name}}`</div>
    <div>`{{age}}`</div>
</div>
  
<div>`{{age}}`</div>
<!--初始化ng-app，那么ng-app标签下面的子标签就是整个应用，其他的就不是angular应用，然后angular不会编译其余的标签
第二个age不会被angular编译，因此不会被显示19，只会显示{{age}}
-->
<script>
    var app = angular.module('app',[]);
    app.controller('myCtrl',['$rootScope','$scope',function($scope,$rootScope){
        $rootScope.name = "Jhon";
        $scope.age = 19 ;
    }]);
</script>
</body>
```

1.4注意

* ng-app和angular.bootstrap不能同时使用

* ng-app只能出现一次，所以就只能出现一个angularjs应用，但是angular.bootstrap可以出现多次，但是这种做法是不推荐的

* 二者初始化的一个应用的时候，所在元素的不能有ngIf   ngView  ngInclude指令

* ng-app所在的标签的就是一个angular应用，该标签下面的所有的子标签都会被angular编译，不是该标签的子标签不会被angular编译

* 初始化angular应用之后可以进行创建模块以及控制器、服务等其他操作

* 初始化的angular应用里面的表达式会被编译，编译之后的表达式会按照angular的规定进行解析，如果没有ng-app指令或者bootstrap手动初始化angular应用，则表达式不会进行运算，将直接显示出来

* HTML5 允许扩展的（自制的）属性，以 **data-** 开头。
  AngularJS 属性以 **ng-** 开头，但是您可以使用 **data-ng-** 来让网页对 HTML5 有效。

* AngularJS 表达式 与 JavaScript 表达式

  类似于 JavaScript 表达式，AngularJS 表达式可以包含字母，操作符，变量。

  与 JavaScript 表达式不同，AngularJS 表达式可以写在 HTML 中。

  与 JavaScript 表达式不同，AngularJS 表达式不支持条件判断，循环及异常。

  与 JavaScript 表达式不同，AngularJS 表达式支持过滤器。