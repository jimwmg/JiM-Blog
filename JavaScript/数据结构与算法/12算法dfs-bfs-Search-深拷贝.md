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
        return false;
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

以上两种算法可以实现将一个树状的数据结构，拿到每一个节点，可以将其转化为一个链表或者一维数组，那么如何实现它的逆运算，将一个链表转化为一个树状的数据结构呢？

```javascript
var obj = [{
    id: 1,
    parent: null
  },
  {
    id: 3,
    parent: 2
  },
  {
    id: 2,
    parent: 1
  },
]
function clone(value){
    if(Array.isArray(value)){
        return value.map(clone)
    }else if(typeof value === 'object' && value !== null){
        let ret = {};
        for(let key in value){
            ret[key] = clone(value[key])
        }
        return ret;
    }else{
        return value;
    }
}
function deepCopy(value){
    let retValue = Array.isArray(value) ? [] : {}；
    for(let key in value){
        if(value[key] && typeof value[key] === 'object'){
            retValue[key] = deepCopy(value[key])
        }else{
            retValue[key] = value[key]
        }
    }
    return retValue;
}
function reverseDfs(nodes,parent = null){
    nodes = clone(nodes);
    if(!nodes){
        return 
    }
    if(!Array.isArray(nodes)){
        nodes = [nodes];
    }
    let result = null;//存放返回结果的指针
    let pointer = null;//存放当前数组元素的指针
    while(nodes.length){
        const found = nodes.find((node) => node.parent === parent);
        if(!found){
            return result;
        }
        let delIndex = nodes.indexOf(found);
        nodes.splice(delIndex,1);
        if(parent === null) {
            result = found;
            pointer = found;
            parent = found.id;
        }else{
            pointer.child = found;
            pointer = found;
            parent = found.id;
        }
    }
    return result;
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

vue源码中一个更加优雅的实现

```javascript
function clone(value){
    if(Array.isArray(value)) {
        return value.map(clone);
    }else if(_isObj(value)) {
        const ret = {};
        for(let key in value) {
            ret[key] = clone(value[key])
        }
        return ret;
    }else{
        return value;
    }
}  
```

