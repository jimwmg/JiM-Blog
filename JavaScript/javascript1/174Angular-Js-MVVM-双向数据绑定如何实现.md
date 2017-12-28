---
title: Angular Js MVVM 双向数据绑定如何实现
date: 2016-11-17 12:36:00
categories:  javascript
tags :  [Angular,bind]
updated : 
layout : 
---

### 1 我们先来看一个简单的双向数据绑定的demo

1.1点击按钮，数据的变化会实现在页面上显示出来

```html
<body ng-app = "myApp">

<div ng-controller = 'myCtrl' >
    <p  ng-bind = 'count'></p>
    <sapn ng-click =' increase() ' >icrease</sapn>
</div>
<script src="../libs/angular.js"></script>
<script>
    var app = angular.module('myApp',[]);
    app.controller('myCtrl',['$scope',function($scope){
        $scope.count = 1 ;
        $scope.increase = function(){
            $scope.count++;
        }

    }])   
</script>
</body>
```

1.2 angular底层是如何实现这种数据的双向绑定的呢？(参阅angular沉思录)

[友情链接]: https://github.com/xufei/blog/issues/10

铺垫一点基础知识

```html
<body>
<button ng-click = 'inc1' id = 'btn'>increase</button>
</body>
<script>
    var ret = document.querySelector('#btn').getAttribute('ng-click');
    console.log(ret);//inc1
    console.log(typeof ret);//string
    console.log(window[ret]);//function inc1(){}函数
    window[ret]();//inc1被执行了
    function inc1 (){  //这个相当于给window对象添加一个属性，属性名是 inc1
        counter++ ;
        console.log('inc1倍执行了');
    }
</script>
```

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>two-way binding</title>
</head>
<body onload="init()">
<button ng-click="inc">
    increase 1
</button>
<button ng-click="inc2">
    increase 2
</button>
<span style="color:red" ng-bind="counter"></span>
<span style="color:blue" ng-bind="counter"></span>
<span style="color:green" ng-bind="counter"></span>

<script type="text/javascript">

    /* 数据模型区开始 */
    var counter = 0;

    function inc() {
        console.log("1");
        counter++;
    }

    function inc2() {
        console.log("2");
        counter+=2;
    }
    /* 数据模型区结束 */

    /* 绑定关系区开始 */
    function init() {
        bind();
    }

    function bind() {
        var list = document.querySelectorAll("[ng-click]");
        for (var i=0; i<list.length; i++) {
            list[i].onclick = (function(index) {
                return function() {
                    window[  list[index].getAttribute("ng-click")  ]();//inc函数会执行
                    apply();
                };
            })(i);
        }
    }

    function apply() {
        var list = document.querySelectorAll("[ng-bind='counter']");
        for (var i=0; i<list.length; i++) {
            list[i].innerHTML = counter;
        }
    }
    /* 绑定关系区结束 */
</script>
</body>
</html>
```

### 2 angular中的\$apply   \$digest  

首先我们来看下它们的作用，当我们在angularjs之外的上下文改变了model的时候，如何让angular进行页面的刷新呢？

```html
<body ng-app="test">
<div ng-controller="CounterCtrl">
    <button myclick>increase</button>
    <span ng-bind="counter"></span>
</div>

</body>
<script src="../libs/angular.js"></script>
<script>
    var app = angular.module("test", []);

    app.directive("myclick", function() {
        return function (scope, element, attr) {
            element.on("click", function() {
                scope.counter++;
                console.log(scope.counter);
            });
        };
    });
    app.controller("CounterCtrl", function($scope) {
        $scope.counter = 0;
    });
</script>
```

这个时候我们是通过javascript处理函数改变了scope的counter值，此时会发现view视图上并不会跟随变化，但是控制打印出来的却是变化了的值。这是因为

* angularjs只负责发生在angularjs上下文中的对于models 的更改会做出自动的回应(也就是$apply方法中对于model的更改orangular内置的其他服务)
* 对于angular上下之外的其他地方修改的model,这个时候就需要手动调用$apply来触发一轮\$digest检测
* build-in的一些 ng-event指令以及ng-model  $timeout  \$interval 等都会自动触发一次\$digest循环

$timeout(fn,delay,optional,pass)  第一个参数是执行函数，第二参数是延迟时间，第三个参数是是否进行脏值检测，默认是true,如果设置为false，则model数据的更新不会在视图上同步，pass是传递到执行函数的参数

```html
<body ng-app = 'myApp' >
  <div ng-controller="myController">
    <p>{{clock}}</p>

  </div>
  <script src="../libs/angular.js"></script>

  <script>

    var app = angular.module('myApp',[]);
    app.controller('myController',['$scope','$timeout',function($scope,$timeout){
      var updateClock = function() {
        $scope.clock = new Date();
        $timeout(function() {
          updateClock();
        }, 1000,false);//如果设置为false，发现不会model数据会更新，但是不会反应在view视图上

        console.log($scope.clock);
      };
      updateClock();
    }]);
  </script>
