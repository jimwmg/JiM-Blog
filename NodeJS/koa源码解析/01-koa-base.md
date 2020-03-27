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

[koa-阮一峰](http://www.ruanyifeng.com/blog/2017/08/koa.html)

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

- 理解的核心点就是 就是通过 use 增加的中间件如何通过 `koa-compose`调用
- koa服务接受的每一个请求，都会通过所有的中间件，通过use注册的中间件可以是同步的，也可以是异步的
- 所有的中间件必须调用 next 才会接着执行下一个中间件，中间件的执行顺序就是注册的顺序；



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
    const fn = compose(this.middleware); // ==> fnMiddleware
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
    1 全部的中间件都可以处理 ctx;
    2 处理之后的 ctx，是通过 handleResponse 这里直接访问的
    
    */
    return  fnMiddleware(ctx).then(handleResponse).catch(handleError);
  }

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
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
  //这个函数就是 koa 中 fnMiddleware
  return function (context, next) { //fnMiddleware(ctx).then(handleResponse).catch(handleError);
    // last called middleware #
    let index = -1
    return dispatch(0);
    /*这里结合上面： fnMiddleware(ctx) 这个promise的结果就是 dispatch 函数的返回值，往下看，可以发现，该函数的返回值是 Promise.resolve(fn(context, dispatch.bind(null, i + 1))); 也就是说和注册的中间件返回值是一致的；常用的形式是 中间件是一个 async 函数，或者普通函数
    如果 fn 是普通函数，那么Promise.resolve(fn(context, dispatch.bind(null, i + 1))) 返回的promise的状态就是reslove了的；
    如果fn是async 函数，那么Promise.resolve(fn(context, dispatch.bind(null, i + 1))) 返回值的状态和async函数执行后的返回值保持一致
    */
    function dispatch (i) {
      //如果在一个中间件中使用了next两次，那么就会报出来这个错误；
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve();
      //如果所有的中间件都执行完完毕了，或者说压根没有中间件，那么就直接 返回一个 resolve 的 promise
      try {
        //这个 dispatch 就是 use 注册的中间件的第二个参数
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

### 4 中间件返回值的状态 

- 如果 fn 是普通函数，那么`Promise.resolve(fn(context, dispatch.bind(null, i + 1))) `返回的promise的状态就是reslove了的；
-  如果fn是async 函数，那么`Promise.resolve(fn(context, dispatch.bind(null, i + 1))) `返回值的状态和async函数执行后的返回值保持一致
- 无论 fn 这个中间件是什么样的函数，都必须调用 next 函数，才会进入下一个中间件，否则会根据这个中间件的返回 promise 状态决定 `fnMiddleware(ctx).then(handleResponse).catch(handleError);`的执行

首先看下 async 函数执行之后的返回值 promsie 状态

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

比如中间件是 async 函数的

```javascript
const Koa = require('koa')
const app = new Koa();
/**
 * 1 必须调用next才会进入下一个中间件执行；
 * 2 任何一个中间件如果有return,那么fnMiddleware(ctx) 返回的promise就会根据这个return的值进行状态变化
 */
app.use(async function (ctx, next) {
  console.log('async0 start');
  // return 1;
  // await next();
  await next();
  console.log('async0 end');
});

app.use(async function (ctx, next) {
  console.log('async1 start');
  ctx.body = 'two';
  // await next();
  console.log('async1 end');
  //这里可以测试reject状态
  return Promise.reject()

});

app.use(async function (ctx, next) {
  console.log('async2 start');
  // await next();
  console.log('async2 end');
});

app.listen(8000)
console.log('server is running localhost:8000')
```

又比如中间件是普通函数的

```javascript
const Koa = require('koa');
const KoaRouter = require('koa-router');
const app = new Koa();
/**
 * 1 必须调用next才会进入下一个中间件执行；
 * 2 任何一个中间件如果有return,那么 fnMiddleware(ctx) 返回的promise就会根据这个return的值进行状态变化
 */
app.use((ctx,next) => {
  console.log(1)
  next()
});
app.use((ctx,next) => {
  console.log(2)
})
app.listen(3000)
console.log('server is running localhost:8080')
```

### 5 处理 response

在`koa`的源码中，可以看到，每次请求过来都会执行这个函数，上面分析了`fnMiddleware(ctx)`返回的promise状态的问题，接下来看下这个promsie状态 reslove 和 reject 两种状态下的执行

```javascript
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

`resolve`状态下

```javascript
const handleResponse = () => respond(ctx);
```

```javascript
//可以看到这里，最终仍然是调用 http 模块 res.end(body) 将中间件处理过程中的 ctx.body 作为输出内容返回给前端页面
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

`reject`状态下,执行这个函数

```javascript
onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
```

