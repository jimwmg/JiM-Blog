---
title: AngularJs自定义指令中的controller link和compile
date: 2016-12-03 12:36:00
categories:  javascript
tags :  [Angular,directive,link]
updated : 
layout : 
---

### 1  compile、postlink、 link、 controller 

1.1 compile function

* compile函数:当一个angular应用程序初始化的时候被执行一次,并且只执行一次
* compile函数中不包括作用域的操作以及数据绑定，以及监听器的绑定

 Do:

- Manipulate markup so it serves as a template to instances (clones).

 Do not

- Attach event handlers.
- Inspect child elements.
- Set up observations on attributes.
- Set up watches on the scope.

1.2 Post-link function

When the `post-link` function is called, all previous steps have taken place - binding, transclusion, etc.

This is typically a place to further manipulate the rendered DOM.

Do:

- Manipulate DOM (rendered, and thus instantiated) elements.
- Attach event handlers.
- Inspect child elements.
- Set up observations on attributes.
- Set up watches on the scope.

1.3 Controller function

Each directive's `controller` function is called whenever a new related element is instantiated.

Officially, the `controller` function is where one:

- Defines controller logic (methods) that may be shared between controllers.
- Initiates scope variables.

Again, it is important to remember that if the directive involves an isolated scope, any properties within it that inherit from the parent scope are not yet available.

 Do:

- Define controller logic
- Initiate scope variables

Do not:

- Inspect child elements (they may not be rendered yet, bound to scope, etc.).
  1.4 Pre-link function

Each directive's pre-link function is called whenever a new related element is instantiated.

As seen previously in the compilation order section, pre-link functions are called parent-then-child, whereas post-link functions are called child-then-parent.

The pre-link function is rarely used, but can be useful in special scenarios; for example, when a child controller registers itself with the parent controller, but the registration has to be in a parent-then-child fashion (ngModelController does things this way).

Do not:

Inspect child elements (they may not be rendered yet, bound to scope, etc.).

### 2 各个作用搬运完毕，看下angularjs的生命周期

2.1 编译阶段

在编译阶段，AngularJS会遍历整个HTML文档并根据JavaScript中的指令定义来处理页面上声明的指令。每一个指令的模板中都可能含有另外一个指令，另外一个指令也可能会有自己的模板。当AngularJS调用HTML文档根部的指令时，会遍历其中所有的模板，模板中也可能包含带有模板的指令.一旦对指令和其中的子模板进行遍历或编译，编译后的模板会返回一个叫做模板函数的函数。我们有机会在指令的模板函数被返回前，对编译后的DOM树进行修改。

2.2 第二个阶段是链接阶段:链接函数来将模板与作用域链接起来;负责设置事件监听器，监视数据变化和实时的操作DOM.链接函数是可选的。如果定义了编译函数，它会返回链接函数，因此当两个函数都定义了时，编译函数会重载链接函数.

2.3 走一个demo看下效果

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body ng-app = 'myApp'>
<my-directive></my-directive>
<script src="../libs/angular.js"></script>

<script>
    var myApp = angular.module('myApp',[]);
    myApp.directive('myDirective',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
              //controller函数可以传入参数
                console.log(arguments);
                console.log('this is controller');
            },
            compile:function(){
                console.log(arguments);
                console.log("this is compile");
                return {
                    pre : function(){
                        console.log(arguments);
                        console.log("this is pre");
                    },
                    post : function(){
                        console.log(arguments);
                        console.log("this is post");
                    },

                }
            },
            link : function(){
                console.log(arguments);
                console.log("this is link");
            }
        }
    })

</script>

</body>
</html>
```

控制台输出如下(关于每个函数的arguments这里不再写了，主要是为了看下每个函数要求传入的参数为何)

```
this is compile 
this is controller
this is pre 
this is post
```

我们发现link并没有被执行，因为link被compile函数覆盖了

简化directive

```javascript
myApp.directive('myDirective',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
                console.log(arguments);
                console.log('this is controller');
            },
            link : function(){
                console.log(arguments);
                console.log("this is link");
            }
        }
    })
```

```
this is controller 
this is link
```

这个时候我们发现controller和link都可以执行了，那么我们在实际应用中应该使用哪个？

* 指令的控制器和link函数可以进行互换。控制器主要是用来提供可在指令间复用的行为，但链接函数只能在当前内部指令中定义行为，且无法在指令间复用.link函数可以将指令互相隔离开来，而controller则定义可复用的行为。
* 如果我们希望将当前指令的API暴露给其他指令使用，可以使用controller参数，否则可以使用link来构造当前指令元素的功能性。如果我们使用了scope.$watch()或者想要与DOM元素做实时的交互，使用链接会是更好的选择。

2.4 **子级指令的所有 link function ：包括 pre 和 post 两个link都会在父级的post link之前被执行**,我们用的link function 其实是post link的快捷方式罢了

```html
<body ng-app = 'myApp'>
<div parent>
    <div child></div>
</div>

<div parent1>
    <div child1></div>
</div>

<script src="../libs/angular.js"></script>

<script>
    var myApp = angular.module('myApp',[]);
 
    myApp.directive('parent',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
                console.log('parent controller');
            },
            compile:function(){
                console.log("parent compile");
                return {
                    pre : function(){
                        console.log("parent pre");
                    },
                    post : function(){
                        console.log("parent post");
                    },

                }
            },

        }
    })

    myApp.directive('child',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
                console.log('child controller');
            },
            compile:function(){
                console.log("child compile");
                return {
                    pre : function(){
                        console.log("child pre");
                    },
                    post : function(){
                        console.log("child post");
                    },

                }
            },

        }
    })

    myApp.directive('parent1',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
                console.log('parent1 controller');
            },
            compile:function(){
                console.log("parent1 compile");
                return {
                    pre : function(){
                        console.log("parent1 pre");
                    },
                    post : function(){
                        console.log("parent1 post");
                    },

                }
            },

        }
    })

    myApp.directive('child1',function(){
        return {
            restrict : "EA",
            controller:function(){
//            controller:function($scope, $element, $attrs, $transclude){
                console.log('child1 controller');
            },
            compile:function(){
                console.log("child1 compile");
                return {
                    pre : function(){
                        console.log("child1 pre");
                    },
                    post : function(){
                        console.log("child1 post");
                    },

                }
            },

        }
    })
</script>
</body>
```

```
parent compile
child compile
parent1 compile
child1 compile
parent controller
parent pre
child controller
child pre
child post
parent post
parent1 controller
parent1 pre
child1 controller
child1 pre
child1 post
parent1 post
```

友情链接一个so  

[英文定义]: http://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615239#24615239