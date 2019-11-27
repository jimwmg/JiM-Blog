---
title: async/await
date: 2018-05-18
categories: javascript
tags: sync
---

### 1 for循环中如果有 await , 那么请求将会阻塞

```javascript
function ajax(time) {
    return  new Promise((resolve,reject) => {
        console.log('send ajax')
        setTimeout(() => {
            console.log('ajax back')
            resolve('11')
        },time*2000)
    });
}
async function rescruse() {
    let promises = [];
    for(let i = 1 ; i < 4 ; i++) {
        const req = await ajax(i); // 注意这里await,会等待这个await得到结果才会执行下面的代码，以及下一个for循环，这里的返回值就是 ajax() 返回的promsie对象 resolve的值；
        console.log('sss',req);
        promises.push(req);
    }
    const res = await Promise.all(promises);
    console.log('res',res);
}
rescruse()
```

输出如下: 可以看到await会阻塞请求，每次请求会等待到上次请求的结果,每个send ajax后面都会间隔一段时间

```javascript
send ajax
ajax back
sss 11
send ajax
ajax back
sss 11
send ajax
ajax back
sss 11
res (3) ["11", "11", "11"]
```

在看一个类似的例子

```javascript
async function sleep(num){
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve()
      },num * 1000)
    })
  }
  async function startOne(i){
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        console.log(`startOne${i}`);
        resolve();
      },1500)
    })
  }
  async function startAll(){
    console.log('startall');
    for(let i = 0;i < 5 ; i++){
      await startOne(i);
    };
    await sleep(4);
    console.log('startAll-end')
  }
  startAll()
```

输出如下

```javascript
startall
startOne0  // 以下 0到5  没间隔 1500 ms 输出一次
startOne1
startOne2
startOne3
startOne4
// 2000 ms 之后
startAll-end
```



### 2 如果想要并发请求，那么可以用promise.all

```javascript
function ajax(time) {
    return  new Promise((resolve,reject) => {
        console.log('send ajax')
        setTimeout(() => {
            console.log('ajax back')
            resolve('11')
        },time*2000)
    });
}
async function rescruse() {
    let promises = [];
    for(let i = 1 ; i < 4 ; i++) {
        const req = ajax(i); // 注意这里和上面的不同，没有了await,那么就会直接返回ajax()执行后的结果，也就是一个promsie对象，处于pendding状态
        console.log('sss',req);
        promises.push(req);
    }
    const res = await Promise.all(promises);
    console.log('res',res);
}
rescruse()
```

```javascript
send ajax
sss Promise {<pending>}
send ajax
sss Promise {<pending>}
send ajax
sss Promise {<pending>}
ajax back
ajax back
ajax back
res (3) ["11", "11", "11"]
```

### 3 promise.all 源码在分析

```javascript
function promiseAll() {
    const res = Promise.all(['a','b','c'])
    console.log('promiseAll ret',res)
}
promiseAll();
```

输出如下

```javascript
promiseAll ret Promise(这个是Promise.all函数返回的新的promsie实例对象)
```

```javascript
async function promiseAll() {
    const res = await Promise.all(['a','b','c'])
    console.log('promiseAll ret',res)
}
promiseAll();
```

输出如下

```javascript
promiseAll ret ['a','b','c']
```

```javascript
Promise.all = function (arr) {
    //1 得到传进来的参数，转化为数组
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        //2 remaining用来标识是否所有的请求都成功了
        var remaining = args.length;
        for (var i = 0; i < args.length; i++) {
            //3 对所有的promsies数组中每个元素执行res方法
            res(i, args[i]);
        };
        //res方法执行两个作用
        //1 给每个promise注册onFulfilled和onRejected函数
        //2 注意传进去的onRejected函数，这就解释了为什么当某一个promise reject的时候Promise.all(promises)注册的onRejected函数会执行
        function res(i, val) {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
                if (val instanceof Promise && val.then === Promise.prototype.then) {
                    while (val._state === 3) {
                        val = val._value;
                    }
                    if (val._state === 1) return res(i, val._value);
                    if (val._state === 2) reject(val._value);
                    //Promise.all(promsies)执行的时候
                    val.then(function (val) {
                        res(i, val);
                    }, reject);
                    //第一轮给每个promises数组中的元素注册函数执行到此结束；
                    return;
                } else {
                    var then = val.then;
                    if (typeof then === 'function') {
                        var p = new Promise(then.bind(val));
                        p.then(function (val) {
                            res(i, val);
                        }, reject);
                        return;
                    }
                }
            }
            //这里当promises数组中每一个promsie状态变为resolved的时候，会执行res(i,val)==>res(i,val._value)==>args[i] = val 此时将异步请求成功的结果放入args数组中
            args[i] = val;
            //只有所有的promises数组中的每一个promise都异步成功了，才会进入这个if语句，进而resolve这个Promise.all(promsies)返回的promsie实例对象
            //只要有一个promsies数组中的promsie没有异步成功，就会reject这个Promise.all(promises)返回的promsie实例对象
            if (--remaining === 0) {
                resolve(args);
            }
        }
    });
};  

```

### 4 总结

async函数中，只要遇到await就会等待该函数promsie状态的变化；

```javascript
let as1 = async function(arg){
    console.log('as1',arg);
    //return new Promise((resolve,reject) => {}) //阻塞
}
let as2 = async function(){
    console.log('as2');
}
let run = async function(){
    for(let i = 0 ; i < 4 ; i++){
        await as1(i);
    }
    await as2();
}
run()
```

