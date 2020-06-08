### [原文出自：https://www.pandashen.com](https://link.juejin.im?target=https%3A%2F%2Fwww.pandashen.com%2F2018%2F08%2F06%2F20180806184412%2F)

由于tapable进行了更新，本文根据tapable 1.1.0进行重新改版，对源码模拟不太符合的地方进行修改，源码的实现中call方法的返回值需要注意下，主要做了一些修复；

**tapable "version": "1.1.0"**

## 前言

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器，是对前端项目实现自动化和优化必不可少的工具，Webpack 的 `loader`（加载器）和 `plugin`（插件）是由 Webpack 开发者和社区开发者共同贡献的，而目前又没有比较系统的开发文档，想写加载器和插件必须要懂 Webpack 的原理，即看懂 Webpack 的源码，`tapable` 则是 Webpack 依赖的核心库，可以说不懂 `tapable` 就看不懂 Webpack 源码，所以本篇会对 `tapable` 提供的类进行解析和模拟。

## tapable 介绍

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 `tapable`，Webpack 中最核心的，负责编译的 `Compiler` 和负责创建 `bundles` 的 `Compilation` 都是 `tapable` 构造函数的实例。

打开 Webpack `4.0` 的源码中一定会看到下面这些以 `Sync`、`Async` 开头，以 `Hook` 结尾的方法，这些都是 `tapable` 核心库的类，为我们提供不同的事件流执行机制，我们称为 “钩子”。

```javascript
// 引入 tapable 如下
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
 } = require("tapable");
复制代码
```

**上面的实现事件流机制的 “钩子” 大方向可以分为两个类别，“同步” 和 “异步”，“异步” 又分为两个类别，“并行” 和 “串行”，而 “同步” 的钩子都是串行的。**

## Sync 类型的钩子

### 1、SyncHook

`SyncHook` 为串行同步执行，不关心事件处理函数的返回值，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数。

```javascript
// SyncHook 钩子的使用
const { SyncHook } = require("tapable");

// 创建实例
let syncHook = new SyncHook(["name", "age"]);

// 注册事件
syncHook.tap("1", (name, age) => console.log("1", name, age));
syncHook.tap("2", (name, age) => console.log("2", name, age));
syncHook.tap("3", (name, age) => console.log("3", name, age));

// 触发事件，让监听函数执行
syncHook.call("panda", 18);

// 1 panda 18
// 2 panda 18
// 3 panda 18
复制代码
```

在 `tapable` 解构的 `SyncHook` 是一个类，注册事件需先创建实例，创建实例时支持传入一个数组，数组内存储事件触发时传入的参数，实例的 `tap` 方法用于注册事件，支持传入两个参数，第一个参数为事件名称，在 Webpack 中一般用于存储事件对应的插件名称（名字随意，只是起到注释作用）， 第二个参数为事件处理函数，函数参数为执行 `call` 方法触发事件时所传入的参数的形参。

```javascript
// 模拟 SyncHook 类
class SyncHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tap(name, task) {
        this.tasks.push(task);
    }
    call(...args) {
        // 也可在参数不足时抛出异常
        if (args.length < this.args.length) throw new Error("参数不足");

        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 依次执行事件处理函数
        this.tasks.forEach(task => task(...args));
    }
}
复制代码
```

`tasks` 数组用于存储事件处理函数，`call` 方法调用时传入参数超过创建 `SyncHook` 实例传入的数组长度时，多余参数可处理为 `undefined`，也可在参数不足时抛出异常，不灵活，后面的例子中就不再这样写了。

### 2、SyncBailHook

`SyncBailHook` 同样为串行同步执行，如果事件处理函数执行时有一个返回值不为`undefined`，则跳过剩下未执行的事件处理函数（如类的名字，意义在于保险）`call`函数执行之后会返回这个事件函数的返回值。

```javascript
// SyncBailHook 钩子的使用
const { SyncBailHook } = require("tapable");

// 创建实例
let syncBailHook = new SyncBailHook(["name", "age"]);

// 注册事件
syncBailHook.tap("1", (name, age) => console.log("1", name, age));

syncBailHook.tap("2", (name, age) => {
    console.log("2", name, age);
    return "2";
});

syncBailHook.tap("3", (name, age) => console.log("3", name, age));

// 触发事件，让监听函数执行
syncBailHook.call("panda", 18);

// 1 panda 18
// 2 panda 18
复制代码
```

