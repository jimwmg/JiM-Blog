---
title: async/await
---

### 1 概要理解

* async 函数的状态变化，由其内部代码决定，具体情况下面详细分析
* await 后面可以跟一个promsie对象，等待其resolve;
* await 后面可以跟一个 js. 数据(基本数据，复杂数据) ，会立即resolve;

### 2 async 函数返回一个promise 对象，该对象的状态改变是如何的？

```javascript
console.log('start')
async function async1() {
    console.log('1')
    // 默认返回undefined
}
// console.log(async1()) // 可以通过输出执行结果，看下promise状态是 resolved 的
async1().then((v) => {
    console.log('2',v)
}).catch(() => {
    console.log('3 error')
})
console.log('end')
```

```
start 
1 
end
2 undefined
```

```javascript
console.log('start')
async function async1() {
    console.log('1');
    return 'this async1 return '
    // 默认返回undefined
}
// console.log(async1()) // 可以通过输出执行结果，看下promise状态是 resolved 的
async1().then((v) => {
    console.log('2',v)
}).catch(() => {
    console.log('3 error')
})
console.log('end')
```

```
start 
1 
end
2 this async1 return 
```

### 3 进阶

```javascript
async function asyncFunction1() {
    console.log('1 start');
    const result = await 3; // 注意这里直接await一个数据，相当于会直接resolve，
    // 而这个resolve会在同步代码执行完毕之后，等待下次事件循环执行
    console.log('1 end');
    console.log('asyncFunction2 result',result)

  }
  // ok  开始
  console.log('0 script starts')
  setTimeout(function() {
    console.log('this is setTimeout');
  },0);
  asyncFunction1();
  new Promise((resolve,reject) => {
    console.log('3 promsie ');
    resolve();
  }).then(() => {
    console.log('4 promise');

  })
  console.log('5 script end ')
```

```
0 script starts
1 start
3 promsie 
5 script end 
1 end
asyncFunction2 result 3
4 promise
this is setTimeout
```

```javascript
async function asyncFunction1() {
    console.log('1 start');
    const result = await asyncFunction2(); //这里对比上面一个案例，唯一的区别就是，一个await  的是 js 数据类型，一个await 的是 promise对象；
    // 对于 js 数据类型，会直接resolve，所谓直接resolve,相当于将 await 下面的代码放入下次事件循环中
    // 对于 promise对象，则是将promise对象放入下次事件循环，等待该对象的promise，相当于产生了两次异步
    // 相同点就是 都会遇到 await 命令，跳出当前函数的执行，接着向下执行；
    console.log('1 end');
    console.log('asyncFunction2 result',result)
}
async function asyncFunction2() {
    console.log('2 start');
}
// ok  开始
console.log('0 script starts')
setTimeout(function() {
    console.log('this is setTimeout');
},0);
asyncFunction1();
new Promise((resolve,reject) => {
    console.log('3 promsie ');
    resolve();
}).then(() => {
    console.log('4 promise');

})
console.log('5 script end ')
```

```
0 script starts
1 start
2 start
3 promsie 
5 script end 
4 promise
1 end
asyncFunction2 result undefined
this is setTimeout
```

