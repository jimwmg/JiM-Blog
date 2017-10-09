---
title: require js 
date: 2016-09-10 12:36:00
categories:  javascript  
comments : true 
tags :  requirejs
updated : 
layout : 
---

1  函数调用的复杂性，在一个命名空间的概念下

```javascript
 //命名空间的概念下
    var M = M || {};
    M.m = M.m || {};//||找true运算，undefined返回false
    M.m.module1 = (function(){
//        some code here
        return {
            func1:function(){},
            func2:function(){}
        }
    })();
    M.m.module2 = (function(){
        //        some code here
        return {
            func1:function(){},
            func2:function(){}
        }
    })();

    //调用每个模块下面的方法，如果M 和 m更加长，那么调用起来是不是废了老劲了
    M.m.module1.func1();
    M.m.module1.func2();
    M.m.module2.func1();
    M.m.module2.func2();
```

2 导入一个公共接口，本着面向对象的思想在进行简化  对外开发一个接口  www.myexcute.com

```javascript
 //导入一个接口,就像导入jQuery一样
    (function($,module1){
        //some code here
        //jQuery的所有方法可以使用
        //$.extend
        //M.m.module1 接口所有的方法可以用
        module1.func1();//这种调用的方式比起上面的调用是不简化了不少
        module1.func2();
    })(jQuery, M.m.module1);

    (function($,module2){   
        //some code here
        //jQuery的所有方法可以使用
        //$.extend
        //M.m.module1 接口所有的方法可以用
        module2.func1();
        module2.func2();
    })(jQuery, M.m.module2);
```

虽然这个样子，代码冲突的可能性已经很小，但是代码依赖的问题，多脚本的管理、阻塞的问题，仍旧无法解决

3 此时require.js便初露头角

简单地说，有两点，一、模块作用域自成一体，不污染全局空间；二、模块指明依赖关系，并且依赖是通过参数传递的形式导入的，无需通过全局对象引用 – 依赖同样不污染全局空间。
定义模块

3.1 如何定义模块   

```javascript
define(id? , dependencies ? , factory) ; ?表示可选项
```

模块可以分为两种，第一种是无依赖的模块

```javascript
//math.js
define(function(){
    var add = function(a,b){
        return a+b;
    };
    return {
        add : add
    }
});
```

第二种是有依赖的模块 dependencies是一个数组形式的参数，factory函数接受的参数是依赖模块的返回值

```javascript
//getWidth.js文件
define(['jquery'],function($){  //jquery.js和getWidth.js在同一目录下
   var width = $(window).width();
    return width;
});
```

3.2 如何导入模块  require(['module1','module2' ],callback) 传入的依赖必须是一个数组形式存在的，callback是依赖传入完毕之后执行的逻辑;如果模块有返回值，则会直接传递给callback函数的形参，如果函数没有返回值，那么传递的callback形参的值是undefined      文件目录如下 

```
test 

- index.html
- js
  - require.js
  - jquery.js
  - main.js    //入口文件
  - getWidth.js
```

```javascript
//main.js  require请求的是模块的路径，因为使用了data-main属性，require默认访问路径是main.js所在目录，也就是js/
require(['getWidth','jquery'],function(ret){ //这里的jquery是引入的本地文件
    console.log(ret);
})
//等价于  js/getWidth.js      js/jquery.js
```

