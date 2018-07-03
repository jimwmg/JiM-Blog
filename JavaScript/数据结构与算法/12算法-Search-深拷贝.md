---
title: 深度搜索和广度搜索
---

### 1 深度优先算法

```javascript
function dfs(nodes,key,cb,parent=null,args=null){
    //对于入参的判断，node必须存在且是一个数组，如果不是，进行矫正
    //key 必须是一个字符串，不能是函数之类的
    // cb必须是一个函数
    if(!nodes){
        return false;
    }
    if(typeof cb != 'function') {
        return fasle;
    }
    if(!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    nodes.forEach((node) => {
        cb(node,parent,args)
        dfs(node[key],key,cb,node,args)
    })
}
```

### 2 广度优先算法

```javascript
function bfs(nodes,cb,childKey,parent = null) {
    if(!nodes){
        return false;
    }
    if(typeof cb != 'function') {
        return fasle;
    }
    if(!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    const stack = [];
    nodes.forEach((node) => {
        stack.push(node);
    })
    while(stack.length > 0) {
        let node = stack.shift();
        cb(node);
        stack.push(...(node[childKey] || []));
    }
}
```

### 3 深拷贝实现 `JSON.parse(JSON.stringify())`

```javascript
//实现一个深拷贝
let obj = {name:'jhon',age:'12',address:2}
let obj1 = {address:{count:3}}
function _isObj(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
} 
function _copy(target,...objs){
    objs.forEach((obj) => {
        if(!_isObj(obj)){
            throw new Error('必须传入对象');
        }
    });
    return objs.reduce((target,current) => {
        for(let key in current) {
            if(_isObj(current[key])) {
                target[key] = {};
                _copy(target[key],current[key])
            }else{
                target[key] = current[key];
            }
        }
        return target;
    },target)
}
console.log(_copy({},obj,obj1))
```

