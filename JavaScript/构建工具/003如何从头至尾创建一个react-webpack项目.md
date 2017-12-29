---
title: 如何从头至尾创建一个react-webpack项目
date: 2017-07-28
categories: javascript
tags: react
---

### React Webpack

### 1 首先安装node npm (-g)安装

这是运行环境安装的第一步，后续的安装都要依靠这些

### 2 新建一个文件夹-reactdemo,在此文件夹下打开终端，输入 

```
npm init (-y) y表示默认配置安装
```

此时我们的文件目录如下

```
reactdemo
	-package.json
```

package.json文件中的内容如下

```javascript
{
  "name": "reactdemo",
  "version": "1.0.0",
  "description": "create yourself react",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "JiM-W",
  "license": "ISC",
}
```

这就是最初的状态。

### 3 安装其他依赖

理解两个单词

* devDependencies：开发时依赖，这些可以理解为是一些开发时候的依赖，比如webpack工具，gulp工具，等
* dependencies：这个是生产环境中，我们真正的依赖，比如react, react-router,react-redux;

安装开发环境所需要的npm包

```
npm install webpack webpack-dev-server html-webpack-plugin --save-dev
npm install css-loader style-loader sass-loader node-sass --save-dev
npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
```

安装生产环境所需要的npm包

```
npm install react react-dom --save
//还有其他的一些react相关的生态库
```

之后package.json文件如下

```javascript
{
  "name": "07myreact",
  "version": "1.0.0",
  "description": "create yourself react",
  "main": "index.js",
  "scripts": {
    //npm 会自动找到 node_modules/.bin/webpack-dev-server文件执行：node webpack-dev-server
    "dev": "webpack-dev-server --progress --profile --colors --hot --inline --open",
      //node_modules/.bin/webpack  node webpack命令会找到webpack.config.js进行执行
    "build": "webpack --progress --profile --colors",
    "watch":"webpack --watch"
  },
  "author": "JiM-W",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.4",
    "html-webpack-plugin": "^2.29.0",
    "node-sass": "^4.5.3",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.18.2",
    "webpack": "^3.4.1",
    "webpack-dev-server": "^2.6.1"
  },
  "dependencies": {
    "react": "^15.6.1",
    "react-dom": "^15.6.1",
    "react-redux": "^5.0.5",
    "react-router": "^4.1.2",
    "react-router-dom": "^4.1.2",
    "react-router-redux": "^4.0.8",
    "redux": "^3.7.2",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^2.2.0"
  }
}
```

### 4 文件夹目录完善

```
reactdemo 
	-dist(存放打包后的文件)
	-src(存放要打包前的文件)
		-components(react组件)
		-containers(react容器组件)
		index.jsx(入口文件)
	-index.html
	-package.json
	-webpack.config.js
```

### 5 webpack.config 的配置

#### 5.1 基本配置

```javascript
var path = require('path');

var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname)
var BUILD_PATH = path.resolve(ROOT_PATH,'dist');
var APP_PATH = path.resolve(ROOT_PATH,'src');

console.log(module)
module.exports = {
    entry : {
      //打包文件的入口
        app : path.resolve(APP_PATH,'index.jsx')
    },
    output : {
      //打包好的文件存放的路径
        path : path.resolve(BUILD_PATH),
        filename : 'js/bundle.js'
    },
   resolve: {
   		extensions: [ '.js', '.jsx'	,'.css','.less','.json','.jpg','.png']
  },
 //module这些选项决定了如何处理项目中的不同类型的模块。比如css,less,js，jsx等如何进行处理的配置
  module:{
        rules:[
          //这个是为了可以转化ES6以及JSX语法的
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: [APP_PATH]
            }
        ]
    },
}
```

src/index.jsx中随便写一行代码

```javascript
console.log('test')
```

然后在index.html中引入bundle.js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id='app'></div>
    <script src='./dist/js/bundle.js'></script>
</body>
</html>
```

在reactdemo目录下打开终端执行 webpack命令，webpack会找到webpack.config.js进行打包，此时打开dist目录下会多一个js.bundle.js文件，但是此时还不支持ES6以及JSX的语法，所以还需要进行一些配置。

在reactdemo目录下新建一个文件 .barbelrc,内容如下(webpack在打包的过程中会自动找到该文件)

Babel其实可以完全在webpack.config.js中进行配置

但是考虑到babel具有非常多的配置选项，在单一的webpack.config.js文件中进行配置往往使得这个文件显得太复杂，因此一些开发者支持把babel的配置选项放在一个单独的名为 ".babelrc" 的配置文件中。

我们现在的babel的配置并不算复杂，不过之后我们会再加一些东西，因此现在我们就提取出相关部分，分两个配置文件进行配置（webpack会自动调用.babelrc里的babel配置选项），如下

```javascript
{
  "presets": [
    "react",
    "es2015"
  ]
}
```

此时目录结构如下

```
reactdemo 
	-dist(存放打包后的文件)
	-src(存放要打包前的文件)
		-components(react组件)
		-containers(react容器组件)
		index.jsx(入口文件)
	-index.html
	-package.json
	.babelrc
	-webpack.config.js
