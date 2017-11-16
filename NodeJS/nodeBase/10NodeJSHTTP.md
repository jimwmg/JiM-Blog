---
title:  NodeJHTTP
date: 2016-11-20 12:36:00
categories: nodejs
comments : true 
updated : 
---

### 1 HTTP模块

'http'模块提供两种使用方式：

- 作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应。
- 作为客户端使用时，发起一个HTTP客户端请求，获取服务端响应。

基本使用

* 作为服务端

```javascript
http.createServer(function (request, response) {
    var body = [];

    console.log(request.method);
    console.log(request.headers);

    request.on('data', function (chunk) {
        body.push(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
}).listen(80);

```

* 作为客户端

```javascript
var options = {
        hostname: 'www.example.com',
        port: 80,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
//http.request创建了一个客户端；
var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();

```

### 2 HTTP模块源码粗解

http.js

```javascript
'use strict';

const agent = require('_http_agent');
const { ClientRequest } = require('_http_client');
const common = require('_http_common');
const incoming = require('_http_incoming');
const outgoing = require('_http_outgoing');
const server = require('_http_server');

const { Server } = server;

function createServer(requestListener) {
  return new Server(requestListener);
}

function request(options, cb) {
  return new ClientRequest(options, cb);
}

function get(options, cb) {
  var req = request(options, cb);
  req.end();
  return req;
}

module.exports = {
  _connectionListener: server._connectionListener,
  METHODS: common.methods.slice().sort(),
  STATUS_CODES: server.STATUS_CODES,
  Agent: agent.Agent,
  ClientRequest,
  globalAgent: agent.globalAgent,
  IncomingMessage: incoming.IncomingMessage,
  OutgoingMessage: outgoing.OutgoingMessage,
  Server,
  ServerResponse: server.ServerResponse,
  createServer,
  get,
  request
};
		
```

可以看到，其实主要功能都是_http_server 模块提供的

_http_server.js

```javascript
function Server(requestListener) {
  if (!(this instanceof Server)) return new Server(requestListener);
  //调用net模块的Server方法；
  net.Server.call(this, { allowHalfOpen: true });

  if (requestListener) {
    this.on('request', requestListener);
  }

  // Similar option to this. Too lazy to write my own docs.
  // http://www.squid-cache.org/Doc/config/half_closed_clients/
  // http://wiki.squid-cache.org/SquidFaq/InnerWorkings#What_is_a_half-closed_filedescriptor.3F
  this.httpAllowHalfOpen = false;

  this.on('connection', connectionListener);

  this.timeout = 2 * 60 * 1000;
  this.keepAliveTimeout = 5000;
  this._pendingResponseData = 0;
  this.maxHeadersCount = null;
}
//继承net.Server
util.inherits(Server, net.Server)；

Server.prototype.setTimeout = function setTimeout(msecs, callback) {
  this.timeout = msecs;
  if (callback)
    this.on('timeout', callback);
  return this;
};
```

而_http_server模块的服务功能，主要是net模块的server提供的

net.js

