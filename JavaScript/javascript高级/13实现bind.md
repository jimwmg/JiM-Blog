---
title: 实现原生的 bind 方法
---

### 1 明确 bind 的使用：绑定函数的this指向，同时可以传其他参数；

简单实现

```javascript
function bind(fn,thisArg,...args) {
    if(typeof fn !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    let fBound = function(...innerArgs) {
        return fn.apply(thisArg,args.concat(...innerArgs));
    }
    return fBound;
}
```

```javascript
Function.prototype.myBind = function(thisArg,...args) {
    if(typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    let fToBind = this;
    let fBound = function(...innerArgs){
		return fToBind.apply(thisArg,arg.concat(...innerArgs))
    }
    return fBound;
}
```

```javascript
let obj = {name:'jim'} 
let fBound = f.myBind(obj,1,2);
fBound(3,4);
let fBound1 = bind(f,obj,1,2);
fBound1(3,4)
```

```
控制台输出：
{name:'jim'}
1 2 3 4
{name:'jim'}
1 2 3 4
```

以上的bind实现仅仅是考虑了函数的直接调用而已，并没有考虑  通过 new的调用方式；

### 2 考虑 new的形式 （MDN的实现）

```javascript
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                // this instanceof fNOP === true时,说明返回的fBound被当做new的构造函数调用
                //下面这行代码也是关键：fBound.prototype = new fNOP();
                return fToBind.apply(this instanceof fNOP
                                     ? this
                                     : oThis,
                                     // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        // 维护原型关系
        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype; 
        }
        // 下行的代码使fBound.prototype是fNOP的实例,因此
        // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
        fBound.prototype = new fNOP();

        return fBound;
    };
}
```