通过上面的用法可以看出，`SyncHook` 和 `SyncBailHook` 在逻辑上只是 `call` 方法不同，导致事件的执行机制不同，对于后面其他的 “钩子”，也是 `call` 的区别，接下来实现 `SyncBailHook` 类。

```javascript
// 模拟 SyncBailHook 类
class SyncBailHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tap(name, task) {
        this.tasks.push(task);
    }
    call(...args) {
        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 依次执行事件处理函数，如果返回值不为空，则停止向下执行
        let i = 0, ret;
        do {
            ret = this.tasks[i++](...args);
        } while (ret !== undefined);
        return ret; //优化和源码不同
    }
}
复制代码
```

在上面代码的 `call` 方法中，我们设置返回值为 `ret`，第一次执行后没有返回值则继续循环执行，如果有返回值则立即停止循环，即实现 “保险” 的功能。

### 3、SyncWaterfallHook

`SyncWaterfallHook` 为串行同步执行，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推，正因如此，只有第一个事件处理函数的参数可以通过 `call` 传递，而 `call` 的返回值为最后一个事件处理函数的返回值。

```javascript
// SyncWaterfallHook 钩子的使用
const { SyncWaterfallHook } = require("tapable");

// 创建实例
let syncWaterfallHook = new SyncWaterfallHook(["name", "age"]);

// 注册事件
syncWaterfallHook.tap("1", (name, age) => {
    console.log("1", name, age);
    return "1";
});

syncWaterfallHook.tap("2", data => {
    console.log("2", data);
    return "2";
});

syncWaterfallHook.tap("3", data => {
    console.log("3", data);
    return "3"
});

// 触发事件，让监听函数执行
let ret = syncWaterfallHook.call("panda", 18);
console.log("call", ret);

// 1 panda 18
// 2 1
// 3 2
// call 3
复制代码
```

`SyncWaterfallHook` 名称中含有 “瀑布”，通过上面代码可以看出 “瀑布” 形象生动的描绘了事件处理函数执行的特点，与 `SyncHook` 和 `SyncBailHook` 的区别就在于事件处理函数返回结果的流动性，接下来看一下 `SyncWaterfallHook` 类的实现。

```javascript
// 模拟 SyncWaterfallHook 类
class SyncWaterfallHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tap(name, task) {
        this.tasks.push(task);
    }
    call(...args) {
        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 依次执行事件处理函数，事件处理函数的返回值作为下一个事件处理函数的参数
        return (this.tasks || []).reduce((args,task) => {
            return task(...args)
        },args)
        //call 函数的返回值是 reduce 累计的结果；
    }
}
复制代码
```

上面代码中 `call` 的逻辑是将存储事件处理函数的 `tasks` 拆成两部分，分别为第一个事件处理函数，和存储其余事件处理函数的数组，使用 `reduce` 进行归并，将第一个事件处理函数执行后的返回值作为归并的初始值，依次调用其余事件处理函数并传递上一次归并的返回值。

### 4、SyncLoopHook

`SyncLoopHook` 为串行同步执行，事件处理函数返回 `true` 表示继续循环，即循环执行当前事件处理函数，返回 `undefined` 表示结束循环，`SyncLoopHook` 与 `SyncBailHook` 的循环不同，`SyncBailHook` 只决定是否继续向下执行后面的事件处理函数，而 `SyncLoopHook` 的循环是指循环执行每一个事件处理函数，直到返回 `undefined` 为止，才会继续向下执行其他事件处理函数，执行机制同理。

```javascript
// SyncLoopHook 钩子的使用
const { SyncLoopHook } = require("tapable");

// 创建实例
let syncLoopHook = new SyncLoopHook(["name", "age"]);

// 定义辅助变量
let total1 = 0;
let total2 = 0;

// 注册事件
syncLoopHook.tap("1", (name, age) => {
    console.log("1", name, age, total1);
    return total1++ < 2 ? true : undefined;
});

syncLoopHook.tap("2", (name, age) => {
    console.log("2", name, age, total2);
    return total2++ < 2 ? true : undefined;
});

syncLoopHook.tap("3", (name, age) => console.log("3", name, age));

// 触发事件，让监听函数执行
syncLoopHook.call("panda", 18);

// 1 panda 18 0
// 1 panda 18 1
// 1 panda 18 2
// 2 panda 18 0
// 2 panda 18 1
// 2 panda 18 2
// 3 panda 18
复制代码
```

