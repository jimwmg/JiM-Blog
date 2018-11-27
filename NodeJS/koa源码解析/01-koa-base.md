---
title:koa-base
---

### 1 koa基本学习资料汇总

[github-koa](https://github.com/search?q=koa)

[koa-教程](https://chenshenhai.github.io/koa2-note/note/start/quick.html)

[nodemon-服务端开发重启node应用程序](https://github.com/remy/nodemon#nodemon)

[koa中文文档](https://github.com/demopark/koa-docs-Zh-CN/blob/master/guide.md#debugging-koa)

[koa-demo](https://github.com/koajs/workshop)

[koa-github](https://github.com/koajs)

### 2 基础

```javascript
const Koa = require('koa');
const app = new Koa();
app.use(async function (ctx, next) {
  console.log('async0 start');
  // await next();
  console.log('async0 end');
});

app.use(async function (ctx, next) {
  console.log('async1 start');
  ctx.body = 'two';
  await next();
  console.log('async1 end');
});

app.use(async function (ctx, next) {
  console.log('async2 start');
  // await next();
  console.log('async2 end');
});

app.listen(3000)
console.log('server is running localhost:3000')
```

ctx:

```javascript
var ctx = {
  request:{
    method: 'GET',
    url: '/',
    header:{
      host: 'localhost:3000',
      connection: 'keep-alive',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9',
      cookie: 'didifid=20180810105414318GCWUD3M; omgtrc=8223159221858344862; fingerprint=1701143209'
    }
  },
  response: { 
    status: 404, 
    message: 'Not Found', 
    header: {} 
  },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>'
}
```

next

```javascript
function() {....}
```

![middleware.gif](https://github.com/demopark/koa-docs-Zh-CN/blob/master/middleware.gif?raw=true)

对应的简单模拟如下

```javascript
/*koa的中间件执行的模拟如下：
await 会跳出当前async函数的执行，等await执行完毕之后，在回到原来的async函数中继续执行；

*/
const content = {};
async function middleWare0(ctx){
  //do something to operate ctx
  console.log('async0-start');
  ctx.body = "this is body0";
  await middleWare1(ctx);
  console.log('async0 end');

}
async function middleWare1(ctx){
   //do something to operate ctx
  console.log('async1-start')
  ctx.body = ctx.body + '  this is body 1'
  await middleWare2();
  console.log('async1 end');
}
async function middleWare2(ctx){
   //do something to operate ctx
  console.log('async2-start')
  console.log('async2 end')
}
function response(ctx){
  //对中间件操作过后的响应再次进行处理；
  console.log('finalCtx',ctx)
}
function onerror(ctx){
  //错误处理
  console.log('error',ctx)
}
middleWare0(content).then(() => response(content)).catch((content) => onerror())
```

bind函数模拟

```javascript
//不考虑new的形式
Function.prototype.myBind = function(thisArg,...args){
  if(typeof this !== "Function"){
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let fToBind = this;
  return function(...innerArgs){
    return fToBind.apply(thisArg,args.concat(innerArgs));
  }
}

function dispatch(i){
  console.log(i)
}

let dispatchBound = dispatch.bind(null,5);

dispatchBound('otherArgs');
```

### 3 koa源码解析

目录结构

```javascript
- application.js
- context.js
- request.js
- response.js
```

#### 3.1 `application.js` - http服务的实现

在node的http模块中启动一个简单的服务代码如下：

```javascript	
let http = require('http');
let server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world');
});
server.listen(3000, () => {    
    console.log('listenning on 3000');
});
```

那么koa中：

```javascript
let Koa = require('koa');
let app = new Koa();
app.use((ctx, next) => {
    ctx.body = 'hello world'
});
app.listen(3000, () => {
    console.log('listening on 3000');
});
```

```javascript
-application.js
-koa-compose.js
```

 `application.js`伪代码：

```javascript

'use strict';

/**
 * Module dependencies.
 */


const compose = require('./koa-compose');
const http = require('http');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

module.exports = class Application  {
  constructor() {
    this.middleware = [];
    this.context = {};
    this.request = {};
    this.response = {};
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    
    return server.listen(...args);
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  callback() {
    const fn = compose(this.middleware);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const handleError = err => onerror(err);
    const handleResponse = () => respond(ctx);
    /*重点是 fnMiddleware（ctx) 这个函数返回的promise的状态的变化，这个函数返回的状态的变化，关键是compose函数中执行结果决定的；
    我这里总结以下情况：
    1 全部的中间件
    
    */

    return fnMiddleware(ctx).then(handleResponse).catch(handleError);
  }

  createContext(req, res) {
    const context = Object.create(this.context);//{}
    context.req = req;
    context.res = res;
    return context;
  }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  ctx.res.end(`this is my body: ==> ${ctx.body}`)
  console.log('handleResponse');
}
function onerror(err){
  console.log('handlError');
}

```

`koa-compose.js`

```javascript
'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      //如果在一个中间件中使用了next两次，那么就会保这个错误；
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve();//如果所有的中间件都执行完完毕了，那么就resolve这个promise
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

