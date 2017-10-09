---
title: Angular Js directive 
date: 2016-11-21 
categories:  javascript  
tags :  [Angular,directive]
updated : 
layout : 
---

建议大家看angular英文文档，然后实践出真知

### 1 angular directive的自定义用法	我们在定义一个指令的时候使用驼峰法来命名一个指令，例如 **runoobDirective**, 但在使用它时需要以 `- `分割, **runoob-directive**；

先来看下自定义指令的语法结构

首先定义指令前需要首先定义一个模块

```javascript
var app = angular.module('app',[]);//定义一个模块
```

在定义了模块之后，可以在定义指令

```javascript
app.directive('directiveName',function(){
  return config
})
```

return的配置参数有很多，接下来一一进行分析

### 1.1 限制使用  restrict  值为字符串  可以的值有  ECMA  E设置指令可以通过元素的形式进行调用 A 设置指令可以通过属性的形式调用 M设置指令可以通过注释的形式调用 C设置指令可以通过类名进行调用；

**默认值是EA** ，表示我们定义的指令可以通过元素名或者属性的形式进行调用

你可以限制你的指令只能通过特定的方式来调用。

```html
<!-- E (element) -->
<directiveName></directiveName>
比如<ng-view></ng-view>等

<!-- A (attribute) -->
<div directiveName="expression"></div>
比如<div ng-init="name= 'Jhon'"></div>
<div ng-hide="name= 'Jhon'"></div> 等

<!-- C (class) -->
<div class="directiveName"></div>

<!-- M(comment) -->
<!--directive:directiveName expression-->
```

### 1.2  priority 默认值为0 

数字，可选参数，致命指令的优先级，若在单个DOM元素上有多个指令，则优先级高的先执行。

当然，设置指令的优先级不太常用，但是比较特殊的例子是，内置指令ng-repeat的优先级为1000，而ng-init的优先级为 450。

### 1.3 terminal

布尔型，可选参数，可以被设置为true或者false，若设置为true，则优先级低于此指令的其他指令则无效，不会被调用优先级相同任然会执行。

### 1.4. template

**字符串或者函数**，可选参数。 其中字符串可以是html标签，可以是一个页面，也可以是一个简单的字符串比如 "this is  str"

* 如下栗子我们简单的定义了一个指令，template是字符串的形式

```javascript
app.directive('hello',function(){
  return {
    //默认restrict是EA
    template:'<div>try your best</div>'
  }
})
```

然后可以使用该指令，通过属性或者元素的方式进行指令的使用

```html
<div hello></div>
<hello></hello>
```

显示结果如下

```html
try your best
try your best
```

* 如下栗子我们定义的一个指令，template是函数的形式，function函数接受两个参数，第一个是element,表示使用此指令的元素，attrs是 实例的属性，它有一个元素上所有的属性组成集合

```javascript
app.directive('hello1',function(){
  return {
    template:function(ele,attr){
      console.log(arguments);
      //为了便于说明函数传入的参数ele和attr到底代表的是哪些，我们可以打印出来看下具体的结果
      return '<div>'+'hello '+attr.info+'</div>'
    }
  }
})
```

然后可以使用该指令，通过属性或者元素的方式进行指令的调用，可以发现第一个调用输出arguments，ele参数代表hello1元素，attr参数代表hello1上面的属性的集合 ，第二次输出arguments,ele代表div元素，attr参数代表div上面的所有的属性的集合

```html
<hello1 info = 'Jhon'></hello1>
<div hello1 info='JiM'></div>
```

显示结果如下：

```html
hello Jhon
hello JiM
```

html的结构如下

```html
<hello1 info = 'Jhon'>
	<div>hello Jhon</div>
</hello1>
<div hello1 info='JiM'>
	<div>hello JiM</div>
</div>
```

### 1.5 replace  布尔型，**默认值为false**，设置为true的时候，表示可以用自定义的模板**内容的标签**替换自定义的**元素标签**。在上例子的基础上，变化如下，大家可以对比下上述两者html的结构的区别