**只有当函数返回值严格等于 undefined 的时候才会终止当前循环,只要返回值不是 undefind 就会继续循环，即使返回值为false  null 等 falsely的值**

在了解 `SyncLoopHook` 的执行机制以后，我们接下来看看 `SyncLoopHook` 的 `call` 方法是如何实现的。

```javascript
// 模拟 SyncLoopHook 类
class SyncLoopHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tap(name, task) {
        this.tasks.push(task);
    }
    call(...args) {
        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 依次执行事件处理函数，如果返回值为 true，则继续执行当前事件处理函数
        // 直到返回 undefined，则继续向下执行其他事件处理函数
        this.tasks.forEach(task => {
            let ret;
            do {
                ret = this.task(...args);
            } while (ret !== undefined);
        });
    }
}
复制代码
```

在上面代码中可以看到 `SyncLoopHook` 类 `call` 方法的实现更像是 `SyncHook` 和 `SyncBailHook` 的 `call` 方法的结合版，外层循环整个 `tasks` 事件处理函数队列，内层通过返回值进行循环，控制每一个事件处理函数的执行次数。

**注意：在 Sync 类型 “钩子” 下执行的插件都是顺序执行的，只能使用 tab 注册。**

------

## Async 类型的钩子

**Async 类型可以使用 tap、tapSync 和 tapPromise 注册不同类型的插件 “钩子”，分别通过 call、callAsync 和 promise 方法调用，我们下面会针对 AsyncParallelHook 和 AsyncSeriesHook 的 async 和 promise 两种方式分别介绍和模拟。**

### 1、AsyncParallelHook

`AsyncParallelHook` 为异步并行执行，通过 `tapAsync` 注册的事件，通过 `callAsync` 触发，通过 `tapPromise` 注册的事件，通过 `promise` 触发（返回值可以调用 `then` 方法）。

#### (1) tapAsync/callAsync

`callAsync` 的最后一个参数为回调函数，在所有事件处理函数执行完毕后执行。

```javascript
// AsyncParallelHook 钩子：tapAsync/callAsync 的使用
const { AsyncParallelHook } = require("tapable");

// 创建实例
let asyncParallelHook = new AsyncParallelHook(["name", "age"]);//注意这里 done 之所以是第三个参数传入，是因为这里预定了两个参数

// 注册事件
console.time("time");
asyncParallelHook.tapAsync("1", (name, age, done) => {
    setTimeout(() => {
        console.log("1", name, age, new Date());
        done();//在每次异步完成之后要调用这个函数，如果有任何一个 tapAsync回调函数中没有执行 done，那么 callAsync的回调函数就不会执行；
    }, 1000);
});

asyncParallelHook.tapAsync("2", (name, age, done) => {
    setTimeout(() => {
        console.log("2", name, age, new Date());
        done();
    }, 2000);
});

asyncParallelHook.tapAsync("3", (name, age, done) => {
    setTimeout(() => {
        console.log("3", name, age, new Date());
        done();
        console.timeEnd("time");
    }, 3000);
});

// 触发事件，让监听函数执行
asyncParallelHook.callAsync("panda", 18, () => 
//如果有任何一个 tapAsync 回调函数中没有执行 done，那么这个callAsync的回调函数就不会执行；complete不会被输出；
    console.log("complete");
});

// 1 panda 18 2018-08-07T10:38:32.675Z
// 2 panda 18 2018-08-07T10:38:33.674Z
// 3 panda 18 2018-08-07T10:38:34.674Z
// complete
// time: 3005.060ms
复制代码
```

**异步并行是指，事件处理函数内三个定时器的异步操作最长时间为 3s，而三个事件处理函数执行完成总共用时接近 3s，所以三个事件处理函数是几乎同时执行的，不需等待。**

所有 `tabAsync` 注册的事件处理函数最后一个参数都为一个回调函数 `done`，每个事件处理函数在异步代码执行完毕后调用 `done` 函数，则可以保证 `callAsync` 会在所有异步函数都执行完毕后执行，接下来看一看 `callAsync` 是如何实现的。

