---
title: String字符串API
---

### 1 字符串

日常开发中，字符串也是我们经常要操作的一种数据类型，比如查询字符串的拼接，又比如正则的一些替换等等等

### 2 正则相关

```javascript
// Match "quick brown" followed by "jumps", ignoring characters in between
// Remember "brown" and "jumps"
// Ignore case
var re = /quick\s(brown).+?(jumps)/ig;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
```

| 对象     | 属性/索引       | 描述                                                         | 例子                                          |
| -------- | --------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `result` | `[0]`           | 匹配的全部字符串                                             | `Quick Brown Fox Jumps`                       |
|          | `[1], ...[*n*]` | 括号中的分组捕获                                             | `[1] = Brown[2] = Jumps`                      |
|          | `index`         | 匹配到的字符位于原始字符串的基于0的索引值                    | `4`                                           |
|          | `input`         | 原始字符串                                                   | `The Quick Brown Fox Jumps Over The Lazy Dog` |
| `re`     | `lastIndex`     | 下一次匹配开始的位置                                         | `25`                                          |
|          | `ignoreCase`    | 是否使用了 "`i`" 标记使正则匹配忽略大小写                    | `true`                                        |
|          | `global`        | 是否使用了 "`g`" 标记来进行全局的匹配.                       | `true`                                        |
|          | `multiline`     | 是否使用了 "`m`" 标记使正则工作在多行模式（也就是，^ 和 $ 可以匹配字符串中每一行的开始和结束（行是由 \n 或 \r 分割的），而不只是整个输入字符串的最开始和最末尾处。） | `false`                                       |
|          | `source`        | 正则匹配的字符串                                             | `quick\s(brown).+?(jumps)`                    |



- `string.prototype.match`

如果正则表达式不是全局匹配，那么该方法会返回匹配数组,对应上表的result解释；

```javascript
let str = 'ee12s34e,5'
let reg = /\d([a-z])/;
let ret = str.match(reg); 
console.log(ret) //['2s','s',index:3,input:'ee12s34e,5']
```

如果正则表达式是全局匹配，g,那么该方法返回一个数组，包含了所有匹配的子字符串，而不是匹配对象；

```javascript
let str = 'ee12s34e,5'
let reg = /\d([a-z])/g;
let ret = str.match(reg);
console.log(ret)  //['2s','4e']
```

* `string.prototype.search`

如果匹配成功，则 `search()` 返回正则表达式在字符串中首次匹配项的索引。否则，返回 -1。

```javascript
let str = '123df';
let reg = /d/;
let ret = str.search(reg);
console.log(ret) //3 
//这个方法对应 正则的test方法；
console.log(reg.test(str));//true
```

* `string.prototype.replace`:方法返回一个由替换值替换一些或所有匹配的模式后的新字符串。模式可以是一个字符串或者一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp), 替换值可以是一个字符串或者一个每次匹配都要调用的函数。

**注意原字符串不变**,返回一个新的字符串； 

`str.replace(regexp|substr, newSubStr|function)`

- `regexp `(pattern)

  一个[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp) 对象或者其字面量。该正则所匹配的内容会被第二个参数的返回值替换掉。

- `substr `(pattern)

  一个要被 `newSubStr` `替换的`[`字符串`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)`。其被视为一整个字符串，而不是一个正则表达式。仅仅是第一个匹配会被替换。`

- `newSubStr` (replacement)

   用于替换掉第一个参数在原字符串中的匹配部分的[`字符串`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)。该字符串中可以内插一些特殊的变量名。参考下面的[使用字符串作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E4%BD%BF%E7%94%A8%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0)。

- `function` (replacement)

  一个用来创建新子字符串的函数，该函数的返回值将替换掉第一个参数匹配到的结果。参考下面的[指定一个函数作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E6%8C%87%E5%AE%9A%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0)。

| 变量名 | 代表的值                                                     |
| ------ | ------------------------------------------------------------ |
| `$$`   | 插入一个 "$"。                                               |
| `$&`   | 插入匹配的子串。                                             |
| `$``   | 插入当前匹配的子串左边的内容。                               |
| `$'`   | 插入当前匹配的子串右边的内容。                               |
| `$*n*` | 假如第一个参数是 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。 |

```javascript
var re = /(\w+)\s(\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1");
// Smith, John
console.log(newstr);
```

对于第二个参数是函数的情况:函数的参数如下，

| 变量名       | 代表的值                                                     |
| ------------ | ------------------------------------------------------------ |
| match        | 匹配的子串。（对应于上述的$&。）                             |
| `p1,p2, ...` | 假如replace()方法的第一个参数是一个[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp) 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。） |
| `offset`     | 匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串是“bc”，那么这个参数将是1） |
| string       | 被匹配的原字符串。                                           |



**如果正则表达式中没有括号，那么 传入的函数中不会有 p1 p2 p3 …之类的参数，match之后的参数就是 offset;**

需要注意：**如果正则表达式是全局匹配，那么后面的函数会被执行多次；另外，p1 p2 p3 那些值，是对应的正则表达式的第 n 个括号中的正则**

各位看官可以打下断点，然后看下match和key的值，以及是否全局匹配的时候，函数执行的次数；

```javascript
const template = 'hello${name},your age is ${age}';
const data = {name:'JiM',age:12}
function templateInject(template,data){
    return template.replace(/\$\{(.*?)\}/,function(match,key){
        debugger;
        return data[key] ? data[key] : '';
    })
}
let ret = templateInject(template,data)
console.log(ret) //helloJiM,your age is 12
```

###3 字符串复制相关（形成一个新的字符串返回）

* `string.prototype.slice (beginSlice[, endSlice])` 
* `string.prototype.concat()`  可以合并多个字符串
* `string.prototype.substring()` 
* `string.prototype.substr()`

### 4 判断字符串是否存在

* `string.prototype.indexOf(searchValue,fromIndex) `:返回所查找的字符出现的索引，如果找不到则返回 -1；
* `string.prototype.includes(searchValue,fromIndex)`:返回所查找字符串是否在字符串中，是则返回true,否则false;

### 5 字符串转化

* `string.prototype.split()` : 以传入的字符为分隔符，将字符串分割成相应的数组返回； 

### 6 Number类型的API

* `Number.isInteger() ` : 判断一个数字是否是整数
* `Number.isFinite()` : 判断一个数字是否无限大
* `Number.prototype.toFixed() ` :格式化一个数字有小数点后面有几位