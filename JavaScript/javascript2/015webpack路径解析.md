---
title: webpack如何默认解析模块？
date: 2017-08-18
categories: webpack
tags: resolve
---

### 1 webpack在现在大前端的工程化进程中扮演着越来越重要的角色

假如你已经了解webpack一些基本的知识，以及模块化的一些基本知识。

* 当我们在一个模块中引用另外一个模块的时候
* webpack打包这些模块的时候，其默认的解析规则是如何的？

### 2 webpack配置文件解析

* [first of all,先知道模块是什么](https://doc.webpack-china.org/concepts/modules/)
* [第一步，首先了解webpack模块解析规则](https://doc.webpack-china.org/concepts/module-resolution/)
* [第二步，了解webpack模块解析具体细节，默认配置](https://doc.webpack-china.org/configuration/resolve/)



webpack在打包的过程中：

* 首先确认导入模块的的解析路径（第一步）

* 再次判断模块的解析路径指向的是 ：  文件   还是   文件夹（目录）

* 如果路径指向的是一个文件
  * 假如路径具有文件扩展名，则直接讲文件打包
  * 假如路径不具有文件扩展名，此时使用webpack.config中resolve对象的resolve.extensions 配置的扩展名来解析

* 如果路径指向一个文件夹，则采取以下步骤找到具有正确扩展名的正确文件：
  - 如果文件夹中包含 `package.json` 文件，则按照顺序查找 [`resolve.mainFields`](https://doc.webpack-china.org/configuration/resolve/#resolve-mainfields) 配置选项中指定的字段。并且 `package.json` 中的第一个这样的字段确定文件路径。
  - 如果 `package.json` 文件不存在或者 `package.json` 文件中的 main 字段没有返回一个有效路径，则按照顺序查找 [`resolve.mainFiles`](https://doc.webpack-china.org/configuration/resolve/#resolve-mainfiles) 配置选项中指定的文件名，看是否能在 import/require 目录下匹配到一个存在的文件名。
  - 文件扩展名通过 `resolve.extensions` 选项采用类似的方法进行解析。

* 找到模块对应的资源之后如何处理这些模块呢？

  这个时候就需要配置webpack.config中的module对象，根据不同的模块确定不同的解析规则。

  ​

```javascript
module.export = {
    //入口文件，文件从这里开始打包执行，简单规则，SPA应用，一个入口文件，MPA多页应用，多个入口文件
    entry : APP_PATH ,
    //指示在哪里输出你的bundle，assert等文件
    output: {
        path:BUILD_PATH,
        filename:'js/bundle.js'
    },
    //module这些选项决定webpack在处理模块的时候，如何处理这些模块
    module :{
        //rules 创建模块的时候，匹配对应的规则数组--根据对应的规则，这些规则可以对匹配到的不同模块应用不同的loader或者解析器parser.
        rules:[
            {
                test:/.(js|jsx)$/,
                loader:'babel-loader',
                exclude:'node_modules',
                include:APP_PATH
            },
            {
                test:/.(css|less)$/,
                use:['css-loader','style-loader']
//Loaders can be chained by passing multiple loaders, which will be applied from right to left (last to first configured).也就是说webpack在解析模块的时候，使用的loader是从右向左（从下往上的）
            }
        ]
    },
    //当我们引入一个模块的时候，resolve选项对象设置模块如何被解析（webpack有默认值）比如如果引入模块没有后缀，此时webpack会自动添加后缀扩展，默认是extensions: [".js", ".json"]
    resolve:{
        //alias用于设置某些经常被其他模块引用的模块的别名，当如下设置之后，在其他模块，则可以直接通过  import Utility from 'Utilities/utily' 
        //https://doc.webpack-china.org/configuration/resolve/#resolve-aliasfields
        //上面链接官网指定了模块默认被解析的规则，
        alias:{
            Utilities:path.resolve(ROOT_PATH,'src/utilies')
        },
      //enforceExtension 规定引入模块的时候，是否可以不写后缀名，默认false,可以不写
        enforceExtension:false,
       //enforceModuleExtension 规定对模块是否应用扩展，默认fasle
      enforceModuleExtension: false,
      extensions: [".js", ".json"],
      unsafeCache:true,
      //或者只缓存某些模块
      unsafeCache: /src\/utilities/
    }
    
}
```

### 3 总之官方文档还是需要耐心研读。