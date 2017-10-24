---
title:  seajs核心
date: 2017-04-27 12:36:00
categories: seajs
tags : seajs
comments : true 
updated : 
layout : 
---

**研究下seajs到底是什么**

seajs模块化的理念就是,每一个js文件都是一个单独的模块,模块中的变量,方法不能被外部访问,有效的防治了全局变量的污染;如果想要被外部文件访问,需要通过exports导出;(基本的原理还是立即执行函数的封装以及闭包的使用)

文件目录结构

```
F:
	workspace
		sea.js
		seajsTest
			index.html
			main.js
			module.js			
```

###1 seajs全局函数

index.html

```html
<body>
    <script src='../sea.js'></script>;
    <script>
        console.log(seajs);
      	console.log(define);//define是一个全局函数
      	//consolelog(require);//报错,require不是全局函数,这点记住       
    </script>
</body>
```

控制台输出如下

```
// console.log(seajs);
Object
Module:function t(a,b)
cache:Object
config:function (a)
data:Object
emit:function (a,b)
off:function (a,b)
on:function (a,b)
request:function o(a,b,c,d)
require:function (a)
resolve:function m(a,b)
use:function (a,b)
version:"2.2.3"
```

```
console.log(define)
function (a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!f.uri&&M.attachEvent){var g=r();g&&(f.uri=g.…
```

### 2 seajs.use()

index.html

```html
 <script src='../sea.js'></script>;
    <script>
        // seajs.use('./main.js');
        // console.log(foo);//报错,这就是模块化的理念
        

        seajs.use(['./main.js','./module'],function(){
            console.log('callback is exec');
            console.log(arguments);
              
        });
        // console.log(seajs);
        // console.log(define);
        
    </script>
```

main.js

```javascript
define(function(require,exports,module){
    console.log(arguments);
    console.log('main.js was loaded');
    
    var foo = 'Jhon'

    exports.foo = 'bar';
    exports.myFunc = function(){
        console.log('this is a func from main.js');
        
    }
})
```

module.js

```javascript
define(function(require,exports,module){
    exports.mod = 'baz';
    console.log('module.js is exec');
    
})
```

seajs.use会按顺序加载模块,先加载main.js,那么main.js就会被执行,然后加载module.js,module.js就会被执行,等两者加载完毕之后,就会执行回调函数;回调函数中接受参数,参数是每个模块导出的exports对象;如果没有导出exports对象,那么回调函数中对应的参数是null

seajs如何判断模块的加载是否完成的呢?其实底层也是封装了script标签的onload事件,加载完毕之后触发该事件,然后执行回调函数;

针对上面的代码分析下控制台的输出

```
//main.js输出
[function, Object, t, callee: function, Symbol(Symbol.iterator): function]
0: function a(b)
	async: function (b,c)
	resolve:function (a)
1:Object
	foo : 'bar',
	myFunc : function(){}
2: t 
	dependencies:Array(0)
	exports:Object
	id : 
	uri : 
	status :
    
//以上是define(factory)中factory的三个参数解析
main.js was loaded
//module.js输出
module.js is exec
//index.html 中seajs.use回调函数输出
callback is exec
//以下是seajs.use回调函数中传入的参数,可以看出来是每个模块导出的对象 exports 
[Object, Object, callee: function, Symbol(Symbol.iterator): function]0: Object1: Objectcallee: function ()length: 2Symbol(Symbol.iterator): function values()__proto__: Object
```

### 3 接下来解释下factory中三个参数

```javascript
define(function(require,exports,module){
  
})
```

```
[function, Object, t, callee: function, Symbol(Symbol.iterator): function]
0: function a(b)
	async: function (b,c)
	resolve:function (a)
1:Object
	foo : 'bar',
	myFunc : function(){}
2: t 
	dependencies:Array(0)
	exports:Object
	id : 
	uri : 
	status :
    
```

3.1 require方法解析

* require(a) 是一个方法 ,接受模块标识作为  **唯一的参数**,
  * 如果require的模块有exports对象返回,返回的是a模块的exports对象;
  * 如果require的模块没有返回exports对象返回,那么默认返回null
  * 引入的模块定义的方法可以使用,比如引入jquery等类库
* require.sync(a,callback) 是一个方法,接受**两个参数**,一个是模块标识,一个是回调函数,异步执行;
* require.resolve(a)  该函数不会加载模块，只返回解析后的绝对路径。

```javascript
define(function(require,exports,module){
    exports.mod = 'baz';
    console.log('module.js is exec');
    require('./jquery-1.12.4.js');//相当于script标签在该模块中引入jquer库
    console.log($);  
  /*
  function ( selector, context ) { }
  */
})
```