```javascript
// 模拟 AsyncParallelHook 类：tapAsync/callAsync
class AsyncParallelHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tabAsync(name, task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        // 先取出最后传入的回调函数
        let finalCallback = args.pop();

        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 定义一个 i 变量和 done 函数，每次执行检测 i 值和队列长度，决定是否执行 callAsync 的回调函数
        let i = 0;
        let done = () => {
            if (++i === this.tasks.length) {
                finalCallback();
            }
        };

        // 依次执行事件处理函数
        this.tasks.forEach(task => task(...args, done));
    }
}
复制代码
```

在 `callAsync` 中，将最后一个参数（所有事件处理函数执行完毕后执行的回调）取出，并定义 `done` 函数，通过比较 `i` 和存储事件处理函数的数组 `tasks` 的 `length` 来确定回调是否执行，循环执行每一个事件处理函数并将 `done` 作为最后一个参数传入，所以每个事件处理函数内部的异步操作完成时，执行 `done` 就是为了检测是不是该执行 `callAsync` 的回调，当所有事件处理函数均执行完毕满足 `done` 函数内部 `i` 和 `length` 相等的条件时，则调用 `callAsync` 的回调。如果有任何一个 `tapAsync`回调函数中没有执行 `done`，那么 `callAsync`的回调函数就不会执行；

#### (2) tapPromise/promise

要使用 `tapPromise` 注册事件，对事件处理函数有一个要求，必须返回一个 Promise 实例，而 `promise` 方法也返回一个 Promise 实例，`callAsync` 的回调函数在 `promise` 方法中用 `then` 的方式代替。

```javascript
// AsyncParallelHook 钩子：tapPromise/promise 的使用
const { AsyncParallelHook } = require("tapable");

// 创建实例
let asyncParallelHook = new AsyncParallelHook(["name", "age"]);

// 注册事件
console.time("time");
asyncParallelHook.tapPromise("1", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("1", name, age, new Date());
            resolve("1");
        }, 1000);
    });
});

asyncParallelHook.tapPromise("2", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("2", name, age, new Date());
            resolve("2");
        }, 2000);
    });
});

asyncParallelHook.tapPromise("3", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("3", name, age, new Date());
            resolve("3");
            console.timeEnd("time");
        }, 3000);
    });
});

// 触发事件，让监听函数执行
asyncParallelHook.promise("panda", 18).then(ret => {
    console.log(ret);
}).catch((ret) => {
    console.log('catch',ret)
});

// 1 panda 18 2018-08-07T12:17:21.741Z
// 2 panda 18 2018-08-07T12:17:22.736Z
// 3 panda 18 2018-08-07T12:17:23.739Z
// time: 3006.542ms
// [ '1', '2', '3' ]
复制代码
```

上面每一个 `tapPromise` 注册事件的事件处理函数都返回一个 Promise 实例，并将返回值传入 `resolve` 方法，调用 `promise` 方法触发事件时，如果所有事件处理函数返回的 Promise 实例结果都成功，会将结果存储在数组中，并作为参数传递给 `promise` 的 `then` 方法中成功的回调，如果有一个失败就是将失败的结果返回作为参数传递给失败的回调。

```javascript
// 模拟 AsyncParallelHook 类 tapPromise/promise
class AsyncParallelHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tapPromise(name, task) {
        this.tasks.push(task);
    }
    promise(...args) {
        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 将所有事件处理函数转换成 Promise 实例，并发执行所有的 Promise
        return Promise.all(this.tasks.map(task => task(...args)));
    }
}
复制代码
```

其实根据上面对于 `tapPromise` 和 `promise` 使用的描述就可以猜到，`promise` 方法的逻辑是通过 `Promise.all` 来实现的。

### 2、AsyncSeriesHook

`AsyncSeriesHook` 为异步串行执行，与 `AsyncParallelHook` 相同，通过 `tapAsync` 注册的事件，通过 `callAsync` 触发，通过 `tapPromise` 注册的事件，通过 `promise` 触发，可以调用 `then` 方法。

#### (1) tapAsync/callAsync

与 `AsyncParallelHook` 的 `callAsync` 方法类似，`AsyncSeriesHook` 的 `callAsync` 方法也是通过传入回调函数的方式，在所有事件处理函数执行完毕后执行 `callAsync` 的回调函数。

