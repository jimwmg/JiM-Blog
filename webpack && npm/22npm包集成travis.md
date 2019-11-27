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

可以看到以下这个图标生成了
![](https://travis-ci.org/jimwmg/lerna-travis.svg?branch=master)

### 3 Coveralls 

[https://coveralls.io/](https://coveralls.io/)

用github登录这个账号之后，记得增加 https://coveralls.io/repos/new 对应的仓库

项目中增加 [mocha](https://mochajs.cn/#installation)

增加 mocha 之后，[在这里](https://coveralls.io/github/jimwmg/lerna-travis)可以看到 生成的 coverage 的小icon ,[链接](https://coveralls.io/repos/github/jimwmg/lerna-travis/badge.svg?branch=master)



[travis-教程](https://docs.travis-ci.com/user/tutorial/)

[跟踪github项目的持续集成状态](https://harttle.land/2016/04/30/github-ci.html)

