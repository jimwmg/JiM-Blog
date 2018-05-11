---
title:deal-with-result
date: 2018-05-03
categories: javascript

---
###1 同步版本

```javascript
class Blocker{
  // register interceptor
  applyMiddleWares(type,...middleWares){ 
    if(typeof type !== 'string') {
      throw new Error(`${type} need to be string`)
    }
    this[type] = middleWares;
  };
  sendToMiddleWares(type,result,except = []){
    const middleWares = this[type]; //array
    if(!middleWares){
      throw new Error(`The ${type} interceptor is not defined`)
    }
    if(!Array.isArray(except)) {
      throw new Error(`The ${except} must be an Array`)
    }
    middleWares.reduce( async (result,middleWare) => {
      const key = Object.keys(middleWare)[0];
      const cb = Object.values(middleWare)[0];
      if(except.includes(key)){
        return result;
      }
      if(typeof cb !== 'function'){
        throw new Error(`the callback corresponding to ${key} must be a funciton `)
      }
      return cb(result)
    },result)
  };
  clear(type) {
    if(this[type]) {
      this[type] = [];
    }
  }
}  
const blocker = new Blocker();
blocker.applyMiddleWares('req',{
  'url':(result) => {
    // your operation
    return new Promise((resolve,reject) => {
      result.url = 'https://'+result.url;
      resolve(result)
    })
    // result.url = 'https://'+result.url;
    // return result
  },
},{
  'prefix':(result) => {
    result.prefix = '/test';
    return result;
  }
});
const result = {url:'www.test.com'};
blocker.sendToMiddleWares('req',result);
```

### 2 优化后版本 --支持异步

```javascript
class Blocker{
  // register interceptor
  applyMiddleWares(type,middleWares){ 
    if(typeof type !== 'string') {
      throw new Error(`${type} need to be string`)
    }
    const key = Object.keys(middleWares)[0];
    middleWares[key][0] = middleWares[key][0] || null;
    middleWares[key][1] = middleWares[key][1] || null;
    this[type] = this[type] || [];
    this[type].push(middleWares);
    console.log(this[type])
  };
  sendToMiddleWares(type,result,except = []){
    debugger;
    const chain = [];
    const middleWares = this[type]; //array
    if(!chain){
      throw new Error(`The ${type} interceptor is not defined`)
    }
    if(!Array.isArray(except)) {
      throw new Error(`The ${except} must be an Array`)
    }
    let promise = Promise.resolve(result);
    middleWares.forEach(function unshiftInterceptors(middleWare) {
      const key = Object.keys(middleWare)[0];
      if(!except.includes(key)) {
        chain.unshift(middleWare[key][0],middleWare[key][1]);
      }
    });
    while (chain.length) {
      promise = promise.then(chain.shift(),chain.shift());
    }
    return promise;
  };
  clear(type) {
    if(this[type]) {
      this[type] = [];
    }
  }
}  
// export new Blocker();
const blocker = new Blocker();
blocker.applyMiddleWares('req',{
  'url':[(result) => {
    // your operation
    return new Promise((resolve,reject) => {
      result.url = 'https://'+result.url;
      resolve(result)
    })
    // result.url = 'https://'+result.url;
    // return result
  },() => {
    console.log(reject)
  }],
});
blocker.applyMiddleWares('req',{
  'prefix':[(result) => {
    // your operation
    console.log(result)
    return new Promise((resolve,reject) => {
      result.prefix = 'httpsaaa://'+result.url;
      resolve(result)
    })
    // result.url = 'https://'+result.url;
    // return result
  },() => {
    console.log(reject)
  }],
});
blocker.applyMiddleWares('req',{
  'another':[(result) => {
    // your operation
    console.log(result)
    return new Promise((resolve,reject) => {
      result.another = 'httpssss://'+result.url;
      resolve(result)
    })
    // result.url = 'https://'+result.url;
    // return result
  },() => {
    console.log(reject)
  }],
});
const result = {url:'www.test.com'};
blocker.sendToMiddleWares('req',result);
// blocker.sendToMiddleWares('req',result,['another']);
```