[关于requirejs的实现原理](http://www.tuicool.com/articles/uUrUzqr)

indx.html文件中引入requirejs

```html
<script src='require.js' data-main = "js/main">
```

加载requirejs脚本的script标签加入了data-main属性，这个属性指定的js将在加载完reuqire.js后处理，我们把require.config的配置加入到data-main后，就可以使每一个页面都使用这个配置，然后页面中就可以直接使用`require`来加载所有的短模块名

data-main还有一个重要的功能，当script标签指定data-main属性时，require会默认的将data-main指定的js为根路径，是什么意思呢？如上面的data-main="js/main"设定后，我们在使用require(['jquery'])后(不配置jquery的paths)，require会自动加载js/jquery.js这个文件，而不是jquery.js，相当于默认配置了：

data-main需要给所有的脚本文件设置一个根路径。根据这个根路径，RequireJS将会去加载所有相关的模块。下面的脚本是一个使用data-main例子：

```javascript
require.config({
    baseUrl : "js"
})
```

3.3 如果我们导入的文件是不符合require的规范或者导入文件来自本地服务器或者CDN或者其他的网站，这个时候上面的require方法就不能起作用了，这个时候我们需要配置文件的地址

```javascript
//配置函数require.config({})
baseUrl——用于加载模块的根路径。
paths——用于映射不存在根路径下面的模块路径。
shims——配置在脚本/模块外面并没有使用RequireJS的函数依赖并且初始化函数。假设underscore并没有使用  RequireJS定义，但是你还是想通过RequireJS来使用它，那么你就需要在配置中把它定义为一个shim。
deps——加载依赖关系数组
```

不符合规范 : 先来看一个简单的例子,文件目录如下

```
export

- index.html
- js
  - sayhello.js
  - main.js
  - require.js
```

```html
//index.html  加如下代码
<script src="js/require.js" data-main='js/main'></script>
```

```javascript
//sayhello.js
function hello(){
    console.log("hello handsome you");
}
```

```javascript
//main.js 
require.config({
    paths : {
        h : 'sayhello'   //模块h的路径是js/hello.js   因为data-main属性的作用
    },
    shim : {
        h :{ exports : 'hello'}  //将hello函数暴露出去;如果少了这行代码会报错
    }
})
require(['h'],function(hello){
    hello();
})
```

上面代码 exports: 'hello'中的 hello，是我们在 hello.js 中定义的 hello 函数。当我们使用 function hello() {} 的方式定义一个函数的时候，它就是全局可用的。如果我们选择了把它 export给requirejs，那当我们的代码依赖于 hello 模块的时候，就可以拿到这个 hello 函数的引用了。

所以： exports 可以把某个非requirejs方式的代码中的某一个全局变量暴露出去，当作该模块以引用。

3.3.1 假如我想暴露多个sayhello.js中的全局变量呢？

```javascript
//sayhello.js
function hello(){
    console.log("hello handsome you");
}
function hello1(){
    console.log("hello1 handsome you");
}
```

这个时候main.js不能再用export了，应该使用init来初始化这些接口

```javascript
require.config({
    paths : {
        h : 'sayhello' 
    },
    //shim : {
    //    h :{ exports : 'hello'}
    //}
    shim : {
        h :{ init: function() {
            return {
                h0: hello,
                h1: hello1
            }
        }}
    }
})
require(['h'],function(he){
    console.log(arguments);
    he.h0()
    he.h1()
})
```

3.3.2 导入外部服务器的文件，requirejs支持跨域

```javascript
require.config({
    paths : {
        "jq" : ["http://libs.baidu.com/jquery/2.0.3/jquery"],
        "a" : "js/a"   
    }
})
//配置完之后，下面可以引用jquery模块
require(["jq","a"],function(){
  //在这里面可以直接使用jquery的所有API
    $(function(){
        alert("load finished");  
    })
})
```

3.4 如何引入第三方不不符合AMD规范的模块呢？这个时候需要进行配置

```javascript
require.config({
  shim:{
    'underscore':{
      exports:"_";
    }
  }
});
//配置之后，我们就可以在其他模块中引入underscore模块了
require('underscore',function(_){
   _.each([1,2,3], alert);
});
```

3.5 如何引入第三方不符合AMD规范的插件

```javascript
require.config({
    shim: {
        "underscore" : {
            exports : "_";
        },
        "jquery.form" : {
            deps : ["jquery"]
        }
    }
});
//
```

4 requirejs优势

4.1并行加载

    我们知道，`<script></script>` 标签会阻塞页面，加载 a.js 时，后面的所有文件都得等它加载完成并执行结束后才能开始加载、执行。而 require.js 的模块可以并行下载，没有依赖关系的模块还可以并行执行，大大加快页面访问速度。

4.2 不愁依赖

    在我们定义模块的时候，我们就已经决定好模块的依赖 – c 依赖 b，b 又依赖 a。当我想用 c 模块的功能时，我只要在 require函数的依赖里指定 c：

    require(['c'], function(c) {...});

    至于 c 依赖的模块，c 依赖的模块的依赖模块… 等等，require.js 会帮我们打理

 4.3  减少全局冲突

    通过 define 的方式，我们大量减少了全局变量，这样代码冲突的概率就极小极小 – JavaScript 界有句话说，全局变量是魔鬼，想想，我们能减少魔鬼的数量，我想是件好事。

关于全局变量

有一点需要说明的是，require.js 环境中并不是只有 define 和 require 几个全局变量。许多库都会向全局环境中暴露变量，以 jQuery 为例，1.7版本后，它虽然注册自己为 AMD 模块，但同时也向全局环境中暴露了 jQuery 与 $。所以以下代码中，虽然我们没有向回调函数传入一份引用，jQuery/$ 同样是存在的：

