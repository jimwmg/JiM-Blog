---
tsc命令行的使用
---

### 0.为什么需要typescript?

![](./ts.png)

### 1.tsc命令行的安装与使用

安装

```
npm install -g typescript
```

如何查看更多关于`tsc`的命令？

```
tsc --help
```

想要了解typescript的原理？

[typescript源码-Github](https://github.com/Microsoft/TypeScript)

编译ts

```
tsc helloworld.ts
```

命令行后面的配置项列表如下：https://www.tslang.cn/docs/handbook/compiler-options.html

| `--target` `-t` | `string` | `"ES3"` | 指定ECMAScript目标版本 `"ES3"`（默认）， `"ES5"`， `"ES6"`/ `"ES2015"`， `"ES2016"`， `"ES2017"`或 `"ESNext"`。  注意： `"ESNext"`最新的生成目标列表为 [ES proposed features](https://github.com/tc39/proposals) |
| --------------- | -------- | ------- | ------------------------------------------------------------ |
|                 |          |         |                                                              |

```
 tsc 00.base-ts.ts -t es2017
```



| `--sourceMap` | `boolean` | `false` | 生成相应的 `.map`文件。 |
| ------------- | --------- | ------- | ----------------------- |
|               |           |         |                         |

```
tsc 00.base-ts.ts -t es2017 -sourceMap
```

| `--outDir` | `string` |      | 重定向输出目录。 |
| ---------- | -------- | ---- | ---------------- |
|            |          |      |                  |

```
tsc 00.base-ts.ts -t es2017 --outDir ./tes
```

| `--alwaysStrict` | `boolean` | `false` | 以严格模式解析并为每个源文件生成 `"use strict"`语句 |
| ---------------- | --------- | ------- | --------------------------------------------------- |
|                  |           |         |                                                     |

```
tsc 00.base-ts.ts -t es2017 --alwaysStrict
```

通过`tsc --help`可以看到所有的支持的命令列表，该命令列表支持的命令选项和[tsconfig.json支持配置项](https://www.tslang.cn/docs/handbook/compiler-options.html)基本是一致的

![](./ts-help.png)

所以typescript支持通过配置文件的形式抽离出来这样的配置项

### 2.tsconfig.json文件解读

[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

通过`tsc --init `初始化配置文件

```
tsc --init 
```

修改想要测试的某些配置项

```
tsc filename.ts 
```

执行之后发现是和通过命令行直接指定某些编译能力是一致的

```json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}

```



### ts-node

除了`tsc`命令用于编译ts文件之外，还有`ts-node`可以直接在node终端执行ts文件

- Use [ts-node](https://github.com/TypeStrong/ts-node) to run scripts or REPL
- How to make executable typescript scripts:
  1. Make sure you have `npx` (shipped with `npm >= 5.2`) and `typescript` package is installed
  2. Add this [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) as first line to your script: `#!npx ts-node`
  3. Make script executable: `chmod +x script.ts`
  4. Run directly: `./script.ts` :)

```bash
# Locally in your project.
npm install -D typescript
npm install -D ts-node

# Or globally with TypeScript.
npm install -g typescript
npm install -g ts-node
```

`node-run.js`

```
const name_node = 'name-node';
console.log(name_node)
```

终端执行`node node-run.js`

`tsnode-run.ts`

```
const name_ts_node:string = 'lucy';
console.log(name_ts_node)
```

终端执行`tsnode tsnode-run.ts`

### 3.如何在项目中使用

强烈推荐的学习资源： [awesome-typescript](https://github.com/dzharii/awesome-typescript)

#### 3.1.项目学习资源

为了更加真实的看到webpack的配置，我找了以下demo,clone到本地即可查看

[ts-examples](https://www.tslang.cn/samples/index.html)

[vue+webpack4+typescript](https://github.com/vok123/typescript-vue-eslint-starter)

[react+webpack4+typescript](https://github.com/bengle/react-typescript-starter)



#### 3.2.终端命令行自定义ts项目

#### 0.注意点

**npm本源可能会安装超级慢，并且会出现安装多次依旧失败的问题，注意这里可以更改安装源**

```bash
cnpm --- http://r.cnpmjs.org/
* taobao - https://registry.npm.taobao.org/
nj ----- https://registry.nodejitsu.com/
rednpm - http://registry.mirror.cqupt.edu.cn/
npmMirror  https://skimdb.npmjs.com/registry/
```

**node版本问题**

以下某些安装过程可能需要较高的node版本，所以需要注意切换到比较高的node版本

```bash
npm view node versions  #罗列所有的node版本信息
nvm #可以用来管理node版本
```



**1.[create-react-app-started](https://create-react-app.dev/docs/getting-started/)**

```sh
npx create-react-app my-app --template typescript
```

所有的模板资源根本上也都是从 npm 下载的，所以具体的资源列表可以参考这里：[cra=template](https://www.npmjs.com/search?q=cra-template-*)

**2.[vue-cli](https://cli.vuejs.org/guide/installation.html)**

```bash
npm install -g @vue/cli
vue create vue-starter
didi@localhost  ~/learn/learnSPace/31learn-ts/cli-ts-project   master ●  npx vue create vue-starter
Vue CLI v4.3.1
┌─────────────────────────────────────────┐
│                                         │
│   New version available 4.3.1 → 4.5.8   │
│    Run npm i -g @vue/cli to update!     │
│                                         │
└─────────────────────────────────────────┘
? Please pick a preset: 
  y (babel, eslint) 
  default (babel, eslint) 
❯ Manually select features 

# 选择 ❯ Manually select features 
接下来选择 typescript即可
```



**3[typescript-starter](https://github.com/bitjson/typescript-starter)**

```
npx typescript-starter
```

![](./ts-starter.svg)







