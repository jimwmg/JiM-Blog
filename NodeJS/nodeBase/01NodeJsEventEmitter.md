---
title:  NodeJs Event 
date: 2017-01-15 12:36:00
categories: nodejs
comments : true 
updated : 
layout : 
---

### 1 events事件

```javascript
//引入events模块并创建eventEmitter对象
var events = require('events');
var eventEmitter = new events.EventEmitter(); 
```

```javascript
//声明事件函数
var eventNameHandle = function eventName(){}
```

```javascript
//绑定事件处理程序，并触发执行
eventEmitter.on('eventName',eventNameHandle);
eventEmitter.emit('eventName');
```

### 2 我们可以输出 events 模块  console.log(events); 查看其所包含内容

events模块只提供了一个对象: events.EventEmitter .该对象的核心就是事件的触发和事件的监听的整体封装；

events.EventEmitter 对象提供了多个属性，比如on可以绑定事件 emit用于触发事件,当事件触发的时候，注册到这个事件的监听器会被依次调用，事件参数作为回调函数参数传递；

on(event,listener)   emit(event,arg1,arg2,····)

```javascript
var events = require('events');
var eventsEmitter = new events.EventEmitter();
eventsEmitter.on("eventName",function(arg1,arg2){
    console.log("listener1",arg1,arg2);
});
eventsEmitter.on("eventName",function(arg1,arg2){
    console.log("listener2",arg1,arg2);
});
//以下给同一个事件注册了两个监听器
eventsEmitter.on("anotherName",function(arg1,arg2){
    console.log("listener3",arg1,arg2);
});
eventsEmitter.emit('eventName','argone','argtwo');
//eventsEmitter.emit('anothertName','argone','argtwo');
```

once(event,listener)  为指定事件注册一个单次监听器，即监听器最多只能触发一次，触发之后马上解绑

```javascript
var events = require('events');
var eventsEmitter = new events.EventEmitter();
eventsEmitter.once("name1",function(arg1,arg2){
    console.log("listener4",arg1,arg2);
});
eventsEmitter.emit('name1','argone','argtwo');
eventsEmitter.emit('name1','argone','argtwo');
//在node终端执行的时候，即使emit了两次，该事件监听器也只执行一次，而on绑定的事件可以多次执行
```

addListener(event,listener) 给指定事件添加一个事件监听器，到监听器数组的尾部

removeListener(event,listener) 删除指定事件的listener，此操作会影响处于被删监听器之后的那些监听器的索引

listenerCount(emmit,listener)  emmit是 new events.EventEmitter()对象，所有的事件都是通过该对象进行绑定，触发等操作。该方法可以返回指定事件的监听器数量

listeners(event)  该方法返回某个事件上的监听器所组成的数组

```javascript
var events = require('events');
var emmit = new events.EventEmitter();
function listener1 (){
    console.log("this is listernr1");
}

function listener2(){
    console.log("this is listener2");
}
emmit.on('event1',listener1);
emmit.on('event1',listener2);//给event1注册两个监听器，listenerConut可以得到该事件的监听器数量
//let count = emmit.listenerCount(emmit,'event1');
let count = require('events').EventEmitter.listenerCount(emmit,'event1');
console.log(count);//2
console.log(emmit.listeners('event1'));//返回指定监听器数组，如果没有返回空数组
//[ [Function: listener1], [Function: listener2] ]
emmit.emit('event1');
emmit.removeListener('event1',listener1);
emmit.on('event1',listener1);//这个监听事件被移除，不会再次被触发
```

### 3 node 源码   [API使用文档](http://nodejs.cn/api/events.html)

