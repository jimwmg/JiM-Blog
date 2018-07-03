---
title: 函数式编程
---

### 1 实现compose函数

```javascript
function f1(arg) {
    console.log('11',arg)
}
function f2(arg) {
    console.log('22',arg)

    return arg
}
function f3(arg) {
    console.log('33',arg);
    return arg
}
// 实现compose函数
function myCompose(...funcs) {
    if(funcs.length === 0) {
        return args => args
    }
    if(funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce((a,b) => {
        return (...args) => {
            return a(b(...args));
        } 
    })
}
function myComposeRight(funcs,...args) {
    return funcs.reduceRight((args,func) => {
        return func(args)
    },args)
}
myComposeRight([f1,f2,f3],3,2)

// myCompose()(3)
// myCompose(f1,f2,f3)(3)
```