```

此时在index.jsx中写入如下代码·

```jsx
import React ,{Component} from 'react' ;
import ReactDOM from 'react-dom';
import App from './components/app'

ReactDOM.render(
    <App title='React'/>,
    document.getElementById('app')
)
```

components-app.js

```jsx
import React,{Component} from 'react';
class App extends Component{
    render(){
        return (
            <header>{this.props.title}</header>
        )
    }
}
export default App ;
```

再次执行webpack命令，打开index.html文件，就可以看到react的内容了。

#### 5.2 插件配置

html-webpack-plugin

html-webpack-plugin的主要作用entry入口文件打包后，自动插入到新生成的一个html页面中。(注意该自动生成的html文档可能非常简洁，并不是我们需要的，所以我们需要一个模版，告诉webpack如何生成一个新的html,并且自动将打包后的文件资源引入)，自动生成的文件默认是在webpack.config文件配置项output.path目录下

[简单介绍](http://www.jianshu.com/p/c0e1fc31940b)

先进行配置,在webpack.config.js中增加以下配置

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin')    
plugins:[
        new HtmlWebpackPlugin({
            title:'myTest',//生成的html文件的title
            filename:'my_index.html',//生成的html文件的文件名（默认是index.html,这里改动一下）
        })
    ]
```

执行webpack命令，可以看到在output.path目录下生成了新的html页面，我们可以看下此时的内容，

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>myTest</title>
  </head>
  <body>
    //此处的script标签的个数等于entry入口的个数，这里只有一个app入口
  <script type="text/javascript" src="js/bundle.js"></script></body>
</html>
```

这是一个极为简单的html模版，默认生成的肯定不符合我们的需求，因为连react组件要渲染的div-app元素都没有，大家可以对比下index.html。所以此时配置的时候就需要以index.html为模版，可以配置template选项，指明生成的html以哪个文件为模版.

现将之前的index.html文件中script标签删除掉

```javascript
plugins:[
        new HtmlWebpackPlugin({
            title:'myTest',
            filename:'my_index.html',
            template:ROOT_PATH+'/index.html'
        })
    ]
```

```javascript
title: 设置title的名字   
filename: 设置这个html的文件名   
template:要使用的模块的路径  
inject: 把模板注入到哪个标签后 'body',   
favicon: 给html添加一个favicon  './images/favico.ico', 
minify:是否压缩  true false   
hash:是否hash化 true false ,     
cache:是否缓存,   
showErrors:是否显示错误,  
chunks:目前没太明白  
xhtml:是否自动毕业标签 默认false  
```

再次执行webpack,此时在看下my_index.html文件，可以发现以index.html文件为基础，仅仅增加了打包后文件路径而已。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id='app'></div>
	<script type="text/javascript" src="js/bundle.js"></script></body>
</html>
```

为了方便后期调试，此处将

```javascript
plugins:[
        new HtmlWebpackPlugin({
            title:'myTest',
            //filename:'my_index.html', //此行注释掉，此时生成的文件名默认是index.html
            template:ROOT_PATH+'/index.html'
        })
    ]
```

### 6 自动更新的配置

以上我们基本实现了webpack打包，以及react代码的babel,但是我们每次修改代码，总不至于每次都要重新执行webpack命令吧，所以下面需要完善代码改变之后，如何自动重新打包，以及配置如何处理其他文件模块（module)

webpack 中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码：

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨探讨一下以上的所有选项。

* 先来测试下webpack观察者模式：执行npm run watch,可以看到webpack在编译代码，但是却不会退出命令

修改下app.js文件

```jsx
import React,{Component} from 'react';
class App extends Component{
    render(){
        return (
            <div id='container'>
                <header>{this.props.title}</header>
                <div>测试自动代码</div>
            </div>
        )
    }
}
export default App ;
```

此时在终端可以看到webpack有重新进行了打包，而不用我们之前的操作，重新执行webpack命令了;但是此时的缺点时，虽然我们的代码更新之后，不用重新执行打包命令，webpack会自动重新打包，但是还有一点儿问题就是，浏览器的页面我们还是需要手动刷新的。接下来就需要dev-server来实现代码更新之后

1）既可以自动重新打包

2）又可以自动刷新浏览器页面

* 再来看下webpack-dev-server，提供了一个简单的web服务器。