```javascript
function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
//这里定义了每一个事件课最多添加的监听器个数；
var defaultMaxListeners = 10;

var errors;
function lazyErrors() {
  if (errors === undefined)
    errors = require('internal/errors');
  return errors;
}
//这里定义EventEmitter函数的一个静态属性；
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    // check whether the input is a positive number (whose value is zero or
    // greater and not a NaN).
    if (typeof arg !== 'number' || arg < 0 || arg !== arg) {
      const errors = lazyErrors();
      throw new errors.TypeError('ERR_OUT_OF_RANGE', 'defaultMaxListeners');
    }
    defaultMaxListeners = arg;
  }
});
//当 new EventEmitter的时候，会执行init函数；
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    domain = domain || require('domain');
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    //第一次执行的时候 给EventEmitter的实例对象的  _events = { } 设置值
    this._events = Object.create(null);
    this._eventsCount = 0;
  }
//这里给EventEmitter实例对象添加一个属性 _maxListeners 
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n)) {
    const errors = lazyErrors();
    throw new errors.TypeError('ERR_OUT_OF_RANGE', 'n');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}
//如果事件type有监听器，则返回true,否则返回false；如果有注册的监听器执行，那么返回true,代表监听器执行了，否则返回false,代表没有注册监听器；
EventEmitter.prototype.emit = function emit(type, ...args) {
  let doError = (type === 'error');
//这里获取到注册的事件对象，里面存放着不同的type注册的监听器数组 event[type];
  const events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  const domain = this.domain;

  // If there is no 'error' event listener then throw.
  //这个if是错误处理，可以不看；
  if (doError) {
    let er;
    if (args.length > 0)
      er = args[0];
    if (domain !== null && domain !== undefined) {
      if (!er) {
        const errors = lazyErrors();
        er = new errors.Error('ERR_UNHANDLED_ERROR');
      }
      if (typeof er === 'object' && er !== null) {
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
      }
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      const errors = lazyErrors();
      const err = new errors.Error('ERR_UNHANDLED_ERROR', er);
      err.context = er;
      throw err;
    }
    return false;
  }
//得到对应的events[type] 
  const handler = events[type];
//如果type事件没有注册监听器，则返回false ；
  if (handler === undefined)
    return false;

  let needDomainExit = false;
  if (domain !== null && domain !== undefined && this !== process) {
    domain.enter();
    needDomainExit = true;
  }
//这里isFn,标识handler是一个监听器函数还是一个监听器数组；如果是一个函数，则直接执行，如果是一个数组，则从头至尾依次执行数组中对应的所有的监听器函数；
  const isFn = typeof handler === 'function';
  switch (args.length) {
    case 0:
      emitNone(handler, isFn, this);
      break;
    case 1:
      emitOne(handler, isFn, this, args[0]);
      break;
    case 2:
      emitTwo(handler, isFn, this, args[0], args[1]);
      break;
    case 3:
      emitThree(handler, isFn, this, args[0], args[1], args[2]);
      break;
    default:
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();
//如果type事件注册了监听器，则返回true；
  return true;
};
//当通过on，给实例对象添加事件的时候，prepend的值为false ;
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    const errors = lazyErrors();
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener', 'function');
  }
//由于在init EventEmitter的时候，会初始化为_events = { } ；所以这里执行else
  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    //existing的值可能有多重情况，每次调用on或者prependListener的时候，对于不同的type值不一样，对于相同的type值也可能不一样；
    existing = events[type];
  }
//第一次调用on 方法 ；existing是未定义的，所以会是events[type] = listener；
  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    //这里
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      //这里当我们第二次调用on方法的时候，并且添加同一种type的监听器的时候；
      //event[type] = [existing,listener] 或者[listener, existing] ,此时event[type]是一个数组；
      //prepend表示是向event[type]数组尾部添加还是数组首位添加listener
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
      //下面两个分别对应prependListener和on接口在
    } else if (prepend) {
      //prependListener接口是向
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        // No error code for this since it is a Warning
        const w = new Error('Possible EventEmitter memory leak detected. ' +
                            `${existing.length} ${String(type)} listeners ` +
                            'added. Use emitter.setMaxListeners() to ' +
                            'increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        process.emitWarning(w);
      }
    }
  }
//可以链式调用；
  return target;
}
//添加事件的接口可以链式调用；
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
//events事件的 on 接口和 addListener接口是一样的，这个给type事件对应的数组尾部添加一个事件监听器
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
//events事件的 prependListener 接口，这个是给type事件对应的数组的首部添加一个事件监听器；
EventEmitter.prototype.prependListener =
  function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
                                  arguments[2]);
      default:
        this.listener.apply(this.target, arguments);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target, type, listener };
  //这里wraped函数就是onceWrapper
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  //这里当通过emit第一次触发通过once注册的监听器wrapped函数的时候，会首先在实例对象上移除wrapped监听器；然后执行监听器；state.fired 设置为true；
  //如果在次想通过emit触发type事件的监听器，因为对应的type的listener wrapped函数已经不存在，所以再次emit 会return false;
  state.wrapFn = wrapped;
  return wrapped;
}
//为指定的事件注册一个单次监听器，即改监听器最多会触发一次，触发后立即解除；
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    const errors = lazyErrors();
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener', 'function');
  }
  //注意这里，通过on注册的事件监听器是 _onceWrap函数的返回值；即wrapped;
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
  function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    const errors = lazyErrors();
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener',
                               'function');
  }
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
  function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    const errors = lazyErrors();
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener',
                               'function');
  }

  events = this._events;
  if (events === undefined)
    return this;

  list = events[type];
  if (list === undefined)
    return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0)
      //如果events[type] 是一个函数，那么就直接使其等于一个空对象；
      this._events = Object.create(null);
    else {
      delete events[type];
      if (events.removeListener)
        this.emit('removeListener', type, list.listener || listener);
    }
    //如果events[type]是一个数组；
  } else if (typeof list !== 'function') {
    position = -1;
	//首先通过for循环便利events[type],找到对应的listener的位置；
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
	//position = -1 ，表示没找到要删除的listener,则直接返回实例；
    if (position < 0)
      return this;
//如果找到了0，则表示该listener在数组的首位，从event[type]数组中通过shift方法删除数组首位；
    if (position === 0)
      list.shift();
    else {
      if (spliceOne === undefined)
        spliceOne = require('internal/util').spliceOne;
      spliceOne(list, position);
    }

    if (list.length === 1)
      events[type] = list[0];

    if (events.removeListener !== undefined)
      this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners =
  function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined)
    return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0)
        this._events = Object.create(null);
      else
        delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

EventEmitter.prototype.listeners = function listeners(type) {
  const events = this._events;

  if (events === undefined)
    return [];

  const evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return [evlistener.listener || evlistener];

  return unwrapListeners(evlistener);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  const events = this._events;

  if (events !== undefined) {
    const evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  const ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
```

