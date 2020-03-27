---
持续集成中的各个小图标
---

### 1 npm 版本号的小图标

我们发布  npm  包以后，按照如下方式可以得到 这个 包的 npm 版本小图标

```
https://img.shields.io/npm/v/{your package name}.svg?style=flat
```

比如下面这样的

```
https://img.shields.io/npm/v/lerna-tool1.svg?style=flat
```

![lerna-tool1](https://img.shields.io/npm/v/lerna-tool1.svg?style=flat)

### 2 travis CI 小图标

比如我们有个如下最简单的配置文件；

`.travis.yml`

```yml
language: node_js
node_js: stable
branches:
  only:
  - master
install:
- npm install
script:
- npm test

```

我们只需要新建一个这样的仓库，上传至 github，然后用 github账号登录 [travis.com](https://travis-ci.com/)

最简单的仓库参考 [leran-travis](https://github.com/jimwmg/lerna-travis)

构建之后如下 ： https://travis-ci.org/jimwmg/lerna-travis

可以看到以下这个图标生成了,既可以直接用 travis-ci 域名下的图标地址
![](https://travis-ci.org/jimwmg/lerna-travis.svg?branch=master)

```
https://travis-ci.org/jimwmg/lerna-travis.svg?branch=master
```

![](http://img.shields.io/travis/jimwmg/lerna-travis.svg)

也可以使用 https://shields.io/ 域名下的图标地址；

```
http://img.shields.io/travis/{GitHub 用户名}/{项目名称}.svg
```

### 3 Coveralls 

[https://coveralls.io/](https://coveralls.io/)

用github登录这个账号之后，记得增加 https://coveralls.io/repos/new 对应的仓库

项目中增加 [mocha](https://mochajs.cn/#installation)



增加 mocha 之后，[在这里](https://coveralls.io/github/jimwmg/lerna-travis)可以看到 生成的 coverage 的小icon ,![链接](https://coveralls.io/repos/github/jimwmg/lerna-travis/badge.svg?branch=master)

```
https://coveralls.io/repos/github/jimwmg/lerna-travis/badge.svg?branch=master
```
也可以在 shields 域名下：
[在这里](https://shields.io/category/coverage)  可以生成获得对应的 badge；![](https://img.shields.io/coveralls/github/jimwmg/lerna-travis/master)

```
https://img.shields.io/coveralls/github/jimwmg/lerna-travis/master
```


### 4 [codecov](https://codecov.io/gh)

[npm-codecov](https://www.npmjs.com/package/codecov)

在`.travis.yml`中增加以下脚本 `./node_modules/.bin/codecov`

![](https://codecov.io/gh/jimwmg/lerna-travis/branch/master/graph/badge.svg)



### 5 [shields](https://shields.io/)

比如想要某个npm 包的下载量，在 [shields官网](https://shields.io/) 选择 downloads ,然后选择 npm，那一个，可以到[这里](https://shields.io/category/downloads)

这个网站支持的徽章特别多，比如想看某个包支持的 node 版本，在[platform-support](https://shields.io/category/platform-support) 中输出这个包名即可，如果这个npm包中的 [package.json](https://blog.csdn.net/woxueliuyun/article/details/39294375) 声明了 engines 字段，那么就会根据这个字段声明的值生成徽章，比如 `lerna-tool5`

![lerna-tool5](https://img.shields.io/node/v/lerna-tool5)

又或者想看某个 npm 包的 licence 协议 ，在[这里](https://shields.io/category/license),输入对应的npm包即可,比如输入 lerna-tool5,生成的徽章如下

![lerna-tool5](https://img.shields.io/npm/l/lerna-tool5)

### 总结



#### 为什么我们需要这些徽章？



[参考如何挑选高质量的 npm 模块](https://github.com/atian25/blog/issues/19)

对于npm模块有以下几个维度去考量；

1 质量 Quality

2 维护状况 Maintenance

3 知名度 Popularity

4 个人魅力 Personalities



[travis-教程](https://docs.travis-ci.com/user/tutorial/)

[跟踪github项目的持续集成状态](https://harttle.land/2016/04/30/github-ci.html)

