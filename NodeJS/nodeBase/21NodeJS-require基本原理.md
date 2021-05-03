---
title:NodeJS-require基本原理

---

原文链接：https://mp.weixin.qq.com/s/98JBcFfACUV6JY2giuIqLA

#### 0.前置一些基础背景知识

在javascript中将字符串解析成js并且执行的方式可以理解为有以下几种（包括node）

01.New Function

```
new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

**`Function` 构造函数**创建一个新的 `Function` **对象**。直接调用此构造函数可用动态创建函数，但会遇到和 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)的安全问题和(相对较小的)性能问题。然而，与 `eval` 不同的是，`Function` 创建的函数只能在全局作用域中运行。

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function#参数)

- `arg1, arg2, ... arg*N*`

  被函数使用的参数的名称必须是合法命名的。参数名称是一个有效的JavaScript标识符的字符串，或者一个用逗号分隔的有效字符串的列表;例如“`×`”，“`theValue`”，或“`a,b`”。

- `functionBody`

  一个含有包括函数定义的 JavaScript 语句的**字符串**。

```
// 创建了一个能返回两个参数和的函数
const adder = new Function("a", "b", "return a + b");

// 调用函数
adder(2, 6);
```

由 `Function` 构造器创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访问全局变量和自己的局部变量，不能访问它们被 `Function` 构造器创建时所在的作用域的变量。这一点与使用 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 执行创建函数的代码不同。

```
var x = 10;

function createFunction1() {
    var x = 20;
    return new Function('return x;'); // 这里的 x 指向最上面全局作用域内的 x
}

function createFunction2() {
    var x = 20;
    function f() {
        return x; // 这里的 x 指向上方本地作用域内的 x
    }
    return f;
}

var f1 = createFunction1();
console.log(f1());          // 10
var f2 = createFunction2();
console.log(f2());          // 20
```

虽然这段代码可以在浏览器中正常运行，但在 Node.js 中 `f1()` 会产生一个“找不到变量 `x` ”的 `ReferenceError`。这是因为在 Node 中顶级作用域不是全局作用域，而 `x` 其实是在当前模块的作用域之中。



02.eval

`**eval()**` 函数会将传入的字符串当做 JavaScript 代码进行执行。

```javascript
console.log(eval('2 + 2'));
// expected output: 4

console.log(eval(new String('2 + 2')));
// expected output: 2 + 2

