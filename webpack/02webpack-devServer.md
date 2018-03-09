---
title:webpack-devServer
---

**主要解释`output.publicPath`和`devServer.publicPath`之间的关系**

### 1 webpack配置中 `output.publicPath`和`devServer.publicPath`有何区别？

* 默认值  `output.publicPath` ：" " ;`devServer.publicPath` : ' / '
* [output.publicPath](https://doc.webpack-china.org/configuration/output/#output-publicpath)：，**此选项的值都会以 / 结束**。
* [devServer.publicPath](https://doc.webpack-china.org/configuration/dev-server/#devserver-publicpath-)：**确保 `publicPath` 总是以斜杠(/)开头和结尾。**

### 2 最简单配置

####2.1 都取默认值

webpack.config.js

```javascript
const path = require('path')
module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
    },
    devServer:{
        host: '127.0.0.1',
    	port: 8010,
    }
}
```

此时会取默认值，`webpack output is served from /`

在 `http://127.0.0.1:8010/`下面就可以访问到我们的经过webpack打包后的资源

#### 2.2 `output.publicPath `有值，`devServer.publicPath`没有赋值

```javascript
const path = require('path')
module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        publicPath:'anyPath'
    },
    devServer:{
        host: '127.0.0.1',
    	port: 8010,
    }
}
```

此时`devServer.publicPath`会取 `output.publicPath`的值，

`webpack output is served from /anyPath`

在 `http://127.0.0.1:8010/anyPath/`下面就可以访问到我们的经过webpack打包后的资源

####2.3 `output.publicPath `没有值，`devServer.publicPath`赋值

```javascript
const path = require('path')
module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
      
    },
    devServer:{
        host: '127.0.0.1',
    	port: 8010,
        publicPath:'anyPath'
    }
}
```

`webpack output is served from /anyPath`

在 `http://127.0.0.1:8010/anyPath/`下面就可以访问到我们的经过webpack打包后的资源

####2.4 `output.publicPath `有值，`devServer.publicPath`也有值 

```javascript
const path = require('path')
module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
      	publicPath:'otherPath'
    },
    devServer:{
        host: '127.0.0.1',
    	port: 8010,
        publicPath:'anyPath'
    }
}
```

`http://127.0.0.1:8010/anyPath/` 

此时服务器的路径是根据 `devServer.publicPath`启动的，但是资源却不在，所以解释了

output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

#### 2.5 对于访问资源路径出错的时候，可以通过 `devServer.historyApiFallback`来指定任意的 `404` 响应都可能需要被替代为 的资源路径

```javascript
const path = require('path')
module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
      	publicPath:'anyPath'
    },
    devServer:{
        host: '127.0.0.1',
    	port: 8010,
        publicPath:'anyPath'
        historyApiFallback: {
      		index: 'anyPath'
    },
    }
}
```

``http://127.0.0.1:8010/anyPath/`  ` 此时访问可以正确到达，但是访问 

`http://127.0.0.1:8010/someOtherPath/`  也会被可以访问到这些资源；



