---

title: packagejson文件字段解析
date: 2017-08-23
categories: CommonJS

---

[参考](https://github.com/ericdum/mujiang.info/issues/6/)

## 1 package.json

CommonJS为package.json文件定义了如下一些必须的字段：

#### name。包名，需要在NPM上是唯一的。不能带有空格。

#### description。包简介。通常会显示在一些列表中。

#### version。版本号。一个语义化的版本号（<http://semver.org/> ），通常为x.y.z。该版本号十分重要，常常用于一些版本控制的场合。依次为主版本号，次版本号，补丁号；

- `*`: 任意版本
- `1.1.1`: 指定版本
- `~1`: >= 1.0.0 && < 2.0.0(相当于1.x)
- `~1.1`: >= 1.1.0 && < 1.2.0(相当于1.1.x)
- `~1.1.0`: >= 1.1.0 && < 1.2.0(相当于1.1.x)
- `^1.2.3`: >= 1.2.3 < 2.0.0
- `^0.0.3`: >= 0.0.3 < 0.0.4
- `^0.0`: >= 0.0.0 < 0.1.0
- `^0.x`: >= 0.0.0 < 1.0.0

`^`和`~`：

- `~` 前缀表示，安装大于指定的这个版本，并且匹配到 x.y.z 中 z 最新的版本
- `^` 前缀在 `^0.y.z` 时的表现和 `~0.y.z` 是一样的，然而 `^1.y.z` 的时候，就会匹配到 y 和 z 都是最新的版本

 

#### keywords。关键字数组。用于NPM中的分类搜索。

#### maintainers。包维护者的数组。数组元素是一个包含name、email、web三个属性的JSON对象。

#### contributors。包贡献者的数组。第一个就是包的作者本人。在开源社区，如果提交的patch被merge进master分支的话，就应当加上这个贡献patch的人。格式包含name和email。如：

- ```
  "contributors": [{
      "name": "Jackson Tian",
      "email": "mail @gmail.com"
  	}, {
      "name": "fengmk2",
      "email": "mail2@gmail.com"
  }],
  ```
#### bugs。一个可以提交bug的URL地址。可以是邮件地址（mailto:mailxx@domain），也可以是网页地址（http://url）。

#### licenses。包所使用的许可证。例如：

- ```
  "licenses": [{
      "type": "GPLv2",
      "url": "http://www.example.com/licenses/gpl.html",
  }]
  ```
#### repositories。托管源代码的地址数组。

#### dependencies。当前包需要的依赖。这个属性十分重要，NPM会通过这个属性，帮你自动加载依赖的包。

比如 ` pck1`这个npm 包有依赖 `pkg2`

```javascript
"dependencies": {
    "pkg2": "^1.0.6"
  }
"devDependencies": {
    "pkg3":"^1.0.1"
  },
```

那么在执行`npm i pkg1`的时候，在`node_modules`中直接会安装 `pkg2`但是不会安装`pkg3`；

以下是Express框架的package.json文件，值得参考。

```
{
    "name": "express",
    "description": "Sinatra inspired web development framework",
    "version": "3.0.0alpha1-pre",
    "author": "TJ Holowaychuk 
```

除了前面提到的几个必选字段外，我们还发现了一些额外的字段，如bin、scripts、engines、devDependencies、author。这里可以重点提及一下scripts字段。包管理器（NPM）在对包进行安装或者卸载的时候需要进行一些编译或者清除的工作，scripts字段的对象指明了在进行操作时运行哪个文件，或者执行拿条命令。如下为一个较全面的scripts案例：

```
"scripts": {
    "install": "install.js",
    "uninstall": "uninstall.js",
    "build": "build.js",
    "doc": "make-doc.js",
    "test": "test.js",
}
```

#### main

该字段作为一个npm包的入口地址去找寻对应的入口；

#### 其他特性

#### hook

Npm 脚本有两个钩子 pre 和 post;

```javascript
"prego": "echo 'before go'",
"go": "node index.js",
"postgo": "echo 'after go'",

```

当执行 npm run go的之后，其实会执行  npm run prego => npm run go =>   npm run postgo;

#### execution sequence

```
& 并行执行， 如 npm run lint & npm run tsc
&& 串行执行， 如 npm run lint && npm run test
```

#### wildcards

npm script 中可以使用 shell 通配符。

- `*` 代表任意文件， 如 `"test": "mocha test/*.js"`
- `**` 代表任意目录， 如 `"test": "mocha test/**/*.js "`

#### bash

npm script执行bash命令

```
"bash": "echo $(pwd)",
```

npm run bash;

### exiting

如果 npm script 的 exit code 不是 0， 会认为执行失败， 终止进程。

 

webpack中经常看到如下配置,webpack  -h 可以查看所有支持的命令

```json
"scripts": {    
  "build": "webpack  --profile --progress --colors --display-error-details",    
  "dev":"webpack  --display-modules --profile --progress --colors --display-error-details",       	"dev-hrm": "webpack-dev-server --config"
 },
```

- color 输出结果带彩色，比如：会用红色显示耗时较长的步骤
- profile 输出性能数据，可以看到每一步的耗时
- progress 输出当前编译的进度，以百分比的形式呈现
- display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
- display-error-details 输出详细的错误信息
- webpack-dev-server 将会开启热更新
- config，默认执行的配置文件时webpack.config.js,可以通过该指令指定其他配置文件
- 

[webpack-CLI](https://doc.webpack-china.org/api/cli/)

```javascript
"scripts":{
  //上面的写法是先运行npm run build-js，然后再运行npm run build-css，两个命令中间用&&连接。如果希望两个命令同时平行执行，它们中间可以用&连接。
  "build": "npm run build-js && npm run build-css",
    //以下npm run watch 和 nodemon server.js将会同时运行
  "start": "npm run watch & nodemon server.js",

}
```

如果你完善了自己的JavaScript库，使之实现了CommonJS的包规范，那么你可以通过NPM来发布自己的包，为NPM上5000+的基础上再加一个模块。

```
npm publish <folder>
```

命令十分简单。但是在这之前你需要通过npm adduser命令在NPM上注册一个帐户，以便后续包的维护。NPM会分析该文件夹下的package.json文件，然后上传目录到NPM的站点上。用户在使用你的包时，也十分简明：

```
npm install <package>
```

甚至对于NPM无法安装的包（因为某些奇怪的网络原因），可以通过github手动下载其稳定版本，解压之后通过以下命令进行安装：

```
npm install <package.json folder>
```

只需将路径指向package.json存在的目录即可。然后在代码中require('package')即可使用

#### script字段: 注意Linux命令行的  &  ； &&的区别

- &  ：几个命令同时执行
- ； ：不管前面的命令是否执行成功，后面的命令都会继续执行
- &&  ：只有前面的命令执行成功，后面的命令才会继续执行 

**exit 标识退出当前 shell, 0 标识成功 非0标识失败**

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server",
    "build": "webpack --config webpack.build.js"
  },
```

1.command1 & command2 & command3     

  三个命令同时执行 

2.command1; command2; command3         

  不管前面命令执行成功没有，后面的命令继续执行 

3.command1 && command2                         

只有前面命令执行成功，后面命令才继续执行

## 2 .npmignore

Use a `.npmignore` file to keep stuff out of your package. If there's no `.npmignore`file, but there *is* a `.gitignore` file, then npm will ignore the stuff matched by the `.gitignore` file. If you *want* to include something that is excluded by your `.gitignore` file, you can create an empty `.npmignore` file to override it. Like `git`, `npm` looks for `.npmignore` and `.gitignore` files in all subdirectories of your package, not only the root directory.

## 3 Configuring NPM



