---
title:try-catch
date: 2018-04-24
categories: javascript

---

### 1 try-catch

**throw语句**用来抛出一个用户自定义的异常。当前函数的执行将被停止（`throw`之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个[`catch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)块。如果调用者函数中没有`catch`块，程序将会终止

```javascript
function testTry(){
    try{
        if(true) {
            var e = {code:403,data:null}
            throw e
        }
    }catch(e) {
        throw e;// 捕获到错误之后还可以继续往外抛出错误
    }
}
function catchTry() {
    try{
        testTry()
    }catch(e) {
        console.log(e)
    }
}
catchTry()
```

```javascript
function testTry(){
    var e = {code:403,data:null}
    throw e
};
function catchTry() {
    testTry();// 抛出错误之后，后面的语句不会执行；
    console.log('zhixing ')
}
try{
    catchTry()
} catch(e) {
    console.log(e)
}
```

###2 try-catch错误捕获

2.1 如果程序抛出一个错误，没有进行catch，那么后续的代码将不会执行;

2.2 如果抛出了错误进行了catch,那么后续的代码还是会继续执行;

2.3 如果不想后续代码执行，需要return;

```javascript
function testTry() {
    if(true) {
        throw new Error();
    }
}
function catchTry() {
    testTry();
    console.log('如果抛出的错误没有被catch，那么下面的程序会终止执行') //不会执行
}
catchTry()
```

```javascript
function catchTry() {
    try {
        testTry();
    } catch(e) {
        console.log(e)
    }
    console.log('如果抛出的错误被catch，那么下面的程序会继续执行') // 这里会执行
}
catchTry()
```

```javascript
function testTry() {
    if(true) {
        throw new Error();
    }
}
function catchTry() {
    try {
        testTry();
        // 这里后面的语句都不会执行
    } catch(e) {
        console.log(e);
        return ;
    }
    console.log('如果抛出的错误没有被catch，但是catch中return终止了函数的执行，那么下面的程序会终止执行')
}
catchTry()
```