```javascript
//格式化传入listen方法的参数
function normalizeArgs(args) {
  var arr;

  if (args.length === 0) {
    arr = [{}, null];
    arr[normalizedArgsSymbol] = true;
    return arr;
  }

  const arg0 = args[0];
  var options = {};
  if (typeof arg0 === 'object' && arg0 !== null) {
    // (options[...][, cb])
    options = arg0;
  } else if (isPipeName(arg0)) {
    // (path[...][, cb])
    options.path = arg0;
  } else {
    // ([port][, host][...][, cb])
    options.port = arg0;
    if (args.length > 1 && typeof args[1] === 'string') {
      options.host = args[1];
    }
  }

  var cb = args[args.length - 1];
  if (typeof cb !== 'function')
    arr = [options, null];
  else
    arr = [options, cb];

  arr[normalizedArgsSymbol] = true;
  return arr;
}
//net中Server方法
function Server(options, connectionListener) {
  if (!(this instanceof Server))
    return new Server(options, connectionListener);
//初始化事件对象中的一些参数，注意，这个执行并没有使得this获取到EventEmitter中的事件原型上的方法
  EventEmitter.call(this);

  if (typeof options === 'function') {
    connectionListener = options;
    options = {};
    this.on('connection', connectionListener);
  } else if (options == null || typeof options === 'object') {
    options = options || {};

    if (typeof connectionListener === 'function') {
      this.on('connection', connectionListener);
    }
  } else {
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE',
                               'options',
                               'object',
                               options);
  }

  this._connections = 0;

  Object.defineProperty(this, 'connections', {
    get: internalUtil.deprecate(() => {

      if (this._usingWorkers) {
        return null;
      }
      return this._connections;
    }, 'Server.connections property is deprecated. ' +
       'Use Server.getConnections method instead.', 'DEP0020'),
    set: internalUtil.deprecate((val) => (this._connections = val),
                                'Server.connections property is deprecated.',
                                'DEP0020'),
    configurable: true, enumerable: false
  });

  this[async_id_symbol] = -1;
  this._handle = null;
  this._usingWorkers = false;
  this._workers = [];
  this._unref = false;

  this.allowHalfOpen = options.allowHalfOpen || false;
  this.pauseOnConnect = !!options.pauseOnConnect;
}
//这里才使得Server的实例对象可以获取到EventEmitter类中prototype上的所有事件相关的方法；
util.inherits(Server, EventEmitter);


function toNumber(x) { return (x = Number(x)) >= 0 ? x : false; }

// Returns handle if it can be created, or error code if it can't
function createServerHandle(address, port, addressType, fd) {
  var err = 0;
  // assign handle in listen, and clean up if bind or listen fails
  var handle;

  var isTCP = false;
  if (typeof fd === 'number' && fd >= 0) {
    try {
      handle = createHandle(fd);
    } catch (e) {
      // Not a fd we can listen on.  This will trigger an error.
      debug('listen invalid fd=%d:', fd, e.message);
      return UV_EINVAL;
    }
    handle.open(fd);
    handle.readable = true;
    handle.writable = true;
    assert(!address && !port);
  } else if (port === -1 && addressType === -1) {
    handle = new Pipe();
    if (process.platform === 'win32') {
      var instances = parseInt(process.env.NODE_PENDING_PIPE_INSTANCES);
      if (!isNaN(instances)) {
        handle.setPendingInstances(instances);
      }
    }
  } else {
    handle = new TCP();
    isTCP = true;
  }

  if (address || port || isTCP) {
    debug('bind to', address || 'any');
    if (!address) {
      // Try binding to ipv6 first
      err = handle.bind6('::', port);
      if (err) {
        handle.close();
        // Fallback to ipv4
        return createServerHandle('0.0.0.0', port);
      }
    } else if (addressType === 6) {
      err = handle.bind6(address, port);
    } else {
      err = handle.bind(address, port);
    }
  }

  if (err) {
    handle.close();
    return err;
  }

  return handle;
}

function setupListenHandle(address, port, addressType, backlog, fd) {
  debug('setupListenHandle', address, port, addressType, backlog, fd);

  // If there is not yet a handle, we need to create one and bind.
  // In the case of a server sent via IPC, we don't need to do this.
  if (this._handle) {
    debug('setupListenHandle: have a handle already');
  } else {
    debug('setupListenHandle: create a handle');

    var rval = null;

    // Try to bind to the unspecified IPv6 address, see if IPv6 is available
    if (!address && typeof fd !== 'number') {
      rval = createServerHandle('::', port, 6, fd);

      if (typeof rval === 'number') {
        rval = null;
        address = '0.0.0.0';
        addressType = 4;
      } else {
        address = '::';
        addressType = 6;
      }
    }

    if (rval === null)
      rval = createServerHandle(address, port, addressType, fd);

    if (typeof rval === 'number') {
      var error = exceptionWithHostPort(rval, 'listen', address, port);
      process.nextTick(emitErrorNT, this, error);
      return;
    }
    this._handle = rval;
  }

  this[async_id_symbol] = getNewAsyncId(this._handle);
  this._handle.onconnection = onconnection;
  this._handle.owner = this;

  // Use a backlog of 512 entries. We pass 511 to the listen() call because
  // the kernel does: backlogsize = roundup_pow_of_two(backlogsize + 1);
  // which will thus give us a backlog of 512 entries.
  var err = this._handle.listen(backlog || 511);

  if (err) {
    var ex = exceptionWithHostPort(err, 'listen', address, port);
    this._handle.close();
    this._handle = null;
    nextTick(this[async_id_symbol], emitErrorNT, this, ex);
    return;
  }

  // generate connection key, this should be unique to the connection
  this._connectionKey = addressType + ':' + address + ':' + port;

  // unref the handle if the server was unref'ed prior to listening
  if (this._unref)
    this.unref();

  nextTick(this[async_id_symbol], emitListeningNT, this);
}

Server.prototype._listen2 = setupListenHandle;  // legacy alias

function emitErrorNT(self, err) {
  self.emit('error', err);
}


function emitListeningNT(self) {
  // ensure handle hasn't closed
  if (self._handle)
    self.emit('listening');
}


function listenInCluster(server, address, port, addressType,
                         backlog, fd, exclusive) {
  exclusive = !!exclusive;

  if (cluster === null) cluster = require('cluster');

  if (cluster.isMaster || exclusive) {
    // Will create a new handle
    // _listen2 sets up the listened handle, it is still named like this
    // to avoid breaking code that wraps this method
    server._listen2(address, port, addressType, backlog, fd);
    return;
  }

  const serverQuery = {
    address: address,
    port: port,
    addressType: addressType,
    fd: fd,
    flags: 0
  };

  // Get the master's server handle, and listen on it
  cluster._getServer(server, serverQuery, listenOnMasterHandle);

  function listenOnMasterHandle(err, handle) {
    err = checkBindError(err, port, handle);

    if (err) {
      var ex = exceptionWithHostPort(err, 'bind', address, port);
      return server.emit('error', ex);
    }

    // Reuse master's server handle
    server._handle = handle;
    // _listen2 sets up the listened handle, it is still named like this
    // to avoid breaking code that wraps this method
    server._listen2(address, port, addressType, backlog, fd);
  }
}
//为 connections 启动一个 server 监听. 一个 net.Server 可以是一个 TCP 或者 一个 IPC server，这取决于它监听什么。
Server.prototype.listen = function(...args) {
  var normalized = normalizeArgs(args);
  var options = normalized[0];
  var cb = normalized[1];

  if (this._handle) {
    throw new errors.Error('ERR_SERVER_ALREADY_LISTEN');
  }

  var hasCallback = (cb !== null);
  if (hasCallback) {
    this.once('listening', cb);
  }
  var backlogFromArgs =
    // (handle, backlog) or (path, backlog) or (port, backlog)
    toNumber(args.length > 1 && args[1]) ||
    toNumber(args.length > 2 && args[2]);  // (port, host, backlog)

  options = options._handle || options.handle || options;
  // (handle[, backlog][, cb]) where handle is an object with a handle
  if (options instanceof TCP) {
    this._handle = options;
    this[async_id_symbol] = this._handle.getAsyncId();
    listenInCluster(this, null, -1, -1, backlogFromArgs);
    return this;
  }
  // (handle[, backlog][, cb]) where handle is an object with a fd
  if (typeof options.fd === 'number' && options.fd >= 0) {
    listenInCluster(this, null, null, null, backlogFromArgs, options.fd);
    return this;
  }

  // ([port][, host][, backlog][, cb]) where port is omitted,
  // that is, listen(), listen(null), listen(cb), or listen(null, cb)
  // or (options[, cb]) where options.port is explicitly set as undefined or
  // null, bind to an arbitrary unused port
  if (args.length === 0 || typeof args[0] === 'function' ||
      (typeof options.port === 'undefined' && 'port' in options) ||
      options.port === null) {
    options.port = 0;
  }
  // ([port][, host][, backlog][, cb]) where port is specified
  // or (options[, cb]) where options.port is specified
  // or if options.port is normalized as 0 before
  var backlog;
  if (typeof options.port === 'number' || typeof options.port === 'string') {
    if (!isLegalPort(options.port)) {
      throw new errors.RangeError('ERR_SOCKET_BAD_PORT', options.port);
    }
    backlog = options.backlog || backlogFromArgs;
    // start TCP server listening on host:port
    if (options.host) {
      lookupAndListen(this, options.port | 0, options.host, backlog,
                      options.exclusive);
    } else { // Undefined host, listens on unspecified address
      // Default addressType 4 will be used to search for master server
      listenInCluster(this, null, options.port | 0, 4,
                      backlog, undefined, options.exclusive);
    }
    return this;
  }

  // (path[, backlog][, cb]) or (options[, cb])
  // where path or options.path is a UNIX domain socket or Windows pipe
  if (options.path && isPipeName(options.path)) {
    var pipeName = this._pipeName = options.path;
    backlog = options.backlog || backlogFromArgs;
    listenInCluster(this, pipeName, -1, -1,
                    backlog, undefined, options.exclusive);
    return this;
  }

  throw new errors.Error('ERR_INVALID_OPT_VALUE',
                         'options',
                         util.inspect(options));
};

```

