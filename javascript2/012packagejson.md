---
title: packagejson文件字段解析
date: 2017-08-23
categories: CommonJS

---

CommonJS为package.json文件定义了如下一些必须的字段：

- name。包名，需要在NPM上是唯一的。不能带有空格。
- description。包简介。通常会显示在一些列表中。
- version。版本号。一个语义化的版本号（<http://semver.org/> ），通常为x.y.z。该版本号十分重要，常常用于一些版本控制的场合。
- keywords。关键字数组。用于NPM中的分类搜索。
- maintainers。包维护者的数组。数组元素是一个包含name、email、web三个属性的JSON对象。
- contributors。包贡献者的数组。第一个就是包的作者本人。在开源社区，如果提交的patch被merge进master分支的话，就应当加上这个贡献patch的人。格式包含name和email。如：
- ```
  "contributors": [{
      "name": "Jackson Tian",
      "email": "mail @gmail.com"
  	}, {
      "name": "fengmk2",
      "email": "mail2@gmail.com"
  }],
  ```

- bugs。一个可以提交bug的URL地址。可以是邮件地址（mailto:mailxx@domain），也可以是网页地址（http://url）。
- licenses。包所使用的许可证。例如：
- ```
  "licenses": [{
      "type": "GPLv2",
      "url": "http://www.example.com/licenses/gpl.html",
  }]
  ```

- repositories。托管源代码的地址数组。
- dependencies。当前包需要的依赖。这个属性十分重要，NPM会通过这个属性，帮你自动加载依赖的包。

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
- ​

[webpack-CLI](https://doc.webpack-china.org/api/cli/)

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