### 4 看其他框架源码另外一种事件实现机制

```javascript
function _eventable = function(obj, mode) {
		
		if (mode == "clear") {
			
			obj.detachAllEvents();
			
			obj.dhxevs = null;
			
			obj.attachEvent = null;
			obj.detachEvent = null;
			obj.checkEvent = null;
			obj.callEvent = null;
			obj.detachAllEvents = null;
			
			obj = null;
			
			return;
			
		}
		
		obj.dhxevs = { data: {} };
		
		obj.attachEvent = function(name, func) {
			name = String(name).toLowerCase();
			if (!this.dhxevs.data[name]) this.dhxevs.data[name] = {};
          //这里就是生成一个随机数；
			var eventId = window.dhx4.newId();
			this.dhxevs.data[name][eventId] = func;
			return eventId;
		}
		
		obj.detachEvent = function(eventId) {
			for (var a in this.dhxevs.data) {
				var k = 0;
				for (var b in this.dhxevs.data[a]) {
					if (b == eventId) {
						this.dhxevs.data[a][b] = null;
						delete this.dhxevs.data[a][b];
					} else {
						k++;
					}
				}
				if (k == 0) {
					this.dhxevs.data[a] = null;
					delete this.dhxevs.data[a];
				}
			}
		}
		
		obj.checkEvent = function(name) {
			name = String(name).toLowerCase();
			return (this.dhxevs.data[name] != null);
		}
		
		obj.callEvent = function(name, params) {
			name = String(name).toLowerCase();
			if (this.dhxevs.data[name] == null) return true;
			var r = true;
			for (var a in this.dhxevs.data[name]) {
              //这里巧用逻辑 && 的短路运算
				r = this.dhxevs.data[name][a].apply(this, params) && r;
			}
			return r;
		}
		
		obj.detachAllEvents = function() {
			for (var a in this.dhxevs.data) {
				for (var b in this.dhxevs.data[a]) {
					this.dhxevs.data[a][b] = null;
					delete this.dhxevs.data[a][b];
				}
				this.dhxevs.data[a] = null;
				delete this.dhxevs.data[a];
			}
		}
		
		obj = null;
	};
	
```

这里传入一个对象obj,使得obj对象有可以添加事件监听器，执行事件监听器等的能力；

[events.js](https://github.com/jimwmg/node/tree/master/lib)

