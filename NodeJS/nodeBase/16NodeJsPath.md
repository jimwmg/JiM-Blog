---
title：NodeJS-Path
---

### 1 path模块提供了一些工具函数，用于处理文件目录和路径

使用	

```java	
const path = require('path')
```

明确路径

绝对路径 ：

```javascript
import "/home/me/file";
import "C:\\Users\\me\\file";
```

相对路径

```javascript
import "../src/file1";
import "./file2";
```

### 2 API

#### path.resolve() ： 方法将路径或路径片段的序列解析为绝对路径

* 1 给定的路径序列从右到左进行处理，每个后续的 `path` 前置，**直到构造出一个绝对路径**。 例如，给定的路径片段序列：`/foo`、 `/bar`、 `baz`，调用 `path.resolve('/foo', '/bar', 'baz')` 将返回 `/bar/baz`。

* 2 如果在处理完所有给定的 `path` 片段之后还未生成绝对路径，则再加上当前工作目录。

* 3 生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。

* 4 零长度的 `path` 片段会被忽略。

* 5 如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径。

```javascript
console.log(path.resolve('/fo/barss','sfaf','./bar'))
console.log(path.resolve('/fo/barss','sfaf','/bar'))
console.log(path.resolve('/fo/barss','/sfaf','bar'))
console.log(path.resolve())
```

输出

```
/fo/barss/sfaf/bar
/bar
/sfaf/bar
/Users/didi/learn/learnSPace/08node/05fs  //工作目录
```



#### path.extname(): 获取路径的扩展名；

#### path.parse() : 分析路径的组成；

