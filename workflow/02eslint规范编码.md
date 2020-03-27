---

---

### 0 ESLint配置

```
npm i eslint -D
```

在 package.json 中

```javascript
"scripts": {
  "lint":"eslint src"
},
```

当我们执行  `npm run lint` 的时候，ESLint 去哪里寻找配置文件呢？

第一种方式是通过 `.eslintrc.*` 和 `package.json` 文件。对于package.json 文件则是以 `eslintConfig`字段为准。ESLint 将自动在要检测的文件目录里寻找它们，紧接着是父级目录，一直到文件系统的根目录（除非指定 `root: true`）。当你想对一个项目的不同部分的使用不同配置，或当你希望别人能够直接使用 ESLint，而无需记住要在配置文件中传递什么，这种方式就很有用。

第二种方式是使用 `-c` 选项传递命令行将文件保持到你喜欢的地方。

```
eslint -c myconfig.json myfiletotest.js
```

如果你使用一个配置文件，想要 ESLint 忽略任何 `.eslintrc.*` 文件，请确保使用 `--no-eslintrc` 的同时，加上 `-c` 标记。

**每种情况，配置文件都会覆盖默认设置。**

ESLint 支持几种格式的配置文件：

- **JavaScript** - 使用 `.eslintrc.js` 然后输出一个配置对象。
- **YAML** - 使用 `.eslintrc.yaml` 或 `.eslintrc.yml` 去定义配置的结构。
- **JSON** - 使用 `.eslintrc.json` 去定义配置的结构，ESLint 的 JSON 文件允许 JavaScript 风格的注释。
- **(弃用)** - 使用 `.eslintrc`，可以使 JSON 也可以是 YAML。
- **package.json** - 在 `package.json` 里创建一个 `eslintConfig`属性，在那里定义你的配置。

#### 同一目录下 ESLint 的配置规则优先级

如果同一个目录下有多个配置文件，ESLint 只会使用一个。优先级顺序如下：

1. `.eslintrc.js`
2. `.eslintrc.yaml`
3. `.eslintrc.yml`
4. `.eslintrc.json`
5. `.eslintrc`
6. `package.json`

#### 不同目录下 ESLint 配置规则优先级

当使用 `.eslintrc.*` 和 `package.json`文件的配置时，你可以利用层叠配置。例如，假如你有以下结构：

```
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

层叠配置使用离要检测的文件最近的 `.eslintrc`文件作为最高优先级，然后才是父目录里的配置文件，等等。当你在这个项目中允许 ESLint 时，`lib/` 下面的所有文件将使用项目根目录里的 `.eslintrc` 文件作为它的配置文件。当 ESLint 遍历到 `test/` 目录，`your-project/.eslintrc` 之外，它还会用到 `your-project/tests/.eslintrc`。所以 `your-project/tests/test.js` 是基于它的目录层次结构中的两个`.eslintrc` 文件的组合，并且离的最近的一个优先。通过这种方式，你可以有项目级 ESLint 设置，也有覆盖特定目录的 ESLint 设置。

同样的，如果在根目录的 `package.json` 文件中有一个 `eslintConfig` 字段，其中的配置将使用于所有子目录，但是当 `tests` 目录下的 `.eslintrc` 文件中的规则与之发生冲突时，就会覆盖它。

```
your-project
├── package.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

如果同一目录下 `.eslintrc` 和 `package.json` 同时存在，`.eslintrc` 优先级高会被使用，`package.json` 文件将不会被使用。

**注意：**如果在你的主目录下有一个自定义的配置文件 (`~/.eslintrc`) ，如果没有其它配置文件时它才会被使用。因为个人配置将适用于用户目录下的所有目录和文件，包括第三方的代码，当 ESLint 运行时可能会导致问题。

默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果你想要你所有项目都遵循一个特定的约定时，这将会很有用，但有时候会导致意想不到的结果。为了将 ESLint 限制到一个特定的项目，在你项目根目录下的 `package.json` 文件或者 `.eslintrc.*` 文件里的 `eslintConfig` 字段下设置 `"root": true`。ESLint 一旦发现配置文件中有 `"root": true`，它就会停止在父级目录中寻找。

```json
{
    "root": true
}
```

### 1 配置项

**禁用持续查找（root）**默认情况下，ESLint将在根目录下的所有父文件夹中查找配置文件。该属性的作用是一旦发现了配置文件就停止对父文件夹的查找

