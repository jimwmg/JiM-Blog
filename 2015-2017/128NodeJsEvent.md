---
title:  NodeJs Event 
date: 2017-01-15 12:36:00
categories: nodejs
comments : true 
updated : 
layout : 
---

1 events事件

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

2 我们可以输出 events 模块  console.log(events); 查看其所包含内容

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
console.log(emmit.listeners('event1'));
//[ [Function: listener1], [Function: listener2] ]
emmit.emit('event1');
emmit.removeListener('event1',listener1);
emmit.on('event1',listener1);//这个监听事件被移除，不会再次被触发
```