[官方配置项解释](https://doc.webpack-china.org/configuration/dev-server/)

```javascript
devServer: {
        contentBase: './dist',
        port:9000
    },
```

此时我们在执行npm run dev  ,可以发现自动打开了localhost:9000端口，(注意，因为我们dist文件夹下的html文件的名字是my_index.html,所以webpack不会自动打开，我们只需要点击进去即可，一般情况下，如果我们不配置filename,则会自动打开)，此时改动代码，我们可以发现会自动重新打包以及重新刷新浏览器的页面了。

使用webpack-dev-server命令行的时候，会自动查找名为webpack.config.js的配置文件。如果你的配置文件名称不是webpack.config.js，需要在命令行中指明配置文件。例如，如果配置文件是webpack.config.dev.js：`webpack-dev-server --inline --config webpack.config.dev.js`。

以上

-自动编译ES6  -自动重新打包以及浏览器自动刷新  -生产环境所需基本依赖完毕

### 7 优化-模块热更新（模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。）

webpack中增加以下配置。

```javascript
new webpack.HotModuleReplacementPlugin()
```

```javascript
devServer: {
        contentBase: './dist',
        port:9000,
        hot:true ,//告诉 dev-server 我们在使用 HMR
    },
```

### 8 Module模块的规则配置，以便打包css ，less等（包括模块路径解析）

增加目录结构

```
reactdemo 
	-dist(存放打包后的文件)
	-src(存放要打包前的文件)
		-components(react组件)
			-app.js
		-containers(react容器组件)
		-style(样式文件夹)
			-app.css
		index.jsx(入口文件)
	-index.html
	-package.json
	.barbelrc
	-webpack.config.js
```

app.js增加

```
import styles from '../style/app'
```

app.css

```css
.container{
    border:1px solid black;
    width:300px;
    height:300px
}
```

此时如果运行。npm run dev 会发现报错，没有合适的loader解析css文件

在webpack.config.js配置中 module.rules

在文件中引入其他文件模块的时候，根据对应的模块路径引入之后，需要确定对引入文件的解析规则；这些模块如何解析的规则就是通过module.rules配置的。比如如何解析引入的js/jsx/css/less/ES6/图片等

创建模块时，比如引入组件(jsx),引入样式(css/less),首先会匹配module.rules中的rule[规则](https://doc.webpack-china.org/configuration/module/#rule)数组。这些规则能够修改模块的创建方式。这些规则能够对引入的模块(module)应用 对应的loader，或者修改解析器(parser)。

```javascript
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: [APP_PATH]
            },
            {
                test:/\.(css|less)$/,
                use:['style-loader','css-loader']
            }
        ]
    },
```

以上就是一个基于webpack的react项目简易搭建流程，关键还是要对webpack官方文档一步步多看下，然后才能理解打包过程中，路径如何 引用，模块引入进来如何解析等。

后期有时间在分析下如何优化webpack打包。

对于test  exclude include 路径的规则如下：要么是绝对路径的字符串，要么是正则表达式

## `条件`

条件可以是这些之一：

- 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
- 正则表达式：test 输入值。
- 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
- 条件数组：至少一个匹配条件。
- 对象：匹配所有属性。每个属性都有一个定义行为。

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件

### 9 本文之外，有一些细节的总结，不想再另写博客，以下纯属个人记忆，以防忘记。

css-loader配置对象option的一些小记，没代码，具体参看[cssModules](https://github.com/ruanyf/webpack-demos)链接（阮一峰老师的教程webpack@1x,不过不影响理解）

webpackconfig.js

```javascript
module.exports = {
    entry:
   	output:
  	resolve:
  	module:{
    	rules:[
    		{
    			test:/\.css$/,
  				use:[
    				loader:'css-loader',
  					option:{
    					modules:true,//启用局部作用域，默认为false不启用，也就是webpack不会对类名进行编译
  						localIdentName: '[path][name]__[local]--[hash:base64:5]',//定制生成的类名，打开webpack编译之后的index.html文件，F2查看其类名
  						
					}
  				]
			}
  		]
	}
}
```



参考

[webpack-html-plugin用法](http://zengxt.pw/2016/10/26/html-webpack-plugin-%E7%94%A8%E6%B3%95/)

[如何创建一个react项目](http://www.jianshu.com/p/98c22488cf56)

[npm scripts对象的作用](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

[webpack-dev-server的作用](http://www.jianshu.com/p/941bfaf13be1)

[webpack-dev-server的作用2](http://blog.csdn.net/liangklfang/article/details/54944012)

[webpack-inline作用](http://www.cnblogs.com/chris-oil/p/6241741.html)

[官方webpac教程，建议按此流程一步步来](https://doc.webpack-china.org/guides/)

[webpack模块路径解析规则](https://doc.webpack-china.org/concepts/module-resolution/)

[cssModules](https://github.com/ruanyf/webpack-demos)

[webpack配置详解](https://mp.weixin.qq.com/s?__biz=MjM5NDMwNjMzNA==&mid=2651807180&idx=1&sn=2734dc2ad8e82f0cdee75f35a05fcc27&chksm=bd723dbd8a05b4ab04efcd8e12ccbd043ece567ce7d4eeaa427555968857c94f9f597d24e956&mpshare=1&scene=1&srcid=0824g40sXS1BlC2Ko3QviSvM&key=a9f0cd582f409b4ed398fee13e75fde0bb054778292e9ebf4367548f6968840898436b6cea7c3a09bb87fdbf38eeb10371366ea8a17978482eeb831eba7a24821837a26d1f6712d661efb5a518913799&ascene=0&uin=MjIzMzEwNzk0MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.6+build(16G29)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=Ac9BX1SL6qQsoyFG9vtzPHS%2BDCLvXL86suzJu6Khz0m7cBDPaT%2BoR0Q2yKj0UvSW)