[对于eslint配置的使用](http://eslint.cn/demo/#eyJ0ZXh0IjoiLy8gY29uc3QgYSA9IDFcbmNvbnNvbGUubG9nKHNlbGYpXG5jb25zb2xlLmxvZyhhKVxudmFyIHNldCA9IG5ldyBTZXQoKTtcbndpbmRvdy5hID0gJ25hbWUnIiwib3B0aW9ucyI6eyJwYXJzZXJPcHRpb25zIjp7ImVjbWFWZXJzaW9uIjo2LCJzb3VyY2VUeXBlIjoic2NyaXB0IiwiZWNtYUZlYXR1cmVzIjp7fX0sInJ1bGVzIjp7fSwiZW52Ijp7Im5vZGUiOnRydWV9fX0=)

具体的配置项包括,[参考](http://eslint.cn/docs/user-guide/configuring)

```json
{  
/*
  ESLint 允许你指定你想要支持的 JavaScript 语言选项。默认情况下，ESLint 支持 ECMAScript 5 语法。你可以覆盖该设置，以启用对 ECMAScript 其它版本和 JSX 的支持。

  请注意，支持 JSX 语法并不等同于支持 React。React 对 ESLint 无法识别的JSX语法应用特定的语义。如果你正在使用 React 并且想要 React 语义支持，我们建议你使用 eslint-plugin-react。

  同样的，支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）。对于 ES6 语法，使用 { "parserOptions": { "ecmaVersion": 6 } }；对于新的 ES6 全局变量，使用 { "env":{ "es6": true } }. { "env": { "es6": true } } 自动启用es6语法，但 { "parserOptions": { "ecmaVersion": 6 } } 不自动启用es6全局变量。*/
  "parserOptions":{
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
  //ESLint 默认使用Espree作为其解析器，你可以在配置文件中指定一个不同的解析器
  "parser":"esprima",
  //插件可以提供处理器。处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。或者处理器可以在预处理中转换 JavaScript 代码。
  "plugins": ["a-plugin"],
  "processor": "a-plugin/a-processor",
  //要为特定类型的文件指定处理器，请使用 overrides 键和 processor 键的组合。
  "overrides": [
    {
      "files": ["*.md"],
      "processor": "a-plugin/markdown"
    }
  ],
//或者通过 overrides 和 files 重写最外层的 rules 配置规则
  "overrides": [
      {
        "files": ["*-test.js","*.spec.js"],
        "rules": {
          "no-unused-expressions": "off"
        }
      }
    ],
  //一个环境定义了一组预定义的全局变量。当访问当前源文件内未定义的变量时，no-undef:2 规则将发出警告;比如如果设置 es6:false,那么ES6相关的全局变量，比如 Set 之类的就不能再代码中使用；如果设置browser:false,那么浏览器相关的全局变量，比如window则无法访问
  "env": {
    "browser": true,
    "node": true
  },
  //use 'readonly', 'writable', or 'off';对于每个全局变量键，将对应的值设置为 "writable" 以允许重写变量，或 "readonly" 不允许重写变量。字符串 "off" 禁用全局变量
  "global":{
      "Promise":"off"
  },
  //指定某些规则是否启用 0 = off, 1 = warn, 2 = error 
  "rules":{
    "no-var":"warn",
    "no-undef":2
  },
//extends 指定某个插件；
	extends: ['plugin:vue/base'], //
}

```

配置项中某些重要配置项详解

#### extends

`extends` 属性值可以是：

- 指定配置的字符串(配置文件的路径、可共享配置的名称、`eslint:recommended` 或 `eslint:all`)
- 字符串数组：每个配置继承它前面的配置

ESLint递归地扩展配置，因此基本配置也可以具有 `extends` 属性。`extends` 属性中的相对路径和可共享配置名从配置文件中出现的位置解析。

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

- `"off"` 或 `0` - 关闭规则
- `"warn"` 或 `1` - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- `"error"` 或 `2` - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

`rules` 属性可以做下面的任何事情以扩展（或覆盖）规则：

- 启用额外的规则
- 改变继承的规则级别而不改变它的选项：
  - 基础配置：`"eqeqeq": ["error", "allow-null"]` ; 
  - 派生的配置：`"eqeqeq": "warn"`
  - 最后生成的配置：`"eqeqeq": ["warn", "allow-null"]`
- 覆盖基础配置中的规则的选项
  - 基础配置：`"quotes": ["error", "single", "avoid-escape"]`
  - 派生的配置：`"quotes": ["error", "single"]`
  - 最后生成的配置：`"quotes": ["error", "single"]`

**基础配置**：可以理解为extends中药继承的配置

**派生配置**：可以理解为在开发项目中的配置文件

我们以 eeslint 中的 [semi配置](http://eslint.cn/docs/rules/semi)为例，比如如下配置：

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "semi":"warn"
  }
}
```

可以通过 `eslint-config-standard`中的源码看到这个基础配置中对于 `semi`的要求；

```
"semi": ["error", "never"],
```

然后我们在配置文件中增加了派生配置，然后会合成最终的配置；

```
"semi":["warn","never"]
```

1. 使用其他npm包的分享配置，比如我们使用 `eslint-config-standard` [源码在此](https://github.com/standard/eslint-config-standard)

   `extends` 属性值可以省略包名的前缀 `eslint-config-`。

```
extends: ['standard'],
```

2. 使用某个插件中的配置 `eslint-plugin-vue` [源码在此](https://github.com/vuejs/eslint-plugin-vue)

`plugins` [属性值](http://eslint.cn/docs/user-guide/configuring#configuring-plugins) 可以省略包名的前缀 `eslint-plugin-`。

`extends` 属性值可以由以下组成：

- `plugin:`
- 包名 (省略了前缀，比如，vue)
- `/`
- 配置名称 (比如 base)

根据 eslint 官网，[插件输出配置的规则](http://eslint.cn/docs/developer-guide/working-with-plugins#configs-in-plugins)

可以看到在 `eslint-plugin-vue`的源码中

```javascript
module.exports = {
  rules: {

  },
  configs: {
    'base': require('./configs/base'),
    'essential': require('./configs/essential'),
    'no-layout-rules': require('./configs/no-layout-rules'),
    'recommended': require('./configs/recommended'),
    'strongly-recommended': require('./configs/strongly-recommended')
  },
  processors: {
    '.vue': require('./processor')
  }
}
```

所以可以继承 `eslint-plugin-vue`这个插件的配置值为 `config`字段中的 key 值，即`base/essential/no-layout-rules/recommended/strongly-recommended`

```
extends: ['plugin:vue/base']
```

3. 使用一个配置文件

```json
{
    "extends": [
        "./node_modules/coding-standard/eslintDefaults.js",
        "./node_modules/coding-standard/.eslintrc-es6",
        "./node_modules/coding-standard/.eslintrc-jsx"
    ],
    "rules": {
        "eqeqeq": "warn"
    }
}
```

4. 使用eslint 内置的规则,可取值为 `eslint:recommended  、eslint:all  、`

```json
extends:"eslint:recommended"
```





### ESlint在文件中通过注释进行配置

使用以下格式对**文件**中具体的规则进行重写配置

```javascript
/* eslint eqeqeq: "off", curly: "error" */
```

```javascript
/*eslint no-undef:"off" */
console.log(a)
```

使用以下注释在整个文件范围禁止规则出现警告

```javascript
/* eslint-disable */
```

使用以下注释对某一行进行禁用所有规则

```javascript
alert('foo'); // eslint-disable-line
/* eslint-disable-next-line */
alert('foo');
```

### 3 ESLint 如何自动修复文件

在eslint 能找到 `.eslintrc.js` 或者其他配置文件的前提下

方案一：命令行的形式

```
eslint --fix [DIR]
```

方案二：vscode中的 ESLint 插件，每次保存的时候可以自动修复；

### 4 如何配置解析 .vue

核心是利用 `vue-eslint-parser`,[参考](https://github.com/mysticatea/vue-eslint-parser)

#### parserOptions.parser

You can use `parserOptions.parser` property to specify a custom parser to parse `` tags. Other properties than parser would be given to the specified parser. For example:

```json
{
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "babel-eslint",
        "sourceType": "module",
        "allowImportExportEverywhere": false
    }
}
{
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@typescript-eslint/parser"
    }
}
```

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/base'
  ],
  "parser": "vue-eslint-parser",
  //"parser": require.resolve('vue-eslint-parser'), 也是可以的
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser:"babel-eslint"
  },
  rules: {
    "semi":1
  }
}

```

或者继承 `eslint-plugin-vue` 的插件中的配置,而这个插件中的核心配置也是在源码中利用的 `vue-eslint-parser`

`eslint-plugin-vue/lib/configs/base.js`

```javascript
parser: require.resolve('vue-eslint-parser'),
```

```json
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/base'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser:"babel-eslint"
  },
  rules: {
    "semi":1
  }
}

```







参考

[深入浅出eslint](https://juejin.im/post/5bab946cf265da0ae92a75ca#heading-0)

[深入理解ESLint](https://juejin.im/post/5d3d3a685188257206519148)



[eslint-各个配置的rule详解](https://juejin.im/post/5afede99f265da0b82630af8)

[ESLint在大型团队中实践](https://www.infoq.cn/article/IAFSozFUqTWcTkoOlFTg)

