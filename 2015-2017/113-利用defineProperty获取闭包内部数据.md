---
title: 利用defineProperty获取闭包内部数据  
date: 2016-11-30 12:36:00
categories: javascript
tags: object
comments : true 
updated : 
layout : 
---

### 利用defineProperty获取闭包内部数据

1 defineProperty的使用方法:

```javascript
Object.defineProperty(obj,property,{
        value:"属性值",
        writable:false,//控制属性是否可以重新赋值
        configurable:false,//控制属性是否可以被删除
        enumerable:false,//是否可枚举
        get:function(){
            return this.propertyValue;
        },
        set:function(value){      
            this.propertyValue = value;
        }
    })
```

2 利用给定接口获取闭包内部数据

```javascript
var o = (function() {
    var person = {
        name: 'Vincent',
        age: 24,
    };
    return {
        run: function(k) {
            return person[k];
        },
    }
}());
//在不改变上面的代码情况下， 怎么得到原有的 person 对象？
//解决：
Object.defineProperty(Object.prototype, 'self', 
    {
        get: function() {
            return this;
        },
        configurable: true
    });
o.run('self'); // 输出 person
```

