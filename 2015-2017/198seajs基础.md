---
title:  seajs基础
date: 2017-04-26 12:36:00
categories: seajs
tags : seajs
comments : true 
updated : 
layout : 
---

## 模块标识

模块标识是一个字符串，用来标识模块。在 require、 require.async 等加载函数中，第一个参数都是模块标识。

* 顶级标识始终相对 base 基础路径解析。
* 绝对路径和根路径始终相对当前页面解析。

```

Sea.js 中的模块标识是 CommonJS 模块标识 的超集:

一个模块标识由斜线（/）分隔的多项组成。
每一项必须是小驼峰字符串、 . 或 .. 。
模块标识可以不包含文件后缀名，比如 .js 。
模块标识可以是 相对 或 顶级 标识。如果第一项是 . 或 ..，则该模块标识是相对标识。
顶级标识根据模块系统的基础路径来解析。
相对标识相对 require 所在模块的路径来解析。
注意，符合上述规范的标识肯定是 Sea.js 的模块标识，但 Sea.js 能识别的模块标识不需要完全符合以上规范。 比如，除了大小写字母组成的小驼峰字符串，Sea.js 的模块标识字符串还可以包含下划线（_）和连字符（-）， 甚至可以是 http://、https://、file:/// 等协议开头的绝对路径。

相对标识

相对标识以 . 开头，只出现在模块环境中（define 的 factory 方法里面）。相对标识永远相对当前模块的 URI 来解析：

// 在 http://example.com/js/a.js 的 factory 中：
require.resolve('./b');
  // => http://example.com/js/b.js

// 在 http://example.com/js/a.js 的 factory 中：
require.resolve('../c');
  // => http://example.com/c.js
顶级标识

顶级标识不以点（.）或斜线（/）开始， 会相对模块系统的基础路径（即 Sea.js 的 base 路径）来解析：

// 假设 base 路径是：http://example.com/assets/

// 在模块代码里：
require.resolve('gallery/jquery/1.9.1/jquery');
  // => http://example.com/assets/gallery/jquery/1.9.1/jquery.js
模块系统的基础路径即 base 的默认值，与 sea.js 的访问路径相关：

如果 sea.js 的访问路径是：
  http://example.com/assets/sea.js

则 base 路径为：
  http://example.com/assets/
当 sea.js 的访问路径中含有版本号时，base 不会包含 seajs/x.y.z 字串。 当 sea.js 有多个版本时，这样会很方便。

如果 sea.js 的路径是：
  http://example.com/assets/seajs/1.0.0/sea.js

则 base 路径是：
  http://example.com/assets/
当然，也可以手工配置 base 路径：

seajs.config({
  base: 'http://code.jquery.com/'
});

// 在模块代码里：
require.resolve('jquery');
  // => http://code.jquery.com/jquery.js
普通路径

除了相对和顶级标识之外的标识都是普通路径。普通路径的解析规则，和 HTML 代码中的 <script src="..."></script> 一样，会相对当前页面解析。

// 假设当前页面是 http://example.com/path/to/page/index.html

// 绝对路径是普通路径：
require.resolve('http://cdn.com/js/a');
  // => http://cdn.com/js/a.js

// 根路径是普通路径：
require.resolve('/js/b');
  // => http://example.com/js/b.js

// use 中的相对路径始终是普通路径：
seajs.use('./c');
  // => 加载的是 http://example.com/path/to/page/c.js

seajs.use('../d');
  // => 加载的是 http://example.com/path/to/d.js
提示：

顶级标识始终相对 base 基础路径解析。
绝对路径和根路径始终相对当前页面解析。
require 和 require.async 中的相对路径相对当前模块路径来解析。
seajs.use 中的相对路径始终相对当前页面来解析。
文件后缀的自动添加规则

Sea.js 在解析模块标识时， 除非在路径中有问号（?）或最后一个字符是井号（#），否则都会自动添加 JS 扩展名（.js）。如果不想自动添加扩展名，可以在路径末尾加上井号（#）。

// ".js" 后缀可以省略：
require.resolve('http://example.com/js/a');
require.resolve('http://example.com/js/a.js');
  // => http://example.com/js/a.js

// ".css" 后缀不可省略：
require.resolve('http://example.com/css/a.css');
  // => http://example.com/css/a.css

// 当路径中有问号（"?"）时，不会自动添加后缀：
require.resolve('http://example.com/js/a.json?callback=define');
  // => http://example.com/js/a.json?callback=define

// 当路径以井号（"#"）结尾时，不会自动添加后缀，且在解析时，会自动去掉井号：
require.resolve('http://example.com/js/a.json#');
  // => http://example.com/js/a.json
```