### 3 我们再来看下node源码新建一个服务之后处理进程到底是如何的

（哎，这个习惯不知道是好是坏，对于底层源码过于在意，其实耗费了不少时间和精力）

```javascript
var http = require('http');

http.createServer(function(req, res) {

  // 主页
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the homepage!");
  }

  // About页面
  else if (req.url == "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the about page!");
  }

  // 404错误
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
  }

}).listen(8080, "localhost");
```

step1 ： createServer会执行到_http_server中的Server方法，看下node官方文档上对于该函数的描述[createServer](http://nodejs.cn/api/http.html#http_http_createserver_requestlistener)

返回一个http-server实例；

注意：`requestListener` 是一个函数，会被自动添加到 [`'request'`](http://nodejs.cn/api/http.html#http_event_request) 事件;可以去_http_server.js中看到

```
this.on('request', requestListener);   绑定了request事件；
```

每次接收到一个请求时触发。 

step2 : 接下来执行http-server实例上的 listene函数：可以看net.js中的listener函数，node官方文档中对于该函数的描述[listener](http://nodejs.cn/api/net.html#net_ipc_support)

为 connections 启动一个 server 监听. 一个 `net.Server` 可以是一个 TCP 或者 一个 [IPC](http://nodejs.cn/api/net.html#net_ipc_support) server，这取决于它监听什么;

step3 : listene函数会根据传入的参数，来建立TCP或者IPC这样一个服务；触发step4的函数；

step4 : 注意_http_server.js中绑定过的事件

```
this.on('connection', connectionListener); 和request事件一起绑定的；
```

当一个新的 TCP 流被建立时触发该事件，参数是`socket` ，一个 [`net.Socket`](http://nodejs.cn/api/net.html#net_class_net_socket) 类型的对象。

该事件的主要作用可以理解为给客户端和服务端有数据交互的注册了一个监听事件，当服务端和客户端交互的时候，会执行

```
server.emit('request', req, res);
```

触发之前注册的requestListener事件，传入req,res参数

step5：req是一个如下的对象

- `url`：发出请求的网址。
- `method`：HTTP请求的方法。
- `headers`：HTTP请求的所有HTTP头信息。

res是一个在_http_serve.js 中声明的ServerResponse 类的实例

```javascript
function ServerResponse(req) {
  OutgoingMessage.call(this);

  if (req.method === 'HEAD') this._hasBody = false;

  this.sendDate = true;
  this._sent100 = false;
  this._expect_continue = false;

  if (req.httpVersionMajor < 1 || req.httpVersionMinor < 1) {
    this.useChunkedEncodingByDefault = chunkExpression.test(req.headers.te);
    this.shouldKeepAlive = false;
  }
}
util.inherits(ServerResponse, OutgoingMessage);

```