```javascript
// AsyncSeriesHook 钩子：tapAsync/callAsync 的使用
const { AsyncSeriesHook } = require("tapable");

// 创建实例
let asyncSeriesHook = new AsyncSeriesHook(["name", "age"]);

// 注册事件
console.time("time");
asyncSeriesHook.tapAsync("1", (name, age, next) => {
    settimeout(() => {
        console.log("1", name, age, new Date());
        next(); //next函数的调用时机很重要，这个必须在每个异步执行之后再调用才能达到异步串行的效果；
    }, 1000);
});

asyncSeriesHook.tapAsync("2", (name, age, next) => {
    settimeout(() => {
        console.log("2", name, age, new Date());
        next();
    }, 2000);
});

asyncSeriesHook.tapAsync("3", (name, age, next) => {
    settimeout(() => {
        console.log("3", name, age, new Date());
        next();
        console.timeEnd("time");
    }, 3000);
});

// 触发事件，让监听函数执行
asyncSeriesHook.callAsync("panda", 18, () => {
    console.log("complete");
});

// 1 panda 18 2018-08-07T14:40:52.896Z
// 2 panda 18 2018-08-07T14:40:54.901Z
// 3 panda 18 2018-08-07T14:40:57.901Z
// complete
// time: 6008.790ms
复制代码
```

**异步串行是指，事件处理函数内三个定时器的异步执行时间分别为 1s、2s 和 3s，而三个事件处理函数执行完总共用时接近 6s，所以三个事件处理函数执行是需要排队的，必须一个一个执行，当前事件处理函数执行完才能执行下一个。**

**但是也要注意一点，异步串行的执行顺序是严格和程序员代码写的有关联的，如果要达到异步串行的结果，你必须在每个异步执行  #之后#   手动调用next函数**

**注意区分 ：done仅仅维护一个是否执行  callAsync 回调的标记，而next则是决定是否决定执行下一个事件任务；只有在所有的事件任务都执行完毕了才会执行callAsync中的回调；**

`AsyncSeriesHook` 类的 `tabAsync` 方法注册的事件处理函数参数中的 `next` 可以与 `AsyncParallelHook` 类中 `tabAsync` 方法参数的 `done` 进行类比，同为回调函数，不同点在于 `AsyncSeriesHook` 与 `AsyncParallelHook` 的 `callAsync` 方法的 “并行” 和 “串行” 的实现方式。

**如果通过 AsyncSeriesHook.tap注册了事件，那么也只能通过AsyncSeriesHook.callAsync来触发执行，效果和SyncHook是一样的；**

```javascript
// 模拟 AsyncSeriesHook 类：tapAsync/callAsync
class AsyncSeriesHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tabAsync(name, task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        // 先取出最后传入的回调函数
        let finalCallback = args.pop();

        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 定义一个 i 变量和 next 函数，每次取出一个事件处理函数执行，并维护 i 的值
        // 直到所有事件处理函数都执行完，调用 callAsync 的回调
        // 如果事件处理函数中没有调用 next，则无法继续
        let i = 0;
        let next = () => {
            let task = this.tasks[i++];
            task ? task(...args, next) : finalCallback();
        };
        next();
    }
}
复制代码
```

`AsyncParallelHook` 是通过循环依次执行了所有的事件处理函数，`done` 方法只为了检测是否已经满足条件执行 `callAsync` 的回调，如果中间某个事件处理函数没有调用 `done`，只是不会调用 `callAsync` 的回调，但是所有的事件处理函数都执行了。

而 `AsyncSeriesHook` 的 `next` 执行机制更像 `Express` 和 `Koa` 中的中间件，在注册事件的回调中如果不调用 `next`，则在触发事件时会在没有调用 `next` 的事件处理函数的位置 “卡死”，即不会继续执行后面的事件处理函数，只有都调用 `next` 才能继续，而最后一个事件处理函数中调用 `next` 决定是否调用 `callAsync` 的回调。

#### (2) tapPromise/promise

与 `AsyncParallelHook` 类似，`tapPromise` 注册事件的事件处理函数需要返回一个 Promise 实例，`promise` 方法最后也返回一个 Promise 实例。