## 1 seajs.use   用来加载一个模块 

加载的模块中的代码会被执行,所以加载的模块暴露出来的方法都可以使用;

```javascript
seajs.use(id, callback?)
// 加载一个模块
seajs.use('./a');

// 加载一个模块，在加载完成时，执行回调
seajs.use('./a', function(a) {
  a.doSomething();
});

// 加载多个模块，在加载完成时，执行回调
seajs.use(['./a', './b'], function(a, b) {
  a.doSomething();
  b.doSomething();
});
```

注意：seajs.use 与 DOM ready 事件没有任何关系。如果某些操作要确保在 DOM ready 后执行，需要使用 jquery 等类库来保证。比如

```javascript
seajs.use(['jquery', './main'], function($, main) {
    $(document).ready(function() {
        main.init();
    });
});
```

```
seajs.use("abc/main");  //导入seajs.js同级的abc文件夹下的main.js模块的（后缀名可略去不写）.因为这是顶级标识
```

##2 [seajs.config]()`Object`

所谓的配置文件可以理解为对模块标识的一个变量表示,进行简化模块标识的操作;

### baseUrl `object`

```javascript
seajs.config({
	// Sea.js 的基础路径（修改这个就不是路径就不是相对于seajs文件了）
	base: 'http://example.com/path/to/base/'
});
```

### [alias]()`Object`

别名配置，配置之后可在模块中使用require调用 `require('jquery');` 

用变量表示**文件**，解决路径层级过深和实现路径映射

```
seajs.config({
    alias: { 'jquery': 'jquery/jquery/1.10.1/jquery' }
});
```

```
define(function(require, exports, module) {
    //引用jQuery模块
    var $ = require('jquery');
});
```

### [paths]()`Object`

设置路径，方便跨目录调用。通过灵活的设置path可以在不影响`base`的情况下指定到某个目录。

（用变量表示**路径**，解决路径层级过深的问题）

```
seajs.config({
    //设置路径
    paths: {
        'gallery': 'https://a.alipayobjects.com/gallery'
    },

    // 设置别名，方便调用
    alias: {
        'underscore': 'gallery/underscore'
    }
});
```

```
define(function(require, exports, module) {
    var _ = require('underscore');
     //=> 加载的是 https://a.alipayobjects.com/gallery/underscore.js
});

```

### [vars]()`Object`

变量配置。有些场景下，模块路径在运行时才能确定，这时可以使用 `vars` 变量来配置。

`vars` 配置的是模块标识中的变量值，在模块标识中用 `{key}` 来表示变量。

```
seajs.config({
    // 变量配置
    vars: {
        'locale': 'zh-cn'
    }
});
```

```
define(function(require, exports, module) {
  var lang = require('./i18n/{locale}.js');
     //=> 加载的是 path/to/i18n/zh-cn.js
});

```

### [map]()`Array`

该配置可对模块路径进行映射修改，可用于路径转换、在线调试等。

```
seajs.config({
    map: [
        [ '.js', '-debug.js' ]
    ]
});
```

```
define(function(require, exports, module) {
    var a = require('./a');
    //=> 加载的是 path/to/a-debug.js
});
```

### [preload]()`Array`

使用`preload`配置项，可以在普通模块加载前，提前加载并初始化好指定模块。

`preload`中的空字符串会被忽略掉。

```
// 在老浏览器中，提前加载好 ES5 和 json 模块
seajs.config({
    preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
    ]
});
```

注意：`preload`中的配置，需要等到 use 时才加载。比如：

```
seajs.config({
    preload: 'a'
});

// 在加载 b 之前，会确保模块 a 已经加载并执行好
seajs.use('./b');
```

preload 配置不能放在模块文件里面：

```
seajs.config({
    preload: 'a'
});

define(function(require, exports) {
    // 此处执行时，不能保证模块 a 已经加载并执行好
});
```

### [debug]()`Boolean`

值为`true`时，加载器不会删除动态插入的 script 标签。插件也可以根据`debug`配置，来决策 log 等信息的输出。

### [base]()`String`

Sea.js 在解析顶级标识时，会相对 base 路径来解析。

注意：一般请不要配置 base 路径，把 sea.js 放在合适的路径往往更简单一致。

