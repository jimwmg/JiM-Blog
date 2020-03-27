## git 使用规范

### 1 git commit 规范

#### **人工约定**

#### Commit Message格式

每次提交，Commit message 都包括两个部分：**Header**，**Body** 。header中的 **type** 和 **subject**有特殊的规定

```
<type>(<scope>): <subject>
```

其中，**Header** 是必需的，**Body** 可以省略。 不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。

##### Header ：包括三个type（必填）、scope（选填）和 subject（必填）

##### type:用于声明此次commit的主要目的类别：

```
* feat：新功能（feature）
* fix：修补bug
* docs：文档（documentation）
* style： 格式（不影响代码运行的变动）
* refactor：重构（即不是新增功能，也不是修改bug的代码变动）
* test：增加测试
* chore：构建过程或辅助工具的变动
```

注：如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

### scope:用于说明commit影响的范围；如数据层(model)，视图层(view)，控制层（controller）等。



### **subject ** :是 commit 目的的简短描述，不超过50个字符。

```
* 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
```

#### Body

**Body** 部分是对本次 commit 的详细描述，可以分成多行

```
* 使用第一人称现在时，比如使用change而不是changed或changes。
* 应该说明代码变动的动机，以及与以前行为的对比。
```

人工约定的形式显然不够智能；同时需要团队内行程共识，形成共识还不够，每个人在提交代码的时候，还需要记着要提交的格式；

### 了解git hooks

提到`“hooks”`这个词我们应该并不陌生，比如`vue`和`react`都有自己的`lifecycle hooks`，在git中分为`客户端hooks`和`服务端hooks`。在commit阶段中涉及到的是客户端hooks，其中客户端hooks包含：

> pre-commit 钩子在键入提交信息前运行。 它用于检查即将提交的快照，例如，检查是否有所遗漏，确保测试运行，以及核查代码。 如果该钩子以非零值退出，Git 将放弃此次提交，不过你可以用 git commit --no-verify 来绕过这个环节。 你可以利用该钩子，来检查代码风格是否一致（运行类似 lint 的程序）、尾随空白字符是否存在（自带的钩子就是这么做的），或新方法的文档是否适当。

> prepare-commit-msg 钩子在启动提交信息编辑器之前，默认信息被创建之后运行。 它允许你编辑提交者所看到的默认信息。 该钩子接收一些选项：存有当前提交信息的文件的路径、提交类型和修补提交的提交的 SHA-1 校验。 它对一般的提交来说并没有什么用；然而对那些会自动产生默认信息的提交，如提交信息模板、合并提交、压缩提交和修订提交等非常实用。 你可以结合提交模板来使用它，动态地插入信息。

> commit-msg 钩子接收一个参数，此参数即上文提到的，存有当前提交信息的临时文件的路径。 如果该钩子脚本以非零值退出，Git 将放弃提交，因此，可以用来在提交通过前验证项目状态或提交信息。

> post-commit 钩子在整个提交过程完成后运行。 它不接收任何参数，但你可以很容易地通过运行 git log -1 HEAD 来获得最后一次的提交信息。 该钩子一般用于通知之类的事情。

这里我们主要是在`pre-commit`阶段来检查commit是否符合规范。

#### 工具化

方案一：commitizen 提供一个交互界面