```javascript
// AsyncSeriesHook 钩子：tapPromise/promise 的使用
const { AsyncSeriesHook } = require("tapable");

// 创建实例
let asyncSeriesHook = new AsyncSeriesHook(["name", "age"]);

// 注册事件
console.time("time");
asyncSeriesHook.tapPromise("1", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("1", name, age, new Date());
            resolve("1");
        }, 1000);
    });
});

asyncSeriesHook.tapPromise("2", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("2", name, age, new Date());
            resolve("2");
        }, 2000);
    });
});

asyncParallelHook.tapPromise("3", (name, age) => {
    return new Promise((resolve, reject) => {
        settimeout(() => {
            console.log("3", name, age, new Date());
            resolve("3");
            console.timeEnd("time");
        }, 3000);
    });
});

// 触发事件，让监听函数执行
asyncSeriesHook.promise("panda", 18).then(ret => {
    console.log(ret);
});

// 1 panda 18 2018-08-07T14:45:52.896Z
// 2 panda 18 2018-08-07T14:45:54.901Z
// 3 panda 18 2018-08-07T14:45:57.901Z
// time: 6014.291ms
// [ '1', '2', '3' ]
复制代码
```

分析上面的执行过程，所有的事件处理函数都返回了 Promise 的实例，如果想实现 “串行”，则需要让每一个返回的 Promise 实例都调用 `then`，并在 `then` 中执行下一个事件处理函数，这样就保证了只有上一个事件处理函数执行完后才会执行下一个。

```javascript
// 模拟 AsyncSeriesHook 类 tapPromise/promise
class AsyncSeriesHook {
    constructor(args) {
        this.args = args;
        this.tasks = [];
    }
    tapPromise(name, task) {
        this.tasks.push(task);
    }
    promise(...args) {
        // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
        args = args.slice(0, this.args.length);

        // 将每个事件处理函数执行并调用返回 Promise 实例的 then 方法
        // 让下一个事件处理函数在 then 方法成功的回调中执行
        let [first, ...others] = this.tasks;
        return (this.tasks || []).reduce((args,task) => {
            return task(...args)
        },args)
        return others.reduce((promise, task) => {
            return promise.then(() => task(...args));
        }, first(...args));
    }
}
复制代码
```

上面代码中的 “串行” 是使用 `reduce` 归并来实现的，首先将存储所有事件处理函数的数组 `tasks` 解构成两部分，第一个事件处理函数和存储其他事件处理函数的数组 `others`，对 `others` 进行归并，将第一个事件处理函数执行后返回的 Promise 实例作为归并的初始值，这样在归并的过程中上一个值始终是上一个事件处理函数返回的 Promise 实例，可以直接调用 `then` 方法，并在 `then` 的回调中执行下一个事件处理函数，直到归并完成，将 `reduce` 最后返回的 Promise 实例作为 `promise` 方法的返回值，则实现 `promise` 方法执行后继续调用 `then` 来实现后续逻辑。

## 对其他异步钩子补充

在上面 `Async` 异步类型的 “钩子中”，我们只着重介绍了 “串行” 和 “并行”（`AsyncParallelHook` 和 `AsyncSeriesHook`）以及回调和 Promise 的两种注册和触发事件的方式，还有一些其他的具有一定特点的异步 “钩子” 我们并没有进行分析，因为他们的机制与同步对应的 “钩子” 非常的相似。

`AsyncParallelBailHook` 和 `AsyncSeriesBailHook` 分别为异步 “并行” 和 “串行” 执行的 “钩子”，返回值不为 `undefined`，即有返回值，则立即停止向下执行其他事件处理函数，实现逻辑可结合 `AsyncParallelHook` 、`AsyncSeriesHook` 和 `SyncBailHook`。

`AsyncSeriesWaterfallHook` 为异步 “串行” 执行的 “钩子”，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，实现逻辑可结合 `AsyncSeriesHook` 和 `SyncWaterfallHook`。

## 总结

在 `tapable` 源码中，注册事件的方法 `tab`、`tapSync`、`tapPromise` 和触发事件的方法 `call`、`callAsync`、`promise` 都是通过 `compile` 方法快速编译出来的，我们本文中这些方法的实现只是遵照了 `tapable` 库这些 “钩子” 的事件处理机制进行了模拟，以方便我们了解 `tapable`，为学习 Webpack 原理做了一个铺垫，在 Webpack 中，这些 “钩子” 的真正作用就是将通过配置文件读取的插件与插件、加载器与加载器之间进行连接，“并行” 或 “串行” 执行，相信在我们对 `tapable` 中这些 “钩子” 的事件机制有所了解之后，再重新学习 Webpack 的源码应该会有所头绪。





[tapable-0.29源码](https://www.cnblogs.com/xiaokebb/p/8418905.html)

[tapable-案例](https://juejin.im/post/5be90b84e51d457c1c4df852)