---
Eslint
---

### 1 配置文件

### 2 命令行

```
"eslint":"eslint ./proxy ./transform ./parser utils.js index.js",
"eslint:fix":"eslint utils.js --ext .js parser --ext .js proxy --ext .js transform --fix"
```

`eslint file --fix   `:修复文件；

`eslint --ext .js src`:修复src文件夹下 `.js`后缀的文件；

`eslint * --fix`:修复所有