[参考](https://www.toutiao.com/a6766394577638130188/?tt_from=copy_link&utm_campaign=client_share&timestamp=1575508196&app=news_article&utm_source=copy_link&utm_medium=toutiao_ios&req_id=2019120509095601012902703301C852B7&group_id=6766394577638130188)

[掘金-如果我是前端leader](https://juejin.im/post/5d3a7134f265da1b5d57f1ed)

```
npm install commitizen -g
commitizen init cz-conventional-changelog --save-dev --save-exact
```

![](https://raw.githubusercontent.com/commitizen/cz-cli/master/meta/screenshots/add-commit.png)

但是这个方案又有以下要求

If you're **not** working in a Commitizen friendly repository, then `git cz` will work just the same as `git commit` but `npx git-cz` will use the [streamich/git-cz](https://github.com/streamich/git-cz) adapter. To fix this, you need to first [make your repo Commitizen-friendly](https://github.com/commitizen/cz-cli#making-your-repo-commitizen-friendly)

总结来说

- 需要[配置](https://github.com/commitizen/cz-cli#making-your-repo-commitizen-friendly)
- 命令行要用 git cz 
- 每次git cz 都要经过如上图所示那些步骤，稍微有些耗费时间；

`Commitizen` 可以帮助我们规范自己的 `commit-message`，但是在团队合作中，如何规范其他成员的 `commit` 规范呢？

当然也可以局部[安装](https://juejin.im/post/5de679b7518825125c42e5b8)

```
npm install commitizen  cz-conventional-changelog -D

```

添加npm脚本

```
"scripts": {
  "commit": "git-cz"
},
```

然后每次 commit 代码的时候通过

```
npm run commit 
```



方案二

Husky + Commitlint

1. 首先了解下 [git-hooks](https://git-scm.com/docs/githooks),除了在官网可以看git相关配置，也可以在git仓库下打开 `.git`目录进行查看

```
ls -a
cd .git
```

2. 了解下 [husky](https://www.npmjs.com/package/husky)

在 package.json 中国可以通过配置触达git-hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm test",
      "...": "..."
    }
  }
}
```

3. 了解下 [commitlint-npm ](https://www.npmjs.com/package/@commitlint/cli)  [commitlint-官网](https://commitlint.js.org/#/)

具体配置过程如下：

```
npm install --save-dev husky

npm install --save-dev @commitlint/{cli,config-conventional}
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js

```

修改package.json

```json
"husky": {
    "hooks": {
      "pre-commit": "echo pre",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
```

然后当我们在这个仓库中执行 git  commit 的时候，就会按照配置的校验规则进行校验；这样只需要安装几个npm包即可，不会强侵入开发者的操作习惯；

可以使用 angular 提交规范，参考[commitlint-angular](https://www.npmjs.com/package/@commitlint/config-angular)

当然了，也可以自定义校验规则

### 自己配置校验规则 [参考](https://github.com/jimwmg/git-learn)

1. 新增commit-ling.js 文件，内容如下; 注意这里获取 commit 信息的路径，对于 husky ,是 `HUSKY_GIT_PARAMS` 这个变量，指向 `.git/COMMIT_EDITMSG`

```
cd .git
ls 

COMMIT_EDITMSG HEAD           TAG_EDITMSG    description    index          logs           refs
FETCH_HEAD     ORIG_HEAD      config         hooks          info           objects

```
```javascript
const chalk = require('chalk')
const msgPath = process.env.HUSKY_GIT_PARAMS
console.log('process.env',process.env.HUSKY_GIT_PARAMS)
debugger;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/
console.log(msg)
console.log('process.env',process.env)
if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
    chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
    chalk.red(`  See .github/COMMIT_CONVENTION.md for more details.\n`) +
    chalk.red(`  You can also use ${chalk.cyan(`npm run commit`)} to interactively generate a commit message.\n`)
  )
  process.exit(1)
}


```

package.json 中 githooks 中修改为如下：
```json

"husky": {
    "hooks": {
      "commit-msg": "node commit-lint.js"
    }
  },
```

### 2 lint-staged

- 更少的 Bug
- 更高的开发效率，工程师平均会花掉 50% 的工作时间定位和解决各种 Bug，其中不乏那些显而易见的低级错误，而 Lint 很容易发现低级的、显而易见的错误；
- 更高的可读性，代码可读性的首要因子是“表面文章”，表面上看起来乱糟糟的代码通常更难读懂；

但是在遗留代码仓库上工作的同学很快会遇到新的问题，开启 Lint 初期，你可能会面临成千上万的 Lint Error 需要修复。部分同学对下面这个图可能并不陌生：只改了文件 A，但是文件 B、C、D 中也有大量错误。把整个仓库都格式化不失为一种选择，但是实际上需要很大的勇气。多数人在项目中运用新工具都希望是渐进式的，而不是推到重来式的，因为相比而言，业务系统稳定是更重要的事情.如果把 Lint 挪到本地，并且每次提交只检查本次提交所修改的文件，上面的痛点就都解决了。Feedly 的工程师 [Andrey Okonetchnikov](https://www.npmjs.com/~okonet) 开发的 [lint-staged](https://github.com/okonet/lint-staged) 就是基于这个想法，其中 staged 是 Git 里面的概念，指待提交区，使用 `git commit -a`，或者先 `git add` 然后 `git commit` 的时候，你的修改代码都会经过待提交区。

```
npm i eslint lint-staged -D
```

package.json

```json
"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "node commit-lint.js"
    }
  },
  "lint-staged": {
    "src/**/*.js": "eslint"
  },
```

新增 `.eslintrc.js` 配置文件

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
  }
};

```

然后每次在提交代码的时候，仅仅会对新提交大代码进行lint检查，而不会修改原来的仓库；





[lint-staed-github](https://github.com/okonet/lint-staged):帮助你在暂存文件的时候能够让错误格式代码不会提交到你分支。

[lint-staged+husky提高代码质量](https://segmentfault.com/a/1190000009546913)



### 3 git 分支开发规范 

#### 分支构成

master和develop分支一直存在，且名称不会变化，一般不直接修改这2个分支，由其他分支合并而来。

feature、release、hotfix分别用于功能点开发、优化，特定版本测试，线上问题紧急处理，同一类型的分支会产生多个。

分支划分如下：

- master：与线上版本保持绝对一致；
- develop：开发分支，由下文提到的release、feature、hotfix分支合并过后的代码；
- feature：实际功能点开发分支，建议每个功能新建一个feature， 具有关联关系的功能公用一个feature分支；
- release：每一次开发完成之后，从develop创建出来的分支，以此分支为基准，进行测试；
- hotfix：该分支主要用于修复线上bug；

命名规范约定如下：

- feature分支命名：feature/name
- release分支命名：release/name
- hotfix分支命名：hotfix/name

比如有一个「优化分布式Session」的需求，可在develop分支的基础上创建新分支 feature/optimize_distributed_session进行开发，开发完成后合并到develop分支。

#### 分支详细介绍和处理流程

##### master分支

主分支，与线上运行的版本始终保持一致，任何时候都不要直接修改master分支。

一个版本的release分支、hotfix分支开发完成后，会合并代码到master分支，也就是说master分支主要来源于release分支和hotfix分支。

##### develop分支

开发分支，始终保持最新完成以及bug修复后的代码，新增功能时基于该分支创建feature分支。

一个版本的release分支、hotfix分支开发完成后，也会合并到develop分支，另外，一个版本的feature功能开发完成后，也会合并到develop分支。也就是说develop分支来源于feature、release、hotfix分支。

##### feature分支

开发新功能或优化现有功能时，会创建feature分支，以develop为基础创建。一般会有多个功能同时开发，但上线时间可能不同，在适当的时候将特定的feature分支合并到develop分支，并创建release分支，进入测试状态。

##### release分支

当一组feature开发完成，会首先合并到develop分支，开始进入提测阶段时，会创建release分支。

以release分支代码为基准提测，测试过程中若存在bug需要修复，则直接由开发者在release分支修复并提交。

测试完成之后，合并release分支到master和develop分支，此时master为最新代码，用作上线。

##### hotfix分支

线上出现紧急问题时，需要及时修复，以master分支为基线，创建hotfix分支，修复完成后，需要合并到master分支和develop分支。

#### 特殊情况处理和注意点

develop分支已存在未上线的feature代码, 此时需要紧急上线一个新功能, 但develop的代码不能上，如何处理 ？

- 以master为基线创建feature， 在完成之后，代码合并到master分支；
- 为了保证develop是最新代码，需要从master合并到develop分支；

以develop为基线，创建了f1和f2两个feature分支之后, f1,f2开发一半的时候，发现两个分支代码需要有依赖怎么办 ？

- 最好在开发开始前确定两个功能是否相关,若相关则只创建一个分支,两个功能在一起开发;
- 如果已经创建，则需要合并到一个分支；

一定要保证commit历史记录的整洁，代码合并时，根据情况选择merge或rebase

基于以上规范，如果感觉git操作比较繁琐可以用 [git-flow](http://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html) 这个工具来提高效率；

参考这篇[详解 git-flow 如何提升开发体验](https://www.jianshu.com/p/36292d36e41d)