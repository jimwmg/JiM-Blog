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
        throw e
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

