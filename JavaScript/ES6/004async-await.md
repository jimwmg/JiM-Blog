---
title: async/await
date: 2018-04-10
categories: javascript
tags: sync
---

### 1 async函数的返回值是一个promise对象

```javascript
// 1 async函数没有返回值，那么该函数执行之后将会是一个resolved的 值为undefined的promise对象
var asyncFun = async function(){
}
console.log(asyncFun) //async函数
console.log(asyncFun()) //Promise {<resolved>: undefined}
// 2 async函数返回值，（不是promise对象），那么该函数执行之后，将会是一个resolved的，值为返回值的promise对象 
var asyncFun = async function(){
    return 111
}
console.log(asyncFun) //async函数
console.log(asyncFun()) //Promise {<resolved>: 111}
// 3 async函数返回一个promise对象
var asyncFun = async function(){
   return Promise.resolve('333');
}
asyncFun().then((v)=>{
    console.log(v)  // 333 
})
// 4 async函数返回一个await 命令
var asyncFun = async function(){
   return await 222 ; 
    // 如果await后面跟的不是promsie对象，那么会直接转化成一个resolved的promise对象,包括undefined,null等基本数据类型或者复杂数据类型，或者一个函数执行之后，默认返回值是undefined,此时也会直接转化为一个resolve的promise对象
}
asyncFun().then((v)=>{
    console.log(v)  // 222
})
```

async函数返回值 ：一个promise对象，该对象的状态是由什么确定的呢？

**显然应该是由该async函数内部的代码决定的**

根据上面的总结可以知道：

async函数返回的promise对象的状态由其内部的返回值决定，返回值包括三种

1. 返回值是一般值，那么该async函数直接转化为resolve的对象，如果后面有then函数可以直接执行then函数的回调
2. 返回值是一个promise对象：
   1. 该对象可以来自显示的promise对象，比如情况3
   2. 或者返回await命令 ，比如情况4
   3. 或者可以返回async函数（因为async函数执行后的返回值也是一个promise对象)

### 2 await  ： 结合await命令的使用

async/await 的结合，使得异步代码就像同步代码一样去执行，await后面如果是一个promise对象，那么await命令的返回值就是该promise对象resolve或者reject的值

```javascript
async function getData(){
    console.log('执行getData');
    const data2 = await getData2();
    const name = await getName();
    const age = await getAge();
// await后面跟async函数getData2的返回值，getData2,getName,getAge是一个函数，函数如果没有返回值，那么默认返回值是undefined
// 如果返回的是一个promise对象，那么（await 指令 +该函数） 返回值是这个promise的resolve或者reject的值
    console.log('data',data2,name,age);
}
function getName() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve('this is name');
        },1000)
    })
}
function getAge() {
    setTimeout(()=>{
        console.log('333')
    },3000)
    return 'this is age'
}
async function getData2() {
    console.log('执行getData2');
    const name = await getName();
    const age = await getAge();
    console.log('data2',name,age);
}
getData()
```

输出结果如下：

```javascript
执行getData
执行getData2
data2 this is name this is age
data undefined this is name this is age
333
333
```

### 3 对于async. await错误处理

1. 直接在async返回的promsie对象中进行错误处理；async函数返回值是一个promise对象，该对象的状态由内部执行的状态决定，如果内部遇到一个reject的promise，那么async的promise就直接reject

```javascript
async function getData(){
    console.log('执行getData');
    const name = await getName() // 这里reject之后，直接改变async函数返回值promsie的状态
    const age = await getAge();
}
function getName() {
    return new Promise((resolve,reject) => {
        reject('this is name');
    })
}
function getAge() {
    return 'this is age'
}
getData().then((res) => {
    console.log('getData resolved',res)
}).catch((res) => {
    console.log('getData reject',res)
})
```

```
执行 getData
getData reject this is name
```

```javascript
async function getData(){
    console.log('执行getData');
    const name = await getName() // 这里reject之后，直接改变async函数返回值promsie的状态
    const age = await getAge();
}
function getName() {
    return new Promise((resolve,reject) => {
        throw new Error('出错了');
    })
}
function getAge() {
    return 'this is age'
}
getData().then((res) => {
    console.log('getData resolved',res)
}).catch((res) => {
    console.log('getData reject',res)
})
```

```
执行 getData
getData reject Error: 出错了
```

```javascript
async function getData(){
    console.log('执行getData');
    const name = await getName() 
    const age = await getAge();
    // 在async函数内语句执行的时候，没有返回值，默认返回undefined,所有语句执行之后，没有遇到reject的promise,那么async函数返回的promsie就会自动resolve;但是由于async函数内语句没有返回值，所有resolve之后的回调函数参数是undefined
}
function getName() {
    return new Promise((resolve,reject) => {
        resolve('this is name');
    })
}
function getAge() {
    return 'this is age'
}
getData().then((res) => { // async函数内部语句执行的返回值会作为 async 返回的promsie对象value值
    console.log('getData resolved',res)
}).catch((res) => {
    console.log('getData reject',res)
})
```

```
执行 getData
getData resolve undefined
```

```javascript
async function getData(){
    console.log('执行getData');
    const name = await getName() 
    return  age = await getAge();
    // 这里返回一个值
}
function getName() {
    return new Promise((resolve,reject) => {
       resolve('this is name');
    })
}
function getAge() {
    return 'this is age'
}
getData().then((res) => { // async函数内部语句执行的返回值会作为 async 返回的promsie对象value值
    console.log('getData resolved',res)
}).catch((res) => {
    console.log('getData reject',res)
})
```

```
执行 getData
getData resolve this is age
```

2. 直接在async函数中通过try-catch进行错误处理

```javascript
async function getData(){
    console.log('执行getData');
    try{
        // 如果任何一个await后面的操作出现了错误，那么就直接返回该操作，下面的就不会在执行
      const name = await getName()
      const age = await getAge();
    }catch(e) {
      console.log('catch ',e)
    }
}
function getName() {
    return new Promise((resolve,reject) => {
       resolve('this is name');
    })
}
function getAge() {
    return 'this is age'
}
getData();//错误处理在getData函数内部通过try-catch捕获；如果这里仍然跟了then回调，那么这个promise状态也还是会改变的,then回调的函数也还是会根据promise状态的改变进行执行的；
```

```
执行 getData
catch this is name
```