### [charset]()`String | Function`

获取模块文件时，<script> 或 <link> 标签的`charset`属性。 默认是`utf-8`

`charset`还可以是一个函数：

```
seajs.config({
    charset: function(url) {
        // xxx 目录下的文件用 gbk 编码加载
        if (url.indexOf('http://example.com/js/xxx') === 0) {
          return 'gbk';
        }

        // 其他文件用 utf-8 编码
        return 'utf-8';
    }
});
```
```javascript
seajs.config({
	// Sea.js 的基础路径（修改这个就不是路径就不是相对于seajs文件了）
	base: 'http://example.com/path/to/base/',
	// 别名配置（用变量表示文件，解决路径层级过深和实现路径映射）
	alias: {
		'es5-safe': 'gallery/es5-safe/0.9.3/es5-safe',
		'json': 'gallery/json/1.0.2/json',
		'jquery': 'jquery/jquery/1.10.1/jquery'
	},
	// 路径配置（用变量表示路径，解决路径层级过深的问题）
	paths: {
		'gallery': 'https://a.alipayobjects.com/gallery'
	}
});
```

## 3 模块的定义

```javascript
define(factory) //define 是一个全局函数，用来定义模块。
```

```javascript
define 接受 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串。

factory 为对象、字符串时，表示模块的接口就是该对象、字符串。比如可以如下定义一个 JSON 数据模块：

define({ "foo": "bar" });
也可以通过字符串定义模板模块：

define('I am a template. My name is {{name}}.');
factory 为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。factory 方法在执行时，默认会传入三个参数：require、exports 和 module：

define(function(require, exports, module) {

  // 模块代码

});
define define(id?, deps?, factory)

define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖。比如：

define('hello', ['jquery'], function(require, exports, module) {

  // 模块代码

});
id 和 deps 参数可以省略。省略时，可以通过构建工具自动生成。
```



```javascript
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

  // 通过 require 引入依赖
  var $ = require('jquery');
  var Spinning = require('./spinning');

  // 通过 exports 对外提供接口
  exports.doSomething = ...

  // 或者通过 module.exports 提供整个接口
  module.exports = ...

});
```

## 4 关于模块标识和路径问题

### [常见问题]()

### [关于模块标识]()

Seajs模块标识主要以`小驼峰字符串`、`.`或`..`

```
// 在 http://example.com/js/a.js 的 factory 中：
require.resolve('./b');
  // => http://example.com/js/b.js

// 在 http://example.com/js/a.js 的 factory 中：
require.resolve('../c');
  // => http://example.com/c.js
```

分为 **相对** 与 **顶级** 标识。以`.`或`..`开头，则为相对标识 。以`小驼峰字符串`开关，则为顶级标识。

```
// 假设 base 路径是：http://example.com/assets/

// 在模块代码里：
require.resolve('gallery/jquery/1.9.1/jquery');
  // => http://example.com/assets/gallery/jquery/1.9.1/jquery.js
```

### [关于路径]()

Seajs除了相对与顶级标识之外，还可以使用普通路径来加载模块。

就到当前页面的脚本分析（可以右键查看源码）

```
//sea.js的路径，即 base 路径，相对于当前页面
<script src="http://yslove.net/actjs/assets/sea-modules/seajs/2.1.1/sj.js"></script>

<script type="text/javascript">
//配置Seajs
seajs.config({
    alias: {
        //顶级标识，基于 base 路径
        'actjs': 'actjs/core/0.0.7/core.js',
            // => http://
        'position': 'actjs/util/0.0.2/position.js'
    }
});

seajs.config({
    alias: {
        //普通路径，相对于当前页面
        'affix': '../../actjs/assets/widget/src/widget-affix.js',

        //相对标识，相对于当前页面
        'init': './src/init.js'
    }
});
</script>
```

## 5 其他函数

### [seajs.reslove]( )`Function`

类似`require.resolve`，会利用模块系统的内部机制对传入的字符串参数进行路径解析。

```
seajs.resolve('jquery');
// => http://path/to/jquery.js

seajs.resolve('./a', 'http://example.com/to/b.js');
// => http://example.com/to/a.js
                        
```

seajs.resolve 方法不光可以用来调试路径解析是否正确，还可以用在插件开发环境中。







 



[seajs简易文档](http://yslove.net/seajs/)

[CMD语法规范](https://github.com/seajs/seajs/issues/242)