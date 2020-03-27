---

---

### 1 首先要学习下eslint的简单使用

[官方文档](https://cn.eslint.org/docs/user-guide/configuring)

[github-eslint](https://github.com/eslint/eslint)

### 2 源码学习

比如在文档中有一句 `如果你使用一个配置文件，想要 ESLint 忽略任何 `.eslintrc.*` 文件，请确保使用 `--no-eslintrc` 的同时，加上 `-c` 标记。`

疑问：`-no-eslintrc -c `都有什么作用呢？

去源码中寻找答案

首先可以了解如何对eslint进行debugger

1. `npm i eslint`

增加配置 `.eslintrc.js`

```javascript
//eslint-plugin-cml-js-lint
module.exports = {
  env:{
    es6:true,
    browser:true,
    node:true
  },
  rules:{
    "no-var":2,
    "no-undef":2
  },
  
  parserOptions:{
    ecmaVersion:10,
    "sourceType": "module",
  },
};
```

2. 修改package.json

```json
"scripts": {
    "lint": " eslint  --ext .js,.vue src",
  },
```

3. 打开项目目录中` node_modules/bin/eslint`,在第一行代码中加`--inspect-brk`

```javascript
#!/usr/bin/env node --inspect-brk
```

4. 在想要调试的代码中增加 `debugger`，如果想调试eslint源码，那就在 `node_modules/eslint/lib`下某个文件中加 `debugger`即可；

### 3 eslint-plugin-xxx 理解

如果对于官网中某些 [开发eslint-plugins](http://eslint.cn/docs/developer-guide/working-with-plugins)中的某些章节有些不明白，那么看下已有的eslint-plugin源码绝对是最好的选择；

打开 [npm.js](https://www.npmjs.com/) ，搜索 `eslint-plugin-` ，可以看到很多插件；或者在github上，搜索结果：https://github.com/search?o=desc&q=eslint-plugin-&s=stars&type=Repositories

可以下载下来一些仓库对照着去学习；

比如 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)

或者搜索 eslint-config-  ,这个是[github上eslint-config-搜索结果](https://github.com/search?q=eslint-config)