3.1.1 当模块标识为顶级标识的时候:(不以  .  开头  或者不以    /  开头);require(a)路径的解析是以seajs文件所在目录为基准

```javascript
//main.js
define(function(require,exports,module){
    console.log(arguments);
    console.log('main.js was loaded');
    
    var foo = 'Jhon'
    var retMain = require('module.js');
    console.log(require.resolve('module'));
    //file:///F:/workspace/module.js
    //可以看出顶级模块标识是以seajs文件所在目录为基准进行解析的
   
    exports.foo = 'bar';
    exports.myFunc = function(){
        console.log('this is a func from main.js');
        
    }
})
```

3.1.2 当模块标识为相对标识的时候(以  .  开头,则该模块标识就是相对标识),  **相对标识路径解析的时候,永远是相对于当前模块而言** ;出现在define的factory函数中require函数的参数中

```javascript
define(function(require,exports,module){
    console.log(arguments);
    console.log('main.js was loaded');
    
    var foo = 'Jhon'
     var retMain = require('./module.js');
     console.log(retMain);//Object {mod: "baz"}
     
    console.log(require.resolve('./module'));
    //file:///F:/workspace//seajsTest/module.js
    exports.foo = 'bar';
    exports.myFunc = function(){
        console.log('this is a func from main.js');
        
    }
})
```

3.2 exports对象解析   **exports对象是module.exports对象的引用,而模块真正导出的是module.exports**

当我们在定义模块的时候

```javascript
define(function(require, exports) {

  // 错误用法！！!
  exports = {
    foo: 'bar',
    doSomething: function() {}
  };

});
```

对象并不会被导出,因为改变了exports的引用,所以导出的module.exports 是没有数据的

```javascript
define(function(require, exports, module) {

  // 正确写法
  module.exports = {
    foo: 'bar',
    doSomething: function() {}
  };

});
```

3.3 module 对象

* module.id  

```javascript
define('id', [], function(require, exports, module) {

  // 模块代码

});
```

* module.uri   根据模块系统的路径解析规则得到的模块绝对路径。

  一般情况下在没有写define中的id参数的时候,两者完全一样;

* module.dependencies Array 是一个数组,表示当前模块的依赖

* module.exports

  当前模块对外提供的接口。

  传给 `factory` 构造方法的 `exports` 参数是 `module.exports` 对象的一个引用。只通过 `exports` 参数来提供接口，有时无法满足开发者的所有需求。 比如当模块的接口是某个类的实例时，需要通过 `module.exports`来实现：

  ```
  define(function(require, exports, module) {

    // exports 是 module.exports 的一个引用
    console.log(module.exports === exports); // true

    // 重新给 module.exports 赋值
    module.exports = new SomeClass();

    // exports 不再等于 module.exports
    console.log(module.exports === exports); // false

  });
  ```

  ### 4 seajs.use   require    二者引用模块规则   

  * 当引用的模块是顶级标识的时候,那么就是相对于seajs文件所在目录为基准
  * 当引用模块是相对标识的时候,那么就是相对于seajs.use   requre所在html文件目录为基准;

  ```
  F:
  	workspace
  		sea.js
  		seajsTest
  			index.html
  			main.js
  			module.js
  			module2.js
               seajsConfig.js
  ```

  seajsConfig.js

  ```javascript
  seajs.config({
      alias : {
          // mod2 : 'seajsTest/module2' //这是顶级标识,引用文件的时候会相对于seajs文件所在目录
          mod2 : './module2'  //这是相对路径,引用文件的时候会相对于当前文件或者当前模块所在目录
      }
  })
  ```

  index.html

  此时在index.html中通过别名引用模块module2.js 可以通过别名 mod2来引用

  **注意如果引用模块有exports对象内容,那么回调函数传入的参数就是exports对象,如果没有,那么传入的是null**

  ```html
  <script src='../sea.js'></script>;
      <script src='./seajsconfig.js'></script>;
      <script>
          seajs.use(['./main.js','./module','mod2'],function(){
              console.log('callback is exec');
              console.log(arguments);
                
          });
          console.log(seajs);
          // console.log(define);
          
      </script>
  ```

  ### 5 模块路径

  - 相对标识：以 . 开头（包括.和..），相对标识永远相对当前模块的 URI 来解析。
  - 顶级标识：不以点（.）或斜线（/）开始， 会相对模块系统的基础路径（即 SeaJS配置 的 base 路径）来解析
  - 普通路径：除了相对和顶级标识之外的标识都是普通路径，相对当前页面解析。
    - 绝对路径是普通路径。绝对路径比较容易理解。
    - 根路径是以“/”开头的，取当前页面的域名+根路径;
    - 相对路径以 ../   开头或者以   ./  开头的都是相对路径