```javascript
app.directive('hello1',function(){
  return {
    replace:true,
    template:function(ele,attr){
      console.log(arguments);
      return '<div>'+'hello '+attr.info+'</div>'
    }
  }
});
```

html结构

```html
<div hello1="" info="JiM">hello JiM</div>
<div info="Jhon">hello Jhon</div>
```

### 1.6 templateUrl **（字符串或者函数），可选参数，可以是**

（1）一个代表HTML文件路径的字符串

（2）一个函数，可接受两个参数tElement和tAttrs（大致同上）

1.6.1  templateUrl接受一个字符串

index.html页面中有如下代码

```html
<script type='text/ng-template' id='courage.html'>
//注意，模板文件的type属性必须是  ng-template ,表示以angular的规则进行模板的解析
    <p>that is awesome to learn more about IT </p>
</script>
```

我们可以定义一个指令

```javascript
app.directive('courage',function(){
  return {
    templateUrl:"courage.html",
    replace:true,
    restrict:'E'
  }
})
```

调用指令

```html
<conrage></conrage>
```

页面显示的html结构如下(注意restrict和replace属性的设置对于显示的影响)

```html
<p>this is awesome to learn more about IT </p>
```

1.6.2 templateUrl接受一个函数

index.html

```html
<body ng-app = 'myApp'>

<div ng-controller = 'myCtrl'>
    <p courage type='one'></p>
    <p courage type='two'></p>
</div>
<script src="../libs/angular.js"></script>
<script>
    var app = angular.module('myApp',[]);
    app.controller('myCtrl',['$scope',function($scope){
        $scope.info = {
            name : 'Jhon',
            age  : '19'
        }
    }])
    app.directive('courage',function(){
        return {
            templateUrl : function(ele,attr){
                console.log(arguments);
                return 'courage'+ attr.type+'.html';

            }
        }
    })
</script>
</body>
```

courageone.html

```html
<body>
<p>this is courage1:`{{info.name}}`</p>
</body>
```

couragetwo.html

```html
<body>
<p>this is courage2:`{{info.age}}`</p>
</body>
```

### 1.7 scope **默认值是false**

false表示继承父作用域的值，**且不进行隔离**，子作用域和父作用域的改变都将影响变量的值；

true表示继承父作用域的值，但是进行隔离，这种效果和设置两个控制器的效果是一样的；

`{}`：没有继承父亲的值，所以儿子的值为空，改变任何一方的值都不会影响另一方，这就是不继承且隔离;

当想要创建一个可重用的组件时，隔离作用域是一个很好的选择，通过隔离作用域，我们可以确保指令是独立的，并且可以轻松的插入到任何HTML APP中，并且这种做法防止了父作用域被污染。

先来看下作用域，我们知道，每定义一个控制器就会形成一个scope对象，该对象可以表示一个作用域，并且继承了父作用域的数据；我们从下面的例子可以改变输入的名字，

* 子作用域继承了父作用域的变量
* 子作用域和父作用域的变量的改变是相互独立的，也就是说子作用域是继承且隔离的

1.7.1 先来看下controller控制器下面的作用的效果，子作用域和父作用域是继承且隔离的效果，子作用域的变量的变化不会污染到父作用域；

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="angular.js"></script>
</head>
<body ng-app = 'app'>
<div ng-controller = 'parent' >
    <input type="text" ng-model = 'name' placeholder='please input your name'/>
    parent:`{{name}}`
    age:`{{age}}`

    <div ng-controller = 'child'>
        <input type="text" ng-model = 'name' placeholder='please input your name'/>
        child:`{{name}}`
        age :`{{age}}`
    </div>
</div>

