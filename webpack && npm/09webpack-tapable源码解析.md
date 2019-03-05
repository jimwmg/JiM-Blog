---

---

### 1 tapable钩子

| 序号 | 钩子名称                 | 执行方式  | 使用要点                                                     |
| ---- | ------------------------ | :------: | ------------------------------------------------------------ |
| 1    | SyncHook                 | 同步串行 | 不关心监听函数的返回值                                       |
| 2    | SyncBailHook             | 同步串行 | 只要监听函数中有一个函数的有返回值且返回值不为 undefined(函数默认返回undefiend)，则跳过剩下所有的逻辑,  call 函数返回值为第一个有返回值的函数的返回值； |
| 3    | SyncWaterfallHook        | 同步串行 | 上一个监听函数的返回值可以传给下一个监听函数，call 函数的返回值是最后一个函数的返回值； |
| 4    | SyncLoopHook             | 同步循环 | 当监听函数被触发的时候，如果该监听函数返回值不是严格等于 `undefined`，则会循环执行这个函数；如果返回 `undefined` 则表示退出当前函数循，执行下一个函数； |
| 5    | AsyncParallelHook        | 异步并发 | 不关心监听函数的返回值,所有的异步同时执行，但是callAsync的回调是否执行则取决于 是否在 `tabAsync`的回调中执行了 `done`函数 |
| 6    | AsyncParallelBailHook    | 异步并发 | 只要监听函数的返回值不为 `undefined`，就会忽略后面的监听函数执行，直接跳跃到`callAsync`等触发函数绑定的回调函数，然后执行这个被绑定的回调函数 |
| 7    | AsyncSeriesHook          | 异步串行 | 不关系`callback()`的参数                                     |
| 8    | AsyncSeriesBailHook      | 异步串行 | `callback()`的参数不为`null`，就会直接执行`callAsync`等触发函数绑定的回调函数 |
| 9    | AsyncSeriesWaterfallHook | 异步串行 | 上一个监听函数的中的`callback(err, data)`的第二个参数,可以作为下一个监听函数的参数 |

对于异步钩子，如果通过 `tap`添加事件回调，那么效果是和 `SyncHook`是一样的；