console.log(eval('2 + 2') === eval('4'));
```

如果你间接的使用 `eval()`，比如通过一个引用来调用它，而不是直接的调用 `eval`。 从 [ECMAScript 5](https://www.ecma-international.org/ecma-262/5.1/#sec-10.4.2) 起，它工作在全局作用域下，而不是局部作用域中。这就意味着，例如，下面的代码的作用声明创建一个全局函数，并且 `eval` 中的这些代码在执行期间不能在被调用的作用域中访问局部变量。

```javascript
function test() {
  var x = 2, y = 4;
  console.log(eval('x + y'));  // 直接调用，使用本地作用域，结果是 6
  var geval = eval; // 等价于在全局作用域调用
  console.log(geval('x + y')); // 间接调用，使用全局作用域，throws ReferenceError 因为`x`未定义
  (0, eval)('x + y'); // 另一个间接调用的例子
}
```

03 node中的vm模块

```js
const vm = require('vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // 上下文隔离化对象。

const code = 'x += 40; var y = 17;';
// `x` and `y` 是上下文中的全局变量。
// 最初，x 的值为 2，因为这是 context.x 的值。
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y 没有定义。
```

我们常说node并不是一门新的编程语言，他只是javascript的运行时，运行时你可以简单地理解为运行javascript的环境。在大多数情况下我们会在浏览器中去运行javascript，有了node的出现，我们可以在node中去运行javascript，这意味着哪里安装了node或者浏览器，我们就可以在哪里运行javascript。

#### 1.node模块化的实现

node中是自带模块化机制的，每个文件就是一个单独的模块，并且它遵循的是CommonJS规范，也就是使用require的方式导入模块，通过module.export的方式导出模块。

node模块的运行机制也很简单，其实就是在每一个模块外层包裹了一层函数，有了函数的包裹就可以实现代码间的作用域隔离。

你可能会说，我在写代码的时候并没有包裹函数呀，是的的确如此，这一层函数是node自动帮我们实现的，我们可以来测试一下。

我们新建一个js文件，在第一行打印一个并不存在的变量，比如我们这里打印window，在node中是没有window的。

```
console.log(window);
复制代码
```

通过node执行该文件，会发现报错信息如下。(请使用系统默认cmd执行命令)。

```
(function (exports, require, module, __filename, __dirname) { console.log(window);
ReferenceError: window is not defined
    at Object.<anonymous> (/Users/choice/Desktop/node/main.js:1:75)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)
复制代码
```

可以看到报错的顶层有一个自执行的函数，, 函数中包含exports, require, module, __filename, __dirname这些我们常用的全局变量。

我在之前的《前端模块化发展历程》一文中介绍过。自执行函数也是前端模块化的实现方案之一，在早期前端没有模块化系统的时代，自执行函数可以很好的解决命名空间的问题，并且模块依赖的其他模块都可以通过参数传递进来。cmd和amd规范也都是依赖自执行函数实现的。

在模块系统中，每个文件就是一个模块，每个模块外面会自动套一个函数，并且定义了导出方式 module.exports或者exports，同时也定义了导入方式require。

```
let moduleA = (function() {
    module.exports = Promise;
    return module.exports;
})();
复制代码
```

#### 2.require加载模块

require依赖node中的fs模块来加载模块文件，fs.readFile读取到的是一个字符串。

在javascrpt中我们可以通过eval或者new Function的方式来将一个字符串转换成js代码来运行。

- eval

```
const name = 'yd';
const str = 'const a = 123; console.log(name)';
eval(str); // yd;
复制代码
```

- new Function

new Function接收的是一个要执行的字符串，返回的是一个新的函数，调用这个新的函数字符串就会执行了。如果这个函数需要传递参数，可以在new Function的时候依次传入参数，最后传入的是要执行的字符串。比如这里传入参数b，要执行的字符串str。

```
const b = 3;
const str = 'let a = 1; return a + b';
const fun = new Function('b', str);
console.log(fun(b, str)); // 4
复制代码
```

可以看到eval和Function实例化都可以用来执行javascript字符串，似乎他们都可以来实现require模块加载。不过在node中并没有选用他们来实现模块化，原因也很简单因为他们都有一个致命的问题，就是都容易被不属于他们的变量所影响。

如下str字符串中并没有定义a，但是确可以使用上面定义的a变量，这显然是不对的，在模块化机制中，str字符串应该具有自身独立的运行空间，自身不存在的变量是不可以直接使用的。

```
const a = 1;

const str = 'console.log(a)';

eval(str);

const func = new Function(str);
func();
复制代码
```

node存在一个vm虚拟环境的概念，用来运行额外的js文件，他可以保证javascript执行的独立性，不会被外部所影响。

- vm 内置模块

虽然我们在外部定义了hello，但是str是一个独立的模块，并不在村hello变量，所以会直接报错。

```
// 引入vm模块， 不需要安装，node 自建模块
const vm = require('vm');
const hello = 'yd';
const str = 'console.log(hello)';
wm.runInThisContext(str); // 报错
复制代码
```

所以node执行javascript模块时可以采用vm来实现。就可以保证模块的独立性了。

#### 3.require代码实现

介绍require代码实现之前先来回顾两个node模块的用法，因为下面会用得到。

- path模块

用于处理文件路径。

basename: 基础路径, 有文件路径就不是基础路径，基础路劲是`1.js`

extname: 获取扩展名

dirname: 父级路劲

join: 拼接路径

resolve: 当前文件夹的绝对路径，注意使用的时候不要在结尾添加`/`

__dirname: 当前文件所在文件夹的路径

__filename: 当前文件的绝对路径

```
const path = require('path', 's');
console.log(path.basename('1.js'));
console.log(path.extname('2.txt'));
console.log(path.dirname('2.txt'));
console.log(path.join('a/b/c', 'd/e/f')); // a/b/c/d/e/
console.log(path.resolve('2.txt'));
复制代码
```

- fs模块

用于操作文件或者文件夹，比如文件的读写，新增，删除等。常用方法有readFile和readFileSync，分别是异步读取文件和同步读取文件。

```
const fs = require('fs');const buffer = fs.readFileSync('./name.txt', 'utf8'); // 如果不传入编码，出来的是二进制console.log(buffer);复制代码
```

fs.access: 判断是否存在，node10提供的，exists方法已经被废弃, 原因是不符合node规范，所以我们采用access来判断文件是否存在。

```
try {    fs.accessSync('./name.txt');} catch(e) {    // 文件不存在}复制代码
```

#### 4.手动实现require模块加载器

首先导入依赖的模块path，fs, vm, 并且创建一个Require函数，这个函数接收一个modulePath参数，表示要导入的文件路径。

```
// 导入依赖const path = require('path'); // 路径操作const fs = require('fs'); // 文件读取const vm = require('vm'); // 文件执行// 定义导入类，参数为模块路径function Require(modulePath) {    ...}复制代码
```

在Require中获取到模块的绝对路径，方便使用fs加载模块，这里读取模块内容我们使用new Module来抽象，使用tryModuleLoad来加载模块内容，Module和tryModuleLoad我们稍后实现，Require的返回值应该是模块的内容，也就是module.exports。

```
// 定义导入类，参数为模块路径function Require(modulePath) {    // 获取当前要加载的绝对路径    let absPathname = path.resolve(__dirname, modulePath);    // 创建模块，新建Module实例    const module = new Module(absPathname);    // 加载当前模块    tryModuleLoad(module);    // 返回exports对象    return module.exports;}复制代码
```

Module的实现很简单，就是给模块创建一个exports对象，tryModuleLoad执行的时候将内容加入到exports中，id就是模块的绝对路径。

```
// 定义模块, 添加文件id标识和exports属性function Module(id) {    this.id = id;    // 读取到的文件内容会放在exports中    this.exports = {};}复制代码
```

之前我们说过node模块是运行在一个函数中，这里我们给Module挂载静态属性wrapper，里面定义一下这个函数的字符串，wrapper是一个数组，数组的第一个元素就是函数的参数部分，其中有exports，module. Require，__dirname, __filename, 都是我们模块中常用的全局变量。注意这里传入的Require参数是我们自己定义的Require。

第二个参数就是函数的结束部分。两部分都是字符串，使用的时候我们将他们包裹在模块的字符串外部就可以了。

```
Module.wrapper = [    "(function(exports, module, Require, __dirname, __filename) {",    "})"]复制代码
```

_extensions用于针对不同的模块扩展名使用不同的加载方式，比如JSON和javascript加载方式肯定是不同的。JSON使用JSON.parse来运行。

javascript使用vm.runInThisContext来运行，可以看到fs.readFileSync传入的是module.id也就是我们Module定义时候id存储的是模块的绝对路径，读取到的content是一个字符串，我们使用Module.wrapper来包裹一下就相当于在这个模块外部又包裹了一个函数，也就实现了私有作用域。

使用call来执行fn函数，第一个参数改变运行的this我们传入module.exports，后面的参数就是函数外面包裹参数exports, module, Require, __dirname, __filename

```
Module._extensions = {    '.js'(module) {        const content = fs.readFileSync(module.id, 'utf8');        const fnStr = Module.wrapper[0] + content + Module.wrapper[1];        const fn = vm.runInThisContext(fnStr);        fn.call(module.exports, module.exports, module, Require,_filename,_dirname);    },    '.json'(module) {        const json = fs.readFileSync(module.id, 'utf8');        module.exports = JSON.parse(json); // 把文件的结果放在exports属性上    }}复制代码
```

tryModuleLoad函数接收的是模块对象，通过path.extname来获取模块的后缀名，然后使用Module._extensions来加载模块。

```
// 定义模块加载方法function tryModuleLoad(module) {    // 获取扩展名    const extension = path.extname(module.id);    // 通过后缀加载当前模块    Module._extensions[extension](module);}复制代码
```

至此Require加载机制我们基本就写完了，我们来重新看一下。Require加载模块的时候传入模块名称，在Require方法中使用`path.resolve(__dirname, modulePath)`获取到文件的绝对路径。然后通过new Module实例化的方式创建module对象，将模块的绝对路径存储在module的id属性中，在module中创建exports属性为一个json对象。

使用tryModuleLoad方法去加载模块，tryModuleLoad中使用`path.extname`获取到文件的扩展名，然后根据扩展名来执行对应的模块加载机制。

最终将加载到的模块挂载module.exports中。tryModuleLoad执行完毕之后module.exports已经存在了，直接返回就可以了。

```
// 导入依赖const path = require('path'); // 路径操作const fs = require('fs'); // 文件读取const vm = require('vm'); // 文件执行// 定义导入类，参数为模块路径function Require(modulePath) {    // 获取当前要加载的绝对路径    let absPathname = path.resolve(__dirname, modulePath);    // 创建模块，新建Module实例    const module = new Module(absPathname);    // 加载当前模块    tryModuleLoad(module);    // 返回exports对象    return module.exports;}// 定义模块, 添加文件id标识和exports属性function Module(id) {    this.id = id;    // 读取到的文件内容会放在exports中    this.exports = {};}// 定义包裹模块内容的函数Module.wrapper = [    "(function(exports, module, Require, __dirname, __filename) {",    "})"]// 定义扩展名，不同的扩展名，加载方式不同，实现js和jsonModule._extensions = {    '.js'(module) {        const content = fs.readFileSync(module.id, 'utf8');        const fnStr = Module.wrapper[0] + content + Module.wrapper[1];        const fn = vm.runInThisContext(fnStr);        fn.call(module.exports, module.exports, module, Require,_filename,_dirname);    },    '.json'(module) {        const json = fs.readFileSync(module.id, 'utf8');        module.exports = JSON.parse(json); // 把文件的结果放在exports属性上    }}// 定义模块加载方法function tryModuleLoad(module) {    // 获取扩展名    const extension = path.extname(module.id);    // 通过后缀加载当前模块    Module._extensions[extension](module);}复制代码
```

#### 5.给模块添加缓存

添加缓存也比较简单，就是文件加载的时候将文件放入缓存在，再去加载模块时先看缓存中是否存在，如果存在直接使用，如果不存在再去重新嘉爱，加载之后再放入缓存。

```
// 定义导入类，参数为模块路径function Require(modulePath) {    // 获取当前要加载的绝对路径    let absPathname = path.resolve(__dirname, modulePath);    // 从缓存中读取，如果存在，直接返回结果    if (Module._cache[absPathname]) {        return Module._cache[absPathname].exports;    }    // 尝试加载当前模块    tryModuleLoad(module);    // 创建模块，新建Module实例    const module = new Module(absPathname);    // 添加缓存    Module._cache[absPathname] = module;    // 加载当前模块    tryModuleLoad(module);    // 返回exports对象    return module.exports;}复制代码
```

#### 6.自动补全路径

自动给模块添加后缀名，实现省略后缀名加载模块，其实也就是如果文件没有后缀名的时候遍历一下所有的后缀名看一下文件是否存在。

```
// 定义导入类，参数为模块路径function Require(modulePath) {    // 获取当前要加载的绝对路径    let absPathname = path.resolve(__dirname, modulePath);    // 获取所有后缀名    const extNames = Object.keys(Module._extensions);    let index = 0;    // 存储原始文件路径    const oldPath = absPathname;    function findExt(absPathname) {        if (index === extNames.length) {           return throw new Error('文件不存在');        }        try {            fs.accessSync(absPathname);            return absPathname;        } catch(e) {            const ext = extNames[index++];            findExt(oldPath + ext);        }    }    // 递归追加后缀名，判断文件是否存在    absPathname = findExt(absPathname);    // 从缓存中读取，如果存在，直接返回结果    if (Module._cache[absPathname]) {        return Module._cache[absPathname].exports;    }    // 尝试加载当前模块    tryModuleLoad(module);    // 创建模块，新建Module实例    const module = new Module(absPathname);    // 添加缓存    Module._cache[absPathname] = module;    // 加载当前模块    tryModuleLoad(module);    // 返回exports对象    return module.exports;}复制代码
```

#### 7.分析实现步骤

- 1.导入相关模块，创建一个Require方法。
- 2.抽离通过Module._load方法，用于加载模块。
- 3.Module.resolveFilename 根据相对路径，转换成绝对路径。
- 4.缓存模块 Module._cache，同一个模块不要重复加载，提升性能。
- 5.创建模块 id: 保存的内容是 exports = {}相当于this。
- 6.利用tryModuleLoad(module, filename) 尝试加载模块。
- 7.Module._extensions使用读取文件。
- 8.Module.wrap: 把读取到的js包裹一个函数。
- 9.将拿到的字符串使用runInThisContext运行字符串。
- 10.让字符串执行并将this改编成exports。