<script>
    var app = angular.module('app',[]);
    app.controller('parent',['$scope',function($scope){
        $scope.name = "Jhon";
        $scope.age = 19 ;
    }]);
    app.controller('child',['$scope',function($scope){
        $scope.name = "JiM";
    }]);

    //这种情势下的scope作用域是继承且隔离的，子作用域内的变量的改变不会对父作用域内的变量有任何的影响
</script>

</body>
</html>
```

1.7.2 再来看下我们自定义directive的时候的scope不同的设置情况的效果

false的情况(或者没有设置的时候默认的情况)，子作用域会污染父作用域的变量，**继承且不隔离**

true的情况，和1.7.1controller的效果一样，**继承且隔离**，这种情况下也就是一般的原型继承的情况

`{ }` 的情况，表示**不继承且隔离**

```html
<body ng-app = 'app'>
<div ng-controller = 'parent' >
    <input type="text" ng-model = 'name'/>
    parent:`{{name}}`

    <child></child>

</div>

<script>
    var app = angular.module('app',[]);
    app.controller('parent',['$scope',function($scope){
        $scope.name = "Jhon";
    }]);
    app.directive('child',function(){
       return {
           replace:true ,//默认值是false
           restrict:'EA',
           scope:false,
           template:''+
           '<div>'+
                '<input type="text" ng-model = "name"/>'+
                `'child:{{name}}'`+
           '</div>'
       }
    });

    //这种情势下的scope作用域是继承且隔离的，子作用域内的变量的改变不会对父作用域内的变量有任何的影响
</script>
</body>
```

1.7.3  当我们将scope设置为{ }  的时候，此时子作用域无法再访问父作用域的变量值，这个时候需要我们做出一些调整，让子作用域可以访问父作用域的变量，但是不会污染父作用域

* 采用 @ 进行单向绑定，也就是说，改变父作用域的name的值，directive里面的name也会改变，但是改变隔离区directive里面的name,父作用域里面的name是不会发生改变的;也就是达到**继承且隔离**的效果

```html
<body ng-app = 'app'>
<div ng-controller = 'parent' >
    <input type="text" ng-model = 'name'/>
    parent:`{{name}}`

    <!--<child name="{{name}}"></child>-->
    <child your-name=`"{{name}}"`></child>

</div>

<script>
    var app = angular.module('app',[]);
    app.controller('parent',['$scope',function($scope){
        $scope.name = "Jhon";
    }]);
    app.directive('child',function(){
        return {
            replace:true ,//默认值是false
            restrict:'EA',
            scope:{
              //如果绑定的隔离作用域属性名与元素的属性名相同，则可以采用缺省写法
//                name:'@'   //对应<child name="{{name}}"></child> 
                name:"@yourName"
            },
            template:''+
            '<div>'+
            '<input type="text" ng-model = "name"/>'+
            `'child:{{name}}'`+
            '</div>'
        }
    });
    //这种情势下的scope作用域是继承且隔离的，子作用域内的变量的改变不会对父作用域内的变量有任何的影响
</script>

</body>
```

此时template生成的html结构如下

```html
<div your-name="Jhon" class="ng-binding ng-isolate-scope">
  	<input type="text" ng-model="name" class="ng-valid ng-not-empty ng-dirty ng-touched">child:Jhon
</div>
```

```javascript
//我们可以大致的模拟下ng-controller的实现原理
app.directive("myController", function(){    
  return {        
    scope: true,   //scope设置为true，     
    controller: '@'   
  }});
```



* 采用 = 进行双向绑定，也就是说，改变父作用域的name的值，directive里面的name也会改变，同样改变隔离区directive里面的name,父作用域里面的name是也会发生改变的;此时达到了 **继承且不隔离**的效果

```html
<body ng-app = 'app'>
<div ng-controller = 'parent' >
    <input type="text" ng-model = 'name'/>
    parent:`{{name}}`

    <child name="name"></child>

    <!--需要注意的一点是和<child name="{{name}}"></child>的写法不同，不然效果出不来-->
</div>