</body>
```

$interval(fn,delay,count,optional,pass) 第一个参数是执行函数，第二个参数是延迟时间，第三个参数是fn执行的次数，第四个参数表示是否进行脏值检测，第五个蚕食表示传递的参数

```html
<body ng-app = 'myApp' >
  <div ng-controller="myController">
    <p>{{clock.now}}</p>

  </div>
  <script src="../libs/angular.js"></script>

  <script>
    var app = angular.module('myApp',[]);
    app.controller('myController',['$scope','$interval',function($scope,$interval){
      $scope.clock = {
        now : new Date()
      }
      $interval(function(){
        $scope.clock.now = new Date();
      },1000,5);//5表示fn只会循环5次，如果不设置，则会无限循环，后面还可以设置false参数，表示不会进行脏检

    }])
  </script>
</body>
```

以上代码指令自定义可以变成以下三种方式

```javascript
app.directive("myclick", function() {
        return function (scope, element, attr) {
            element.on("click", function() {
                scope.counter++;
                scope.$digest();
              // scope.$apply(); //不推荐这种写法
                console.log(scope.counter);
            });
        };
    });
```

or

```javascript
app.directive("myclick", function() {
        return function (scope, element, attr) {
            element.on("click", function() {
                scope.counter++;

               scope.$apply(function() {
                    scope.counter++;
               });
                console.log(scope.counter);
            });
        };
    });
```

此时会发现view视图会随着model的改变实时更新了

再来个栗子

```html
<body ng-app = 'myApp'>
<div ng-controller = 'myCtrl'>
    <p ng-modle = 'name'>{{name}}</p>
    <input type="text" ng-model = 'name'/>
    <p>{{name}}</p>
    <p>{{age}}</p>
</div>
<script src="../libs/angular.js"></script>
<script>
 var app = angular.module('myApp',[]);
app.controller('myCtrl',['$scope',function($scope){
        $scope.setInfo = function(){
           setTimeout(function(){
              $scope.$apply(function(){
                  $scope.name = 'Jhon';
                  $scope.age = 19;
              })
           },2000)
        }
        $scope.setInfo();
    }])
//两秒后，会显示修改的scope内容
</script>
</body>
  
```

```javascript
  app.controller('myCtrl',['$scope',function($scope){
        $scope.setInfo = function(){
            setTimeout(function(){
                $scope.name = 'Jhon';
                $scope.age = 19 ;
                $scope.$apply();
            },2000);
        }
        $scope.setInfo();
        console.log($scope);
    }])
```

### 3 angular中的 $ watch

在上面的情况中，我们通过$apply \$digest函数的调用就可以将model模型上的数据变化实时反应在view层上，但是我们有没有思考为什么会model层的改变会实时显示在view层呢？这个时候就是watch的主要作用了当我们写下表达式，比如　`{{someValue}}`　的时候，angularjs在幕后为我们做了一件事情，

```javascript
$scope.$watch('somevalue',function(){
  console.log(arguments);//oldValue newValue scope
  //这里实现更新view的逻辑，model层的数据变化实时更新到view层
})
```

也就是说，底层原理来讲是$watch回调函数的调用来执行的实时的数据更新，那么angularjs是怎么知道什么时候去调用这个回调函数呢？先抛出这个问题，看下这个demo，

* 这种情况是scope模型上的数据改变了但是没有触发watch函数的情况，因为我们没有进行脏值检测$digest或者\$apply

```html
<body ng-app = 'myApp'>
  <div ng-controller = 'myCtrl'>
    <p>{{age}}</p>

  </div>
  <script src="../libs/angular.js"></script>

  <script>
    var app = angular.module('myApp',[]);
    app.controller('myCtrl',['$scope',function($scope){
      $scope.age = 19 ;
      $scope.change = function(){
        setInterval(function(){
          $scope.age++;
          console.log("1");
          console.log($scope.age);
        },2000)
      }
      $scope.change(); 
      $scope.$watch('age',function(){
        console.log(arguments);//看下回调函数的参数
        console.log("age变化触发了我的出现");
      })
    }])
  </script>
</body>
```

控制台会循环输出　1　和　　age的递增 ；

这个时候我们就需要思考了？通过什么方式触发$watch呢？修改change函数

```javascript
$scope.change = function(){
  setInterval(function(){
    $scope.$apply(function(){
      $scope.age++ ;
    })
  },2000)
}
```

这个时候我们会发现控制台会循环执行watch函数