<script>
    var app = angular.module('app',[]);
    app.controller('parent',['$scope',function($scope){
        $scope.name = "Jhon";
    }]);
    app.directive('child',function(){
        return {
            replace:true ,//默认值是false
            restrict:'EA',
            scope:{
//
                name:'='
            },
            template:''+
            '<div>'+
            '<input type="text" ng-model = "name"/>'+
            `'child:{{name}}'`+
            '</div>'
        }
    });

    //这种情势下的scope作用域是继承且隔离的，子作用域内的变量的改变不会对父作用域内的变量有任何的影响
</script>

</body>
```

此时template生成的html结构如下

```html
<div name="name" class="ng-binding ng-isolate-scope">
  	<input type="text" ng-model="name" class="ng-valid ng-not-empty ng-dirty ng-touched ng-valid-parse">child:Jhon
</div>
```

上面这个栗子当时选择的不好，关于name容易混淆，这里在写一个清晰一点的

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body ng-app = 'myApp'>

<div ng-controller = 'stuInfoCtrl'>
    <stu-info info = 'jhon'></stu-info>
    <stu-info info = 'merry'></stu-info>
</div>
<script src="../libs/angular.js"></script>

<script>
    var app = angular.module('myApp',[]);
    app.controller('stuInfoCtrl',['$scope',function($scope){
        $scope.jhon = {
            name : "Jhon",
            age  : 17
        }

        $scope.merry = {
            name : "merry",
            age  : 18
        }

    }]);

    app.directive('stuInfo',function(){
        return {
            restrict : 'E',
            // = 号表示继承父作用域变量，通过这种方式可以将controller中的scope中的属性Jhon merry传递给给info属性,然后可以这里理解: isoleStuInfo = info = $scope.jack
            scope :{
                isoleStuInfo : '=info'
            },

            template : '<div>stuName:`{{isoleStuInfo.name}}`</div><div>stuAge:`{{isoleStuInfo.age}}`</div>'
        }
    })
</script>
</body>
</html>
```

通过以上示例我们这样可以将字符串或者一个对象传入isolate scope中

### 1.8  transclude属性  表明自定义的指令是否可以被嵌入，配合ng-transclude指令使用

 transclude是一个可选的参数。如果设置了,其值必须为true,它的默认值是false。我们可以将整个模板,包括其中的指令通过嵌入全部传入一个指令中。这样做可以将任意内 容和作用域传递给指令。transclude参数就是用来实现这个目的的,指令的内部可以访问外部 指令的作用域,并且模板也可以访问外部的作用域对象。 为了将作用域传递进去,scope参数的值必须通过{}或true设置成隔离作用域。如果没有设 置scope参数,那么指令内部的作用域将被设置为传入模板的作用域

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body ng-app = 'myApp'>

<div ng-controller = 'stuInfoCtrl'>
    <p>this is Jhon</p>
    <stu-info  ng-transclude>
        <div>原来的内容jhon</div>
        <p>`{{jhon.name}}`</p>
    </stu-info>
    <p>this is merry</p>
    <stu-info ng-transclude>
        <div>原来的内容merry</div>
        <p>`{{merry.name}}`</p>
    </stu-info>
</div>
<script src="../libs/angular.js"></script>
<script>
    var app = angular.module('myApp',[]);
    app.controller('stuInfoCtrl',['$scope',function($scope){
        $scope.jhon = {
            name : "Jhon",
            age  : 17
        }
        $scope.merry = {
            name : "merry",
            age  : 18
        }
    }]);

    app.directive('stuInfo',function(){
        return {
            restrict : 'E',
            // = 号表示继承父作用域变量，通过这种方式可以将scope中的属性传递给给info属性的方式
             transclude : true ,
            scope:{},
            template : '<div>模板的内容</div>'
        }
    })
</script>
</body>
</html>
```

控制台最终的结果如下:

```html
this is Jhon

模板的内容
原来的内容jhon
Jhon

this is merry

模板的内容
原来的内容merry
merry
```





